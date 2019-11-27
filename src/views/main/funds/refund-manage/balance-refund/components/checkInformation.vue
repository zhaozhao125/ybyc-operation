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
              <div class="x-value">{{information.userPhone}}</div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <div class="x-detail-item">
              <div class="x-label">姓名</div>
              <div class="x-value">{{information.userName}}</div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <div class="x-detail-item">
              <div class="x-label">用户ID</div>
              <div class="x-value">{{information.userId}}</div>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="x-detail-block">
        <h4 class="x-detail-title">退款信息</h4>
        <el-row :gutter="10">
          <el-col :xs="24" :sm="12" :md="8">
            <div class="x-detail-item">
              <div class="x-label">退款金额</div>
              <div class="x-value">{{information.money}}</div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <div class="x-detail-item">
              <div class="x-label">退款原因</div>
              <div class="x-value">{{information.refundsReasonText}}</div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <div class="x-detail-item">
              <div class="x-label">申请时间</div>
              <div class="x-value">{{information.addTime}}</div>
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
              <div class="x-value">{{information.serialNum}}</div>
            </div>
          </el-col>
        </el-row>
        <el-table :data="accountList" style="width: 100%">
          <el-table-column prop="returnDepositRecordId" label="流水ID" min-width="100">
          </el-table-column>
          <el-table-column prop="returnWayTypeText" label="支付方式" min-width="100">
          </el-table-column>
          <el-table-column prop="name" label="支付订单号/银行卡号"  min-width="240">
             <template slot-scope="scope">
                 <span v-if = " scope.row.returnWayType === 'bank_user'">{{scope.row.cardNum}}</span>
                 <span v-else>{{scope.row.paymentSn}}</span>
             </template>
          </el-table-column>
          <el-table-column prop="returnMoney" label="退款金额" min-width="100">
          </el-table-column>
          <el-table-column prop="handleText" label="审核状态" min-width="100">
          </el-table-column>
          <el-table-column label="操作" fixed="right" min-width="70" v-if = "information.status === 'checkSuccess' || information.status === 'refunding'">
            <template slot-scope="scope">
              <el-popover  placement="top" ref = 'popover5' v-model = 'scope.row.popoverShow' >
                 <div v-if = "scope.row.returnWayType === 'bank_user'">
                    <h4 style="margin-bottom:20px">请确认银行卡是否退款成功？</h4>
                    <div style="text-align: right; margin: 0">
                        <el-button size="mini" type="text" @click="cancelRefund(scope.row)">退款失败</el-button>
                        <el-button type="primary" size="mini" @click="confirmRefund(scope.row)">退款成功</el-button>
                    </div>
                 </div>
                 <div v-else>
                    <h4 style="margin-bottom:20px">确定退款？</h4>
                    <div style="text-align: right; margin: 0">
                        <el-button size="mini" type="text" @click="scope.row.popoverShow = false">取消</el-button>
                        <el-button type="primary" size="mini" @click="confirmRefund(scope.row)">确定</el-button>
                    </div>
                 </div>
                <div slot="reference" class="name-wrapper">
                   <el-button @click="scope.row.popoverShow = true" type = 'text' v-if = "scope.row.handle === 'wait'">退款</el-button>
                   <!-- <el-button @click="scope.row.popoverShow = true" type = 'text' v-if = "scope.row.handle === 'failure'">重试</el-button> -->
                </div>
              </el-popover>
             </template>
           </el-table-column>
        </el-table>
      </div>
      <div class="x-detail-block">
        <h4 class="x-detail-title">审核信息</h4>
        <el-row :gutter="10">
          <el-col :xs="24" :sm="12" :md="8">
            <div class="x-detail-item">
              <div class="x-label">审核状态</div>
              <div class="x-value">{{information.statusText}}</div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <div class="x-detail-item">
              <div class="x-label">财务处理时间</div>
              <div class="x-value">{{information.handleTime}}</div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <div class="x-detail-item">
              <div class="x-label">处理人</div>
              <div class="x-value">{{information.handler}}</div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" v-if = "information.status === 'cancle'">
            <div class="x-detail-item">
              <div class="x-label">取消备注</div>
              <div class="x-value">{{information.remark}}</div>
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
      accountList: [
      ],
      information: {}
    }
  },
  methods: {
    getAccountList () {
      let searchData = {
        userApplyReturnDepositId: this.infor.userApplyReturnDepositId
      }
      this.$service.accountCapitalList(searchData).then(res => {
        this.accountList = res.data.data
        this.accountList.forEach(ele => {
          this.$set(ele, 'popoverShow', false)
        })
      })
    },
    getInfor () {
      let paramsData = this.searchData.cityIds ? { cityIds: this.searchData.cityIds, userApplyReturnDepositId: this.infor.userApplyReturnDepositId, userMoneyType: 'balance', cityType: 'belongTo' } : {
        userApplyReturnDepositId: this.infor.userApplyReturnDepositId,
        userMoneyType: 'balance',
        cityType: 'belongTo'
      }
      this.$service.refundHandelInfor(paramsData).then((res) => {
        this.information = res.data.data.rows[0] ? res.data.data.rows[0] : {}
        this.$emit('getStatus', res.data.data.rows[0].status)
        for (let key in this.information) {
          this.information[key] ? '' : this.information[key] = '暂无'
        }
      }).catch((res) => {
      })
    },
    confirmRefund (row) {
      // this.getWaitLists()
      row.popoverShow = false
      let params = {
        adminUser: this.$store.state.user.username,
        adminUsername: this.$store.state.user.cnName,
        recordId: row.returnDepositRecordId
      }
      console.log(params)
      this.$service.confirmRefund(params).then(res => {
        this.$message.success('退款成功')
        this.getWaitLists()
        this.getInfor()
      }).catch((res) => {
        this.getAccountList()
        this.getInfor()
      })
    },
    getWaitLists () {
      let searchData = {
        userApplyReturnDepositId: this.infor.userApplyReturnDepositId
      }
      this.$service.accountCapitalList(searchData).then(res => {
        this.accountList = res.data.data
        this.accountList.forEach(ele => {
          this.$set(ele, 'popoverShow', false)
        })
        let waitLists = this.accountList.filter((ele) => {
          return ele.handle === 'wait'
        })
        console.log(waitLists)
        if (waitLists.length > 0) {
          // this.getAccountList()
          // this.getInfor()
          // this.$emit('on-reload')
        } else {
          this.$emit('on-reload')
        }
      })
    },
    cancelRefund (row) {
      row.popoverShow = false
      let params = {
        adminUser: this.$store.state.user.username,
        adminUsername: this.$store.state.user.cnName,
        recordId: row.returnDepositRecordId
      }
      this.$service.cancelRefund(params).then(res => {
        this.$message.warning('退款失败!')
        this.getAccountList()
        this.getInfor()
        this.getWaitLists()
      }).catch((res) => {
        this.getAccountList()
        this.getInfor()
      })
    }
  },
  mounted () {
    this.getAccountList()
    this.getInfor()
  },
  props: {
    infor: {
      default: () => {},
      type: Object
    },
    searchData: {
      default: () => {},
      type: Object
    }
  }
}
</script>
