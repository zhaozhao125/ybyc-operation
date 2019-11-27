<template>
  <div class="company-detail" v-if="detailData.companyMoneyDTO">
    <v-page :visible.sync="visible" :before-close="closeMe">
      <div class="page-header-container" slot="title">
        <h3>企业详情</h3>
        <div class="buttons">
          <span class="active-status" style="margin-right:10px">
            <span style="font-size: 14px">启用状态</span>
            <popSwitch v-model="isActive" trueText="确定禁用吗？禁用后企业各项权益将无法使用，请谨慎操作。" falseText="确定要启用该企业吗？" @confirm="handleSwitch(isActive)" @cancel="handleCancelSwitch"></popSwitch>
          </span>
          <el-button size="small" type="default" @click="handleEditCompany">编辑</el-button>
        </div>
      </div>
      <div class="x-data-detail" slot="content" v-if="detailData">
        <div class="x-detail-block">
          <h4 class="x-detail-title">基本信息</h4>
          <el-row :gutter="10" type="flex">
            <el-col :xs="24" :sm="12" :md="8">
              <div class="x-detail-item">
                <div class="x-label">企业名称</div>
                <div class="x-value">{{detailData.name}}</div>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8">
              <div class="x-detail-item">
                <div class="x-label">城市</div>
                <div class="x-value">{{detailData.cityName}}</div>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8">
              <div class="x-detail-item">
                <div class="x-label">联系电话</div>
                <div class="x-value">{{detailData.phone}}</div>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8">
              <div class="x-detail-item">
                <div class="x-label">紧急联系人</div>
                <div class="x-value" v-if="detailData.emergencyContactName">{{detailData.emergencyContactName}}</div>
                <div class="x-value" v-else>暂无</div>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8">
              <div class="x-detail-item">
                <div class="x-label">紧急联系人电话</div>
                <div class="x-value" v-if="detailData.emergencyContactPhone">{{detailData.emergencyContactPhone}}</div>
                <div class="x-value" v-else>暂无</div>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8">
              <div class="x-detail-item">
                <div class="x-label">员工应交保证金金额</div>
                <div class="x-value">{{detailData.timeShareRentDeposit}}元</div>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8">
              <div class="x-detail-item">
                <div class="x-label">身份证正面照片</div>
                <div class="x-value" v-if="detailData.legalPersonIdentityFrontImg">
                  <v-gallery :imgs="[detailData.legalPersonIdentityFrontImg]"></v-gallery>
                </div>
                <div class="x-value" v-else>暂无</div>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8">
              <div class="x-detail-item">
                <div class="x-label">营业执照</div>
                <div class="x-value">
                  <v-gallery :imgs="[detailData.businessLicenceImg]"></v-gallery>
                </div>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8">
              <div class="x-detail-item">
                <div class="x-label">合同照片</div>
                <div class="x-value">
                  <v-gallery :imgs="detailData.contracts"></v-gallery>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="x-detail-block">
          <h4 class="x-detail-title">当前余额</h4>
          <el-row :gutter="10" type="flex">
            <el-col :xs="24" :sm="12" :md="8">
              <div class="x-detail-item">
                <div class="x-label">充值余额</div>
                <div class="x-value">{{detailData.companyMoneyDTO.companyMoney}}元</div>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8">
              <div class="x-detail-item">
                <div class="x-label">赠送余额</div>
                <div class="x-value">{{detailData.companyMoneyDTO.companyMoneyPresentation}}元</div>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8">
              <div class="x-detail-item">
                <div>
                  <el-button size="small" v-has="'showCharge'" @click="handleShowCharge">充值</el-button>
                  <el-button size="small" v-has="'showRefund'" @click="handleShowRefund">退款</el-button>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="x-detail-block">
          <h4 class="x-detail-title">财务信息</h4>
          <el-row :gutter="10" type="flex">
            <el-col :xs="24" :sm="12" :md="8">
              <div class="x-detail-item">
                <div class="x-label">银行类别</div>
                <div class="x-value">{{detailData.bankCategory}}</div>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8">
              <div class="x-detail-item">
                <div class="x-label">开户行</div>
                <div class="x-value">{{detailData.bankDeposit}}</div>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8">
              <div class="x-detail-item">
                <div class="x-label">开户人</div>
                <div class="x-value">{{detailData.bankAccountHolder}}</div>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8">
              <div class="x-detail-item">
                <div class="x-label">银行账号</div>
                <div class="x-value">{{detailData.bankAccountNo}}</div>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8">
              <div class="x-detail-item">
                <div class="x-label">统一社会信用代码</div>
                <div class="x-value">{{detailData.uniformSocialCreditCode}}</div>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="x-detail-block">
          <h4 class="x-detail-title">业务信息</h4>
          <el-row :gutter="10" type="flex">
            <el-col :xs="24" :sm="12" :md="8">
              <div class="x-detail-item">
                <div class="x-label">企业开发人</div>
                <div class="x-value">{{detailData.bizMan}}</div>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8">
              <div class="x-detail-item">
                <div class="x-label">企业开发人电话</div>
                <div class="x-value">{{detailData.bizManPhone}}</div>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="x-detail-block">
          <h4 class="x-detail-title">其他信息</h4>
          <el-row :gutter="10" type="flex">
            <el-col :xs="24" :sm="12" :md="8">
              <div class="x-detail-item">
                <div class="x-label">创建人</div>
                <div class="x-value">{{detailData.createdByName}}({{detailData.createdBy}})</div>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8">
              <div class="x-detail-item">
                <div class="x-label">创建时间</div>
                <div class="x-value">{{detailData.createdTime/1000 |timeFilter}}</div>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8">
              <div class="x-detail-item">
                <div class="x-label">最后修改人</div>
                <div class="x-value">{{detailData.modifiedByName}}({{detailData.modifiedBy}})</div>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8">
              <div class="x-detail-item">
                <div class="x-label">最后修改时间</div>
                <div class="x-value">{{detailData.modifiedTime/1000 |timeFilter}}</div>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </v-page>
    <el-dialog title="充值" :visible.sync="chargeVisible" width="500px">
      <v-form ref="chargeForm" :formSettings="chargeFormSettings" :showButton="false" @save="handleCharge"></v-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="chargeVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="handleSubmitCharge">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="退款" :visible.sync="refundVisible" width="500px">
      <v-form ref="refundForm" :formSettings="refundFormSettings" :showButton="false" @save="handleRefund"></v-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="refundVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="handleSubmitRefund">确 定</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>
