<template>
  <section id="branches-map-list">
    <div class="search-content">
      <div class="search">
        <search-select v-model="operationCityId" type="city" placeholder="请选择运营城市" class="search-select" :clearable='false' :authedCities='true'></search-select>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </div>
    </div>
    <div class='map-content' id="mapContent">
      <el-amap :zoom="10" :expandZoomRange="true" :zooms="[3,20]" :center="poiResultLocation" :events="mapEvents" :amap-manager="amapManager" :mapStyle='mapStyle' :plugin="plugin"> </el-amap>
    </div>
  </section>
</template>

<script>
import Vue from 'vue'
import VueAMap from 'vue-amap'
import searchSelect from '@/components/website-select'
import { handleWebsiteType, getStationIconText } from '@/utils/common'
import mapConfig, { fenchColor } from '@/config/map-config'
let amapManager = new VueAMap.AMapManager()
// setTimeout(() => {
//                   location.reload();
//                 }, 2000);
// import { AMapManager } from "vue-amap";
// 回调
const getWebsiteData = (getData, operationCityId) => {
  Vue.prototype.$service.post_allWebSite(operationCityId, {}, false, true).then(res => {
    // 需要判断一下是否有围栏和经纬度
    let websiteData = res.data.data.map(item => {
      let obj = {
        fencingArr: item.returnCarPolygon, // 围栏数组
        id: item.id,
        name: item.name ? item.name : '未知',
        address: item.address ? item.address : '未知',
        openingHours: item.openingHours ? item.openingHours : '未知',
        websiteType: item.type, // 网点类型
        phone: item.phone ? item.phone : '未知',
        open: item.open ? '启用' : '禁用',
        rendType: item.timeSharingStation && item.longRentStation ? '分时，短租' : item.timeSharingStation ? '分时' : '短租',
        timeSharingStation: item.timeSharingStation,
        longRentStation: item.longRentStation,
        // rendTypeCode:
        typeCode: item.typeCode,
        chargingId: item.chargingId// 充电站id
      }
      // 如果能转成数字类型
      if (!isNaN(item.latitude) && !isNaN(item.longitude)) {
        obj.lngLatArr = [item.longitude, item.latitude] // 经纬度
      }
      return obj
    })
    getData(websiteData)
  })
}
export default {
  name: 'branches-map-list',
  // 和视图有渲染
  data() {
    let self = this
    return {
      amapManager,
      operationCityId: this.$store.getters.firstCityId,
      plugin: [
        {
          pName: 'Scale'
        }
      ], // 比例尺插件
      mapStyle: mapConfig.mapStyle[mapConfig.selectedStyle].url,
      searchSettings: [
        {
          label: '运营城市',
          name: 'operationCityId',
          type: 'slot',
          visible: true
        }
      ],
      searchFlagBit: false,
      polygonList: null,
      overlayGroup: null,
      infoWindowList: [],
      poiResultLocation: [113.695624, 34.876356],
      polygonArr: [], // 围栏数组
      zoomend: null,
      markerList: null,
      mapEvents: {
        // 初始化时加载
        init(map) {
          AMap.event.addListener(map, 'zoomend', () => {
            self.zoomend = map.getZoom()
            // 如果有围栏数组
            if (self.overlayGroup) {
              // 判断是否显示围栏
              if (map.getZoom() >= 14) {
                self.overlayGroup.show()
              } else {
                self.overlayGroup.hide()
              }
            }
          })
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
          // 获取数据
          self.getWebsiteInfo(map)
        }
      }
    }
  },
  computed: {
    // 获取标签页的数据
    activeTab() {
      return this.$store.getters.activeTab
    },
    fenchColorObj() {
      return fenchColor
    }
  },
  watch: {
    activeTab(newTab) {
      if (newTab.name !== 'branchesMap') {
        this.markerList.closeInfoWindow()
      }
    }
  },
  methods: {
    getWebsiteInfo(map, operationCityId) {
      AMapUI.loadUI(['misc/MarkerList', 'overlay/SimpleMarker', 'overlay/SimpleInfoWindow'], (MarkerList, SimpleMarker, SimpleInfoWindow) => {
        this.markerList = new MarkerList({
          // 关联的map对象
          map,
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
            //    iconStyle: {
            //   //自定义外观
            //   url: "./static/img/website.png",
            //   size: [30, 35],
            //   ancher: [17, 31.5]
            // }
            // 返回一个新的Marker
            return new SimpleMarker({
              // iconStyle: dataItem.image,
              iconStyle: {
                src: `./static/img/station/${dataItem.chargingId ? 'has-charge' : 'no-charge'}.png`,
                style: {
                  width: '50px'
                  // backgroundColor: 'red'
                }
              },
              iconLabel: {
                innerHTML: `<h3>${getStationIconText(dataItem)}</h3>`, // 设置文字内容
                style: {
                  color: '#fff',
                  fontSize: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: dataItem.chargingId ? '-3px' : '10px',
                  marginRight: dataItem.chargingId ? '4px' : ''
                }
              },
              iconTheme: 'fresh',
              showPositionPoint: false,
              offset: dataItem.chargingId ? new AMap.Pixel(-23, -60) : new AMap.Pixel(-25, -51)
            })
          },

          // 返回数据项对应的infoWindow
          getInfoWindow: dataItem => {
            // 返回一个新的InfoWindow
            return new AMap.InfoWindow({
              offset: new AMap.Pixel(0, -60),
              // closeWhenClickMap:true,//鼠标点击地图之后关闭信息窗体
              content: `
          <div class="car-panel">
              <div class="panel-header">
                  <h3>${dataItem.name}</h3>
                  </div>
                  <div class="panel-content">
                      <ul>
                          <li ><span class="panel-key">租赁类型：</span><span class="panel-value"> ${dataItem.rendType} </span></li>
                          <li ><span class="panel-key">有无充电桩：</span><span class="panel-value"> ${dataItem.chargingId ? '有' : '无'} </span></li>
                          <li ><span class="panel-key">网点类型：</span><span class="panel-value">${handleWebsiteType(dataItem.websiteType)} </span></li>
                          <li ><span class="panel-key">营业时间：</span><span class="panel-value">${dataItem.openingHours}</span></li>
                          <li ><span class="panel-key">服务电话：</span><span class="panel-value">${dataItem.phone}</span></li>
                          <li ><span class="panel-key">启用状态：</span><span class="panel-value">${dataItem.open}</span></li>
                          <li ><span class="panel-key">地址：</span><span class="panel-value">${dataItem.address}</span></li>
                      </ul>
                  </div>
          </div>`
            })
          }
        })
        this.handleData(operationCityId)
      }
      )
    },
    // 重置
    resetSearch() {
      this.handleData()
    },
    // 注意 如果回调里面嵌套回调还要调用回调里面的嵌套函数
    // 搜索
    handleSearch() {
      this.polygonArr = []
      // if (!this.operationCityId) {
      //   this.operationCityId = 410100
      // }
      this.getWebsiteInfo(amapManager.getMap(), this.operationCityId)
      // this.getWebsiteInfo()
    },
    handleData(operationCityId) {
      getWebsiteData(websiteData => {
        if (!websiteData.length) {
          this.$message.warning('该城市下暂无网点')
          return
        }
        websiteData.forEach((item, index) => {
          // 把每次的围栏都push进去
          this.polygonArr.push(
            new AMap.Polygon({
              map: amapManager.getMap(),
              path: item.fencingArr,
              ...fenchColor
            })
          )
        })

        // 拿到数据的时候渲染点
        this.markerList.render(websiteData)
        this.overlayGroup = new AMap.OverlayGroup(this.polygonArr)
        if (!websiteData.length || !this.polygonArr.length) {
          this.overlayGroup = null
          return
        }
        this.overlayGroup.hide()
      }, this.operationCityId)
    }
  },
  components: {
    searchSelect
  }
}
</script>

<style lang="scss">
#branches-map-list {
  .amap-simple-marker-icon {
    height: 60px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  width: 100%;
  height: 100%;
  padding: 0 !important;
  position: relative;
  .search-content {
    z-index: 99;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    padding: $size-padding;
    box-shadow: 0px 0px 3px #666;
    background-color: $color-white;
    .search {
      display: flex;
      // margin-left: 70px;
      .search-select {
        width: 400px;
        margin-right: 30px;
      }
    }
  }
  // .amap-container img {
  //   width: 40px; // height: 40px;
  // }
  .car-panel {
    .panel-header {
      border-bottom: 1px solid $color-border;
      padding-bottom: 6px;
      h3 {
        font-size: 16px;
      }
    }
    .panel-content {
      padding: 6px 0;
      font-size: 14px;
      li {
        display: flex;
        flex-direction: row;
        margin-bottom: 5px;
        span.panel-key {
          width: 100px;
          display: inline-block;
          text-align: right;
          margin-right: 5px;
          color: $color-detail;
        }
        span.panel-value {
          flex: 1;
          display: inline-block;
        }
      }
    }
  }
}
</style>
