<template>
  <el-dialog
    title="提示"
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
      <el-button @click="$emit('on-hide')">取 消</el-button>
      <el-button type="primary" @click="$emit('on-hide', remark)" >确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  data () {
    return {
      remark: ''
    }
  },
  props: {
    dialogVisible: {
      default: false,
      type: Boolean
    }
  }
}
</script>

