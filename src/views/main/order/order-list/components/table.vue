<template>
  <div class="table-container">
    <el-table :data="tableData" height="100%">
      <el-table-column label="订单信息" min-width="180px">
        <template slot-scope="scope">
          <span v-if="!scope.row.sn">未知</span>
          <el-button type="text" v-else @click="handleDetails(scope.row)">{{scope.row.sn}}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="订单状态">
        <template slot-scope="scope">
          <span v-if="!scope.row.orderStatusCode">未知</span>
          <span v-else :class="getCarStateStyle(scope.row.orderStatusCode)">{{scope.row.orderStatusName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户信息" min-width="120px">
        <template slot-scope="scope">
          <div>
            <div>{{scope.row.userName}}</div>
            <el-button type="text" style="padding:0" @click="handleUserDetails(scope.row)">{{scope.row.userPhone}}</el-button>
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
      <el-table-column prop="cityName" label="城市"></el-table-column>
      <el-table-column label="订单网点" min-width="300px">
        <template slot-scope="scope">
          <div>
            <div>取车：{{scope.row.takeStationName}}
              <span v-if="scope.row.takeStationType === 'casual'">（百步亭）</span>
              <span v-else-if="scope.row.takeStationType === 'contract'">（合作网点）</span>
            </div>
            <div>还车：{{scope.row.returnStationName}}
              <span v-if="scope.row.returnStationType === 'casual'">（百步亭）</span>
              <span v-else-if="scope.row.returnStationType === 'contract'">（合作网点）</span>
            </div>
            <div>还车来源：{{returnTypeText[scope.row.returnType]}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="时间信息" min-width="200px">
        <template slot-scope="scope">
          <div>
            <div>预约：{{scope.row.createdTime}}</div>
            <div>取车：{{scope.row.startTime}}</div>
            <div>还车：{{scope.row.returnTime}}</div>
            <div>完成：{{scope.row.payTime}}</div>
            <div v-if="scope.row.overdue === true" class="time-limit">订单逾期</div>
          </div>
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
      <el-table-column label="操作" fixed="right" min-width="100px">
        <template slot-scope="scope">
          <el-button class="el-button--text" v-if="scope.row.orderStatusCode === 'locked' || scope.row.orderStatusCode === 'rent' && $_has('orderListReturnCar')" type="text" @click="handleReturn(scope.row.sn)">还车
          </el-button>
          <el-popover :ref="'deletePop'+scope.$index" placement="bottom" title="提示" width="200" trigger="click">
            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入锁单理由" v-model="reason">
            </el-input>
            <div style="text-align: right; margin-top: 5px">
              <el-button class="el-button--text" type="text" @click="handleSave(scope.row.id,scope.$index)">保存
              </el-button>
            </div>
            <el-button v-if="$_has('orderListLockOrder')" class="el-button--text" v-show="scope.row.orderStatusCode === 'rent'" slot="reference" type="text">锁单
            </el-button>
          </el-popover>
          <el-button v-show="scope.row.orderStatusCode === 'locked'" slot="reference" type="text" @click="handleUnlock(scope.row.id,scope.$index)">解锁
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <currentBill :visible.sync="currentBillVisible" :currentBilllData="currentBilllData" @currentBillEmit="currentBill"></currentBill>
  </div>
</template>

<script>
import currentBill from './current-bill'

export default {
  name: 'order-table',
  components: {
    currentBill
  },
  props: {
    tableData: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      returnTypeText: {
        app: '用户还车',
        background: '后台还车',
        tbox: 'tbox还车',
        screen: '中控屏还车',
        maintenance: '运维还车',
        weixin: '微信还车'
      },
      reason: '',
      currentBillVisible: false,
      currentBilllData: {},
      currentBillParams: {}
    }
  },
  computed: {
    user() {
      return this.$store.getters.user
    }
  },
  methods: {
    getCarStateStyle(state) {
      switch (state) {
        case 'subscribed':
          return 'state-yellow'
        case 'rent':
          return 'state-blue'
        case 'locked':
          return 'state-red'
        case 'returned':
          return 'state-purple'
        case 'finished':
          return 'state-green'
        case 'cancel':
          return 'state-gray'
      }
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
    // 车辆历史轨迹
    orderHistoryTrack(row) {
      this.sendOrderSn(row.sn, 'carTrack')
    },
    sendOrderSn(order, name) {
      this.$store.commit('sendToTab', {
        name: name,
        params: {
          order: order
        }
      })
    },
    // 查看用户详情
    handleUserDetails(row) {
      this.$emit('handleUserDetails', row.userId)
    },
    handleDetails(row) {
      this.$emit('handleDetails', row.id, row.orderStatusCode)
    },
    handleReturn(orderSn) {
      this.$emit('handleReturn', orderSn)
    },
    currentBill(row) {
      if (row) {
        this.currentBillParams = { orderSn: row.sn }
      }
      this.$service.getOrderCurrentBilling(this.currentBillParams).then(res => {
        this.currentBilllData = res.data.data
        this.currentBillVisible = true
      })
    },
    // 锁单
    handleSave(id, index) {
      let params = {}
      params.orderId = id
      params.operator = this.user.username
      params.reason = this.reason
      this.$service.orderLock(params).then(res => {
        this.$message.success(res.data.msg)
        this.popVisible = false
        // this.$refs['deletePop' + index].doClose()
        this.$refs['deletePop' + index].showPopper = false
        this.reason = ''
        this.$emit('loadTableData')
      })
    },
    // 解锁
    handleUnlock(id, index) {
      let params = {}
      params.orderId = id
      params.operator = this.user.username
      this.$service.orderUnlock(params).then(res => {
        this.$message.success(res.data.msg)
        this.$emit('loadTableData')
      })
    }
  }
}
</script>

<style lang="scss">
.table-container {
  .time-limit {
    color: $color-red;
  }

  .el-popover {
    left: -145px;
    top: 65px;
  }

  .online {
    margin-left: 20px;
    color: $color-green;
  }

  .outline {
    margin-left: 20px;
  }
  .outline,
  .current-price {
    color: $color-red;
  }
}
</style>
