<template>
  <div>
    <v-page :visible.sync="visible" :before-close="handleBeforeClose">
      <div class="page-header-container" slot="title">
        <h3>详情</h3>
        <div class="buttons" v-if="detailData.status == 1">
          <el-button size="small" type="primary" @click="submitForm('imgInfo',2)" >审核通过</el-button>
          <el-button size="small" type="" @click="submitForm('imgInfo',3)">审核不通过</el-button>
        </div>
      </div>
       <div v-if="detailData" class="detail-content" slot="content">
      <!--<div class="detail-content" slot="content">-->
        <div class="x-data-detail">
          <div class="x-detail-block" style="border-bottom:none">
            <el-row :gutter="10">
              <el-col v-for="(item,index) in detailData.imgCheckedList" :key="index">
                <div class="x-detail-item">
                  <div class="x-label">{{item.title}}</div>
                  <div class="x-value" v-if="status === 'unUpload'">暂无</div>
                  <div class="x-value" v-else>
                    <v-gallery v-if="item.url" :imgs="[item.url]" ></v-gallery>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
          <div class="x-detail-block" style="border-bottom:none">
            <el-row :gutter="10">
              <el-col>
                <div class="x-detail-item">
                  <div class="x-label">手机号</div>
                  <div v-if="detailData.userPhone" class="x-value">{{detailData.userPhone}}</div>
                  <div v-else class="x-value">暂无</div>
                </div>
              </el-col>
              <el-col>
                <div class="x-detail-item">
                  <div class="x-label">姓名</div>
                  <div v-if="detailData.userName" class="x-value">{{detailData.userName}}</div>
                  <div v-else class="x-value">暂无</div>
                </div>
              </el-col>
              <el-col>
                <div class="x-detail-item">
                  <div class="x-label">身份证号</div>
                  <div v-if="detailData.userIdentityNumber" class="x-value">{{detailData.userIdentityNumber}}</div>
                  <div v-else class="x-value">暂无</div>
                </div>
              </el-col>
              <el-col>
                <div class="x-detail-item">
                    <div v-if="detailData.expireDate" class="x-label">驾照到期时间</div>
                    <div v-if="detailData.expireDate" class="x-value">{{detailData.expireDate}}</div>
                  <el-form v-else  :model="imgInfo" :rules="rules" ref="imgInfo" label-width="130px" class="demo-ruleForm">
                    <el-form-item label="驾照到期时间：" prop="expireDate">
                      <el-date-picker
                        size="mini"
                        v-model="imgInfo.expireDate"
                        type="date"
                        placeholder="选择日期">
                      </el-date-picker>
                    </el-form-item>
                  </el-form>

                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
    </v-page>

    <el-dialog :title="tittle" :before-close="closeDialog" :visible.sync="dialogVisible" width="30%">
      <span>
        <el-input type="textarea" v-model="imgInfo.remark" :rows="6" clearable></el-input>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import vGallery from "./vGallery";
  import { handleSubmitSearchData } from '@/utils/common.js'
export default {
  name: 'v-details',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    detailData: {
      type: Object,
      required: true
    }
  },
  components: {
    vGallery
  },
  data() {
    return {
      checkedDialogVisible: false,
      status: 'unCheck',
      imgCheckedList: [],
      dialogVisible:false,
      tittle:'审核通过',
      imgInfo: {
        expireDate: '',
        remark:'',
        status:''
      },
      rules: {
        expireDate: [{ required: true, message: '请输入', trigger: 'blur' }]
      }
    }
  },
  methods: {
    submit(){
      let reviceData = {
        "userId": this.detailData.userId,
        "status": this.imgInfo.status,
        "expireDate": this.imgInfo.expireDate,
        "remark": this.imgInfo.remark,
        "modifyId": this.$store.getters.user.userId,
      }
      console.log(reviceData)
      this.$service.driverLicenseReview(reviceData).then(res => {
        if(res.data.code == 0){
          // 关闭页面 并且刷新列表
          this.imgInfo.remark = '';
          this.imgInfo.expireDate = '';
          this.imgInfo.status = '';
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.dialogVisible = false;
          this.$emit('closeAndRefresh');
        }else{
          this.$message.warning(res.data.msg ? res.data.msg : '操作失败')
        }
      })
    },
    submitForm(formName,status) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.imgInfo = handleSubmitSearchData(this.imgInfo)
          this.dialogVisible = true
          this.imgInfo.status = status;
          console.log(this.imgInfo.status)
          if(status == 2){
            this.tittle = '审核通过'
          }else{
            this.tittle = '审核不通过'
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleBeforeClose() {
      this.$emit('update:visible', false)
      this.imgInfo.expireDate = '';
      this.imgInfo.status = '';
      return false
    },
    closeDialog(){
      this.imgInfo.remark = '';
      this.dialogVisible = false;
    }
  }
}
</script>

<style lang="scss">
</style>
