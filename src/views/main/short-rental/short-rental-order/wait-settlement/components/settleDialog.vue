<template>
  <el-dialog title="结算" :visible.sync="dialogVisible" width="600px">
    <div class="wait_settleAccount_dialog">
      <el-form :model="formInline" class="all_order_settle" label-width="80px">
        <el-form-item label="租车费用">
          <el-row>
            <el-col :span="8">车辆租金：</el-col>
            <el-col :span="6" class="ta-r">{{infor.carRentTotalFee}}</el-col>
            <el-col :span="1" class="pl-5">元</el-col>
          </el-row>
          <el-row>
            <el-col :span="8">基础服务费费用：</el-col>
            <el-col :span="6" class="ta-r">{{infor.serviceTotalFee}}</el-col>
            <el-col :span="1" class="pl-5">元</el-col>
          </el-row>
          <el-row>
            <el-col :span="8">其他费用：</el-col>
            <el-col :span="6">
              <el-input-number v-model.number="formInline.otherPay" class="other_pay" :controls=false style="width:120px"></el-input-number>
            </el-col>
            <el-col :span="1" class="pl-5">元</el-col>
          </el-row>
          <el-row>
            <el-col :span="14">
              <el-input placeholder="请输入费用备注(10个字内)" v-model="formInline.itemRemark" :maxlength=10></el-input>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8" class="total_money">总计：</el-col>
            <el-col :span="6" class="total_money ta-r">{{moneyAccount}}</el-col>
            <el-col :span="1" class="pl-5 total_money">元</el-col>
          </el-row>
        </el-form-item>
        <template v-if="infor.discountMoney">
          <el-form-item label="优惠金额">
            <el-row>
              <el-col :span="8" class="total_money" v-if="!checked">{{infor.couponName}}</el-col>
              <el-col :span="6" class="total_money ta-r" v-if="!checked">-{{infor.discountMoney}}</el-col>
              <el-col :span="6" class="total_money ta-r" v-if="checked">0</el-col>
              <el-col :span="1" class="pl-5 total_money">元</el-col>
              <el-col :span="9" class="cou-dec" v-if="infor.orderType === 'short'">
                <el-checkbox v-model="checked" @change = "UseDiscount">
                  不使用优惠券结算
                </el-checkbox>
                <el-popover placement="top" width="200" trigger="click" content="当发生结算费用不满足使用优惠券条件时（如提前还车），可勾选此项，结算后该优惠券退回用户账户。">
                  <el-button slot="reference" type="text">
                    <i class="el-icon-question"></i>
                  </el-button>
                </el-popover>
              </el-col>
            </el-row>
          </el-form-item>
        </template>
        <el-form-item label="订单收入">
          {{orderIncome}}元
        </el-form-item>
        <el-form-item label="结算备注">
          <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="formInline.settleRemark">
          </el-input>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false" size="small">取 消</el-button>
      <el-button type="primary" size="small" @click="orderSettle" :disabled="disabledFlag" :loading="loading">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      disabledFlag: false,
      dialogVisible: false,
      formInline: {
        itemRemark: '',
        otherPay: 0,
        settleRemark: '',
        settleMoney: ''
      },
      infor: {},
      checked: false,
      loading: false
    }
  },
  computed: {
    moneyAccount() {
      if (this.formInline.otherPay) {
        // |其他费用| <= 租车费用
        if ((this.formInline.otherPay) < -(this.infor.carRentTotalFee + this.infor.serviceTotalFee)) {
          this.$message.error('减免的其他费用数值不能大于订单金额')
          this.disabledFlag = true
        } else {
          this.disabledFlag = false
        }

        if (typeof this.formInline.otherPay === 'number') {
          this.addPrice()
          return (
            this.formInline.otherPay +
            this.infor.carRentTotalFee +
            this.infor.serviceTotalFee).toFixed(2)
        } else {
          this.addPrice()
          return (this.infor.carRentTotalFee + this.infor.serviceTotalFee).toFixed(2)
        }
      } else {
        this.formInline.otherPay = 0
        this.addPrice()
        return (this.infor.carRentTotalFee + this.infor.serviceTotalFee).toFixed(2)
      }
    },
    orderIncome () {
      if (this.formInline.settleMoney < 0) {
        this.$message.error('减免的其他费用数值不能大于订单金额')
        this.disabledFlag = true
        return this.formInline.settleMoney
      } else {
        this.disabledFlag = false
        return this.formInline.settleMoney
      }
    }
  },
  watch: {

    checked() {
      if (this.checked) {
        this.formInline.settleMoney = this.moneyAccount
      } else {
        this.formInline.settleMoney = this.moneyAccount - this.infor.discountMoney
      }
    }
  },
  methods: {
    // 使用优惠券
    UseDiscount (val) {
      console.log(val)
    },
    addPrice() {
      if (this.checked) {
        this.formInline.settleMoney = this.formInline.otherPay + this.infor.carRentTotalFee + this.infor.serviceTotalFee
      } else {
        this.formInline.settleMoney = this.formInline.otherPay + this.infor.carRentTotalFee + this.infor.serviceTotalFee - this.infor.discountMoney
      }

      this.formInline.settleMoney = this.formInline.settleMoney.toFixed(2)
    },
    show(val) {
      console.log(val)
      this.dialogVisible = true
      this.loading = false
      this.infor = val
      this.formInline = {
        itemRemark: '',
        otherPay: 0,
        settleRemark: '',
        settleMoney: this.moneyAccount - this.infor.discountMoney,
        discountMoneyOrigin: this.infor.discountMoney
      }
    },
    // moneyChange() {
    //   console.log(typeof this.formInline.otherPay)
    //   if (typeof this.formInline.otherPay === 'number') {
    //   } else {
    //     this.formInline.otherPay = 0
    //   }
    // },
    orderSettle() {
      console.log(this.formInline.otherPay)
      this.loading = true
      let params = {
        orderSn: this.infor.sn,
        itemName: 'other',
        itemMoney: this.formInline.otherPay ? this.formInline.otherPay : 0,
        remark: this.formInline.settleRemark,
        operatorCnName: this.$store.getters.user.cnName,
        operatorUserName: this.$store.getters.user.username,
        itemRemark: this.formInline.itemRemark,
        useCoupon: !this.checked
      }
      // console.dir(params);return false;

      this.$service
        .orderSettle(params)
        .then(res => {
          this.dialogVisible = false
          this.loading = false
          this.$message.success('结算成功！')
          this.$emit('on-success')
        })
        .catch(res => {
          this.loading = false
        })
    }
  }
}
</script>
<style lang="scss">
  .wait_settleAccount_dialog {
    .ta-r {
      text-align: right;
    }
    .pl-5{
      padding-left:5px;
    }
    .all_order_settle {
      .total_money {
        font-weight: 700;
      }
      .el-form-item__label {
        font-weight: 700;
      }
      .el-input {
        .el-input__inner {
          height: 30px;
          line-height: 30px;
        }
      }
      .other_pay {
        input {
          text-align: right;
        }
      }
    }
    .cou-dec{
      font-weight: normal;
      .el-checkbox__input {
          margin-left:15px;
      }
      .el-checkbox__label {
          font-size: 10px;
      }
    }
  }
</style>
