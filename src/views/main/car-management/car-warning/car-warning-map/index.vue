<template>
  <div id="car-warning-map">
    <div class="search-content">
      <div>
        <search-select class="search-select" v-model="params.cityId" type="city" placeholder="请选择运营城市" :clearable='false' :authedCities='true'></search-select>
        <el-button type="primary" @click='refresh(true,true)'>{{'刷新'}}</el-button>
      </div>

      <span class="time" style="color:#787878">
        <span style="padding-right:10px;">近3天待处理事件</span>上次刷新时间：{{new Date()/1000|formatData(true)}}</span>
    </div>
    <div class='map-content map' v-loading="mapLoading" :element-loading-text="loadingConfig.loadingText" :element-loading-spinner="loadingConfig.loadingSpinner" :element-loading-background="loadingConfig.loadingBackground">
      <div class="warning-detail" v-show="isDetail">
        <el-collapse v-model="activeNames" accordion v-show='detailDataArr.length'>
          <el-collapse-item v-loading="item.detailLoading" :name="index" v-for='(item,index) in detailDataArr' :key="index">
            <template slot="title">
              <span>{{ item.carNumber}}（{{item.typeCodeName}}
                <i v-show='item.typeCodeName'>&nbsp;_&nbsp;</i>{{item.eventName}}）</span>
            </template>
            <div class="detail-content">
              <ul>
                <li>租赁状态：{{item.detailData.rentStatus}} </li>
                <li>在线状态：{{item.detailData.active}}</li>
                <li>电源状态：{{item.detailData.charging}}</li>
                <li>电量：{{item.detailData.soc}}</li>
                <li>时速：{{item.detailData.speed}} </li>
                <li>钥匙状态：{{item.detailData.acc}} </li>
                <li>时间：{{item.detailData.reportTime}}</li>
                <li>地址：{{item.detailData.address}}</li>
              </ul>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
      <div class="warning-status" v-loading="statusLoading">
        <el-tooltip placement="left" v-for="(dict,index) in distList" :key="index">
          <div class="status-item" :class="'status-item-' + index" @click="handleDataGroup(dict.code)">
            <div>
              <span>
                <i :style="dictColor(dict.code)">{{carWarningNum(1,dict.code)}}</i>
                <i>个事件</i>
              </span>
              <span>{{dict.name}}</span>
            </div>
          </div>
          <div slot="content" class="tip">
            <p>{{dict.name}}</p>
            <p v-for="item in dict.event" :key="item.code">
              <span class="name">{{item.name}}:</span>
              <span class="number">{{carWarningNum(2,item.code)}}</span>
            </p>
          </div>
        </el-tooltip>
      </div>
      <el-amap :zoom="10" :expandZoomRange="true" :zooms="[3,20]" :center="poiResultLocation" :events="mapEvents" :amap-manager="amapManager" :mapStyle='mapStyle' :plugin="plugin"> </el-amap>
    </div>
  </div>
