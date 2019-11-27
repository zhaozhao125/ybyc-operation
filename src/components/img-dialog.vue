<template>
  <div>
    <div class="img-status">
      <span v-if="(status === 1 && userCheckedImgInfo !== null)|| imgInfo.checkDataStatus ==='通过'">
        <i class="el-icon-success" style="color:#67C23A"></i> 通过
      </span>
      <span v-else-if="(status === 0 && detailData.checkDataStatus !== 2)|| imgInfo.checkDataStatus ==='不通过'">
        <i class="el-icon-error" style="color:#F56C6C"></i> 不通过
      </span>
      <span v-else></span>
      <div class="img-btn">
        <el-button type="text" @click="imgDialogVisible = true" v-if="detailData.checkDataStatus === 1 && detailData.autoAuditFlag === 1">驳回</el-button>
        <el-button type="text" @click="imgDialogVisible = true" v-else-if="detailData.checkDataStatus === 2">审核</el-button>
      </div>

      <div v-if="detailData.checkDataStatus === 0" style="height:15px">{{reason}}</div>
      <!-- <div style="height:15px">{{imgInfo.checkDataStatus}}{{detailData.checkDataStatus}}{{status}}</div> -->
    </div>

    <!-- 图片弹框 -->
    <el-dialog :title="title" :visible.sync="imgDialogVisible" width="800px" append-to-body :before-close="handleBeforeClose">
      <div class="img-container">
        <vGallary :imgs="url" :inbox="true"></vGallary>
      </div>
      <el-form :model="imgInfo" :rules="rules" ref="imgInfo" label-width="110px" class="demo-ruleForm">
        <!-- 驳回弹框 -->
        <template v-if="detailData.checkDataStatus === 1 && detailData.autoAuditFlag === 1">
          <template v-if="name === '身份证正面图片'">
            <el-form-item label="真实姓名">
              {{detailData.userName}}
            </el-form-item>
            <el-form-item label="身份证号">
              {{detailData.userIdentityNumber}}
            </el-form-item>
            <el-form-item label="身份证地址">
              {{detailData.userIdentityNumberAddress}}
            </el-form-item>
          </template>
          <template v-if="name === '驾驶证正面图片'">
            <el-form-item label="驾照到期时间">
              {{detailData.drivingLicenseExpire}}
            </el-form-item>
          </template>
          <el-form-item label="原因" prop="checkDataReason">
            <el-select v-model="imgInfo.checkDataReason" placeholder="请选择原因">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('imgInfo','reject')">驳回</el-button>
          </el-form-item>
        </template>
        <!-- 审核弹框 -->
        <template v-else-if="detailData.checkDataStatus === 2">
          <el-form-item label="是否通过" prop="checkDataStatus">
            <el-radio-group v-model="imgInfo.checkDataStatus">
              <el-radio label="通过"></el-radio>
              <el-radio label="不通过"></el-radio>
            </el-radio-group>
          </el-form-item>
          <template v-if="imgInfo.checkDataStatus === '不通过'">
            <el-form-item label="原因" prop="checkDataReason">
              <el-select v-model="imgInfo.checkDataReason" placeholder="请选择原因">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </template>
          <template v-if="imgInfo.checkDataStatus === '通过'">
            <template v-if="name === '身份证正面图片'">
              <el-form-item label="真实姓名" prop="userName">
                <el-input v-model="imgInfo.userName"></el-input>
              </el-form-item>
              <el-form-item label="身份证号" prop="userIdentityNumber">
                <el-input v-model="imgInfo.userIdentityNumber"></el-input>
              </el-form-item>
              <el-form-item label="身份证地址" prop="userIdentityNumberAddress">
                <el-input v-model="imgInfo.userIdentityNumberAddress"></el-input>
              </el-form-item>
            </template>
            <template v-if="name === '驾驶证正面图片'">
              <el-form-item label="驾照到期时间" prop="drivingLicenseExpire">
                <el-date-picker v-model="imgInfo.drivingLicenseExpire" type="date" placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
            </template>
          </template>
          <el-form-item>
            <el-button type="primary" @click="submitForm('imgInfo')">提交</el-button>
          </el-form-item>
        </template>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import vGallary from '@/components/gallery/vGallery'
import { handleSubmitSearchData } from '@/utils/common.js'

export default {
  name: 'edit-input',
  components: {
    vGallary
  },
  props: {
    index: {
      type: Number
    },
    title: {
      type: String,
      default: ''
    },
    url: {
      type: String,
      default: ''
    },
    status: {
      type: Number,
      default: null
    },
    reason: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    detailData: {
      type: Object
    },
    userCheckedImgInfo: {
      type: Object
    }
  },
  data() {
    return {
      imgDialogVisible: false,
      imgInfo: {
        checkDataStatus: this.getStatus(),
        checkDataReason: '',
        userName: '',
        userIdentityNumber: '',
        userIdentityNumberAddress: '',
        drivingLicenseExpire: ''
      },
      options: [
        {
          value: '图片不清晰',
          label: '图片不清晰'
        },
        {
          value: '图片不完整',
          label: '图片不完整'
        },
        {
          value: '身份证地址',
          label: '身份证地址'
        },
        {
          value: '未上传有效信息',
          label: '未上传有效信息'
        }
      ],
      rules: {
        checkDataStatus: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        checkDataReason: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        userName: [{ required: true, message: '请输入', trigger: 'blur' }],
        userIdentityNumber: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        drivingLicenseExpire: [
          { required: true, message: '请输入', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    getStatus() {
      if (this.detailData.checkDataStatus === 1) {
        return '通过'
      }
    },
    handleBeforeClose(done) {
      if (this.detailData.checkDataStatus === 2) {
        this.imgInfo = {}
      }
      done()
    },
    submitForm(formName, type) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (type === 'reject') {
            this.imgInfo.checkDataStatus = '不通过'
          }
          this.imgInfo = handleSubmitSearchData(this.imgInfo)
          this.$emit('getImgInfo', this.imgInfo, this.index, this.name, type)
          this.$message({
            message: this.imgInfo.checkDataStatus,
            type: 'success'
          })
          this.imgDialogVisible = false
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
.img-status {
  width: 300px;
  min-height: 20px;
  .img-btn {
    float: right;
  }
}
.img-container {
  width: 700px;
  height: 400px;
  margin: 0 auto 20px;
}
</style>
