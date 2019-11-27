<template>

  <div class="car-dispatch" :class="{'full-screen':isFullScreen}" v-loading="mapLoading" element-loading-text="拼命加载中..." :element-loading-spinner="loadingConfig.loadingSpinner" :element-loading-background="loadingConfig.loadingBackground">
    <map-search @refresh='get_polygon()' isCityName v-model="cityId" :selectWidth='300' @change='selectChange' :changeTime='changeTime' :loading='timeLoading'>
      <template slot="district">
        <div class="type-select">
          <span class="type-name">片区</span>
          <el-select v-model="districtId" placeholder="请选择" class="multi-select" clearable>
            <el-option v-for="item in renderAreaList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
      </template>
      <template slot="select">
        <div class="type-select">
          <span class="type-name">网点状态</span>
          <el-select v-model="multipleValue" multiple placeholder="请选择" class="multi-select">
            <el-option v-for="item in handleStstus" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
      </template>
      <template slot='fullScreen'>
        <el-button type="text" class="full-screen-button" @click="isFullScreen = !isFullScreen">{{isFullScreen?'退出全屏':'全屏展示'}}</el-button>
      </template>
    </map-search>
    <div class='map-content'>
      <div class="map-detail-loading" v-show='websiteDetailLoading'>
        <i class="el-icon-loading"></i>拼命加载中...</div>
      <transition name="el-zoom-in-center">
        <div class="map-detail" v-loading="detailLoading" v-if='detailStation'>
          <div class="detail-heard">
            <div class="detail-close" @click="closeDetail">
              <i class="el-icon-close"></i>
            </div>
            <div class = "detail-station-infor">
              <div>
                <h3 style="colocr:#1d1d1d;padding-right:20px;" class = "station-name">
                  <div class = "baibuting" v-if = "detailStation.station.typeCode ==='casual'">
                    <img src="@/assets/img/baibuting.jpg" alt="">
                  </div>
                  <div>
                  {{detailStation.station.name}}({{detailStation.station.timeSharingStation&&detailStation.station.longRentStation?'分时/短租':detailStation.station.timeSharingStation?'分时':'短租'}})
                  </div>
                  </h3>
                <span class="address">地址：{{detailStation.station.address}}</span>
                <span style="display:flex">物理车位&nbsp;{{detailStation.station.parkings}} &nbsp;
                  <i class="type-color"> 最大管理车位&nbsp;{{detailStation.station.parkingsTop}}</i> &nbsp;
                  <i class="type-color"> 最小管理车位&nbsp;{{detailStation.station.parkingsMin}}</i>
                </span>
                <span style="display:flex" v-show="!isNaN(detailStation.station.fastPileNum)||!isNaN(detailStation.station.slowPileNum)||!isNaN(detailStation.station.availableFast)||!isNaN(detailStation.station.availableSlow)">
                  <i v-show="!isNaN(detailStation.station.fastPileNum)||!isNaN(detailStation.station.slowPileNum)">充电桩&nbsp;{{handleChargeNum(detailStation.station.fastPileNum,detailStation.station.slowPileNum)}}</i>&nbsp;
                  <i class="type-color" v-show="!isNaN(detailStation.station.availableFast)||!isNaN(detailStation.station.availableSlow)">空闲桩&nbsp;{{handleChargeNum(detailStation.station.availableFast+detailStation.station.availableSlow)}}</i>
                </span>
                <div class="car-number">
                  <span>
                    <span @click="handleCarFree('carsAll')" style="color:#5dade2">
                      <i>全部</i>
                      <i> {{detailStation.totalCarNum}}</i>
                    </span>
                    &nbsp;|&nbsp;
                    <span @click="handleCarFree('carsFree')" class="leisure">
                      <i> 空闲 </i>
                      <i>{{detailStation.freeCarNum}}</i>
                    </span>
                    &nbsp; |&nbsp;
                    <span @click="handleCarFree('appointment')" class="already">
                      <i>已预约</i>
                      <i>{{detailStation.occupiedCarNum}}</i>
                    </span>
                    &nbsp; |&nbsp;
                    <span @click="handleCarFree('maintain')" class="maintain">
                      <i> 维护中</i>
                      <i>{{detailStation.maintainCarNum}}</i>
                    </span>
                  </span>
                  <el-button type="text" @click="detailShow=!detailShow" v-show="detailStation.totalCarNum" style="padding-left: 10px;">
                    <i :class="{'el-icon-caret-top':detailShow,'el-icon-caret-bottom':!detailShow}"></i>{{detailShow?'收起':'展开'}}</el-button>
                </div>
              </div>
            </div>
          </div>
          <el-collapse-transition>
            <div v-show='detailShow' class="detail-content" :class="{'detail-padding':detailShow}">
              <div class="car-detail" v-for="(item,index) in carsArr" :key="index">
                <div style = "font-size: 14px">
                  <span> {{item.carNumber}}</span>
                  <i>&nbsp;</i>
                  <span>{{item.carModelName}}</span>
                  <i>&nbsp;</i>
                  <span>{{item.rentTypeName}}</span>
                  <div class="car-field">
                    <span v-if="item.active==-1">未知</span>
                    <span v-else-if="item.active" style="color:#16a085">在线</span>
                    <span v-else style="color:red">离线</span>
                    <i>&nbsp;&nbsp;&nbsp;</i>
                    <span v-if="item.soc==-1">电量未知</span>
                    <span v-else>{{item.charged ?'':'电量'}}{{item.soc}}% </span>
                    <span v-show="item.charged">(充电中)</span>
                    <i>&nbsp;&nbsp;&nbsp;</i>
                    <span v-if="item.rentStatusCode===-1">未知</span>
                    <span v-else :class="carStateStyle(item.rentStatusCode)">{{getRentStatus[item.rentStatusCode]}}&nbsp;
                      <i v-if='item.rentStatusCode===3'>({{item.currentTaskType}})</i>
                      <i v-if='item.rentStatusCode===0 &&item.vacantTime'>
                        <span>({{item.vacantTime}})</span>
                      </i>
                    </span>
                  </div>
                  <div v-if = "item.parkingCharge || item.transferTime">
                    <span v-if = "item.parkingCharge">停车费约{{item.parkingCharge}}元</span>
                    <i>&nbsp;&nbsp;&nbsp;</i>
                    <span v-if = "item.transferTime">{{item.transferTime}} 调走</span>
                  </div>
                </div>
                <el-button type="text" @click="creatOrder(item.carSn,index)" v-show="item.rentStatusCode!==1">创建工单</el-button>
              </div>
              <el-pagination v-show='detailStation.totalCarNum' @current-change="handleCurrentChange" :current-page.sync="currentPage" ref='elPagination' layout="prev, pager, next,total" :page-size="pageSize" :total="arrLength"> </el-pagination>
            </div>
          </el-collapse-transition>
        </div>

      </transition>
      <!-- 创建工单 -->
      <transition name="el-zoom-in-center">
        <div v-show="orderShow" class="creat-order">
          <i class="el-icon-close" @click="closeOrder"></i>
          <v-form :formSettings="formSettings" labelWidth='100px' :formData="formData" @save="submit" ref="form" submitName='创建工单' @typeChange="handleTypeChange" @changDistributeType="handleChangDistributeType">
            <!-- 故障类型 -->
            <template slot="repairTypes" slot-scope="scope">
              <el-checkbox-group v-model="scope.model.repairTypes">
                <el-checkbox v-for="(checkItem) in repairList" :key="checkItem.id" :label="checkItem.id">{{checkItem.name}}</el-checkbox>
              </el-checkbox-group>
            </template>
            <!-- 物料类型 -->
            <template slot="materielTypes" slot-scope="scope">
              <el-checkbox-group v-model="scope.model.materielTypes">
                <el-checkbox v-for="(checkItem) in materiaList" :key="checkItem.id" :label="checkItem.id">{{checkItem.name}}</el-checkbox>
              </el-checkbox-group>
            </template>
            <!-- 选择网点 -->
            <template slot="destinationStationId" slot-scope="scope">
              <search-select v-model="scope.model.destinationStationId" @focusChange='focusChange' :isRequest='isRequest' noRemote placeholder="请输入/选择网点名称" :open='false' :baiBuTing = true  ref = "websiteSelectionNames"> </search-select>
            </template>
            <!-- 指派人-->
            <template slot="executorUserSn" slot-scope="scope">
              <search-select @isRemote='getIsRemote' :isRequest='isRequest2' noRemote @focusChange='focusChange2' @change="getIsRemote" v-model="scope.model.executorUserSn" placeholder="请输入指派人" :open='false' isOperationRemote :areaId='cityId'> </search-select>
            </template>
          </v-form>
        </div>
      </transition>
      <div class="website-status">
        <div class="status-item" :class="'status-item-'+index" v-for="(item,index) in handleStstus" :key="index" @click.stop="handleDataPacket(item.value)" v-if='multipleValue.length?multipleValue.some((it=>{return item.value===it})):true'>
          <div>
            <span>
              <i :style="' color: '+item.color">{{item.num}}</i>
              <i>个</i>
            </span>
            <span>{{item.label}}</span>
          </div>
        </div>
      </div>
      <el-amap :zoom="10" :expandZoomRange="true" :zooms="[3,20]" :center="locationCenter" :events="mapEvents" :amap-manager="amapManager" :mapStyle='mapStyle ' :plugin="plugin"> </el-amap>
    </div>
  </div>
