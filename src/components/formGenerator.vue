<template>
  <div class="form-generator">
    <div class="form-wrapper" :class="{'view-mode': viewMode && !hideView}">
      <el-form v-if="formModel && formSettings" label-position="right" :label-width="labelWidth" :model="formModel" :rules="formRules" ref="addUpdateForm" :size="size">
        <el-form-item v-for="(item, index) in Object.keys(formSettings)" :label="formSettings[item].label + '：'" :prop="item" :class="{'hidden': formSettings[item].hidden}" :key="index">
          <template v-if="viewMode && !hideView">
            <span v-if="formSettings[item].viewData">{{formSettings[item].viewData[formModel[item]]}}</span>
            <span v-else>{{formModel[item]}}</span>
          </template>
          <template v-else>
            <!-- 下拉列表 -->
            <el-select v-model="formModel[item]" placeholder="请选择" v-if="formSettings[item].options">
              <el-option v-for="option in formSettings[item].options" :key="option.key" :label="option.label" :value="option.value">
              </el-option>
            </el-select>
            <!-- switch开关 -->
            <el-switch v-model="formModel[item]" on-text="是" off-text="否" v-else-if="formSettings[item].type == 'switch'">
            </el-switch>
            <!-- 数字类型input -->
            <el-input v-model.number="formModel[item]" type="number" :disabled="formSettings[item].disabled || formSettings[item].hidden" v-else-if="formSettings[item].type == 'number' && !formSettings[item].ignored"></el-input>
            <!-- 普通类型input -->
            <el-input v-model="formModel[item]" :type="formSettings[item].textarea?'textarea':''" :disabled="formSettings[item].disabled || formSettings[item].hidden" v-else-if="!formSettings[item].ignored"></el-input>
          </template>
        </el-form-item>
        <el-form-item v-if="viewMode && !hideView">
          <el-button type="primary" @click="showEditor">编辑</el-button>
        </el-form-item>
        <el-form-item v-else-if="showButtons && type!='view'">
          <el-button type="primary" @click="onSubmit" :loading="btnLoading">确定</el-button>
          <el-button @click="onCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
/* formSetting支持的属性
{
  itemName: {
    disabled: true,
    hidden: true,
    ignored: true,
    fake: true, //将显示在表单中，但不会提交
    label: 'xxx',
    options: [{
      key: 0,
      label: 'aa',
      default: true
    }, {
      key: 1,
      label: 'bb'
    }],
    type: 'number', // 还有'switch'
    textarea: true
  }
}
 */

export default {
  props: {
    type: { // 表单类型，有'update'和'add'
      type: String,
      default: 'add'
    },
    model: { // 表单的model，若类型为update则会将model中数据会成为表单默认值
      type: Object,
      default: null
    },
    formSettings: { // 表单显示内容设置
      type: Object,
      required: true
    },
    showButtons: { // 是否显示确定和取消按钮，点击确定会发送submit事件，点击取消会发送cancel事件
      type: Boolean,
      default: false
    },
    btnLoading: { // 控制确定按钮的加载状态
      type: Boolean,
      default: false
    },
    size: { // 表单尺寸
      type: String,
      default: 'small'
    },
    viewMode: {
      type: Boolean,
      default: false
    },
    labelWidth: {
      type: String,
      default: '120px'
    }
  },
  data() {
    return {
      hideView: false,
      formModel: null,
      formRules: null,
      formHidden: null,
      formDisabled: null
    }
  },
  methods: {
    showEditor() {
      this.hideView = true
    },
    hideEditor() {
      this.hideView = false
    },
    updateForm: function() {
      let tmpModel = {}
      let tmpRules = {}
      Object.keys(this.formSettings).forEach(item => {
        tmpRules[item] = []
        if (this.formSettings[item].required) {
          tmpRules[item].push({
            required: true,
            message: `请输入${this.formSettings[item]['label']}`
          })
        }
        if (this.formSettings[item].type == 'number') {
          tmpRules[item].push({
            type: this.formSettings[item].type,
            message: `请输入${this.formSettings[item].type}类型的值`
          })
        }
        if (!this.formSettings[item].ignored) {
          if (this.type == 'add') {
            tmpModel[item] = this.formSettings[item].value === undefined ? '' : this.formSettings[item].value
            if (this.formSettings[item].options) {
              this.formSettings[item].options.forEach(option => {
                if (option.default) {
                  tmpModel[item] = option.key
                }
              })
            }
          } else if (this.model) {
            tmpModel[item] = this.model[item]
          }
          if (this.formSettings[item].type == 'switch') {
            tmpModel[item] = Boolean(tmpModel[item])
          }
        }
      })
      this.formModel = tmpModel
      this.formRules = tmpRules
    },
    onSubmit: function() {
      this.$refs.addUpdateForm.validate(valid => {
        if (valid) {
          this.$emit('submit', this.formModel)
        }
      })
    },
    onCancel: function() {
      this.hideView = false
      this.clearValidate()
      this.$emit('cancel')
      if (this.viewMode) {
        this.updateForm()
      }
    },
    clearValidate: function() {
      // this.$refs.addUpdateForm.resetFields()
      this.$refs.addUpdateForm.clearValidate()
    },
    resetFields() {
      this.$refs.addUpdateForm.resetFields()
      this.$refs.addUpdateForm.clearValidate()
    },
    validate() {
      return this.$refs.addUpdateForm.validate()
    }
  },
  mounted() {
    if (this.formSettings) {
      this.updateForm()
    }
  },
  watch: {
    model: function() {
      this.updateForm()
    },
    formSettings: function() {
      this.updateForm()
    }
  }
}

</script>
<style lang="scss">
  .form-generator{
    padding-right: 30px;
    .el-form-item__label{
      color: $color-detail;
    }
  }
</style>
