<template>
  <div class="workorder">
    <el-card class="table-box">
      <div slot="header">
        <v-search :searchSettings="searchSettings" labelWidth="130px" @search="handleSearch" @reset="handleReset"></v-search>
      </div>
      <div class="table-operator">
        <el-button type="primary" size="small" @click="handleShowCreate" v-has="'workOrderCreate'">创建工单</el-button>
        <el-button type="default" size="small" @click="handleExport" :loading="exportLoading" v-has="'workOrderOutput'">导出工单</el-button>
      </div>
      <div class="table-container">
        <workOrderTable :tableData="tableData" @process="handleProcess" @refresh="loadTableData" @close="handleCloseWorkorder" @showDetail="handleShowDetail" @inspectionDetail="handelInspectionDetail" @closeJudge = "showChooseStation"></workOrderTable>
      </div>
      <div class="table-page">
        <el-pagination :current-page="page" :page-size="pageSize" layout="total, prev, pager, next" :total="pageTotal" @current-change="_handlePageChange">
        </el-pagination>
      </div>
    </el-card>
    <!-- 指派/改派 -->
    <assignList v-if="currentSn" :sn="currentSn" :visible.sync="assignVisible" :title="assignTitle" @success="handleAssignSuccess"></assignList>
    <!-- 验收通过 -->
    <acceptForm :visible.sync="acceptFormVisible" :sn="currentSn"></acceptForm>
    <!-- 验收驳回 -->
    <rejectForm :visible.sync="rejectFormVisible"></rejectForm>
    <!-- 创建工单 -->
    <addWorkorder ref="createWorkorder" :visible.sync="addVisible" @close="handleCloseAddWorkorder" @success="handleCreateSuccess" :getParams='changeWorkTypeParams'></addWorkorder>
    <!-- 工单详情 -->
    <workorderDetail v-if="currentSn" :visible.sync="detailVisible" :sn.sync="currentSn" :startStationId="startStationId" @refresh="loadTableData" @viewNext="handleViewNextWorkorder" @inspectionDetail="handelInspectionDetail" @closeJudge = "showChooseStation"></workorderDetail>
    <!-- 巡检详情 -->
    <selectStation :visible.sync="stationVisible" :loading="closeLoading" @confirm="handleConfirmClose"></selectStation>
    <!-- 关闭工单 -->
    <close-order ref="closeDialog" :sn="sn" :carSn="carSn" :carNumber="carNumber" @on-close="confirmCloseOrder" ></close-order>
  </div>

</template>

