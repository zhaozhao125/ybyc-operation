<template>
  <div class = 'optimus_check'>
    <el-card class="table-box">
      <div slot="header">
        <v-search :searchSettings="searchSettings" @search="handleSearch" :labelWidth="labelWidth"></v-search>
      </div>

      <!--  添加导出 + 按钮权限 -->
      <div class="table-operator">
        <el-button size="small" type="primary" @click = 'exportFile' v-has="'allOrderExport'">导出</el-button>
      </div>
      <wait-table ref="tabList" :list="searchList" :params="paginatiomParams" @on-pageChange = 'pageChange' @on-orderInfor = 'showOrderInfor' @handleUserDetails="handleUserDetails"></wait-table>
    </el-card>
     <v-page :visible.sync="showStatus" ref="vPage" @goBack="reload">
       <template slot="title" class = 'all_check_title'>
          <h3 style="line-height:30px; display:inline-block">订单详情</h3>
          <div class = 'all_operate' style = "float: right">
            <el-button size="small" type="primary" @click="settleMoney" v-if="information.settleStatus === 'unsettle' && $_has('waitSettlementAccount')">结算</el-button>
          </div>
        </template>
        <template slot="content">
           <order-information
           ref="infor"
           @on-bindCard="showBindCard" @on-materialDialog="showMaterial" :information="information" :sn="sn"  :afterImg="afterImg" :beforeImg="beforeImg" :authority = "authority"></order-information>
        </template>
    </v-page>
     <!-- 用户详情 -->
     <v-customer-details :userId="userId" :btnVisible="btnVisible" :visible.sync="userDetailVisible" @closePage="closePage" @update="update"></v-customer-details>
    <settle-account ref="settle" @on-success="settleSuccess"></settle-account>
    <bindcar-dialog ref="bind"></bindcar-dialog>
    <material-dialog ref="material" @on-success="refeshPage(sn)"></material-dialog>
  </div>
</template>
<script>
import { searchSettings } from './search-settings.js'
import waitTable from './components/table'
import orderInformation from '../common-information'
import settleAccount from './components/settleDialog'
import bindcarDialog from './components/bindCarDialog'
import materialDialog from './components/materialDialog'
import mixin from '../order.js'
// 用户详情
import vCustomerDetails from '../../../customer/customer-list/components/customer-details'
export default {
  name: 'wait-settlement',
  components: {
    waitTable,
    orderInformation,
    settleAccount,
    bindcarDialog,
    materialDialog,
    vCustomerDetails
  },
  mixins: [mixin],
  data () {
    return {
      searchSettings: searchSettings,
      labelWidth: '140px',
      searchData: {},
      searchList: [],
      paginatiomParams: {},
      showStatus: false,
      information: {},
      sn: '',
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
    exportFile () {
      if (this.searchData.length < 1) {
        this.$message.warning('导出订单为空，请重新查询！')
      } else {
        console.dir(this.searchData)
        this.$service.exportShort(
          this.searchData,
          this.$store.getters.token,
          '已还车待结算.xlsx',
          'waitSettlement'
        )
      }
    },
    refeshPage(sn) {
      if (!sn) {
        sn = this.information.sn
      }
      this.getOrderInfor(sn)
      this.$refs.infor.getOrderLog()
    },
    settleSuccess () {
      this.showStatus = false
      this.getList()
      this.getOrderInfor(this.information.sn)
      this.$refs.infor.getOrderLog()
    },
    settleMoney () {
      console.dir(this.information)
      this.$refs.settle.show(this.information)
    },
    showBindCard () {
      this.$refs.bind.show()
    },
    showMaterial () {
      let material = {
        materielStatus: this.information.materielStatus,
        sn: this.information.sn
      }
      this.$refs.material.show(material)
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
        this.$refs.infor.getOrderLog()
      })
    },
    handleSearch (data) {
      this.$refs.tabList.page = 1
      this.page = 1
      this.searchData = this.searchUserChange(data)
      this.searchUserChange(this.searchData)
      this.getList()
    },
    pageChange (page) {
      this.page = page
      this.getList(page)
    },
    getList (page = 1) {
      this.$service.waitSettlementList(this.searchData, page).then((res) => {
        this.searchList = res.data.data.records
        this.searchList = this.$service.formateAllOrderList(res.data.data.records)
        this.paginatiomParams = {
          pageSize: res.data.data.pageSize,
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
