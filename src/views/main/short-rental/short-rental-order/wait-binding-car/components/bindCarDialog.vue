<template>
  <el-dialog
    title="绑定租车卡"
    :visible.sync="dialogVisible"
    width='360px'
    >
    <el-form  :inline="true" class="all_order_settle">
      <el-form-item label="卡面号">
         <el-input placeholder="请输入卡面号" v-model="dialogParams.cardNumber" size = "small"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false" size="small">取 消</el-button>
      <el-button type="primary"  size="small" @click="bindCard">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  data () {
    return {
      dialogVisible: false,
      dialogParams: {
        cardNumber: null
      }
    }
  },
  methods: {
    show (val) {
      this.dialogVisible = true
      this.dialogParams = val
    },
    bindCard () {
      if (this.dialogParams.cardNumber) {
        let params = {
          orderSn: this.dialogParams.sn,
          operatorUserName: this.$store.state.user.username,
          operatorCnName: this.$store.state.user.cnName,
          cardPrintNumber: this.dialogParams.cardNumber
        }
        this.$service.bindCard(params).then((res) => {
          this.$message.success('绑卡成功')
          this.dialogVisible = false
          this.$emit('on-bind')
        })
      } else {
        this.$message.warning('请输入卡面号!')
      }
    }
  }
}
</script>
