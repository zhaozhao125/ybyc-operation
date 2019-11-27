<template>
  <div class="car-location">
    <div class="amap-wrapper">
      <el-amap ref="amap" :vid="'amap-location'" :center="center" :zoom="zoom" :amap-manager="amapManager" :events="events" :plugin="plugins" :mapStyle="mapStyle" :expandZoomRange="true" :zooms="[3,20]" class="amap">
        <el-amap-marker v-if="carMarker" :extData="carMarker" :topWhenClick="true" ref="carMarker" :position="carMarker" :content="wrapMarkerContent()" :animation="markerAni" :clickable="true" :offset="[-25, -25]" :events="markerEvents"></el-amap-marker>
        <el-amap-info-window ref="infoWindow" :position="panel.position" :visible="panel.visible" :isCustom="false" :content="panel.content" :events="panel.events"></el-amap-info-window>
      </el-amap>
      <div class="search-map">
        <el-autocomplete placeholder="请输入完整车牌号" v-model="searchText" :fetch-suggestions="_querySearch('search')">
          <el-button slot="append" icon="el-icon-search" @click="searchCar()"></el-button>
        </el-autocomplete>
        <el-switch v-model="carFixed" active-text="跟随车辆" @change="handleFollowCar">
        </el-switch>
      </div>
    </div>
  </div>

</template>

