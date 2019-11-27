<template>
    <el-form ref="form" :model="form" :formData="formData" label-width="80px">
      <div class="el-form-item moveleft">
        <div class="el-form-item__label">用户名：</div>
        <div class="el-form-item__content">{{formData.userName}}</div>
      </div>
      <div class="el-form-item moveleft">
        <div class="el-form-item__label">手机号：</div>
        <div class="el-form-item__content">{{formData.userPhone}}</div>
      </div>
      <el-form-item label="资金类型:">
        <el-select v-model="form.fundsType">
          <!-- <el-option label="余额" value="balance"></el-option> -->
          <el-option label="充值余额" value="balance"></el-option>
          <el-option label="赠送余额" value="giftBalance"></el-option>
          <el-option label="分时保证金" value="timeShareRentDeposit"></el-option>
          <el-option label="长租违章押金" value="longTermRentViolationDeposit"></el-option>
          <el-option label="长租车辆押金" value="longTermRentCarDeposit"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="增减类型:">
        <el-select v-model="form.type">
          <el-option label="增加" value="add"></el-option>
          <el-option label="扣除" value="reduce"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="支付方式:" v-show="isPayshow">
        <el-select v-model="form.paymentType">
          <el-option label="现金" value="cash"></el-option>
          <el-option label="pos刷卡" value="pos"></el-option>
          <el-option label="银行转账" value="bankTransfer"></el-option>
          <el-option label="其他" value="other"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="扣除类型:" v-show="isTimeshareReduceShow">
        <el-select v-model="form.timeshareReduce">
          <el-option label="违章" value="violationRulesPay"></el-option>
          <el-option label="车损" value="carDamagePay"></el-option>
          <el-option label="物料损耗" value="materialDamage"></el-option>
          <el-option label="其他" value="timereduceOther"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="扣除类型:" v-show="isLongCarReduceShow">
        <el-select v-model="form.longcarReduce">
          <el-option label="车损" value="carDamagePay"></el-option>
          <el-option label="物料损耗" value="materialDamage"></el-option>
          <el-option label="其他" value="longreduceOther"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="金额:">
        <el-input v-model.number="form.amount"></el-input>
      </el-form-item>

      <el-form-item label="备注:">
        <el-input type="textarea" v-model="form.adminNote"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">确定</el-button>
        <el-button @click="cancelSubmit">取消</el-button>
      </el-form-item>

    </el-form>
</template>
<script>
import searchSelect from '@/components/website-select'
import { handleSubmit } from '@/utils/common.js'
import api from '@/service/api/'

