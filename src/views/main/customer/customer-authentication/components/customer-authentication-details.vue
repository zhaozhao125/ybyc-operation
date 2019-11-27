<template>
  <div>
    <v-page :visible.sync="visible" :before-close="handleBeforeClose">
      <div class="page-header-container" slot="title">
        <h3>详情</h3>
        <div class="buttons">
          <template v-if="detailData.checkDataStatus === 2">
            <el-button size="small" type="primary" @click="checkedDialogVisible = true" v-if="allChecked && !allPassed">审核不通过</el-button>
            <el-button size="small" type="primary" @click="checkedDialogVisible = true" :disabled="!allChecked" v-else>审核通过</el-button>
          </template>
          <template v-if="detailData.checkDataStatus === 1 && detailData.autoAuditFlag === 1">
            <el-button size="small" type="default" @click="rejectDialogVisible = true" v-if="anyReject">驳回</el-button>
            <el-button size="small" type="default" disabled v-else>驳回</el-button>
          </template>
        </div>
      </div>
      <div v-if="detailData" class="detail-content" slot="content">
        <div class="x-data-detail">
          <div class="x-detail-block">
            <h4 class="x-detail-title">审核图片</h4>
            <el-row :gutter="10">
              <el-col :xs="24" :sm="24" :md="12" v-for="(item,index) in imgList" :key="index">
                <div class="x-detail-item" v-if="item.url">
                  <div class="x-label">{{item.name}}</div>
                  <div class="x-value">
                    <!-- <div style="width:300px;height:300px;"> -->
                    <!-- <vGallary :imgs="[item.url]" :inbox="true"></vGallary> -->
                    <!-- </div> -->
                    <img :src="item.url" @click="viewImg(item.url)" class="img-view">
                    <imgDialog :title="item.name" :name="item.name" :url="[item.url]" :reason="item.reason" :status="item.status" :index="index" :detailData="detailData" :userCheckedImgInfo="userCheckedImgInfo" @getImgInfo="getImgInfo"></imgDialog>
                  </div>
                </div>
                <div class="x-detail-item" v-else-if="detailData.checkDataStatus !== -1 && !item.url" style="height:360px">
                </div>
                <div class="x-detail-item" v-else-if="detailData.checkDataStatus === -1">
                  <div class="x-label">{{item.name}}</div>
                  <div class="x-value">暂无</div>
                </div>
              </el-col>
            </el-row>
          </div>
          <div class="x-detail-block">
            <h4 class="x-detail-title">用户资料</h4>
            <el-row :gutter="10">
              <el-col :xs="24" :sm="12" :md="8">
                <div class="x-detail-item">
                  <div class="x-label">手机号</div>
                  <div class="x-value" v-if="detailData.userPhone">{{detailData.userPhone}}</div>
                  <div class="x-value" v-else>暂无</div>
                </div>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8">
                <div class="x-detail-item">
                  <div class="x-label">真实姓名</div>
                  <div class="x-value" v-if="detailData.userName">{{detailData.userName}}</div>
                  <div class="x-value" v-else>暂无</div>
                </div>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8">
                <div class="x-detail-item">
                  <div class="x-label">身份证号</div>
                  <div class="x-value" v-if="detailData.userIdentityNumber">{{detailData.userIdentityNumber}}</div>
                  <div class="x-value" v-else>暂无</div>
                </div>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8">
                <div class="x-detail-item">
                  <div class="x-label">身份证地址</div>
                  <div class="x-value" v-if="detailData.userIdentityNumberAddress">{{detailData.userIdentityNumberAddress}}</div>
                  <div class="x-value" v-else>暂无</div>
                </div>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8">
                <div class="x-detail-item">
                  <div class="x-label">驾照到期时间</div>
                  <div class="x-value" v-if="detailData.drivingLicenseExpire">{{detailData.drivingLicenseExpire}}</div>
                  <div class="x-value" v-else>暂无</div>
                </div>
              </el-col>
            </el-row>
          </div>
          <div class="x-detail-block">
            <h4 class="x-detail-title">其它审核信息</h4>
            <el-row :gutter="10">
              <el-col :xs="24" :sm="12" :md="8">
                <div class="x-detail-item">
                  <div class="x-label">审核状态</div>
                  <div class="x-value" v-if="detailData.checkDataStatus">{{checkDataStatusText[detailData.checkDataStatus]}}</div>
                  <div class="x-value" v-else>暂无</div>
                </div>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8">
                <div class="x-detail-item">
                  <div class="x-label">审核方式</div>
                  <div class="x-value">
                    <span v-if="detailData.checkDataStatus !== -1">{{detailData.autoAuditFlag === 1 ? "系统审核" : "人工审核"}}</span>
                  </div>
                </div>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8">
                <div class="x-detail-item">
                  <div class="x-label">提交审核时间</div>
                  <div class="x-value" v-if="detailData.userUploadTime">{{detailData.userUploadTime|timeFilter}}</div>
                  <div class="x-value" v-else>暂无</div>
                </div>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8" v-if="detailData.checkDataStatus === 1">
                <div class="x-detail-item">
                  <div class="x-label">审核通过时间</div>
                  <div class="x-value" v-if="detailData.disposeTime">{{detailData.disposeTime|timeFilter}}</div>
                  <div class="x-value" v-else>暂无</div>
                </div>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8">
                <div class="x-detail-item">
                  <div class="x-label">审核人</div>
                  <div class="x-value" v-if="detailData.auditAdminCnName">{{detailData.auditAdminCnName}}</div>
                  <div class="x-value" v-else>暂无</div>
                </div>
              </el-col>
            </el-row>
          </div>
          <div class="x-detail-block">
            <h4 class="x-detail-title">审核备注</h4>
            <el-row :gutter="10">
              <el-col :xs="24" :sm="12" :md="8">
                <div class="x-detail-item">
                  <div class="x-value" v-if="detailData.checkDataReason">{{detailData.checkDataReason}}</div>
                  <div class="x-value" v-else>暂无</div>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
    </v-page>

    <el-dialog title="审核通过" :visible.sync="checkedDialogVisible" width="30%">
      <span>
        <el-input type="textarea" v-model="markedReason" :autosize="{ minRows: 4, maxRows: 5}" clearable></el-input>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="checkedDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleCheckAudit">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="驳回" :visible.sync="rejectDialogVisible" width="30%">
      <span>
        <el-input type="textarea" v-model="markedReason" :autosize="{ minRows: 4, maxRows: 5}" clearable></el-input>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rejectDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleCheckAudit('reject')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import imgDialog from '@/components/img-dialog'
