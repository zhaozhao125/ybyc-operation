<template>
  <el-dialog :title="title" class="search-station" :visible.sync="visible" :append-to-body="true" width="60%" :before-close="closeMe">
    <div class="select-station-map-container">
      <el-amap ref="amap" :center="center" :zoom="zoom" :amap-manager="amapManager" :events="events" :plugin="plugins" :mapStyle="mapStyle" :expandZoomRange="true" :zooms="[3,20]" class="amap">
        <el-amap-marker v-if="carMarker" :topWhenClick="true" ref="carMarker" :zIndex="500" :position="carMarker" :content="wrapMarkerContent()" :animation="markerAni" :clickable="true" :offset="[-25, -25]" :events="carMarkerEvents"></el-amap-marker>
        <el-amap-info-window ref="infoWindow" :position="panel.position" :visible="panel.visible" :isCustom="false" :content="panel.content" :events="panel.events"></el-amap-info-window>
      </el-amap>
      <div class="search-input">
        <el-input v-model.trim="searchVal"></el-input>
        <el-button type="primary" :loading="loading" @click="handleSearchStation">搜索</el-button>
        <el-button type="default" :disabled="loading" @click="handleSearchReset">重置</el-button>
      </div>
      <div class="submit-btn">
        <el-button type="primary" :disabled="!selectedStation || loading" @click="handleConfirm">选择该网点</el-button>
      </div>
    </div>
  </el-dialog>

</template>

