<template>
  <div id="car-statue-map">
    <map-search @refresh='refresh()' isCityName v-model="params.cityId" :selectWidth='300' :changeTime='changeTime' :loading='timeLoading'>
      <span slot='detailLoading' v-show="loading">
        <i class="el-icon-loading"></i>
      </span>
      <template slot="select">
        <div class="type-select">
          <span class="type-name">租赁类型</span>
          <el-select v-model="rentType" placeholder="请选择" class="multi-select">
            <el-option label="分时" value="1"> </el-option>
            <el-option label="短租" value="2"> </el-option>
          </el-select>
        </div>
      </template>
    </map-search>
    <div class='map-content map' id="mapContent" v-loading="mapLoading=false" :element-loading-text="loadingConfig.loadingText" :element-loading-spinner="loadingConfig.loadingSpinner" :element-loading-background="loadingConfig.loadingBackground">
      <div class="warning-status" v-loading="statusLoading">
        <div class="status-item" :class="'status-item-'+index" v-for="(item ,index) in statusArr" :key="index">
          <div @click="handleDataGroup(item.value)">
            <span>
              <i :style="dictColor(item.value)">{{item.amount?item.amount:0}}</i>
              <i>辆</i>
            </span>
            <span>{{item.name}}</span>
          </div>
        </div>
      </div>
      <div class="warning-status" v-loading="statusLoading">
        <div class="status-item" :class="'status-item-'+index" v-for="(item ,index) in statusArr" :key="index">
          <div @click="handleDataGroup(item.value)">
            <span>
              <i :style="dictColor(item.value)">{{item.amount?item.amount:0}}</i>
              <i>辆</i>
            </span>
            <span>{{item.name}}</span>
          </div>
        </div>
      </div>
      <el-amap :zoom="10" :expandZoomRange="true" :zooms="[3,20]" :center="poiResultLocation" :events="mapEvents" :amap-manager="amapManager" :mapStyle='mapStyle' :plugin="plugin"> </el-amap>
    </div>
  </div>
