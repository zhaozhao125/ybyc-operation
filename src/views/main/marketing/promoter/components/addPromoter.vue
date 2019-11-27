<template>
  <el-dialog title="添加推广员" :visible.sync="visible" width="900px" top="5vh" :before-close="handleBeforeClose">
    <el-card class="table-box">
      <div slot="header">
        <v-search :searchSettings="searchSettings" @search="handleSearch" ref="search" labelWidth="70px">
        </v-search>
      </div>
      <div class="table-container">
        <el-table v-loading="loading" :data="tableData" tooltip-effect="dark" style="width: 100%">
          <el-table-column prop="userPhone" label="手机" width="280">
          </el-table-column>
          <el-table-column prop="userName" label="姓名" min-width="150">
          </el-table-column>
          <el-table-column prop="userRoleName" label="角色" min-width="150">
          </el-table-column>
          <el-table-column label="操作" fixed="right" min-width="100px">
            <template slot-scope="scope">
              <el-popover :ref="'setPop' + scope.$index" title="" width="270" trigger="click" placement="top" v-if="scope.row.promoter === false">
                <el-button type="text" slot="reference">设为推广员</el-button>
                <P style="line-height:25px">
                  <i class="el-icon-warning" style="color:red;margin-right:5px;"></i>确定设置？</p>
                <div style="text-align: right">
                  <el-button size="small" type="text" @click="handleSetCancel(scope.$index)">取消</el-button>
                  <el-button type="primary" size="mini" @click="handleSetPromoter(scope.row, scope.$index)">确定</el-button>
                </div>
              </el-popover>
              <el-button type="text" disabled v-else>已设置</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class='table-page'>
        <el-pagination :current-page="page" :page-size="pageSize" layout="total, prev, pager, next" :total="pageTotal" @current-change="_handlePageChange">
        </el-pagination>
      </div>
    </el-card>
  </el-dialog>
</template>

<script>
import searchHistoryMixin from '@/mixins/search-history.js'
import paginationMixin from '@/mixins/pagination.js'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },

  mixins: [searchHistoryMixin, paginationMixin],

  data() {
    return {
      tableData: [],
      loading: true,
      loaded: false,
      searchSettings: [
        {
          label: '手机号',
          name: 'userPhone',
          type: 'text',
          placeholder: '请输入',
          visible: true
        },
        {
          label: '角色',
          name: 'userRoleId',
          type: 'remoteRole',
          visible: true
        }
      ],
      searchParams: {}
    }
  },

  watch: {
    visible(newVal) {
      // if (newVal && !this.loaded) {
      if (newVal) {
        this.loaded = true
        this.searchParams = null
        this.loadTableData()
      }
    }
  },

  methods: {
    handleBeforeClose() {
      this.$emit('update:visible', false)
      this.$refs.search.updateForm()
    },
    loadTableData() {
      this.loading = true
      this.$service
        .getPromoterCustomerList({
          page: this.page,
          pageSize: 10,
          ...this.searchParams
        })
        .then(res => {
          this.tableData = res.data.data.rows
          this._changePageTotal(res.data.data.total)
          this.loading = false
        })
        .catch(err => {
          this.loading = false
        })
    },
    handleSearch(params) {
      this.searchParams = params
      this.page = 1
      this.loadTableData()
    },
    handleSetPromoter(data, index) {
      let user = this.$store.getters.user
      this.$service
        .addPromoter({
          userIds: [data.userId],
          createBy: user.username,
          createByName: user.cnName
        })
        .then(res => {
          this.$message.success('添加成功')
          this.$refs['setPop' + index].doClose()
          this.loadTableData()
          this.$emit('loadTableData')
        })
        .catch(error => {
          this.$message.warning(error.msg ? error.msg : '添加失败')
          this.$refs['setPop' + index].doClose()
        })
    },
    handleSetCancel(index) {
      this.$refs['setPop' + index].doClose()
    }
  }
}
</script>

<style lang="scss">

</style>
