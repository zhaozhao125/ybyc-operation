<template>
  <div>
    <!-- 可增加 x-no-colon 类禁用label后的冒号 -->
    <div class="x-data-detail">
      <div class="x-detail-block">
        <h4 class="x-detail-title">基本信息</h4>
        <el-row :gutter="10">
          <el-col :xs="24" :sm="12" :md="8">
            <div class="x-detail-item">
              <div class="x-label">订单编号</div>
              <div class="x-value">{{detailData.sn}}</div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <div class="x-detail-item">
              <div class="x-label">订单状态</div>
              <div class="x-value">{{detailData.orderStatus}}</div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <div class="x-detail-item">
              <div class="x-label">开始时间</div>
              <div class="x-value">{{detailData.startTimeTxt}}</div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <div class="x-detail-item">
              <div class="x-label">结束时间</div>
              <div class="x-value">{{detailData.endTimeTxt}}</div>
            </div>
          </el-col>

        </el-row>
      </div>
      <div class="x-detail-block">
        <h4 class="x-detail-title">用户信息</h4>
        <el-row :gutter="10">
          <el-col :xs="24" :sm="12" :md="8">
            <div class="x-detail-item">
              <div class="x-label">用户姓名</div>
              <div class="x-value">{{detailData.userName}}</div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <div class="x-detail-item">
              <div class="x-label">手机号</div>
              <div class="x-value">{{detailData.userTelephone}}</div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <div class="x-detail-item">
              <div class="x-label">订单来源</div>
              <div class="x-value">{{detailData.userType}}</div>
            </div>
          </el-col>

        </el-row>
      </div>
      <div class="x-detail-block">
        <h4 class="x-detail-title">充电桩信息</h4>
        <el-row :gutter="10">
          <el-col :xs="24" :sm="12" :md="8">
            <div class="x-detail-item">
              <div class="x-label">桩编号</div>
              <div class="x-value">{{detailData.operatorConnectorId}}</div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <div class="x-detail-item">
              <div class="x-label">设备商</div>
              <div class="x-value">{{detailData.device}}</div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <div class="x-detail-item">
              <div class="x-label">充电站</div>
              <div class="x-value">{{detailData.stationName}}</div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <div class="x-detail-item">
              <div class="x-label">运营商</div>
              <div class="x-value">{{detailData.operator}}</div>
            </div>
          </el-col>

        </el-row>
      </div>

      <div class="x-detail-block">
        <h4 class="x-detail-title">订单计费</h4>
        <el-row :gutter="10">
          <el-col :xs="24" :sm="12" :md="8">
            <div class="x-detail-item">
              <div class="x-label">充电量</div>
              <div class="x-value" v-if="detailData.totalPower">{{detailData.totalPower}}度</div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <div class="x-detail-item">
              <div class="x-label">充电费</div>
              <div class="x-value" v-if="detailData.totalElecMoney">{{detailData.totalElecMoney}}元</div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <div class="x-detail-item">
              <div class="x-label">服务费</div>
              <div class="x-value" v-if="detailData.totalServiceMoney">{{detailData.totalServiceMoney}}元</div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <div class="x-detail-item">
              <div class="x-label">站位费</div>
              <div class="x-value" v-if="detailData.parkingMoney">{{detailData.parkingMoney}}元（{{detailData.parkingTime}}小时）</div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <div class="x-detail-item">
              <div class="x-label">最后计费时间</div>
              <div class="x-value" v-if="detailData.endTimeTxt">{{detailData.endTimeTxt}}</div>
            </div>
          </el-col>
        </el-row>
      </div>
      <!-- 订单资金 -->
      <div class="x-detail-block">
        <h4 class="x-detail-title">订单资金</h4>
        <el-row :gutter="10">
          <el-col :xs="24" :sm="12" :md="8">
            <div class="x-detail-item">
              <div class="x-label">订单金额</div>
              <div class="x-value" v-if="detailData.totalMoney">{{detailData.totalMoney}}元</div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <div class="x-detail-item">
              <div class="x-label">优惠金额</div>
              <div class="x-value" v-if="detailData.discountAmount">{{detailData.discountAmount}}
                <span v-if="detailData.couponsShow">（{{detailData.couponName}}）</span>
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <div class="x-detail-item">
              <div class="x-label">应付金额</div>
              <div class="x-value" v-if="detailData.needPay">{{detailData.needPay}}元</div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <div class="x-detail-item">
              <div class="x-label">实付金额</div>
              <div class="x-value" v-if="detailData.actualPay">{{detailData.actualPay}}元</div>
            </div>
          </el-col>

        </el-row>
      </div>

      <div class="x-detail-block">
        <h4 class="x-detail-title">支付信息</h4>
        <el-row :gutter="10">
          <el-col :xs="24" :sm="12" :md="8">
            <div class="x-detail-item">
              <div class="x-label">支付方式</div>
              <div class="x-value">{{detailData.payWay}}</div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <div class="x-detail-item">
              <div class="x-label">支付时间</div>
              <div class="x-value">{{detailData.payDateTxt}}</div>
            </div>
          </el-col>
        </el-row>
      </div>

      <div class="x-detail-block" v-if="detailData.orderStatusCode === 'COMPLETED'">
        <h4 class="x-detail-title">开票信息</h4>

        <el-row :gutter="10" type="flex">
          <el-col :xs="3" :sm="3" :md="3" v-if="!invoiceInfoVisible">
            <div class="x-detail-item">
              <div class="ta-r">
                <el-button type="text" @click="handleInvoiceInfo">查看开票信息</el-button>
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" v-if="invoiceInfoVisible">
            <div v-if='invoiceInfo.noInvoice'>
              <el-row :gutter="10" type="flex" v-for="(item, index) in invoiceInfo.info" :key="index" v-if="invoiceInfoVisible">
                <el-col :xs="24" :sm="12" :md="8">
                  <div class="x-detail-item">
                    <div class="x-label">开票状态</div>
                    <div class="x-value">{{item.statusName}}</div>
                  </div>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12">
                  <div class="x-detail-item">
                    <div class="x-label">可开票金额</div>
                    <div class="x-value">{{item.moneyName}}</div>
                  </div>
                </el-col>
              </el-row>
            </div>
            <span v-else class="no-invoice-info">{{invoiceInfo.noInvoiceMsg}}</span>
          </el-col>

        </el-row>

      </div>

      <div class="x-detail-block">
        <h4 class="x-detail-title">其他信息</h4>
        <el-row :gutter="10">
          <el-col :xs="24" :sm="12" :md="8">
            <div class="x-detail-item">
              <div class="x-label">结束原因</div>
              <div class="x-value">{{detailData.stopReason}}</div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <div class="x-detail-item">
              <div class="x-label">操作人</div>
              <div class="x-value">{{detailData.stopOperator}}</div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <div class="x-detail-item">
              <div class="x-label">备注</div>
              <div class="x-value">{{detailData.stopReasonRemark}}</div>
            </div>
          </el-col>

        </el-row>
      </div>

    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      invoiceInfo: null,
      invoiceInfoVisible: false
    }
  },
  methods: {
    handleInvoiceInfo() {
      let params = {
        orderSn: this.detailData.sn,
        orderType: 'chargingPile'
      }
      this.$service
        .invoiceOrderInfo(params)
        .then(res => {
          if (res.data.code == '0') {
            this.invoiceInfo = res.data.data

            this.invoiceInfoVisible = true
          }
        })
    }
  },
  props: {
    detailData: {
      type: Object
    }
  }
}
</script>
<style lang="scss" scoped>
.x-data-detail {
  .no-invoice-info {
    margin-left: 70px;
    font-size: 14px;
  }
}
</style>
