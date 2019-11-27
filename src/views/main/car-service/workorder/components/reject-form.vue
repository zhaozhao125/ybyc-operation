<template>
<el-dialog title="驳回"
           :visible.sync="visible" width="500px" :before-close="handleBeforeClose">
  <div class="accept-form">
    <el-form :model="formModel"
             label-width="0"
             size="small" ref="form">
      <el-form-item prop="remark" label="">
        <el-input type="textarea"
                  v-model="formModel.remark"
                  placeholder=" 请输入验收备注" :rows="5"></el-input>
      </el-form-item>
      <el-form-item class="right-button">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary"
                   @click="handleAccept"
                   :loading="loading">确认</el-button>
      </el-form-item>
    </el-form>
  </div>
</el-dialog>

</template>

<script>
export default {

  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      formModel: {
        remark: ''
      },
      loading: false
    }
  },

  methods: {
    closeMe(){
      this.$emit('update:visible', false)
      this.loading = false
      this.$refs.form.resetFields()
      this.$refs.form.clearValidate()
    },
    handleAccept() {
      this.loading = true
      setTimeout(() => {
        this.closeMe()
      }, 500)
    },
    handleCancel() {
      this.closeMe()
    },
    handleBeforeClose(){
      this.closeMe()
    }
  }
}

</script>

<style lang="scss">
</style>
