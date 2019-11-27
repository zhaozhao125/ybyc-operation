<template>
  <div class="usercenter">
    <div class="user-info">
      <el-form v-if="userInfo" label-position="left" inline ref="form" :model="userForm" :rules="userFormRules">
        <el-form-item label="用户名">
          <span>{{ userInfo.username }}</span>
        </el-form-item>
        <el-form-item label="姓名" prop="cnName">
          <span v-show="!formVisible">{{ userInfo.cnName }}</span>
          <el-input v-show="formVisible" v-model="userForm.cnName"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <span v-show="!formVisible">{{ userInfo.email }}</span>
          <el-input v-show="formVisible" v-model="userForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobilePhone">
          <span v-show="!formVisible">{{ userInfo.mobilePhone }}</span>
          <el-input v-show="formVisible" v-model="userForm.mobilePhone"></el-input>
        </el-form-item>
        <!-- <el-form-item label="创建时间">
          <span>{{ (new Date(userInfo.baseEntity.createTime)).toLocaleString() }}</span>
        </el-form-item>
        <el-form-item label="角色">
          <span>{{ userInfo.adminRole.roleName }}</span>
        </el-form-item>
        <el-form-item label="描述">
          <span>{{ userInfo.adminRole.summary }}</span>
        </el-form-item> -->
        <el-form-item v-show="!formVisible">
          <el-button type="primary" @click="showForm" size="small">修改信息</el-button>
          <el-button size="small" @click="showChangePassword">修改密码</el-button>
        </el-form-item>
        <el-form-item v-show="formVisible">
          <el-button type="primary" @click="submitEdit" size="small">确定</el-button>
          <el-button size="small" @click="cancelEdit">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog title="修改密码" :visible.sync="passwordVisible" width="500px">
      <changePassword @success="closeChangePassword('success')" @cancel="closeChangePassword('cancel')"></changePassword>
    </el-dialog>
  </div>
</template>
<script>
import changePassword from './components/change-password.vue'
export default {

  name: 'usercenter',

  components: {
    changePassword
  },

  data() {
    let validatePhone = (rule, value, callback) => {
      let reg = /^((1[3-8][0-9])+\d{8})$/
      if (reg.test(value)) {
        callback()
      } else {
        callback(new Error('手机号不合法'))
      }
    }
    return {
      userInfo: null,
      userForm: null,
      userFormRules: {
        cnName: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        email: [
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ],
        mobilePhone: [
          { validator: validatePhone, trigger: 'blur' }
        ]
      },
      formVisible: false,
      passwordVisible: false
    }
  },

  methods: {
    getUserInfo() {
      this.$service.getUserInfo().then(res => {
        this.userInfo = res.data.data
        this.userForm = {
          cnName: this.userInfo.cnName,
          email: this.userInfo.email,
          mobilePhone: this.userInfo.mobilePhone
        }
      })
    },
    showForm() {
      this.formVisible = true
    },
    submitEdit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$service.updateSelfInfo(this.userForm).then(res => {
            this.userInfo.cnName = this.userForm.cnName
            this.userInfo.email = this.userForm.email
            this.userInfo.mobilePhone = this.userForm.mobilePhone
            this.formVisible = false
            this.$message({
              message: '修改成功',
              type: 'success'
            })
          })
        }
      });

    },
    cancelEdit() {
      this.$refs.form.clearValidate()
      this.userForm = {
        cnName: this.userInfo.cnName,
        email: this.userInfo.email,
        mobilePhone: this.userInfo.mobilePhone
      }
      this.formVisible = false
    },
    showChangePassword() {
      this.passwordVisible = true
    },
    closeChangePassword() {
      this.passwordVisible = false
    }
  },

  created() {
    this.getUserInfo()
  }
}

</script>
<style lang="scss">
.usercenter {
  .user-info {
    margin-top: 30px;
    form {
      max-width: 500px;
      margin: 20px auto 0;
    }
    label {
      width: 90px;
      color: $color-detail;
    }
    .el-form-item {
      width: 80%;
    }
    .el-form-item.is-required .el-form-item__label:before {
      display: none;
    }
  }
}

</style>
