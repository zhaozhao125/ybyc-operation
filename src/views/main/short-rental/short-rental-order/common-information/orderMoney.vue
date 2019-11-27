<template>
  <div class="all_order_money">
    <!-- 可增加 x-no-colon 类禁用label后的冒号 -->
    <div class="x-data-detail" v-if="orderMoney.revenueDetail">
      <div class="x-detail-block">
        <h4 class="x-detail-title">营收明细</h4>
        <el-form ref="form" :model="form" label-position="left" class="order_money" style="width:600px">
          <el-form-item :label="groups.name" class="rent_fee" v-for="(groups, index) in orderMoney.revenueDetail" :key="index">
            <el-row>
              <el-col :span="6" class="total_fee ta-r">{{groups.amount}}</el-col>
              <el-col :span="8" class=" pl-10 color-r">{{groups.tip}}</el-col>
            </el-row>
            <div v-if="groups.subItems != null">
              <el-row v-for="(item, index) in groups.subItems" :key="index">
                <el-col :span="10">{{item.name}}</el-col>
                <el-col :span="6" class="ta-r">
                  <span>{{item.amount}}</span>
                </el-col>
                <el-col :span="8" class="pl-10">
                  <span class="color-r">{{item.tip}} </span>
                </el-col>
              </el-row>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="x-data-detail" v-if="orderMoney.payedDetail">
      <div class="x-detail-block">
        <h4 class="x-detail-title">支付明细</h4>
        <el-form ref="form" :model="form" label-position="left" class="order_money" style="width:600px">
          <el-form-item :label="orderMoney.payedDetail.name" class="rent_fee">
            <el-row class="total_free">
              <el-col :span="6" class="total_fee ta-r">{{ orderMoney.payedDetail.amount}}</el-col>
              <el-col :span="8" class=" pl-10 color-r">{{ orderMoney.payedDetail.tip}}</el-col>
            </el-row>
            <div v-if="orderMoney.payedDetail.subItems != null">
              <el-row v-for="(item, index) in orderMoney.payedDetail.subItems" :key="index">
                <el-col :span="10">{{item.name}}</el-col>
                <el-col :span="6" class="ta-r">
                  <span>{{item.amount}}</span>
                </el-col>
                <el-col :span="8" class="pl-10">
                  <span class="color-r">{{item.tip}}</span>
                </el-col>
              </el-row>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="x-data-detail" v-if="orderMoney.refundDetail">
      <div class="x-detail-block">
        <h4 class="x-detail-title">退款明细</h4>
        <el-form ref="form" :model="form" label-position="left" class="order_money" style="width:600px">
          <el-form-item :label="orderMoney.refundDetail.name" class="rent_fee">
            <el-row class="total_free">
              <el-col :span="6" class="total_fee ta-r">{{ orderMoney.refundDetail.amount}}</el-col>
              <el-col :span="8" class="pl-10 color-r">{{ orderMoney.refundDetail.tip}}</el-col>
            </el-row>
            <div v-if="orderMoney.refundDetail && orderMoney.payedDetail.subItems != null">
              <el-row v-for="(item, index) in orderMoney.refundDetail.subItems" :key="index">
                <el-col :span="10">{{item.name}}</el-col>
                <el-col :span="6" class="ta-r">
                  <span>{{item.amount}}</span>
                </el-col>
                <el-col :span="8" class="pl-10">
                  <span class="color-r">{{item.tip}}</span>
                </el-col>
              </el-row>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="x-data-detail" v-if="handleInvoiceStatus">
      <div class="x-detail-block">
        <h4 class="x-detail-title">开票信息</h4>
        <el-row :gutter="10" type="flex">
          <el-col :xs="3" :sm="3" :md="3" v-show="!invoiceInfoVisible">
            <div class="x-detail-item">
              <div class="ta-r">
                <el-button type="text" @click="handleInvoiceInfo">查看开票信息</el-button>
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" v-if="invoiceInfoVisible">
            <div v-if='invoiceInfo.noInvoice'>
              <el-row :gutter="10" type="flex" v-for="(item, index) in invoiceInfo.info" :key="index">
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
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      infor: {},
      form: {},
      tableData: [
        {
          name: 123
        }
      ],
      invoiceInfo: null,
      invoiceInfoVisible: false
    }
  },
  computed: {
    handleInvoiceStatus() {
      if (this.orderMoney.orderType == 'short') {
        return this.orderMoney.orderStatus == 'finished'
      } else if (this.orderMoney.orderType == 'longRent') {
        return this.orderMoney.orderStatus == 'finished' || this.orderMoney.orderStatus == 'rent' || this.orderMoney.orderStatus == 'returned'
      }
    }
  },
  methods: {
    spanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        return {
          rowspan: 0,
          colspan: 2
        }
      }
    },
    handleInvoiceInfo() {
      console.log(this.orderMoney.orderType)
      let params = {
        orderSn: this.orderMoney.sn
      }
      if (this.orderMoney.orderType == 'short') {
        params.orderType = 'shortRent'
      } else if (this.orderMoney.orderType == 'longRent') {
        params.orderType = 'longTermRent'
      }
      this.$service
        .invoiceOrderInfo(params)
        .then(res => {
          if (res.data.code == '0') {
            this.invoiceInfo = res.data.data
            this.invoiceInfoVisible = true
          }
        })
        .catch(e => {
        })
    }
  },
  props: {
    orderMoney: {
      default: null,
      type: Object
    }
  }
}
</script>
<style lang="scss">
  .all_order_money {
     .ta-r {
       text-align: right;
     }
      .no-invoice-info{
        margin-left:70px;
            font-size: 14px;
      }
     .pl-10 {
       padding-left: 10px
     }
     .color-r {
       color: #F56C6C;
     }
     .x-data-detail {
      .x-detail-block {
        form {
          margin-left: 70px;
          .el-form-item {
            margin-bottom: 0px;
            .el-form-item__label {
              width:250px;
              line-height: 28px;
              font-size: 15px;
            }
          }
        }
      }
      .order_money {
        .el-form-item__label {
          font-weight: 700;
        }
        .pay_table {
          .el-table {
             th {
               padding: 3px;
             }
          }
        }
        .rent_fee {
          min-width:500px;
          .otherMoney {
            position: relative;
            .remark {
              position: absolute;
              display: inline-block;
              right: -80px;
            }
          }
          .total_fee {
            font-weight:700;
            font-size: 15px;
            line-height: 28px;
          }
          .line {
            border-bottom: 1px solid #e8e8e8;
            margin-top: 10px;
            margin-bottom: 10px;
          }
          .el-form-item__content {
            line-height: 28px;
          }
        }
        .discount-description {
          color: $color-red;
          margin-left: 20px;
        }
      }
    }
  }
</style>
