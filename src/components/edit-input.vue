<template>
  <div class="define_input">
    <div v-show="!showInput">
      <span v-if="type==='select' && (value == 0 || value)">{{value==0?'不免':'免'}}</span>
      <span v-else-if="(type==='defineSelect' || type === 'networkLocation') && (value == 0 || value)"><span>{{showValue}}</span></span>
       <span v-else-if="value && (typeof value === 'object')">{{value|timeFilter}}</span>
      <span v-else-if="value">{{value}}</span>
      <span v-else>暂无</span>
      <el-button
        type="text"
        @click="handleUpdate"
      >修改</el-button>
    </div>
    <div
      v-show="showInput"
      class="show-input"
    >
      <el-form
        :inline="true"
        :model="formInput"
        :rules="rulesInput"
        ref="formInput"
      >

        <el-form-item
          prop="updataVal"
          v-if="type==='text'"
        >
          <el-input
            size="mini"
            v-model.trim="formInput.updataVal"
            placeholder="请输入"
            style="min-width:165px"
          ></el-input>
        </el-form-item>

        <el-form-item
          prop="updataVal"
          v-if="type==='phoneNum'"
        >
          <el-input
            size="mini"
            v-model.trim="formInput.updataVal"
            placeholder="请输入"
          ></el-input>
        </el-form-item>

        <el-form-item
          prop="updataVal"
          v-if="type==='select'"
        >
          <el-select
            size="mini"
            v-model="formInput.updataVal"
            placeholder="请选择"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <!-- 自定义下拉框 -->
        <el-form-item
          prop="updataVal"
          v-if="type==='defineSelect'"
        >
          <el-select
            size="mini"
            v-model="formInput.updataVal"
            placeholder="请选择"
          >
            <el-option
              v-for="item in defineOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <!-- 城市下拉框 -->
        <el-form-item
          prop="updataVal"
          v-if="type==='citySelect'"
        >
          <div class="select-content">
            <span class="select-website-item define_webset">
              <search-select
                v-model="formInput.updataVal"
                type="city"
                placeholder="请选择"
                :isShowAll=false
                @selectItemId='getSelectItemId'
              ></search-select>
              <!-- <search-select v-model="formInput.updataVal" placeholder="请输入网点名称" isRequest @selectItemId='getSelectItemId'></search-select> -->
            </span>
          </div>
        </el-form-item>
        <el-form-item
          prop="updataVal"
          v-if="type==='networkLocation'"
        >
          <div class="select-content">
            <span class="select-website-item define_webset">
              <search-select
                v-model="formInput.updataVal"
                placeholder="请输入网点名称"
                isRequest
                @selectItemId='getSelectItemId'
                ref="websiteSelectionNames"
              ></search-select>
            </span>
          </div>
        </el-form-item>
        <el-form-item
          prop="updataVal"
          v-if="type==='role'"
        >
          <website-select
            size="mini"
            v-model="formInput.updataVal"
            integratedValue
            type="role"
          ></website-select>
        </el-form-item>

        <el-form-item
          prop="updataVal"
          v-if="type==='date'"
        >
          <el-date-picker
            size="mini"
            v-model="formInput.updataVal"
            type="date"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item
          prop="updataVal"
          v-if="type==='datetime'"
        >
          <el-date-picker
            size="mini"
            v-model="formInput.updataVal"
            type="datetime"
            placeholder="选择日期"
            :picker-options="pickerOptionsBefore"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button
            type="text"
            @click="handleSubmit('formInput')"
          >确定</el-button>
          <el-button
            type="text"
            @click="handleCancel"
          >取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import websiteSelect from '@/components/website-select'
import searchSelect from '@/components/website-select'
export default {
  name: 'edit-input',
  components: {
    websiteSelect,
    searchSelect
  },
  props: {
    name: {
      type: String,
      default: ''
    },
    value: {
      default: ''
    },
    type: {
      type: String,
      default: ''
    },
    showValue: {
      type: String,
      default: ''
    },
    defineOptions: Array
  },
  data() {
    var checkPhoneNum = (rule, value, callback) => {
      var numreg = /^[1][1-9][0-9]{9}$/
      if (!value) {
        return callback(new Error('不能为空'))
      }
      setTimeout(() => {
        if (!Number.isInteger(Number(value))) {
          callback(new Error('请输入数字'))
        } else {
          if (!numreg.test(value)) {
            callback(new Error('请输入11位手机号码'))
          } else {
            callback()
          }
        }
      }, 1000)
    }
    var checkOther = (rule, value, callback) => {
      if (value === '' || value === null) {
        console.log('不能为空')
        return callback(new Error('不能为空'))
      }
      callback()
    }
    return {
      showInput: false,
      formInput: {
        updataVal: ''
      },
      rulesInput: {
        updataVal: [
          {
            validator: this.type === 'phoneNum' ? checkPhoneNum : checkOther,
            trigger: 'change'
          }
        ]
      },
      options: [
        {
          value: 1,
          label: '免'
        },
        {
          value: 0,
          label: '不免'
        }
      ],
      roles: [],
      pickerOptionsBefore: {
        disabledDate(time) {
          return time.getTime() < Date.now()
        }
      }
    }
  },
  methods: {
    getSelectItemId() {
    },
    handleUpdate() {
      this.showInput = true
      this.formInput.updataVal = this.value
      console.log(this.value)
      // this.$nextTick(() => {
      //   document.body.onclick = () => {
      //     console.log(event.target.tagName)
      //     if (event.target.tagName !== 'INPUT' && event.target.tagName !== 'SPAN') {
      //       this.handleCancel()
      //     }
      //   }
      // })
    },
    handleSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.value !== this.formInput.updataVal) {
            this.showInput = false
            this.$emit('updateVal', this.name, this.formInput.updataVal)
          } else {
            this.showInput = false
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleCancel() {
      this.showInput = false
      // document.body.onclick = null
    }
  }
}
</script>
<style lang="scss" >
.define_input {
  .define_webset {
    .el-select {
      input {
        height: 28px;
      }
    }
  }
}
</style>
