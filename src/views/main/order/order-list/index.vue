<template>
  <div id="order-list">
    <el-card class="table-box">
      <div slot="header">
        <v-search :searchSettings="searchSettings" :overdue="overdue" ref="searchForm" @search="handleSearch" :labelWidth="labelWidth">
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

      <div class="table-operator">
        <el-button v-has="'orderListExport'" :loading="exportLoading" size="small" type="primary" @click="exportFile">导出</el-button>
      </div>

      <vTable :tableData="tableData" @handleDetails="handleDetails" @handleUserDetails="handleUserDetails" @handleReturn="handleReturn" @loadTableData="loadTableData"></vTable>

      <div class='table-page'>
        <el-pagination :current-page="page" :page-size="pageSize" layout="total, prev, pager, next" :total="pageTotal" @current-change="_handlePageChange">
        </el-pagination>
      </div>

      <v-order-details :visible.sync="orderDetailPage" :orderId="orderId" :orderStatusCode="orderStatusCode"></v-order-details>

      <v-customer-details :userId="userId" :btnVisible="btnVisible" :visible.sync="userDetailVisible" @closePage="closePage" @update="update"></v-customer-details>

      <v-return-details :visible.sync="handleReturnDetailPage" :orderSn="orderSn" @closePage="closePage" ref="returnCar"></v-return-details>

      <el-dialog title="提示" :visible.sync="centerDialogVisible" width="30%" center>
        <div>已成功结束订单。</div>
        <div>车辆{{setFreeCarNumber}}设置空闲失败，
          <el-button type="text" @click="setFree()">
            手动设置空闲
          </el-button>
        </div>
      </el-dialog>

    </el-card>
  </div>
</template>
<script>
import vTable from './components/table'
import vOrderDetails from './components/order-details'
import vReturnDetails from './components/return-details'
import { searchSettings, overdueSearchSettings } from './components/searchSettings.js'
import websiteSelect from '@/components/website-select'
import searchHistoryMixin from '@/mixins/search-history.js'
import paginationMixin from '@/mixins/pagination.js'
import { handleSubmitSearchData } from '@/utils/common.js'
import { handleDate } from '@/utils/date-filter'
import vCustomerDetails from '../../customer/customer-list/components/customer-details'

export default {
  name: 'orderList',
  components: {
    vTable,
    vOrderDetails,
    vReturnDetails,
    websiteSelect,
    vCustomerDetails
  },
  mixins: [searchHistoryMixin, paginationMixin],
  props: {
    overdue: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      labelWidth: '130px',
      searchData: {},
      formData: {},
      tableData: [],
      orderId: null,
      orderStatusCode: null,
      orderSn: null,
      type: null,
      searchSettings: this.overdue ? overdueSearchSettings : searchSettings,
      orderDetailPage: false,
      handleReturnDetailPage: false,
      popover: '',
      popVisible: false,
      setFreeCarNumber: '',
      centerDialogVisible: false,
      exportLoading: false,
      // 用户详情
      userId: null,
      userDetailVisible: false,
      btnVisible: false
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
  computed: {
    activeTab() {
      return this.$store.getters.activeTab
    }
  },
  methods: {
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
      if (searchData.payTime && searchData.payTime.length !== 0) {
        searchData.finishTimeMin = handleDate(searchData.payTime[0], 'day')
        searchData.finishTimeMax = handleDate(searchData.payTime[1], 'day')
      }
      delete searchData.payTime
      searchData = handleSubmitSearchData(searchData)
      this.searchData = searchData
      this.page = 1
      this.loadTableData()
    },
    loadTableData() {
      console.log('--- overdue ---' + this.overdue)
      let params = {
        page: this.page,
        pageSize: this.pageSize,
        ...this.searchData
      }
      if (this.overdue) {
        params.overdue = true
      }
      this.$service.getOrderList(params).then(res => {
        this.tableData = res.data.data.records
        this._changePageTotal(res.data.data.totalElements)
      })
    },
    // 详情
    handleDetails(orderId, orderStatusCode) {
      this.orderId = orderId
      this.orderStatusCode = orderStatusCode
      this.orderDetailPage = true
    },
    // 用户详情
    handleUserDetails(userId) {
      this.userId = userId
      this.userDetailVisible = true
    },
    update(userId) {
      this.getDetails(userId)
    },
    // 还车
    handleReturn(orderSn) {
      this.orderSn = orderSn
      this.handleReturnDetailPage = true
    },

    closePage(carNumber) {
      this.handleReturnDetailPage = false
      this.loadTableData()
      if (carNumber) {
        this.setFreeCarNumber = carNumber
        setTimeout(() => {
          this.centerDialogVisible = true
        }, 1000)
      }
    },
    setFree() {
      this.$store.commit('sendToTab', {
        name: 'carStatus',
        params: {
          carNumber: this.setFreeCarNumber
        }
      })
      this.centerDialogVisible = false
    },
    carsInfoDict() {
      this.$service.get_carsSelectModelsAll().then(res => {
        let optionsArr = res.data.data
        let newOptionsArr = optionsArr.map(function(val, index) {
          let obj = {}
          obj.value = val.id
          obj.label = val.name
          return obj
        })
        this.searchSettings[4].options = newOptionsArr
      })
    },

    download(obj, s, e) {
      let len = this.tableData.length
      if (len === 0) {
        this.$message.warning('导出订单为空，请重新查询')
      } else {
        let start = new Date(s.replace(/-/g, '/')).getTime()
        let end = new Date(e.replace(/-/g, '/')).getTime()
        if (end - start <= 31 * 24 * 60 * 60 * 1000) {
          this.exportLoading = true
          this.$service
            .get_downloadOrderList(obj, '分时订单.xlsx')
            .then(res => {
              this.exportLoading = false
            })
            .catch(err => {
              this.exportLoading = false
            })
        } else {
          this.$message.warning('导出订单时间范围必须小于等于31天，请重新设置')
        }
      }
    },

    exportFile() {
      let obj = this.searchData
      if (this.activeTab.name == 'overdueList') {
        obj.overdue = true
      }
      if (obj) {
        if (obj.hasOwnProperty('datemin')) {
          this.download(obj, obj.datemin, obj.datemax)
        } else if (obj.hasOwnProperty('startTimeDatemin')) {
          this.download(obj, obj.startTimeDatemin, obj.startTimeDatemax)
        } else if (obj.hasOwnProperty('returnTimeDatemin')) {
          this.download(obj, obj.returnTimeDatemin, obj.returnTimeDatemax)
        } else if (obj.hasOwnProperty('finishTimeMin')) {
          this.download(obj, obj.finishTimeMin, obj.finishTimeMax)
        } else {
          this.$message.warning('导出订单时间范围必须小于等于31天，请设置时间')
        }
      } else {
        this.$message.warning('导出订单时间范围必须小于等于31天，请设置时间')
      }
    }
  },
  watch: {
    // activeTab(tab) {
    //   if (tab.name == 'overdueList') {
    //     this.searchSettings[1].hide = true
    //     this.searchSettings[2].visible = true
    //   } else {
    //     this.searchSettings[1].hide = false
    //     this.searchSettings[2].visible = false
    //   }
    //   this.$refs.searchForm.updateForm()
    // }
  }
}
</script>
<style lang="scss">
.refresh-return-details {
  position: fixed;
  top: 160px;
  right: 160px;
}
</style>
