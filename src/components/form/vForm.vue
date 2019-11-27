<template>
  <div class="v-form" :class="formSettings.length == 1?'v-form--single': 'v-form--multiple'">
    <!-- {{formData}} -->
    <!-- <pre>{{formModel}}</pre> -->
    <!-- <pre>{{uploadCallbacks}}</pre> -->
    <el-form v-if="formModel" ref="vForm" :model="formModel" :rules="formRules" :label-width="labelWidth" :size="size">
      <div class="form-section" v-for="(section, sectionIndex) in formSettings" :key="sectionIndex">
        <h3 class="section-label">{{section.label}}</h3>
        <div class="section-content" v-if="!section.slot">
          <el-form-item v-for="(item, index) in section.items" :key="index" v-show="!item.hidden" :label="item.label" :prop="item.name">
            <!-- 文字输入 -->
            <!--
              append: 文本框后置内容
             -->
            <template v-if="item.type=='text'">
              <el-input v-model.trim="formModel[item.name]" :placeholder="item.placeholder" :disabled="item.disabled" :maxlength="item.maxlength">
                <template v-if="item.append" slot="append">{{item.append}}</template>
              </el-input>
            </template>
            <!-- 车牌号 -->
            <template v-if="item.type=='carNumber'">
              <el-input v-model="formModel[item.name]" :placeholder="item.placeholder" :disabled="item.disabled">
                <el-select v-model="formModel[item.name + '_carNumber']" slot="prepend" placeholder="请选择" style="width:60px">
                  <el-option :label="province" :value="province" v-for="(province, pIndex) in provinceList" :key="pIndex"></el-option>
                </el-select>
              </el-input>
            </template>
            <!-- 密码 -->
            <template v-else-if="item.type=='password'">
              <el-input type="password" v-model="formModel[item.name]" :placeholder="item.placeholder" :disabled="item.disabled"></el-input>
            </template>
            <!-- 数字类型 -->
            <!--
              controls: 是否显示增减按钮
              min: 最小值
              max: 最大值
              disabled: 是否禁用
              append: 文本框后置内容
             -->
            <template v-else-if="item.type=='number'">
              <el-input-number v-model="formModel[item.name]" :placeholder="item.placeholder" :controls="!!item.controls" :min="item.min" :max="item.max" :label="item.label" :disabled="item.disabled" :class="{'number-with-append': item.append}">
                <template v-if="item.append" slot="append">{{item.append}}</template>
              </el-input-number>
            </template>
            <!-- 下拉选择 -->
            <template v-else-if="item.type=='select'">
              <el-select v-model="formModel[item.name]" :placeholder="item.placeholder" :clearable="true" @change="(item.events&&item.events.change)?$emit(item.events.change, formModel[item.name]):null" :disabled="item.disabled" :multiple="!!item.multiple">
                <template v-if="item.options">
                  <el-option v-for="(optionItem, optionIndex) in item.options" :key="optionIndex" :label="optionItem.label" :value="optionItem.value"></el-option>
                </template>
                <template v-else>
                  <el-option label="是" value="1"></el-option>
                  <el-option label="否" value="0"></el-option>
                </template>
              </el-select>
            </template>
            <!-- switch开关 -->
            <template v-else-if="item.type=='switch'">
              <el-switch v-model="formModel[item.name]" :active-color="item.activeColor" :inactive-color="item.inactiveColor" :active-value="item.activeValue" :inactive-value="item.inactiveValue" @change="(item.events&&item.events.change)?$emit(item.events.change, formModel[item.name]):null">
              </el-switch>
            </template>
            <!-- 级联选择器 -->
            <template v-else-if="item.type=='cascader'">
              <el-cascader expand-trigger="hover" :options="item.options" v-model="formModel[item.name]" :clearable="true" :props="item.props"></el-cascader>
            </template>
            <!-- 时间日期范围选择 -->
            <template v-else-if="item.type=='datetimerange'">
              <el-date-picker v-model="formModel[item.name]" type="datetimerange" :default-time="item.defaultTime" align="right" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
              </el-date-picker>
            </template>
            <!-- 日期范围选择 -->
            <template v-else-if="item.type=='daterange'">
              <el-date-picker v-model="formModel[item.name]" type="daterange" align="right" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
              </el-date-picker>
            </template>
            <!-- 日期选择 -->
            <template v-else-if="item.type=='date'">
              <el-date-picker v-model="formModel[item.name]" type="date" :placeholder="item.placeholder || '选择日期'">
              </el-date-picker>
            </template>
            <!-- 日期和时间选择 -->
            <template v-else-if="item.type=='datetime'">
              <el-date-picker v-model="formModel[item.name]" type="datetime" :placeholder="item.placeholder || '选择日期'">
              </el-date-picker>
            </template>
            <!-- 时间范围选择 -->
            <template v-else-if="item.type=='timerange'">
              <el-time-picker is-range v-model="formModel[item.name]" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" :placeholder="item.placeholder || '选择时间范围'">
              </el-time-picker>
            </template>
            <!-- 时间选择 -->
            <template v-else-if="item.type=='time'">
              <el-time-picker v-model="formModel[item.name]" :placeholder="item.placeholder || '选择时间'">
              </el-time-picker>
            </template>
            <!-- 单选 -->
            <template v-else-if="item.type=='radio'">
              <el-radio-group v-model="formModel[item.name]" @change="(item.events&&item.events.change)?$emit(item.events.change, formModel[item.name]):null">
                <el-radio :disabled="item.disabled" v-for="(radioItem, radioIndex) in item.options" :key="radioIndex" :label="radioItem.value">{{radioItem.label}}</el-radio>
              </el-radio-group>
            </template>
            <!-- 多选 -->
            <template v-else-if="item.type=='checkbox'">
              <el-checkbox-group v-model="formModel[item.name]" :min="item.min" :max="item.max" @change="(item.events&&item.events.change)?$emit(item.events.change, formModel[item.name]):null">
                <el-checkbox v-for="(checkItem, checkIndex) in item.options" :key="checkIndex" :label="checkItem.value">{{checkItem.label}}</el-checkbox>
              </el-checkbox-group>
            </template>
            <!-- 文本域 -->
            <template v-else-if="item.type=='textarea'">
              <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" :placeholder="item.placeholder || '请输入内容'" :maxlength="item.maxlength" v-model="formModel[item.name]">
              </el-input>
            </template>
            <!-- 图片上传 -->
            <!--
              limit: 图片上传数量限制
              tip: 提示文字，可以是String或者Array
             -->
            <template v-else-if="item.type=='img'">
              <el-upload class="upload-img" :class="{'has-text-input': item.hasTextInput}" :action="upURL" :file-list="formModel[item.name]" list-type="picture" :multiple="item.multiple" :data="getUploadParam(item.data)" :name="'file'" accept="image/*" :limit="item.limit" :before-upload="beforeUploadCallbacks[item.name]" :on-success="uploadCallbacks[item.name]" :on-preview="handlePreviewImg" :on-remove="removeCallbacks[item.name]" :on-exceed="handelUploadExceed" :on-error="handleUploadError">
                <el-button size="small" type="primary" :disabled="isUploading || !upToken">点击上传</el-button>
                <div class="upload-tip-container" slot="tip">
                  <div class="el-upload__tip" v-if="item.tip && typeof item.tip === 'string'">
                    {{item.tip}}
                    <span v-if="item.limit">({{formModel[item.name].length}}/{{item.limit}})</span>
                  </div>
                  <div class="el-upload__tip" v-else-if="item.tip && item.tip.length">
                    <ul style="line-height: 1.3;">
                      <li v-for="(tipItem, tipIndex) in item.tip" :key="tipIndex">{{tipItem}}</li>
                      <li v-if="item.limit">最多上传{{item.limit}}张({{formModel[item.name].length}}/{{item.limit}})</li>
                    </ul>
                  </div>
                  <!-- 图片描述输入框 -->
                  <div class="upload-text-container" v-if="item.hasTextInput && imgUploadText[item.name].length">
                    <el-input v-for="(uploadTextItem, uploadTextIndex) in imgUploadText[item.name]" :key="uploadTextIndex" v-model="imgUploadText[item.name][uploadTextIndex]" placeholder="输入图片描述"></el-input>
                  </div>
                </div>
              </el-upload>
            </template>
            <!-- 文件上传 -->
            <template v-else-if="item.type=='file'">
              <el-upload class="upload-file" :action="upURL" :file-list="formModel[item.name]" :multiple="item.multiple" :data="getUploadParam(item.data)" :name="'file'" :limit="item.limit" :before-upload="beforeUploadCallbacks[item.name]" :on-success="uploadCallbacks[item.name]" :on-preview="handlePreviewFile" :on-remove="removeCallbacks[item.name]" :on-exceed="handelUploadExceed" :on-error="handleUploadError" :disabled="item.disabled">
                <el-button size="small" type="primary" :disabled="isUploading || !upToken">点击上传</el-button>
                <div slot="tip" class="el-upload__tip" v-if="item.tip">{{item.tip}}
                  <span v-if="item.limit">({{formModel[item.name].length}}/{{item.limit}})</span>
                </div>
              </el-upload>
            </template>
            <!--城市远程搜索-->
            <template v-else-if="item.type=='remoteCity'">
              <website-select v-model="formModel[item.name]" :disabled="item.disabled" type="city" holder="请输入城市" :isShowAll="item.isShowAll" @change="(item.events&&item.events.change)?$emit(item.events.change):null" :integratedValue="!!item.integratedValue"></website-select>
            </template>
            <!-- 本地城市 - 登录时获取的城市数据，设置enableAuth为true带权限功能 -->
            <template v-else-if="item.type=='city'">
              <!--
              multiple: 是否支持多选，默认 false
              clearable: 是否可清空选择，默认 false
              enableAuth: 是否使用城市权限控制，默认 false
              enableOtherCity: 是否带有“其他”选项，默认 false
              enableAllCity: 是否显示“全部”选项（当有该权限时），默认 true
               -->
              <city-select v-model="formModel[item.name]" :placeholder="item.placeholder" :multiple="item.multiple" :clearable="item.clearable" :enableAuth="item.enableAuth" :enableOtherCity="item.enableOtherCity" :enableAllCity="item.enableAllCity" @change="(item.events&&item.events.change)?$emit(item.events.change):null"></city-select>
            </template>
            <!-- slot自定义内容 -->
            <template v-else-if="item.type=='slot'">
              <slot :name="item.name" :model="formModel"></slot>
            </template>
          </el-form-item>
        </div>
        <div class="section-content" v-else>
          <slot :name="section.slot" :model="formModel"></slot>
        </div>
      </div>
      <el-form-item v-if="showButton">
        <el-button class="save-btn" type="primary" @click="onSave" :loading="btnLoading">{{submitName}}</el-button>
        <el-button class="cancel-btn" v-if="showCancel" @click="onCancel">取消</el-button>
      </el-form-item>
      <slot name="bottom-slot"></slot>
    </el-form>
  </div>
