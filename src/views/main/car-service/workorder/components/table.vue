<template>
  <el-table :data="tableData" height="100%">
    <el-table-column label="工单编号" min-width="190">
      <template slot-scope="scope">
        <el-button type="text" @click="handleShowDetail(scope.row)">{{scope.row.sn}}</el-button>
      </template>
    </el-table-column>
    <el-table-column prop="carNum" label="车牌号" min-width="100">
    </el-table-column>
    <el-table-column label="工单类型" min-width="90" >
       <template slot-scope="scope">
          <el-button type="text" @click=" handelInpectionDetail(scope.row)" v-if = "scope.row.taskType === '巡检单' && scope.row.inspectionRecord">{{scope.row.taskType}}</el-button>
          <div v-else>{{scope.row.taskType}}</div>
          <div v-if = "scope.row.taskTypeCode === 'dispatch_car' && scope.row.dispatchReason">({{scope.row.dispatchReason}})</div>
          <div v-if = "scope.row.taskTypeCode === 'clean_car' && scope.row.cleanTaskType">({{scope.row.cleanTaskType}})</div>
       </template>
    </el-table-column>
    <el-table-column prop="distributeType" label="分发类型" min-width="90">
    </el-table-column>
    <el-table-column prop="executorUserName" label="处理人" min-width="100">
      <template slot-scope="scope">
        <el-button type="text" @click="handleJumpToOpuser(scope.row.executorUserSn)">{{scope.row.executorUserName}}</el-button>
      </template>
    </el-table-column>
    <el-table-column prop="taskStatus" label="工单状态" min-width="90">
    </el-table-column>
    <el-table-column prop="cityName" label="城市" min-width="90">
    </el-table-column>
    <el-table-column prop="sourceType" label="创建方式" min-width="90">
    </el-table-column>
    <el-table-column prop="createTime" label="工单创建时间" min-width="165">
    </el-table-column>
    <el-table-column label="操作" width="198" fixed="right">
      <template slot-scope="scope">
        <el-button type="text" @click="handleProcess(scope.row, 'assign')" v-if="scope.row.taskStatus=='待分发' && (scope.row.distributeType=='指派'||scope.row.distributeType=='未处理') && $_has('workOrderAssign')">指派</el-button>
        <el-button type="text" @click="handleProcess(scope.row, 'reassign')" v-if="scope.row.taskStatus=='待处理' && scope.row.distributeType=='指派' && $_has('workOrderReassign')">改派</el-button>
        <el-button type="text" @click="handleShowDetail(scope.row)" v-if="scope.row.taskStatus=='待验证' && $_has('workOrderCheck')">验收</el-button>
        <el-popover :ref="'popoverPool'+scope.$index" class="confirm-popover" placement="bottom" width="160" v-if="scope.row.taskStatus=='待分发' && scope.row.distributeType=='指派'">
          <p>确定要改为抢单吗？</p>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="$refs['popoverPool'+scope.$index].showPopper=false">取消</el-button>
            <el-button type="primary" size="mini" @click="handleProcess(scope.row, 'pool');$refs['popoverPool'+scope.$index].showPopper=false">确定</el-button>
          </div>
          <el-button v-has="'workOrderChangeToGrab'" slot="reference" type="text">改为抢单</el-button>
        </el-popover>
        <el-popover :ref="'popoverCancel'+scope.$index" class="confirm-popover" placement="bottom" width="160" v-if="scope.row.taskStatusCode!='finish'  && scope.row.taskStatusCode!='closed'">
          <p>确定关闭该工单吗？</p>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="$refs['popoverCancel'+scope.$index].showPopper=false">取消</el-button>
            <el-button type="primary" size="mini" @click="handleCloseWorkorder(scope.row);$refs['popoverCancel'+scope.$index].showPopper=false">确定</el-button>
          </div>
          <el-button v-has="'workOrderClose'" slot="reference" type="text" @click = "closeOrder(scope.row, scope.$index)">关闭工单</el-button>
        </el-popover>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
export default {
  props: {
    tableData: {
      type: Array,
      default: () => {
        return []
      }
    }
  },

  data() {
    return {
    }
  },

  methods: {
    // 关闭工单时判断是否弹框选择网点
    colseOrderJudge (data, index) {
      this.$service.getWorkOrderStation(data.carSn).then((res) => {
        if ((res.data.data.id === data.startStationId) && res.data.data.inStation) {
          console.log(true)
          this.$nextTick(() => {
            this.$refs['popoverCancel' + index].showPopper = true
          })
        } else {
          console.log(false)
          data.inStation = res.data.data.inStation
          data.name = res.data.data.name
          data.id = res.data.data.id
          this.$nextTick(() => {
            this.$refs['popoverCancel' + index].showPopper = false
            this.$emit('closeJudge', data)
          })
        }
      })
    },
    // 关闭工单
    closeOrder(data, index) {
      console.log(data)
      this.$nextTick(() => {
        this.$refs['popoverCancel' + index].showPopper = false
      })
      if (data.taskStatusCode === 'dealing' || data.taskStatusCode === 'waiting_verity') {
        this.colseOrderJudge(data, index)
      } else {
        this.$nextTick(() => {
          this.$refs['popoverCancel' + index].showPopper = true
        })
      }
    },
    handleProcess(data, type) {
      if (type == 'pool') {
        this.$service.putWorkorderIntoPool(data.sn).then(res => {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.$emit('refresh')
        })
      } else {
        this.$emit('process', data, type)
      }
    },
    handleCloseWorkorder(data) {
      this.$emit('close', data)
    },
    handleShowDetail(data) {
      this.$emit('showDetail', data)
    },
    handelInpectionDetail (data) {
      if (data.taskType === '巡检单') {
        this.$emit('inspectionDetail', data.inspectionRecord.id)
      } else {}
    },
    handleJumpToOpuser(executorUserSn) {
      this.$store.commit('sendToTab', {
        name: 'operationsUser',
        params: {
          executorUserSn
        }
      })
    }
  }
}
</script>
<style lang="scss">

</style>
