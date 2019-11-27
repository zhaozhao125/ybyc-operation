 <template>
    <div class="all_wait_settleAccount_dialog">
      <el-form :model="formInline" class="order_settle" label-width="80px">
        <el-form-item label="租车费用">
            <el-row >
              <el-col :span="8">车辆租金：</el-col>
              <el-col :span="6" class="ta-r">{{params.carRentTotalFee}}</el-col>
              <el-col :span="1" class="pl-5">元</el-col>
            </el-row>
            <el-row>
              <el-col :span="8">基础服务费费用：</el-col>
              <el-col :span="6" class="ta-r">{{params.serviceTotalFee}}</el-col>
              <el-col :span="1" class="pl-5">元</el-col>
            </el-row>
            <el-row >
              <el-col :span="8">其他费用：</el-col>
              <el-col :span="6">
                <!-- <el-input v-model.number="formInline.otherPay" class="other_pay" @blur="moneyChange"></el-input> -->
                <el-input-number v-model.number="formInline.otherPay" class="other_pay"  :controls=false style="width:100px"></el-input-number>
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
              <el-col :span="6" class="total_money ta-r" >{{moneyAccount.toFixed(2)}}</el-col>
              <el-col :span="1" class="pl-5 total_money">元</el-col>
            </el-row>
        </el-form-item>
        <el-form-item label="结算备注">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="formInline.settleRemark">
          </el-input>
        </el-form-item>
      </el-form>
    </div>
  </template>
  <script>
  export default {
    data() {
      return {
        formInline: {
          itemRemark: '',
          otherPay: 0,
          settleRemark: ''
        },
        maxLength: 10
      }
    },
    computed: {
      moneyAccount () {
        if (this.formInline.otherPay) {
          if (typeof this.formInline.otherPay === 'number') {
            return this.formInline.otherPay + this.params.rentMoney + this.params.basicServiceMoney
          } else {
            return this.params.rentMoney + this.params.basicServiceMoney
          }
        } else {
          return this.params.rentMoney + this.params.basicServiceMoney
        }
      }
    },
    methods: {
      onSubmit() {
        console.log('submit!');
      },
      moneyChange () {
        if (typeof this.formInline.otherPay === 'number') {
        } else {
          this.formInline.otherPay = 0
        }
      }
    },
    props: {
      params: {
        default: {},
        type: Object
      }
    }
  }
</script>
<style lang="scss">
  .all_wait_settleAccount_dialog {
    .ta-r {
      text-align: right;
    }
    .pl-5{
      padding-left:5px;
    }
    .order_settle {
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
  }
</style>
