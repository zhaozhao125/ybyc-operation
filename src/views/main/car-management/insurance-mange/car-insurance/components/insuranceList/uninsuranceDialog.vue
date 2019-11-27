<template>
   <el-dialog
      title="提示信息"
      :visible.sync="dialogVisible"
      width="30%"
      >
      <div class = "uninsurance_dialog_dis">该车辆确定不再续保？</div>
      <el-input type = "textarea" placeholder="请输入备注信息" :rows="2"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size = "small">取 消</el-button>
        <el-button type="primary"  size = "small" @click = "setNoInsurance">确 定</el-button>
      </span>
    </el-dialog>
</template>
<script>
export default {
  data () {
    return {
      dialogVisible: false,
      insuranceInfor: {}
    }
  },
  methods: {
    show (val) {
      this.dialogVisible = true
      this.insuranceInfor = val
    },
    setNoInsurance () {
      let params = {
        id: this.insuranceInfor.id,
        renewStatus: 'ignored'
      }
      this.$service.noInsurance(params).then((res) => {
        this.$message.success('设置不续保成功')
        this.dialogVisible = false
        this.$emit('no-insurance')
      })
    }
  }
}
</script>
<style lang="scss">
   .uninsurance_dialog_dis {
      padding-bottom: 10px;
   }
</style>

