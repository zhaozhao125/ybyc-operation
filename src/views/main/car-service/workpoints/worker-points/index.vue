<template>
  <div>
    <el-card class="table-box">
      <div slot="header">
        <v-search :searchSettings="searchSettings" @search="handleSearch" :labelWidth="labelWidth"></v-search>
      </div>
      <div class="table-operator">
        <el-button  size="small" type="primary" :loading="exportLoading" @click = "exportPoint">导出</el-button>
      </div>
      <v-table :tableData = "tableData" ></v-table>
      <div class='table-page'>
        <el-pagination :current-page.sync="page" :page-size="pageSize" layout="total, prev, pager, next" :total="pageTotal" @current-change="_handlePageChange">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>
<script>
import searchSettings from './components/searchSettings.js'
import searchHistoryMixin from '@/mixins/search-history.js'
import paginationMixin from '@/mixins/pagination.js'
import { handleDate } from '@/utils/date-filter'
import vTable from './components/table'
export default {
  name: 'worker-points',
  mixins: [searchHistoryMixin, paginationMixin],
  components: {
    vTable
  },
  data() {
    return {
      searchSettings: searchSettings,
      labelWidth: '120px',
      tableData: [],
      userTypeList: [],
      searchData: {},
      exportLoading: false,
      page: 1
    }
  },
  mounted () {
    // this.searchData = {
    //   yearMonthCollect: handleDate(new Date(), 'day').split('-')[0] + handleDate(searchData.yearMonthCollect, 'day').split('-')[1] + ''
    // }
    this.loadTableData()
    this.getAllRoles()
  },
  methods: {
    getAllRoles() {
      this.$service.getRoleIndex().then(res => {
        if (res.data.code == 0) {
          this.userTypeList = res.data.data.map((ele) => {
            return {
              label: ele.roleName,
              value: ele.id
            }
          })
          this.searchSettings[2].options = this.userTypeList
        }
      })
    },
    handleSearch(data) {
      this.page = 1
      let searchData = Object.assign({}, data)
      if (searchData.yearMonthCollect) {
        searchData.yearMonthCollect = handleDate(searchData.yearMonthCollect, 'day').split('-')[0] + handleDate(searchData.yearMonthCollect, 'day').split('-')[1] + ''
      }

      this.searchData = searchData
      this.loadTableData()
    },
    loadTableData() {
      if (this.searchData.yearMonthCollect) {
      } else {
        this.searchData.yearMonthCollect = handleDate(new Date(), 'day').split('-')[0] + handleDate(new Date(), 'day').split('-')[1] + ''
      }
      console.log(this.searchData)
      this.$service.pointStatistic(this.searchData, this.page).then((res) => {
        this.tableData = res.data.data.content
        this.tableData.forEach((ele) => {
          ele.allScore = ele.allScore + '工分'
          ele.chargeCarScore = ele.chargeCarScore + '工分'
          ele.cleanCarScore = ele.cleanCarScore + '工分'
          ele.dispatchCarScore = ele.dispatchCarScore + '工分'
          ele.inspectCarScore = ele.inspectCarScore + '工分'
          ele.lockCarScore = ele.lockCarScore + '工分'
          ele.repairCarScore = ele.repairCarScore + '工分'
        })
        this._changePageTotal(res.data.data.totalElements)
      }).catch((res) => {
      })
    },
    exportPoint () {
      if (this.tableData.length) {
        this.exportLoading = true
        this.$service.exportPoint(this.searchData).then(res => {
          this.exportLoading = false
        }).catch(err => {
          this.$message({
            message: '下载出错',
            type: 'error'
          })
          this.exportLoading = false
        })
      } else {
        this.$message({
          message: '搜索数据为空',
          type: 'warning'
        })
      }
    }
    // closePage() {
    //   this.loadTableData()
    // }
  }
}
</script>
<style lang="scss">

</style>
