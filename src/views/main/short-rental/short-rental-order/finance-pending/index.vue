<template>
  <div class = 'finance_pending'>
    <el-card class="table-box">
      <div slot="header">
        <v-search :searchSettings="searchSettings" @search="handleSearch" :labelWidth="labelWidth"></v-search>
      </div>
      <finance-table ref="tabList" :list = 'searchList' @on-orderInfor = 'showOrderInfor' :params = "paginatiomParams" @on-pageChange="pageChange" @handleUserDetails="handleUserDetails"></finance-table>
    </el-card>
    <v-page :visible.sync="showStatus" ref="vPage" @goBack="reload">
       <template slot="title" class = 'all_check_title'>
          <h3 style="line-height:30px; display:inline-block">订单详情</h3>
          <div class = 'all_operate' style = "float: right">
            <el-button size="small" @click="refund" type="primary" v-has="'financePendingRefound'">退款</el-button>
          </div>
        </template>
        <template slot="content">
           <order-information
            @on-bindCard="showBindCard"
            @on-materialDialog="showMaterial"
            :sn="sn"
            :information="information"
            :afterImg="afterImg"
            :beforeImg="beforeImg"
            :authority="authority"
            ref="infor"
            ></order-information>
        </template>
    </v-page>
     <!-- 用户详情 -->
    <v-customer-details :userId="userId" :btnVisible="btnVisible" :visible.sync="userDetailVisible" @closePage="closePage" @update="update"></v-customer-details>
    <settle-account ref="settle" @on-success="refundSuccess"></settle-account>
    <bindcar-dialog ref="bind"></bindcar-dialog>
    <material-dialog ref="material" @on-success="refeshPage(sn)"></material-dialog>
  </div>
</template>
<script>
import { searchSettings } from './search-settings.js'
import financeTable from './components/table'
import orderInformation from '../common-information'
import settleAccount from './components/settleDialog'
import bindcarDialog from './components/bindCarDialog'
import materialDialog from './components/materialDialog'
import mixin from '../order.js'
// 用户详情
import vCustomerDetails from '../../../customer/customer-list/components/customer-details'
export default {
  name: 'finance-pending',
  components: {
    financeTable,
    settleAccount,
    bindcarDialog,
    materialDialog,
    orderInformation,
    vCustomerDetails
  },
  data () {
    return {
      searchSettings: searchSettings,
      labelWidth: '140px',
      searchData: {},
      searchList: [],
      paginatiomParams: {},
      showStatus: false,
      sn: '',
      information: {},
      afterImg: {},
      beforeImg: {},
      authority: {
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
    exportFile () {
    },
    handleSearch (data) {
      this.$refs.tabList.page = 1
      this.page = 1
      let copy = Object.assign({}, data)
      this.searchData = this.searchTimeChange(copy)
      // 订单类型设置
      if (this.searchData.orderType == 'all') {
        delete this.searchData.orderType
      }

      this.searchUserChange(this.searchData)
      this.getList()
    },
    showBindCard () {
      this.$refs.bind.show()
      this.$refs.infor.getOrderLog()
    },
    showMaterial () {
      let material = {
        materielStatus: this.information.materielStatus,
        sn: this.information.sn
      }
      this.$refs.material.show(material)
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
        this.$refs.infor.getOrderLog()
      })
    },
    reload () {
      this.getList(this.page)
    },
    refund () {
      this.$service.refoundCheck({ orderSn: this.information.sn }).then((res) => {
        // this.refundMoney = res.data.data.refundMoney
        let params = {
          refundMoney: res.data.data.refundMoney,
          sn: this.information.sn
        }
        this.$refs.settle.show(params)
      }).catch((res) => {
      })
    },
    refundSuccess () {
      this.showStatus = false
      this.getList()
    },
    pageChange (page) {
      this.page = page
      this.getList(page)
    },
    getList (page = 1) {
      this.$service.financePending(this.searchData, page).then((res) => {
        this.searchList = res.data.data.records
        this.searchList = this.$service.formateAllOrderList(res.data.data.records)

        this.paginatiomParams = {
          pageSize: 20,
          total: res.data.data.totalElements
        }
      }).catch((res) => {
      })
    }
  },
  mounted () {
    this.getList()
  }
}
</script>
<style lang="scss">

</style>
