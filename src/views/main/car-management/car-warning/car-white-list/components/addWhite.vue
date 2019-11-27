<template>
  <el-dialog
    title="添加白名单"
    :visible.sync="dialogVisible"
    width="30%"
    class="add_white_car"
    >
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="70px" class="demo-ruleForm">
      <el-form-item label="车牌号" prop="carNumber">
        <el-input v-model="ruleForm.carNumber"  placeholder="请输入车牌号"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false" size="small">取 消</el-button>
      <el-button type="primary" @click="submitForm('ruleForm')" size="small">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  data () {
    return {
      dialogVisible: false,
      ruleForm: {
        carNumber: ''
      },
      rules: {
        carNumber: [
          { required: true, message: '请输入车牌号', trigger: 'blur' },
        ]
      }
    }
  },
  methods: {
    show () {
      this.dialogVisible = true
      this.ruleForm.carNumber = ''
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.ruleForm)
          this.addWhiteCar(this.ruleForm.carNumber)
        } else {
          return false;
        }
      })
    },
    addWhiteCar (carNumber) {
      let obj = {
        carNumber: carNumber
      }
      this.$service.addWhiteCar(obj).then((res) => {
        this.$message.success('添加成功！')
        this.$emit('on-regetList')
        this.dialogVisible = false
      }).catch((res) => {
      })
    }
  }
}
</script>
<style lang="scss">
   .add_white_car {
     .el-form {
       .el-form-item__label {
         line-height: 32px;
       }
       .el-form-item__content {
         line-height: 32px;
         .el-input__inner {
           height: 32px;
           line-height: 32px;
         }
       }
     }
   }
</style>


