<template>
  <el-dialog :title="title" :visible.sync="visible" :before-close="handleBeforeClose" class="assign-list" width="660px">
    <div v-loading="loading" element-loading-text="加载中..." element-loading-spinner="el-icon-loading">
      <el-autocomplete size="small" class="search-input primary-append" :fetch-suggestions="_querySearch('search')" placeholder="手机号/姓名" v-model="searchModel">
        <el-button slot="append" icon="el-icon-search" @click="handleSearch">搜索</el-button>
      </el-autocomplete>
      <div class="table-container">
        <el-table :data="tableData" max-height="350">
          <el-table-column prop="mobile" label="手机号" min-width="120">
          </el-table-column>
          <el-table-column prop="name" label="姓名" min-width="100">
          </el-table-column>
          <el-table-column prop="userType.name" label="角色" min-width="100">
            <template slot-scope="scope">
              {{getOpUserType(scope.row.userType)}}
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" min-width="80">
            <template slot-scope="scope">
              {{scope.row.ready?'开工':'收工'}}
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="80">
            <template slot-scope="scope">
              <el-popover :ref="'popover'+scope.$index" placement="bottom" width="200" trigger="click">
                <p>确定{{title}}给该人员吗？</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="handleCancelAssign(scope.$index)">取消</el-button>
                  <el-button type="primary" size="mini" @click="handleConfirmAssign(scope.row,scope.$index)">确定</el-button>
                </div>
                <el-button slot="reference" type="text">{{title}}</el-button>
              </el-popover>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="table-page clearfix">
        <el-pagination :current-page="page" :page-size="pageSize" layout="total, prev, pager, next" :total="pageTotal" @current-change="_handlePageChange">
        </el-pagination>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="closeMe">取 消</el-button>
    </span>
  </el-dialog>
</template>
<script>
import searchHistoryMixin from '@/mixins/search-history.js'
import paginationMixin from '@/mixins/pagination.js'
import {getOpUserType} from '@/config/data-dictionary/workorder.js'
export default {

  name: 'assign-list',

  mixins: [searchHistoryMixin, paginationMixin],

  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '指派'
    },
    sn: {
      type: String
    }
  },

  data() {
    return {
      searchSettings: [{
        type: 'autocomplete',
        name: 'search',
        data: []
      }],
      searchModel: '',
      searchKeywords: null,
      tableData: [],
      loading: false
    }
  },

  methods: {
    closeMe() {
      this.searchKeywords = null
      this.$emit('update:visible', false)
      this.loading = false
    },
    handleSearch() {
      if (this.searchModel) {
        this.searchKeywords = this.searchModel
      } else {
        this.searchKeywords = null
      }
      if (this.searchModel) {
        this._saveSearchHistory(this.searchModel, 'search')
      }
      this.loadTableData()
    },
    loadTableData() {
      this.loading = true
      this.$service.getAvailableOpUser(this.page, this.searchKeywords, this.sn).then(res => {
        this.tableData = res.data.data.records
        this._changePageTotal(res.data.data.totalElements)
        this.loading = false
      }).catch(err => {
        this.loading = false
      })
    },
    handleConfirmAssign(data, index) {
      this.$refs['popover' + index].showPopper = false
      this.loading = true
      this.$service.assignWorkorder(this.sn, data.sn).then(res => {
        this.$message({
          message: this.title + '成功',
          type: 'success'
        })
        this.loading = false
        this.$emit('success')
      }).catch(err => {
        this.loading = false
      })
    },
    handleCancelAssign(index) {
      this.$refs['popover' + index].showPopper = false
    },
    handleBeforeClose() {
      this.closeMe()
    },
    getOpUserType: getOpUserType
  },

  watch: {
    visible() {
      if (this.visible && (!this.tableData || !this.tableData.length) && !this.loading) {
        this.loadTableData()
      }
    },
    sn(){
      if (this.visible && !this.loading) {
        this.searchModel = ''
        this.loadTableData()
      }
    }
  },

  mounted() {
    if (this.visible) {
      this.loadTableData()
    }
  }
}

</script>
<style lang="scss">
.assign-list {
  .search-input {
    width: 92%;
  }
  .el-dialog__body {
    padding: 10px 20px;
  }
  .table-page{
    .el-pagination{
      float: right;
          margin-top: 10px;
    }
  }
}

</style>
