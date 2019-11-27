<template>
  <el-dialog title="设置车辆网点" :visible.sync="visible" width="30%" :before-close="closeMe">
    <website-select v-model="stationId" placeholder="请输入网点名称" isRequest  :open='true'></website-select>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" :loading="loading" @click="handleCancel">取 消</el-button>
      <el-button size="small" :loading="loading" type="primary" @click="handleConfirm">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import websiteSelect from "@/components/website-select";
export default {

  props: {
    visible: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    }
  },

  components: {
    websiteSelect
  },

  data() {
    return {
      stationId: ''
    }
  },

  methods: {
    closeMe(){
      this.stationId = ''
      this.$emit('update:visible', false)
    },
    handleConfirm(){
      if(!this.stationId){
        this.$message({
          message: '请选择网点',
          type: 'warning'
        })
        return
      }
      this.$emit('confirm', this.stationId)
    },
    handleCancel(){
      this.closeMe()
    }
  }
}

</script>
<style lang="scss">


</style>
