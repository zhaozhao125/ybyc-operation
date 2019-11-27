<template>
  <div class="search-charging">
    <el-dialog title="关联充电站" :visible.sync="visible" width="60%" :before-close="closeMe" append-to-body class="search-charging">
      <div class="search-charging-contant">
        <el-amap :zoom="10" :expandZoomRange="true" :zooms="[3,20]" :center="poiResultLocation" :events="mapEvents" :amap-manager="amapManager" :mapStyle='mapStyle' :plugin="plugins">
        </el-amap>
        <div class="search-input">
          <div>
            <el-input v-model="searchVal" placeholder="请输入充电站名称"></el-input>
            <el-button type="primary" @click="handleSearchCharging" :loading="loading">搜索</el-button>
            <el-button type="default" @click="handleSearchReset" :disabled="loading">重置</el-button>
          </div>
          <el-button type="primary" :disabled="!searchVal" @click="handleConfirm">选择该充电站</el-button>
        </div>
      </div>
    </el-dialog>
  </div>

</template>
<script>
import Vue from 'vue'
import { AMapManager } from 'vue-amap'
import mapConfig from '@/config/map-config'
let amapManager = new AMapManager()
const getChargingData = (getData, name) => {
  Vue.prototype.$service.get_chargingStationList(name).then(res => {
    let websiteData = res.data.data.map(item => {
      let obj = {
        id: item.id,
        fastPileNum: String(item.fastPileNum),
        slowPileNum: String(item.slowPileNum),
        name: item.stationName ? item.stationName : '未知',
        image: './static/img/charging.png'
      }
      // 如果能转成数字类型
      if (!isNaN(item.lng) || !isNaN(item.lat)) {
        obj.lngLatArr = [item.lng, item.lat] // 经纬度
      }
      return obj
    })
    getData(websiteData)
  })
}
export default {
  name: 'search-charging',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    let self = this
    return {
      amapManager,
      zoom: mapConfig.zoom,
      center: mapConfig.center,
      mapStyle: mapConfig.mapStyle[mapConfig.selectedStyle].url,
      searchVal: '',
      chargingStationName: '',
      chargingDataObj: {},
      loading: false,
      poiResultLocation: [113.695624, 34.876356],
      markerList: [], // 渲染的充电站数据
      plugins: [
        {
          pName: 'Scale', // 比例尺插件
          position: 'LB'
        }
      ],
      mapEvents: {
        // 地图初始化完毕
        init(map) {
          AMapUI.loadUI(['control/BasicControl'], BasicControl => {
            let zoomCtrl = new BasicControl.Zoom({
              position: {
                right: '10px',
                bottom: '10px'
              },
              showZoomNum: true
            })
            map.addControl(zoomCtrl)
          })
          // 拿到数据
          self.getChargingStationData(map)
        }
      }
    }
  },
  methods: {
    handleConfirm() {
      this.$emit('selectChargingStation', this.chargingDataObj)
      this.$emit('update:visible', false)
    },
    // 搜索
    handleSearchCharging() {
      this.handleData(this.searchVal)
    },
    // 重置
    handleSearchReset() {
      this.searchVal = ''
      this.handleData(this.searchVal)
    },
    closeMe() {
      // 改变父组件传给子组件的状态
      this.$emit('update:visible', false)
    },
    getChargingStationData(map) {
      AMapUI.loadUI(['misc/MarkerList', 'overlay/SimpleMarker', 'overlay/SimpleInfoWindow'], (MarkerList, SimpleMarker, SimpleInfoWindow) => {
        this.markerList = new MarkerList({
          // 关联的map对象
          map: map,
          autoSetFitView: true,
          // 返回数据项的位置
          getPosition: dataItem => {
            return dataItem.lngLatArr
          },
          // 返回数据项对应的Marker
          getMarker: (dataItem, context, recycledMarker) => {
            // 存在可回收利用的marker
            if (recycledMarker) {
              // 直接更新内容返回
              recycledMarker.setIconStyle(dataItem.image)
              return recycledMarker
            }
            return new SimpleMarker({
              iconStyle: dataItem.image,
              showPositionPoint: false,
              offset: new AMap.Pixel(-15, -35)
            })
          },
          // 返回数据项对应的infoWindow
          getInfoWindow: dataItem => {
            return new AMap.InfoWindow({
              offset: new AMap.Pixel(4, -35),
              content: `
                                <div class="car-panel">
                                    <div class="panel-header">
                                        <h3>${dataItem.name}</h3>
                                    </div>
                                </div>`
            })
          }

        })
        this.markerList.on('markerClick', (event, record) => {
          this.searchVal = record.data.name
          this.chargingDataObj = {
            chargingId: record.data.id,
            chargingName: record.data.name,
            slowPileNum: record.data.slowPileNum,
            fastPileNum: record.data.fastPileNum
          }
          console.log(this.chargingDataObj)
        })
        // 拿到数据
        this.handleData()
      }
      )
    },
    handleData(name) {
      this.loading = true
      getChargingData(websiteData => {
        this.loading = false
        if (!websiteData.length) {
          this.$message.warning('无搜索结果')
          return
        }
        // 渲染数据
        this.markerList.render(websiteData)
      }, name)
    }
  }
}
</script>

<style lang='scss'>
  // .search-charging {
  //   background: red;
  // }
  .search-charging {
    .search-charging-contant {
      // width: 100%;
      min-width: 500px;
      height: 400px;
      height: 35vw;
      position: relative;
      .search-input {
        white-space: nowrap;
        width: 100%;
        padding: 0 5px;
        position: absolute;
        display: flex;
        justify-content: space-between;
        top: 5px;
        z-index: 200;
        .el-input {
          width: 400px;
        }
      }
    }
    .search-charging-station-footer {
      p {
        float: left;
        span {
          color: $color-red;
        }
      }
    }
    .amap-container img {
      width: 35px;
    }
  }
</style>
