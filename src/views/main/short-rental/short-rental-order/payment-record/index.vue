<template>
  <div id="payment-record-list">
    <el-card class="table-box">

      <div slot="header">
        <v-search :searchSettings="searchSettings" @search="handleSearch" :labelWidth="labelWidth">
          <template slot="filter" slot-scope="scope">
            <el-cascader :options="options" v-model="scope.model.filter" change-on-select></el-cascader>
          </template>
        </v-search>
      </div>

      <div class="table-operator">
        <el-button :loading="exportLoading" size="small" type="primary" @click="exportFile">导出</el-button>
      </div>

      <div class="table-container">
        <el-table :data="tableData" height="100%">
          <el-table-column prop="orderSn" label="订单编号" min-width="220px">
          </el-table-column>
          <el-table-column prop="orderTypeName" label="订单类型" min-width="120px"></el-table-column>
          <el-table-column label="用户信息" min-width="120px">
            <template slot-scope="scope">
              <span>
                <div>{{scope.row.userName}}</div>
                <div>{{scope.row.userPhone}}</div>
              </span>
            </template>
          </el-table-column>
          <el-table-column label="租期（天）" min-width="120px">
            <template slot-scope="scope">
              <div>
                <div>{{scope.row.rentDays}}</div>
                <div>{{scope.row.typeFilterName}}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="支付金额（元）" min-width="120px">
            <template slot-scope="scope">
              <div>
                <div>{{scope.row.money}}</div>
                <div>{{scope.row.channelWayName}}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="支付项" min-width="150px">
            <template slot-scope="scope">
              <div v-for="(item, index) in scope.row.feeSubItems" :key="index">
                {{item.name}}:{{item.amount}}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="cityName" label="城市" min-width="120px"></el-table-column>
          <el-table-column prop="salesman" label="业务员" min-width="120px"></el-table-column>
          <el-table-column prop="modifiedTime" label="支付时间" min-width="170px">
            <template slot-scope="scope">
              {{scope.row.modifiedTime | timeFilter}}
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
import vPage from '@/components/page'
import searchHistoryMixin from '@/mixins/search-history.js'
import paginationMixin from '@/mixins/pagination.js'
import { handleDate } from '@/utils/date-filter'
import orderInformation from '../common-information'
import mixin from '../order.js'

export default {
  name: 'paymentRecord',
  components: {
    vPage,
    orderInformation
  },
  mixins: [mixin, searchHistoryMixin, paginationMixin],
  data() {
    return {
      labelWidth: '130px',
      searchData: {},
      tableData: [],
      searchSettings: searchSettings,
      formData: {},
      exportLoading: false,
      userId: null,
      btnVisible: false,
      userDetailVisible: false,
      sn: null,
      information: {},
      afterImg: {},
      beforeImg: {},
      authority: {
        getMaterial: 'allOrderGetMaterial',
        returnMaterial: 'allOrderReturnMaterial',
        exchangeCar: 'allOrderExchangeCar',
        bindCard: 'allOrderBindCard',
        resetTime: 'allOrderResetTime',
        resetSalesmans: 'allOrderResetSalesmans'
      },
      exportParams: null
    }
  },
  created() {
    this.loadTableData()
  },
  methods: {
    handleSearch(data) {
      let searchData = Object.assign({}, data)
      if (searchData.date && searchData.date.length) {
        searchData.dateMin = handleDate(searchData.date[0], 'day')
        searchData.dateMax = handleDate(searchData.date[1], 'day')
      }
      delete searchData.date

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
      this.$service.paymentRecord(params).then(res => {
        this.tableData = res.data.data.records
        this._changePageTotal(res.data.data.totalElements)
        if (this.tableData && this.tableData.length) {
          this.exportParams = Object.assign({}, this.searchData)
        } else {
          this.exportParams = null
        }
      })
    },
    exportFile() {
      if (!this.exportParams) {
        this.$message.warning('请先搜索出数据')
        return
      }
      if (this.exportParams.dateMin && this.exportParams.dateMax) {
        let start = new Date(
          this.exportParams.dateMin.replace(/-/g, '/')
        ).getTime()
        let end = new Date(
          this.exportParams.dateMax.replace(/-/g, '/')
        ).getTime()
        if (end - start <= 31 * 24 * 60 * 60 * 1000) {
          if (this.tableData.length === 0) {
            this.$message.warning('导出订单支付记录为空，请重新查询')
          } else {
            this.exportLoading = true
            this.$service
              .paymentRecordExport(this.exportParams, '订单支付记录.xlsx')
              .then(res => {
                this.exportLoading = false
              })
              .catch(err => {
                this.exportLoading = false
              })
          }
        } else {
          this.$message.warning(
            '导出订单支付记录时间范围必须小于等于31天，请重新设置'
          )
        }
      } else {
        this.$message.warning(
          '导出订单支付记录时间范围必须小于等于31天，请设置时间'
        )
      }
    }
  }
}
</script>
<style lang="scss">


</style>