</template>
<script>
import loadingConfig from '@/config/loading'
import searchSelect from '@/components/website-select'
import mapConfig from '@/config/map-config'
import VueAMap from 'vue-amap'
import { getWarningDetailData } from './../common'
import { renderMassPoint, statueMapDotColor, refreshTime } from '@/utils/mass-point-map'
import _debounce from 'lodash/debounce'
let amapManager = new VueAMap.AMapManager()
export default {
  name: 'car-warning-map',
  components: {
    searchSelect
  },
  mounted() {
    this.$nextTick(() => {

    })
  },
  computed: {
    // 获取标签页的数据
    activeTab() {
      return this.$store.getters.activeTab.name
    }
  },
  watch: {
    activeTab(newTab) {
      if (newTab === 'carWarningMap') {
        clearInterval(this.timingRefresh)
        this.refresh()
        this.status_data()
        this.getTimingRefresh()// 调用定时器
        if (this.isRefresh) {
          this.refresh(true)
          this.isRefresh = false
        } else {
          this.refresh()
        }
      } else {
        clearInterval(this.timingRefresh)
      }
    }
  },
  destroyed() {
    clearInterval(this.timingRefresh)
  },
  data() {
    let self = this
    return {
      // detailLoading: false,
      activeNames: [0], // 打开折叠面板
      amapManager,
      loadingConfig,
      statusLoading: false,
      loading: false,
      isBreak: null,
      mapLoading: false,
      copyMapData: [],
      isDetail: true,
      distList: [], // 报警状态字典
      statisticsList: [], // 报警状态数量
      mapData: [],
      detailDataArr: [], // 详情数据
      detailData: null, // 点击每一个时传入的·数据
      multipleTypesNum: 0,
      typeCodeValue: '',
      polygon: null, // 围栏实例
      isClickDetail: false,
      isRefresh: false,
      params: {
        cityId: this.$store.getters.firstCityId,
        page: 1,
        pageSize: 5000,
        endDate: Date.parse(new Date()) / 1000,
        startDate: Math.ceil(new Date().setDate(new Date().getDate() - 3) / 1000)
      },
      infoWindow: null,
      pointSimplifierIns: null, // 海量点对象实例
      poiResultLocation: [113.541443, 34.807581],
      plugin: [
        {
          pName: 'Scale'
        }
      ],
      mapStyle: mapConfig.mapStyle[mapConfig.selectedStyle].url,
      mapEvents: {
        init(map) {
          self.get_data()
          self.status_data()
          self.getTimingRefresh()
          self.getOperationCityInfo()
        }
      }
    }
  },
  methods: {
    // get_operationCityInfo
    getOperationCityInfo() {
      let map = this.amapManager.getMap()
      this.$service.get_operationCityInfo(this.params.cityId).then(res => {
        this.polygon = new AMap.Polygon({
          map: map,
          zIndex: 99,
          bubble: true,
          path: res.data.data.polygon,
          draggable: false,
          strokeColor: '#fdd000', // 线颜色
          strokeOpacity: 0.5, // 线透明度
          strokeWeight: 2, // 线宽
          fillColor: '#fdd000', // 填充色
          fillOpacity: 0.02 // 填充透明度
        })
        this.polygon.setMap(map)
        this.polygon.show()
        map.setFitView()
      })
    },
    openDetailCollapse(detailData) {
      this.activeNames = [0]
      this.isDetail = true
      // 如果该id是一个数组
      if (Object.prototype.toString.call(detailData.data.id) === '[object Array]') {
        // 需要请求多次接口
        // console.log(console.log(item.data))
        let detailDataArr = detailData.data.id.map(itemId => {
          return {
            id: itemId,
            detailData: {},
            detailLoading: true,
            eventName: '',
            carNumber: '',
            typeCodeName: ''
          }
        })
        detailDataArr.forEach(itemObj => {
          getWarningDetailData(itemObj.id, detailData => {
            itemObj.detailData = detailData
            itemObj.detailLoading = false
            itemObj.carNumber = detailData.carNumber
          })
        })
        let evenCodeNameArr = []
        detailData.data.eventCode.forEach(itemEvent => {
          this.distList.forEach(parentItem => {
            parentItem.event.forEach(childItem => {
              if (childItem.code === itemEvent) {
                evenCodeNameArr.push(childItem.name)
              }
            })
          })
        })
        detailDataArr.forEach((itemObj, index) => {
          itemObj.eventName = evenCodeNameArr[index]
        })
        // 处理TypeCode不一样的数据
        if (detailData.data.multipleTypes && detailData.data.multipleTypes.length) {
          let typeItemNameArr = []
          detailData.data.multipleTypes.forEach(typeItemCode => {
            this.distList.forEach(parentItem => {
              if (parentItem.code === typeItemCode) {
                typeItemNameArr.push(parentItem.name)
              }
            })
          })
          detailDataArr.forEach((itemObj, index) => {
            itemObj.typeCodeName = typeItemNameArr[index]
          })
        } else {
          // 这里就是去除多个类型的点的数据 这个地方就不展示了
        }
        this.detailDataArr = detailDataArr
      } else {
        let detailDataArr = [{
          id: detailData.data.id,
          detailData: {},
          detailLoading: true,
          typeCodeName: '',
          carNumber: '',
          eventName: this.getEvenCodeName(detailData.data.eventCode)
        }]
        // 如果id是一个字符串
        // 请求一次接口
        detailDataArr.forEach(itemObj => {
          getWarningDetailData(itemObj.id, detailData => {
            itemObj.detailData = detailData
            itemObj.detailLoading = false
            itemObj.carNumber = detailData.carNumber
          })
        })
        this.detailDataArr = detailDataArr
        console.log(this.detailDataArr, 'aaaaaaaaaaaaa')
      }
      this.loading = true
    },
    handleDataGroup(typeCode) {
      console.log(typeCode)
      this.isDetail = false
      this.isClickDetail = false
      this.typeCodeValue = typeCode
      // let eventTypeArr = []
      // let noHandle = []
      this.refresh()
    },

    // 定时器
    getTimingRefresh() {
      this.timingRefresh = setInterval(() => {
        this.refresh()
        this.status_data()
        // this.isDetail = true
        // this
      }, refreshTime)
    },
    status_data() {
      this.statusLoading = true
      this.$service.getCarWarningDict(this.params.cityId).then(res => {
        this.distList = res.data.data
        this.statusLoading = false
      })
      this.$service.getCarWarningDictStatistics(this.params.cityId, this.params.startDate, this.params.endDate).then(res => {
        this.statisticsList = res.data.data
      })
    },
    handleRepeatData(mapData) {
      // console.log(mapData.length, '初始长度')
      //  根据经纬度不同分组
      let mapObj = {}
      mapData.forEach((mapDataItem, index) => {
        if (!mapObj[mapDataItem.lngLatArr.join('')]) {
          let arr = []
          arr.push(mapDataItem)
          mapObj[mapDataItem.lngLatArr.join('')] = arr
        } else {
          mapObj[mapDataItem.lngLatArr.join('')].push(mapDataItem)
        }
      })
      // console.log(mapObj)
      // 循环每一个经纬度相同的每一个数组
      Object.keys(mapObj).forEach(key => {
        // 经纬度相同 typeCode不相同
        let typeCodeArr = mapObj[key].map(item => {
          return item.typeCode
        })

        // console.log(eventCodeArr)
        // 找到类型不同经纬度相同的数据
        if (new Set(typeCodeArr).size > 1) {
          // console.log(mapObj[key], 'typeCode不同')
          let carId = []
          let multipleTypes = []
          let eventCodeArr = []
          mapObj[key].forEach(item => {
            carId.push(item.id)
            multipleTypes.push(item.typeCode)
            eventCodeArr.push(item.eventCode)
          })
          // console.log(carId)
          // 不同类型的数量不同类型的数量
          this.multipleTypesNum++
          // console.log(mapObj[key])
          // console.log(typeCodeArr)
          // 把原来的类型不同经纬度相同的数据的typeCode改变
          mapData.forEach((mapItem, index) => {
            // 如果他们的经纬度相同
            if (mapItem.lngLatArr.join('') === mapObj[key][0].lngLatArr.join('')) {
              mapItem.typeCode = 'multipleTypes'
              mapItem.id = carId
              mapItem.multipleTypes = multipleTypes
              mapItem.eventCode = eventCodeArr
            }
          })
        } else {
          // console.log(mapObj[key], 'typeCode相同')
          // 经纬度相同 typeCode相同 eventCode不同的数组
          // 处理
          // 经纬度相同 typeCode相同 eventCode不相同
          let eventCodeArr = mapObj[key].map(item => {
            return item.eventCode
          })

          if (new Set(eventCodeArr).size > 1) {
            let eventCode = []
            let id = []
            mapObj[key].forEach(item => {
              eventCode.push(item.eventCode)
              id.push(item.id)
            })
            // console.log(eventCodeArr, 'eventCode数组')
            mapData.forEach((mapItem, index) => {
              // 如果他们的经纬度相同
              if (mapItem.lngLatArr.join('') === mapObj[key][0].lngLatArr.join('')) {
                mapItem.eventCode = eventCode
                mapItem.id = id
              }
            })
          }
        }
      })
      // console.log(mapData, 'a')
    },
    // 处理数组
    get_data() {
      this.mapLoading = true
      this.$service.getCarWarningList(this.params).then(res => {
        if (!res.data.data.records.length) {
          this.$message.warning('该城市下暂无告警信息')
          this.mapLoading = false
          this.pointSimplifierIns.setData([])
          return
        }
        this.mapData.push(...res.data.data.records)
        // this.copyMapData.push(...res.data.data.records)
        // this.params.page++
        // if (res.data.data.totalElements < res.data.data.page * res.data.data.pageSize) {
        this.mapLoading = false
        new Promise((resolve, reject) => {
          resolve(this.mapData)
        }).then(data => {
          // 处理数据
          let carWarningData = []
          if (this.typeCodeValue) {
            data.forEach(item => {
              if (item.typeCode === this.typeCodeValue) {
                if (!isNaN(item.lng) && !isNaN(item.lat) && (item.lng >= 1 && item.lng < 200 && item.lat >= 1 && item.lat < 50)) {
                  carWarningData.push({
                    lngLatArr: [item.lng, item.lat],
                    id: item.id,
                    typeCode: item.typeCode, // 告警类别
                    eventCode: item.eventCode // 告警类别事件
                  })
                }
              }
            })
          } else {
            data.forEach(item => {
              if (!isNaN(item.lng) && !isNaN(item.lat) && (item.lng >= 1 && item.lat >= 1)) {
                carWarningData.push({
                  lngLatArr: [item.lng, item.lat],
                  id: item.id,
                  typeCode: item.typeCode, // 告警类别
                  eventCode: item.eventCode // 告警类别事件
                })
              }
            })
          }
          // 处理数据增加种类
          this.handleRepeatData(carWarningData)
          // this.amapManager.getMap().setFitView()
          // this.polygon.show()
          if (!this.isBreak) {
            this.isBreak = true
            renderMassPoint(this.amapManager.getMap(), carWarningData).then((newProject) => {
              this.pointSimplifierIns = newProject.pointSimplifierIns
              newProject.pointSimplifierIns.on('pointClick', (e, item) => {
                // 点击的时候有一个点击状态
                this.isClickDetail = true
                this.isRefresh = false
                this.detailData = item
                this.openDetailCollapse(item)
              })
              // map.setZIndex({ zindex: 9999 })
              newProject.map.setFitView()
            })
          } else {
            this.pointSimplifierIns.setData(carWarningData)
          }
        })
        // } else {
        //   this.get_data()
        // }
      }).catch(err => {
        this.mapLoading = false
        // this.$message.warning('请求出错')
      })
    },
    // handleData()
    getEvenCodeName(code) {
      let evenCodeName = ''
      this.distList.forEach(parentItem => {
        parentItem.event.forEach(childItem => {
          if (childItem.code === code) {
            // evenCodeNameArr.push(childItem.name)
            evenCodeName = childItem.name
          }
        })
      })
      return evenCodeName
    },
    carWarningNum(num, type) {
      let carWarningNum, carWarningChildNum
      this.statisticsList.forEach(item => {
        if (item.code === type && num === 1) {
          carWarningNum = item.sumCount
        } else {
          item.childStatistics.forEach(data => {
            if (data.code === type) {
              carWarningChildNum = data.sumCount
            }
          })
        }
      })
      return num === 1 ? carWarningNum : carWarningChildNum
    },
    dictColor(type) {
      return `color:${statueMapDotColor[type]}`
    },
    refresh: _debounce(function (isDetailOpen, isTypeCode) {
      // if (!this.params.cityId) {
      //   this.params.cityId = 410100
      // }
      // 刷新的时候隐藏当前的围栏
      this.polygon.hide()
      // 调用再次渲染
      this.getOperationCityInfo()
      this.multipleTypesNum = 0
      this.mapData = []
      this.copyMapData = []
      this.params.page = 1
      this.get_data()
      this.status_data()
      // 如果点击在刷新
      if (isTypeCode) {
        this.typeCodeValue = ''
      }
      //  点击刷新的时候隐藏状态栏
      this.isDetail = false
      isDetailOpen ? this.isRefresh = true : this.isRefresh = false
      if (this.detailData && !isDetailOpen && this.isClickDetail) {
        // 点击刷新之后隐藏状态栏 再从其他页面进来时不能走这个逻辑
        this.openDetailCollapse(this.detailData)
      }
    }, 50)
  }
}
</script>
<style lang="scss" >
.tip {
  p {
    // background: #FFAF9F;
    margin-bottom: 3px;
    margin-left: 8px;
    font-size: 15px;

    &:first-child {
      font-size: 15px;
      margin-left: 0;
      margin-bottom: 6px;
    }
    .name {
      color: #eeeeee;
    }
    .number {
      color: #ffffff;
      font-size: 20px;
      &::after {
        content: ' 个';
        font-size: 10px;
      }
    }
  }
}

