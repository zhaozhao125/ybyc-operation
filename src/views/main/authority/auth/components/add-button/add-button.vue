<template>
  <el-dialog :title="buttonData?'编辑按钮权限':'添加按钮权限'" :visible.sync="visible" width="600px" :before-close="handleClose">
    <v-form ref="form" class="add-button" :formSettings="formSettings" :formData="buttonData" style="padding-right:50px" @save="handleSave"></v-form>
  </el-dialog>
</template>

<script>
import formSettings from './formSettings'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    buttonData: {
      type: Object
    }
  },

  data() {
    return {
      formSettings
    }
  },

  methods: {
    handleClose() {
      this.$refs.form.resetFields()
      this.$emit('close')
      this.$emit('update:visible', false)
    },
    handleSave(data) {
      if (this.buttonData) {
        let editData = Object.assign({}, this.buttonData)
        Object.assign(editData, data)
        this.$emit('edit', editData)
      } else {
        this.$emit('add', data)
      }
      this.handleClose()
    }
  }
}
</script>

<style lang="scss">

</style>
