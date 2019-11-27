<template>
  <el-table :data="optimusCheckList"
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
                     label="所属城市"
                     min-width="100px"></el-table-column>
    <el-table-column prop="statusText"
                     label="审核状态"
                     show-overflow-tooltip
                     min-width="120">
    </el-table-column>
    <el-table-column prop="vin"
                     label="账户类型/退款类型"
                     show-overflow-tooltip
                     min-width="120">
      <template slot-scope="scope">
        <div>
          <span>{{scope.row.userMoneyText}}</span> <br>
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
          <span>运营审核时间: {{scope.row.auditorTime}}</span> <br>
          <span>财务处理时间: {{scope.row.handleTime}}</span> <br>
          <span v-if="scope.row.status=='userCancel'">用户撤销时间: {{scope.row.userCancelDate | timeFilter}}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="auditor"
                     label="运营审核人"
                     min-width="100"></el-table-column>
    <!-- <el-table-column label="操作" fixed="right" min-width="70">
            <template slot-scope="scope">
                <el-button type="text" @click="editInfor(scope.row)">详情</el-button>
            </template>
        </el-table-column> -->
  </el-table>
</template>
<script>
export default {
  data() {
    return {
      page: 1
    }
  },
  methods: {
    editInfor(row) {
      this.$emit('on-edit', row)
    }
  },
  props: {
    optimusCheckList: {
      default: () => [],
      type: Array
    }
  }
}
</script>