import vGallery from '@/components/gallery/vGallery'
import popSwitch from '@/components/pop-switch'
export default {
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

  components: {
    vGallery,
    popSwitch
  },

  data() {
    let validateNum = (rule, value, callback) => {
      if (value < 0) {
        return callback(new Error('输入值需大于0'))
      }
      callback()
    }
    return {
      detailData: {},
      formData: {},
      isActive: false,
      chargeVisible: false,
      chargeFormSettings: [
        {
          label: '',
          items: [
            {
              label: '充值余额',
              type: 'number',
              name: 'amount',
              controls: false,
              append: '元',
              rule: [{
                validator: validateNum, trigger: 'blur'
              }],
              events: {
                change: 'emitName'
              }
            },
            {
              label: '赠送余额',
              type: 'number',
              name: 'amountPresentation',
              controls: false,
              append: '元',
              rule: [{
                validator: validateNum, trigger: 'blur'
              }]
            },
            {
              label: '支付方式',
              name: 'paymentType',
              type: 'select',
              options: [
                {
                  label: '公对公转账',
                  value: 'b2bBankTransfer'
                }
              ],
              value: 'b2bBankTransfer'
            },
            {
              label: '凭证',
              type: 'img',
              name: 'evidenceImgs',
              limit: 1,
              tip: '只能上传一张图片'
            },
            {
              label: '备注',
              type: 'textarea',
              name: 'adminNote'
            }
          ]
        }
      ],
      refundVisible: false,
      refundFormSettings: [
        {
          label: '',
          items: [
            {
              label: '充值余额',
              type: 'number',
              name: 'amount',
              controls: false,
              append: '元',
              rule: [{
                validator: validateNum, trigger: 'blur'
              }]
            },
            {
              label: '赠送余额',
              type: 'number',
              name: 'amountPresentation',
              controls: false,
              append: '元',
              rule: [{
                validator: validateNum, trigger: 'blur'
              }]
            },
            {
              label: '凭证',
              type: 'img',
              name: 'evidenceImgs',
              limit: 1,
              tip: '只能上传一张图片'
            },
            {
              label: '备注',
              type: 'textarea',
              name: 'adminNote'
            }
          ]
        }
      ]
    }
  },

  watch: {
    visible(val) {
      if (val) {
        console.log(this.sn)
        this.getDetail(this.sn)
      }
    },
    chargeVisible(val) {
      if (!val) {
        this.$refs.chargeForm.resetFields()
      }
    },
    refundVisible(val) {
      if (!val) {
        this.$refs.refundForm.resetFields()
      }
    }
  },
  methods: {
    closeMe() {
      this.$emit('update:visible', false)
      this.$emit('close')
      return false
    },
    getDetail(sn) {
      if (sn !== '') {
        this.$service.companyDetails({ sn: sn }).then(res => {
          this.detailData = res.data.data
          this.isActive = res.data.data.opened
          this.formData = this.detailData
        })
      }
    },
    handleSwitch(active) {
      if (this.sn !== '') {
        if (active) {
          this.$service.companyClosed({ sn: this.sn }).then(res => {
            if (res.data.code == '0') {
              this.isActive = !active
              this.$message({
                message: res.data.msg,
                type: 'success'
              })
            }
          })
        } else {
          this.$service.companyOpened({ sn: this.sn }).then(res => {
            if (res.data.code == '0') {
              this.isActive = !active
              this.$message({
                message: res.data.msg,
                type: 'success'
              })
            }
          })
        }
      }
    },
    handleCancelSwitch() {},
    handleEditCompany() {
      this.$emit('edit', this.formData)
    },
    handleShowCharge() {
      this.chargeVisible = true
    },
    handleShowRefund() {
      this.refundVisible = true
    },
    handleSubmitCharge() {
      this.$refs.chargeForm.onSave()
    },
    handleCharge(data) {
      console.log('====data====', data)
      data.companySn = this.sn
      if (data.evidenceImgs.length !== 0) {
        data.evidenceImgs = data.evidenceImgs[0].url
      } else {
        data.evidenceImgs = ''
      }
      if (data.amount || data.amountPresentation) {
        this.$service.companyCharge(data).then(res => {
          if (res.data.code == '0') {
            this.$message({
              message: '充值成功',
              type: 'success'
            })
            this.chargeVisible = false
            this.getDetail(this.sn)
          }
        })
      } else {
        this.$message({
          message: '充值余额和赠送余额至少一项大于0',
          type: 'warning'
        })
      }
    },
    handleSubmitRefund() {
      this.$refs.refundForm.onSave()
    },
    handleRefund(data) {
      console.log('====data====', data)
      data.companySn = this.sn
      if (data.evidenceImgs.length !== 0) {
        data.evidenceImgs = data.evidenceImgs[0].url
      } else {
        data.evidenceImgs = ''
      }
      if (data.amount || data.amountPresentation) {
        this.$service.companyRefund(data).then(res => {
          if (res.data.code == '0') {
            this.$message({
              message: '退款成功',
              type: 'success'
            })
            this.refundVisible = false
            this.getDetail(this.sn)
          }
        })
      } else {
        this.$message({
          message: '充值余额和赠送余额至少一项大于0',
          type: 'warning'
        })
      }
    }
  }
}
</script>

<style lang="scss">
</style>