</template>
<script>
import mapSearch from '@/components/map/map-search'
import loadingConfig from '@/config/loading'
import searchSelect from '@/components/website-select'
import mapConfig from '@/config/map-config'
import VueAMap from 'vue-amap'
import { renderMassPoint, statueMapDotColor, refreshTime } from '@/utils/mass-point-map'
import _debounce from 'lodash/debounce'
let amapManager = new VueAMap.AMapManager()
export default {
  name: 'car-statue-map',
  components: {
    mapSearch
  },
  mounted() {
    this.$nextTick(() => {
    })
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
      if (newTab === 'carStatusMap') {
        clearInterval(this.timingRefresh)
        this.refresh()
        this.statusMapRentStatus()
        this.getTimingRefresh()
        this.timeLoading = true
      } else {
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
      changeTime: null,
      timingRefresh: null,
      loading: false,
      mapLoading: false,
      rentType: '',
      status: {},
      timeLoading: false,
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
        pageSize: 100
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
          self.statusMapRentStatus()
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
      }, refreshTime)
    },
    get_data() {
      this.mapLoading = true
      this.$service.getStatusMapPagingOrSearch(this.params).then(res => {
        if (!res.data.data.records.length) {
          this.$message.warning('该城市下暂无车辆')
          this.mapLoading = false
          this.pointSimplifierIns.setData([])
          return
        }
        let statusData = []
        res.data.data.records.forEach(item => {
          // 如果能转成数字类型
          if (!isNaN(item.lng) && !isNaN(item.lat) && (item.lng >= 1 && item.lat >= 1)) {
            statusData.push({
              lngLatArr: [item.lng, item.lat],
              carSn: item.carSn,
              typeCode: this.statusType[item.rentStatusCode] // 告警类别
            })
          }
        })
        this.statusData = statusData
        console.log(this.statusData)
        // let isBreak
        // if (!isBreak) {
        // isBreak = true
        // 因为第一次就没有进入到这里
        renderMassPoint(this.amapManager.getMap(), statusData).then((newProject) => {
          this.pointSimplifierIns = newProject.pointSimplifierIns
        })
        // }

        this.params.page++
        if (res.data.data.totalElements < res.data.data.page * res.data.data.pageSize) {

          //   this.mapLoading = false
          //   new Promise((resolve, reject) => {
          //     resolve(this.mapData)
          //   }).then(data => {
          //     this.changeTime = Math.random()
          //     this.timeLoading = false
          //     // console.log(data)
          //     let statusData = []
          //     data.forEach(item => {
          //       // 如果能转成数字类型
          //       if (!isNaN(item.lng) && !isNaN(item.lat) && (item.lng >= 1 && item.lat >= 1)) {
          //         statusData.push({
          //           lngLatArr: [item.lng, item.lat],
          //           carSn: item.carSn,
          //           typeCode: this.statusType[item.rentStatusCode] // 告警类别
          //         })
          //       }
          //     })
          //     this.statusData = statusData
          //     let arr = []
          //     if (this.typeCode) {
          //       statusData.forEach(item => {
          //         if (item.typeCode === this.typeCode) {
          //           arr.push(item)
          //         }
          //       })
          //     }

          //     // 如果有数据第一次刷新的时候就会new出来地图数据
          //     // 如果没有数据 第一次刷新的时候就中断了
          //     if (!this.isBreak) {
          //       this.isBreak = true
          //       // 因为第一次就没有进入到这里
          //       renderMassPoint(this.amapManager.getMap(), statusData).then((newProject) => {
          //         this.pointSimplifierIns = newProject.pointSimplifierIns

          //         newProject.pointSimplifierIns.on('pointClick', (e, item) => {
          //           this.loading = true
          //           this.getDetailData(item.data.carSn, (detailData) => {
          //             this.loading = false
          //             getAddress([detailData.lng, detailData.lat]).then(address => {
          //               detailData.address = address
          //               this.infoWindow = new window.AMap.InfoWindow({
          //                 offset: new window.AMap.Pixel(0, -15),
          //                 content: `
          //                 <div class="car-panel">
          //                   <div class="panel-header"> <h3>${detailData.carNumber === -1 ? '未知' : detailData.carNumber}</h3 ></div >
          //                     <div class="panel-content">
          //                       <ul>
          //                         <li ><span class="panel-key">当前车辆状态：</span><span class="panel-value">${getRentStatus[detailData.rentStatusCode]} </span></li>
          //                         <li ><span class="panel-key">剩余电量：</span><span class="panel-value">${detailData.soc === -1 ? '未知' : detailData.soc + '%'} </span></li>
          //                         <li ><span class="panel-key">目前总里程数：</span><span class="panel-value">${detailData.odo}公里 </span></li>
          //                         <li ><span class="panel-key">当前时速：</span><span class="panel-value">${detailData.speed > 0 ? detailData.speed : 0}km/h</span></li>
          //                         <li ><span class="panel-key">总电流：</span><span class="panel-value">${detailData.powerCurrent === -1 ? '获取失败' : detailData.powerCurrent}</span></li>
          //                         <li ><span class="panel-key">当前电源状态：</span><span class="panel-value">${this.carPowerStatusDictionary[detailData.charging + 1]}</span></li>
          //                         <li ><span class="panel-key">钥匙状态：</span><span class="panel-value">${detailData.acc ? '打开' : '关闭'}</span></li>
          //                         <li ><span class="panel-key">地址：</span><span class="panel-value">${detailData.address}</span></li>
          //                         <li ><span class="panel-key">最后更新时间：</span><span class="panel-value">${handleDate(new Date(detailData.reportTime * 1000))}</span></li>
          //                       </ul>
          //                     </div>
          //                 </div > `
          //               })
          //               this.infoWindow.open(newProject.map, item.data.lngLatArr)
          //             })
          //           })
          //         })
          //       })
          //     } else {
          //       this.pointSimplifierIns.setData(this.typeCode ? arr : statusData)
          //     }
          //   })
        } else {
          // alert()
          // this.pointSimplifierIns.setData(...statusData)
          this.get_data()
        }
      }).catch(err => {
        this.mapLoading = false
      })
    },
    statusMapRentStatus() {
      this.statusLoading = true
      this.$service.getStatusMapRentStatus(this.params.cityId).then(res => {
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
      this.amapManager.getMap().clearMap()
      this.timeLoading = true
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
    .warning-status {
      // width: 134px;
      // text-align: center;
      z-index: 999;
      position: absolute;
      top: $map-ststus-top;
      right: $map-ststus-right;
      cursor: default;
      .status-item {
        cursor: pointer;
        height: 70px;
        width: 160px; // border: 1px solid #787878;
        border-left: 0;
        background: #ffffff;
        box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.2); // box-shadow: 2px 0px 10px #888888;
        display: flex;
        margin-bottom: 10px;
        > div {
          // background: red;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          margin-left: 20px;
          padding-top: 20px;
          padding-bottom: 10px;
          span {
            i {
              font-size: 12px; // 把斜体扶正
              font-style: normal;

              &:first-child {
                font-size: 32px;
              }
            }
            &:last-child {
              padding-left: 0px;
              font-size: 15px;
            }
          }
        }
        &.status-item-0 {
          &::before {
            background: #96c840;
          }
        }
        &.status-item-1 {
          &::before {
            background: #fdd000;
          }
        }
        &.status-item-2 {
          &::before {
            background: #5badff;
          }
        }
        &.status-item-3 {
          &::before {
            background: #4e4e4e;
          }
        }
        &::before {
          content: '';
          display: block;
          width: 8px;
          margin-top: -0.8px;
          height: 72px;
          overflow: hidden;
          background: #aaaaaa;
        }
      }
    }
  }
}
</style>
