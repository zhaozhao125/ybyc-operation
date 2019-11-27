<template>
  <section id="site-map">
    <el-button type="text" @click="showMap">查看地图</el-button>
    <el-dialog :visible.sync='dialogVisible' title='查看地图' width='600' v-if="dialogVisible" @close='closeDialog'>
      <div class="map-content" v-loading="loading" :element-loading-text="loadingConfig.loadingText" :element-loading-spinner="loadingConfig.loadingSpinner" :element-loading-background="loadingConfig.loadingBackground">
        <el-amap :center="centerPosition" v-show="address" :expandZoomRange='true' :zoom='15' :zooms="[3,20]" :plugin="plugin" :events="mapEvents" :mapStyle='mapStyle'>
          <!-- 报警位置 -->
          <el-amap-marker :content="problemIcon()" :position='centerPosition' :zIndex="zIndex" :visible='address&&!loading' :offset="[-18, -37]"></el-amap-marker>
          <!-- 报警窗体  只能有一个 用mark替代-->
          <el-amap-marker :visible='address&&!loading' :position="centerPosition" :content="problemContent()" :offset="handleErrWindowOffset" :zIndex="zIndex"></el-amap-marker>
          <!-- 所有网点 -->
          <el-amap-marker v-for="(marker,siteIndex) in siteMarkers" :autoSetFitView='false' :position="marker.position" :events="marker.events" :key="siteIndex+'c'" :template="marker.template" :offset='[-25,-60]'></el-amap-marker>
          <!-- 信息窗口 -->
          <el-amap-info-window v-for="(infoWindow,windowIndex) in siteWindows" :autoMove="false" :position="infoWindow.position" :visible="infoWindow.visible" :key="windowIndex+'d'" :content="infoWindow.content" isCustom :offset="[5, -65]"></el-amap-info-window>
          <!-- 多边形围栏 -->
          <el-amap-polygon :path="polygon.path" v-for="(polygon, index) in polygonArr" :visible='polygon.visible' :key="index" :fillColor='fenchColorObj.fillColor' :fillOpacity='fenchColorObj.fillOpacity' :strokeColor='fenchColorObj.strokeColor' :strokeWeight='fenchColorObj.strokeWeight' :strokeOpacity='fenchColorObj.strokeOpacity'></el-amap-polygon>
        </el-amap>
      </div>
    </el-dialog>
  </section>
</template>
<script>
import { getAddress } from '@/utils/map-util.js'
import mapConfig, { fenchColor } from '@/config/map-config'
import loadingConfig from '@/config/loading'
import { getStationIconText } from '@/utils/common'

