<template>
  <div id="order-list">
    <el-card class="table-box">

      <div slot="header">
        <v-search :searchSettings="searchSettings" @search="handleSearch" :labelWidth="labelWidth">
          <template slot="filter" slot-scope="scope">
            <el-cascader :options="options" v-model="scope.model.filter" change-on-select></el-cascader>
          </template>
        </v-search>
      </div>

      <div class="table-operator">
        <el-button v-has="'orderEvaluateExport'" :loading="exportLoading" size="small" type="primary" @click="exportFile">导出</el-button>
      </div>

      <div class="table-container">
        <el-table :data="tableData" height="100%">
          <el-table-column prop="orderSn" label="订单信息" min-width="220px"></el-table-column>
          <el-table-column label="用户信息" min-width="120px">
            <template slot-scope="scope">
              <div>
                <div>{{scope.row.userName}}</div>
                <el-button type="text" style="padding:0" @click="handleUserDetails(scope.row.userId)">{{scope.row.userPhone}}</el-button>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="车辆信息" min-width="120px">
            <template slot-scope="scope">
              <div>
                <div>{{scope.row.carNumber}}</div>
                <div>{{scope.row.carGenreName}}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="cityName" label="地区"></el-table-column>
          <el-table-column label="订单网点" min-width="240px">
            <template slot-scope="scope">
              <div>
                <div>取车：{{scope.row.takeStationName}}</div>
                <div>还车：{{scope.row.returnStationName}}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="评价时间" min-width="150px"></el-table-column>
          <el-table-column prop="takeStationStar" label="评分" min-width="280px">
            <template slot-scope="scope">
              <div>
                <span class="starDec">取车网点：</span>
                <el-rate class="starDec" v-model="scope.row.takeStationStar" disabled></el-rate>
              </div>
              <div>
                <span class="starDec">还车网点：</span>
                <el-rate class="starDec" v-model="scope.row.returnStationStar" disabled></el-rate>
              </div>
              <div>
                <span class="starDec carDec">车况：</span>
                <el-rate class="starDec" v-model="scope.row.carStar" disabled></el-rate>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="content" label="文字反馈" min-width="160">
            <template slot-scope="scope">
              <div v-if="scope.row.content" style="white-space:nowrap">
                <p v-if="scope.row.content.length < 10">{{scope.row.content}}</p>
                <el-tooltip placement="top" v-else>
                  <div slot="content" class="tooltip-content">{{scope.row.content}}</div>
                  <p>{{scope.row.content.substr(0, 10)}}...</p>
                </el-tooltip>
              </div>
              <div v-else> - </div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class='table-page'>
        <el-pagination :current-page="page" :page-size="pageSize" layout="total, prev, pager, next" :total="pageTotal"
                       @current-change="_handlePageChange">
        </el-pagination>
      </div>

      <v-customer-details :userId="userId" :btnVisible="btnVisible" :visible.sync="userDetailVisible" @closePage="closePage" @update="update"></v-customer-details>
    </el-card>
  </div>
</template>
<script>
import searchSettings from './components/searchSettings.js'
import vPage from '@/components/page'
import searchHistoryMixin from '@/mixins/search-history.js'
import paginationMixin from '@/mixins/pagination.js'
import {handleSubmitSearchData} from '@/utils/common.js'
import { handleDate } from '@/utils/date-filter'
import vCustomerDetails from '../../customer/customer-list/components/customer-details'

export default {
  name: 'orderCharge',
  components: {
    vPage,
    vCustomerDetails
  },
  mixins: [searchHistoryMixin, paginationMixin],
  data() {
    return {
      labelWidth: '130px',
      searchData: {},
      tableData: [],
      searchSettings: searchSettings,
      formData: {},
      exportLoading: false,
      // 用户详情
      userId: null,
      btnVisible: false,
      userDetailVisible: false
    }
  },
  created() {
    this.loadTableData()
  },
  methods: {
    handleSearch(data) {
      let searchData = Object.assign({}, data)
      if (searchData.filter) {
        let key = searchData.filter[0]
        if (key === 'takeStationStar') {
          searchData.takeStationStar = searchData.filter[1]
        } else if (key === 'returnStationStar') {
          searchData.returnStationStar = searchData.filter[1]
        } else if (key === 'carStar') {
          searchData.carStar = searchData.filter[1]
        }
        delete searchData.filter
      }
      if (searchData.date && searchData.date.length) {
        searchData.datemin = handleDate(searchData.date[0], 'day')
        searchData.datemax = handleDate(searchData.date[1], 'day')
      }
      delete searchData.date

      searchData = handleSubmitSearchData(searchData)
      console.log(searchData)
      this.searchData = searchData
      this.page = 1
      this.loadTableData()
    },

    loadTableData() {
      let params = {page: this.page, pageSize: this.pageSize, ...this.searchData}
      this.$service.getOrderEvaluateList(params).then(res => {
        this.tableData = res.data.data.records
        console.log(this.tableData)
        this._changePageTotal(res.data.data.totalElements)
      })
    },

    exportFile() {
      if (this.searchData.datemin && this.searchData.datemax) {
        let start = new Date(this.searchData.datemin.replace(/-/g, '/')).getTime()
        let end = new Date(this.searchData.datemax.replace(/-/g, '/')).getTime()
        if (end - start <= 31 * 24 * 60 * 60 * 1000) {
          this.exportLoading = true
          this.$service.get_downloadOrderComment(
            this.searchData,
            '分时订单评价.xlsx'
          ).then(res => {
            this.exportLoading = false
          }).catch(err => {
            this.exportLoading = false
          })
        } else {
          this.$message.warning('导出订单评价时间范围必须小于等于31天，请重新设置')
        }
      } else {
        this.$message.warning('导出订单评价时间范围必须小于等于31天，请设置时间')
      }
    },
    // 用户详情
    handleUserDetails(userId) {
      this.userId = userId
      this.userDetailVisible = true
    },
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
  .starDec {
    display: inline-block;
    vertical-align: middle;
  }

  .carDec {
    margin-left: 30px;
  }

  .tooltip-content {
    max-width: 300px;
    overflow: hidden;
    white-space: normal;
    word-break: break-word;
    word-wrap: break-word;
  }
</style>
