<template>
  <div class="verify-workorder-pass">
    <el-dialog title="验收" :visible.sync="visible" width="500px" :before-close="handleBeforeClose">
      <el-form :model="formModel" status-icon ref="form" label-width="100px">
        <el-form-item label="网点" prop="station">
          <span class="station-name">大学科技园三环店</span>
          <el-button type="text">设置网点</el-button>
        </el-form-item>
        <el-form-item label="验收备注" prop="checkPass">
          <el-input type="textarea" v-model="formModel.remark" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleCancel">取消</el-button>
          <el-button type="primary" @click="handleConfirm">确认验收</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
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
      loading: false,
      formModel: {
        station: '',
        remark: ''
      }
    }
  },

  methods: {
    closeMe() {
      this.$emit('update:visible', false)
      this.loading = false
    },
    handleBeforeClose() {
      this.closeMe()
    },
    handleCancel(){},
    handleConfirm(){}
  }
}

</script>
<style lang="scss" scoped>
.verify-workorder-pass{
  .station-name{
    color: $color-red;
    display: inline-block;
    margin-right: 10px;
  }
}

</style>
