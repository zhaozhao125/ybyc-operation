<template>
  <div id="company-order-list">
    <el-card class="table-box">
      <div slot="header">
        <v-search :searchSettings="searchSettings" @search="handleSearch" :labelWidth="labelWidth">
          <template slot="carGenreId" slot-scope="scope">
            <div v-show="scope.model.open===1" class="select-content">
              <span class="select-name">选择车型</span>
              <span class="select-website-item">
                <search-select v-model="scope.model.carGenreId" placeholder="请输入"></search-select>
              </span>
            </div>
          </template>
        </v-search>
      </div>

      <div class="table-operator"></div>

      <vTable :tableData="tableData" @handleDetails="handleDetails" @loadTableData="loadTableData"></vTable>

      <div class='table-page'>
        <el-pagination :current-page="page" :page-size="pageSize" layout="total, prev, pager, next" :total="pageTotal" @current-change="_handlePageChange">
        </el-pagination>
      </div>

      <v-order-details :visible.sync="orderDetailPage" :orderId="orderId" :orderStatusCode="orderStatusCode"></v-order-details>

    </el-card>
  </div>
</template>
<script>
import searchSettings from './components/searchSettings.js'
import vTable from './components/table'
import searchHistoryMixin from '@/mixins/search-history.js'
import { handleDate } from '@/utils/date-filter'
import paginationMixin from '@/mixins/pagination.js'
// 调用分时订单详情组件
import vOrderDetails from '../../order/order-list/components/order-details'

export default {
  name: 'companyOrderList',
  components: {
    searchSettings,
    vTable,
    vOrderDetails
  },
  mixins: [searchHistoryMixin, paginationMixin],
  data() {
    return {
      searchSettings: searchSettings,
      labelWidth: '130px',
      tableData: [],
      orderId: null,
      orderStatusCode: null,
      orderDetailPage: false
    }
  },
  created() {
    this.loadTableData()
  },
  mounted() {
    this.$nextTick(() => {
      this.carsInfoDict()
    })
  },
  methods: {
    carsInfoDict() {
      this.$service.get_carsSelectModelsAll().then(res => {
        let optionsArr = res.data.data
        let newOptionsArr = optionsArr.map(function(val, index) {
          let obj = {}
          obj.value = val.id
          obj.label = val.name
          return obj
        })
        this.searchSettings[3].options = newOptionsArr
      })
    },
    handleSearch(data) {
      let searchData = Object.assign({}, data)
      if (searchData.date && searchData.date.length !== 0) {
        searchData.datemin = handleDate(searchData.date[0], 'day')
        searchData.datemax = handleDate(searchData.date[1], 'day')
      }
      delete searchData.date
      if (searchData.startDate && searchData.startDate.length !== 0) {
        searchData.startTimeDatemin = handleDate(searchData.startDate[0], 'day')
        searchData.startTimeDatemax = handleDate(searchData.startDate[1], 'day')
      }
      delete searchData.startDate
      if (searchData.returnDate && searchData.returnDate.length !== 0) {
        searchData.returnTimeDatemin = handleDate(
          searchData.returnDate[0],
          'day'
        )
        searchData.returnTimeDatemax = handleDate(
          searchData.returnDate[1],
          'day'
        )
      }
      delete searchData.returnDate
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
      this.$service.companyList(params).then(res => {
        this.tableData = res.data.data.records
        this._changePageTotal(res.data.data.totalElements)
      })
    },
    // 详情
    handleDetails(orderId, orderStatusCode) {
      this.orderId = orderId
      this.orderStatusCode = orderStatusCode
      this.orderDetailPage = true
    }
  }
}
</script>
<style lang="scss">
</style>
