<template>
   <el-dialog
    title="取消退款"
    :visible.sync="dialogVisible"
    width="30%"
   >
    <el-input
      type="textarea"
      :rows="2"
      placeholder="请输入内容"
      v-model="remark">
    </el-input>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false" size='small'>取 消</el-button>
      <el-button type="primary"  @click="confirmCancel" size='small'>确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  data () {
    return {
      dialogVisible: false,
      remark: '',
      infor: {}
    }
  },
  methods: {
    show (infor) {
      this.dialogVisible = true
      this.infor = infor
      this.remark = ''
    },
    confirmCancel () {
      // financeCancel
      let params = {
        adminUser: this.$store.state.user.username,
        adminUsername: this.$store.state.user.cnName,
        remark: this.remark,
        userApplyReturnDepositId: this.infor.userApplyReturnDepositId
      }
      this.$service.financeCancel(params).then((res) => {
        this.$emit('on-cancelSucces')
        this.dialogVisible = false
        this.$message.success('取消成功！')
      }).catch((res) => {
      })
    }
  }
}
</script>