#car-warning-map {
  width: 100%;
  height: 100%;
  padding: 0;
  position: relative;
  .el-loading-spinner .circular {
    height: 20px;
    width: 20px;
  }

  .map {
    .dot {
      position: absolute;
      top: 2vw;
      left: 0;
      z-index: 999;
    }
    .warning-detail {
      z-index: 999; // position: fixed;
      width: 280px;
      max-height: 97%;
      position: absolute;
      top: 15px;
      left: 13px;
      overflow-x: hidden;
      overflow-y: auto;
      .el-collapse-item__header {
        padding-left: 10px;
      }
      .detail-content {
        // padding-left: 10px;
        padding-left: 10px;
        padding-right: 5px; // background: red;
      }
    }
    .warning-status {
      // width: 134px;
      // text-align: center;
      z-index: 999;
      user-select: none;
      position: absolute;
      top: $map-ststus-top;
      right: $map-ststus-right;
      cursor: pointer;
      .status-item {
        height: 70px;
        width: 160px; // border: 1px solid #787878;
        border-left: 0;
        background: #ffffff;
        box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.2); // box-shadow: 2px 0px 10px #888888;
        display: flex;
        margin-bottom: 10px;
        > div {
          // background: red;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          margin-left: 20px;
          padding-top: 20px;
          padding-bottom: 10px;
          span {
            i {
              font-size: 12px; // 把斜体扶正
              font-style: normal;

              &:first-child {
                font-size: 32px;
              }
            }
            &:last-child {
              padding-left: 0px;
              font-size: 15px;
            }
          }
        }
        &.status-item-0 {
          &::before {
            background: #ff765c;
          }
        }
        &.status-item-1 {
          &::before {
            background: #5badfc;
          }
        }
        &.status-item-2 {
          &::before {
            background: #4e4e4e;
          }
        }
        &.status-item-3 {
          &::before {
            background: #51cd00;
          }
        }
        &.status-item-4 {
          &::before {
            background: #fdd000;
          }
        }
        &.status-item-5 {
          &::before {
            background: red;
          }
        }
        &::before {
          content: '';
          display: block;
          width: 8px;
          margin-top: -1px;
          height: 72px;
          overflow: hidden;
          background: #aaaaaa;
        }
      }
    }
  }
}
</style>
