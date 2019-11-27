<template>
  <div class="components-content">
    <el-table :data="list" class="table-container" height="100%">
      <el-table-column
        prop="sn"
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
        width="180">
          <template slot-scope="scope">
            <span class="state-green">{{scope.row.orderStatusName}}</span>
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
          <span v-if="scope.row.carNumber">{{scope.row.carNumber}}<br></span>
          <span v-if="scope.row.carGenreName">{{scope.row.carGenreName}}<br></span>
          <el-button type = 'text' @click="realData(scope.row)">车辆实时数据</el-button>
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
        prop="takeStationName"
        min-width="200"
        show-overflow-tooltip
        label="取车网点：">
      </el-table-column>
      <el-table-column
        prop="date"
        min-width="220"
        label="租期还车时间">
        <template slot-scope="scope">
          <span>{{scope.row.rentReturnTime | timeFilter}}</span><br>
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
