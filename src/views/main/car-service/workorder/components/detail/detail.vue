<template>
  <div class="workorder-detail">
    <v-page :visible.sync="visible" :before-close="handleBeforeClose">
      <div class="page-header-container" slot="title">
        <h3>工单内容</h3>
        <div class="buttons">
          <template v-if="taskStatus=='待分发' && distributeType=='指派'">
            <el-button v-has="'workOrderAssign'" size="small" type="primary" @click="handleAssign('assign')">指派</el-button>
            <el-button v-has="'workOrderChangeToGrab'" size="small" type="default" @click="handleChangeToGrab">改为抢单</el-button>
            <el-button v-has="'workOrderClose'" size="small" type="default" @click="handleClose">关闭工单</el-button>
          </template>
          <template v-else-if="taskStatus=='待分发'">
            <el-button v-has="'workOrderClose'" size="small" type="primary" @click="handleClose">关闭工单</el-button>
          </template>
          <template v-else-if="taskStatus=='待处理'">
            <el-button v-if="distributeType=='指派' && $_has('workOrderReassign')" size="small" type="primary" @click="handleAssign('reassign')">改派</el-button>
            <el-button v-has="'workOrderClose'" size="small" type="default" @click="handleClose">关闭工单</el-button>
            <el-button v-has="'workOrderForceFinish'" size="small" type="danger" @click="handleShowForceFinish">强制交车</el-button>
          </template>
          <template v-else-if="taskStatus=='待验证'">
            <el-button v-has="'workOrderCheckPass'" size="small" type="primary" @click="handleShowPass">验收通过</el-button>
            <el-button v-has="'workOrderReject'" size="small" type="default" @click="handleShowReject">驳回</el-button>
            <el-button v-has="'workOrderClose'" size="small" type="default" @click="handleClose">关闭工单</el-button>
            <el-button size="small" type="default" @click="handleViewNext">查看下一条待验证工单</el-button>
          </template>
          <template v-else-if="taskStatus=='已完成'">
            <el-button size="small" type="default" @click="handleViewNext">查看下一条待验证工单</el-button>
          </template>
          <el-button v-if="taskTypeCode=='inspection'" size="small" type="default" :disabled="!detailData.inspectionRecord" @click="handleViewInspectionRecord">查看巡检记录</el-button>
          <el-button size="small" type="default" v-if="taskTypeCode=='charge_car' && relationTaskSn" @click = "relationOrder">查看关联调度单</el-button>
          <el-button size="small" type="default" v-if="taskTypeCode=='dispatch_car' && relationTaskSn" @click = "relationOrder">查看关联充电单</el-button>
          <el-button size="small" type="primary" @click="getDetail">刷新</el-button>
          <!-- <el-button size="small" type="primary" v-else-if="taskStatus=='已完成'">查看下一条待验收工单</el-button> -->
        </div>
      </div>
      <div v-if="detailData" class="detail-content" slot="content">
        <v-detail :detailSettings="detailSettings" :data="detailData">
          <div slot="taskType" slot-scope="scope">
            {{scope.data.taskType}}
            <!-- <span v-if="scope.data.latestTaskTime">（{{scope.data.latestTaskTime}}）</span> -->
            <span v-if = "scope.data.latestTaskTime || scope.data.orderNumber >=0">
              <span>（</span>
              <span v-if = "scope.data.latestTaskTime">距上次{{scope.data.taskType}}{{scope.data.latestTaskTime}}  </span>
              <span v-if = "scope.data.orderNumber >= 0"> 已产生订单{{scope.data.orderNumber}} </span>
              <span>）</span>
              </span>
          </div>
          <div slot="relationChargeOrderSn" slot-scope="scope">
            <el-button type = "text" @click="toChargeOrder(scope.data.relationChargeOrderSn)" style = "line-height: 0px">{{scope.data.relationChargeOrderSn}}</el-button>
          </div>
          <div slot="exception" slot-scope="scope">
            <span v-if="scope.data.exception" style = "color: #f04134">是</span>
            <span v-else>否</span>
          </div>
          <div class="distribute-type" slot="distributeType" slot-scope="scope">
            {{scope.data.distributeType}}
            <span v-if="scope.data.totalTimes">已通知{{scope.data.totalTimes}}人</span>
          </div>
          <template class="" slot="carNumber" slot-scope="scope">
            <el-tooltip effect="dark" content="点击查看实时定位" placement="top" v-if="scope.data.taskStatus=='待验证'">
              <el-button style="padding:0" type="text" @click="handleJumpToLocation(scope.data.carInfo.carNumber, scope.data.carInfo.carSn)">{{scope.data.carInfo.carNumber}}</el-button>
            </el-tooltip>
            <span v-else>{{scope.data.carInfo.carNumber}}</span>
          </template>
          <template class="" slot="executorUserName" slot-scope="scope">
            <el-button style="padding:0" type="text" @click="handleJumpToOpuser(scope.data.executorUserSn)">{{scope.data.executorUserName}}</el-button>
          </template>
          <template class="" slot="startStationName" slot-scope="scope">
            <!-- <el-button style="padding:0" type="text" @click="handleJumpToOpuser(scope.data.executorUserSn)">{{scope.data.executorUserName}}</el-button> -->
            <span>{{scope.data.startStationName}}
              <span v-if = "scope.data.startStationType ===  'casual'">（百步亭）</span>
              <span v-if = "scope.data.parkingCharge && scope.data.startStationType ===  'casual' && scope.data.taskTypeCode === 'dispatch_car'">停车费  {{scope.data.parkingCharge}}元</span>
            </span>
          </template>
        </v-detail>
        <div class="handle-process" v-if="detailData && detailData.records && detailData.records.length">
          <h4>处理进度</h4>
          <el-table :data="detailData.records" style="width: 100%">
            <el-table-column label="时间" min-width="150">
              <template slot-scope="scope">
                {{scope.row.createTime|timeFilter}}
              </template>
            </el-table-column>
            <el-table-column prop="operateUserName" label="操作人" min-width="150">
            </el-table-column>
            <el-table-column prop="msg" label="事件">
            </el-table-column>
            <el-table-column label="操作" min-width="110">
              <template slot-scope="scope">
                <el-button type="text" @click="handleShowRemark(scope.row)" v-if="scope.row.recordType == 'commit_vouchers'">查看凭证</el-button>
                <el-button type="text" @click="handleShowRemark(scope.row)" v-if="scope.row.recordType == 'verify_err'">查看驳回备注</el-button>
                <el-button type="text" @click="handleShowRemark(scope.row)" v-if="scope.row.recordType == 'verify_pass'">查看验收备注</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </v-page>
    <assignList :visible.sync="assignVisible" :sn="sn" :title="assignTitle" @success="handleAssignSuccess"></assignList>
    <acceptForm :visible.sync="acceptFormVisible" :sn="sn" :carSn="carSn" :carNumber="carNumber" :maintainDistanceM = "maintainDistanceM" @success="getDetail" ref="acceptForm"  :taskType = "taskType"></acceptForm>
    <close-infor :visible.sync="closeInforVisible" :sn="sn" :carSn="carSn" :carNumber="carNumber" @success="getDetail" :handeCloseType="handeCloseType" v-if = "closeInforVisible"></close-infor>
    <el-dialog title="驳回" width="500px" :visible.sync="verifyRejectVisible">
      <el-form label-width="100px">
        <el-form-item label="请输入备注">
          <el-input type="textarea" v-model="rejectRemark" :rows="4"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button @click="handleCancelReject" :disabled="loading">取消</el-button>
          <el-button type="primary" @click="handleConfirmReject" :loading="loading">确认</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <remark :visible.sync="remarkVisible" :remarkData="remarkData"></remark>
    <el-dialog title="强制交车" :visible.sync="forceFinishVisible" width="420px">
      <div class="confirm-wrapper">
        <i class="el-icon-warning"></i>
        <p>请确认车辆已拉手刹、熄火，车门、车窗已关闭。
          <br/>确定强制交车？</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="handleForceFinish('forceAndFinish')">强制完成</el-button>
        <el-button size="small" type="primary" @click="handleForceFinish('force')">强制关闭</el-button>
        <el-button size="small" @click="forceFinishVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <selectStation :visible.sync="stationVisible" :loading="closeLoading" @confirm="handleConfirmClose"></selectStation>
  </div>