</template>
<script>
import mapSearch from '@/components/map/map-search'
import VueAMap from 'vue-amap'
import searchSelect from '@/components/website-select'
import mapConfig from '@/config/map-config'
import formSettings from './formSettings.js'
import { getRentStatus, getCarStateStyle } from '@/utils/common'
import loadingConfig from '@/config/loading'
import { refreshTime } from '@/utils/mass-point-map'

export default {
  name: 'car-dispatch',
  components: {
    searchSelect,
    mapSearch
  },
  mounted() {
    // console.log(this.$store.getters.firstCityId)
    this.get_districtLists(this.$store.getters.firstCityId)
  },
  watch: {
    activeTab(newTab) {
      if (newTab === 'carDispatch') {
        clearInterval(this.timingRefresh)
        this.get_data(true, true)
        this.getTimingRefresh()
        this.timeLoading = true
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
      loadingConfig,
      getRentStatus,
      formSettings,
      multipleValue: [],
      noRemote: false,
      mapLoading: false,
      websiteDetailLoading: false,
      isRefresh: false,
      ststus: [],
      formData: {},
      isFullScreen: false,
      timingRefresh: null,
      changeTime: null,
      selectStationRadio: 1,
      isSelectStation: true,
      arrLength: 0,
      carId: null,
      timeLoading: false,
      userSn: '',
      isRequest: false,
      isRequest2: false,
      repairList: [],
      materiaList: [],
      overLoadData: [], // 超载
      needCarData: [], // 缺车
      noProblemData: [], // 正常
      lossPowerData: [], // 亏电
      filterData: {
        carsAll: [], // 全部
        carsFree: [], // 空闲车
        appointment: [],
        maintain: []// 维护中
      },
      stationName: '',
      amapManager: new VueAMap.AMapManager(),
      plugin: [
        {
          pName: 'Scale'
        }
      ],
      orderShow: false,
      detailShow: false,
      currentPage: 1,
      pageSize: 5, // 页数
      detailStation: null,
      detailLoading: false,
      renderPersonData: [],
      carSn: '',
      isDesignatedPerson: true,
      polygon: null,
      markerList: null,
      type: null,
      stationId: null, // 网点Id
      locationCenter: [113.695624, 34.876356],
      cityId: this.$store.getters.firstCityId,
      newCarArr: [],
      carsArr: [],
      destinationStationName: '',
      mapStyle: mapConfig.mapStyle[mapConfig.selectedStyle].url,
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
      },
      // 片区列表
      renderAreaList: [],
      // 片区id
      districtId: ''
    }
  },
  computed: {
    executorUserSn() {
      return this.formSettings[0].items.find(item => item.name === 'executorUserSn')
    },
    activeTab() {
      return this.$store.getters.activeTab.name
    },
    handleStstus() {
      return [{
        label: '超负载',
        value: 'overload',
        num: this.overLoadData.length,
        color: '#D94543'
      }, {
        label: '缺车',
        value: 'need_car',
        num: this.needCarData.length,
        color: '#6BA7E8'
      }, {
        label: '亏电',
        value: 'loss_power',
        num: this.lossPowerData.length,
        color: '#F8CF00'
      }, {
        label: '正常',
        value: 'no_problem',
        num: this.noProblemData.length,
        color: '#5F5F5F'
      }]
    }

  },
  methods: {
    // 获取片区

    get_districtLists(operationCityId) {
      if (!operationCityId) {
        this.renderAreaList = []
      } else if (operationCityId === 999) {
      } else {
        this.$service.get_districtList(operationCityId).then(res => {
          this.placeholder = '请选择片区'
          this.renderAreaList = res.data.data.map(item => {
            return {
              value: item.id,
              label: item.name
            }
          })
        })
      }
    },
    focusChange() {
      this.isRequest = true
    },
    focusChange2() {
      this.isRequest2 = true
    },
    getIsRemote() {
      this.isRemote = true
    },
    selectChange(cityId) {
      this.get_districtLists(cityId)
      this.districtId = ''
    },
    closeDetail() {
      this.type = null
      this.detailStation = null
      this.orderShow = false
    },
    getTimingRefresh() {
      this.timingRefresh = setInterval(() => {
        this.get_data(true, true)
      }, refreshTime)
    },
    handleDataPacket(type) {
      this.detailStation = null
      this.detailShow = false
      this.markerList.clearData()
      switch (type) {
        case 'overload':
          this.handRender(this.overLoadData)
          break
        case 'loss_power':
          this.handRender(this.lossPowerData)
          break
        case 'no_problem':
          this.handRender(this.noProblemData)
          break
        case 'need_car':
          this.handRender(this.needCarData)
      }
    },
    handRender(arr) {
      let handleArr = [...arr, ...this.renderPersonData]
      handleArr.forEach((item, index) => {
        item.id = index
      })
      this.markerList.render(handleArr)
    },
    handleCarFree(type) {
      this.currentPage = 1
      this.carsArr = []
      this.newCarArr = []
      let arr
      if (type === 'carsAll') {
        arr = this.filterData.carsAll
      } else if (type === 'carsFree') {
        arr = this.filterData.carsFree
      } else if (type === 'appointment') {
        arr = this.filterData.appointment
      } else if (type === 'maintain') {
        arr = this.filterData.maintain
      }
      this.handlePageArr(arr)
    },
    submit(submitObj) {
      console.log(this.isRemote)
      if (submitObj.distributeType === 'assign_task' && !this.isRemote) {
        submitObj.executorUserSn = this.userSn
      }
      submitObj.carSn = this.carSn
      submitObj.authorMobile = this.$store.getters.user.mobilePhone
      submitObj.taskSource = 'optimus_admin'
      if (submitObj.images.length) {
        let imgArr = submitObj.images.map(item => {
          return item.url
        })
        submitObj.images = imgArr
      }
      if (this.type && this.type === 'dispatch_car') {
        submitObj.destinationStationName = this.$refs.websiteSelectionNames.newListData.filter((ele) => {
          return ele.value === submitObj.destinationStationId
        })[0].label
        // 不是数字
        if (isNaN(submitObj.destinationStationId) && this.stationId) {
          submitObj.destinationStationId = this.stationId
          submitObj.destinationStationName = this.$refs.websiteSelectionNames.newListData.filter((ele) => {
            return ele.value === this.stationId
          })[0].label
        }
      } else {
        delete submitObj.destinationStationId
        delete submitObj.destinationStationName
      }
      this.websiteDetailLoading = true
      this.$service.createWorkorder(submitObj).then(res => {
        if (res.data.code === '0') {
          this.websiteDetailLoading = false
          this.$message.success('创建工单成功')
          this.type = null
          this.orderShow = false
          // 重置状态
          this.resetStatus()
          this.getDispatchDetail(this.carId)
        }
      })
    },
    changeSelectStationRadio(item) {

    },
    handleShowStations() {
      // 选择网点
      this.isSelectStation = false
    },
    closeOrder() {
      this.orderShow = false
      this.type = null
      this.hideAllType()
    },
    handleChangDistributeType(type) {
      // 抢单
      if (type === 'grab_task') {
        this.executorUserSn.hidden = true
        this.executorUserSn.required = false
      } else {
        this.executorUserSn.required = true
        this.executorUserSn.hidden = false
        this.$nextTick(() => {
          this.$refs.form.formModel.executorUserSn = ''
        })
      }
      this.$refs.form.updateRule()
    },
    hideAllType() {
      this.formSettings[0].items.find(item => item.name === 'destinationStationId').hidden = true
      this.formSettings[0].items.find(item => item.name === 'repairTypes').hidden = true
      this.formSettings[0].items.find(item => item.name === 'materielTypes').hidden = true
      this.formSettings[0].items.find(item => item.name == 'dispatchReason').hidden = true
      this.formSettings[0].items.find(item => item.name == 'cleanTaskType').hidden = true
    },
    handleTypeChange(type) {
      this.type = type
      // 充电单、清洁单
      if (type === 'clean_car' || type === 'charge_car') {
        this.hideAllType()
        if (type == 'clean_car') {
          this.formSettings[0].items.find(item => item.name == 'cleanTaskType').hidden = false
        }
      } else if (type === 'dispatch_car') {
        this.formSettings[0].items.find(item => item.name === 'destinationStationId').hidden = false
        this.formSettings[0].items.find(item => item.name == 'dispatchReason').hidden = false
        this.formSettings[0].items.find(item => item.name === 'repairTypes').hidden = true
        this.formSettings[0].items.find(item => item.name === 'materielTypes').hidden = true
        this.formSettings[0].items.find(item => item.name == 'cleanTaskType').hidden = true
      } else if (type === 'repair_car') {
        if (!this.repairList.length) {
          this.getRepairType()
        }
        this.formSettings[0].items.find(item => item.name === 'destinationStationId').hidden = true
        this.formSettings[0].items.find(item => item.name === 'repairTypes').hidden = false
        this.formSettings[0].items.find(item => item.name === 'materielTypes').hidden = true
        this.formSettings[0].items.find(item => item.name == 'dispatchReason').hidden = true
        this.formSettings[0].items.find(item => item.name == 'cleanTaskType').hidden = true
      } else if (type === 'lack_materiel') {
        if (!this.materiaList.length) {
          this.getMaterialType()
        }
        this.formSettings[0].items.find(item => item.name === 'destinationStationId').hidden = true
        this.formSettings[0].items.find(item => item.name === 'repairTypes').hidden = true
        this.formSettings[0].items.find(item => item.name === 'materielTypes').hidden = false
        this.formSettings[0].items.find(item => item.name == 'dispatchReason').hidden = true
        this.formSettings[0].items.find(item => item.name == 'cleanTaskType').hidden = true
      }
      this.$refs.form.updateRule()
    },
    getMaterialType() {
      this.$service.getMaterialType().then(res => {
        this.materiaList = res.data.data
      })
    },
    getRepairType() {
      this.$service.getRepairType().then(res => {
        this.repairList = res.data.data
      })
    },
    creatOrder(carSn, carsArrIndex) {
      this.carSn = carSn
      this.orderShow = true
      this.executorUserSn.required = true
      this.executorUserSn.hidden = false
      // 循环处理后的大数据组
      this.newCarArr.forEach((item, index) => {
        if (index === this.currentPage - 1) {
          let itemCarInfo = this.newCarArr[index][carsArrIndex]
          this.formData = {
            carNumber: itemCarInfo.carNumber
          }
        }
      })
      this.hideAllType()
    },
    carStateStyle(statue) {
      return getCarStateStyle(statue)
    },
    handleCurrentChange(index) {
      this.carsArr = this.newCarArr[index - 1]
    },
    handleChargeNum(fast, slow) {
      if (isNaN(fast) && isNaN(fast)) {
        return '未知'
      }
      if (!fast && slow) {
        fast = 0
      } else if (!slow && fast) {
        slow = 0
      } else if (!fast & !slow) {
        fast = 0
        slow = 0
      }
      return fast + slow
    },
    get_polygon() {
      this.mapLoading = true
      let map = this.amapManager.getMap()
      if (this.markerList) {
        map.clearMap()
      }
      this.timeLoading = true
      clearInterval(this.timingRefresh)
      // 开始计时
      this.getTimingRefresh()
      console.log(this.districtId)
      this.$service.get_operationCityInfo(this.cityId).then(res => {
        console.log('刷新')
        let isNew
        if (this.polygon) {
          this.polygon.hide()
        }
        if (!isNew) {
          this.polygon = new window.AMap.Polygon({
            map: map,
            cursor: 'default',
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
        this.get_data(isNew, false)
      })
    },
    get_data(isNew, otherTabRefresh) {
      console.log(1111111111111)
      this.timeLoading = true
      Promise.all([this.getDispatchList(), this.getPersonList()]).then(data => {
        this.changeTime = Math.random()
        this.mapLoading = false // 地图loading
        this.timeLoading = false
        let renderData = [...data[0], ...data[1]]
        renderData.forEach((item, index) => {
          item.id = index
        })
        if (isNew && this.markerList) {
          if (!otherTabRefresh) {
            this.detailStation = null
            this.orderShow = false
            this.isRefresh = false
          } else {
            // 如果有详情 刷新
            if (this.detailStation) {
              // 重置状态
              this.resetStatus()
              this.getDispatchDetail(this.carId)
            }
          }
          this.markerList.off('selectedChanged')
          this.markerList.clearData()
          this.markerList.render(renderData)
          return
        }
        this.getMapUI(renderData)
      })
    },
    getPersonList() {
      return new Promise((resolve, reject) => {
        this.$service.getPersonList(this.cityId).then(res => {
          let data = res.data.data.filter(item => {
            return !isNaN(item.longitude) && !isNaN(item.latitude)
          }).map(item => {
            return {
              lngLatArr: [item.longitude, item.latitude],
              userName: item.userName,
              acceptTypes: item.acceptTypes,
              userRole: item.userRole,
              userSn: item.userSn,
              userMobile: item.userMobile,
              ready: item.ready === true ? '开工' : '收工',
              active: item.active === true ? '是' : '否',
              lastReportTime: item.lastReportTime,
              stationStatus: 'person'
            }
          })
          this.renderPersonData = data
          resolve(data)
        })
      })
    },
    getDispatchList() {
      return new Promise((resolve, reject) => {
        this.$service.getDispatchList({ cityId: this.cityId, districtId: this.districtId }, this.isFullScreen).then(res => {
          if (res.data.code === '0') {
            if (!res.data.data.length) {
              this.$message.warning('该城市下暂无网点')
            }
            let arr = []
            // 过滤数据
            let data = res.data.data.filter(item => {
              return !isNaN(item.stationInfo.longitude) && !isNaN(item.stationInfo.latitude)
            }).map(item => {
              return {
                detailId: item.stationInfo.id,
                lngLatArr: [item.stationInfo.longitude, item.stationInfo.latitude],
                stationStatus: item.stationStatus, // 充电桩状态
                hasCharging: item.hasCharging, // 是否有充电桩
                totalCarNum: item.totalCarNum, // 总数
                parkingsTop: item.parkingsTop, // 空闲
                typeCode: item.stationInfo.typeCode // 网点类型，是否是百步亭
              }
            })
            data.forEach(item => {
              if (this.multipleValue.length) {
                this.multipleValue.forEach(multipleItem => {
                  if (item.stationStatus === multipleItem) {
                    arr.push(item)
                  }
                })
              }
            })
            // 超负载
            this.overLoadData = data.filter(item => item.stationStatus === 'overload')
            // 缺车
            this.needCarData = data.filter(item => item.stationStatus === 'need_car')
            // 亏电
            this.lossPowerData = data.filter(item => item.stationStatus === 'loss_power')
            // 正常
            this.noProblemData = data.filter(item => item.stationStatus === 'no_problem')
            let mapData = this.multipleValue.length ? arr : data
            resolve(mapData)
          }
        })
      })
    },
    // 实例化地图
    getMapUI(mapData) {
      // this.iconStyle()
      let map = this.amapManager.getMap()
      window.AMapUI.loadUI(['misc/MarkerList', 'overlay/SimpleMarker', 'overlay/SimpleInfoWindow'], (MarkerList, SimpleMarker, SimpleInfoWindow) => {
        this.markerList = new MarkerList({
          map: map,
          getPosition: dataItem => {
            return dataItem.lngLatArr
          },
          markerEvents: ['click', 'mouseover', 'mouseout'],
          // 关闭弹出框
          onSelected: null,
          autoSetFitView: false,
          getMarker: (dataItem, context, recycledMarker) => {
            // 返回一个新的Marker
            let longText = dataItem.totalCarNum >= 10 || dataItem.parkingsTop >= 10
            return new SimpleMarker({
              iconStyle: {
                src: this.handleIconStyle(dataItem.hasCharging, dataItem.stationStatus, dataItem.typeCode, dataItem.active
                ),
                style: {
                  backgroundSize: '100%, 100%',
                  width: dataItem.stationStatus === 'person' ? '33px' : '50px'
                }
              },
              iconLabel: {
                innerHTML: `<div class="map-icon"><div class = "bai_bu_ting">${dataItem.typeCode === 'casual' ? '百' : ''}</div><h3>${isNaN(dataItem.totalCarNum) ? '' : dataItem.totalCarNum}</h3><i>${dataItem.stationStatus === 'person' ? '' : '/'}</i><h3>${isNaN(dataItem.parkingsTop) ? '' : dataItem.parkingsTop}</h3></div>`, // 设置文字内容
                style: {
                  color: '#fff',
                  top: dataItem.hasCharging ? '0px' : '0px',
                  fontSize: longText ? '10px' : '',
                  textShadow: dataItem.stationStatus === 'loss_power' ? '#FF9800 0px 0px 5px' : ''
                }
              },
              iconTheme: 'fresh',
              showPositionPoint: false,
              offset: dataItem.stationStatus === 'person' ? new window.AMap.Pixel(-15, -32) : new window.AMap.Pixel(-26, -55)
            })
          }
        })

        this.markerList.render(mapData)
        this.selectedChanged()
      })
    },
    selectedChanged() {
      this.markerList.on('markerClick markerMouseover markerMouseout', (event, info) => {
        if (info.data && info.data.stationStatus === 'person') {
          if (event.type === 'markerMouseover') {
            let detailPerson = Object.assign({}, info.data)
            let acceptName = ''
            for (let i = 0; i < detailPerson.acceptTypes.length; i++) {
              acceptName += detailPerson.acceptTypes[i].content + '  '
            }
            detailPerson.acceptName = acceptName
            this.personInfoWindow = new window.AMap.InfoWindow({
              isCustom: true,
              content: `<div class="person-detail"> 
                          <span>姓名：${detailPerson.userName}</span>
                          <span>电话：${detailPerson.userMobile}</span>
                          <span>角色：${detailPerson.userRole}</span>
                          <span>可接单类型：${detailPerson.acceptName}</span>
                          <span>是否开工：${detailPerson.ready}</span>
                          <span>活跃：${detailPerson.active}</span>
                          <span>最后上报时间：${detailPerson.lastReportTime}</span>
                        <div class="arrow"></div>
                    </div>`,
              offset: new window.AMap.Pixel(0, -45)
            })
            this.personInfoWindow.open(this.amapManager.getMap(), info.data.lngLatArr)
          } else if (event.type === 'markerMouseout') {
            this.personInfoWindow.close()
          } else if (event.type === 'markerClick') {
            this.personInfoWindow.close()
            this.$nextTick(() => {
              if (this.$refs.form.formModel.distributeType === 'assign_task' && this.orderShow) {
                this.userSn = info.data.userSn
                this.isRemote = false
                this.isRequest2 = false
                this.$refs.form.formModel.executorUserSn = info.data.userName
              }
            })
          }
        } else if (event.type === 'markerClick' && info.data && info.data.stationStatus !== 'person') {
          this.websiteDetailLoading = true
          let detailData = info.data
          if (this.type !== 'dispatch_car') {
            this.detailStation = null
          }
          if (this.type === 'dispatch_car') {
            this.$service.getDispatchDetail(detailData.detailId).then(res => {
              this.isRequest = false
              this.$refs.form.formModel.destinationStationId = res.data.data.station.name
              this.stationId = res.data.data.station.id
              this.websiteDetailLoading = false
            })
            return
          }
          this.orderShow = false
          this.resetStatus()
          this.carId = detailData.detailId
          this.getDispatchDetail(detailData.detailId)
        }
      })
      // 取消选中的行为
      this.markerList.clearSelected()
    },
    resetStatus(ststus) {
      this.currentPage = 1
      this.carsArr = []
      this.newCarArr = []
      this.detailShow = true
      this.detailLoading = true
    },
    getDispatchDetail(carId) {
      this.$service.getDispatchDetail(carId).then(res => {
        this.detailLoading = false
        if (res.data.code === '0') {
          this.websiteDetailLoading = false
          this.detailStation = res.data.data
          let cars = res.data.data.cars
          this.filterData.carsAll = cars
          // 空闲车
          this.filterData.carsFree = cars.filter(item => item.rentStatusCode === 0)
          // 预约
          this.filterData.appointment = cars.filter(item => item.rentStatusCode === 1)
          // 维护中
          this.filterData.maintain = cars.filter(item => item.rentStatusCode === 3)
          // 处理数组
          this.handlePageArr(cars)
          this.$nextTick(() => {
            if (document.body.offsetHeight <= 885) {
              this.$el.querySelector('.map-detail').style.maxHeight = '500px'
            }
          })
        }
      }).catch(err => {
        this.$message.error('网点详情加载失败,请重新点击')
      })
    },
    handlePageArr(arr) {
      this.arrLength = arr.length
      for (let i = 0; i < arr.length; i += this.pageSize) {
        this.newCarArr.push(arr.slice(i, i + this.pageSize))
      }
      this.carsArr = this.newCarArr[0]
    },
    handleIconStyle(hasCharging, type, typeCode, active) {
      // 有充电桩
      if (hasCharging) {
        switch (type) {
          case 'no_problem':
            if (typeCode === 'casual') {
              return '././static/img/bk_no_problem1.png'
            } else {
              return '././static/img/no_problem1.png'
            }
          case 'loss_power':
            if (typeCode === 'casual') {
              return '././static/img/bk_loss_power1.png'
            } else {
              return '././static/img/loss_power1.png'
            }
          case 'overload':
            if (typeCode === 'casual') {
              return '././static/img/bk_overload1.png'
            } else {
              return '././static/img/overload1.png'
            }
          case 'need_car':
            if (typeCode === 'casual') {
              return '././static/img/bk_need_car1.png'
            } else {
              return '././static/img/need_car1.png'
            }
        }
      } else {
        switch (type) {
          case 'no_problem':
            if (typeCode === 'casual') {
              return '././static/img/bk_no_problem2.png'
            } else {
              return '././static/img/no_problem2.png'
            }
          case 'loss_power':
            if (typeCode === 'casual') {
              return '././static/img/bk_loss_power2.png'
            } else {
              return '././static/img/loss_power2.png'
            }
          case 'overload':
            if (typeCode === 'casual') {
              return '././static/img/bk_overload2.png'
            } else {
              return '././static/img/overload2.png'
            }
          case 'need_car':
            if (typeCode === 'casual') {
              return '././static/img/bk_need_car2.png'
            } else {
              return '././static/img/need_car2.png'
            }
          case 'person':
            if (active === '是') {
              return '././static/img/person.png'
            } else {
              return '././static/img/person_unactive.png'
            }
        }
      }
    }

  }
}
</script>
<style lang='scss'>
.el-notification.left {
  left: 86px;
}
.el-select-dropdown {
  width: 218px !important;
}

.car-dispatch {
  .amap-simple-marker-icon {
    height: 56px;
    // background: #787878;
    border-radius: 50%;
   }
  .person-detail {
    position: relative;
    max-width: 450px;
    border-radius: 10px;
    border: 1px solid #ebeef5;
    z-index: 100;
    background-color: #fff;
    color: #303133;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    transition: all 0.3s;
    padding: 10px 12px;
    line-height: 28px;
    display: flex;
    white-space: nowrap;
    flex-direction: column;
    // }
    & .arrow {
      position: absolute;
      left: 50%;
      bottom: -15%;
      transform: translate(-50%, 0%);
      width: 0px;
      height: 0px;
      border: 10px solid transparent;
      border-top: 10px solid #fff;
    }
  }
  .full-screen-button {
    margin-left: 15px;
  }

  .search-content {
    overflow: hidden;
    div {
      display: flex
    }
    .city {
      .search-select {
        width: 180px !important;
      }
      .type-select {
          .multi-select {
           width: 180px !important;
         }
      }
    }
  }
  .website-status {
    z-index: 97;
    user-select: none;
    position: absolute;
    top: $map-ststus-top;
    right: $map-ststus-right;
    .status-item {
      cursor: pointer;
      height: 70px;
      width: 160px;
      border-left: 0;
      background: #ffffff;
      box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.2); // box-shadow: 2px 0px 10px #888888;
      display: flex;
      margin-bottom: 10px;
      > div {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        margin-left: 20px;
        padding-top: 20px;
        padding-bottom: 10px;
        span {
          i {
            color: #787878;
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
          background: #d94543;
        }
      }
      &.status-item-1 {
        &::before {
          background: #6ba7e8;
        }
      }
      &.status-item-2 {
        &::before {
          // f8cf00
          background: #f8cf00;
        }
      }
      &.status-item-3 {
        &::before {
          // f8cf00
          background: #5f5f5f;
        }
      }
      &::before {
        content: '';
        display: block;
        width: 8px;
        margin-top: -0.8px;
        height: 72px;
        overflow: hidden;
        background: #aaaaaa;
      }
    }
  }
  .map-icon {
    display: flex;
    justify-content: center;
    position: relative;
    top: 10px;
    .bai_bu_ting {
      position: absolute;
      width: 10px;
      height: 10px;
      left: 6px;
      top:-11px;
      color: #fff;
      font-size: 15px;
      // -webkit-transform-origin-x: 0;
      transform: scale(0.60);
      text-shadow: none;
    }
  }
  i {
    font-style: normal;
    // cursor: pointer;
  }
  .leisure {
    color: $status-leisure;
  }
  .already {
    color: $status-already;
  }
  .maintain {
    color: $status-maintain;
  }
  .select-station-radio {
    margin-top: 8px;
    display: flex;
  }
  .el-icon-close {
    position: relative;
    left: 4px;
    top: -1px;
    cursor: pointer;
    color: #b2b9c9;
    font-size: 16px;
  }
  .map-content {
    .map-detail-loading {
      color: #787878;
      padding: 5px 10px;
      max-width: 435px;
      max-height: 900px;
      overflow-y: auto;
      line-height: 28px;
      z-index: 99;
      position: absolute;
      top: $map-ststus-top;
      left: $map-ststus-right;
      border-radius: 4px;
      border: 1px solid #ebeef5;
      background-color: #fff;
    }
    .map-detail {
      max-width: 435px;
      max-height: 900px;
      overflow-y: auto;
      line-height: 28px;
      z-index: 99;
      position: absolute;
      top: $map-ststus-top;
      left: $map-ststus-right;
      border-radius: 4px;
      border: 1px solid #ebeef5;
      background-color: #fff;
      // overflow: hidden;
      color: #303133;
      transition: all 0.2s;
      &:hover {
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      }
      .detail-heard {
        position: relative;
        .detail-close {
          display: flex;
          position: absolute;
          right: 2px;
          z-index: 99;
          // top: -5px;
        }
        .detail-station-infor {
           .station-name {
              display: flex;
              .baibuting {
                min-width: 60px;
                max-width: 60px;
                img {
                  width:80%;
                  margin-top:4px;
                }
              }
           }
        }
        div {
          padding: 15px;
          display: flex;
          justify-content: space-between;
          // align-items: center;
          div {
            padding: 0;
            display: flex;
            flex-direction: column;
            position: relative;
            .address {
              color: #9c9c9c;
            }
            .car-number {
              display: flex;
              cursor: pointer;
              color: #bdbdbd;
              flex-direction: row;
              align-items: center;
              justify-content: space-between;
            }
          }
        }
        & .person-detail {
          white-space: nowrap;
          display: flex;
          flex-direction: column;
        }
      }
      .detail-content {
        padding: 15px;
        padding-top: 0;
        transition: all 0.2s;
        .car-field {
          display: flex;
        }
        .mt-5{
          margin-top: 8px;
        }
        .car-detail {
          display: flex;
          height: 90px;
          line-height: 26px;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid #ebeef5;
          // font-size: 13px;
          .color-blue {
            // color:  #96c840;
          }
        }
      }
      .detail-padding {
        padding-bottom: 0;
      }
    }
    .creat-order {
      max-width: 408px;
      max-height: 720px;
      padding-right: 16px;
      overflow-y: auto;
      z-index: 100;
      position: absolute;
      top: $map-ststus-top;
      right: $map-ststus-right;
      background: #ffffff;
      transition: all 0.2s;
      &:hover {
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      }
      form {
        .section-content {
          .el-form-item:nth-child(3) {
            .el-radio {
              margin-right: 30px;
              line-height: 2;
              margin-left: 0px;
            }
          }
        }
      }
    }
    .charge-status {
      z-index: 99;
      position: absolute;
      top: $map-ststus-top;
      right: $map-ststus-right;
      li {
        font-size: 20px;
        display: flex;
        align-items: center;
        span {
          line-height: 30px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: red;
        }
      }
    }
  }
}
//全屏
.full-screen {
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 999;
}
</style>
