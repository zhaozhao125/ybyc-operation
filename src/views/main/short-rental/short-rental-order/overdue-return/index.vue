<template>
  <div class = 'overdue_return'>
    <el-card class="table-box">
      <div slot="header">
        <v-search :searchSettings="searchSettings" @search="handleSearch" :labelWidth="labelWidth"></v-search>
      </div>
      <return-table ref="tabList" :list="searchList" :params="paginatiomParams" @on-pageChange = 'pageChange' @on-orderInfor = 'showOrderInfor'  @handleUserDetails="handleUserDetails"></return-table>
    </el-card>
    <v-page :visible.sync="showStatus" ref="vPage" @goBack="reload">
       <template slot="title" class = 'all_check_title'>
          <h3 style="line-height:30px; display:inline-block">订单详情</h3>
          <div class = 'all_operate' style = "float: right">
            <el-button size="small" @click="returnCar"  v-if="information.hasBindCar && $_has('overdueReturnCar')" >还车</el-button>
            <el-button size="small" @click="setFree" v-if="information.hasBindCar && $_has('overdueReturnSetFree')" >设置空闲</el-button>
            <el-button size="small" @click="sendRentCar" v-if="information.hasBindCar && $_has('overdueReturnSendCarOrder')" >发送租车指令</el-button>
          </div>
        </template>
        <template slot="content">
           <order-information
            ref="infor"
           @on-bindCard="showBindCard" @on-materialDialog="showMaterial" :sn="sn"  :information="information" :afterImg="afterImg" :beforeImg="beforeImg" @on-exchangeCar="exchangeCarFirst()" @on-resetTime="refeshPage(sn)" :authority = "authority"></order-information>
        </template>
    </v-page>
    <v-page :visible.sync="showReturnCar" ref="vPage" @goBack="reload">
       <template slot="title" class = 'all_check_title'>
          <h3 style="line-height:30px; display:inline-block" >还车</h3>
        </template>
        <template slot="content" >
           <el-form ref="form"  label-width="100px" class="return_form" style="width: 50%">
              <el-form-item label="还车网点：">
                <div >
                  <!-- <el-button size='small' @click="chooseNet" type="text" v-if="returnStationName">{{returnStationName}}</el-button>
                  <span v-else style="color: #F56C6C">未检测到网点</span> -->
                  <span style="color: #F56C6C">{{returnStationName ? returnStationName : '未检测到网点'}}</span>
                  <el-button size='small' @click="chooseNet" type="text" >设置还车网点</el-button>
                </div>
              </el-form-item>
               <el-form-item label="还车拍照：" class="pic">
                 <v-detail :detailSettings="returnPicSetting" :data="returnCarImg" label-align="left" label-width="80px" class="return_car_pic">
                 </v-detail>
              </el-form-item>
               <el-form-item label="还车备注：">
                 <el-input type="textarea"  v-model="returnRemark" placeholder="请输入还车备注" ></el-input>
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
    <v-customer-details :userId="userId" :btnVisible="btnVisible" :visible.sync="userDetailVisible" @closePage="closePage" @update="update"></v-customer-details>

    <bindcar-dialog ref="bind" @on-bind="refeshPage(sn)"></bindcar-dialog>
    <material-dialog ref="material" @on-success="refeshPage(sn)"></material-dialog>
    <return-dialog ref="returnCar" @on-parse="parseReturn"></return-dialog>

    <!--还车押金提示-->
    <el-dialog
      title="提示"
      :visible.sync="returnCarNoticemsg"
       width="420px"
      center>
      <span center>{{noticemsg}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="continueReturnCar">继续还车</el-button>
        <el-button @click="returnCarNoticemsg = false">取 消</el-button>
      </span>
    </el-dialog>

    <!--还车普通提示-->
    <el-dialog
      title="提示"
      :visible.sync="returnCarNoticemsgComm"
      width="420px"
      center>
      <span center>{{noticemsg}}</span>
    </el-dialog>

    <el-dialog title="提示" :visible.sync="setFreeShow" width="420px" center>
        <div>已成功结束订单。</div>
        <div>车辆{{setFreeCarNumber}}设置空闲失败，
          <el-button type="text" @click="setCarFree()">
            手动设置空闲
          </el-button>
        </div>
    </el-dialog>
     <!-- 排车 -->
    <order-car ref = "orderCarDialog" @on-success="refeshPage(sn)"></order-car>
     <!-- 换车 -->
    <exchange-car ref = "exchange" @exchange-first = "orderCar" @continueOrder = "orderCar" @getOrderInfor = "getOrderInfor(information.sn)"></exchange-car>
  </div>
</template>
<script>
import { searchSettings } from './search-settings.js'
import returnTable from './components/table'
// import titleDialog from './components/titleDialog'
import orderInformation from '../common-information'
// import settleAccount from './components/settleDialog'
import bindcarDialog from './components/bindCarDialog'
import materialDialog from './components/materialDialog'
import returnDialog from './components/returnCarDialog.vue'
import searchStation from '@/components/search-station/'
import vDetail from '@/components/detail/v-detail'
import mixin from '../order.js'

// 排车
import orderCar from '../commonDialog/orderCarDialog'
// 换车
import exchangeCar from '../commonDialog/exchangeCar'
// 用户详情
import vCustomerDetails from '../../../customer/customer-list/components/customer-details'
export default {
  name: 'overdue-return',
  components: {
    returnTable,
    // settleAccount,
    bindcarDialog,
    materialDialog,
    orderInformation,
    searchStation,
    vDetail,
    returnDialog,
    // titleDialog,

    orderCar,
    exchangeCar,
    vCustomerDetails
  },
  data () {
    return {
      setFreeCarNumber: '',
      setFreeShow: false,
      returnCarNoticemsgComm: false,
      returnCarNoticemsg: false,
      noticemsg: '',
      searchSettings: searchSettings,
      labelWidth: '140px',
      searchData: {},
      sn: '',
      returnPicSetting: [{
        label: '',
        items: [
          {
            label: '',
            value: 'images',
            type: 'image'
          }
        ]
      }],
      searchList: [],
      paginatiomParams: {},
      showStatus: false,
      showReturnCar: false,
      stationVisible: false,
      information: {},
      afterImg: {},
      beforeImg: {},
      returnCarImg: {},
      returnStationName: '',
      selectStation: {},
      stationParams: {
        rentTypeCode: 3
      },
      returnRemark: '',
      authority: {
        getMaterial: 'overdueReturnGet',
        returnMaterial: 'overdueReturnReturn',
        resetSalesmans: 'overdueReturnResetSalesmans'
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
    handleUserDetails(userId) {
      this.userId = userId
      this.userDetailVisible = true
    },
    update (userId) {
    },
    closePage() {
      this.getList(this.page)
    },
    refeshPage(sn) {
      if (!sn) {
        sn = this.information.sn
      }
      this.getOrderInfor(sn)
      this.$refs.infor.getOrderLog()
    },
    setCarFree() {
      this.$store.commit('sendToTab', {
        name: 'carStatus',
        params: {
          carNumber: this.information.carNumber
        }
      })
      this.setFreeShow = false
    },

    continueReturnCar() {
      this.returnCarNoticemsg = false
      this.showReturnCar = true
      return false
      // this.changeCars()
    },
    // 排车
    orderCar () {
      let obj = {
        title: '排车',
        size: '50% ',
        sn: this.information.sn,
        takeStationId: this.information.takeStationId,
        takeStationName: this.information.takeStationName,
        cityId: this.information.cityId
      }

      this.$refs.orderCarDialog.show(obj)
    },
    // 换车
    exchangeCarFirst () {
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
      }).catch((res) => {})
    },
    parseReturn (type) {
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
        this.showReturnCar = false
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
    comfirmReturnCar (force) {
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
        this.$message.success('还车成功！')
        this.allOrderList()
        this.getOrderInfor(this.information.sn)
      }).catch((res) => {
        let code = res.code.slice(0, 2)
        if (code === '51') {
          this.returnCarNoticemsg = false
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
        //   this.returnCarNoticemsg = false
        //   this.returnCarNoticemsgComm = true
        //   this.noticemsg = res.msg
        // }
      })
    },
    handleSelectStation (val) {
      this.selectStation = val
      this.returnStationName = val.name
      this.information.returnStationId = val.id
    },
    chooseNet () {
      this.stationVisible = true
    },
    returnCar () {
      let params = {
        orderSn: this.information.sn,
        userId: this.information.userId
      }

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
        //   this.noticemsg = res.msg
        // }
      })
    },
    reload () {
      this.getList(this.page)
    },
    showOrderInfor (row) {
      this.showStatus = true
      this.sn = row.sn
      this.getOrderInfor(row.sn)
    },
    getOrderInfor (sn) {
      this.$service.orderInformation({ orderSn: sn }).then((res) => {
        this.information = res.data.data

        this.information = this.$service.formateShortRentRow(res.data.data)

        this.afterImg = this.information.afterImg ? this.pictureChange(this.information.afterImg) : {}
        this.beforeImg = this.information.beforeImg ? this.pictureChange(this.information.beforeImg) : {}
        this.returnStationName = this.information.returnStationName
        this.$refs.infor.getOrderLog()
        // this.stationParams = {
        //   carNumber: this.information.carNumber,
        //   currentCityId: this.information.cityId,
        //   // 1分时   3 长短租
        //   rentTypeCode:3,
        // }
      })
    },
    // settleMoney () {
    //   this.$refs.settle.show()
    // },
    showBindCard (cardNumber) {
      let params = {
        cardNumber: cardNumber,
        sn: this.sn
      }
      this.$refs.bind.show(params)
      this.$refs.infor.getOrderLog()
    },
    showMaterial () {
      let material = {
        materielStatus: this.information.materielStatus,
        sn: this.information.sn
      }
      this.$refs.material.show(material)
    },
    handleSearch (data) {
      this.$refs.tabList.page = 1
      this.page = 1
      // this.searchData = this.searchTimeChange(data)
      // console.log(this.searchData)
      let copy = Object.assign({}, data)
      this.searchData = this.searchTimeChange(copy)
      this.searchUserChange(this.searchData)
      this.getList()
      // this.getList(page = 1)
    },
    pageChange (page) {
      this.getList(page)
    },
    getList (page = 1) {
      this.$service.overdueReturn(this.searchData, page).then((res) => {
        this.searchList = res.data.data.records
        this.searchList = this.$service.formateAllOrderList(res.data.data.records)

        this.paginatiomParams = {
          pageSize: res.data.data.pageSize,
          total: res.data.data.totalElements
        }
      }).catch((res) => {
      })
    },
    setFree () {
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
    sendRentCar () {
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
  mounted () {
    this.getList()
  }
}
</script>
<style lang="scss">
.overdue_return {
  .return_form {
    .return_car_pic {
      .detail-section {
        ul {
          padding-left:0;
        }
        .detail-item {
          .item-label {
            width: 0 !important;
            margin-right:0 !important;
          }
        }
      }
    }
  }
}
</style>
