<template>
  <el-dialog
    title="结算"
    :visible.sync="dialogVisible"
    width="400px"
    >
    <div class="finance_refund_money">应退<span class="money_account">{{infor.refundMoney}}</span>元，确定退款？</div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false" size="small">取 消</el-button>
      <el-button type="primary" @click="confirm" size="small">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  components: {
  },
  data () {
    return {
      dialogVisible: false,
      formInline: {},
      // dialogParams: {
      //   title: '排车',
      //   width: '30%',
      // },
      dialogParams: {},
      infor: {},
      // refundMoney: 0
    }
  },
  methods: {
    show (val) {
      this.dialogVisible = true
      this.infor = val
      // this.refoundCheck()
    },
    // refoundCheck () {
    //   this.$service.refoundCheck({orderSn: this.infor.sn}).then((res) => {
    //     this.refundMoney = res.data.data.refundMoney
    //   }).catch((res) => {
    //   })
    // },
    confirm () {
      let params = {
        orderSn: this.infor.sn,
        operatorUserName: this.$store.state.user.username,
        operatorCnName: this.$store.state.user.cnName,
        refundMoney: this.infor.refundMoney 
      }
      this.$service.refound(params).then((res) => {
        this.$message.success('退款成功！')
        this.dialogVisible = false
        this.$emit('on-success')
      }).catch((res) => {})
    }
  }
}
</script>
<style lang="scss">
  .finance_refund_money {
    .money_account {
      color: #F56C6C;
      font-weight: 700;
      font-size:15px;
      display: inline-block;
      padding-left: 5px;
      padding-right: 5px;
    }
  }
</style>

