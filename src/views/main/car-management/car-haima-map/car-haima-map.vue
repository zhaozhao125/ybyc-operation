<template>
  <div id="car-statue-map">
    <div class="search-content">
      <div>
        <search-select class="search-select" v-model="params.cityId" type="city" placeholder="请选择运营城市" :authedCities='true' :clearable='false'></search-select>
        <el-button type="primary" :loading="loading" @click='refresh()'>{{loading?'加载中...':'刷新'}}</el-button>
      </div>
      <span class="time">上次刷新时间：{{new Date()/1000|formatData(true)}}</span>
    </div>
    <div class='map-content map' id="mapContent" v-loading="mapLoading" :element-loading-text="loadingConfig.loadingText" :element-loading-spinner="loadingConfig.loadingSpinner" :element-loading-background="loadingConfig.loadingBackground">
      <el-amap :zoom="10" :expandZoomRange="true" :zooms="[3,20]" :center="poiResultLocation" :events="mapEvents" :amap-manager="amapManager" :mapStyle='mapStyle' :plugin="plugin"> </el-amap>
    </div>
  </div>
</template>
<script>
import loadingConfig from '@/config/loading'
import searchSelect from '@/components/website-select'
import mapConfig from '@/config/map-config'
import VueAMap from 'vue-amap'
import { getAddress } from '@/utils/map-util'
import { getRentStatus } from '@/utils/common'
import { handleDate } from '@/utils/date-filter'
import { renderMassPoint, statueMapDotColor } from '@/utils/mass-point-map'
import _debounce from 'lodash/debounce'
let amapManager = new VueAMap.AMapManager()
export default {
  name: 'car-statue-map',
  components: {
    searchSelect
  },
  mounted() {
  },
  computed: {
    // 获取标签页的数据
    activeTab() {
      return this.$store.getters.activeTab.name
    },
    statusArr(status) {
      return [{
        name: '空闲',
        value: 'VACANT',
        amount: this.status.VACANT
      }, {
        name: '已预约',
        value: 'OCCUPIED',
        amount: this.status.OCCUPIED
      }, {
        name: '已租',
        value: 'CHECK_IN',
        amount: this.status.CHECK_IN
      }, {
        name: '维护中',
        value: 'ON_MAINTENANCE',
        amount: this.status.ON_MAINTENANCE
      }]
    }
  },
  watch: {
    activeTab(newTab) {
      if (newTab === 'car-haima-map') {
        clearInterval(this.timingRefresh)
        this.refresh()
        this.getTimingRefresh()
      } else {
        // console.log(this.$store.getters.activeTab.name)
        clearInterval(this.timingRefresh)
      }
    }
  },
  destroyed() {
    clearInterval(this.timingRefresh)
  },

  data() {
    let self = this
    return {
      amapManager,
      loadingConfig,
      timingRefresh: null,
      loading: false,
      mapLoading: false,
      status: {},
      statusLoading: false,
      distList: [], // 报警状态字典
      statisticsList: [], // 报警状态数量
      showStatus: false,
      typeCode: '',
      isBreak: null,
      infoWindow: null,
      polygon: null,
      statusData: [],
      mapData: [],
      params: {
        cityId: this.$store.getters.firstCityId,
        page: 1,
        pageSize: 1000
      },
      statusType: ['VACANT', 'OCCUPIED', 'CHECK_IN', 'ON_MAINTENANCE'],
      carPowerStatusDictionary: ['获取失败', '未充电', '充电中', '充电完成', '充电故障'], // 电源状态
      pointSimplifierIns: null, // 海量点对象实例
      poiResultLocation: [113.692672, 34.826137],
      plugin: [
        {
          pName: 'Scale'
        }
      ],
      mapStyle: mapConfig.mapStyle[mapConfig.selectedStyle].url,
      mapEvents: {
        init(map) {
          self.get_data()
          self.getTimingRefresh()
          self.getOperationCityInfo()
        }
      }
    }
  },
  methods: {
    dictColor(type) {
      return `color:${statueMapDotColor[type]}`
    },
    getOperationCityInfo() {
      let map = this.amapManager.getMap()
      this.$service.get_operationCityInfo(this.params.cityId).then(res => {
        this.polygon = new window.AMap.Polygon({
          map: map,
          zIndex: 99,
          bubble: true,
          path: res.data.data.polygon,
          draggable: false,
          strokeColor: '#fdd000', // 线颜色
          strokeOpacity: 0.5, // 线透明度
          strokeWeight: 2, // 线宽
          fillColor: '#fdd000', // 填充色
          fillOpacity: 0.02 // 填充透明度
        })
        this.polygon.setMap(map)
        this.polygon.show()
        map.setFitView()
      })
    },
    handleDataGroup(value) {
      console.log(this.pointSimplifierIns.getRender())
      this.typeCode = value
      console.log(value)
      let arr = []
      console.log(this.statusData)
      if (this.infoWindow) {
        this.infoWindow.close()
      }
      this.statusData.forEach(item => {
        if (item.typeCode === value) {
          arr.push(item)
        }
      })
      this.pointSimplifierIns.setData(arr)
    },
    getTimingRefresh() {
      this.timingRefresh = setInterval(() => {
        this.refresh()
      }, 132000)
    },
    get_data() {
      this.mapLoading = true
      this.$service.getCarHaiMaList(this.params).then(res => {
        if (!res.data.data.records.length) {
          this.$message.warning('该城市下暂无数据')
          this.mapLoading = false
          this.pointSimplifierIns.setData([])
          // alert()
          return
        }
        this.mapData.push(...res.data.data.records)
        this.params.page++
        if (res.data.data.totalElements < res.data.data.page * res.data.data.pageSize) {
          this.mapLoading = false
          new Promise((resolve, reject) => {
            resolve(this.mapData)
          }).then(data => {
            // console.log(data)
            let statusData = []
            data.forEach(item => {
              // 如果能转成数字类型
              if (!isNaN(item.lng) && !isNaN(item.lat) && (item.lng >= 1 && item.lat >= 1)) {
                statusData.push({
                  lngLatArr: [item.lng, item.lat],
                  carSn: item.carSn,
                  typeCode: 'CHECK_IN' // 告警类别
                })
              }
            })
            console.log(statusData, 'daat')
            this.statusData = statusData
            let arr = []
            if (this.typeCode) {
              statusData.forEach(item => {
                if (item.typeCode === this.typeCode) {
                  arr.push(item)
                }
              })
            }

            // 如果有数据第一次刷新的时候就会new出来地图数据
            // 如果没有数据 第一次刷新的时候就中断了
            if (!this.isBreak) {
              this.isBreak = true
              // 因为第一次就没有进入到这里

              renderMassPoint(this.amapManager.getMap(), statusData).then((newProject) => {
                this.pointSimplifierIns = newProject.pointSimplifierIns
                newProject.pointSimplifierIns.on('pointClick', (e, item) => {
                  this.loading = true
                  this.getDetailData(item.data.carSn, (detailData) => {
                    this.loading = false
                    getAddress([detailData.lng, detailData.lat]).then(address => {
                      detailData.address = address
                      this.infoWindow = new window.AMap.InfoWindow({
                        offset: new window.AMap.Pixel(0, -15),
                        content: `
                        <div class="car-panel">
                          <div class="panel-header"> <h3>${detailData.carNumber === -1 ? '未知' : detailData.carNumber}</h3 ></div >
                            <div class="panel-content">
                              <ul>
                                <li ><span class="panel-key">当前车辆状态：</span><span class="panel-value">${getRentStatus[detailData.rentStatusCode]} </span></li>
                                <li ><span class="panel-key">剩余电量：</span><span class="panel-value">${detailData.soc === -1 ? '未知' : detailData.soc + '%'} </span></li>
                                <li ><span class="panel-key">目前总里程数：</span><span class="panel-value">${detailData.odo}公里 </span></li>
                                <li ><span class="panel-key">当前时速：</span><span class="panel-value">${detailData.speed > 0 ? detailData.speed : 0}km/h</span></li>
                                <li ><span class="panel-key">总电流：</span><span class="panel-value">${detailData.powerCurrent === -1 ? '获取失败' : detailData.powerCurrent}</span></li>
                                <li ><span class="panel-key">当前电源状态：</span><span class="panel-value">${this.carPowerStatusDictionary[detailData.charging + 1]}</span></li>
                                <li ><span class="panel-key">钥匙状态：</span><span class="panel-value">${detailData.acc ? '打开' : '关闭'}</span></li>
                                <li ><span class="panel-key">地址：</span><span class="panel-value">${detailData.address}</span></li>
                                <li ><span class="panel-key">最后更新时间：</span><span class="panel-value">${handleDate(new Date(detailData.reportTime * 1000))}</span></li>
                              </ul>
                            </div>
                        </div > `
                      })
                      this.infoWindow.open(newProject.map, item.data.lngLatArr)
                    })
                  })
                })
              })
            } else {
              this.pointSimplifierIns.setData(this.typeCode ? arr : statusData)
            }
          })
        } else {
          this.get_data()
        }
      }).catch(err => {
        this.mapLoading = false
      })
    },
    statusMapRentStatus() {
      this.statusLoading = true
      this.$service.getStatusMapRentStatus(this.params.cityId, '').then(res => {
        this.status = res.data.data
        this.statusLoading = false
      })
    },
    getDetailData(carSn, callBackData) {
      this.$service.getStatusMapNow(carSn).then(res => {
        if (res.data.code === '0') {
          callBackData(res.data.data)
        }
      })
    },
    refresh: _debounce(function (isTypeCode) {
      if (this.infoWindow) {
        this.infoWindow.close()
      }
      // if (!this.params.cityId) {
      //   this.params.cityId = 410100
      // }
      if (isTypeCode) {
        this.typeCode = ''
      }
      // 刷新的时候隐藏当前的围栏
      this.polygon.hide()
      // 调用再次渲染
      this.getOperationCityInfo()
      this.params.page = 1
      this.mapData = []
      this.statusMapRentStatus()
      this.get_data()
    }, 250)
  }
}
</script>
<style lang="scss" >
#car-statue-map {
  width: 100%;
  height: 100%;
  padding: 0;
  position: relative;

  .map {
    .dot {
      position: absolute;
      top: 2vw;
      left: 0;
      z-index: 999;
    }
    .status {
      z-index: 999;
      position: absolute;
      top: 2vw;
      right: 20px;
      color: #888;
      li {
        margin-top: 5px;
      }
    }
  }
}
</style>
