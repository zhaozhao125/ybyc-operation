<template>
  <div class="table-container">
    <el-table :data="tableData" height="100%">
      <el-table-column label="订单信息" min-width="220px">
        <template slot-scope="scope">
          <span v-if="!scope.row.sn">未知</span>
          <el-button type="text" v-else @click="handleDetails(scope.row)">{{scope.row.sn}}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="用户信息" min-width="120px">
        <template slot-scope="scope">
          <div>
            <div>{{scope.row.userName}}</div>
            <div>{{scope.row.userPhone}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="车辆信息" min-width="120px">
        <template slot-scope="scope">
          <div>
            <div>
              <el-tooltip content="点击查看订单历史轨迹" placement="top">
                <el-button type="text" @click="orderHistoryTrack(scope.row)">{{scope.row.carNumber}}
                </el-button>
              </el-tooltip>
            </div>
            <div>{{scope.row.carGenreName}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="企业信息" min-width="130px">
        <template slot-scope="scope">
          <div>
            <div>{{scope.row.companyName}}</div>
            <div>{{scope.row.companySn}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="城市" prop="cityName"></el-table-column>
      <el-table-column label="订单网点" min-width="300px">
        <template slot-scope="scope">
          <div>
            <div>取车：{{scope.row.takeStationName}}</div>
            <div>还车：{{scope.row.returnStationName}}</div>
            <div>还车来源：{{returnTypeText[scope.row.returnType]}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="时间信息" min-width="220px">
        <template slot-scope="scope">
          <div>
            <div>预约：{{scope.row.createdTime|timeFilter}}</div>
            <div>取车：{{scope.row.startTime|timeFilter}}</div>
            <div>还车：{{scope.row.returnTime|timeFilter}}</div>
            <div>完成：{{scope.row.payTime|timeFilter}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="订单资金" min-width="200px">
        <template slot-scope="scope">
          <div>
            <div>订单金额：{{scope.row.orderTotalMoney}}</div>
            <div v-show="scope.row.discountDescription">优惠金额：-{{scope.row.discountAmount}}</div>
            <div>应付金额：{{scope.row.needPayMoney}}</div>
            <div>实付金额：{{scope.row.payMoney}}</div>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>

export default {
  name: 'order-table',
  components: {
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
  methods: {
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
    // 企业订单详情
    handleDetails(row) {
      this.$emit('handleDetails', row.id, row.orderStatusCode)
    }
  }
}
</script>

<style lang="scss">
.table-container {
  .el-popover {
    left: -145px;
    top: 65px;
  }
}
</style>
