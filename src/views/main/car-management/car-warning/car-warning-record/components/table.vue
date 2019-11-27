<template>
  <div id="car-warning-record-table" class="components-content">
    <div class="table-operator">
      <el-popover placement="right" width="270" title="批量处理" v-model="visible">
        <el-input type="textarea" :rows="2" placeholder="请输入批量处理备注" v-model="selectMsg"> </el-input>
        <div style="margin-top:15px;text-align:right;">
          <el-button type="text" size="mini" @click="visible=false">取消</el-button>
          <el-popover placement="top" width="160" v-model="handleOk">
            <p>您确定批量处理吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="handleOk = false">取消</el-button>
              <el-button type="primary" size="mini" @click="handleListOk" :loading="confirmedLoading">确定</el-button>
            </div>
            <el-button type="primary" slot="reference" size="mini" @click="handleSelectDataOk('confirmed')">确认</el-button>
          </el-popover>
          <el-popover placement="top" width="160" v-model="ignoreHandle">
            <p>您确定批量处理吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="ignoreHandle = false">取消</el-button>
              <el-button type="primary" size="mini" @click="handleListOk" :loading="confirmedLoading">确定</el-button>
            </div>
            <el-button type="primary" slot="reference" size="mini" @click="handleSelectDataOk('ignored')">忽略该告警</el-button>
          </el-popover>

        </div>
        <el-button size="small" slot="reference" type="primary" @click="handlePlentyData" :disabled='idList.length?false:true'>批量处理</el-button>
      </el-popover>

    </div>
    <el-table :data="tableData" class="table-container" height="100%" @select='handleSelectData' @select-all='handleSelectData'>
      <el-table-column type="selection" width="55" :selectable='selectTable'></el-table-column>
      <el-table-column label="车牌号">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="查看实时数据" placement="top">
            <el-button type="text" @click="carStatusNow(scope.row)">{{scope.row.carInfo.carNumber}}</el-button>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="租赁类型" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.carInfo.rentTypeCode===1">分时</span>
          <span v-if="scope.row.carInfo.rentTypeCode===3">长租</span>
        </template>
      </el-table-column>
      <el-table-column prop="eventName" label="告警事件" show-overflow-tooltip min-width="120"> </el-table-column>
      <el-table-column prop="typeName" label="告警类别" show-overflow-tooltip> </el-table-column>
      <el-table-column prop="levelName" label="告警级别" show-overflow-tooltip> </el-table-column>
      <el-table-column prop="handleStatusName" label="状态" show-overflow-tooltip> </el-table-column>

      <el-table-column label="告警时间" min-width="150">
        <template slot-scope="scope">
          <el-popover placement="top" width="250">
            <ul v-loading="loading">
              <li> 租赁状态：{{carDetailData.rentStatus}}</li>
              <li>在线状态：{{carDetailData.active}} </li>
              <li>电源状态：{{carDetailData.charging}} </li>
              <li>电量：{{carDetailData.soc}}</li>
              <li>时速：{{carDetailData.speed}}</li>
              <li>钥匙状态：{{carDetailData.acc}} </li>
              <li>时间：{{carDetailData.reportTime}}</li>
              <li>地址：{{carDetailData.address}} </li>
            </ul>
            <el-button type="text" slot="reference" @click="carWarningDetail(scope.row,scope.row.id)">{{scope.row.alarmDate|formatData}}</el-button>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="carState" label="告警地点" show-overflow-tooltip>
        <template slot-scope="scope">
          <site-map :centerPosition="position(scope.row.carStatus.lng,scope.row.carStatus.lat)"></site-map>
        </template>
      </el-table-column>
      <el-table-column prop="handleBy" label="处理人" show-overflow-tooltip> </el-table-column>
      <el-table-column prop="handleMsg" label="处理备注" show-overflow-tooltip> </el-table-column>
      <el-table-column label="操作" width="220" fixed="right">
        <template slot-scope="scope">
          <div>
            <el-popover :ref="'remarkPopover'+scope.$index" placement="top" width="300" title="处理备注">
              <el-input type="textarea" :rows="2" placeholder="请输入处理备注" v-model="handleMsg"> </el-input>
              <div style="margin-top:15px;text-align:right">
                <el-button type="text" size="mini" @click="cancleRemark(scope.$index)">取消</el-button>
                <el-button type="primary" size="mini" @click="handleRemark(scope.$index,scope.row.id,'confirmed')" :loading="confirmedLoading">确认</el-button>
                <el-button type="primary" size="mini" @click="handleRemark(scope.$index,scope.row.id,'ignored')" :loading="ignoredLoading">忽略该告警</el-button>
              </div>
              <el-button type="text" @click="showRemark(scope.$index)" slot="reference" v-show="scope.row.handleStatusName==='待处理'">处理</el-button>
            </el-popover>
            <el-button type="text" v-show="scope.row.handleStatusName==='待处理'" @click=" createOrder(scope.row) ">创建工单</el-button>
            <el-dropdown @command="handleMenuActiom" @visible-change="visibleMenu(scope.row)" v-if = "scope.row.typeCode==='status'">
              <span class="el-dropdown-link">更多操作
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="carStatusPower" v-has="'carStatusPower'">给动力</el-dropdown-item>
                <el-dropdown-item command="carStatusUnpower" v-has="'carStatusUnpower'">断动力</el-dropdown-item>
                <el-dropdown-item command="carStatusUnlock" v-has="'carStatusUnlock'">开门</el-dropdown-item>
                <el-dropdown-item command="carStatusLock" v-has="'carStatusLock'">锁门</el-dropdown-item>
                <el-dropdown-item command="carStatusRent" v-has="'carStatusRent'">设置空闲</el-dropdown-item>
                <el-dropdown-item command="carStatusReboot" v-has="'carStatusReboot'">重启终端</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class='table-page'>
      <el-pagination @current-change="handleCurrentChange " :current-page.sync="paging.page " :page-size="paging.pageSize " layout="total, prev, pager, next " :total="total "></el-pagination>
    </div>
  </div>
