<template>
  <div class="violation-management" v-loading="loading" element-loading-text="处理中，请稍后..." element-loading-spinner="el-icon-loading">
    <el-card class="table-box">
      <div slot="header" class="clearfix">
        <v-search :searchSettings="searchSettings" @search="handleSearch" ></v-search>
      </div>
      <div class="table-operator">
        <el-button type="primary" size="small" @click="handleExport" :loading="exportLoading" v-has="'carViolationExport'">Excel导出</el-button>
      </div>
      <div class="table-container">
        <el-table :data="tableData" height="100%">
          <el-table-column label="车牌号" min-width="100">
            <template slot-scope="scope">
              <el-button type="text" @click="showDetailData(scope.row)">{{scope.row.carNumber}}</el-button>
            </template>
          </el-table-column>
          <el-table-column label="账号信息" min-width="130">
            <template slot-scope="scope">
              <div class="table-info">
                <span class="tel">{{scope.row.mobilePhone}}</span>
                <span class="name">{{scope.row.username}}</span>
                <span class="name">{{scope.row.userId}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="typeContent" label="租赁类型" min-width="80">
          </el-table-column>
          <el-table-column prop="orderId" label="订单号/工单号" min-width="210">
          </el-table-column>
          <el-table-column prop="carViolationInfo.time" label="违章时间" min-width="180">
          </el-table-column>
          <el-table-column prop="carViolationInfo.address" label="违章地点" show-overflow-tooltip min-width="180">
          </el-table-column>
          <el-table-column prop="carViolationInfo.content" label="违章原因" show-overflow-tooltip min-width="120">
          </el-table-column>
          <el-table-column prop="carViolationInfo.price" label="罚款金额" min-width="90">
          </el-table-column>
          <el-table-column prop="carViolationInfo.score" label="扣分" min-width="60">
          </el-table-column>
          <el-table-column label="系统查询时间" min-width="160">
            <template slot-scope="scope">
              {{scope.row.queryTime | timeFilter}}
            </template>
          </el-table-column>
          <el-table-column prop="dealStatus" label="处理状态" min-width="100"></el-table-column>
          <el-table-column label="操作" min-width="180" fixed="right">
            <template slot-scope="scope">
              <template v-if="scope.row.dealStatus != '用户处理'">
                <el-button type="text" @click="handleProcess(scope.row, 'accept')" v-if="scope.row.dealStatus == '待处理'">受理</el-button>
                <el-button type="text" @click="handleProcess(scope.row, 'finish')" v-if="scope.row.dealStatus == '公司处理'">处理完成</el-button>
                <el-button type="text" @click="handleProcess(scope.row, 'force')" v-if="scope.row.dealStatus == '用户提交审核'">强制扣款</el-button>
                <el-button type="text" @click="handleProcess(scope.row, 'audit')" v-if="scope.row.dealStatus == '用户提交审核'">审核</el-button>
                <el-button type="text" @click="handleProcess(scope.row, 'voucher')" v-if="scope.row.dealStatus == '已处理'">查看凭证</el-button>
                <el-button type="text" @click="handleProcess(scope.row, 'comment')">信息备注</el-button>
              </template>
              <template v-else-if="scope.row.dealStatus == '用户处理' && !scope.row.userId">
                <el-button type="text" @click="handleProcess(scope.row, 'finishUser')">处理完成</el-button>
                <el-button type="text" @click="handleProcess(scope.row, 'comment')">信息备注</el-button>
              </template>
              <template v-else>
                <el-button type="text" @click="handleProcess(scope.row, 'finishUser')">处理完成</el-button>
                <el-dropdown @command="handleMenuAction" @visible-change="handleDropdownOpen(scope.row)">
                  <span class="el-dropdown-link">更多操作
                    <i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="force">强制扣款</el-dropdown-item>
                    <el-dropdown-item command="comment">信息备注</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="table-page">
        <el-pagination :current-page="page" :page-size="pageSize" layout="total, prev, pager, next" :total="pageTotal" @current-change="_handlePageChange">
        </el-pagination>
      </div>
    </el-card>
    <violationProcessor :visible.sync="showProcessor" :data="currentData" :type="currentType" @success="handleDealDone"></violationProcessor>
    <v-page :visible.sync="detailDataVisible" v-if='currentData'>
      <h3 slot="title">违章详情：{{currentData.carNumber}}</h3>
      <v-detail slot='content' :detailSettings="detailSettings" :data="currentData"></v-detail>
    </v-page>
  </div>
</template>
<script>
import searchSettings from './components/searchSettings.js'
import { violationStatusDictionary } from '@/config/data-dictionary/car.js'
import violationProcessor from './components/violation-processor.vue'
import searchHistoryMixin from '@/mixins/search-history.js'
import paginationMixin from '@/mixins/pagination.js'
import detailSettings from './components/detailSettings.js'
import vDetail from '@/components/detail/v-detail'
export default {

  name: 'violation',

  components: {
    violationProcessor,
    vDetail
  },

  data() {
    return {
      searchSettings: searchSettings,
      tableData: [],
      showProcessor: false,
      currentData: null,
      currentType: '',
      detailDataVisible: false,
      detailSettings: detailSettings,
      searchParams: {},
      loading: false,
      exportLoading: false
    }
  },

  mixins: [searchHistoryMixin, paginationMixin],

  methods: {
    loadTableData() {
      this.$service.getViolationData(this.page, this.searchParams).then(res => {
        this.tableData = res.data.data.records
        this._changePageTotal(res.data.data.totalElements)
      })
    },
    handleSearch(data) {
      this.page = 1
      this.searchParams = data
      if (data.violationDate && data.violationDate.length) {
        this.searchParams.vioStartTime = data.violationDate[0]
        this.searchParams.vioEndTime = data.violationDate[1]
      }
      delete this.searchParams.violationDate
      this.loadTableData()
      if (data.searchContent) {
        this._saveSearchHistory(data.searchContent, 'searchContent')
      }
      if (data.userId) {
        this._saveSearchHistory(data.userId, 'userId')
      }
    },
    handleReset() {
    },
    getViolationStatus(status) {
      return violationStatusDictionary.find(item => item.value == status).label
    },
    handleProcess(data, type) {
      if (type == 'accept' && !data.userId) {
        this.$confirm('确定受理吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info'
        }).then(() => {
          this.loading = true
          this.$service.dealViolation('companyDealNoPay', {
            id: data.id
          }).then(res => {
            this.$message({
              message: '受理成功',
              type: 'success'
            })
            this.loadTableData()
            this.loading = false
          }).catch(err => {
            this.loading = false
          })
        }).catch(e => {})
        return
      } else if (type == 'finishUser') {
        this.$confirm('确定处理完成吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info'
        }).then(() => {
          this.loading = true
          this.$service.dealViolation('consumerCommitFinish', {
            id: data.id
          }).then(res => {
            this.$message({
              message: '处理成功',
              type: 'success'
            })
            this.loadTableData()
            this.loading = false
          }).catch(err => {
            this.loading = false
          })
        })
        return
      }
      this.currentData = data
      this.currentType = type
      this.showProcessor = true
    },
    handleDropdownOpen(data) {
      this.currentData = data
    },
    handleMenuAction(command) {
      this.currentType = command
      this.showProcessor = true
    },
    showDetailData(data) {
      this.currentData = data
      this.detailDataVisible = true
    },
    handleDealDone() {
      this.showProcessor = false
      this.loadTableData()
    },
    handleExport() {
      /* if(!this.searchParams.vioStartTime){
        this.$message({
          message: '请先选择日期',
          type: 'warning'
        })
        return
      } */
      // if((this.searchParams.vioEndTime-this.searchParams.vioStartTime)/60/60/24 > 31){
      //   this.$message({
      //     message: '导出时间范围必须小于等于31天，请重新设置',
      //     type: 'warning'
      //   })
      //   return
      // }
      if (!this.tableData || !this.tableData.length) {
        this.$message({
          message: '当前搜索数据为空',
          type: 'warning'
        })
        return
      }
      this.exportLoading = true
      this.$service.exportViolationExcel(this.searchParams).then(res => {
        this.exportLoading = false
      }).catch(err => {
        this.exportLoading = false
      })
    }
  },

  mounted() {
    this.loadTableData()
  }
}
</script>
<style lang="scss">

</style>
