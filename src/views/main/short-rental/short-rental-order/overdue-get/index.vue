<template>
  <div class='overdue-get'>
    <el-card class="table-box">
      <div slot="header">
        <v-search :searchSettings="searchSettings" @search="handleSearch" :labelWidth="labelWidth"></v-search>
      </div>
      <get-table ref="tabList"  :list="searchList" :params="paginatiomParams" @on-pageChange='pageChange' @on-orderInfor='showOrderInfor' @handleUserDetails="handleUserDetails"></get-table>
    </el-card>
    <v-page :visible.sync="showStatus" ref="vPage" @goBack="reload">
      <template slot="title" class='all_check_title'>
        <h3 style="line-height:30px; display:inline-block">订单详情</h3>
        <div class='all_operate' style="float: right">
          <el-button size="small" type="primary" @click="orderCar" v-if="!information.hasBindCar && $_has('overdueGetOrderCar')">排车</el-button>
          <el-button size="small" @click="setFree" v-if="information.hasBindCar && $_has('overdueGetSetFree')">设置空闲</el-button>
          <el-button size="small" @click="sendRentCar" v-if="information.hasBindCar && $_has('overdueGetSendCarOrder')">发送租车指令</el-button>
          <el-button size="small" @click="cancelOrder" v-has="'overdueGetCancel'">取消订单</el-button>
        </div>
      </template>
      <template slot="content">
        <order-information ref="infor" @on-bindCard="showBindCard" @on-materialDialog="showMaterial" :sn="sn" :information="information" @on-exchangeCar="exchangeCarFirst()" @on-resetTime="refeshPage(sn)" :afterImg="afterImg" :beforeImg="beforeImg" :authority="authority"></order-information>
      </template>
    </v-page>
    <!-- 用户详情 -->
    <v-customer-details :userId="userId" :btnVisible="btnVisible" :visible.sync="userDetailVisible" @closePage="closePage" @update="update"></v-customer-details>
    <bindcar-dialog ref="bind" @on-bind="refeshPage(sn)"></bindcar-dialog>
    <material-dialog ref="material"></material-dialog>
    <el-dialog :visible.sync="isCancelOrder" :title='cancelOrderTitle' width='420px' v-if="isCancelOrder">
      <cancel-order @closePage="closePage" @closeAndRefresh="closeAndRefresh" :formData="params" :orderSn="orderSn"></cancel-order>
    </el-dialog>
    <!-- 排车 -->
    <order-car ref="orderCarDialog" @on-success="refeshPage(sn)"></order-car>
    <!-- 换车 -->
    <exchange-car ref="exchange" @exchange-first="orderCar" @continueOrder="orderCar" @getOrderInfor="getOrderInfor(information.sn)"></exchange-car>
  </div>
