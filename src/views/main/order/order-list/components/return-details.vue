<template>
  <v-page :visible.sync="visible" :before-close="handleBeforeClose">
    <h3 slot="title">还车
      <el-button class="refresh-return-details" type="primary" size="small" @click="handleDetails(currentStationId)">刷新
      </el-button>
    </h3>
    <template slot="content">
      <div class="return-details" v-if="detailData">
        <detail-basic :detailSettings='returnDetailSettings' :data="detailData" :labelWidth="labelWidth">
          <!--车辆信息-->
          <template slot="carNumber" slot-scope="scope">
            {{detailData.carNumber}}
            <span class="online" v-if="detailData.isOnline == true">在线</span>
            <span class="outline" v-else-if="detailData.isOnline == false">离线</span>
          </template>
          <template slot="onMinutePrice" slot-scope="scope">
            <div>
              行驶单价{{detailData.onMinutePrice}}元/分钟 , 停车单价{{detailData.offMinutePrice}}元/分钟
            </div>
            <div>
              日封顶{{detailData.dayMaxPrice}}元 , 跨城服务费单价{{detailData.cityServicePrice}}元/公里
            </div>
          </template>

          <!--计费信息-->
          <template slot="dayMoneyTotal" slot-scope="scope">
            {{detailData.dayMoneyTotal}}元（{{detailData.dayTimes}}天）
          </template>
          <template slot="onMoneyTodayTotal" slot-scope="scope">
            {{detailData.onMoneyTodayTotal}}元（{{detailData.onMinuteTodayTotal}}分钟）
          </template>
          <template slot="offMoneyTodayTotal" slot-scope="scope">
            {{detailData.offMoneyTodayTotal}}元（{{detailData.offMinuteTodayTotal}}分钟）
          </template>
          <template slot="noDeductiblesPrice" slot-scope="scope">
            <span v-if="detailData.noDeductiblesPrice || detailData.noDeductiblesPrice === 0 || detailData.noDeductiblesPrice === null">
              {{detailData.noDeductiblesPrice === null ? '0' : detailData.noDeductiblesPrice}}元
            </span>
          </template>
          <template slot="citySuburbanMoney" slot-scope="scope">
            <span v-if="detailData.citySuburbanMoney || detailData.citySuburbanMoney === 0 || detailData.citySuburbanMoney === null">
              {{detailData.citySuburbanMoney === null ? '0' : detailData.citySuburbanMoney}}元
            </span>
          </template>
          <template slot="cityCrossMoney" slot-scope="scope">
            {{detailData.cityCrossMoney}}元（{{detailData.cityCrossMileage}}公里）
          </template>
          <template slot="orderTotalMoney" slot-scope="scope">
            {{detailData.orderTotalMoney}}元
          </template>

          <!--用户信息-->
          <template slot="currentUserMoneyTotal" slot-scope="scope">
            <span class="balance">
              {{detailData.currentUserMoneyTotal}}元
            </span>
          </template>
        </detail-basic>

        <!--还车设置-->
        <div class="detail-block">
          <h4 class="h3-title">还车设置</h4>
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="return-form" size="small">

            <el-form-item label="还车网点" prop="currentStationName" class="return-detail-item">
              <span class="no-station-detection" v-if="currentStationName">
                {{currentStationName}}
                <span v-if="currentStationType === 'contract'">(合作网点)</span>
                <span v-else-if="currentStationType === 'casual'">(百步亭)</span>
              </span>
              <span class="no-station-detection" v-else>未检测到网点</span>
              <el-button type="text" size="small" @click="handleShowStations()">设置还车网点</el-button>
            </el-form-item>

            <el-form-item label="应付金额" class="return-detail-item">
              <span class="need-money">
                {{detailData.needPayMoney}}元
              </span>
            </el-form-item>

            <el-form-item label="还车原因" prop="backReturnReason" class="return-form-item">
              <el-select v-model="ruleForm.backReturnReason" placeholder="请选择还车原因" style="width: 450px;">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="备注" prop="remark" class="return-form-item">
              <el-input type="textarea" style="width: 450px;" v-model="ruleForm.remark"></el-input>
            </el-form-item>

            <el-form-item>
              <div style="margin-left: 10px">
                <el-button type="primary" @click="submitForm('ruleForm')" v-if="currentStationId">提交</el-button>
                <el-button type="primary" disabled v-else>提交</el-button>
              </div>
            </el-form-item>
          </el-form>
        </div>

        <!--选择还车网点-->
        <searchStation ref="searchStation" :visible.sync="stationVisible" :carNumber="carNumber" :currentCityId="currentCityId" :rentType="rentType" @confirm="handleSelectStation"></searchStation>
      </div>
    </template>
  </v-page>
</template>

<script>
import detailBasic from '@/components/detail/v-detail'
import { returnDetailSettings } from './detailSettings'
import { handleSubmitSearchData } from '@/utils/common.js'
import paginationMixin from '@/mixins/pagination.js'
import searchStation from '@/components/search-station/'
import vPage from '@/components/page'

