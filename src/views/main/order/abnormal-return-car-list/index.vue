<template>
  <div id="abnormal-return-car-list">
    <el-card class="table-box">

      <div slot="header">
        <v-search :searchSettings="searchSettings" @search="handleSearch" :labelWidth="labelWidth"></v-search>
      </div>

      <div class="table-container">
        <el-table :data="tableData" height="100%">
          <el-table-column label="订单编号" min-width="210px">
            <template slot-scope="scope">
              <span v-if="!scope.row.sn">未知</span>
              <el-button type="text" v-else @click="handleDetails(scope.row)">{{scope.row.sn}}</el-button>
            </template>
          </el-table-column>
          <el-table-column label="订单状态" min-width="100">
            <template slot-scope="scope">
              <span v-if="!scope.row.orderStatusCode">未知</span>
              <span v-else :class="getCarStateStyle(scope.row.orderStatusCode)">{{scope.row.orderStatusName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="exceptionReturnTypeName" label="异常还车类型" min-width="120px">
          </el-table-column>
          <el-table-column label="用户信息" min-width="120px">
            <template slot-scope="scope">
              <div>
                <div>{{scope.row.userName}}</div>
                <el-button type="text" style="padding:0" @click="handleUserDetails(scope.row.userId)">{{scope.row.userPhone}}</el-button>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="车辆信息" min-width="120px">
            <template slot-scope="scope">
              <div>
                <div v-if="scope.row.orderStatusCode === 'locked' || scope.row.orderStatusCode === 'rent'">
                  <el-tooltip content="点击查看车辆实时数据" placement="top">
                    <el-button type="text" style="padding:0" @click="carStatusNow(scope.row)">{{scope.row.carNumber}}
                    </el-button>
                  </el-tooltip>
                </div>
                <div v-else-if="scope.row.orderStatusCode === 'returned' || scope.row.orderStatusCode === 'finished'">
                  <el-tooltip content="点击查看订单历史轨迹" placement="top">
                    <el-button type="text" style="padding:0" @click="orderHistoryTrack(scope.row)">{{scope.row.carNumber}}
                    </el-button>
                  </el-tooltip>
                </div>
                <div v-else>{{scope.row.carNumber}}</div>
                <div>{{scope.row.carGenreName}}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="cityName" label="城市" min-width="100px">
          </el-table-column>
          <el-table-column prop="date" min-width="200" show-overflow-tooltip label="订单网点">
            <template slot-scope="scope">
              <span>取车：{{scope.row.takeStationName}}</span> <br>
              <span>还车：{{scope.row.returnStationName}}</span><br>
              <span>还车来源：{{scope.row.returnTypeName}}</span><br>
            </template>
          </el-table-column>
          <el-table-column label="时间信息" min-width="200px">
            <template slot-scope="scope">
              <ul>
                <li>预约：{{scope.row.createdTime}}</li>
                <li>取车：{{scope.row.startTime}}</li>
                <li>还车：{{scope.row.returnTime}}</li>
                <li>完成：{{scope.row.payTime}}</li>
                <li v-if="scope.row.overdue" class="time-limit">订单逾期</li>
              </ul>
            </template>
          </el-table-column>
          <el-table-column label="订单资金" min-width="200px">
            <template slot-scope="scope">
              <div>
                <div>订单金额：{{scope.row.orderTotalMoney}}</div>
                <div v-show="scope.row.discountDescription">
                  优惠金额：-{{scope.row.discountAmount}}
                </div>
                <div>应付金额：{{scope.row.needPayMoney}}</div>
                <div>实付金额：{{scope.row.payMoney}}</div>
                <el-button v-if="scope.row.orderStatusCode === 'locked' || scope.row.orderStatusCode === 'rent'" type="text" @click="currentBill(scope.row)">查看实时计费
                </el-button>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" min-width="140px">
            <template slot-scope="scope">
              <el-button type="text" @click="viewImg(scope.row.sn)">查看图片</el-button>
              <el-button class="el-button--text" v-if="scope.row.orderStatusCode === 'locked' || scope.row.orderStatusCode === 'rent'" type="text" @click="handleReturn(scope.row.orderSn)">还车
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class='table-page'>
        <el-pagination :current-page="page" :page-size="pageSize" layout="total, prev, pager, next" :total="pageTotal" @current-change="_handlePageChange">
        </el-pagination>
      </div>

      <v-page :visible.sync="orderDetailPage">
        <h3 slot="title">订单详情</h3>
        <template slot="content">
          <v-order-details :orderId="orderId"></v-order-details>
        </template>
      </v-page>

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
import searchSettings from './components/searchSettings'
import searchHistoryMixin from '@/mixins/search-history'
import paginationMixin from '@/mixins/pagination'
import { handleSubmitSearchData, handleDictData } from '@/utils/common'
import vPage from '@/components/page'
import vOrderDetails from '../order-list/components/order-details'
import vReturnDetails from '../order-list/components/return-details'
import { handleDate } from '@/utils/date-filter'
import imgViewer from '@/components/img-viewer/'
import vCustomerDetails from '../../customer/customer-list/components/customer-details'

export default {
  name: 'abnormalReturnCarOrderList',
  mixins: [searchHistoryMixin, paginationMixin],
  components: {
    vPage,
    vOrderDetails,
    vReturnDetails,
    vCustomerDetails
  },
  data() {
    return {
      labelWidth: '130px',
      searchSettings: searchSettings,
      searchData: {},
      tableData: [],
      orderId: null,
      orderSn: null,
      orderStatusCode: null,
      dialogCarouselVisible: false,
      orderDetailPage: false,
      handleReturnDetailPage: false,
      setFreeCarNumber: '',
      centerDialogVisible: false,
      carReturnId: {},
      // 用户详情
      userId: null,
      btnVisible: false,
      userDetailVisible: false
    }
  },
  created() {
    this.loadTableData()
    this.carsInfoDict()
  },
  methods: {
    carsInfoDict() {
      this.$service.get_carsInfoDict().then(res => {
        let { models } = res.data.data
        this.searchSettings[4].options = handleDictData(models)
        console.log(models)
      })
    },
    handleSearch(data) {
      let searchData = Object.assign({}, data)
      if (searchData.date && searchData.date.length) {
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
      let params = {
        page: this.page,
        pageSize: this.pageSize,
        exceptionReturned: true,
        ...this.searchData
      }
      this.$service.abnormalReturnCarOrderList(params).then(res => {
        this.tableData = res.data.data.records

        this._changePageTotal(res.data.data.totalElements)
      })
    },
    getCarStateStyle(state) {
      switch (state) {
        case 'locked':
          return 'state-red'
        case 'returned':
          return 'state-purple'
        case 'finished':
          return 'state-green'
      }
    },
    // 用户详情
    handleUserDetails(userId) {
      this.userId = userId
      this.userDetailVisible = true
    },
    update(userId) {
      this.getDetails(userId)
    },
    // 详情
    handleDetails(row) {
      this.orderId = row.id
      this.orderStatusCode = row.orderStatusCode
      this.orderDetailPage = true
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
    // 车辆实时数据
    carStatusNow(row) {
      this.sendCarSn(row.carSn, row.carNumber, 'carLocation')
    },
    sendCarSn(carSn, carNumber, name) {
      this.$store.commit('sendToTab', {
        name: name,
        params: {
          carSn: carSn,
          carNumber: carNumber
        }
      })
    },
    // 订单历史轨迹
    orderHistoryTrack(row) {
      this.sendOrderSn(row.sn, 'carTrack')
    },
    sendOrderSn(order, name) {
      console.log(order, name)
      this.$store.commit('sendToTab', {
        name: name,
        params: {
          order: order
        }
      })
    },
    viewImg(orderSn) {
      this.$service.abnormalReturnCarOrderDetail({ orderSn }).then(res => {
        imgViewer.viewImg([res.data.data.parkImg])
      })
    }
  }
}
</script>
<style lang="scss">
#abnormal-return-car-list {
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n + 1) {
    background-color: #d3dce6;
  }

  .refresh-return-details {
    position: fixed;
    top: 160px;
    right: 160px;
  }
}
</style>