</template>
<script>
/*
  formSettings为必填配置项，配置格式如下：
  [{
    label: 'xxx', //；表单区块名
    items: [{
      label: 'xx', // 表单项名
      name: 'xxx', // 字段名
      type: 'xx', // 表单类型（text, select, date, radio, checkbox, cascader, daterange, textarea, img, file, slot...）
      options: [{ // select、radio、checkbox等的选择内容
        label: '...',
        value: '...'
      }]
      value: xx, // 默认值
      valueType: 'xxx', // 值类型，number/string/date/array...
      rule: [{
        validator: validatePass, trigger: 'blur'
      }],
      events: {
        change: 'emitName' // 事件发生时emit指定名的事件
      },
      required: Boolean, // 是否为必填项
      hidden: Boolean, // 是否隐藏该项，隐藏项不会发送数据
      limit: Number, //上传文件时的最大上传限制
      tip: String, // 上传文件时的文字tip
    }]

  }]

  formData为选填项，如传入formDate，则表单会有默认值，格式如下：
  {
    key: value,
    key: value
  }

  slot示例:
  <template slot="location" slot-scope="scope">
    <el-input placeholder="" v-model="scope.model.location">
      <el-button slot="append" icon="el-icon-search"></el-button>
    </el-input>
  </template>
   */
