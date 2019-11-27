<template>
  <div id="customer-list">
    <el-card class="table-box">

      <div slot="header">
        <v-search :searchSettings="searchSettings" ref="myTable" @search="handleSearch" :labelWidth="labelWidth"></v-search>
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
          <el-table-column label="状态" min-width="120px">
            <template slot-scope="scope">
              <span :class="getCheckDataStatus(scope.row.status)">{{checkDataStatusText[scope.row.status]}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="createdOn" label="提交时间" min-width="120px"></el-table-column>
          <el-table-column prop="modifiedOn" label="处理时间" min-width="120px"></el-table-column>
          </el-table-column>

          <el-table-column label="操作" fixed="right" min-width="100px">
            <template slot-scope="scope">
              <el-button class="el-button--text" type="text" @click="detailItem(scope.row.userId
)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class='table-page'>
        <el-pagination :current-page="page" :page-size="pageSize" layout="total, prev, pager, next" :total="pageTotal" @current-change="_handlePageChange">
        </el-pagination>
      </div>

      <v-customer-driver-license-details @closeAndRefresh="closeAndRefresh" :detailData="detailData" :visible.sync="detailVisible"></v-customer-driver-license-details>

    </el-card>
  </div>
</template>
<script>
import searchSettings from './components/searchSettings.js'
import searchHistoryMixin from '@/mixins/search-history.js'
import paginationMixin from '@/mixins/pagination.js'
import { handleDate } from '@/utils/date-filter'
import { handleSubmitSearchData } from '@/utils/common.js'
import vCustomerDriverLicenseDetails from './components/customer-driver-license-details'

export default {
  name: 'driverLicenseReview',
  components: {
    vCustomerDriverLicenseDetails
  },
  mixins: [searchHistoryMixin, paginationMixin],
  data() {
    return {
      labelWidth: '120px',
      searchSettings: searchSettings,
      tableData: [],
      detailVisible: false,
      detailData: {},
      checkDataStatusText: {
        '3': '审核不通过',
        '2': '审核通过',
        '1': '待审核'
      }
    }
  },
  methods: {
    getCheckDataStatus(state) {
      switch (state) {
        case 3:
          return 'state-red'
        case 2:
          return 'state-green'
        case 1:
          return 'state-yellow'
      }
    },
    handleSearch(data) {
      let searchData = Object.assign({}, data)
      if (searchData.time && searchData.time.length) {
        searchData.dateStart = handleDate(searchData.time[0], 'day')
        searchData.dateEnd = handleDate(searchData.time[1], 'day')
      }
      delete searchData.time
      searchData = handleSubmitSearchData(searchData)
      this.searchData = searchData
      this.page = 1
      this.loadTableData()
    },
    loadTableData() {
      this.pageSize = 20
      let params = {
        page: this.page,
        pageSize: this.pageSize,
        ...this.searchData
      }
      this.$service.getDriverLicenseReviewList(params).then(res => {
        this.tableData = res.data.data.rows
        this._changePageTotal(Number(res.data.data.total))
      })
    },
    //点击添加/编辑
    detailItem(userId) {
      //获取用户驾照详情
      let detailParams = {"userId": userId}
      this.$service.getDriverLicenseDetail(detailParams).then(res => {
        if(res.data.code == 0){
          this.detailData = res.data.data.userInfo
          this.detailData.expireDate = res.data.data.info.expireDate
          this.detailData.status = res.data.data.info.status
          this.detailData.driverLicenseCopyImg = res.data.data.info.driverLicenseCopyImg
          this.detailData.driverLicenseFrontImg = res.data.data.info.driverLicenseFrontImg
        }else{
          this.detailData = []
        }

        this.detailData.imgCheckedList =[
          { title: '驾驶证正面图片', url: this.detailData.driverLicenseFrontImg },
          { title: '驾驶证副本图片', url: this.detailData.driverLicenseCopyImg }
        ]
        console.log(this.detailData)
        this.detailVisible = true
      })
    },
    // 关闭窗口
    closeAndRefresh() {
      this.detailVisible = false
      this.loadTableData()
    }
  },
  computed: {
    user() {
      return this.$store.getters.user
    }
  },
  created() {
    this.loadTableData()
  }
}
</script>
<style lang="scss">

</style>
