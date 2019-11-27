<template>
<div class="car-track">
  <div class="amap-wrapper">
    <el-amap ref="amap"
             :vid="'amap-track'"
             :center="center"
             :zoom="zoom"
             :amap-manager="amapManager"
             :events="events"
             :plugin="plugins"
             :mapStyle="mapStyle"
             :expandZoomRange="true"
             :zooms="[3,20]"
             class="amap">
      <el-amap-marker vid="start-marker"
                      v-if="startPointPosition"
                      :position="startPointPosition"
                      :content="startPointContent"></el-amap-marker>
      <el-amap-marker vid="end-marker"
                      v-if="endPointPosition"
                      :position="endPointPosition"
                      :content="endPointContent"></el-amap-marker>
    </el-amap>
    <div class="search-map">
      <searchForm ref="searchForm"
                  :loading="!pathCreator"
                  :canPlay="!!pathPointList.length"
                  @changePlayBy="handleChangePlayBy"
                  @search="handleSearch"
                  @play="handlePlayPath"
                  @pause="handlePausePath"
                  @changeSpeed="handleChangeSpeed"
                  @toggleInfo="handleToggleInfo"></searchForm>
    </div>
    <trackInfo v-show="(currentPath && showPlayInfo) || showPointInfo"
               :pointData="currentHoverData || currentPlayData"></trackInfo>
  </div>
</div>

</template>

<script>
import mapConfig from '@/config/map-config'
import { AMapManager } from 'vue-amap'
import searchForm from './children/search-form.vue'
import loadPath from './children/load-path.js'
import trackInfo from './children/track-info.vue'

