<template>
  <div id="red-packet">
    <el-card class="table-box">

      <div slot="header">
        <v-search :searchSettings="searchSettings" @search="handleSearch" :labelWidth="labelWidth">
        </v-search>
      </div>

      <div class="table-operator">
        <el-button :loading="exportLoading" type="primary" size="small" @click="handleExport">导出</el-button>
        <p style="margin-top:15px">
          收支总计：
          <span v-if="totalMoney">{{totalMoney}}</span>
          <span v-else>0</span>
          元</p>
      </div>

      <div class="table-container">
        <el-table :data="tableData" height="100%">
          <el-table-column prop="sn" label="流水号" min-width="280px"></el-table-column>
          <el-table-column prop="actionCodeText" label="科目" min-width="110px"></el-table-column>
          <el-table-column prop="amount" label="金额" min-width="90px">
          </el-table-column>
          <el-table-column prop="userRedPacketBefore" label="发生前余额" min-width="90px"></el-table-column>
          <el-table-column prop="userRedPacket" label="发生后余额" min-width="90px">
          </el-table-column>
          <el-table-column label="账户信息" min-width="120px">
            <template slot-scope="scope">
              <div>
                <div>{{scope.row.userName}}</div>
                <div>{{scope.row.userPhone}}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="evidenceNote" label="凭证" min-width="150px">
            <template slot-scope="scope">
              <span v-html="scope.row.evidenceNote"></span>
            </template>
          </el-table-column>
          <el-table-column prop="addTime" label="发生时间" min-width="170px">
            <template slot-scope="scope">
              {{scope.row.addTime|timeFilter}}
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class='table-page'>
        <el-pagination :current-page="page" :page-size="pageSize" layout="total, prev, pager, next" :total="pageTotal" @current-change="_handlePageChange">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>
<script>
import searchSettings from './components/searchSettings.js'
import searchHistoryMixin from '@/mixins/search-history.js'
import paginationMixin from '@/mixins/pagination.js'
import { handleSubmitSearchData } from '@/utils/common.js'
import { handleDate } from '@/utils/date-filter'

export default {
  name: 'red-packet',
  components: {},
  mixins: [searchHistoryMixin, paginationMixin],
  data() {
    return {
      labelWidth: '150px',
      totalMoney: '-',
      tableData: [],
      searchSettings: searchSettings,
      exportLoading: false
    }
  },

  computed: {
    user() {
      return this.$store.getters.user
    }
  },
  created() {
    this.initSubject()
    this.loadTableData()
  },
  mounted() {
    this.$nextTick(() => {})
  },
  methods: {
    // 初始化设置
    initSubject() {
      this.$service.getRedPacketSubjects().then(res => {
        if (res.data.code == 0) {
          this.formateSubjects(res.data.data)
        }
      })

      // 初始化最近一周时间
      this.initSearchData()
    },

    formateSubjects(data = []) {
      let tmp = []
      for (let item in data) {
        tmp[item] = {
          label: data[item].userRedPacketTypeText,
          value: data[item].userRedPacketType
        }
      }
      this.searchSettings[2].options = tmp
    },
    initSearchData() {
      var now = new Date()
      let last1day = new Date(now.getTime() - 0 * 24 * 3600 * 1000)
      var last7days = new Date(now.getTime() - 7 * 24 * 3600 * 1000)
      let searchData = {}

      searchData.dateStart = handleDate(last7days, 'day')
      searchData.dateEnd = handleDate(last1day, 'day')
      searchData.forSearch = true
      this.searchData = searchData
    },
    handleSearch(data) {
      let searchData = Object.assign({}, data)
      if (searchData.addTime && searchData.addTime.length) {
        searchData.dateStart = handleDate(searchData.addTime[0], 'day')
        searchData.dateEnd = handleDate(searchData.addTime[1], 'day')
      }
      delete searchData.addTime
      if (searchData.cityId) {
        searchData.cityType = 'belongTo'
      }
      searchData = handleSubmitSearchData(searchData)
      this.searchData = searchData
      this.page = 1
      this.loadTableData()
    },
    loadTableData() {
      let params = {
        page: this.page,
        pageSize: this.pageSize,
        ...this.searchData
      }
      console.log(params)
      this.$service.redPacketList(params).then(res => {
        this.tableData = res.data.data.rows
        this._changePageTotal(res.data.data.total)
      })
      this.$service.getRedPacketCount(this.searchData).then(res => {
        this.totalMoney = res.data.data.sum
      })
    },
    handleExport() {
      let len = this.tableData.length
      if (len === 0) {
        this.$message.warning('导出订单为空，请重新查询')
      } else {
        let start = new Date(this.searchData.dateStart.replace(/-/g, '/')).getTime()
        let end = new Date(this.searchData.dateEnd.replace(/-/g, '/')).getTime()
        if (end - start <= 31 * 24 * 60 * 60 * 1000) {
          this.exportLoading = true
          let params = {
            page: this.page,
            pageSize: this.pageSize,
            ...this.searchData
          }
          this.$service
            .exportRedPacketData(params)
            .then(res => {
              console.log('====res====', res)
              this.exportLoading = false
            })
            .catch(err => {
              this.exportLoading = false
            })
        } else {
          this.$message.warning('导出订单评价时间范围必须小于等于31天，请重新设置')
        }
      }
    }
  }
}
</script>
<style lang="scss">

</style>
