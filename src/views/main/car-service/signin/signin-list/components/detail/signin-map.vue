<template>
  <div class="signin-map">
    <div class="map-container">
      <el-amap ref="amap" :center="center" :zoom="zoom" :amap-manager="amapManager" :events="events" :plugin="plugins" :mapStyle="mapStyle" :expandZoomRange="true" :zooms="[3,20]" class="amap">
      </el-amap>
    </div>
    <div class="signin-list" @click="handleClickSigninList">
      <ul>

      </ul>
    </div>
  </div>
</template>

<script>
import imgViewer from '@/components/img-viewer/'
import mapConfig from '@/config/map-config'
import { AMapManager } from 'vue-amap'
let amapManager = new AMapManager()
export default {
  name: 'signin-map',

  props: {
    signInfoList: {
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
        click: e => {}
      },

      currentIndex: 1
    }
  },

  methods: {
    initMarker(MarkerList, SimpleMarker, SimpleInfoWindow) {
      let markerList = new MarkerList({
        map: this.amapManager.getMap(),
        listContainer: this.$el.querySelector('.signin-list ul'),
        autoSetFitView: true,
        // 从数据中读取位置, 返回lngLat
        getPosition: function(item) {
          return [item.longitude, item.latitude]
        },
        // 数据ID，如果不提供，默认使用数组索引，即index
        getDataId: function(item, index) {
          return item.id
        },
        // 构造marker用的options对象, content和title支持模板，也可以是函数，返回marker实例，或者返回options对象
        getMarker: function(dataItem, context, recycledMarker) {
          //存在可回收利用的marker
          if (recycledMarker) {
            //直接更新内容返回
            recycledMarker.setIconLabel({
              innerHTML: context.index + 1,
              style: {
                color: '#fff'
              }
            })
            recycledMarker.setIconStyle(
              dataItem.signTypeVal == 'outside' ? 'green' : 'yellow'
            )
            return recycledMarker
          }

          //返回一个新的Marker
          return new SimpleMarker({
            containerClassNames: 'my-marker',
            iconTheme: 'fresh',
            iconStyle: dataItem.signTypeVal == 'outside' ? 'green' : 'yellow',
            iconLabel: {
              innerHTML: context.index + 1,
              style: {
                color: '#fff'
              }
            }
          })
        },
        //返回数据项对应的infoWindow
        getInfoWindow: function(dataItem, context, recycledInfoWindow) {
          if (recycledInfoWindow) {
            //存在可回收利用的infoWindow, 直接更新内容返回
            recycledInfoWindow.setInfoTitle(dataItem.signTypeVal==='inside'?dataItem.stationName:dataItem.stationAddress)
            recycledInfoWindow.setInfoBody(dataItem.signTypeVal==='inside'?'网点内签到':'网点外签到')
            return recycledInfoWindow
          }

          //返回一个新的InfoWindow
          return new SimpleInfoWindow({
            offset: new AMap.Pixel(0, -37),
            infoTitle: dataItem.signTypeVal==='inside'?dataItem.stationName:dataItem.stationAddress,
            infoBody: dataItem.signTypeVal==='inside'?'网点内签到':'网点外签到'
          })
        },
        getListElement: function(dataItem, context, recycledListElement) {
          let imgList = ''
          if (dataItem.images && dataItem.images.length) {
            imgList = dataItem.images
              .map(imgItem => {
                return `<img src="${imgItem}">`
              })
              .join('')
          }
          var tpl = `<div class="signin-info">
            <div class="signin-index">
              <%- signinIndex %>
            </div>
            <div class="signin-time">
              <%- signinTime %>
            </div>
            <div class="signin-detail">
              <h4><%- stationName %></h4>
              <p><%- dataItem.stationAddress %></p>
              <p>备注：<%- dataItem.remark %></p>
              <div class="signin-imgs">${imgList}</div>
            </div>
          </div>`

          var content = MarkerList.utils.template(tpl, {
            dataItem: dataItem,
            stationName:
              dataItem.signTypeVal === 'outside'
                ? '网点区域外签到'
                : dataItem.stationName,
            signinTime: dataItem.createTime.split(' ').pop(),
            signinIndex: context.index + 1
          })

          if (recycledListElement) {
            //存在可回收利用的listElement, 直接更新内容返回
            recycledListElement.innerHTML = content
            return recycledListElement
          }

          //返回一段html，MarkerList将利用此html构建一个新的dom节点
          return '<li>' + content + '</li>'
        }
      })
      markerList.on('markerClick', () => {
        setTimeout(() => {
          this.$el.querySelector('.signin-list .selected').scrollIntoView()
        }, 100)
      })
      markerList.render(this.signInfoList)
      this.markerList = markerList
      return markerList
    },
    handleClickSigninList(event) {
      if (event.target.src) {
        let allImgs = Array.from(
          event.target.parentElement.querySelectorAll('img')
        )
        let index = allImgs.indexOf(event.target)
        let imgArr = allImgs.map(item => {
          return item.src
        })
        imgViewer.viewImg(imgArr)
        imgViewer.getViewer().view(index)
      }
    }
  },

  mounted() {},

  watch: {
    signInfoList() {
      if (this.markerList && this.markerList.clearData) {
        this.markerList.clearRecycle()
        this.markerList.clearData()
        if (this.signInfoList.length) {
          this.initMarker(
            this.MarkerList,
            this.SimpleMarker,
            this.SimpleInfoWindow
          )
        }
      }
    }
  }
}
</script>

<style lang="scss">
.signin-map {
  display: flex;
  flex-direction: row;
  position: relative;
  .map-container {
    width: 50%;
    height: 40vw;
    max-height: 550px;
    min-height: 300px;
  }
  .signin-list {
    width: 50%;
    padding-left: 50px;
    position: absolute;
    right: 0;
    height: 100%;
    overflow: auto;
    ul {
      .amap-ui-markerlist-list-ele {
        margin-bottom: 15px;
        padding-bottom: 10px;
        border-bottom: 1px solid $color-border;
        .signin-info {
          display: flex;
          flex-direction: row;
          cursor: pointer;
          .signin-index {
            width: 30px;
            height: 30px;
            text-align: center;
            line-height: 30px;
            background-color: $color-blue;
            color: #fff;
            border-radius: 50%;
          }
          .signin-time {
            padding: 0 10px;
          }
          .signin-detail {
            flex: 1;
            h4 {
              margin-bottom: 10px;
              font-size: 15px;
            }
            p {
              font-size: 14px;
            }
            .signin-imgs {
              img {
                width: 50px;
                height: 50px;
                object-fit: cover;
                object-position: center;
                margin-right: 10px;
                cursor: zoom-in;
              }
            }
          }
        }
        &.selected {
          .signin-info .signin-detail h4 {
            color: $color-blue;
          }
        }
      }
    }
  }
}
</style>
