<template>
  <el-card class="table-box">
    <div slot="header" class="heard">
      <v-search :searchSettings="searchSettings" @search="handleSearch" :labelWidth="labelWidth"></v-search>
    </div>

    <div class="table-operator" style="margin-top:10px;">
    </div>

    <div class="table-container">
      <el-table :data="tableData" height="100%">
        <el-table-column prop="prepaidCardNumber" label="充值卡号" min-width="150px"></el-table-column>
        <el-table-column prop="userName" label="姓名" min-width="120px"></el-table-column>
        <el-table-column prop="userPhone" label="手机号" min-width="120px"></el-table-column>
        <el-table-column prop="status" label="充值卡状态" min-width="120px">
          <template slot-scope="scope">
            <span>{{statusText[scope.row.status]}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="useDate" label="使用时间" min-width="160">
          <template slot-scope="scope">
            <span v-if="scope.row.useDate">{{scope.row.useDate | timeFilter}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class='table-page'>
      <el-pagination :current-page="page" :page-size="pageSize" layout="total, prev, pager, next" :total="pageTotal" @current-change="_handlePageChange">
      </el-pagination>
    </div>

  </el-card>
</template>
<script>
import searchSettings from './components/searchSettings.js'
import searchHistoryMixin from '@/mixins/search-history.js'
import paginationMixin from '@/mixins/pagination.js'
import { handleSubmitSearchData } from '@/utils/common.js'

export default {
  name: 'sending-list',
  mixins: [searchHistoryMixin, paginationMixin],
  components: {},
  props: {
    prepaidCardId: {
      type: Number
    }
  },
  data() {
    return {
      labelWidth: '150px',
      searchSettings,
      tableData: [],
      statusText: {
        '0': '未使用',
        '1': '已使用',
        '2': '已失效'
      }
    }
  },
  created() {
    console.log(this.prepaidCardId)
    if (this.prepaidCardId !== '') {
      this.loadTableData()
    }
  },
  methods: {
    handleSearch(data) {
      let searchData = Object.assign({}, data)
      searchData = handleSubmitSearchData(searchData)
      this.searchData = searchData
      this.page = 1
      this.loadTableData()
    },
    loadTableData() {
      let params = {
        page: this.page,
        pageSize: this.pageSize,
        prepaidCardId: this.prepaidCardId,
        ...this.searchData
      }
      console.log(params)
      this.$service.sendingList(params).then(res => {
        this.tableData = res.data.data.records
        this._changePageTotal(res.data.data.totalElements)
      })
      // this.tableData = [{
      //   prepaidCardNumber: '20180005',
      //   userName: '秦亚申',
      //   userPhone: '15810961688',
      //   status: '1',
      //   statusName: '已使用',
      //   useDate: '2018-03-01 14:05:10'
      // }]
    }
  }
}
</script>
<style lang="scss">
.heard {
}
</style>
