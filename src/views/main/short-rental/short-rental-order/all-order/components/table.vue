<template>
  <div class="components-content">

    <el-table :data="list" class="table-container" height="100%">
      <el-table-column
        label="订单编号"
        show-overflow-tooltip
        min-width="180">
         <template slot-scope="scope">
            <el-button type="text" @click = "$emit('on-orderInfor', scope.row)"> {{scope.row.sn}}</el-button>
          </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="订单状态"
      >
          <template slot-scope="scope">
            <span :class="getCheckDataStatus(scope.row.orderStatusName)">{{scope.row.orderStatusName}}</span>
          </template>
      </el-table-column>
      <el-table-column
        prop="settleStatusName"
        label="结算状态">
      </el-table-column>
      <el-table-column
        prop="date"
        min-width="120"
        show-overflow-tooltip
        label="用户信息">
        <template slot-scope="scope">
          <div>
            <div>{{scope.row.userName}}</div>
            <el-button type="text" @click="handleUserDetails(scope.row)">{{scope.row.userPhone}}</el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="date"
        min-width="100"
        show-overflow-tooltip
        label="车辆信息">
        <template slot-scope="scope">
          <span v-if="scope.row.carNumber">{{scope.row.carNumber}} <br></span>
          <span v-if="scope.row.carGenreName">{{scope.row.carGenreName}} <br></span>
          <el-button type = 'text' v-if="scope.row.orderStatus==='rent'" @click="realData(scope.row)">车辆实时数据</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="cityName"
         width="100"
        label="城市">
      </el-table-column>
      <el-table-column
        prop="orderTypeCn"
         width="100"
        label="订单类型">
      </el-table-column>
      <el-table-column
        prop="date"
        min-width="200"
        show-overflow-tooltip
        label="订单网点">
        <template slot-scope="scope">
          <span>取车：{{scope.row.takeStationName}}</span> <br>
          <span>还车：{{scope.row.returnStationName}}</span><br>
          <span>还车来源：{{scope.row.returnTypeName}}</span><br>
        </template>
      </el-table-column>
      <el-table-column
        prop="date"
        min-width="220"
        label="时间信息">
        <template slot-scope="scope">
          <span>预约：{{scope.row.createdTime | timeFilter}}</span> <br>
          <span>取车：{{scope.row.actualTakeTime | timeFilter}}</span><br>
          <span>还车：{{scope.row.actualReturnTime | timeFilter}}</span><br>
        </template>
      </el-table-column>
      <el-table-column
        prop="expectTakeTime"
        min-width="200"
        label="订单资金">
        <template slot-scope="scope">
          <span>订单金额：{{scope.row.orderAmount ? scope.row.orderAmount : 0.00}}</span> <br>
          <span v-show="scope.row.couponsMoneyShow">优惠券：{{scope.row.couponsMoney}}<br></span>
          <span>订单收入：{{scope.row.settleMoney ? scope.row.settleMoney : 0.00}}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class='table-page'>
      <el-pagination :current-page.sync="page" :page-size="params.pageSize" layout="total, prev, pager, next" :total="params.total"         @current-change="pageChange">
      </el-pagination>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      page: 1
    }
  },
  methods: {
    // 查看用户详情
    handleUserDetails(row) {
      this.$emit('handleUserDetails', row.userId)
    },
    getCheckDataStatus(state) {
      switch (state) {
        case '租赁中':
          return 'state-green'
        case '已预定':
          return 'state-yellow'
        case '已取消':
          return 'state-gray'
        case '已还车':
          return 'state-blue'
        case '已完成':
          return 'state-purple'
      }
    },
    pageChange (val) {
      this.$emit('on-pageChange', val)
    },
    realData (data) {
      this.$store.commit('sendToTab', {
        name: 'carLocation',
        params: {
          carSn: data.carSn,
          carNumber: data.carNumber
        }
      })
    }
  },
  props: {
    list: {
      default: [],
      type: Array
    },
    params: {
      default: {},
      type: Object
    }
  }
}
</script>
