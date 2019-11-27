<template>
  <div class="signin-station-map">
    <el-amap ref="amap" :center="center" :zoom="zoom" :amap-manager="amapManager" :events="events" :plugin="plugins" :mapStyle="mapStyle" :expandZoomRange="true" :zooms="[3,20]" class="amap">
    </el-amap>
  </div>
</template>

<script>
import mapConfig from '@/config/map-config'
import { AMapManager } from 'vue-amap'
let amapManager = new AMapManager()
export default {
  name: 'signin-station-map',

  props: {
    stationData: {
      type: Array,
      default: []
    }
  },

  data() {
    let self = this
    return {
      amapManager,
      zoom: mapConfig.zoom,
      center: mapConfig.center,
      mapStyle: mapConfig.mapStyle[mapConfig.selectedStyle].url,
      carMarker: null,
      events: {
        // 地图初始化完毕
        init(map) {
          // 加载UI组件
          AMapUI.loadUI(
            [
              'control/BasicControl',
              'misc/MarkerList',
              'overlay/SimpleMarker',
              'overlay/SimpleInfoWindow'
            ],
            function(BasicControl, MarkerList, SimpleMarker, SimpleInfoWindow) {
              // 缩放控件
              map.addControl(
                new BasicControl.Zoom({
                  position: 'rb',
                  showZoomNum: true // 显示zoom值
                })
              )
              self.MarkerList = MarkerList
              self.SimpleMarker = SimpleMarker
              self.SimpleInfoWindow = SimpleInfoWindow
              self.initMarker(MarkerList, SimpleMarker, SimpleInfoWindow)
            }
          )
        }
      },
      plugins: [
        {
          pName: 'Scale', // 比例尺插件
          position: 'LB'
        }
      ],
      markerEvents: {
        click: e => {
          console.log('====e====', e)
        }
      },

      currentIndex: 1
    }
  },

  methods: {
    getInfowindowContent(signs) {
      if (!signs.length) {
        return '暂无人签到'
      }
      let listStr = signs
        .map(item => {
          return `<li>${item.createTime.split(' ').pop()} ${
            item.username
          } 签到</li>`
        })
        .join('')
      listStr = `<li>已签到${signs.length}次</li>` + listStr
      return `<ul class="infowindow-body">${listStr}</ul>`
    },
    initMarker(MarkerList, SimpleMarker, SimpleInfoWindow) {
      if (!this.stationData || !this.stationData.length) {
        return
      }
      let self = this
      let markerList = new MarkerList({
        map: this.amapManager.getMap(),
        autoSetFitView: true,
        // 从数据中读取位置, 返回lngLat
        getPosition: function(item) {
          return [item.stationDTO.longitude, item.stationDTO.latitude]
        },
        // 数据ID，如果不提供，默认使用数组索引，即index
        getDataId: function(item, index) {
          return item.stationDTO.id
        },
        // 构造marker用的options对象, content和title支持模板，也可以是函数，返回marker实例，或者返回options对象
        getMarker: function(dataItem, context, recycledMarker) {
          //存在可回收利用的marker
          if (recycledMarker) {
            //直接更新内容返回
            recycledMarker.setIconLabel({
              innerHTML: String(dataItem.signs.length),
              style: {
                color: '#fff',
                lineHeight: '29px',
                fontSize: '15px'
              }
            })
            recycledMarker.setIconStyle('blue')
            return recycledMarker
          }

          //返回一个新的Marker
          return new SimpleMarker({
            containerClassNames: 'my-marker',
            iconTheme: 'numv2',
            iconStyle: 'blue',
            iconLabel: {
              innerHTML: String(dataItem.signs.length),
              style: {
                color: '#fff',
                lineHeight: '29px',
                fontSize: '15px'
              }
            }
          })
        },
        //返回数据项对应的infoWindow
        getInfoWindow: function(dataItem, context, recycledInfoWindow) {
          if (recycledInfoWindow) {
            //存在可回收利用的infoWindow, 直接更新内容返回
            recycledInfoWindow.setInfoTitle(dataItem.stationDTO.name)
            recycledInfoWindow.setInfoBody(
              self.getInfowindowContent(dataItem.signs)
            )
            return recycledInfoWindow
          }

          //返回一个新的InfoWindow
          return new SimpleInfoWindow({
            offset: new AMap.Pixel(0, -37),
            infoTitle: dataItem.stationDTO.name,
            infoBody: self.getInfowindowContent(dataItem.signs)
          })
        }
      })
      markerList.render(this.stationData)
      this.markerList = markerList
      return markerList
    }
  },

  mounted() {
    console.log('====mounted====', this.stationData)
  },

  watch: {
    stationData() {
      console.log('====change stationData====')
      if (this.markerList && this.markerList.clearData) {
        this.markerList.clearRecycle()
        this.markerList.clearData()
      }
      if (this.stationData && this.stationData.length) {
        let a = this.stationData.filter(item => item.signs.length)
        console.log('====aaa====', a)
        this.initMarker(
          this.MarkerList,
          this.SimpleMarker,
          this.SimpleInfoWindow
        )
      }
    }
  }
}
</script>

<style lang="scss">
.signin-station-map {
  height: 100%;
  .infowindow-body {
    font-size: 15px;
  }
}
</style>
