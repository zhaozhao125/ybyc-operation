<template>
  <div id="charging-pile-network-map">
    <div>
      <v-search :searchSettings="searchSettings" @search="handleSearch" labelWidth="100px">
        <template slot="stationName" slot-scope="scope">
          <div class="select-content">
            <span class="select-website-item">
              <website-select v-model="scope.model.stationName" placeholder="请输入站点名" isRequest></website-select>
              <!-- 根据运营城市id来请求网点数据 -->
            </span>
          </div>
        </template>
      </v-search>
    </div>

    <div class='map-content' id="mapContent">
      <el-amap vid="amapDemo" :center="center" :zoom="zoom" :mapStyle='mapStyle'>
        <el-amap-marker v-for="(marker, index) in markers" :position="marker.position" :icon="marker.icon" :events="marker.events" :vid="index" :key="index"></el-amap-marker>
        <el-amap-info-window v-if="window" :position="window.position" :visible="window.visible" :content="window.content"></el-amap-info-window>
      </el-amap>
    </div>
  </div>
</template>

<script>
import VueAMap from 'vue-amap'
import searchSelect from '@/components/website-select'
import websiteSelect from './components/website-select'

import mapConfig from '@/config/map-config'
import { handleSubmitSearchData } from '@/utils/common.js'

let amapManager = new VueAMap.AMapManager()
// setTimeout(() => {
//                   location.reload();
//                 }, 2000);
// import { AMapManager } from "vue-amap";
// 回调

export default {
  name: 'branches-map-list',
  // 和视图有渲染
  data() {
    let self = this
    return {
      zoom: 10,
      center: [113.670004, 34.764779],
      markers: [],
      windows: [],
      window: '',
      searchSettings: [{
        label: '充电站名',
        name: 'stationName',
        type: 'text',
        placeholder: '输入充电站名',
        visible: true
      }, {
        label: '城市',
        name: 'cityId',
        type: 'remoteCity',
        visible: true

      }, {
        label: '站点类型',
        name: 'stationType',
        type: 'select',
        visible: false,
        options: [
          {
            value: '',
            label: '不限'
          },
          {
            value: 'OPEN',
            label: '开放站点'
          },
          {
            value: 'SPECIAL',
            label: '专用站点'
          }
        ]
      }

      ],
      amapManager,
      operationCityId: null,
      plugin: [
        {
          pName: 'Scale'
        }
      ], // 比例尺插件
      mapStyle: mapConfig.mapStyle[mapConfig.selectedStyle].url,
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
          self.getWebsiteInfo(map)
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
        }
      }
    }
  },
  computed: {

  },
  watch: {

  },
  methods: {

    getAllChargePileNetworks(cityId = 0) {
      this.handleSearch({}, 1)
      if (cityId) {
        this.searchData.cityId = 410100
      }

      this.$service.getAllChargePileNetworks(this.searchData).then(res => {
        console.dir('getChargePileNetworkList')
        this.markers = res.data.data
      })
    },
    // 重置
    resetSearch() {
      this.handleData()
    },
    // 1. 查询
    handleSearch(data = {}, flag = 0) {
      this.polygonArr = []
      let searchData = Object.assign({}, data)
      searchData = handleSubmitSearchData(searchData)
      this.searchData = searchData

      if (flag == 0) {
        this.handleData(this.searchData)
      }
    },

    handleData(params) {
      this.$service.getAllChargePileNetworks(this.searchData).then(res => {
        console.dir('getChargePileNetworkList')
        this.initMarkers(res.data.data)
      })
    },

    initMarkers(rows) {
      // 清除上次的标识
      this.markers = []
      this.windows = []
      this.window = false

      if (rows.length <= 0) {
        return false
      }

      let self = this

      let markers = []
      let windows = []
      let lng = 0
      let lat = 0

      for (let idx in rows) {
        lng = (rows[idx].lng)
        lat = (rows[idx].lat)
        if (lng.length <= 0 || lat.length <= 0) {
          continue
        }

        markers.push(
          {
            position: [rows[idx].lng, rows[idx].lat],
            icon: './static/img/charging.png',
            events: {
              click() {
                self.windows.forEach(window => {
                  window.visible = false
                })

                self.window = self.windows[idx]
                self.$nextTick(() => {
                  let params = {
                    id: self.window.data.stationId
                  }

                  self.$service.getChargingPileNetworkDetial2Edit(params).then(res => {
                    if (res.data.code == 0) {
                      let row = res.data.data
                      // 居中先
                      self.window.position = [row.lng, row.lat]
                      self.center = [row.lng, row.lat]

                      let statuTxt = row.enabled == true ? '启用' : '禁用'
                      let content = ''

                      self.window.content = `<div class="car-panel">
                          <div class="panel-header">
                              <h3>${row.stationName}</h3>
                              </div>
                              <div class="panel-content">
                                  <ul>
                                      <li ><span class="panel-key">站点类型：</span><span class="panel-value"> ${row.stationTypeName} </span></li>
                                      <li ><span class="panel-key">营业时间：</span><span class="panel-value">${row.openTime} </span></li>
                                      <li ><span class="panel-key">服务电话：</span><span class="panel-value">${row.telephone}</span></li>
                                      <li ><span class="panel-key">地址：</span><span class="panel-value">${row.address}</span></li>
                                      <li ><span class="panel-key">启用状态：</span><span class="panel-value">${statuTxt}</span></li>
                                  </ul>
                              </div>
                      </div>`
                      self.window.visible = true
                    }
                  })
                })
              }
            }
          }
        )

        windows.push({
          position: [rows[idx].lng, rows[idx].lat],
          content: `<div class="prompt">站点详情</div>`,
          visible: false,
          data: rows[idx]
        })

        this.markers = markers
        this.windows = windows
        this.center = [lng, lat]
      }
    }
  },
  components: {
    searchSelect,
    websiteSelect
  },
  mounted() {
    this.handleSearch({ cityId: 410100 })
  }
}
</script>

<style lang="scss">
#charging-pile-network-map {
  overflow-y: hidden;
  .prompt {
    background: white;
    width: 240px;
    height: auto;
    text-align: center;
  }
  .amap-info {
    div {
      bottom: 30px !important;
      left: 4px;
    }
  }

  .map-content {
    position: relative;
    top: 20px;
    left: 0;
    right: 0;
    bottom: 0px;
    width: 100%;
    height: 100%;
  } // 网点图标大小
  .amap-container img {
    width: 30px;
  }
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
