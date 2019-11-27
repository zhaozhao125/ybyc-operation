<template>
  <div>
    <!-- 可增加 x-no-colon 类禁用label后的冒号 -->
    <div class="x-data-detail">
      <div class="x-detail-block">
        <h4 class="x-detail-title">基本信息</h4>
        <el-row :gutter="10">
          <el-col :xs="24" :sm="12" :md="8">
            <div class="x-detail-item">
              <div class="x-label">订单编号</div>
              <div class="x-value">{{baseInformation.snDetail}}</div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <div class="x-detail-item">
              <div class="x-label">订单状态</div>
              <div class="x-value">{{baseInformation.orderStatusName}}</div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <div class="x-detail-item">
              <div class="x-label">结算状态</div>
              <div class="x-value">{{baseInformation.settleStatusName}}</div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <div class="x-detail-item">
              <div class="x-label">下单时间</div>
              <div class="x-value">{{baseInformation.createdTime | timeFilter}}</div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" v-if="baseInformation.payImprestPriceTime ">
            <div class="x-detail-item">
              <div class="x-label">预付款支付时间</div>
              <div class="x-value">{{baseInformation.payImprestPriceTime | timeFilter}}</div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" v-if="baseInformation.payCarDepositPriceTime">
            <div class="x-detail-item" v-if="baseInformation.orderType === 'short'">
              <div class="x-label">押金支付时间</div>
              <div class="x-value">{{baseInformation.payCarDepositPriceTime | timeFilter}}</div>
            </div>
          </el-col>

          <!-- 长租字段：全部费用支付时间 -->
          <el-col :xs="24" :sm="12" :md="8" v-if="baseInformation.payCarDepositPriceTime">
            <div class="x-detail-item" v-if="baseInformation.orderType === 'longRent'">
              <div class="x-label">全部费用支付时间</div>
              <div class="x-value">{{baseInformation.payCarDepositPriceTime | timeFilter}}</div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" v-if="baseInformation.orderStatus === 'cancel'">
            <div class="x-detail-item">
              <div class="x-label">取消时间</div>
              <div class="x-value">{{baseInformation.cancelTime | timeFilter}}</div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" v-if="baseInformation.orderStatus === 'cancel'">
            <div class="x-detail-item">
              <div class="x-label">取消类型</div>
              <div class="x-value">
                {{baseInformation.cancelTypeName}}
                <!-- <span v-if="baseInformation.cancelReasonDescribe">{{baseInformation.cancelReasonDescribe}}</span> -->
                <span v-if="baseInformation.cancelOperatorCn">{{baseInformation.cancelOperatorCn}}({{baseInformation.cancelOperator}})</span>
                </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" v-if="baseInformation.orderStatus === 'cancel'">
            <div class="x-detail-item">
              <div class="x-label">取消原因</div>
              <div class="x-value">{{baseInformation.cancelReasonDescribe}}</div>
            </div>
          </el-col>

          <el-col :xs="24" :sm="12" :md="8" v-if="baseInformation.orderStatus === 'subscribed' ||  baseInformation.orderStatus === 'cancel'">
            <div class="x-detail-item">
              <div class="x-label">预计取车时间</div>
              <div class="x-value">
                 <editInput :name="drivingLicenseExpire" :value="baseInformation.expectTakeTime" type="datetime" @updateVal="updateCustomer" v-if="baseInformation.orderStatus === 'subscribed' && $_has(authority.resetTime)"></editInput>
                <span v-else>{{baseInformation.expectTakeTime}}</span>
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" v-if="baseInformation.orderStatus === 'returned' || baseInformation.orderStatus==='finished' || baseInformation.orderStatus==='rent'">
            <div class="x-detail-item">
              <div class="x-label">取车时间</div>
              <div class="x-value">{{baseInformation.actualTakeTime | timeFilter}}</div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" v-if="baseInformation.orderStatus === 'returned' || baseInformation.orderStatus==='finished'">
            <div class="x-detail-item">
              <div class="x-label">还车时间</div>
              <div class="x-value">
                {{baseInformation.actualReturnTime | timeFilter}} &nbsp&nbsp
                <span v-if="baseInformation.orderStatus === 'returned' && baseInformation.settleStatus === 'unsettle'" style="color: #F56C6C">{{   (baseInformation.actualReturnTime - baseInformation.rentReturnTime) | timeHours}}</span>
                </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" v-if="baseInformation.orderStatus === 'cancel' || baseInformation.orderStatus==='finished' || baseInformation.settleStatus === 'settled'" >
            <div class="x-detail-item">
              <div class="x-label">结算时间</div>
              <div class="x-value">{{baseInformation.settleTime | timeFilter}}</div>
            </div>
          </el-col>

          <el-col :xs="24" :sm="12" :md="8" v-if="baseInformation.orderStatus === 'rent' ">
            <div class="x-detail-item">
              <div class="x-label">租期还车时间</div>
              <div class="x-value">{{baseInformation.rentReturnTime | timeFilter}}</div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" v-if=" baseInformation.orderStatus==='finished'">
            <div class="x-detail-item">
              <div class="x-label">完成时间</div>
              <div class="x-value">{{baseInformation.finishTime | timeFilter}}</div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <div class="x-detail-item">
              <div class="x-label">取车网点</div>
              <div class="x-value">{{baseInformation.takeStationName}}</div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8"  v-if="baseInformation.orderStatus === 'returned' || baseInformation.orderStatus==='finished'">
            <div class="x-detail-item">
              <div class="x-label">还车网点</div>
              <div class="x-value">{{baseInformation.returnStationName}}</div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" >
            <div class="x-detail-item">
              <div class="x-label">业务员</div>
              <div class="x-value">
                 <editInput :name="salesman" :value="baseInformation.salesman" type="text" @updateVal="updateSalesman" v-if="(baseInformation.orderStatus === 'subscribed' ||  baseInformation.orderStatus === 'rent') && $_has(authority.resetSalesmans)"></editInput>
                 <span v-else>{{salesmans}}</span>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