export default {
  name: 'siteMap',
  props: {
    // 位置
    centerPosition: {
      type: Array,
      required: false
    },
    iconType: String,
    siteItemData: Object
  },
  data() {
    let self = this
    return {
      loading: false,
      loadSuccess: false,
      plugin: [
        {
          pName: 'Scale'
        }
      ], // 比例尺插件
      mapStyle: mapConfig.mapStyle[mapConfig.selectedStyle].url,
      polygonArr: [], // 围栏数组
      dialogVisible: false,
      siteWindows: [], // 窗体列表
      siteMarkers: [], // 网点列表
      address: '',
      zIndex: 1000,
      loadingConfig,
      windowMarkVisible: false,
      mapEvents: {
        // 初始化时加载
        init(map) {
          window.AMap.event.addListener(map, 'zoomend', () => {
            self.polygonArr.forEach(item => {
              if (map.getZoom() >= 14) {
                item.visible = true
              } else {
                item.visible = false
              }
            })
          })
          window.AMapUI.loadUI(['control/BasicControl'], BasicControl => {
            let zoomCtrl = new BasicControl.Zoom({
              position: {
                right: '10px',
                bottom: '10px'
              },
              showZoomNum: true
            })
            map.addControl(zoomCtrl)
          })
        }
      }
    }
  },
  mounted() {
    this.$nextTick(() => { })
  },
  computed: {
    fenchColorObj() {
      return fenchColor
    },
    handleErrWindowOffset() {
      return this.iconType && this.iconType === 'carIcon' ? [-100, -30] : [-88, -35]
    }
  },
  methods: {
    closeDialog() {
      this.polygonArr = []
    },
    problemContent() {
      if (this.address) {
        this.windowMarkVisible = true
      }
      return `<div class="dialog-mark-content "><div  class="dialog-mark dialog-cursor"><span>${this.address}</span></div><div class="arrow-mark"></div></div>`
    },
    problemIcon() {
      if (this.iconType && this.iconType === 'carIcon') {
        return `<img src="./static/img/car-error.png" class="icon big-icon" ></img>`
      } else if (this.siteItemData) {
        return this.handleSiteHTML(this.siteItemData)
      }
    },
    handleSiteHTML(data) {
      return `<div class="station-content ${data.chargingId ? 'station-offset' : ''}"><img  src="./static/img/station/${data.chargingId ? 'has-charge' : 'no-charge'}.png"></img><h3>${getStationIconText(data)}</h3></div>`
    },
    showMap() {
      // 获取地理位置
      if (!this.centerPosition.length || this.centerPosition[0] < 0 || this.centerPosition[1] < 0) {
        this.$message.warning('地理位置错误')
        return
      }
      this.$nextTick(() => {
        this.dialogVisible = true
      })
      this.getAllWebSite()
      getAddress(this.centerPosition).then(res => {
        this.address = res
      })
    },
    getAllWebSite() {
      this.loading = true
      this.$service
        .post_openWebSite()
        .then(res => {
          this.dataHandle(res.data.data)
        })
        .catch(error => {
          this.loading = false
        })
      // 获取所有网点列表
    },
    // 处理数据
    dataHandle(siteData) {
      this.polygonArr = siteData.map(item => {
        return {
          path: item.returnCarPolygon,
          visible: true
        }
      })
      let centerIndex = siteData.findIndex(item => {
        return (
          item.longitude == this.centerPosition[0] || item.latitude == this.centerPosition[1]
        )
      })
      siteData.splice(centerIndex, 1)
      // 网点列表
      this.siteMarkers = siteData.map((siteItem, siteIndex) => {
        let self = this
        return {
          position: [siteItem.longitude, siteItem.latitude],
          template: self.handleSiteHTML(siteItem),
          events: {
            click() {
              self.siteWindows.forEach((item, index) => {
                item.visible = index === siteIndex
              })
            }
          }
        }
      })
      // 窗体列表
      this.siteWindows = siteData.map(winItem => {
        return {
          position: [winItem.longitude, winItem.latitude],
          content: `${winItem.name}`,
          visible: false
        }
      })
      this.loading = false
      this.loadSuccess = true
    }
  },
  watch: {}
}
</script>

<style lang='scss'>
#site-map {
  .map-content {
    height: 500px;
  } // 覆盖默认样式
  .amap-info-content {
    overflow: hidden;
  }
  .dialog-cursor {
    cursor: default;
  }
  .prompt {
    width: 100px;
    height: 30px;
    text-align: center;
  }

  .site-dialog {
    background: white;
    width: 100px;
  }

  .icon {
    object-fit: contain;
    object-position: center;
    width: 27px;
  }
  .big-icon {
    width: 34px;
  }

  .dialog-mark-content {
    // 相对于mark点定位
    position: absolute;
    bottom: 0px;
    left: 0px;
    width: 200px;
    display: flex;
    flex-direction: column;
    align-items: center;
    .dialog-mark {
      background: white;
      width: 100%;
      padding: 2px;
      border-radius: 13px;
      display: flex;
      align-items: center;
      justify-content: center;
      white-space: normal;
      span {
        width: 200px;
        text-align: center;
        padding: 5px;
        line-height: 15px;
      }
    }
    .arrow-mark {
      width: 0px;
      height: 0px;
      border-width: 10px;
      border-style: solid;
      border-color: white transparent transparent transparent;
    }
  }
  .el-dialog__body {
    padding-top: 10px;
  }
  .station-content {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    border-radius: 50%;
    width: 60px;
    height: 60px;
    h3,
    img {
      position: absolute;
    }
    img {
      width: 55px;
    }
    h3 {
      margin-top: -4px;
      font-size: 12px;
    }
  }
  .station-offset {
    h3 {
      margin-top: 2px;
      margin-left: -2px;
    }
  }
}
</style>