<script>
import mapConfig from '@/config/map-config'
import { AMapManager } from 'vue-amap'
import { getAddress, renderStation } from '@/utils/map-util.js'
import { getStatusByDict } from '@/utils/common.js'
import { carStatusDictionary, carPowerStatusDictionary } from '@/config/data-dictionary/car.js'
import dayjs from 'dayjs'
let amapManager = new AMapManager()
export default {

  name: 'search-station',

  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '选择网点'
    },
    carNumber: {
      type: String
    },
    currentCityId: {
      type: Number
    },
    rentType: {
      type: Number
    },
    // 是否需要渲染全部网点围栏
    renderStationScope: {
      type: Boolean,
      default: false
    },
    // 是否只显示对用户可见的网店
    showUserVisibleStationOnly: {
      type: Boolean,
      default: true
    }
  },

  data() {
    let self = this
    return {
      stationLists: [],
      amapManager,
      searchText: '',
      zoom: mapConfig.zoom,
      center: mapConfig.center,
      mapStyle: mapConfig.mapStyle[mapConfig.selectedStyle].url,
      markerAni: mapConfig.animation,
      carMarker: null,
      stationMarkers: [],
      events: {
        // 地图初始化完毕
        init(map) {
          // 加载UI组件
          if (self.visible && !self.initedMarkerList) {
            this.initedMarkerList = true
            self.getStationData()
          }
        }
      },
      plugins: [
        {
          pName: 'Scale', // 比例尺插件
          position: 'LB'
        }
      ],
      carMarkerEvents: {
        click: e => {
          if (!self.panel.visible) {
            let { lng, lat } = e.target.G.position
            let markerPosition = [
              lng,
              lat
            ]
            self.panel.visible = true
          }
        }
      },
      panel: {
        position: mapConfig.center,
        visible: false,
        events: {
          close() {
            self.panel.visible = false
          }
        }
      },
      currentCar: {
        carSn: null,
        carPlate: 'a',
        carInfo: []
      },
      // 当前请求接口返回的车辆数据
      currentCarData: null,
      // 当前选中的网点
      selectedStation: null,
      markerList: null,
      searchVal: '',
      loading: false,

      // 完整的网点数据备份
      fullStationData: null,
      needResetStation: false,
      // 是否已经初次渲染网点markerList
      initedMarkerList: false,
      // 车辆信息
      carInfor: null
    }
  },

  mounted() {
    if (this.carNumber && this.visible) {
      console.log('mounted')
      this.searchCar()
    }
  },

  methods: {
    closeMe() {
      this.$emit('update:visible', false)
      if (this.markerList) {
        this.markerList.closeInfoWindow()
      }
    },
    getStationData(name = '', currentCityId = this.currentCityId, rentType = this.rentType) {
      console.log('getStationData')
      this.loading = true
      this.selectedStation = null
      this.$service.getStationByNameInCertainCityType(name, currentCityId, rentType, true, this.showUserVisibleStationOnly).then(res => {
        this.stationLists = res.data.data
        if (!res.data.data.length) {
          this.$message({
            message: '无搜索结果',
            type: 'info'
          })
          if (this.markerList) {
            this.markerList.clearAllData()
          }
          this.loading = false
          return
        }
        if (this.markerList) {
          this.markerList.formatAndRender(res.data.data)
          this.loading = false
        } else {
          renderStation(this.amapManager.getMap(), res.data.data, {
            renderStationScope: this.renderStationScope,
            showStationScopeOnClick: true,
            context: this,
            onClickInfoWindow: (data) => {
              this.selectedStation = {
                id: data.id,
                name: data.name,
                type: data.type
              }
              this.searchVal = data.name
            }
          }).then(markerList => {
            this.markerList = markerList
            if (this.carInfor) {
              if (this.carInfor.reportTime == -1) {
              } else {
                this.markerList.setZooms(false)
                this.markerList.setCenter([this.carInfor.lng, this.carInfor.lat])
              }
            } else {
            }
            this.loading = false
          })
        }
        if (!name) {
          this.fullStationData = res.data.data
        }
      }).catch(err => {
        this.loading = false
      })
    },
    // 车辆marker内容
    wrapMarkerContent() {
      return `<div class="content-marker cars-marker"></div>`
    },
    // 渲染车辆信息窗体的内容
    renderInfoWindow() {
      if (this.currentCar.carInfo.length) {
        let list = ''
        this.currentCar.carInfo.forEach(item => {
          list += `<li>
                      <span class="panel-key">${item.key}： </span>
                      <span class="panel-value">${item.value}</span>
                    </li>`
        })
        let content = `<div class="infowindow-panel">
                        <div class="panel-header">
                          <h3>${this.currentCar.carPlate}</h3>
                        </div>
                        <div class="panel-content">
                          <ul>
                            ${list}
                          </ul>
                        </div>
                      </div>`
        this.panel.content = content
      }
    },
    // 获取车辆位置和其他需要显示到窗体中的信息
    getCarData(data) {
      console.log(this.markerList)
      if (data.reportTime == -1) {
        this.$message({
          message: '查询不到车辆数据'
        })
        return
      }
      let carData = {
        carSn: data.carSn,
        carPlate: data.carNumber,
        carInfo: [
          {
            key: '车辆状态',
            value: getStatusByDict(carStatusDictionary, data.rentStatusCode)
          },
          {
            key: '剩余电量',
            value: data.soc + '%'
          },
          {
            key: '总里程数',
            value: data.odo + '公里'
          },
          {
            key: '当前时速',
            value: (data.speed > 0 ? data.speed : 0) + 'km/h'
          },
          {
            key: '总电流',
            value: data.powerCurrent == -1 ? '获取失败' : data.powerCurrent
          },
          {
            key: '电源状态',
            value: getStatusByDict(carPowerStatusDictionary, data.charging)
          },
          {
            key: '钥匙状态',
            value: data.acc ? '打开' : '关闭'
          },
          {
            key: '地址',
            value: '正在获取位置数据'
          },
          {
            key: '更新时间',
            value: dayjs.unix(data.reportTime).format('YYYY-MM-DD HH:mm:ss')
          }
        ]
      }
      this.currentCar = carData
      this.renderInfoWindow()
      getAddress([
        data.lng,
        data.lat
      ], {
        fullData: true
      }).then((address) => {
        carData.carInfo[7].value = address.formattedAddress
        this.currentCar = carData
        this.renderInfoWindow()
        // this.markerList.setZooms(false)
      }).catch(err => {
        carData.carInfo[7].value = '获取不到地址数据'
        this.currentCar = carData
        this.renderInfoWindow()
      })
    },
    // 搜索车
    searchCar(carSn) {
      this.carMarker = null
      this.panel.visible = false
      if (carSn) {
        this.getCarInitialPosition(carSn)
        return
      }
      if (!this.carNumber) {
        // this.$message({
        //   message: '无法获取车牌号',
        //   type: 'warning'
        // })
        return
      }
      this.$service.getCarByNumber(this.carNumber).then(res => {
        console.log('searchCar')
        let result = res.data
        if (result.data.records.length == 0) {
          this.$message({
            message: '查询不到相关车辆',
            type: 'info'
          })
        } else {
          this.getCarInitialPosition(result.data.records[0].carSn)
        }
      })
    },
    // 第一次获取车辆位置信息
    getCarInitialPosition(carSn) {
      this.currentCar.carSn = carSn
      this.$service.getCarPosition(this.currentCar.carSn).then(res => {
        console.log('getCarInitialPosition')
        console.log(this.markerList)
        let result = res.data.data
        this.carInfor = res.data.data
        this.currentCarData = result
        this.carMarker = [
          result.lng,
          result.lat
        ]
        this.panel.position = this.carMarker
        this.center = this.carMarker
        this.zoom = 14
        // this.$nextTick(() => {
        //   this.zoom = 13
        // })
        this.getCarData(result)
        this.panel.template = this.panel.template + ''
      }).catch((res) => {
        // this.markerList._opts.autoSetFitView = true
      })
    },
    handleConfirm() {
      this.$emit('confirm', this.selectedStation)
      this.$emit('update:visible', false)
    },
    handleSearchStation() {
      this.getStationData(this.searchVal)
    },
    handleSearchReset() {
      this.searchVal = ''
      this.selectedStation = null
      this.getStationData()
    },
    resetStation() {
      this.needResetStation = true
    }
  },

  watch: {
    visible() {
      if (this.visible) {
        this.searchCar()
        if (!this.carNumber) {
          this.carMarker = null
        }
        if (!this.markerList && !this.initedMarkerList) {
          this.initedMarkerList = true
          this.getStationData()
        }
        if (this.needResetStation && this.markerList && this.fullStationData) {
          this.searchVal = ''
          this.selectedStation = null
          this.markerList.formatAndRender(this.fullStationData)
        }
      }
    }
  }
}
</script>

<style lang="scss">
.search-station {
  .select-station-map-container {
    width: 100%;
    height: 400px;
    height: 35vw;
    position: relative;
    .search-input {
      position: absolute;
      top: 5px;
      left: 5px;
      z-index: 200;
      .el-input {
        width: 400px;
      }
    }
    .submit-btn {
      float: right;
      position: absolute;
      top: 5px;
      right: 5px;
      z-index: 200;
    }
  }
  .content-marker {
    width: 50px;
    height: 50px;
    background-image: url('~@/assets/img/car.png');
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center center;
  }
}
</style>
