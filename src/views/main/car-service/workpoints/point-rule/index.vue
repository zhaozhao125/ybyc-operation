<template>
  <div>
    <el-card class="table-box">
      <div slot="header">
        <v-search :searchSettings="searchSettings" @search="handleSearch" :labelWidth="labelWidth"></v-search>
      </div>
      <div class="table-operator">
        <el-button  size="small" type="primary" @click = "addRule">添加工分规则</el-button>
      </div>
      <v-table :tableData = "tableData" @reload = "loadTableData" @editRule = "editRule"></v-table>
      <div class='table-page'>
        <el-pagination :current-page="page" :page-size="pageSize" layout="total, prev, pager, next" :total="pageTotal" @current-change="_handlePageChange">
        </el-pagination>
      </div>
    </el-card>
    <!-- <v-page :visible.sync="addEditShow" ref="aPage" @goBack="closePage">
       <template slot = "title">
           <h3 style="line-height:30px; display:inline-block" >{{handelType}}</h3>
       </template>
       <template slot = "content">
           <add-edit ></add-edit>
       </template>
    </v-page> -->
    <add-edit :visible.sync="addEditShow" @closePage="closePage" :id = "ruleId"></add-edit>
  </div>
</template>
<script>
import searchSettings from './components/searchSettings.js'
import searchHistoryMixin from '@/mixins/search-history.js'
import paginationMixin from '@/mixins/pagination.js'
import { handleDate } from '@/utils/date-filter'
import { handleSubmitSearchData } from '@/utils/common.js'
import vTable from './components/table'
import addEdit from './components/addEdit'
export default {
  name: 'worker-points',
  mixins: [searchHistoryMixin, paginationMixin],
  components: {
    vTable,
    addEdit
  },
  data() {
    return {
      searchSettings: searchSettings,
      labelWidth: '120px',
      tableData: [],
      addEditShow: false,
      handelType: '添加工分规则',
      ruleId: null,
      page: 1
    }
  },
  mounted () {
    this.loadTableData()
  },
  methods: {
    handleSearch(data) {
      this.page = 1
      let searchData = Object.assign({}, data)
      // if (searchData.selectDate && searchData.selectDate.length) {
      //   searchData.startCreatedOn = handleDate(searchData.selectDate[0], 'day')
      //   searchData.endCreatedOn = handleDate(searchData.selectDate[1], 'day')
      // }
      // delete searchData.selectDate
      // searchData = handleSubmitSearchData(searchData)
      this.searchData = searchData
      this.loadTableData()
    },
    loadTableData() {
      this.$service.workPointLists(this.searchData, this.page).then((res) => {
        this.tableData = res.data.data.content

        this._changePageTotal(res.data.data.totalElements)
      }).catch((res) => {
      })
    },
    addRule () {
      this.addEditShow = true
    },
    editRule (row) {
      console.log(row)
      this.addEditShow = true
      this.ruleId = row.id
      this.handelType = '编辑工分规则'
    },
    closePage() {
      this.loadTableData()
      this.ruleId = null
    }
  }
}
</script>
<style lang="scss">

</style>