import dayjs from 'dayjs'
import editInput from '@/components/edit-input'
import { handleDate } from '@/utils/date-filter'
export default {
  data () {
    return {
      infor: {},
      drivingLicenseExpire: 'drivingLicenseExpire',
      salesman: 'salesman'
    }
  },
  computed: {
    salesmans: function () {
      if (this.baseInformation) {
        if (this.baseInformation.salesman) {
          return this.baseInformation.salesman
        } else {
          return '暂无'
        }
      }
    }
  },
  mounted () {
    // if (this.baseInformation) {
    //   if (this.baseInformation.salesman) {
    //     console.log(this.baseInformation.salesman)
    //   } else {
    //     this.baseInformation.salesman = '暂无'
    //   }
    // }
  },
  filters: {
    timeHours: function (value) {
      let hours = Math.floor(Math.abs(value) / (60 * 60 * 1000))
      if (value >= 4 * 60 * 60 * 1000) {
        return `逾期还车${hours}小时`
      } else if (value < -24 * 60 * 60 * 1000) {
        return `提前还车${hours}小时`
      } else {
        return '租期内还车'
      }
    }
  },
  components: {
    editInput
  },
  methods: {
    updateCustomer(name, updateVal) {
      if (Date.parse(updateVal) < Date.parse(new Date())) {
        this.$message.warning('预计取车时间不能小于当前时间！')
      } else {
        let params = {
          orderSn: this.baseInformation.sn,
          operatorUserName: this.$store.state.user.username,
          operatorCnName: this.$store.state.user.cnName,
          modifiedTime: dayjs(Date.parse(updateVal)).format('YYYY-MM-DD HH:mm:ss')
        }
        this.$service.resetTime(params).then((res) => {
          this.$message.success('预计取车时间修改成功！')
          this.$emit('on-resetTime')
        }).catch((res) => {
        })
      }
    },
    updateSalesman(name, updateVal) {
      let params = {
        orderSn: this.baseInformation.sn,
        salesman: updateVal,
        operatorUserName: this.$store.state.user.username,
        operatorCnName: this.$store.state.user.cnName
      }
      this.$service.updateSaleman(params).then((res) => {
        this.$message.success('修改成功！')
        this.$emit('on-resetTime')
      }).catch((res) => {
      })
    }
  },
  props: {
    baseInformation: {
      default: {},
      type: Object
    },
    authority: {
      default: {},
      type: Object
    }
  }
}
</script>
