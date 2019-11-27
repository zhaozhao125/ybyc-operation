<template>
  <el-popover placement="bottom" :width="isCarInfo?350:200" trigger="click" class="pop-switch" ref="poper">
    <span slot="reference">
      <el-switch v-model="switchVal" active-color="#13ce66" inactive-color="#dcdfe6">
      </el-switch>
      <div class="switch-hover" @click="handleChangeSwitch"></div>
    </span>
    <template v-if="isCarInfo">
      <div v-if="rowData.onSwitch&&showCarInfo" style="margin-bottom:10px">
        <i class="el-icon-warning" style="color:red;margin-right:5px;"></i>
        <span>车辆禁用后，车辆将从APP端下线，确定禁用？</span>
      </div>
      <div v-else-if="!rowData.onSwitch&&showWebsite">
        <el-form class="validate-site" label-position='top-start' :rules="siteRules" ref="siteRuleForm" :model="ruleForm">
          <el-form-item label='选择网点' prop="selectPlace">
            <website-select v-model="ruleForm.selectPlace" placeholder="请输入网点名称" isRequest @selectItemId="getWebSiteId"></website-select>
          </el-form-item>
        </el-form>
      </div>
    </template>
    <p>{{text}}</p>
    <div style="text-align: right; margin: 0">
      <el-button size="mini" type="text" @click="handleCancel">取消</el-button>
      <el-button type="primary" size="mini" @click="handleConfirm">{{rowData&&rowData.onSwitch?'禁用':'确定'}}</el-button>
    </div>
  </el-popover>
</template>
<script>
import websiteSelect from '@/components/website-select'
export default {
  components: {
    websiteSelect
  },
  name: 'pop-switch',

  props: {
    aaa: Boolean,
    rowData: Object,
    isCarInfo: {
      type: Boolean,
      default: false
    },
    value: {
      default: false
    },
    map: {
      type: Object
    },
    trueText: {
      type: String,
      default: ''
    },
    falseText: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      showCarInfo: null,
      showWebsite: true, // 是否显示网点标志位
      switchVal: false,
      text: '',
      webiteId: null,
      listData: [],
      siteRules: {
        selectPlace: [
          {
            required: true,
            message: '请输入网点名称',
            trigger: 'blur,change'
          }
        ]
      },
      ruleForm: {
        selectPlace: ''
      }
    }
  },

  methods: {
    // 点击遮罩触发事件
    handleChangeSwitch() {
      this.showCarInfo = true
      this.showWebsite = true
      this.ruleForm.selectPlace = ''
    },
    // 拿到网点id
    getWebSiteId(websiteId) {
      this.webiteId = websiteId
    },
    handleCancel() {
      this.$emit('cancel')
      this.$refs.poper.showPopper = false
    },
    handleConfirm() {
      if (this.isCarInfo) {
        if (this.rowData && this.rowData.onSwitch) {
          this.$service
            .post_carInforDisable(this.rowData.carSn)
            .then(res => {
              this.success()
              // 隐藏选择网点提示
              this.showWebsite = false
            })
            .catch(() => {
              this.error()
            })
        } else {
          this.$refs.siteRuleForm.validate(valid => {
            if (valid) {
              // 发送接口
              this.$service
                .post_InfoEnable(this.rowData.carSn, this.webiteId)
                .then(res => {
                  this.success()
                  // 隐藏禁用提示
                  this.showCarInfo = false
                })
                .catch(() => {
                  this.error()
                })
            } else {
              return false
            }
          })
        }
      } else {
        this.$emit('confirm')
        this.$refs.poper.showPopper = false
      }
    },
    success(msg = '') {
      if (msg) {
        console.dir(msg)
        this.$message.success(msg)
      } else {
        this.rowData.onSwitch = !this.rowData.onSwitch
        this.$message.success(this.rowData.onSwitch ? '车辆启用成功' : '车辆禁用成功')
      }

      this.$refs.poper.showPopper = false
      this.$emit('refreshTable')
    },
    error(error = '') {
      if (error) {
        this.$message.warning(error)
      } else {
        this.$message.warning('当前状态必须为空闲')
      }
      this.$refs.poper.showPopper = false
    }
  },

  mounted() {
    if (this.map) {
      this.switchVal = this.map[this.value]
    } else {
      this.switchVal = this.value
    }
    if (this.switchVal) {
      this.text = this.trueText
    } else {
      this.text = this.falseText
    }
  },

  watch: {
    value(newVal) {
      if (this.map) {
        this.switchVal = this.map[this.value]
      } else {
        this.switchVal = this.value
      }
      if (this.switchVal) {
        this.text = this.trueText
      } else {
        this.text = this.falseText
      }
    }
  }
}
</script>
<style lang="scss">
.pop-switch {
  position: relative;
  display: inline-block;
  .switch-hover {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
  }
}
</style>