import citySelect from '@/components/city-select'
import websiteSelect from '@/components/website-select'
import Viewer from 'viewerjs'
import { UP_URL, DOWN_URL } from '@/config/base-url'
import { hashCode } from '@/utils/common.js'
export default {
  name: 'vForm',

  props: {
    formSettings: {
      type: Array,
      required: true
    },
    formData: {
      type: Object
    },
    showButton: {
      type: Boolean,
      default: true
    },
    showCancel: {
      type: Boolean,
      default: false
    },
    labelWidth: {
      type: String,
      default: '135px'
    },
    size: {
      type: String,
      default: 'small'
    },
    btnLoading: {
      type: Boolean,
      default: false
    },
    submitName: {
      type: String,
      default: '保存'
    }
  },

  components: {
    websiteSelect,
    citySelect
  },

  data() {
    return {
      imgViewer: null,
      dataOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      formModel: null,
      formRules: null,
      flatFormSettings: null,
      uploadCallbacks: {},
      removeCallbacks: {},
      beforeUploadCallbacks: {},
      upURL: UP_URL,
      upToken: null,
      isUploading: false,
      provinceList: [
        '京',
        '津',
        '冀',
        '晋',
        '蒙',
        '辽',
        '吉',
        '黑',
        '沪',
        '苏',
        '浙',
        '皖',
        '闽',
        '赣',
        '鲁',
        '豫',
        '鄂',
        '湘',
        '粤',
        '桂',
        '琼',
        '川',
        '贵',
        '云',
        '渝',
        '藏',
        '陕',
        '甘',
        '青',
        '宁',
        '新',
        '港',
        '澳',
        '台'
      ]
    }
  },

  mounted() {
    this.updateForm()
    setTimeout(() => {
      if (
        this.flatFormSettings &&
        Object.keys(this.flatFormSettings)
          .map(item => this.flatFormSettings[item])
          .some(item => item.type == 'img' || item.type == 'file')
      ) {
        this.getUpToken()
      }
    }, 100)
  },

  methods: {
    // 获取上传七牛的token
    getUpToken() {
      this.$service
        .getUpToken()
        .then(res => {
          this.upToken = res.data.data.token
          this.formSettings.forEach(setting => {
            setting.items
              .filter(item => item.type == 'img' || item.type == 'file')
              .forEach(file => {
                file.data = file.data || {}
                file.data.token = this.upToken
              })
          })
        })
        .catch(e => {
          this.$message({
            message: '获取上传token失败，将无法上传文件，请重新加载页面',
            type: 'warning'
          })
        })
    },
    // 将数据格式化为上传七牛的参数
    getUploadParam(data) {
      if (!data || typeof data !== 'object') {
        data = {}
      }
      data.token = this.upToken
      data.key = Date.now()
      return data
    },
    // 上传文件超出数量限制回调
    handelUploadExceed(file, fileList) {
      this.$message({
        message: `最多只能上传${fileList.length}个文件`,
        type: 'warning'
      })
    },
    // 更新表单校验规则
    updateRule() {
      let tmpRules = {}
      this.formSettings.forEach(settingItem => {
        settingItem.items.forEach(item => {
          if (!item.hidden && item.required) {
            let ruleMsg = '请输入'
            if (
              item.type === 'radio' ||
              item.type == 'checkbox' ||
              item.type == 'select'
            ) {
              ruleMsg = '请选择'
            }
            tmpRules[item.name] = [
              {
                required: true,
                message: item.defineMessage ? ruleMsg + item.defineMessage : ruleMsg + item.label, // 自定义校验提示
                trigger: 'change'
              }
            ]
            // if (item.type == 'date') {
            //   tmpRules[item.name][0].type = 'date'
            // }
            if (item.type == 'number') {
              tmpRules[item.name][0].type = 'number'
              tmpRules[item.name][0].trigger = 'blur'
            }
            if (item.type == 'carNumber') {
              tmpRules[item.name][0].trigger = 'blur'
            }
            if (item.type == 'date') {
              tmpRules[item.name][0].type = 'date'
            }
            if (item.type == 'daterange') {
              tmpRules[item.name][0].type = 'array'
            }
            if (item.type == 'datetimerange') {
              tmpRules[item.name][0].type = 'array'
            }
            if (this.formModel[item.name] && this.formModel[item.name].push) {
              tmpRules[item.name][0].type = 'array'
            }
            if (item.valueType) {
              tmpRules[item.name][0].type = item.valueType
            }
          }
          if (!item.hidden && item.rule) {
            tmpRules[item.name] = item.rule
          }
        })
      })
      console.log(tmpRules)
      this.formRules = tmpRules
      this.$nextTick(() => {
        this.clearValidate()
      })
    },
    // 更新整个表单
    updateForm(formData) {
      if (this.formSettings) {
        if (!formData) {
          formData = this.formData
        }
        let tmpModel = {}
        let tmpUploadCallback = {}
        let tmpRemoveCallback = {}
        let tmpBeforeUploadCallback = {}
        this.flatFormSettings = {}
        this.formSettings.forEach(settingItem => {
          settingItem.items.forEach(item => {
            this.flatFormSettings[item.name] = item
            if (item.hasTextInput) {
              if (!this.imgUploadText) {
                this.imgUploadText = {}
              }
              if (formData) {
                if (formData[item.name + 'UploadText']) {
                  this.imgUploadText[item.name] =
                    formData[item.name + 'UploadText']
                } else if (formData[item.name]) {
                  this.imgUploadText[item.name] = new Array(
                    formData[item.name].length
                  ).fill('')
                } else {
                  this.imgUploadText[item.name] = []
                }
              } else {
                this.imgUploadText[item.name] = []
              }
            }
            if (formData && formData[item.name] !== undefined) {
              if (
                (item.type == 'date' || item.type == 'time') &&
                !isNaN(formData[item.name])
              ) {
                if (String(formData[item.name]).length == 10) {
                  tmpModel[item.name] = new Date(formData[item.name] * 1000)
                } else {
                  tmpModel[item.name] = new Date(+formData[item.name])
                }
              } else if (item.type == 'switch') {
                if (item.trueValue !== undefined) {
                  tmpModel[item.name] = formData[item.name] === item.trueValue
                } else {
                  tmpModel[item.name] = formData[item.name]
                }
              } else if (
                (item.type == 'daterange' || item.type == 'timerange' || item.type == 'datetimerange') &&
                !isNaN(formData[item.name][0])
              ) {
                if (String(formData[item.name][0]).length == 10) {
                  tmpModel[item.name] = [
                    new Date(formData[item.name][0] * 1000),
                    new Date(formData[item.name][1] * 1000)
                  ]
                } else {
                  tmpModel[item.name] = [
                    new Date(+formData[item.name][0]),
                    new Date(+formData[item.name][1])
                  ]
                }
              } else {
                tmpModel[item.name] = formData[item.name]
              }
            } else {
              if (item.hasOwnProperty('value')) {
                tmpModel[item.name] = item.value
              } else if (item.type == 'checkbox') {
                tmpModel[item.name] = []
              } else if (item.type == 'switch') {
                tmpModel[item.name] = false
              } else if (item.type == 'radio') {
                let index = item.options.findIndex(item => item.default)
                if (index > -1) {
                  tmpModel[item.name] = item.options[index].value
                }
              } else if (item.type == 'cascader') {
                tmpModel[item.name] = []
              } else if (item.type == 'img' || item.type == 'file') {
                tmpModel[item.name] = []
              } else if (item.type == 'slot') {
                tmpModel[item.name] = item.value || ''
              } else if (item.type == 'carNumber') {
                tmpModel[item.name] = item.value || ''
                tmpModel[item.name + '_carNumber'] = item.default || ''
              } else if (item.type == 'number') {
                tmpModel[item.name] = undefined
              } else {
                tmpModel[item.name] = ''
              }
            }

            if (item.type == 'img' || item.type == 'file') {
              tmpUploadCallback[item.name] = (response, file, fileList) => {
                this.handleUploadFile(item.name, response, file, fileList)
              }
              tmpRemoveCallback[item.name] = (file, fileList) => {
                this.handleRemoveFile(item.name, file, fileList)
              }
              tmpBeforeUploadCallback[item.name] = file => {
                return this.handleBeforeUploadFile(item.name, file, item)
              }
            }
          })
        })
        this.formModel = tmpModel
        this.uploadCallbacks = tmpUploadCallback
        this.removeCallbacks = tmpRemoveCallback
        this.beforeUploadCallbacks = tmpBeforeUploadCallback
        this.updateRule()
      }
    },
    // 点击上传后的图片进行预览
    handlePreviewImg(file) {
      if (this.imgViewer && this.imgViewer.destroy) {
        this.imgViewer.destroy()
      }
      let img = document.createElement('img')
      img.src = file.url
      this.imgViewer = new Viewer(img, { transition: false })
      this.imgViewer.show()
    },
    // 点击预览上传的文件
    handlePreviewFile(file) {
      let downloadLink = document.createElement('a')
      downloadLink.download = file.name
      downloadLink.href = file.url
      downloadLink.style.display = 'none'
      document.body.appendChild(downloadLink)
      downloadLink.click()
    },
    // 移除上传文件回调
    handleRemoveFile(name, file, fileList) {
      this.formModel[name].forEach((item, index) => {
        if (file.uid == item.uid) {
          this.formModel[name].splice(index, 1)
          if (this.imgUploadText && this.imgUploadText[name]) {
            this.imgUploadText[name].splice(index, 1)
          }
        }
      })
    },
    // 上传文件成功回调
    handleUploadFile(name, response, file, fileList) {
      this.formModel[name].push({
        name: response.key,
        url: DOWN_URL + response.key
      }) // [{name: xx, url: xx}]
      this.isUploading = false
      if (this.imgUploadText && this.imgUploadText[name]) {
        this.imgUploadText[name].push('')
      }
    },
    // 上传文件失败回调
    handleUploadError(err, file, fileList) {
      this.isUploading = false
    },
    // 上传文件前的判断
    handleBeforeUploadFile(name, file, item) {
      if (!this.flatFormSettings[name].data) {
        this.flatFormSettings[name].data = {}
      }
      if (!item.noRename) {
        this.flatFormSettings[name].data.key =
          this.flatFormSettings[name].data.key +
          String(file.uid).substr(-4) + hashCode(file.name) + '.' + file.name.split('.').pop()
      } else {
        this.flatFormSettings[name].data.key = file.name
      }

      let maxSize = this.flatFormSettings[name].maxSize
      if (maxSize && (maxSize * 1024 < file.size)) {
        this.$message({
          message: `上传图片不能超过${maxSize}k`,
          type: 'warning'
        })
        return false
      } else if (this.isUploading) {
        this.$message({
          message: `一次只能上传一个文件`,
          type: 'warning'
        })
        return false
      } else {
        this.isUploading = true
        return true
      }
    },
    // 获取表单数据
    getFormData() {
      let data = Object.assign({}, this.formModel)
      if (this.flatFormSettings) {
        Object.keys(this.flatFormSettings).forEach(item => {
          let formItem = this.flatFormSettings[item]
          if (formItem.unixTime) {
            if (formItem.type == 'date' || formItem.type == 'time') {
              data[formItem.name] = Math.round(data[formItem.name] / 1000)
            } else if (
              (formItem.type == 'daterange' || formItem.type == 'timerange' || formItem.type == 'datetimerange') &&
              data[formItem.name]
            ) {
              data[formItem.name] = data[formItem.name].map(item => {
                return Math.round(item / 1000)
              })
            }
          }
          if (formItem.type == 'carNumber') {
            data[formItem.name] = (
              data[formItem.name + '_carNumber'] + data[formItem.name]
            ).toUpperCase()
            delete data[formItem.name + '_carNumber']
          }
          if (formItem.type == 'img' && formItem.hasTextInput) {
            data[formItem.name + 'UploadText'] = this.imgUploadText[formItem.name]
          }
        })
      }
      return data
    },
    // 点击保存按钮回调
    onSave() {
      this.$refs.vForm
        .validate()
        .then(res => {
          this.$emit('save', this.getFormData())
        })
        .catch(e => {
          this.$emit('error')
          this.$nextTick(() => {
            this.$el.querySelector('.el-form-item.is-error').scrollIntoView()
          })
        })
    },
    // 修改某一项的值
    setData(name, value) {
      if (!name || this.formModel[name] === undefined) {
        return
      }
      if (this.flatFormSettings[name].type === 'img') {
        if (value && value.map && typeof value[0] === 'string') {
          value = value.map(item => {
            return {
              name: item.split('/').pop(),
              url: item
            }
          })
        }
      }
      this.formModel[name] = value
    },
    // 获取某一项的值
    getData(name) {
      if (name) {
        if (this.flatFormSettings[name].type == 'carNumber') {
          return this.formModel[name + '_carNumber'] + this.formModel[name]
        }
        return this.formModel[name]
      }
      let ret
      this.$refs.vForm
        .validate(valid => {
          if (valid) {
            ret = this.getFormData()
          }
        })
        .catch(err => { })
      return ret
    },
    // 异步获取某一项的值（在表单校验通过的时候resolve）
    getDataAsync(name) {
      return new Promise((resolve, reject) => {
        if (name) {
          return resolve(this.formModel[name])
        }
        this.$refs.vForm
          .validate()
          .then(res => {
            resolve(this.getFormData())
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 点击取消按钮回调
    onCancel() {
      this.$emit('cancel')
      this.resetFields()
    },
    // 重置表单数据
    resetFields() {
      this.$refs.vForm && this.$refs.vForm.resetFields()
    },
    // 清空表单校验
    clearValidate() {
      this.$refs.vForm && this.$refs.vForm.clearValidate()
    },
    // 重置数据并清空校验
    clearForm() {
      this.resetFields()
      this.clearValidate()
    },
    // 修改checkbox和select的options内容
    setItemOptions(name, options) {
      let item = this.flatFormSettings[name]
      if (!item) {
        throw new Error('没有找到该表单项')
      }
      item.options = options
    }
  },
  watch: {
    formSettings() {
      this.updateForm()
    },
    formData() {
      this.updateForm()
    }
  }
}
</script>
<style lang="scss">
.v-form {
  max-width: 800px;
  &.v-form--multiple {
    padding-left: 68px;
    padding-right: 68px;
  }
  &.v-form--single {
    padding-right: 10px;
  }
  .form-section {
    margin-bottom: 30px;
    overflow: hidden;
    border-bottom: 1px solid $color-border;
    padding-bottom: 20px;
    h3 {
      margin-bottom: 20px;
      font-size: 16px;
    }
  }
  .el-form-item__content {
    > .el-select,
    > .el-cascader,
    > .el-date-editor {
      display: block;
      width: 100%;
    }
    .el-date-editor > * {
      vertical-align: top;
    }
  }
  .el-checkbox-group .el-checkbox {
    margin-left: 0;
    margin-right: 30px;
  }
  .upload-img.has-text-input {
    .upload-tip-container {
      position: relative;
      .upload-text-container {
        position: absolute;
        top: 100%;
        width: 100%;
        .el-input {
          margin-top: 94px;
          margin-bottom: 16px;
        }
      }
    }
    .el-upload-list {
      > li {
        margin-bottom: 50px;
        margin-top: 0;
      }
    }
  }
  .number-with-append {
    .el-input {
      display: inline-table;
    }
  }
}
</style>
