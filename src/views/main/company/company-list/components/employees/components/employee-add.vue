<template>
  <div class="employee-add">
    <el-dialog title="添加员工" :visible.sync="visible" width="500" :before-close="handleBeforeClose" :modal-append-to-body="false">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="手机号码" prop="userphone">
          <el-col :span="18">
            <el-input v-model="ruleForm.userphone"></el-input>
          </el-col>
          <el-col :span="1">&nbsp;</el-col>
          <el-col :span="4">
            <el-button @click.prevent="queryAccount(ruleForm.userphone)" :disabled="!checked">查询账号</el-button>
          </el-col>
        </el-form-item>
        <el-form-item v-if="hidden">
          <el-col :span="18">
            <div class="t-cen bold">{{ruleForm.userphone}}</div>
            <div class="t-cen">{{dec}}</div>
          </el-col>
        </el-form-item>
        <el-form-item label="设为管理员" prop="role" v-if="roleHidden">
          <el-radio-group v-model="ruleForm.role" @change="handleAdmin">
            <el-radio label="manager">是</el-radio>
            <el-radio label="general">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleBeforeClose">取消</el-button>
          <el-button type="primary" @click="submitForm('ruleForm')" :disabled="!addVisible">添加</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="centerDialogVisible" width="22%" center :modal-append-to-body="false">
      <span class="t-cen">设为管理员后，该账号将拥有企业管理权限，请谨慎操作。</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'employee-add',
  components: {},
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    sn: {
      type: String,
      default: ''
    }
  },
  data() {
    var checkPhoneNum = (rule, value, callback) => {
      var numreg = /^[1][1-9][0-9]{9}$/
      if (!value) {
        return callback(new Error('不能为空'))
      }
      setTimeout(() => {
        if (!Number.isInteger(Number(value))) {
          this.checked = false
          callback(new Error('请输入数字'))
        } else {
          if (!numreg.test(value)) {
            this.checked = false
            callback(new Error('请输入11位手机号码'))
          } else {
            this.checked = true
            callback()
          }
        }
      }, 500)
    }
    return {
      userId: null,
      ruleForm: {
        userphone: '',
        role: 'general'
      },
      rules: {
        userphone: [
          { required: true, validator: checkPhoneNum, trigger: 'change' }
        ],
        role: [
          { required: true, message: '请选择是否为管理员', trigger: 'change' }
        ]
      },
      checked: false,
      hidden: false,
      roleHidden: false,
      centerDialogVisible: false,
      addVisible: false,
      dec: ''
    }
  },
  methods: {
    handleBeforeClose() {
      this.$emit('update:visible', false)
      this.clearData()
      this.$emit('close')
    },
    clearData() {
      this.ruleForm = {
        userphone: '',
        role: 'general'
      }
      this.hidden = false
      this.roleHidden = false
    },
    queryAccount(num) {
      this.$service.queryAccount({ phone: num }).then(res => {
        console.log(res)
        if (res.data.code === '0') {
          this.hidden = true
          this.userId = res.data.data.userId
          let status = res.data.data.status
          if (status === 'ok') {
            this.dec = '该手机号码已注册一步用车，请核实号码准确性，确定后该号码将进入本企业，可享员工权益'
            this.roleHidden = true
            this.addVisible = true
          } else if (status === 'isStaff') {
            this.dec = '该手机号码已加入其它企业，暂不可加入本企业'
            this.roleHidden = false
            this.addVisible = false
          } else if (status === 'notExists') {
            this.dec = '该手机号码尚未注册一步用车，请确认注册后，再进行添加'
            this.roleHidden = false
            this.addVisible = false
          }
        }
      })
    },
    handleAdmin(val) {
      if (val === 'manager') {
        this.centerDialogVisible = true
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.userId) {
            let params = {
              companySn: this.sn,
              role: this.ruleForm.role,
              userId: this.userId
            }
            console.log(params)
            this.$service.employeesAdd(params).then(res => {
              if (res.data.code === '0') {
                this.$message.success(res.data.msg)
                this.$emit('update:visible', false)
                this.$emit('close')
                this.clearData()
              }
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
.employee-add {
  .t-cen {
    text-align: center;
  }
  .bold {
    font-size: 18px;
    font-weight: 500;
  }
}
</style>
