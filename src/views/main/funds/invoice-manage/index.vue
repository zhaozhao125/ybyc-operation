<template>
  <div class="invoice-list">
    <el-card class="table-box">
      <div slot="header">
        <v-search :searchSettings="searchSettings" labelWidth="130px" @search="handleSearch" @reset="handleReset"></v-search>
      </div>
      <div class="table-operator">
        <el-button :loading="exportLoading" size="small" type="primary" @click="exportFile">导出</el-button>
      </div>
      <div class="table-container">
        <el-table :data="tableData" height="100%">
          <el-table-column prop="sn" label="流水号" min-width="180">
            <template slot-scope="scope">
              <el-button type="text" @click="handleShowDetail(scope.row)">{{scope.row.sn}}</el-button>
            </template>
          </el-table-column>
          <el-table-column label="用户信息" min-width="130">
            <template slot-scope="scope">
              <div>{{scope.row.userName}}</div>
              <div>{{scope.row.userPhone}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" min-width="120">
            <template slot-scope="scope">
              <span v-if="scope.row.status == 'pending'">待处理</span>
              <span v-if="scope.row.status == 'processed'">已处理</span>
            </template>
          </el-table-column>
          <el-table-column prop="cityName" label="城市" min-width="100"></el-table-column>
          <el-table-column prop="money" label="开票金额" min-width="120px"></el-table-column>
          <el-table-column label="时间信息" min-width="240">
            <template slot-scope="scope">
              <div>申请时间：{{scope.row.applyTime/1000 | timeFilter}}</div>
              <div>处理时间：{{scope.row.handleTime/1000 | timeFilter}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="operatorCn" label="处理人" min-width="120px"></el-table-column>
        </el-table>
      </div>
      <div class="table-page">
        <el-pagination :current-page="page" :page-size="pageSize" layout="total, prev, pager, next" :total="pageTotal" @current-change="_handlePageChange">
        </el-pagination>
      </div>
    </el-card>
    <invoice-detail :visible.sync="detailVisible" :sn="sn" :status='status' @close="close"></invoice-detail>
  </div>
</template>

<script>
import searchSettings from './components/searchSettings.js'
import paginationMixin from '@/mixins/pagination.js'
import { handleSubmitSearchData } from '@/utils/common.js'
import { handleDate } from '@/utils/date-filter'
import invoiceDetail from './components/detail/invoice-detail'
export default {
  name: 'invoiceList',
  mixins: [paginationMixin],
  components: {
    invoiceDetail
  },
  data() {
    return {
      searchSettings: searchSettings,
      exportLoading: false,
      exportParams: null,
      tableData: [],
      searchData: null,
      detailVisible: false,
      sn: '',
      status: ''
    }
  },

  created() {
    this.loadTableData()
  },

  methods: {
    close() {
      this.loadTableData()
    },
    handleReset() {
      this.searchData = null
    },
    handleSearch(params) {
      console.log('====params====', params)
      let searchData = Object.assign({}, params)
      if (searchData.applyTime && searchData.applyTime.length) {
        searchData.startTime = handleDate(searchData.applyTime[0], 'day')
        searchData.endTime = handleDate(searchData.applyTime[1], 'day')
        searchData.timeQueryType = 'apply'
        delete searchData.applyTime
      }
      if (searchData.handleTime && searchData.handleTime.length) {
        searchData.startTime = handleDate(searchData.handleTime[0], 'day')
        searchData.endTime = handleDate(searchData.handleTime[1], 'day')
        searchData.timeQueryType = 'handle'
        delete searchData.handleTime
      }
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
      this.$service.getInvoiceList(params).then(res => {
        this.tableData = res.data.data.records
        this._changePageTotal(res.data.data.totalElements)
        if (this.tableData && this.tableData.length) {
          this.exportParams = Object.assign({}, this.searchData)
        } else {
          this.exportParams = null
        }
      })
    },
    exportFile() {
      if (!this.exportParams) {
        this.$message.warning('请先搜索出数据')
        return
      }
      if (this.exportParams.startTime && this.exportParams.endTime) {
        let start = new Date(
          this.exportParams.startTime.replace(/-/g, '/')
        ).getTime()
        let end = new Date(
          this.exportParams.startTime.replace(/-/g, '/')
        ).getTime()
        if (end - start <= 31 * 24 * 60 * 60 * 1000) {
          if (this.tableData.length === 0) {
            this.$message.warning('导出发票列表为空，请重新查询')
          } else {
            this.exportLoading = true
            this.$service
              .invoiceExport(this.exportParams, '发票列表.xlsx')
              .then(res => {
                this.exportLoading = false
              })
              .catch(err => {
                this.exportLoading = false
              })
          }
        } else {
          this.$message.warning(
            '导出发票列表时间范围必须小于等于31天，请重新设置'
          )
        }
      } else {
        this.$message.warning(
          '导出发票列表时间范围必须小于等于31天，请设置时间'
        )
      }
    },
    handleShowDetail(row) {
      this.detailVisible = true
      this.sn = row.sn
      this.status = row.status
    }
  }
}
</script>

<style lang="scss">
</style>