<script>
import searchSettings from './components/searchSettings.js'
import searchHistoryMixin from '@/mixins/search-history.js'
import paginationMixin from '@/mixins/pagination.js'
import workOrderTable from './components/table.vue'
import assignList from './components/assign-list.vue'
import acceptForm from './components/accept-form.vue'
import rejectForm from './components/reject-form.vue'
import addWorkorder from './components/add-workorder/add-workorder.vue'
import workorderDetail from './components/detail/detail.vue'
import { handleSubmitSearchData } from '@/utils/common.js'
import selectStation from './components/select-station.vue'
import closeOrder from './components/close-dialog.vue'
export default {
  name: 'workorder',

  mixins: [
    searchHistoryMixin,
    paginationMixin
  ],

  components: {
    workOrderTable,
    assignList,
    acceptForm,
    rejectForm,
    addWorkorder,
    workorderDetail,
    selectStation,
    closeOrder
    // inspectionInfor
  },

  props: [
    'params'
  ],

  data() {
    return {
      searchSettings,
      searchParams: null,
      tableData: [],
      assignVisible: false,
      assignTitle: '指派',
      acceptFormVisible: false,
      closeVisible: false,
      rejectFormVisible: false,
      addVisible: false,
      currentSn: '',
      detailVisible: false,
      stationVisible: false,
      orderToBeClosed: null,
      closeLoading: false,
      exportLoading: false,
      changeWorkTypeParams: null,

      carNumber: '',
      sn: '',
      carSn: '',
      startStationId: 0
    }
  },

  methods: {
    // 加载列表数据
    loadTableData(needLoading = true) {
      this.$service
        .getWorkOrder(this.page, this.searchParams, needLoading)
        .then(res => {
          this.tableData = res.data.data.records
          this._changePageTotal(res.data.data.totalElements)
        })
    },
    // 搜索
    handleSearch(data) {
      Object.keys(data).forEach((ele) => {
        if (ele === 'createTime') {
          data.startCreateTime = Date.parse(data[ele][0]) / 1000
          data.endCreateTime = Date.parse(data[ele][1]) / 1000
          delete data[ele]
        } else if (ele === 'verifyTime') {
          data.startVerifyTime = Date.parse(data[ele][0]) / 1000
          data.endVerifyTime = Date.parse(data[ele][1]) / 1000
          delete data[ele]
        }
      })
      this.searchParams = data
      this.page = 1
      this.loadTableData()
    },
    // 重置搜索
    handleReset() {
      this.searchParams = null
    },
    // 表格操作
    handleProcess(data, type) {
      this.currentSn = data.sn
      if (type == 'assign') {
        this.assignTitle = '指派'
        this.assignVisible = true
      } else if (type == 'reassign') {
        this.assignTitle = '改派'
        this.assignVisible = true
      } else if (type == 'accept') {
        this.acceptFormVisible = true
      } else if (type == 'reject') {
        this.rejectFormVisible = true
      }
    },
    // 指派成功
    handleAssignSuccess() {
      this.assignVisible = false
      this.loadTableData()
    },
    // 显示创建表单
    handleShowCreate() {
      this.addVisible = true
      // this.inspectionVisible = true
    },
    // 创建成功
    handleCreateSuccess(type, data) {
      if (type == 'assign') {
        this.currentSn = data.sn
        this.assignTitle = '指派'
        this.assignVisible = true
      }
      this.page = 1
      this.$nextTick(() => {
        setTimeout(() => {
          this.loadTableData(type != 'assign')
        }, 100)
        this.$message({
          message: '创建工单成功',
          type: 'success'
        })
      })
    },
    // 显示详情
    handleShowDetail(data) {
      if (!!data && (typeof data == 'object')) {
        this.currentSn = data.sn
        if (data.startStationId) {
          this.startStationId = data.startStationId
        } else {}
      } else if (!!data && (typeof data == 'string')) {
        this.currentSn = data
      } else {}
      this.detailVisible = true
    },
    // 显示巡检详情
    handelInspectionDetail(sn) {
      this.$store.commit('sendToTab', {
        name: 'inspectionRecord',
        params: {
          id: sn
        }
      })
      // this.currentInspection = ''
      // this.inspectionVisible = false
      // this.$nextTick(() => {
      //   this.currentInspection = sn + ''
      //   this.inspectionVisible = true
      // })
    },
    // 由巡检详情到工单详情
    // showWorkInfor(sn) {
    //   this.currentSn = sn
    //   // this.currentInspection = ''
    //   // this.inspectionVisible = false
    //   this.detailVisible = true
    // },
    handleCloseAddWorkorder() {
      this.changeWorkTypeParams = null
    },
    // 选完网点后关闭工单
    confirmCloseOrder (currentStationId) {
      this.closeOrder(this.sn, 'simple', currentStationId)
    },
    // 关闭工单
    closeOrder (sn, simple, stationId) {
      this.$service.closeWorkorder(sn, simple, stationId).then(res => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.loadTableData()
        this.closeVisible = false
        this.$refs.closeDialog.visible = false
        this.$refs.closeDialog.loading = false
      }).catch((res) => {
        this.$refs.closeDialog.loading = false
      })
    },
    getDetail () {
    },
    // 选择网点弹框
    showChooseStation (data) {
      this.carNumber = data.carNum
      this.sn = data.sn
      this.carSn = data.carSn
      this.closeVisible = true
      this.$refs.closeDialog.show(data)
    },
    handleCloseWorkorder(data) {
      this.$service.closeWorkorder(data.sn).then(res => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.loadTableData()
      })
    },
    handleConfirmClose(stationId) {
      this.closeLoading = true
      this.$service.closeWorkorder(this.orderToBeClosed.sn, 'simple', stationId).then(res => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.stationVisible = false
        this.closeLoading = false
        this.loadTableData()
      }).catch(err => {
        this.closeLoading = false
      })
    },
    handleParamsChange() {
      this.addVisible = false
      this.assignVisible = false
      this.detailVisible = false
      this.stationVisible = false
      this.rejectFormVisible = false
      this.acceptFormVisible = false
      if(this.params && this.params.from === 'car-status--search'){
        this.handleShowDetail(this.params.taskSn)
        return
      }
      if (this.params && this.params.from === 'car-warning') {
        this.$refs.createWorkorder.setCarNumber(this.params.carNumber, this.params.carSn, this.params.handleMsg)
        this.$nextTick(() => {
          this.changeWorkTypeParams = Object.assign({}, this.params)
          this.changeWorkTypeParams.createSource = 'alarm'
          this.addVisible = true
        })
        return
      }
      if (this.params && this.params.carNumber) {
        // this.inspectionVisible = false
        this.$refs.createWorkorder.setCarNumber(this.params.carNumber, this.params.carSn)
        return
      }
      if (this.params && this.params.sn) {
        this.currentSn = ''
        this.detailVisible = false

        this.$nextTick(() => {
          this.currentSn = this.params.sn
          // this.addVisible = true
          this.detailVisible = true
        })
        return
      }
      if (this.params && this.params.infor) {
        // this.currentSn = this.params.sn
        // this.detailVisible = true
        this.detailVisible = false
        this.$nextTick(() => {
          this.changeWorkTypeParams = this.params.infor
          this.changeWorkTypeParams.createSource = 'inspection'
          this.addVisible = true
        })
      }
    },
    handleExport() {
      console.log(this.searchParams)
      if (!this.searchParams || (!this.searchParams.startCreateTime && !this.searchParams.startVerifyTime)) {
        this.$message({
          message: '请先选择日期并搜索',
          type: 'warning'
        })
        return
      }
      if (!this.tableData || !this.tableData.length) {
        this.$message({
          message: '搜索数据为空',
          type: 'warning'
        })
        return
      }
      if((this.searchParams.endCreateTime-this.searchParams.startCreateTime)/60/60/24 > 31 || (this.searchParams.endVerifyTime-this.searchParams.startVerifyTime)/60/60/24 > 31){
        this.$message({
          message: '导出时间范围必须小于等于31天，请重新设置',
          type: 'warning'
        })
        return
      }

      // let startCreateTime = dayjs.unix(this.searchParams.startCreateTime).format('YYYY-MM-DD HH:mm:ss')
      // let endCreateTime = dayjs.unix(this.searchParams.endCreateTime).format('YYYY-MM-DD HH:mm:ss')

      this.$message({
        message: '下载即将开始'
      })
      this.exportLoading = true
      this.$service.exportWorkorder(this.searchParams).then(res => {
        this.exportLoading = false
        // this.$message({
        //   message: '下载成功',
        //   type: 'success'
        // })
      }).catch(err => {
        this.$message({
          message: '下载出错',
          type: 'error'
        })
        this.exportLoading = false
      })
    },
    handleViewNextWorkorder(sn) {
      this.currentSn = sn
    }
  },

  mounted() {
    this.loadTableData()
    this.$nextTick(() => {
      this.handleParamsChange()
    })
  },

  watch: {
    params() {
      this.handleParamsChange()
    }
  }
}
</script>

<style lang="scss">

</style>
