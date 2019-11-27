<template>
  <div class="car-haima-map">
    <div class="search-content">
      <div>
        <search-select class="search-select" v-model="params.cityId" type="city" placeholder="请选择运营城市" :authedCities='true'></search-select>
        <el-button type="primary" @click='get_polygon()'>刷新</el-button>
      </div>
      <span class="time">上次刷新时间：{{refreshTime}}</span>
    </div>
    <el-amap :zoom="10" :expandZoomRange="true" :zooms="[3,20]" :center="locationCenter" :events="mapEvents" :amap-manager="amapManager" :mapStyle='mapStyle' :plugin="plugin"> </el-amap>
  </div>
</template>
<script>
import searchSelect from '@/components/website-select'
import handleDate from '@/utils/date-filter'
import VueAMap from 'vue-amap'
import mapConfig from '@/config/map-config'
import { renderMassPoint, statueMapDotColor } from '@/utils/mass-point-map'
export default {
  components: {
    searchSelect
  },
  data() {
    let self = this
    return {
      amapManager: new VueAMap.AMapManager(),
      refreshTime: handleDate(new Date() / 1000, true),
      locationCenter: [113.695624, 34.876356],
      mapStyle: mapConfig.mapStyle[mapConfig.selectedStyle].url,
      params: {
        cityId: this.$store.getters.filterCityId,
        page: 1,
        pageSize: 1000
      },
      plugin: [
        {
          pName: 'Scale'
        }
      ],
      mapEvents: {
        init(map) {
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
          // 获取围栏数据
          self.get_polygon()
        }
      }

    }
  },
  methods: {
    // 刷新
    getDataRefresh(isNotify) {
      let getDate = handleDate(new Date() / 1000, true)
      this.refreshTime = getDate
      // 先留着
      if (!isNotify) {
        return
      }
      this.$notify.info({
        title: `已刷新：${getDate}`,
        offset: 115
      })
    },
    getTimingRefresh() {
      this.timingRefresh = setInterval(() => {
        this.get_data(true, true, false)
      }, 3000000)
    },
    get_polygon() {
      clearInterval(this.timingRefresh)
      // 开始计时
      this.getTimingRefresh()
      this.getDataRefresh()
      let map = this.amapManager.getMap()
      this.$service.get_operationCityInfo(this.params.cityId).then(res => {
        let isNew
        if (this.polygon) {
          this.polygon.hide()
        }
        // 清澈地图上的点
        map.clearMap()
        if (!isNew) {
          this.polygon = new window.AMap.Polygon({
            map: map,
            zIndex: 99,
            bubble: true,
            draggable: false,
            strokeColor: '#fdd000', // 线颜色
            strokeOpacity: 0.5, // 线透明度
            strokeWeight: 2, // 线宽
            fillColor: '#fdd000', // 填充色
            fillOpacity: 0.02 // 填充透明度
          })
          isNew = true
        }
        this.polygon.setPath(res.data.data.polygon)
        this.polygon.show()
        map.setFitView()
        // 获取麻点数据
        this.get_data(isNew, false, true)
      })
    },
    get_data() {
      this.mapLoading = true
      this.$service.getStatusMapPagingOrSearch(this.params.cityId).then(res => {
        alert()
        // if (!res.data.data.records.length) {
        //   this.$message.warning('该城市下暂无数据')
        //   this.mapLoading = false
        //   this.pointSimplifierIns.setData([])
        //   return
        // }
        // this.mapData.push(...res.data.data.records)
        // this.params.page++
        // if (res.data.data.totalElements < res.data.data.page * res.data.data.pageSize) {
        //   this.mapLoading = false
        //   new Promise((resolve, reject) => {
        //     resolve(this.mapData)
        //   }).then(data => {
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
        //     // if (!this.isBreak) {
        //     this.isBreak = true
        //     // 因为第一次就没有进入到这里

        //     renderMassPoint(this.amapManager.getMap(), statusData).then((newProject) => {
        //       this.pointSimplifierIns = newProject.pointSimplifierIns
        //       newProject.pointSimplifierIns.on('pointClick', (e, item) => {
        //         this.loading = true
        //         this.getDetailData(item.data.carSn, (detailData) => {
        //           this.loading = false
        //           getAddress([detailData.lng, detailData.lat]).then(address => {
        //             detailData.address = address
        //             this.infoWindow = new window.AMap.InfoWindow({
        //               offset: new window.AMap.Pixel(0, -15),
        //               content: `
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
        //             })
        //             this.infoWindow.open(newProject.map, item.data.lngLatArr)
        //           })
        //         })
        //       })
        //     })
        //     // } else {
        //     //   this.pointSimplifierIns.setData(this.typeCode ? arr : statusData)
        //     // }
        //   })
        // } else {
        //   this.get_data()
        // }
      }).catch(err => {
        this.mapLoading = false
      })
    }
  }
}
</script>