export default {
  name: 'funds-edit',
  props: {
    formData: {
      type: Object,
      require: true
    }
  },
  data() {
    return {
      admin: {},
      type: '',
      url: '',
      isLongCarReduceShow: false,
      isTimeshareReduceShow: false,
      isPayshow: true,
      orderType: '',
      infoUser: {},
      form: {
        fundsType: '',
        type: '',
        paymentType: '',
        timeshareReduce: '',
        longcarReduce: '',
        amount: '',
        adminNote: ''
      }
    }
  },
  watch: {
    form: {
      handler: function (val, oldVal) {
        // 账户余额 赠送余额 giftBalance   充值余额 rechargeBalance
        if (val.fundsType == 'giftBalance' && val.type == 'reduce') {
          this.isPayshow = false
          this.isTimeshareReduceShow = false
          this.isLongCarReduceShow = false

          this.url = api.giftBalanceReduce
        }
        if (val.fundsType == 'giftBalance' && val.type == 'add') {
          this.isPayshow = true
          this.isTimeshareReduceShow = false
          this.isLongCarReduceShow = false

          this.url = api.giftBalanceAdd
        }

        if (val.fundsType == 'balance' && val.type == 'reduce') {
          this.isPayshow = false
          this.isTimeshareReduceShow = false
          this.isLongCarReduceShow = false

          this.url = api.adminManualDeduct
        }

        if (val.fundsType == 'balance' && val.type == 'add') {
          this.isPayshow = true
          this.isTimeshareReduceShow = false
          this.isLongCarReduceShow = false

          this.url = api.adminManualRecharge
        }

        if (val.fundsType == 'timeShareRentDeposit' && val.type == 'add') {
          this.isPayshow = true
          this.isTimeshareReduceShow = false
          this.isLongCarReduceShow = false

          this.url = api.adminManualRecharge
        }

        if (val.fundsType == 'timeShareRentDeposit' && val.type == 'reduce') {
          this.isPayshow = false
          this.isTimeshareReduceShow = true
          this.isLongCarReduceShow = false

          switch (val.timeshareReduce) {
            case 'violationRulesPay': {
              this.url = api.violationRulesPay
            } break
            case 'carDamagePay': {
              this.url = api.carDamagePay
            } break
            case 'materialDamage': {
              this.url = api.materialDamage
            } break
            case 'timereduceOther': {
              this.url = api.adminManualDeduct
            } break
          }

          this.orderType = 'timeShareRent'
        }

        if (val.fundsType == 'longTermRentViolationDeposit' && val.type == 'add') {
          this.isPayshow = true
          this.isTimeshareReduceShow = false
          this.isLongCarReduceShow = false

          this.url = api.adminManualRecharge
        }

        if (val.fundsType == 'longTermRentViolationDeposit' && val.type == 'reduce') {
          this.isPayshow = false
          this.isTimeshareReduceShow = false
          this.isLongCarReduceShow = false

          this.url = api.violationRulesPay

          this.orderType = 'longTermRent'
        }

        if (val.fundsType == 'longTermRentCarDeposit' && val.type == 'add') {
          this.isPayshow = true
          this.isTimeshareReduceShow = false
          this.isLongCarReduceShow = false

          this.url = api.adminManualRecharge
        }

        if (val.fundsType == 'longTermRentCarDeposit' && val.type == 'reduce') {
          this.isPayshow = false
          this.isTimeshareReduceShow = false
          this.isLongCarReduceShow = true

          switch (val.longcarReduce) {
            case 'violationRulesPay': {
              this.url = api.violationRulesPay
            } break
            case 'carDamagePay': {
              this.url = api.carDamagePay
            } break
            case 'materialDamage': {
              this.url = api.materialDamage
            } break
            case 'longreduceOther': {
              this.url = api.adminManualDeduct
            } break
          }

          this.orderType = 'longTermRent'
        }
      },

      deep: true,
      immediate: true
    }
  },
  created() {
    this.initData()
  },
  mounted() {
    this.$nextTick(() => {})
  },
  methods: {
    cancelSubmit() {
      this.$emit('closeAndRefresh', 'cancel')
    },

    onSubmit(event) {
      let params = {
        data: {},
        url: this.url
      }
      params.data.userId = this.formData.userId
      // 操作人
      params.data.adminUser = this.admin.username
      params.data.adminUsername = this.admin.cnName

      params.data.adminNote = this.form.adminNote
      params.data.amount = this.form.amount

      // 对接的数据类型
      if (this.form.fundsType == 'giftBalance') {
        params.data.type = 'balance'
      } else {
        params.data.type = this.form.fundsType
      }

      params.data.paymentType = this.form.paymentType
      if (this.orderType) {
        params.data.orderType = this.orderType
      }

      this.$service.handleFundschange(params).then(res => {
        if (res.data.code == 0) {
          this.successSubmit()
        } else {
          this.$message.warning(res.data.msg)
        }
      })
    },

    initData() {
      this.admin = this.$store.getters.user
    },

    successSubmit() {
      this.$message({
        type: 'success',
        message: '操作成功！'
      })
      this.$emit('closeAndRefresh')
    }
  },
  components: {
    searchSelect
  }
}
</script>
<style lang="scss">
.moveleft{
  margin-left: -15px;
}
</style>
