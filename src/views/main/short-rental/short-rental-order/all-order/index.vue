<template>
  <div ref='orderallidx' class='all_order'>
    <el-card class="table-box">
      <div slot="header">
        <v-search :searchSettings="searchSettings" @search="handleSearch" :labelWidth="labelWidth"></v-search>
      </div>
      <div class="table-operator">
        <el-button size="small" type="primary" @click='exportFile' v-has="'allOrderExport'">导出</el-button>
      </div>
      <order-table ref="tabList" :list='searchData' @on-orderInfor='showOrderInfor' :params="paginatiomParams" @on-pageChange="pageChange" @handleUserDetails="handleUserDetails"></order-table>
    </el-card>
    <v-page :visible.sync="showInformtion" ref="vPage" @goBack="reload">
      <template slot="title" class='all_check_title'>
        <h3 style="line-height:30px; display:inline-block">订单详情</h3>
        <div class='all_operate' style="float: right">
          <el-button type='primary' size="small" @click="changeCars" v-if="(status.orderStatus ==='rent' && !information.hasBindCar ) || status.orderStatus ==='subscribed' && !information.hasBindCar && $_has('allOrderCar')">排车</el-button>
          <el-button size="small" @click="setFree" v-if="(status.orderStatus ==='subscribed' || status.orderStatus ==='rent') && status.hasBindCar && $_has('allOrderSetFree')">设置空闲</el-button>
          <el-button size="small" @click="sendRentCar" v-if="(status.orderStatus ==='subscribed' || status.orderStatus ==='rent') &&status.hasBindCar && $_has('allOrderSendCarOrder')">发送租车指令</el-button>
          <el-button size="small" @click="cancelOrder" v-if="status.orderStatus ==='subscribed' && $_has('allOrderCancel')">取消订单</el-button>
          <el-button type='primary' size="small" @click="settleMoney" v-if="(status.orderStatus ==='returned' && status.settleStatus ==='unsettle')  && $_has('allOrderSettle')">结算</el-button>
          <el-button type='primary' size="small" @click="refund" v-if="(status.orderStatus ==='returned' && status.settleStatus ==='settled')  && $_has('allOrderRefound')">退款</el-button>
          <el-button type='primary' size="small" @click="returnCar" v-if="status.orderStatus ==='rent' && $_has('allOrderReturnCar')">还车</el-button>
        </div>
      </template>
      <template slot="content">
        <order-information @on-bindCard="showBindCard" @on-materialDialog="showMaterial" ref="infor" :sn="sn" :information="information" @on-exchangeCar="exchangeCarFirst()" @on-resetTime="getOrderInfor(sn)" :afterImg="afterImg" :beforeImg="beforeImg" :authority="authority"></order-information>
      </template>
    </v-page>

    <!--还车-->
    <v-page :visible.sync="showReturnCar" ref="vPage" @goBack="reload">
      <template slot="title" class='all_check_title'>
        <h3 style="line-height:30px; display:inline-block">还车</h3>
      </template>
      <template slot="content">
        <el-form ref="form" label-width="100px" class="return_form" style="width: 50%">
          <el-form-item label="还车网点：">
            <div>
              <span style="color: #F56C6C">{{returnStationName ? returnStationName : '未检测到网点'}}</span>
              <el-button size='small' @click="chooseNet" type="text">设置还车网点</el-button>
            </div>
          </el-form-item>
          <el-form-item label="还车拍照：" class="pic" id="return_pic_list">
            <v-detail :detailSettings="returnPicSetting" :data="afterImg" label-align="left" label-width="80px" class="return_car_pic">
            </v-detail>
          </el-form-item>
          <el-form-item label="还车备注：">
            <el-input type="textarea" v-model="returnRemark" placeholder="请输入还车备注"></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-button size="small" type="primary" @click="comfirmReturnCar('flase')">确定还车</el-button>
          </el-form-item>
        </el-form>
        <searchStation ref="searchStation" :visible.sync="stationVisible" :carNumber="stationParams.carNumber" :currentCityId="stationParams.currentCityId" :rentType="stationParams.rentTypeCode" @confirm="handleSelectStation">
        </searchStation>
      </template>
    </v-page>
    <!-- 用户详情 -->
    <!-- <customer-infor :detailData="detailData"  @update="update" :visible.sync="detailVisible"  @closePage="allOrderList(page)"></customer-infor> -->
    <v-customer-details :userId="userId" :btnVisible="btnVisible" :visible.sync="userDetailVisible" @closePage="closePage" @update="update"></v-customer-details>
    <title-dialog ref="titleDialog" @on-success="rentCarList(sn)" @on-operation="operationSuccess" @closeRentCarSecondStep='closeRentCarSecondStep'></title-dialog>

    <bindcard-dialog ref="bind" @on-bind="rentCarList(sn)"></bindcard-dialog>
    <material-dialog ref="material" @on-success="rentCarList(sn)"></material-dialog>
    <return-dialog ref="returnCar" @on-parse="parseReturn"></return-dialog>
    <settle-account ref="settle" @on-success="settleSuccess"></settle-account>

    <el-dialog :visible.sync="isCancelOrder" :title='cancelOrderTitle' width='420px' v-if="isCancelOrder">
      <cancel-order @closePage="closePage" @closeAndRefresh="closeAndRefresh" :formData="params" :orderSn="orderSn"></cancel-order>
    </el-dialog>
    <!--还车押金提示-->
    <el-dialog title="提示" :visible.sync="returnCarNoticemsg" width="420px" center>
      <span center>{{noticemsg}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="continueReturnCar">继续还车</el-button>
        <el-button @click="returnCarNoticemsg = false">取 消</el-button>
      </span>
    </el-dialog>

    <!--还车普通提示-->
    <el-dialog title="提示" :visible.sync="returnCarNoticemsgComm" width="420px" center>
      <span center>{{noticemsg}}</span>
    </el-dialog>

    <!-- 手动设置空闲 -->
    <el-dialog title="提示" :visible.sync="setFreeShow" width="420px" center>
      <div>已成功结束订单。</div>
      <div>车辆{{setFreeCarNumber}}设置空闲失败，
        <el-button type="text" @click="setCarFee()">手动设置空闲</el-button>
      </div>
    </el-dialog>

    <!-- 排车 -->
    <order-car ref="orderCarDialog" @on-success="rentCarList(sn)"></order-car>
    <!-- 换车 -->
    <exchange-car ref="exchange" @exchange-first="changeCars" @continueOrder="changeCars()" @getOrderInfor="getOrderInfor(information.sn)"></exchange-car>
  </div>
</template>
<script>
import vDetail from '@/components/detail/v-detail'
import { searchSettings } from './search-settings.js'
import orderTable from './components/table'
import orderInformation from '../common-information'
import titleDialog from './titleDialog'
import cancelOrder from './cancelOrder'
import bindcardDialog from './bindCarDialog'
import materialDialog from './materialDialog'
import searchStation from '@/components/search-station/'
import returnDialog from './returnCarDialog.vue'
import mixin from '../order.js'
import dayjs from 'dayjs'
import settleAccount from '../wait-settlement/components/settleDialog'
// 排车
import orderCar from '../commonDialog/orderCarDialog'
// 换车
import exchangeCar from '../commonDialog/exchangeCar'
// 用户详情
import vCustomerDetails from '../../../customer/customer-list/components/customer-details'
// import customerInfor from '../../../customer/customer-list/components/customer-details'
export default {
  name: 'all-order',
  components: {
    orderTable,
    orderInformation,
    titleDialog,
    bindcardDialog,
    materialDialog,
    searchStation,
    vDetail,
    returnDialog,
    cancelOrder,
    settleAccount,

    orderCar,
    exchangeCar,
    // customerInfor,
    vCustomerDetails
  },
  mixins: [mixin],
  data() {
    return {
      rentCarFirstForceReturnCarResult: false,
      setFreeCarNumber: '',
      setFreeShow: false,
      showStatus: false,
      returnCarNoticemsgComm: false,
      returnCarNoticemsg: false,
      noticemsg: '',
      rentCarTitle: '换车',
      params: [],
      orderSn: '',
      rentCarParamas: {},

      isCancelOrder: false,
      cancelOrderTitle: '取消订单',

      returnPicSetting: [{
        label: '',
        items: [
          {
            label: '',
            value: 'images',
            type: 'image',
            descriptionType: 'show'
          }
        ]
      }],
      stationVisible: false,
      searchSettings: searchSettings,
      labelWidth: '130px',
      searchData: [],
      showInformtion: false,
      showReturnCar: false,
      paginatiomParams: {
      },
      searchParams: {},
      copyParams: [],
      status: {},
      sn: '',
      information: {
        expectTime: ''
      },
      afterImg: {},
      beforeImg: {},
      returnStationName: '',
      returnStationId: '',
      stationParams: {
        rentTypeCode: 3
      },
      selectStation: {},
      returnRemark: '',
      authority: {
        getMaterial: 'allOrderGetMaterial',
        returnMaterial: 'allOrderReturnMaterial',
        exchangeCar: 'allOrderExchangeCar',
        bindCard: 'allOrderBindCard',
        resetTime: 'allOrderResetTime',
        resetSalesmans: 'allOrderResetSalesmans'
      },
      // 用户详情
      detailVisible: false,
      detailData: {},
      page: 1,
      btnVisible: false,
      userDetailVisible: false,
      userId: null
    }
  },
  methods: {
    update(userId) {
    },
    // 用户详情
    handleUserDetails(userId) {
      this.userId = userId
      this.userDetailVisible = true
    },
    rentCarList(sn) {
      if (!sn) {
        sn = this.information.sn
      }
      this.getOrderInfor(sn)
      // this.$refs.infor.getOrderLog()
    },
    closeRentCarSecondStep() {
      console.dir('closeRentCarSecondStep')
      this.getOrderInfor(this.information.sn)
      this.$refs.infor.getOrderLog()
    },
    setCarFee() {
      this.$store.commit('sendToTab', {
        name: 'carStatus',
        params: {
          carNumber: this.information.carNumber
        }
      })
      this.setFreeShow = false
    },
    settleSuccess() {
      console.dir('settleSuccess')
      this.showStatus = false
      this.getOrderInfor(this.information.sn)
      this.$refs.infor.getOrderLog()
    },
    getList(page = 1) {
      this.$service.waitSettlementList(this.searchData, page).then((res) => {
        this.searchList = res.data.data.records
        this.paginatiomParams = {
          pageSize: res.data.data.pageSize,
          total: res.data.data.totalElements
        }
      }).catch((res) => { })
    },
    // 关闭窗口 和 插件对接
    closePage() {
      this.isCancelOrder = false
      console.log('close')
      this.allOrderList(this.page)
    },
    // 取消页面
    closeAndRefresh() {
      this.isCancelOrder = false
      this.getOrderInfor(this.information.sn)
      this.allOrderList()
    },
    operationSuccess() {
      this.showInformtion = false
      this.showReturnCar = false
      this.allOrderList()
    },
    parseReturn(type) {
      let params = {
        userId: this.information.userId,
        orderSn: this.information.sn,
        returnType: 'background',
        returnStationId: this.information.returnStationId,
        operatorUserName: this.$store.state.user.username,
        operatorCnName: this.$store.state.user.cnName,
        remark: this.returnRemark,
        force: true
      }
      this.$service.returnCar(params).then((res) => {
        this.$message.success('还车成功！')
        this.allOrderList()
        this.showReturnCar = false
        this.$refs.returnCar.dialogVisible = false
        this.getOrderInfor(this.information.sn)

        this.setFreeCarNumber = this.information.cardNumber
        this.setFreeShow = true
      }).catch((res) => {
        this.showReturnCar = false
        this.$refs.returnCar.returnSuccess = true
        this.allOrderList()
        this.getOrderInfor(this.information.sn)
      })
    },
    continueReturnCar() {
      console.dir('continueReturnCar 继续还车')
      this.returnCarNoticemsg = false
      this.showReturnCar = true
      return false
      // this.comfirmReturnCar(false, true)
    },
    comfirmReturnCar(force, skipNeedPayMoney = false) {
      this.$refs.returnCar.returnSuccess = false
      let params = {
        userId: this.information.userId,
        orderSn: this.information.sn,
        returnType: 'background',
        returnStationId: this.information.returnStationId,
        operatorUserName: this.$store.state.user.username,
        operatorCnName: this.$store.state.user.cnName,
        remark: this.returnRemark,
        force: false
      }
      this.showReturnCar = false
      this.returnCarNoticemsg = false
      this.$service.returnCar(params).then((res) => {
        this.getOrderInfor(this.information.sn)
        this.allOrderList()
        this.$message.success('还车成功！')
      }).catch((res) => {
        let code = res.code.slice(0, 2)
        if (code === '51') {
          this.$refs.returnCar.show({ code: res.code, msg: res.msg, carNumber: this.information.carNumber })
        }
        if (res.code === '613009') {
          this.returnCarNoticemsg = true
          this.noticemsg = res.msg
        }
      })
    },
    bindSuccess() {
    },
    pageChange(page) {
      this.page = page
      this.allOrderList(page)
    },
    handleSelectStation(val) {
      this.selectStation = val
      this.returnStationName = val.name
      this.information.returnStationId = val.id
    },
    chooseNet() {
      this.stationVisible = true
    },

    // 还车
    returnCar() {
      let params = {
        orderSn: this.information.sn,
        userId: this.information.userId
      }

      // 还车的检车
      this.$service.returnCarCheck(params).then((res) => {
        // this.showInformtion = false
        // 还车页面的提示款
        this.showReturnCar = false
        this.returnRemark = ''
        this.stationParams = {
          carNumber: res.data.data.carNumber,
          currentCityId: res.data.data.cityId,
          // 1分时   3 长短租
          rentTypeCode: 3
        }
        this.returnCarImg = res.data.data.afterImg ? this.pictureChange(res.data.data.afterImg) : {}
        this.returnStationName = res.data.data.stationName
        this.information.returnStationId = res.data.data.stationId

        //  违章押金500元
        if (res.data.data.needConfirm) {
          this.returnCarNoticemsg = true
          this.noticemsg = res.data.data.confirmMsg
          return false
        }
        // 正常的还车页面
        this.showReturnCar = true
      }).catch((res) => {
        // 还车检测前置提示
        let code = res.code.slice(0, 2)
        if (code === '51') {
          this.$refs.returnCar.show({ code: res.code, msg: res.msg, carNumber: this.information.carNumber })
        }

        if (res.code === '613009') {
          this.returnCarNoticemsg = true
          this.noticemsg = res.msg
        }

        // if (
        //   code === '61' &&
        //   res.code !== '613009'
        // ) {
        //   this.returnCarNoticemsgComm = true
        //   // this.returnCarNoticemsg = true
        //   this.noticemsg = res.msg
        // }
      })
    },

    showBindCard(cardNumber) {
      let params = {
        cardNumber: cardNumber,
        sn: this.sn
      }
      this.$refs.bind.show(params)
      // 添加刷新日志操作
      // this.$refs.infor.getOrderInfor()
      // this.$refs.infor.getOrderLog()
    },
    showMaterial() {
      let material = {
        materielStatus: this.information.materielStatus,
        sn: this.information.sn
      }
      this.$refs.material.show(material)
    },

    // 排车
    changeCars(params = {}) {
      let dialogParams = {
        width: '50%',
        title: '排车',
        sn: this.sn,
        takeStationName: params.returnStationName ? params.returnStationName : this.information.takeStationName,
        takeStationId: params.returnStationId ? params.returnStationId : this.information.takeStationId,
        cityId: this.information.cityId,
        sameCarGenre: false
      }
      this.$refs.orderCarDialog.show(dialogParams)
    },

    // 换车
    exchangeCarFirst() {
      let params = {
        orderSn: this.information.sn,
        operatorUserName: this.$store.getters.user.username,
        operatorCnName: this.$store.getters.user.cnName
      }
      // 排车检测
      this.$service.bindCar(params).then((res) => {
        if (res.data.data.hasCar) {
          this.rentCarParamas = res.data.data
          let obj = Object.assign({ userId: this.information.userId }, res.data.data)
          this.$refs.exchange.show(obj)
        }
      }).catch((res) => { })
    },
    cancelOrder() {
      this.$service.getAllCancelReason().then((res) => {
        if (res.data.code == '0') {
          this.isCancelOrder = true
          this.params = res.data.data
          this.orderSn = this.information.sn
          // 页面属性
          this.getOrderInfor(this.information.sn)
        }
      }).catch((res) => { })
    },
    // 新的结算页面
    settleMoney() {
      this.$refs.settle.show(this.information)
    },

    // 结算页面
    settleAccount() {
      let dialogParams = {
        width: '520px',
        title: '结算',
        type: 'settle',
        sn: this.sn,
        rentMoney: this.information.rentMoney,
        basicServiceMoney: this.information.basicServiceMoney
      }
      this.$refs.titleDialog.show(dialogParams)
    },
    refund() {
      let dialogParams = {
        width: '400px',
        title: '退款',
        type: 'refund',
        sn: this.sn
      }
      this.$refs.titleDialog.show(dialogParams)
    },
    exportFile() {
      if (this.searchData.length < 1) {
        this.$message.warning('导出订单为空，请重新查询！')
      } else {
        this.$service.exportShort(
          this.searchParams,
          this.$store.getters.token,
          '短长租订单.xlsx',
          'shortRental')

        // if (this.searchParams.dateMax) {
        //   // if (((Date.parse(this.copyParams[1]) + 1000 - Date.parse(this.copyParams[0])) / 1000 / 60 / 60 / 24) > 31) {
        //   //   this.$message.warning('导出订单时间范围必须小于等于31天，请重新设置')
        //   // } else {
        //   //   this.$service.exportShort(
        //   //     this.searchParams,
        //   //     this.$store.getters.token,
        //   //     '短长租订单.xlsx',
        //   //     'shortRental')
        //   // }
        // } else {
        //   this.$message.warning('请设置导出时间范围！')
        // }
      }
    },
    handleSearch(data) {
      this.$refs.tabList.page = 1
      this.page = 1
      let copy = Object.assign({}, data)
      this.searchParams = (this.searchTimeChange(copy))

      // 优惠券设置对应
      if (this.searchParams.isUseCoupon == 'all') {
        delete this.searchParams.isUseCoupon
      }

      if (this.searchParams.isUseCoupon == 'used') {
        this.searchParams.isUseCoupon = 1
      }
      if (this.searchParams.isUseCoupon == 'unused') {
        this.searchParams.isUseCoupon = 0
      }

      // 订单类型设置
      if (this.searchParams.orderType == 'all') {
        delete this.searchParams.orderType
      }

      this.searchUserChange(this.searchParams)
      for (let key in data) {
        if (typeof data[key] === 'object' && data[key].length > 1) {
          this.copyParams = data[key]
        }
      }
      this.allOrderList()
    },
    reload() {
      this.allOrderList(this.page)
    },

    getOrderInfor(sn) {
      if (!sn) {
        sn = this.information.sn
      }
      this.$service.orderInformation({ orderSn: sn }).then((res) => {
        // 格式化接口显示
        this.information = Object.assign({}, res.data.data)
        this.information = this.$service.formateShortRentRow(this.information)

        this.information.expectTakeTime = dayjs(this.information.expectTakeTime).format('YYYY-MM-DD HH:mm:ss')
        this.information.expectTime = new Date(res.data.data.expectTakeTime)
        this.afterImg = this.information.afterImg ? this.pictureChange(this.information.afterImg) : {}
        this.beforeImg = this.information.beforeImg ? this.pictureChange(this.information.beforeImg) : {}
        this.status = {
          orderStatus: res.data.data.orderStatus,
          settleStatus: res.data.data.settleStatus,
          hasBindCar: res.data.data.hasBindCar
        }
        this.$refs.infor.getOrderLog()
      })
    },
    // 1. 获取订单详情
    showOrderInfor(row) {
      this.showInformtion = true
      this.sn = row.sn
      this.getOrderInfor(row.sn)
    },
    getCarList() {
      this.$service.carList().then(res => {
        this.searchSettings[5].options = []
        res.data.data.forEach((ele) => {
          this.searchSettings[5].options.push({
            label: ele.name,
            value: ele.id
          })
        })
      })
    },
    allOrderList(page = 1) {
      this.$service.allOrderList(this.searchParams, page).then((res) => {
        // 格式化数据显示
        this.searchData = this.$service.formateAllOrderList(res.data.data.records)

        this.paginatiomParams = {
          pageSize: res.data.data.pageSize,
          total: res.data.data.totalElements
        }
      })
    },
    setFree() {
      let params = {
        orderSn: this.sn,
        operatorUserName: this.$store.state.user.username,
        operatorCnName: this.$store.state.user.cnName
      }
      this.$service.setFree(params).then((res) => {
        this.$message.success('操作成功')
      }).catch((res) => {
        this.$message.warning('操作失败')
      })
    },
    sendRentCar() {
      let params = {
        orderSn: this.sn,
        operatorUserName: this.$store.state.user.username,
        operatorCnName: this.$store.state.user.cnName
      }
      this.$service.sendRentCar(params).then((res) => {
        this.$message.success('操作成功')
      }).catch((res) => {
        this.$message.warning('操作失败')
      })
    }
  },
  mounted() {
    this.getCarList()
    this.allOrderList()
  }
}
</script>
<style lang="scss">
.all_order {
  .all_check_title {
    .all_operate {
      display: inline-block;
    }
  }
  .rent_car_first_expection {
    .el-dialog__body {
      .message_reason {
        text-align: center;
        color: #e6a23c;
        margin-bottom: 5px;
        i {
          padding-right: 5px;
        }
      }
    }
  }
  #return_pic_list {
    .detail-section > ul {
      padding: 0;
      .item-label {
        margin-right: 0;
        color: #606266;
        font-weight: 700;
        font-size: 14px;
      }
      .item-value {
        .v-gallery {
          li {
            margin-top: 0;
          }
        }
      }
    }
  }
  .return_form {
    .return_car_pic {
      .detail-section {
        ul {
          padding-left: 0;
        }
        .detail-item {
          .item-label {
            width: 0 !important;
            margin-right: 0 !important;
          }
        }
      }
    }
  }
}
</style>
