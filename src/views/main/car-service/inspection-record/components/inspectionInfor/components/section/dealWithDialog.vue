<template>
  <el-dialog
    title="提示"
    :visible.sync="dialogVisible"
  >
    <span>这是一段信息</span>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
   data () {
     return {
       dialogVisible: false
     }
   },
   methods: {
     show () {
       this.dialogVisible = true
     }
   }
}
</script>
