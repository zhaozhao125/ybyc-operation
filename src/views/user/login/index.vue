<template>
  <div class="login">
    <div class="login-wrapper">
      <img src="~@/assets/img/logo-transparent.png" alt="" class="logo">
      <h2 class="login-title">一步用车运营管理平台</h2>
      <div class="form" @keyup.enter="submitForm('loginForm')">
        <el-form :model="loginForm" label-position="top" :rules="lginRules" ref="loginForm" class="demo-ruleForm">
          <el-form-item label="账号" prop="username">
            <el-input id="username" type="text" size="large" v-model="loginForm.username" placeholder="" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input id="password" type="password" size="large" v-model="loginForm.password" placeholder="" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="large" @click="submitForm('loginForm')" :loading="loginLoading">登录</el-button>
            <!-- <el-button @click="resetForm('loginForm')">重置</el-button> -->
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!-- <div class="version">
      <span>版本：v2.3.0</span>
    </div> -->
  </div>

</template>

<script>
export default {
  data: function() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      lginRules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }
        ]
      },
      loginLoading: false
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loginLoading = true
          this.$service
            .login(this.loginForm.username, this.loginForm.password)
            .then(res => {
              this.$store.commit('login', res.data.data)
              if (this.$route.query && this.$route.query.redirect) {
                this.$router.push(this.$route.query.redirect)
              } else {
                this.$router.push({
                  name: 'dashboard'
                })
              }
            })
            .catch(e => {
              this.loginLoading = false
            })
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style lang="scss">
.login {
  width: 100%;
  height: 100%;
  position: absolute;
  background-color: #25282e;
  .login-title {
    font-size: 25px;
    font-weight: lighter;
    color: #fff;
    text-align: center;
    margin-top: 40px;
    margin-bottom: 30px;
    letter-spacing: 1.23px;
  }
  .login-wrapper {
    width: 350px;
    height: 600px;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    .logo {
      display: block;
      margin: auto;
      width: 70px;
    }
    .form {
      background: #fafbfc;
      border-radius: 4.2px;
      padding: 10px 30px;
      .el-form-item__label {
        padding-bottom: 0;
        font-size: 17px;
        color: #3d3d3d;
      }
      .el-form-item.is-required .el-form-item__label:before {
        display: none;
      }
      .el-form-item.is-success .el-input__inner {
        border-color: #ccc;
      }
      .el-form-item .el-input__inner:focus {
        box-shadow: 0 0 7px 1px #fdd000;
        border: 0.7px solid #fdd000;
      }
      .el-input__inner {
        height: 45px;
      }
      button {
        width: 100%;
        height: 45px;
        margin: auto;
        display: block;
        color: #25282e;
        background: #fdd000;
        border: 0.7px solid #b07900;
        border-radius: 5.6px;
      }
    }
  }
  .version {
    position: absolute;
    bottom: 20px;
    width: 100%;
    text-align: center;
    span {
      font-size: 14px;
      color: #c9cacb;
      letter-spacing: 0.68px;
    }
  }
}
</style>
