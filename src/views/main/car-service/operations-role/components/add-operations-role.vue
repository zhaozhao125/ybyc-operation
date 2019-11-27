<template>
  <v-page :visible.sync="visible" :before-close="closeMe">
    <h3 slot="title">{{templateTitle}}</h3>
    <v-form ref="form" slot="content" :formData="formData" :formSettings="formSettings" :btnLoading="btnLoading" :labelWidth="labelWidth" @handleSendChange="handleSendChange" @handleAcceptChange="handleAcceptChange" @changeCity="handleChangeCity" @save="handleSaveTemplate">
      <template slot="taskCreateAuthList" slot-scope="scope">
        <div v-for="(item, index) in scope.model.taskCreateAuthList" :key="index">
          <el-checkbox v-model="item.hasCreateAuth" @change="handleCheckChange(item)">{{item.taskTypeContent}}</el-checkbox>
          <el-checkbox v-model="item.hasAssignAuth" :disabled="!item.hasCreateAuth">有指派权限</el-checkbox>
        </div>
      </template>
      <template slot="taskAcceptAuthList" slot-scope="scope">
        <span v-for="(item, index) in scope.model.taskAcceptAuthList" :key="index" style="margin-right:20px">
          <el-checkbox v-model="item.hasAcceptAuth">{{item.taskTypeContent}}</el-checkbox>
        </span>
      </template>
      <template slot="grabPriority" slot-scope="scope">
        <el-input style="width: 250px" v-model.number="scope.model.grabPriority" placeholder="数字越大代表抢单优先推送"></el-input><div style="color:#878d99;font-size: 13px">注：发送抢单按照配置的抢单权重推送抢单消息分3个批次发送：0-9、10-19、20及以上
</div>
      </template>
    </v-form>
  </v-page>
</template>
<script>
import formSettings from './formSettings.js'

export default {
  name: 'addOperationsRole',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    templateTitle: {
      type: String,
      default: ''
    },
    formData: {
      type: Object
    }
  },
  data() {
    formSettings[0].items.find(item => item.name === 'taskCreateAuthList').rule = [{
      validator: this.checkAuthority,
      trigger: 'blur',
      required: true
    }]
    formSettings[0].items.find(item => item.name === 'taskAcceptAuthList').rule = [{
      validator: this.checkAcceptAuthority,
      trigger: 'blur',
      required: true
    }]
    formSettings[0].items.find(item => item.name === 'grabPriority').rule = [{
      validator: this.checkGrabPriority,
      trigger: 'blur',
      required: true
    }]
    return {
      labelWidth: '140px',
      formSettings: formSettings,
      check: true,
      checkAccept: true,
      btnLoading: false,
      cityInfor: null
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.formSettings[0].items[2].options = []
        this.handleSendChange(this.formData.hasCreateAuth)
        this.handleAcceptChange(this.formData.hasAcceptAuth)
        if (this.templateTitle == '编辑角色') {
          this.cityPoint(this.formData.cityId)
          this.cityInfor = this.formData.cityId
        }
      }
    }
  },
  methods: {
    handleChangeCity(action) {
      this.cityInfor = this.$refs.form.formModel.city
      this.formSettings[0].items[2].options = []
      this.$refs.form.setData('ruleId', '')
      this.cityPoint(this.cityInfor.value)
    },
    // 根据城市获取工分规则
    cityPoint (id) {
      this.$service.cityPoint({ cityId: id }).then((res) => {
        if (res.data.data.length) {
          this.formSettings[0].items[2].options = res.data.data.map((ele) => {
            return {
              value: ele.id,
              label: ele.name
            }
          })
        }
      })
    },
    closeMe() {
      this.$emit('update:visible', false)
      this.$emit('close')
      return false
    },
    checkAuthority(rule, value, callback) {
      let checked = value.some(item => item.hasCreateAuth)
      if (!checked && this.check) {
        return callback(new Error('请选择发单权限'))
      } else {
        callback()
      }
      callback()
    },
    checkAcceptAuthority(rule, value, callback) {
      let checked = value.some(item => item.hasAcceptAuth)
      if (!checked && this.checkAccept) {
        return callback(new Error('请选择接单权限'))
      } else {
        callback()
      }
      callback()
    },
    checkGrabPriority(rule, value, callback) {
      if (!(/(^[0-9]\d*$)/.test(value)) && this.checkAccept) {
        return callback(new Error('请输入正整数'))
      } else {
        callback()
      }
      callback()
    },
    handleSendChange(data) {
      if (data) {
        this.formSettings[0].items.find(item => item.name === 'taskCreateAuthList').hidden = false
        this.formSettings[0].items.find(item => item.name === 'carAuthScopeOnCreate').hidden = false
        this.check = true
      } else {
        this.formSettings[0].items.find(item => item.name === 'taskCreateAuthList').hidden = true
        this.formSettings[0].items.find(item => item.name === 'carAuthScopeOnCreate').hidden = true
        // this.$refs.form.setData('carAuthScopeOnCreate', 'district')
        this.formData.taskCreateAuthList.map(item => {
          item.hasAssignAuth = false
          item.hasCreateAuth = false
        })
        this.check = false
      }
    },
    handleAcceptChange(data) {
      if (data) {
        this.formSettings[0].items.find(item => item.name === 'taskAcceptAuthList').hidden = false
        this.formSettings[0].items.find(item => item.name === 'carAuthScopeOnAccept').hidden = false
        this.formSettings[0].items.find(item => item.name === 'grabPriority').hidden = false
        this.checkAccept = true
      } else {
        this.formSettings[0].items.find(item => item.name === 'taskAcceptAuthList').hidden = true
        this.formSettings[0].items.find(item => item.name === 'carAuthScopeOnAccept').hidden = true
        this.formSettings[0].items.find(item => item.name === 'grabPriority').hidden = true
        this.formData.taskAcceptAuthList.map(item => {
          item.hasAcceptAuth = false
        })
        this.checkAccept = false
        // this.$refs.form.setData('carAuthScopeOnAccept', 'district')
        // this.$refs.form.setData('grabPriority', 0)
      }
    },
    handleCheckChange(data) {
      if (!data.hasCreateAuth) {
        data.hasAssignAuth = false
      }
    },
    handleSaveTemplate(data) {
      this.btnLoading = true
      console.log(this.cityInfor)
      data.cityId = this.cityInfor.value
      data.cityName = this.cityInfor.label
      delete data.city
      if (this.templateTitle === '添加角色') {
        this.$service.addRole(data).then(res => {
          console.log(res.data.code)
          if (res.data.code == 0) {
            this.$emit('update:visible', false)
            this.$emit('loadTableData')
            this.$message({
              message: '添加成功',
              type: 'success'
            })
            this.btnLoading = false
          } else {
            this.$emit('update:visible', false)
            this.$emit('loadTableData')
            this.$message({
              message: '添加失败',
              type: 'warning'
            })
            this.btnLoading = false
          }
        }).catch(e => {
          this.btnLoading = false
        })
      } else {
        let ID = {}
        ID.id = this.formData.id
        let obj = { ...ID, ...data }
        this.$service.editRole(obj).then(res => {
          this.$emit('update:visible', false)
          this.$emit('loadTableData')
          this.$message({
            message: '编辑成功',
            type: 'success'
          })
          this.btnLoading = false
        })
      }
    }
  },
  computed: {
    user() {
      return this.$store.getters.user
    }
  }
}
</script>
<style lang="scss">
</style>
