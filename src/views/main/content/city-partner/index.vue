<template>
  <div class="workorder">
    <el-card class="table-box">
      <div slot="header">
        <v-search :searchSettings="searchSettings" labelWidth="130px" @search="handleSearch" @reset="handleReset"></v-search>
      </div>
      <div class="table-container">
        <el-table :data="tableData" height="100%">
          <el-table-column prop="name" label="姓名" min-width="120px"></el-table-column>
          <el-table-column prop="job" label="职位" min-width="120px"></el-table-column>
          <el-table-column prop="phone" label="联系方式" min-width="120px"></el-table-column>
          <el-table-column prop="company" label="公司名称" min-width="120px"></el-table-column>
          <el-table-column prop="city" label="城市" min-width="120px"></el-table-column>
          <el-table-column prop="address" label="详细地址" min-width="120px"></el-table-column>
          <!-- <el-table-column label="操作" fixed="right" min-width="100px">
            <template slot-scope="scope">
              <el-popover class="confirm-popover" placement="bottom" width="160" :ref="'resetPopper' + scope.$index">
                <el-button slot="reference" type="text">删除</el-button>
                <p>确定要删除新闻吗？</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="handleDeleteCancel(scope.$index)">取消</el-button>
                  <el-button type="primary" size="mini" @click="handleDeleteNews(scope.row, scope.$index)">确定</el-button>
                </div>
              </el-popover>
            </template>
          </el-table-column> -->
        </el-table>
      </div>
      <div class="table-page">
        <el-pagination :current-page="page" :page-size="pageSize" layout="total, prev, pager, next" :total="pageTotal" @current-change="_handlePageChange">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import searchSettings from './components/searchSettings.js'
import paginationMixin from '@/mixins/pagination.js'
export default {
  mixins: [
    paginationMixin
  ],

  data() {
    return {
      searchSettings,
      searchParams: {},
      tableData: []
    }
  },
  methods: {
    // 加载列表数据
    loadTableData(needLoading = true) {
      this.$service
        .getCityPartnerList(this.page, this.searchParams)
        .then(res => {
          this.tableData = res.data.data.docs
          this._changePageTotal(res.data.data.total)
        })
    },
    // 搜索
    handleSearch(data) {
      this.searchParams = data
      this.page = 1
      this.loadTableData()
    },
    // 重置搜索
    handleReset() {
      this.searchParams = null
    }
  },

  created(){
    this.loadTableData()
  }
}
</script>

<style lang="scss">

</style>