// import vGallary from '@/components/gallery/vGallery'
import imgViewer from '@/components/img-viewer/'
import { handleDate } from '@/utils/date-filter'

export default {
  name: 'v-details',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    detailData: {
      type: Object
    },
    userCheckedImgInfo: {
      type: Object
    }
  },
  components: {
    imgDialog,
    // vGallary
  },
  data() {
    return {
      checkedDialogVisible: false,
      rejectDialogVisible: false,
      imgList: [],
      checkedList: [],
      rejectList: [],
      anyReject: false,
      markedReason: '',
      checkAuditData: {},
      checkDataStatusText: {
        '-1': '未上传资料',
        '0': '审核不通过',
        '1': '审核通过',
        '2': '待审核'
      },
      allPassed: false,
      allChecked: false
    }
  },
  watch: {
    detailData() {
      if (this.userCheckedImgInfo !== null) {
        this.checkAuditData = {}
        this.checkAuditData.checkResIdentityFrontImg = this.userCheckedImgInfo.checkResIdentityFrontImg
        this.checkAuditData.checkResPeopleAndIdentityImg = this.userCheckedImgInfo.checkResPeopleAndIdentityImg
        this.checkAuditData.checkResDrivingLicenceFrontImg = this.userCheckedImgInfo.checkResDrivingLicenceFrontImg
        this.checkAuditData.checkResDrivingLicenceCounterpartImg = this.userCheckedImgInfo.checkResDrivingLicenceCounterpartImg
        this.imgList = [
          {
            name: '身份证正面图片',
            url: this.detailData.identityFrontImg,
            status:
              this.detailData.checkDataStatus === 2 &&
              this.userCheckedImgInfo.checkResIdentityFrontImg === 0
                ? 2
                : this.userCheckedImgInfo.checkResIdentityFrontImg,
            reason: this.userCheckedImgInfo.identityFrontFalseReason
          },
          {
            name: '手持身份证图片',
            url: this.detailData.peopleAndIdentityImg,
            status:
              this.detailData.checkDataStatus === 2 &&
              this.userCheckedImgInfo.checkResPeopleAndIdentityImg === 0
                ? 2
                : this.userCheckedImgInfo.checkResPeopleAndIdentityImg,
            reason: this.userCheckedImgInfo.peopleAndIdentityImgFalseReason
          },
          {
            name: '驾驶证正面图片',
            url: this.detailData.drivingLicenceFrontImg,
            status:
              this.detailData.checkDataStatus === 2 &&
              this.userCheckedImgInfo.checkResDrivingLicenceFrontImg === 0
                ? 2
                : this.userCheckedImgInfo.checkResDrivingLicenceFrontImg,
            reason: this.userCheckedImgInfo.drivingLicenceFrontImgFalseReason
          },
          {
            name: '驾驶证副本图片',
            url: this.detailData.drivingLicenceCounterpartImg,
            status:
              this.detailData.checkDataStatus === 2 &&
              this.userCheckedImgInfo.checkResDrivingLicenceCounterpartImg === 0
                ? 2
                : this.userCheckedImgInfo.checkResDrivingLicenceCounterpartImg,
            reason: this.userCheckedImgInfo
              .drivingLicenceCounterpartImgFalseReason
          }
        ]
      } else {
        if (this.detailData.checkDataStatus === 2) {
          this.imgList = [
            {
              name: '身份证正面图片',
              url: this.detailData.identityFrontImg,
              status: 2
            },
            {
              name: '手持身份证图片',
              url: this.detailData.peopleAndIdentityImg,
              status: 2
            },
            {
              name: '驾驶证正面图片',
              url: this.detailData.drivingLicenceFrontImg,
              status: 2
            },
            {
              name: '驾驶证副本图片',
              url: this.detailData.drivingLicenceCounterpartImg,
              status: 2
            }
          ]
        } else {
          this.checkAuditData = {}
          this.checkAuditData.checkResIdentityFrontImg = 1
          this.checkAuditData.checkResPeopleAndIdentityImg = 1
          this.checkAuditData.checkResDrivingLicenceFrontImg = 1
          this.checkAuditData.checkResDrivingLicenceCounterpartImg = 1
          this.imgList = [
            {
              name: '身份证正面图片',
              url: this.detailData.identityFrontImg,
              status: 1
            },
            {
              name: '手持身份证图片',
              url: this.detailData.peopleAndIdentityImg,
              status: 1
            },
            {
              name: '驾驶证正面图片',
              url: this.detailData.drivingLicenceFrontImg,
              status: 1
            },
            {
              name: '驾驶证副本图片',
              url: this.detailData.drivingLicenceCounterpartImg,
              status: 1
            }
          ]
        }
      }
      // this.imgUrl = this.imgList.map(item => item.url)

      this.allPassed = this.imgList.every(item => item.status === 1)
      this.allChecked = this.imgList.every(item => item.status !== 2)
      console.log(
        'this.allChecked,',
        this.imgList.length,
        this.imgList.map(item => item.status),
        this.imgList.map(item => item.status).join(',')
      )
      console.log(this.imgList, this.allPassed, this.allChecked)
    }
  },
  computed: {
    // allPassed() {
    //   console.log('this.allPassed,', this.imgList.map(item => item.status).join(','))
    //   return this.imgList.every(item => item.status === 1)
    // },
    // allChecked() {
    //   console.log('this.imgList,', this.imgList.map(item => item.status).join(','))
    //   return !this.imgList.some(item => item.status === undefined)
    // }
  },
  methods: {
    handleBeforeClose() {
      this.anyReject = false
      this.$emit('update:visible', false)
      return false
    },
    viewImg(url) {
      imgViewer.viewImg([url])
    },
    getImgInfo(imgInfo, index, name, type) {
      console.log(imgInfo, index, name, type, '++++')
      if (type === 'reject') {
        this.anyReject = true
      }

      if (imgInfo.checkDataStatus === '通过') {
        if (name === '身份证正面图片') {
          this.imgList[0].status = 1
          this.checkAuditData.checkResIdentityFrontImg = 1
          delete this.checkAuditData.identityFrontFalseReason
          this.detailData.userName = imgInfo.userName
          this.detailData.userIdentityNumber = imgInfo.userIdentityNumber
          this.detailData.userIdentityNumberAddress =
            imgInfo.userIdentityNumberAddress
        } else if (name === '手持身份证图片') {
          this.imgList[1].status = 1
          this.checkAuditData.checkResPeopleAndIdentityImg = 1
          delete this.checkAuditData.peopleAndIdentityImgFalseReason
        } else if (name === '驾驶证正面图片') {
          this.imgList[2].status = 1
          this.checkAuditData.checkResDrivingLicenceFrontImg = 1
          delete this.checkAuditData.drivingLicenceFrontImgFalseReason
          this.detailData.drivingLicenseExpire = handleDate(
            imgInfo.drivingLicenseExpire,
            'day'
          )
        } else if (name === '驾驶证副本图片') {
          this.imgList[3].status = 1
          this.checkAuditData.checkResDrivingLicenceCounterpartImg = 1
          delete this.checkAuditData.drivingLicenceCounterpartImgFalseReason
        }

        if (this.checkAuditData.drivingLicenseExpire) {
          console.log(
            'this.checkAuditData.drivingLicenseExpire,',
            this.checkAuditData.drivingLicenseExpire
          )
          this.checkAuditData.drivingLicenseExpire = handleDate(
            this.checkAuditData.drivingLicenseExpire,
            'day'
          )
        }
      } else if (imgInfo.checkDataStatus === '不通过') {
        if (name === '身份证正面图片') {
          this.imgList[0].status = 0
          this.checkAuditData.checkResIdentityFrontImg = 0
          this.checkAuditData.identityFrontFalseReason = imgInfo.checkDataReason
          delete this.checkAuditData.userName
          delete this.checkAuditData.userIdentityNumber
          delete this.checkAuditData.userIdentityNumberAddress
          delete this.detailData.userName
          delete this.detailData.userIdentityNumber
          delete this.detailData.userIdentityNumberAddress
        } else if (name === '手持身份证图片') {
          this.imgList[1].status = 0
          this.checkAuditData.checkResPeopleAndIdentityImg = 0
          this.checkAuditData.peopleAndIdentityImgFalseReason =
            imgInfo.checkDataReason
        } else if (name === '驾驶证正面图片') {
          this.imgList[2].status = 0
          this.checkAuditData.checkResDrivingLicenceFrontImg = 0
          this.checkAuditData.drivingLicenceFrontImgFalseReason =
            imgInfo.checkDataReason
          delete this.checkAuditData.drivingLicenseExpire
          delete this.detailData.drivingLicenseExpire
        } else if (name === '驾驶证副本图片') {
          this.imgList[3].status = 0
          this.checkAuditData.checkResDrivingLicenceCounterpartImg = 0
          this.checkAuditData.drivingLicenceCounterpartImgFalseReason =
            imgInfo.checkDataReason
        }
      }
      this.checkAuditData = Object.assign(this.checkAuditData, imgInfo)
      delete this.checkAuditData.checkDataStatus
      console.log(this.imgList)
      console.log(this.allPassed)

      this.allPassed = this.imgList.every(item => item.status === 1)
      this.allChecked = !this.imgList.some(item => item.status === 2)
    },
    handleCheckAudit(type) {
      let params = {
        // 必填参数
        userId: this.detailData.userId,
        checkDataStatus: '',
        auditAdminName: this.$store.getters.user.username,
        auditAdminCnName: this.$store.getters.user.cnName,
        // 图片详情
        ...this.checkAuditData
      }
      if (this.allPassed) {
        params.checkDataStatus = 1
      } else {
        params.checkDataStatus = 0
      }
      params.checkDataReason = this.markedReason
      params.userIdentityNumber = this.detailData.userIdentityNumber
      params.userName = this.detailData.userName
      params.userIdentityNumberAddress = this.detailData.userIdentityNumberAddress
      params.drivingLicenseExpire = this.detailData.drivingLicenseExpire
      console.log(params)
      if (type === 'reject') {
        delete params.checkResPeopleAndIdentityImg
      }
      this.$service.checkAudit(params).then(res => {
        if (res.data.code === '0') {
          this.$message({ message: '操作成功', type: 'success' })
        }
        if (type === 'reject') {
          this.rejectDialogVisible = false
        } else {
          this.checkedDialogVisible = false
        }
        this.markedReason = ''
        this.$emit('closePage')
      })
    }
  }
}
</script>

<style lang="scss">
.detail-content {
  .img-view {
    width: 300px;
    height: 300px;
    object-fit: cover;
    object-position: center;
    cursor: zoom-in;
  }
}
</style>
