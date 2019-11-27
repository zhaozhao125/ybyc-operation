<template>
  <div class="components-content">
    <el-table :data="optimusCheckList"
              class="table-container"
              height="100%">
      <el-table-column label="退款记录编号"
                       min-width="270"
                       prop="userApplyReturnDepositId"
                       show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button type="text"
                     @click="editInfor(scope.row,2)"> {{scope.row.serialNum}}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="carModelName"
                       label="用户信息"
                       min-width="120"
                       show-overflow-tooltip>
        <template slot-scope="scope">
          <div>
            <span>{{scope.row.userPhone}}</span> <br>
            <span>{{scope.row.userName}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="cityNameBelongTo"
                       label="城市"
                       min-width="120px"></el-table-column>
      <el-table-column prop="cityName"
                       label="审核状态"
                       min-width="120">
        <template slot-scope="scope">
          <span>{{scope.row.statusText}}</span> <br />
          <div v-if="scope.row.status !== 'checkSuccess'">
            <span>总&nbsp;&nbsp;&nbsp;&nbsp;共 : {{scope.row.recordCount}}条</span><br />
            <span>成&nbsp;&nbsp;&nbsp;&nbsp;功 : {{scope.row.recordSuccessCount}}条</span><br />
            <span>失&nbsp;&nbsp;&nbsp;&nbsp;败 : {{scope.row.recordFailCount}}条</span><br />
            <span><span style="display: inline-block; width:43px">处理中</span> : {{scope.row.recordRefundingCount}}条</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="vin"
                       label="账户类型/退款类型"
                       show-overflow-tooltip
                       min-width="150">
        <template slot-scope="scope">
          <div>
            <span>{{scope.row.userMoneyText === '余额' ? '充值余额' : scope.row.userMoneyText}}</span> <br>
            <span>{{scope.row.amountRateText}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="money"
                       label="退款金额"
                       show-overflow-tooltip
                       min-width="100"></el-table-column>
      <el-table-column prop="association"
                       label="时间信息"
                       show-overflow-tooltip
                       min-width="260">
        <template slot-scope="scope">
          <div>
            <span>用户申请时间: {{scope.row.addTime}}</span> <br>
            <span>财务处理时间: {{scope.row.handleTime}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="handler"
                       label="财务处理人"
                       min-width="100"></el-table-column>
      <!-- <el-table-column label="操作" fixed="right" min-width="70">
          <template slot-scope="scope">
              <el-button type="text" @click="editInfor(scope.row)">详情</el-button>
          </template>
      </el-table-column> -->
    </el-table>
    <div class='table-page'>
      <el-pagination :current-page.sync="page"
                     :page-size="params.pageSize"
                     layout="total, prev, pager, next"
                     :total="params.total"
                     @current-change="pageChange">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import paginationMixin from '@/mixins/pagination.js'
export default {
  mixins: [paginationMixin],
  data() {
    return {
      page: 1
    }
  },
  methods: {
    editInfor(row) {
      this.$emit('on-edit', row)
    },
    pageChange(val) {
      this.$emit('on-change', val)
    }
  },
  props: {
    optimusCheckList: {
      default: () => {
        return []
      },
      type: Array
    },
    params: Object
  }
}
</script>
