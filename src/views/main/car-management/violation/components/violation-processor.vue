<template>
  <div class="violation-processor">
    <!-- {{type}} -->
    <el-dialog title="受理" v-if="type == 'accept'" :visible.sync="visible" :width="dialogWidth" :before-close="handleBeforeClose">
      <el-form ref="acceptForm" :model="acceptForm" label-width="120px" size="small">
        <el-form-item label="选择处理方式" prop="processMethod">
          <el-radio-group v-model="acceptForm.processMethod">
            <el-radio :label="1">公司代办</el-radio>
            <el-radio :label="2">用户自行处理</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="acceptForm.processMethod==1" label="扣除押金" prop="deposit" :rules="numberRules">
          <el-input v-model="acceptForm.deposit"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSubmitAccept" :loading="formLoading">确定</el-button>
          <el-button @click="handleCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="处理完成" v-if="type == 'finish'" :visible.sync="visible" :width="dialogWidth" :before-close="handleBeforeClose">
      <v-form ref="finishForm" :formSettings="finishFormSettings" showCancel :btnLoading="formLoading" @save="handleFinishSubmit" @cancel="handleCancel"></v-form>
    </el-dialog>
    <el-dialog title="强制扣款" v-if="type == 'force'" :visible.sync="visible" :width="dialogWidth" :before-close="handleBeforeClose">
      <v-form ref="forceForm" :formSettings="forceFormSettings" showCancel :btnLoading="formLoading" @save="handleForceSubmit" @cancel="handleCancel"></v-form>
    </el-dialog>
    <el-dialog title="审核" v-if="type == 'audit'" :visible.sync="visible" :width="dialogWidth" :before-close="handleBeforeClose">
      <el-form ref="auditForm" label-width="80px" class="" size="small">
        <el-form-item label="凭证：" prop="deposit">
          <v-gallery :imgs="auditData.imgList"></v-gallery>
        </el-form-item>
        <el-form-item label="备注：" prop="processMethod">
          {{auditData.comment}}
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleAuditApprove" :loading="formLoading">审核通过</el-button>
          <el-button @click="handleAuditReject">驳回</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="查看凭证" v-if="type == 'voucher'" :visible.sync="visible" :width="dialogWidth" :before-close="handleBeforeClose">
      <el-form ref="voucherForm" label-width="80px" size="small">
        <el-form-item label="凭证：" prop="deposit">
          <v-gallery v-if="data.voucherImage" :imgs="[data.voucherImage]"></v-gallery>
          <span v-else>无凭证</span>
        </el-form-item>
        <el-form-item label="备注：" prop="processMethod">
          {{data.remark}}
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleCancel">确定</el-button>
          <!-- <el-button @click="handleCancel">取消</el-button> -->
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="信息备注" v-if="type == 'comment'" :visible.sync="visible" :width="dialogWidth" :before-close="handleBeforeClose">
      <el-form ref="commentForm" :model="commentForm" label-width="80px" size="small">
        <el-form-item label="备注" prop="comment">
          <el-input type="textarea" :autosize="{ minRows: 5, maxRows: 10}" placeholder="请输入备注" v-model="commentForm.comment">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSubmitComment" :loading="formLoading">确定</el-button>
          <el-button @click="handleCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import vGallery from '@/components/gallery/vGallery'