<script>
import mapConfig from '@/config/map-config'
import { AMapManager } from 'vue-amap'
import { getAddress, renderStation } from '@/utils/map-util.js'
import searchHistoryMixin from '@/mixins/search-history.js'
import { getStatusByDict } from '@/utils/common.js'
import { carStatusDictionary, carPowerStatusDictionary } from '@/config/data-dictionary/car.js'
import dayjs from 'dayjs'
let amapManager = new AMapManager()
export default {
  name: 'car-location',

  mixins: [
    searchHistoryMixin
  ],

  props: [
    'params'
  ],

  data() {
    let self = this
    return {
      searchText: '',
      zoom: mapConfig.zoom,
      center: mapConfig.center,
      mapStyle: mapConfig.mapStyle[mapConfig.selectedStyle].url,
      markerAni: mapConfig.animation,
      amapManager,
      carMarker: null,
      events: {
        // 地图初始化完毕
        init(map) {
          // 加载UI组件
          AMapUI.loadUI([
            'control/BasicControl'
          ], function (BasicControl) {
            // 缩放控件
            map.addControl(new BasicControl.Zoom({
              position: 'rb',
              showZoomNum: true // 显示zoom值
            }))
          })
        }
      },
      plugins: [
        {
          pName: 'Scale', // 比例尺插件
          position: 'LB'
        },
        {
          pName: 'Geolocation', // 定位插件
          showButton: false, // 不显示定位按钮
          showMarker: false, // 不显示定位标记
          events: {
            init(o) {
              // o 是高德地图定位插件实例
              self.getCurrentPosition = function () {
                return new Promise((resolve, reject) => {
                  o.getCurrentPosition((status, result) => {
                    if (status === 'complete' && result.info === 'SUCCESS') {
                      return resolve([
                        result.position.lng,
                        result.position.lat
                      ])
                    } else {
                      return reject(status)
                    }
                  })
                })
              }
              if (!self.params) {
                self.getCurrentPosition().then(pos => {
                  this.center = pos
                })
              }
            }
          }
        }
      ],
      markerEvents: {
        click: e => {
          if (!self.panel.visible) {
            let { lng, lat } = e.target.G.position
            let markerPosition = [
              lng,
              lat
            ]
            self.panel.visible = true

            if (this.needUpdateCarData) {
              this.getNewPosition()
              this.needUpdateCarData = false
            }
          }
        }
      },
      panel: {
        position: mapConfig.center,
        visible: false,
        content: `<div class="infowindow-panel">
                    <div class="panel-content">
                      查询不到车辆数据
                    </div>
                  </div>`,
        events: {
          close() {
            self.panel.visible = false
          }
        }
      },
      carFixed: true,
      searchCarData: null,
      currentCar: {
        carSn: null,
        carPlate: 'a',
        carInfo: []
      },
      timer: null,
      searchSettings: [
        {
          name: 'search',
          type: 'autocomplete',
          data: []
        }
      ],
      // 是否需要更新车辆位置信息
      needUpdateCarData: false,
      // 当前请求接口返回的车辆数据
      currentCarData: null,
      currentCityId: null
    }
  },
  methods: {
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
      } else {
        this.$message({
          message: '无数据'
        })
        this.panel.content = '无数据'
      }
    },
    // 获取车辆位置和其他需要显示到窗体中的信息
    getCarData(data) {
      if (data.reportTime == -1) {
        this.$message({
          message: '查询不到数据'
        })
        return
      }
      let carData = {
        carSn: data.carSn,
        carPlate: data.carNumber,
        carInfo: [
          {
            key: '当前车辆状态',
            value: getStatusByDict(carStatusDictionary, data.rentStatusCode)
          },
          {
            key: '剩余电量',
            value: data.soc + '%'
          },
          {
            key: '目前总里程数',
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
            key: '当前电源状态',
            value: getStatusByDict(carPowerStatusDictionary, data.charging)
          },
          {
            key: '钥匙状态',
            value: data.acc ? '打开' : '关闭'
          },
          {
            key: '地址',
            value: '获取不到地址数据'
          },
          {
            key: '最后更新时间',
            value: dayjs.unix(data.reportTime).format('YYYY-MM-DD HH:mm:ss')
          }
        ]
      }
      getAddress([
        data.lng,
        data.lat
      ], {
        fullData: true
      }).then((address) => {
        carData.carInfo[7].value = address.formattedAddress
        this.currentCityId = address.addressComponent.adcode.substr(0, 4) + '00'
        this.currentCar = carData
        this.renderInfoWindow()
      }).catch(err => {
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
      if (!this.searchText) {
        this.$message({
          message: '查询信息不能为空',
          type: 'warning'
        })
        return
      }
      this.$service.getCarByNumber(this.searchText, {}).then(res => {
        let result = res.data
        if (result.data.records.length == 0) {
          this.$message({
            message: '查询不到相关车辆',
            type: 'info'
          })
        } else {
          this._saveSearchHistory(this.searchText, 'search')
          this.searchCarData = result.data.records[0]
          this.getCarInitialPosition(this.searchCarData.carSn)
        }
      })
    },
    // 第一次获取车辆位置信息
    getCarInitialPosition(carSn) {
      this.currentCar.carSn = carSn

      if (this.timer) {
        clearInterval(this.timer)
      }
      this.timer = setInterval(() => {
        if (this.currentCar.carSn) {
          if (this.panel.visible) {
            this.getNewPosition()
            this.needUpdateCarData = false
          } else {
            this.needUpdateCarData = true
          }
        }
      }, mapConfig.heartbeat * 1000)

      this.$service.getCarPosition(this.currentCar.carSn, true).then(res => {
        let result = res.data.data
        if (result.reportTime == -1) {
          this.$message({
            message: '查询不到车辆数据',
            type: 'warning'
          })
          return
        }
        this.currentCarData = result
        this.carMarker = [
          result.lng,
          result.lat
        ]
        this.panel.position = this.carMarker
        this.center = this.carMarker
        this.zoom = 16
        this.$nextTick(() => {
          this.zoom = 15
        })
        this.getCarData(result)
        this.panel.template = this.panel.template + ''
      })
    },
    // 轮询车辆定位信息
    getNewPosition() {
      this.$service.getCarPosition(this.currentCar.carSn).then(res => {
        let result = res.data.data
        if (result.reportTime == -1) {
          this.$message({
            message: '查询不到车辆数据',
            type: 'warning'
          })
          return
        }
        this.currentCarData = result
        this.carMarker = [
          result.lng,
          result.lat
        ]
        this.panel.position = this.carMarker
        this.getCarData(result)
        if (this.carFixed) {
          this.center = this.carMarker
        }
      })
    },
    // 从别的标签页传参到当前页面
    handleParamsChange() {
      if (this.params && this.params.carNumber) {
        this.searchText = this.params.carNumber
        if (this.params.carSn) {
          this.searchCar(this.params.carSn)
        }
      }
    },
    // 跟随车辆
    handleFollowCar(val) {
      if (val && this.carMarker) {
        this.center = [].concat(this.carMarker)
      }
    },
    // 获取网点数据
    getStation(cityId) {
      if (cityId) {
        this.$service.getStationByCityId(cityId).then(res => {
          if (res.data.data.length) {
            renderStation(this.amapManager.getMap(), res.data.data, {
              showStationScopeOnClick: true
            })
          }
        })
      }
    }
  },

  computed: {
    activeTab() {
      return this.$store.getters.activeTab
    }
  },

  mounted() {
    this.handleParamsChange()
  },

  watch: {
    params() {
      this.handleParamsChange()
    },
    activeTab(newTab) {
      this.panel.visible = false
    },
    currentCityId(cityId) {
      this.getStation(cityId)
    }
  },

  destroyed() {
    if (this.timer) {
      clearInterval(this.timer)
    }
  }
}

</script>

<style lang="scss">
.car-location {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  padding: 0 !important;
  .amap-wrapper {
    width: 100%;
    height: 100%;
    .search-map {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      padding: $size-padding;
      box-shadow: 0px 0px 3px #666;
      background-color: $color-white;
      z-index: 200;
      .el-input {
        width: 400px;
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
}
</style>