export default {
  name: 'car-return-details',
  components: {
    vPage,
    detailBasic,
    searchStation
  },
  mixins: [paginationMixin],
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    orderSn: {
      type: String
    }
  },
  data() {
    return {
      labelWidth: 150,
      detailData: null,
      pageSize: 10,
      stationVisible: false,
      carNumber: null,
      currentCityId: null,
      currentStationId: null,
      currentStationName: null,
      currentStationType: null,
      rentType: 1,
      returnDetailSettings: returnDetailSettings,
      tableData: [],
      couponsMount: null,
      radio: '',
      multipleSelection: [],
      options: [
        {
          value: '定位不准',
          label: '定位不准'
        },
        {
          value: '车辆无响应',
          label: '车辆无响应'
        },
        {
          value: '网点爆仓',
          label: '网点爆仓'
        },
        {
          value: '车辆离线',
          label: '车辆离线'
        },
        {
          value: '电源未关闭',
          label: '电源未关闭'
        },
        {
          value: '站点边缘/围栏区域小',
          label: '站点边缘/围栏区域小'
        },
        {
          value: '其他（选择其他项备注原因）',
          label: '其他（选择其他项备注原因）'
        }
      ],
      ruleForm: {
        backReturnReason: '',
        remark: ''
      },
      rules: {
        backReturnReason: [{ required: true, message: '请选择原因', trigger: 'change' }]
      },
      userCouponsId: null,
      returnCarParams: null
    }
  },
  computed: {
    user() {
      return this.$store.getters.user
    }
  },

  watch: {
    visible(val) {
      if (val) {
        // isInitial:true 是否初始加载
        this.handleDetails(null, true)
      }
    }
  },
  methods: {
    handleBeforeClose() {
      this.$emit('update:visible', false)
      this.ruleForm.backReturnReason = ''
      this.ruleForm.remark = ''
    },
    handleDetails(nowStationId, isInitial) {
      let params = handleSubmitSearchData({
        orderSn: this.orderSn,
        nowStationId: nowStationId
      })
      this.$service
        .orderReturnDetails(params)
        .then(res => {
          if (res.data.data) {
            this.detailData = res.data.data
            this.carNumber = this.detailData.carNumber
            this.currentCityId = this.detailData.cityId
            if (isInitial) {
              this.currentStationId = res.data.data.currentStationId
              this.currentStationName = res.data.data.currentStationName
              this.currentStationType = res.data.data.currentStationType
            }
          }
        })
        .catch(e => {
          this.$emit('update:visible', false)
        })
    },
    // 选择网点
    handleSelectStation(data) {
      console.log(data)
      this.currentStationName = data.name
      this.currentStationType = data.type
      this.currentStationId = data.id
      this.handleDetails(data.id)
    },

    handleShowStations() {
      this.stationVisible = true
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.returnCarParams = handleSubmitSearchData({
            force: 'false',
            uid: this.detailData.userId,
            orderSn: this.detailData.sn,
            returnStationId: this.currentStationId,
            operatorUserName: this.user.username,
            operatorCnName: this.user.cnName,
            ...this.ruleForm
          })
          if (this.returnCarParams) {
            this.handleReturnCar()
          }
        } else {
          return false
        }
      })
    },

    handleReturnCar(type) {
      if (type === 'force') {
        this.returnCarParams.force = 'true'
      } else {
        this.returnCarParams.force = 'false'
      }
      this.$service
        .orderReturnCar(this.returnCarParams)
        .then(res => {
          this.templateVisible = false
          this.$message.success(res.data.msg)
          if (type === 'force') {
            let codeCopy = res.data.data.carCode.slice(0, 2)
            if (codeCopy === '51') {
              let carNumber = this.detailData.carNumber
              this.$emit('closePage', carNumber)
            } else {
              this.$emit('closePage')
            }
          } else {
            this.$emit('closePage')
          }
        })
        .catch(error => {
          let codeCopy = error.code.slice(0, 2)
          if (codeCopy === '51') {
            this.openError51(error)
          } else {
            this.$message.warning(error.code + '  ' + error.msg)
          }
        })
    },

    openError51(error) {
      this.$confirm(
        '请先确认车辆已拉手刹、熄火、车门车窗已关闭。如果仍无法还车，可以选择强制还车。确定强制还车?',
        error.code + '  ' + error.msg,
        {
          confirmButtonText: '强制还车',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }
      ).then(() => {
        let type = 'force'
        this.handleReturnCar(type)
      })
    }
  }
}
</script>

<style lang="scss">
.return-details {
  .online {
    margin-left: 20px;
    color: $color-green;
  }
  .outline {
    margin-left: 20px;
  }
  .balance {
    color: $color-red;
  }
  .h3-title {
    margin-top: 10px;
    margin-bottom: 5px;
  }
  .return-form {
    margin-left: 100px;

    .return-detail-item {
      margin-bottom: 0;
    }

    .return-form-item {
      margin-top: 9px;
      margin-bottom: 18px;
    }

    .el-form-item__label {
      color: #99a9bf;
      margin-left: 11px;
      font-size: 15px;
    }
    .el-form-item__label:after {
      content: '：';
    }

    .no-station-detection {
      margin-right: 10px;
    }

    .outline,
    .no-station-detection,
    .discount-description {
      color: $color-red;
    }

    .no-discount-description {
      color: $color-gray;
    }

    .need-money {
      font-size: 18px;
      color: $color-red;
    }
  }
  #coupons-dialog {
    .el-radio__label {
      visibility: hidden;
    }
  }
  .el-dialog__footer {
    text-align: center;
    margin-top: 20px;
  }
}
</style>