let numberRules = [{
  required: true,
  message: '此项不能为空',
  trigger: 'change'
}, {
  validator(rule, value, callback) {
    if (isNaN(value)) {
      return callback(new Error('必须填数值类型'))
    }
    callback()
  },
  trigger: 'change'
}]
export default {

  name: 'violation-processor',

  props: {
    data: {
      required: true
    },
    type: {
      type: String,
      required: true
    },
    visible: {
      type: Boolean,
      required: true,
      default: false
    }
  },

  components: {
    vGallery
  },

  data() {
    return {
      formLoading: false,
      dialogWidth: '500px',
      acceptForm: {
        processMethod: 1,
        deposit: ''
      },
      imgViewer: null,
      upToken: '',
      finishFormSettings: [{
        items: [{
          label: '上传凭证',
          name: 'voucherImage',
          type: 'img',
          tip: '只能上传一张图片',
          limit: 1,
          required: true
        }, {
          label: '备注',
          name: 'remark',
          type: 'textarea',
          placeholder: '请输入处理备注',
          required: true
        }]
      }],
      forceFormSettings: [{
        items: [{
          label: '扣除押金',
          name: 'reduceDeposit',
          type: 'text',
          rule: numberRules,
          required: true
        }, {
          label: '上传凭证',
          name: 'voucherImage',
          type: 'img',
          tip: '只能上传一张图片',
          limit: 1,
          required: true
        }, {
          label: '备注',
          name: 'remark',
          type: 'textarea',
          placeholder: '请输入处理备注',
          required: true
        }]
      }],
      commentForm: {
        comment: this.data?this.data.remark : ''
      },
      numberRules: numberRules
    }
  },

  watch: {
    data(){
      this.commentForm.comment = this.data?this.data.remark : ''
    }
  },

  mounted() {
    this.getUpToken()
  },

  computed: {
    currentId() {
      return this.data.id
    }
  },

  methods: {
    getUpToken() {
      this.$service.getUpToken().then(res => {
        this.upToken = res.data.data
      })
    },
    handleCancel() {
      this.$refs[this.type + 'Form'].resetFields()
      this.$emit('update:visible', false)
    },
    handleBeforeClose() {
      this.$emit('update:visible', false)
      return
    },
    dealViolation(type, params = {}) {
      params.id = this.currentId
      this.$service.dealViolation(type, params).then(res => {
        this.$emit('success')
        this.$message({
          message: '保存成功',
          type: 'success'
        })
        this.$refs[this.type + 'Form'].resetFields()
        this.formLoading = false
        this.$emit('update:visible', false)
      }).then(res => {
        this.formLoading = false
      }).catch(err => {
        this.formLoading = false
      })
    },
    // >>>>>>>>>>>受理>>>>>>>>>>>>>
    handleSubmitAccept() {
      this.$refs.acceptForm.validate(valid => {
        if (valid) {
          this.formLoading = true
          if (this.acceptForm.processMethod == 1) {
            // 公司处理
            this.dealViolation('companyDeal', {
              reduceDeposit: this.acceptForm.deposit
            })
          } else if (this.acceptForm.processMethod == 2) {
            // 用户处理
            this.dealViolation('consumerDeal')
          }
        }
      })
    },
    // >>>>>>>>>>>处理完成>>>>>>>>>>>>>
    handleFinishSubmit(data) {
      this.formLoading = true
      // 公司处理完成
      this.dealViolation('companyFinish', {
        voucherImage: data.voucherImage[0].url,
        remark: data.remark
      })
    },
    // >>>>>>>>>>>强制扣款>>>>>>>>>>>>>
    handleForceSubmit(data) {
      this.formLoading = true
      this.dealViolation('forceReduceMoney', {
        voucherImage: data.voucherImage[0].url,
        remark: data.remark,
        reduceDeposit: data.reduceDeposit
      })
    },
    // >>>>>>>>>>>审核>>>>>>>>>>>>> 
    handleAuditApprove() {
      this.formLoading = true
      this.dealViolation('verifyConsumerCommitSuc')
    },
    handleAuditReject() {
      this.formLoading = true
      this.dealViolation('verifyConsumerCommitErr')
    },
    // >>>>>>>>>>>备注>>>>>>>>>>>>> 
    handleSubmitComment() {
      this.formLoading = true
      this.dealViolation('remark', {
        remark: this.commentForm.comment
      })
    }
  },

  destroyed() {
    if (this.imgViewer && this.imgViewer.destroy) {
      this.imgViewer.destroy()
    }
  }
}

</script>
<style lang="scss">
.violation-processor {
  .el-form {
    padding-right: 30px;
    padding-bottom: 22px;
  }
}

</style>
