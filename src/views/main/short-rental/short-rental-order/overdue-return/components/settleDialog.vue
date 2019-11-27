<template>
  <el-dialog
    title="结算"
    :visible.sync="dialogVisible"
    width="600px"
    >
    <el-form :model="formInline" class="all_order_settle" label-width="80px">
      <el-form-item label="租车费用">
          <el-row>
            <el-col :span="6">车辆租金：</el-col>
            <el-col :span="18">11111</el-col>
          </el-row>
          <el-row>
            <el-col :span="6">基础服务费费用：</el-col>
            <el-col :span="18">1000000</el-col>
          </el-row>
          <el-row>
            <el-col :span="6">其他费用：</el-col>
            <el-col :span="18">
              <el-input></el-input>
            </el-col>
          </el-row>
          <el-row>
            <el-input placeholder="请输入费用备注（10个字）"></el-input>
          </el-row>
           <el-row>
            <el-col :span="6">总计：</el-col>
            <el-col :span="18">1000000</el-col>
          </el-row>
      </el-form-item>
      <el-form-item label="结算备注">
        <el-input
          type="textarea"
          :rows="2"
          placeholder="请输入内容"
          >
        </el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false" size="small">取 消</el-button>
      <el-button type="primary" @click="dialogVisible = false" size="small">确 定</el-button>
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
      dialogParams: {}
    }
  },
  methods: {
    show () {
      this.dialogVisible = true
      // this.dialogParams.type = params.type
    }
  }
}
</script>

