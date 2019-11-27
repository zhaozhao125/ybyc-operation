<template>
  <div id="fund-flow">
    <el-card class="table-box">

      <div slot="header">
        <v-search :searchSettings="searchSettings" @search="handleSearch" :labelWidth="labelWidth">
        </v-search>
      </div>

      <div class="table-operator"></div>

      <div class="table-container">
        <el-table :data="tableData" height="100%">
          <el-table-column prop="recordSn" label="流水号" show-overflow-tooltip min-width="260px"></el-table-column>
          <el-table-column label="企业信息" min-width="150px">
            <template slot-scope="scope">
              <div>
                <div>{{scope.row.companyName}}</div>
                <div>{{scope.row.companySn}}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="actionCodeText" label="科目" min-width="100px"></el-table-column>
          <el-table-column prop="amount" label="金额" min-width="90px">
          </el-table-column>
          <el-table-column label="发生前余额" min-width="140px">
            <template slot-scope="scope">
              <div>
                <div>充值余额：{{scope.row.companyMoneyBefore}}</div>
                <div>赠送余额：{{scope.row.companyMoneyPresentationBefore}}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="发生后余额" min-width="140px">
            <template slot-scope="scope">
              <div>
                <div>充值余额：{{scope.row.companyMoney}}</div>
                <div>赠送余额：{{scope.row.companyMoneyPresentation}}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="paymentTypeText" label="支付方式" min-width="120px">
            <template slot-scope="scope">
              <span v-if="scope.row.paymentTypeText">{{scope.row.paymentTypeText}}</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column prop="evidenceNote" label="凭证" min-width="180px">
            <template slot-scope="scope">
              <div v-if="scope.row.evidenceImg1">
                <el-button type="text" @click="viewImg(scope.row)">查看图片</el-button>
              </div>
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
import imgViewer from '@/components/img-viewer/'

export default {
  name: 'fund-flow',
  components: {},
  mixins: [searchHistoryMixin, paginationMixin],
  data() {
    return {
      labelWidth: '150px',
      tableData: [],
      searchSettings: searchSettings
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
      this.$service.fundFlowSubjects({companyMoneyType: 'balance'}).then(res => {
        console.log(res)
        if (res.data.code == '0') {
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
          label: data[item].companyMoneyTypeText,
          value: data[item].companyMoneyType
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
      this.$service.fundFlowList(params).then(res => {
        this.tableData = res.data.data.records
        this._changePageTotal(res.data.data.totalElements)
      })
    },
    viewImg(row) {
      imgViewer.viewImg([row.evidenceImg1])
    }
  }
}
</script>
<style lang="scss">
</style>