let amapManager = new AMapManager()
export default {
  props: [
    'params'
  ],

  components: {
    searchForm,
    trackInfo
  },
  data() {
    let self = this
    return {
      // 地图数据
      zoom: mapConfig.zoom,
      center: mapConfig.center,
      mapStyle: mapConfig.mapStyle[mapConfig.selectedStyle].url,
      amapManager,
      // 地图事件
      events: {
        // 地图初始化完毕
        init(map) {
          // 加载路径UI组件
          loadPath(map, AMapUI, self.handleOverPoint, self.handleOutPoint).then(path => {
            self.pathCreator = path
            self.handleParamsChange()
          }).catch(err => {
            self.$message({
              message: err.message,
              type: 'error'
            })
          })
        }
      },
      // 地图插件
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
              self.getCurrentPosition = function() {
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
              self.getCurrentPosition().then(pos => {
                self.center = pos
              })
            }
          }
        }
      ],
      // 轨迹起点
      startPointPosition: null,
      startPointContent: '<span class="position-point start-point"></span>',
      // 轨迹终点
      endPointPosition: null,
      endPointContent: '<span class="position-point end-point"></span>',
      // 轨迹坐标数据
      pathPointList: [],
      // 轨迹完整数据
      pathDataList: [],
      // 轨迹生成器
      pathCreator: null,
      // 当前生成的轨迹
      currentPath: null,
      // 定时获取播放数据
      pathTimer: null,
      // 显示鼠标hover点数据详情
      showPointInfo: false,
      // 鼠标hover点数据
      currentHoverData: null,
      // 播放时显示数据
      showPlayInfo: true,
      // 当前播放点数据
      currentPlayData: null,
      timePlayIndex: 0,
      timePlayFakeIndex: 1
    }
  },
  methods: {
    getCurrentMap() {
      let map = amapManager.getMap()
      return map
    },
    getCurrentPosition() {},
    drawPath(trackData) {
      if (trackData && trackData.length < 2) {
        this.$message({
          message: '暂无数据'
        })
        return
      }
      trackData = trackData.reverse()
      // trackData = trackData.map((item, index) => {
      //   if (item.acc != 1 && index > 0) {
      //     item.lng = trackData[index - 1].lng
      //     item.lat = trackData[index - 1].lat
      //   }
      //   return item
      // })
      this.pathDataList = trackData
      this.pathPointList = trackData.map(item => {
        return [
          item.lng,
          item.lat
        ]
      })
      this.startPointPosition = this.pathPointList[0]
      this.endPointPosition = this.pathPointList[this.pathPointList.length - 1]
      this.currentPath = this.pathCreator.createPath('车辆轨迹', this.pathPointList)
      this.currentPath.on('stop', () => {
        this.$refs.searchForm.isPlaying = false
        this.currentPath.moveToPoint(0)
        this.handlePausePath()
        this.timePlayIndex = 0
        this.timePlayFakeIndex = 1
      })
    },
    clearPath() {
      if (this.currentPath) {
        this.startPointPosition = null
        this.endPointPosition = null
        this.handlePausePath()
        this.currentPath.destroy()
        this.pathPointList = []
        this.currentPath = null
      }
    },
    handleSearch(type, params) {
      this.clearPath()
      if (type == 'time') {
        this.$service.getCarTrack(params.carSn, params.startTime, params.endTime).then(res => {
          let trackData = res.data.data
          this.drawPath(trackData)
        })
      } else {
        this.$service.getCarTrackByOrder(params).then(res => {
          let trackData = res.data.data
          this.drawPath(trackData)
        })
      }
    },
    handlePlayPath(pathData) {
      // this.$store.commit('sendToTab', {
      //   name: 'carLocation',
      //   params: {
      //      carSn:'2016zdd1201709725483',
      //      carNumber: '豫A1R63E'
      //   }
      // })
      if (this.currentPath) {
        if (pathData.playBy == 'speed') {
          // 匀速播放
          this.currentPath.setSpeed(pathData.playSpeed)
          this.currentPath.resume()
          this.pathTimer = setInterval(() => {
            this.currentPlayData = this.pathDataList[this.currentPath.getCurrentIndex()]
          }, 300)
        } else {
          // 变速播放
          this.currentPath.setSpeed(0)
          this.currentPath.resume()
          // let this.timePlayIndex = 0
          let realTimeInterval = mapConfig.heartbeat * 1000 / pathData.timeSpeed
          // let this.timePlayFakeIndex = 1
          this.pathTimer = setInterval(() => {
            if (this.timePlayFakeIndex * 300 >= realTimeInterval) {
              if (this.timePlayIndex == this.pathDataList.length - 1) {
                this.handlePausePath()
                return
              }
              let currentPoint = new AMap.LngLat(this.pathDataList[this.timePlayIndex].lng, this.pathDataList[this.timePlayIndex].lat)
              let distance = currentPoint.distance([
                this.pathDataList[this.timePlayIndex + 1].lng,
                this.pathDataList[this.timePlayIndex + 1].lat
              ])
              if (distance == 0) {
                this.currentPath.moveToPoint(this.timePlayIndex)
              }
              let speed = (distance * 3 / 25) * pathData.timeSpeed
              if (this.timePlayIndex > this.currentPath.getCurrentIndex()) {
                speed *= 1.2
              } else if (this.timePlayIndex < this.currentPath.getCurrentIndex()) {
                speed *= 0.8
              }
              this.currentPath.setSpeed(speed)
              this.timePlayIndex++
              this.timePlayFakeIndex = 1
            } else {
              this.timePlayFakeIndex++
            }
            this.currentPlayData = this.pathDataList[this.currentPath.getCurrentIndex()]
          }, 300)
        }
      } else {
        this.$refs.searchForm.isPlaying = false
        this.$message({
          message: '请先查询车辆信息',
          type: 'warning'
        })
      }
    },
    handlePausePath() {
      this.currentPath && this.currentPath.pause()
      // this.$refs.searchForm.togglePlayState()
      if (this.pathTimer) {
        clearInterval(this.pathTimer)
      }
    },
    handleChangeSpeed(type, speed) {
      if (type == 'playSpeed' && this.currentPath) {
        this.currentPath.setSpeed(speed)
      }
    },
    handleToggleInfo(visible) {
      this.showPlayInfo = visible
    },
    handleOverPoint(index) {
      this.currentHoverData = this.pathDataList[index]
      this.showPointInfo = true
    },
    handleOutPoint(index) {
      this.showPointInfo = false
      this.currentHoverData = null
    },
    handleParamsChange() {
      if (this.params) {
        if (this.params.carNumber) {
          this.zoom = 12
          this.clearPath()
          let timeRange
          if (this.params.startDate && this.params.endDate) {
            timeRange = [
              this.params.startDate,
              this.params.endDate
            ]
          }
          this.$refs.searchForm.setCarNumber(this.params.carNumber, timeRange)
        }
        if (this.params.order) {
          // this.zoom = 12
          this.clearPath()
          this.$refs.searchForm.setOrderId(this.params.order)
          setTimeout(() => {
            this.$refs.searchForm.handleSearch()
          }, 100)
        }
      }
    },
    handleChangePlayBy() {
      this.handlePausePath()
      this.$refs.searchForm.isPlaying = false
      this.currentPath && this.currentPath.moveToPoint(0)
    }
  },

  mounted() {

  },

  beforeDestroy() {
    this.clearPath()
  },

  watch: {
    params(newData) {
      this.handleParamsChange()
    }
  }
}
</script>

<style lang="scss">
.car-track {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  padding: 0!important;
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
      .el-input {
        width: auto;
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
  .position-point {
    display: block;
    width: 25px;
    height: 40px;
    background-image: url('~@/assets/img/markers.png');
    background-size: 300px 300px;
    &.start-point {
      background-position: -200px -139px;
    }
    &.end-point {
      background-position: -225px -139px;
    }
  }
}
</style>
