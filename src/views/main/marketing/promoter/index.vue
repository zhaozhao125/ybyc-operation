<template>
  <div id="red-packet">
    <el-card class="table-box">

      <div slot="header">
        <v-search :searchSettings="searchSettings" @search="handleSearch" :labelWidth="labelWidth">
        </v-search>
      </div>

      <div class="table-operator">
        <el-button type="primary" size="small" @click="handleShowAddPromoter">添加推广员</el-button>
      </div>

      <div class="table-container">
        <el-table :data="tableData" height="100%">
          <el-table-column label="用户信息" min-width="120px">
            <template slot-scope="scope">
              <div>
                <div>{{scope.row.userName}}</div>
                <div>{{scope.row.userPhone}}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="userRoleName" label="角色" min-width="150px"></el-table-column>
          <el-table-column prop="createByName" label="添加人" min-width="150px">
            <template slot-scope="scope">
              <span v-if="scope.row.createByName">{{scope.row.createByName}}</span>
              <span v-if="scope.row.createBy">({{scope.row.createBy}})</span>
            </template>
          </el-table-column>
          <el-table-column prop="createOn" label="添加时间" min-width="150px">
            <template slot-scope="scope">
              {{scope.row.createOn | timeFilter}}
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" min-width="100px">
            <template slot-scope="scope">
              <el-popover :ref="'deletePop' + scope.$index" title="" width="270" trigger="click" placement="top">
                <el-button type="text" slot="reference">删除</el-button>
                <P style="line-height:25px">
                  <i class="el-icon-warning" style="color:red;margin-right:5px;"></i>确定删除？</p>
                <div style="text-align: right">
                  <el-button size="small" type="text" @click="handleDeleteCancel(scope.$index)">取消</el-button>
                  <el-button type="primary" size="mini" @click="handleDeletePromoter(scope.row,scope.$index)">删除</el-button>
                </div>
              </el-popover>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class='table-page'>
        <el-pagination :current-page="page" :page-size="pageSize" layout="total, prev, pager, next" :total="pageTotal" @current-change="_handlePageChange">
        </el-pagination>
      </div>

    </el-card>
    <addPromoter :visible.sync="addPromoterVisible" @loadTableData="loadTableData"></addPromoter>
  </div>
</template>
<script>
import searchSettings from './components/searchSettings.js'
import searchHistoryMixin from '@/mixins/search-history.js'
import paginationMixin from '@/mixins/pagination.js'
import { handleSubmitSearchData } from '@/utils/common.js'
import { handleDate } from '@/utils/date-filter'
import addPromoter from './components/addPromoter'

export default {
  name: 'red-packet',

  components: {
    addPromoter
  },

  mixins: [searchHistoryMixin, paginationMixin],

  data() {
    return {
      labelWidth: '150px',
      total: '24546677.00',
      tableData: [],
      qrCodeUrl: '',
      searchSettings: searchSettings,
      addPromoterVisible: false
    }
  },

  computed: {
    user() {
      return this.$store.getters.user
    }
  },

  created() {
    this.loadTableData()
  },

  mounted() {
    this.$nextTick(() => {})
  },

  methods: {
    handleSearch(data) {
      let searchData = Object.assign({}, data)
      if (searchData.createTime && searchData.createTime.length) {
        searchData.dateStart = handleDate(searchData.createTime[0], 'day')
        searchData.dateEnd = handleDate(searchData.createTime[1], 'day')
      }
      delete searchData.createTime
      searchData = handleSubmitSearchData(searchData)
      this.searchData = searchData
      this.page = 1
      this.loadTableData()
    },
    loadTableData() {
      this.pageSize = 50
      let params = {
        page: this.page,
        pageSize: this.pageSize,
        ...this.searchData
      }
      this.$service.promoterList(params).then(res => {
        this.tableData = res.data.data.rows
        this._changePageTotal(res.data.data.total)
      })
    },
    handleDeletePromoter(user, index) {
      this.$service.delPromoter([user.id]).then(res => {
        this.$message.success('删除成功')
        this.$refs['deletePop' + index].doClose()
        this.loadTableData()
      }).catch(error => {
        this.$message.warning(error.msg ? error.msg : '删除失败')
        this.$refs['deletePop' + index].doClose()
      })
    },
    handleDeleteCancel(index) {
      this.$refs['deletePop' + index].doClose()
    },
    handleShowAddPromoter() {
      this.addPromoterVisible = true
    }
  }
}
</script>
<style lang="scss">

</style>
