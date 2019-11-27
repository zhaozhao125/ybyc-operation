<template>
  <div>
    <!-- 可增加 x-no-colon 类禁用label后的冒号 -->
    <div class="x-data-detail">
      <div class="x-detail-block">
        <h4 class="x-detail-title">用户信息</h4>
        <el-row :gutter="10">
          <el-col :xs="24" :sm="12" :md="8">
            <div class="x-detail-item">
              <div class="x-label">手机号码</div>
              <div class="x-value">{{infor.userPhone}}</div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <div class="x-detail-item">
              <div class="x-label">姓名</div>
              <div class="x-value">{{infor.userName}}</div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <div class="x-detail-item">
              <div class="x-label">用户ID</div>
              <div class="x-value">{{infor.userId}}</div>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="x-detail-block">
        <h4 class="x-detail-title">退款信息</h4>
        <el-row :gutter="10">
          <el-col :xs="24" :sm="12" :md="8">
            <div class="x-detail-item">
              <div class="x-label">账户类型</div>
              <div class="x-value">{{infor.userMoneyText}}</div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <div class="x-detail-item">
              <div class="x-label">退款类型</div>
              <div class="x-value">{{infor.amountRateText}}</div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <div class="x-detail-item">
              <div class="x-label">退款金额</div>
              <div class="x-value">{{infor.money}}</div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <div class="x-detail-item">
              <div class="x-label">退款原因</div>
              <div class="x-value">{{infor.refundsReasonText}}</div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <div class="x-detail-item">
              <div class="x-label">申请时间</div>
              <div class="x-value">{{infor.addTime}}</div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <div class="x-detail-item">
              <div class="x-label">用户撤销时间</div>
              <div class="x-value">{{infor.userCancelDate | timeFilter}}</div>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="x-detail-block" style = "border-bottom: none">
        <h4 class="x-detail-title">资金流水</h4>
         <el-row :gutter="10">
           <el-col :xs="24" :sm="12" :md="8">
            <div class="x-detail-item">
              <div class="x-label">退款记录编号</div>
              <div class="x-value">{{infor.serialNum}}</div>
            </div>
          </el-col>
        </el-row>
        <el-table :data="accountList" style="width: 100%">
          <el-table-column prop="returnDepositRecordId" label="流水ID" min-width="100">
          </el-table-column>
          <el-table-column prop="returnWayTypeText" label="支付方式" min-width="100">
          </el-table-column>
          <el-table-column label="支付订单号/银行卡号" min-width="240">
              <template slot-scope="scope">
                  <span v-if = " scope.row.returnWayType === 'bank_user'">{{scope.row.cardNum}}</span>
                  <span v-else>{{scope.row.paymentSn}}</span>
              </template>
          </el-table-column>
          <el-table-column prop="returnMoney" label="退款金额"  min-width="100">
          </el-table-column>
           <el-table-column prop="handleText" label="审核状态"  width="100">
          </el-table-column>
        </el-table>
      </div>
      <div class="x-detail-block">
        <h4 class="x-detail-title">审核信息</h4>
        <el-row :gutter="10">
          <el-col :xs="24" :sm="12" :md="8">
            <div class="x-detail-item">
              <div class="x-label">审核状态</div>
              <div class="x-value">{{infor.statusText}}</div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <div class="x-detail-item">
              <div class="x-label">运营审核时间</div>
              <div class="x-value">{{infor.auditorTime}}</div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <div class="x-detail-item">
              <div class="x-label">审核人</div>
              <div class="x-value">{{infor.auditor}}</div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <div class="x-detail-item">
              <div class="x-label">运营审核备注</div>
              <div class="x-value">{{infor.remark}}</div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <div class="x-detail-item">
              <div class="x-label">财务处理时间</div>
              <div class="x-value">{{infor.handleTime}}</div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <div class="x-detail-item">
              <div class="x-label">处理人</div>
              <div class="x-value">{{infor.handler}}</div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" v-if = "infor.status === 'cancle'">
            <div class="x-detail-item">
              <div class="x-label">取消备注</div>
              <div class="x-value">{{infor.remark}}</div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      accountList: []
    }
  },
  mounted () {
    this.getAccountList()
    for (let key in this.infor) {
      if (!this.infor[key]) {
        this.infor[key] = '暂无'
      }
    }
  },
  methods: {
    getAccountList () {
      let searchData = {
        userApplyReturnDepositId: this.infor.userApplyReturnDepositId
      }
      this.$service.accountCapitalList(searchData).then(res => {
        this.accountList = res.data.data
      })
    }
  },
  props: {
    infor: {
      default: () => { return {} },
      type: Object
    }
  }
}
</script>