</template>
<script>
import { searchSettings } from './search-settings.js'
import { handleSubmitSearchData } from '@/utils/common.js'
import { handleDate } from '@/utils/date-filter'
import getTable from './components/table'
import orderInformation from '../common-information'
import bindcarDialog from './components/bindCarDialog'
import materialDialog from './components/materialDialog'
// import titleDialog from './components/titleDialog'
import mixin from '../order.js'
import dayjs from 'dayjs'
import cancelOrder from '../all-order/cancelOrder'
// 排车
import orderCar from '../commonDialog/orderCarDialog'
// 换车
import exchangeCar from '../commonDialog/exchangeCar'
// 用户详情
import vCustomerDetails from '../../../customer/customer-list/components/customer-details'
export default {
  name: 'overdue-get',
  components: {
    getTable,
    bindcarDialog,
    materialDialog,
    orderInformation,
    cancelOrder,

    orderCar,
    exchangeCar,
    vCustomerDetails
  },
  data() {
    return {
      searchSettings: searchSettings,
      labelWidth: '140px',
      searchData: {},
      searchList: [],
      paginatiomParams: {},
      showStatus: false,
      information: {},
      sn: '',
      orderSn: '',
      isCancelOrder: false,
      cancelOrderTitle: '取消订单',
      params: [],
      afterImg: {},
      beforeImg: {},
      authority: {
        exchangeCar: 'overdueGetExchangeCar',
        bindCard: 'overdueGetBindCard',
        resetTime: 'overdueGetResetTime',
        resetSalesmans: 'overdueGetResetSalesmans'
      },
      detailVisible: false,
      page: 1,
      userDetailData: {},
      btnVisible: false,
      userDetailVisible: false,
      userId: null
    }
  },
  mixins: [mixin],
  methods: {
    // 用户详情
    handleUserDetails(userId) {
      this.userId = userId
      this.userDetailVisible = true
    },
    update(userId) {
    },
    refeshPage(sn) {
      if (!sn) {
        sn = this.information.sn
      }
      this.getOrderInfor(sn)
      this.$refs.infor.getOrderLog()
    },
    closeRentCarSecondStep() {
      this.getOrderInfor(this.information.sn)
    },
    // 关闭窗口 和 插件对接
    closePage() {
      this.isCancelOrder = false
      this.getList(this.page)
    },
    // 取消页面
    closeAndRefresh() {
      this.isCancelOrder = false
      this.getList()
      this.getOrderInfor(this.information.sn)
      // this.loadTableData();
    },
    // 排车
    orderCar() {
      let obj = {
        title: '排车',
        size: '420px',
        sn: this.information.sn,
        takeStationId: this.information.takeStationId,
        takeStationName: this.information.takeStationName,
        cityId: this.information.cityId
      }

      this.$refs.orderCarDialog.show(obj)
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
          // this.rentCarParamas = res.data.data
          let obj = Object.assign({ userId: this.information.userId }, res.data.data)
          this.$refs.exchange.show(obj)
        }
      }).catch((res) => { })
    },
    cancelOrder() {
      console.dir('cancelOrder')
      this.isCancelOrder = true

      this.$service.getAllCancelReason().then((res) => {
        if (res.data.code == '0') {
          this.params = res.data.data
          this.orderSn = this.information.sn
          this.getOrderInfor(this.information.sn)
        }
      }).catch((res) => { })
    },
    showOrderInfor(row) {
      this.showStatus = true
      this.sn = row.sn
      this.getOrderInfor(row.sn)
    },
    getOrderInfor(sn) {
      this.$service.orderInformation({ orderSn: sn }).then((res) => {
        this.information = res.data.data
        this.information = this.$service.formateShortRentRow(res.data.data)
        this.information.expectTakeTime = dayjs(this.information.expectTakeTime).format('YYYY-MM-DD HH:mm:ss')
        this.information.expectTime = new Date(res.data.data.expectTakeTime)
        this.afterImg = this.information.afterImg ? this.pictureChange(this.information.afterImg) : {}
        this.beforeImg = this.information.beforeImg ? this.pictureChange(this.information.beforeImg) : {}
        this.$refs.infor.getOrderLog()
      })
    },

    showBindCard(cardNumber) {
      let params = {
        cardNumber: cardNumber,
        sn: this.sn
      }
      this.$refs.bind.show(params)
      this.$refs.infor.getOrderLog()
    },
    showMaterial(val) {
      this.$refs.material.show(val)
    },
    reload() {
      this.getList(this.page)
    },
    handleSearch(data) {
      this.$refs.tabList.page = 1
      this.page = 1
      let copy = Object.assign({}, data)
      this.searchData = this.searchTimeChange(copy)
      this.searchUserChange(this.searchData)
      this.getList()
    },
    pageChange(page) {
      this.page = page
      this.getList(page)
    },
    getList(page = 1) {
      this.$service.overdueGet(this.searchData, page).then((res) => {
        this.searchList = res.data.data.records
        this.searchList = this.$service.formateAllOrderList(res.data.data.records)

        this.paginatiomParams = {
          pageSize: res.data.data.pageSize,
          total: res.data.data.totalElements
        }
      }).catch((res) => { })
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
    this.getList()
  }
}
</script>
<style lang="scss">
</style>