</template>
<script>
import vDetail from '@/components/detail/v-detail'
import detailSettings from './detailSettings.js'
import assignList from '../assign-list.vue'
import acceptForm from '../accept-form.vue'
import closeInfor from '../close-infor.vue'
import remark from './remark.vue'
import selectStation from '../select-station.vue'
export default {

  props: {
    visible: {
      type: Boolean,
      default: false
    },
    sn: {
      type: String,
      required: true
    },
    startStationId: {
      type: Number,
      required: true
    }
  },

  components: {
    vDetail,
    assignList,
    acceptForm,
    remark,
    selectStation,
    closeInfor
  },

  data() {
    return {
      detailSettings,
      detailData: null,
      assignVisible: false,
      assignTitle: '指派',
      acceptFormVisible: false,
      verifyRejectVisible: false,
      rejectRemark: '',
      loading: false,
      carSn: null,
      carNumber: null,
      remarkData: null,
      remarkVisible: false,
      forceFinishVisible: false,
      stationVisible: false,
      closeLoading: false,
      currentCloseType: 'simple',

      handeCloseType: 'simple',
      closeInforVisible: false,
      maintainDistanceM: null,
      taskType: ''
    }
  },

  computed: {
    taskStatus() {
      if (!this.detailData) {
        return ''
      }
      return this.detailData.taskStatus
    },
    taskTypeCode() {
      if (!this.detailData) {
        return ''
      }
      return this.detailData.taskTypeCode
    },
    relationTaskSn () {
      if (!this.detailData) {
        return ''
      }
      return this.detailData.relationTaskSn
    },
    distributeType() {
      if (!this.detailData) {
        return ''
      }
      return this.detailData.distributeType
    }
  },
  // watch: {
  //   sn (val) {
  //     console.log(val)
  //   }
  // },
  methods: {
    // 查看关联工单
    relationOrder () {
      this.$emit('update:sn', this.relationTaskSn)
      // this.getDetail()
    },
    handleBeforeClose() {
      this.$emit('update:visible', false)
      return false
    },
    getDetail() {
      this.closeInforVisible = false
      this.detailData = null
      this.$service.getWorkOrderDetail(this.sn).then(res => {
        this.detailData = res.data.data
        this.taskType = this.detailData.taskTypeCode
        // this.detailData.relationChargeOrderSn = 'CO201806251033597612'
        if (this.detailData.returnCarType === '正常交车') {
          this.detailSettings[0].items[11].color = ''
        } else {
          this.detailSettings[0].items[11].color = 'red'
        }
        if (this.detailData.taskTypeCode !== 'dispatch_car') delete this.detailData.dispatchReason
        if (this.detailData.taskTypeCode !== 'clean_car') delete this.detailData.cleanTaskType
        if (this.detailData.exception === false) delete this.detailData.exceptionTaskType
        this.carSn = this.detailData.carInfo.carSn
        this.carNumber = this.detailData.carInfo.carNumber
        this.maintainDistanceM = this.detailData.hasOwnProperty('maintainDistanceM')
      })
    },
    successCallback() {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      this.getDetail()
      this.$emit('refresh')
    },
    handleAssignSuccess() {
      this.assignVisible = false
      this.successCallback()
    },
    handleAssign(type) {
      if (type == 'assign') {
        this.assignTitle = '指派'
      } else if (type == 'reassign') {
        this.assignTitle = '改派'
      }

      this.assignVisible = true
    },
    // 详情内关闭工单
    handleClose() {
      this.handeCloseType = 'simple'
      // 关闭工单时判断是否弹框选择网点
      if ((this.$refs.acceptForm.orderinformation.id === this.startStationId) && this.$refs.acceptForm.orderinformation.inStation) {
        this.$confirm('确定要关闭该工单吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$service.closeWorkorder(this.sn).then(res => {
            this.successCallback()
          })
        })
      } else {
        this.closeInforVisible = true
      }
    },
    handleConfirmClose(stationId) {
      this.closeLoading = true
      this.$service.closeWorkorder(this.sn, this.currentCloseType, stationId).then(res => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.stationVisible = false
        this.closeLoading = false
        this.currentCloseType = 'simple'
        this.successCallback()
      }).catch(err => {
        this.closeLoading = false
      })
    },
    handleShowForceFinish() {
      this.forceFinishVisible = true
    },
    // 强制交车
    handleForceFinish(type) {
      this.handeCloseType = type
      if ((this.$refs.acceptForm.orderinformation.id === this.startStationId) && this.$refs.acceptForm.orderinformation.inStation) {
        this.$service.closeWorkorder(this.sn, type).then(res => {
          this.forceFinishVisible = false
          this.successCallback()
        })
      } else {
        this.closeInforVisible = true
        this.forceFinishVisible = false
      }
    },
    handleChangeToGrab() {
      this.$confirm('确定要改为抢单吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$service.putWorkorderIntoPool(this.sn).then(res => {
          this.successCallback()
        })
      })
    },
    handleShowPass() {
      this.acceptFormVisible = true
    },
    handleShowReject() {
      this.verifyRejectVisible = true
    },
    handleCancelReject() {
      this.verifyRejectVisible = false
    },
    handleConfirmReject() {
      this.loading = true
      this.$service.verifyWorkorder(this.sn, 'reject', this.rejectRemark).then(res => {
        this.verifyRejectVisible = false
        this.loading = false
        this.rejectRemark = ''
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.getDetail()
      })
    },
    handleShowRemark(data) {
      this.remarkData = data
      this.remarkVisible = true
    },
    // 点击车牌号跳转到实时定位
    handleJumpToLocation(carNumber, carSn) {
      this.$store.commit('sendToTab', {
        name: 'carLocation',
        params: {
          carNumber,
          carSn
        }
      })
    },
    handleViewNext() {
      let tmpDate = new Date(this.detailData.createTime)
      if (isNaN(tmpDate.getTime())) {
        // safari不支持 new Date("2018-03-01 15:42:06") 写法
        // 支持 new Date("2018/03/01 15:42:06")
        // 因此需要特殊判断处理
        tmpDate = new Date(this.detailData.createTime.replace(/-/g, '/'))
      }
      let createTime = Math.floor(new Date(tmpDate) / 1000)
      this.$service.getNextWorkorder(createTime, this.detailData.carInfo.cityId).then(res => {
        this.$emit('viewNext', res.data.data.sn)
        this.detailData = res.data.data
        this.carSn = this.detailData.carInfo.carSn
        this.carNumber = this.detailData.carInfo.carNumber
      })
    },
    handleJumpToOpuser(executorUserSn) {
      this.$store.commit('sendToTab', {
        name: 'operationsUser',
        params: {
          executorUserSn
        }
      })
    },
    // 充电订单详情
    toChargeOrder (orderSn) {
      this.$store.commit('sendToTab', {
        name: 'chargingOrder',
        params: {
          orderSn
        }
      })
    },
    handleViewInspectionRecord() {
      this.$emit('inspectionDetail', this.detailData.inspectionRecord.id)
    }
  },

  created() {
    if (this.sn) {
      this.getDetail()
    }
  },

  watch: {
    visible() {
      if (this.visible && this.sn) {
        this.getDetail()
      }
    },
    sn () {
      if (this.visible && this.sn) {
        this.getDetail()
      }
    }
  }
}
</script>
<style lang="scss">
.workorder-detail {
  .distribute-type {
    span {
      display: inline-block;
      margin-left: 10px;
      color: $color-red;
    }
  }
  .handle-process {
     padding-top: 30px;
     border-top: 1px solid #ededed;
    .el-table {
      padding: 0 75px;
    }
  }
  .confirm-wrapper {
    position: relative;
    padding: 0 10px;
    i {
      position: absolute;
      font-size: 24px;
      color: #e6a23c;
      top: 50%;
      transform: translateY(-50%);
    }
    p {
      padding-left: 36px;
    }
  }
}
</style>
