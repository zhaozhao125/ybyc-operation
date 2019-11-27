<template>
  <div class="company-review">
    <el-card class="table-box">
      <div slot="header">
        <v-search :searchSettings="searchSettings" labelWidth="130px" @search="handleSearch" @reset="handleReset"></v-search>
      </div>
      <div class="table-container">
        <el-table :data="tableData" height="100%">
          <el-table-column prop="id" label="编号" min-width="80">
          </el-table-column>
          <el-table-column prop="companyName" label="企业名称" min-width="200">
          </el-table-column>
          <el-table-column label="用户信息" min-width="120">
            <template slot-scope="scope">
              <p>{{scope.row.applyUserName}}</p>
              <p>{{scope.row.applyUserPhone}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="处理状态" min-width="90">
            <template slot-scope="scope">
              <span :class="getCarStateStyle(scope.row.status)">{{applyStatusText[scope.row.status]}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="申请时间" min-width="180">
            <template slot-scope="scope">
              <div>{{scope.row.createTime/1000|timeFilter}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="refusalCause" label="原因" min-width="150">
            <template slot-scope="scope">
              <span v-if="scope.row.refusalCause">{{scope.row.refusalCause}}</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注" min-width="150">
            <template slot-scope="scope">
              <div v-if="scope.row.remark" style="white-space:nowrap">
                <p v-if="scope.row.remark.length < 10">{{scope.row.remark}}</p>
                <el-tooltip placement="top" v-else>
                  <div slot="content" class="tooltip-content">{{scope.row.remark}}</div>
                  <p>{{scope.row.remark.substr(0, 10)}}...</p>
                </el-tooltip>
              </div>
              <div v-else> - </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150" fixed="right">
            <template slot-scope="scope">
              <span v-if="scope.row.status == 'applying'">
                <el-button type="text" @click="handleCreateCompany(scope.row)">创建企业</el-button>
                <el-button type="text" @click="handleShowReject(scope.row)">拒绝</el-button>
              </span>
              <span v-else>-</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="table-page">
        <el-pagination :current-page="page" :page-size="pageSize" layout="total, prev, pager, next" :total="pageTotal" @current-change="_handlePageChange">
        </el-pagination>
      </div>
    </el-card>
    <!-- 拒绝 -->
    <el-dialog title="拒绝" :visible.sync="rejectVisible" width="30%" class="company-reject">
      <v-form ref="rejectForm" :formSettings="rejectSettings" label-width="60px" :showButton="false" @save="handleSubmitReject"></v-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="rejectVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="handleValidateReject">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import searchSettings from './components/searchSettings.js'
import paginationMixin from '@/mixins/pagination.js'
import { handleSubmitSearchData } from '@/utils/common.js'
export default {
  name: 'companyReview',

  mixins: [paginationMixin],

  data() {
    return {
      searchSettings: searchSettings,
      tableData: [],
      searchParams: null,
      rowId: null,
      rejectVisible: false,
      applyStatusText: {
        applying: '待审核',
        success: '已创建',
        fail: '已拒绝'
      },
      rejectSettings: [
        {
          label: '',
          items: [
            {
              label: '原因',
              name: 'refusalCause',
              type: 'select',
              required: true,
              options: [
                {
                  label: '企业已存在',
                  value: '企业已存在'
                },
                {
                  label: '提交资料不真实',
                  value: '提交资料不真实'
                },
                {
                  label: '提交资料不全',
                  value: '提交资料不全'
                },
                {
                  label: '联系不上用户',
                  value: '联系不上用户'
                },
                {
                  label: '用户暂不需要',
                  value: '用户暂不需要'
                },
                {
                  label: '其他',
                  value: '其他'
                }
              ]
            },
            {
              label: '备注',
              name: 'remark',
              type: 'textarea',
              placeholder: '请输入备注，最多可输入50个字'
            }
          ]
        }
      ]
    }
  },

  created() {
    this.loadTableData()
  },

  methods: {
    getCarStateStyle(state) {
      switch (state) {
        case 'applying':
          return 'state-yellow'
        case 'success':
          return 'state-green'
        case 'fail':
          return 'state-red'
      }
    },
    loadTableData() {
      if (this.searchData === undefined) {
        let status = { status: 'applying' }
        this.searchData = { ...status }
      }
      let params = {
        page: this.page,
        rows: this.pageSize,
        ...this.searchData
      }
      this.$service.getCompanyReviewList(params).then(res => {
        console.log('====res====', res.data.data)
        this.tableData = res.data.data.records
        this._changePageTotal(res.data.data.totalElements)
      })
    },
    handleSearch(params) {
      console.log('====params====', params)
      let searchData = Object.assign({}, params)
      if (searchData.applyTime && searchData.applyTime.length) {
        searchData.applyStartDate = searchData.applyTime[0] * 1000
        searchData.applyEndDate = searchData.applyTime[1] * 1000
        delete searchData.applyTime
      }
      searchData = handleSubmitSearchData(searchData)
      this.searchData = searchData
      this.page = 1
      this.loadTableData()
    },
    handleReset() {
      this.searchParams = null
    },
    handleShowReject(row) {
      this.rejectVisible = true
      this.rowId = row.id
    },
    handleValidateReject() {
      this.$refs.rejectForm.onSave()
    },
    handleSubmitReject(data) {
      let params = {
        ...data,
        id: this.rowId,
        checkUserName: this.$store.getters.user.username,
        checkUserNickName: this.$store.getters.user.cnName
      }
      console.log('====params====', params)
      this.$service.rejectCompanyApply(params).then(res => {
        if (res.data.code == '0') {
          this.$message({
            message: res.data.msg,
            type: 'success'
          })
        } else {
          this.$message({
            message: res.data.msg,
            type: 'error'
          })
        }
        this.rejectVisible = false
        this.loadTableData()
      })
    },
    // 创建企业
    handleCreateCompany(row) {
      this.$store.commit('sendToTab', {
        name: 'companyList',
        params: {
          companyName: row.companyName,
          id: row.id
        }
      })
    }
  }
}
</script>

<style lang="scss">
.tooltip-content {
    max-width: 300px;
    overflow: hidden;
    white-space: normal;
    word-break: break-word;
    word-wrap: break-word;
  }
</style>