</template>
<script>
import { getCarStateStyle, getRentStatus } from '@/utils/common'
import { searchPage } from '@/mixins/search-page'
import { getWarningDetailData } from './../../common'
import { position } from '@/mixins/position'
export default {
  name: 'car-warning-record-table',
  mixins: [searchPage, position],
  props: {
    otherCarNumber: String
  },
  data() {
    return {
      handleStatusCode: null,
      handleOk: true,
      ignoreHandle: false,
      handleMsg: '',
      confirmedLoading: false,
      ignoredLoading: false,
      selectMsg: '',
      visible: false,
      loading: true,
      rentStatus: getRentStatus,
      carSn: null,
      carNumber: null,
      idList: [],
      carDetailData: {}
    }
  },
  mounted() {
    this.$nextTick(() => {

    })
  },
  computed: {
  },
  methods: {
    handleMenuActiom(menuItem, row) {
      let statueTip = '该功能仅用于车辆异常情况，请谨慎操作！'
      let confirmText
      switch (menuItem) {
        case 'carStatusPower':
          confirmText = '给动力'
          break
        case 'carStatusUnpower':
          confirmText = '断动力'
          break
        case 'carStatusUnlock':
          confirmText = '开门'
          break
        case 'carStatusLock':
          confirmText = '锁门'
          break
        case 'carStatusRent':
          confirmText = '设置空闲'
          break
        case 'carStatusReboot':
          confirmText = '重启终端'
          break
        case 'carStatusUnmaintain':
          statueTip = '确定清空运维卡？'
          confirmText = '确定'
          break
        case 'carCreateOrder':
          // 跳转到创建工单页面
          this.sendToTabData(
            {
              carSn: this.carSn,
              carNumber: this.carNumber
            },
            'workOrder'
          )
          return
      }
      this.$confirm(statueTip, '', {
        confirmText: confirmText,
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$service[menuItem](this.carSn)
          .then(res => {
            if (menuItem === 'carStatusUnmaintain') {
              confirmText = '清空运维卡'
            }
            this.$message.success(`${confirmText}成功`)
            // 刷新列表数据
            this.handleSearch()
          })
          .catch(error => {
            this.$message.warning(error.msg)
          })
      })
    },
    visibleMenu (row) {
      this.carSn = row.carInfo.carSn
      this.carNumber = row.carInfo.carNumber
    },
    handleListOk() {
      if (this.handleStatusCode === 'confirmed' && !this.selectMsg) {
        this.$message.warning('请输入批量处理备注')
        return
      }
      this.confirmedLoading = true
      this.$service.putDeleteSelect(this.idList, this.handleStatusCode, this.selectMsg).then(res => {
        this.visible = false
        this.selectMsg = ''
        this.idList = []
        this.confirmedLoading = false
        this.$message.success('批量处理成功')
        this.handleSearch()
        this.handleOk = false
        this.ignoreHandle = false
      })
    },
    selectTable(row) {
      return row.handleStatusName === '待处理'
    },
    handleCurrentChange(page) {
      this.idList = []
      // 标志位
      if (this.flagBit) {
        this.flagBit = false
        return
      }
      this.paging.page = page
      this.handleSearch()
    },
    handleSelectDataOk(handleStatusCode) {
      this.handleStatusCode = handleStatusCode
    },
    handleSelectData(data) {
      this.idList = data.map(item => { return item.id })
    },
    handlePlentyData() {

    },
    cancleRemark(index) {
      this.$refs['remarkPopover' + index].showPopper = false
    },
    showRemark(index) {
      this.handleMsg = ''
    },
    handleRemark(index, carSn, handleStatusCode) {
      if (handleStatusCode === 'confirmed') {
        if (!this.handleMsg) {
          this.$message.warning('请输入处理备注')
          return
        }
        this.confirmedLoading = true
        this.ignoredLoading = false
      } else if (handleStatusCode === 'ignored') {
        this.ignoredLoading = true
        this.confirmedLoading = false
      }
      this.$service.getCarWarningHandleMark(carSn, handleStatusCode, this.handleMsg).then(res => {
        if (res.data.code === '0') {
          this.$refs['remarkPopover' + index].doClose()
          this.$message.success(handleStatusCode === 'confirmed' ? '该备注已处理' : '该告警已忽略')
          this.confirmedLoading = false
          this.ignoredLoading = false
          this.handleSearch()
        }
      })
    },
    carWarningDetail(row, carSn) {
      this.loading = true
      getWarningDetailData(carSn, data => {
        this.loading = false
        this.carDetailData = data
        console.log(data.carSn)
      })
    },
    carStateStyle(statue) {
      return getCarStateStyle(statue)
    },
    // index页面调用
    handleOtherNumber() {
      if (this.otherCarNumber) {
        this.searchData.keyWords = this.otherCarNumber
        this.handleSearch()
      }
    },

    // 实时数据
    carStatusNow(data) {
      this.$store.commit('sendToTab', {
        name: 'carLocation',
        params: {
          carSn: data.carInfo.carSn,
          carNumber: data.carInfo.carNumber
        }
      })
    },

    // 创建工单
    createOrder(data) {
      // console.log(data.handleMsg, data.carInfo.carNumber)
      this.$store.commit('sendToTab', {
        name: 'workOrder',
        params: {
          from: 'car-warning',
          carNumber: data.carInfo.carNumber,
          carSn: data.carInfo.carSn,
          handleMsg: data.eventName,
          businessSn: data.id
        }
      })
    },
    handleSearch() {
      let searchObj = { ...this.paging, ...this.searchData }
      this.$service.getCarWarningAlarm(searchObj).then(res => {
        console.log(res.data.data.records)
        this.total = res.data.data.totalElements
        this.tableData = res.data.data.records
      })
    }
  }
}
</script>
