<template>
  <div class="change-password">
    <el-form :model="formModel" status-icon :rules="rules2" ref="form" label-width="100px" size="small">
      <el-form-item label="原密码" prop="oldPassword">
        <el-input type="password" v-model="formModel.oldPassword"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input type="password" v-model="formModel.newPassword" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPassword">
        <el-input type="password" v-model="formModel.checkPassword" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {

  name: 'change-password',

  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.formModel.newPassword) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      formModel: {
        newPassword: '',
        checkPassword: '',
        oldPassword: ''
      },
      rules2: {
        oldPassword: [
          { required: true, message: '原密码不能为空', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '新密码不能为空', trigger: 'blur' }
        ],
        checkPassword: [
          { required: true, message: '确认密码不能为空', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    resetForm(){
      this.$refs.form.resetFields()
      this.$nextTick(()=>{
        this.$refs.form.clearValidate()
      })
    },
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$service.changePassword(this.formModel.newPassword, this.formModel.oldPassword).then(res => {
            this.$message({
              message: '修改成功！',
              type: 'success'
            })
            this.$emit('success')
            this.resetForm()
          })
        }
      })
    },
    cancel() {
      this.$emit('cancel')
      this.resetForm()
    }
  }
}

</script>
<style lang="scss">


</style>
