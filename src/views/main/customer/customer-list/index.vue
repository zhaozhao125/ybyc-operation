<template>
  <div id="customer-list">
    <el-card class="table-box">

      <div slot="header">
        <v-search :searchSettings="searchSettings" @search="handleSearch" :labelWidth="labelWidth"></v-search>
      </div>

      <div class="table-container">
        <el-table :data="tableData" height="100%">
          <el-table-column label="用户编号" min-width="120px">
            <template slot-scope="scope">
              <span v-if="!scope.row.userId">未知</span>
              <el-button type="text" v-else @click="getDetails(scope.row.userId)">{{scope.row.userId}}</el-button>
            </template>
          </el-table-column>
          <el-table-column label="用户信息" min-width="150px">
            <template slot-scope="scope">
              <div>
                <div>{{scope.row.userName}}</div>
                <div>{{scope.row.userPhone}}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="cityName" label="注册城市" min-width="120px"></el-table-column>
          <el-table-column prop="cityNameBelongTo" label="所属城市" min-width="120px"></el-table-column>
          <el-table-column label="认证状态" min-width="120px">
            <template slot-scope="scope">
              <span :class="getCheckDataStatus(scope.row.checkDataStatus)">{{checkDataStatusText[scope.row.checkDataStatus]}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="userMoney" label="余额" min-width="200px">
            <template slot-scope="scope">
              <div>
                <div>充值余额：{{scope.row.userMoney}}</div>
                <div>赠送余额：{{scope.row.userMoneyPresentation}}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="timeShareRentDeposit" label="分时保证金" min-width="120px">
          </el-table-column>
          <el-table-column prop="longTermRentCarDeposit" label="长租车辆押金" min-width="120px">
          </el-table-column>
          <el-table-column prop="longTermRentViolationDeposit" label="长租违章押金" min-width="120px">
          </el-table-column>
          <el-table-column prop="userRoleName" label="用户角色" min-width="150px">
          </el-table-column>
          <el-table-column prop="utmCampaign" label="注册来源" min-width="200px">
            <template slot-scope="scope">
              <div>{{scope.row.utmCampaign}}</div>
              <div>{{scope.row.utmMedium}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="statusCode" label="账户状态" min-width="150px">
            <template slot-scope="scope">
              <popSwitch v-model="scope.row.statusCode" trueText="账户禁用后，用户将不能正常登陆和使用APP。确定禁用？" falseText="确定要启用该用户吗？" @confirm="handleConfirmSwitch(scope.row)" @cancel="handleCancelSwitch"></popSwitch>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class='table-page'>
        <el-pagination :current-page="page" :page-size="pageSize" layout="total, prev, pager, next" :total="pageTotal" @current-change="_handlePageChange">
        </el-pagination>
      </div>

      <v-customer-details :userId="userId" :btnVisible="btnVisible" :visible.sync="detailVisible" @closePage="closePage" @update="update"></v-customer-details>

    </el-card>
  </div>
</template>
<script>
import searchSettings from './components/searchSettings.js'
import searchHistoryMixin from '@/mixins/search-history.js'
import paginationMixin from '@/mixins/pagination.js'
import { handleDate } from '@/utils/date-filter'
import { handleSubmitSearchData } from '@/utils/common.js'
import popSwitch from '@/components/pop-switch'
import vCustomerDetails from './components/customer-details'

export default {
  name: 'customerList',
  mixins: [searchHistoryMixin, paginationMixin],
  components: {
    popSwitch,
    vCustomerDetails
  },
  data() {
    return {
      searchSettings: searchSettings,
      labelWidth: '150px',
      tableData: [],
      checkDataStatusText: {
        '-1': '未上传资料',
        '0': '审核不通过',
        '1': '审核通过',
        '2': '待审核'
      },
      detailVisible: false,
      userId: null,
      btnVisible: true
    }
  },
  created() {
    this.loadTableData()
  },
  methods: {
    getCheckDataStatus(state) {
      switch (state) {
        case -1:
          return 'state-gray'
        case 0:
          return 'state-red'
        case 1:
          return 'state-green'
        case 2:
          return 'state-yellow'
      }
    },
    getDetails(userId) {
      this.userId = userId
      this.detailVisible = true
    },
    handleSearch(data) {
      let searchData = Object.assign({}, data)
      if (searchData.cityId) {
        searchData.cityType = 'register'
      }
      if (searchData.cityIdBelongTo) {
        searchData.cityId = searchData.cityIdBelongTo
        searchData.cityType = 'belongTo'
        delete searchData.cityIdBelongTo
      }
      if (searchData.registerTime && searchData.registerTime.length) {
        searchData.dateStart = handleDate(searchData.registerTime[0], 'day')
        searchData.dateEnd = handleDate(searchData.registerTime[1], 'day')
        searchData.dateType = 1
      }
      if (searchData.userUploadTime && searchData.userUploadTime.length) {
        searchData.dateStart = handleDate(searchData.userUploadTime[0], 'day')
        searchData.dateEnd = handleDate(searchData.userUploadTime[1], 'day')
        searchData.dateType = 4
      }
      if (searchData.timeShareRechargeFirstTime && searchData.timeShareRechargeFirstTime.length) {
        searchData.dateStart = handleDate(searchData.timeShareRechargeFirstTime[0], 'day')
        searchData.dateEnd = handleDate(searchData.timeShareRechargeFirstTime[1], 'day')
        searchData.dateType = 5
      }
      if (searchData.timeShareOrderFirstTime && searchData.timeShareOrderFirstTime.length) {
        searchData.dateStart = handleDate(searchData.timeShareOrderFirstTime[0], 'day')
        searchData.dateEnd = handleDate(searchData.timeShareOrderFirstTime[1], 'day')
        searchData.dateType = 6
      }
      delete searchData.registerTime
      delete searchData.userUploadTime
      delete searchData.timeShareRechargeFirstTime
      delete searchData.timeShareOrderFirstTime
      searchData = handleSubmitSearchData(searchData)
      this.searchData = searchData
      this.page = 1
      this.loadTableData()
    },
    loadTableData() {
      let params = {
        page: this.page,
        rows: this.pageSize,
        ...this.searchData
      }
      this.$service.getCustomerList(params).then(res => {
        this.tableData = res.data.data.rows
        this.tableData.forEach(item => {
          if (item.statusCode === 1) {
            item.statusCode = true
          } else if (item.statusCode === 0) {
            item.statusCode = false
          }
        })
        this._changePageTotal(res.data.data.total)
      })

      // this.$service.getRoleList().then(res => {})
    },
    handleConfirmSwitch(row) {
      let status = row.statusCode
      if (status === true) status = 0
      else status = 1

      this.$service
        .switchCustomerStatus(row.userId, status)
        .then(res => {
          row.statusCode = !row.statusCode
          this.$message({
            message: row.statusCode ? '启用成功' : '禁用成功',
            type: 'success'
          })
        })
    },
    handleCancelSwitch() {},
    closePage() {
      this.loadTableData()
    },
    update(userId) {
      this.getDetails(userId)
    }
  }
}
</script>
<style lang="scss">

</style>
