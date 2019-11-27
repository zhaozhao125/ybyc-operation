<template>
  <div id="customer-Authen-list">
    <el-card class="table-box">

      <div slot="header">
        <v-search :searchSettings="searchSettings" @search="handleSearch" :labelWidth="labelWidth"></v-search>
      </div>

      <div class="table-container">
        <el-table :data="tableData" height="100%">
          <el-table-column prop="userId" label="用户编号" min-width="120px">
          </el-table-column>
          <el-table-column label="用户信息" min-width="120px">
            <template slot-scope="scope">
              <div>
                <div>{{scope.row.userName}}</div>
                <div>{{scope.row.userPhone}}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="审核状态" min-width="120px">
            <template slot-scope="scope">
              <span :class="getCheckDataStatus(scope.row.checkDataStatus)">{{checkDataStatusText[scope.row.checkDataStatus]}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="cityName" label="注册城市" min-width="120px"></el-table-column>
          <el-table-column prop="cityNameBelongTo" label="所属城市" min-width="120px"></el-table-column>
          <el-table-column prop="autoAuditFlag" label="审核方式" min-width="120px">
            <template slot-scope="scope">
              <span v-if="scope.row.checkDataStatus === 0 || scope.row.checkDataStatus === 1">
                {{scope.row.autoAuditFlag === 1 ? "系统审核" : "人工审核"}}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="userUploadTime" label="提交审核时间" min-width="220px">
            <template slot-scope="scope">
              {{scope.row.userUploadTime|timeFilter}}
            </template>
          </el-table-column>
          <el-table-column prop="disposeTime" label="审核通过时间" min-width="220px">
            <template slot-scope="scope">
              {{scope.row.disposeTime|timeFilter}}
            </template>
          </el-table-column>
          <el-table-column prop="auditAdminCnName" label="审核人" min-width="220px">
            <template slot-scope="scope">
              <span v-if="scope.row.auditAdminCnName">{{scope.row.auditAdminCnName}}</span>
              <span v-if="scope.row.auditAdminName">({{scope.row.auditAdminName}})</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" min-width="100px">
            <template slot-scope="scope">
              <el-button type="text" @click="detailItem(scope.row)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class='table-page'>
        <el-pagination :current-page="page" :page-size="pageSize" layout="total, prev, pager, next" :total="pageTotal" @current-change="_handlePageChange">
        </el-pagination>
      </div>

      <v-customer-authentication-details :detailData="detailData" :userCheckedImgInfo="userCheckedImgInfo" @closePage="closePage" :visible.sync="detailVisible"></v-customer-authentication-details>

    </el-card>
  </div>
</template>
<script>
import searchSettings from './components/searchSettings.js'
import searchHistoryMixin from '@/mixins/search-history.js'
import paginationMixin from '@/mixins/pagination.js'
import { handleDate } from '@/utils/date-filter'
import { handleSubmitSearchData } from '@/utils/common.js'
import vCustomerAuthenticationDetails from './components/customer-authentication-details'

export default {
  name: 'customerAuthentication',
  mixins: [searchHistoryMixin, paginationMixin],
  components: {
    vCustomerAuthenticationDetails
  },
  data() {
    return {
      searchSettings: searchSettings,
      labelWidth: '140px',
      tableData: [],
      checkDataStatusText: {
        '-1': '未上传资料',
        '0': '审核不通过',
        '1': '审核通过',
        '2': '待审核'
      },
      detailVisible: false,
      detailData: {},
      userCheckedImgInfo: {}
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
      if (searchData.userUploadTime && searchData.userUploadTime.length) {
        searchData.dateStart = handleDate(searchData.userUploadTime[0], 'day')
        searchData.dateEnd = handleDate(searchData.userUploadTime[1], 'day')
        searchData.dateType = 3
      }
      delete searchData.userUploadTime
      if (searchData.disposeTime && searchData.disposeTime.length) {
        searchData.dateStart = handleDate(searchData.disposeTime[0], 'day')
        searchData.dateEnd = handleDate(searchData.disposeTime[1], 'day')
        searchData.dateType = 4
      }
      delete searchData.disposeTime
      searchData = handleSubmitSearchData(searchData)
      this.searchData = searchData
      this.page = 1
      this.loadTableData()
    },
    loadTableData() {
      if (this.searchData === undefined) {
        let checkDataStatus = { checkDataStatus: '2' }
        this.searchData = { ...checkDataStatus }
      }
      console.log(this.searchData)
      let params = {
        page: this.page,
        rows: this.pageSize,
        ...this.searchData
      }
      this.$service.getCustomerList(params).then(res => {
        this.tableData = res.data.data.rows
        this._changePageTotal(res.data.data.total)
      })
    },
    detailItem(row) {
      let params = {}
      params.userId = row.userId
      this.$service.getAuditDetail(params).then(res => {
        this.detailData = res.data.data.info
        this.userCheckedImgInfo = res.data.data.userCheckedImgInfo
        this.detailVisible = true
      })
    },
    closePage() {
      this.detailVisible = false
      this.loadTableData()
      this.detailData = {}
      this.userCheckedImgInfo = null
    }
  }
}
</script>
<style lang="scss">

</style>
