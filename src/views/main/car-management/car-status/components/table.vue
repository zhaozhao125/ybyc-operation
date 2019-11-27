<template>
  <div id="car-status-table" class="components-content">
    <div class="table-operator">
      <el-button size="small" type="primary" :loading="exportLoading" @click="exportFile">导出</el-button>
    </div>
    <div class="car-summary table-operator">
      <ul style="margin-left: 10px;">
        <li class="state-leisure">空闲：{{rent.VACANT}} </li>
        <li class="state-already"> 已预约：{{rent.OCCUPIED}} </li>
        <li class="state-rent"> 已租：{{rent.CHECK_IN}} </li>
        <li class="state-maintain">维护中：{{rent.ON_MAINTENANCE}} </li>
        <li class="state-low"> 亏电：{{machine.lowPower}} </li>
      </ul>
    </div>
    <el-table :data="tableData" class="table-container" height="100%">
      <el-table-column prop="origin" label="运营城市" show-overflow-tooltip min-width="80">
        <template slot-scope="scope">
          <span>{{scope.row.cityName}}</span>
        </template>
      </el-table-column>

      <el-table-column prop="carNumber" label="车牌号">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="查看实时数据" placement="top">
            <el-button type="text" @click="carStatusNow(scope.row)">{{scope.row.carNumber}}</el-button>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="里程(km)">
        <template slot-scope="scope">
          <span v-if='scope.row.odo===-1'>未知</span>
          <span v-else>{{scope.row.odo}}km</span>
        </template>
      </el-table-column>
      <el-table-column prop="carModelName" label="车型" show-overflow-tooltip> </el-table-column>
      <el-table-column label="租赁类型" min-width="80">
        <template slot-scope="scope">
          <div>
            <span v-if="scope.row.rentTypeCode ===1">分时</span>
            <span v-else-if="scope.row.rentTypeCode ===3">短/长租</span>
            <span v-else>未知</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="carState" label="租赁状态" show-overflow-tooltip>
        <template slot-scope="scope">
          <div>
            <span v-if="scope.row.rentStatusCode===-1">未知</span>
            <span v-else :class="carStateStyle(scope.row.rentStatusCode)">{{rentStatus[scope.row.rentStatusCode]}}</span>
            <el-tooltip class="item" effect="dark" v-if="scope.row.rentStatusCode===3&&scope.row.maintenanceDTO" :content="'查看'+scope.row.maintenanceDTO.taskTypeName" placement="top">
              <span v-if="scope.row.rentStatusCode===3&&scope.row.maintenanceDTO" class="tip-status" @click="createOrderDTO(scope.row)">&nbsp;&nbsp;&nbsp;{{scope.row.maintenanceDTO.taskTypeName}}</span>
            </el-tooltip>

          </div>
        </template>nbsp&nbsp;;
      </el-table-column>
      <el-table-column label="动力状态" min-width="80">
        <template slot-scope="scope">
          <div>
            <span v-if="scope.row.ready ==1">有动力</span>
            <span v-else-if="scope.row.ready ==0">无动力</span>
            <span v-else-if="scope.row.ready ==-1">未知</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="电量(%)" show-overflow-tooltip>
        <template slot-scope="scope">
          <div style="display:flex">
            <span v-if="scope.row.soc==-1">未知</span>
            <span :class="{'state-red':scope.row.soc<30}" v-else>{{scope.row.soc}}% </span>
            <span v-show="scope.row.charging===1">(充电中)</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="所属网点" prop="association" show-overflow-tooltip min-width="250">
        <template slot-scope="scope">
          <span type="text" class="station-name" @click="jumpStation(scope.row.association)">{{scope.row.association}}</span>
        </template>
      </el-table-column>
      <el-table-column label="在线状态" show-overflow-tooltip>
        <template slot-scope="scope">
          <div>
            <el-tag v-if="scope.row.active==-1" type="info">未知</el-tag>
            <el-tag v-else-if="scope.row.active" type="success">在线</el-tag>
            <el-tag v-else type="danger">离线</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="250" fixed="right">
        <template slot-scope="scope">
          <div class="handle">
            <el-tooltip class="item" effect="dark" content="查看车辆信息" placement="top">
              <el-button type="text" @click="jumpCarInfo(scope.row)">车辆信息</el-button>
            </el-tooltip>

            <el-button type="text" @click="carStatusHistory(scope.row)">历史轨迹</el-button>
            <!-- 在线状态为离线时创建工单 -->
            <el-button type="text" @click="createOrder(scope.row)" v-if="!scope.row.active && $_has('carStatusCreateOrder')">创建工单</el-button>
            <el-dropdown @command="handleMenuActiom" @visible-change="visibleMenu(scope.row)" v-else>
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
                <el-dropdown-item command="carStatusUnmaintain" v-has="'carStatusUnmaintain'">清空运维卡</el-dropdown-item>
                <el-dropdown-item command="carCreateOrder" v-has="'carStatusCreateOrder'">创建工单</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class='table-page'>
      <el-pagination @current-change="handleCurrentChange" :current-page.sync="paging.page" :page-size="paging.pageSize" layout="total, prev, pager, next" :total="total"></el-pagination>
    </div>
  </div>
</template>
<script>
import { getRentStatus, getCarStateStyle } from '@/utils/common'
import { searchPage } from '@/mixins/search-page'
export default {
  name: 'car-status-table',
  mixins: [searchPage],
  // 在mixin文件中写
  props: {
    otherCarNumber: String
  },
  data() {
    return {
      rentStatus: getRentStatus,
      carSn: null,
      carNumber: null,
      rent: {},
      machine: {},
      exportLoading: false
    }
  },
  mounted() {
    this.$nextTick(() => {
      // 状态字典
      this.carStatusAnalysis()
    })
  },
  computed: {
  },
  methods: {
    jumpStation(websiteName) {
      this.$store.commit('sendToTab', {
        name: 'branchesList',
        params: {
          websiteName: websiteName
        }
      })
    },
    carStateStyle(statue) {
      return getCarStateStyle(statue)
    },
    // index页面调用
    handleOtherData() {
      if (this.otherCarNumber) {
        this.searchData.keyWords = this.otherCarNumber
        this.handleSearch()
      }
    },
    exportFile() {
      this.exportLoading = true
      this.$service.get_downloadCarStatus(
        this.searchData,
        '车辆状态.xlsx'
      ).then(res => {
        this.exportLoading = false
      }).catch(err => {
        this.exportLoading = false
      })
    },
    carStatusAnalysis() {
      this.$service.carStatusAnalysis().then(res => {
        let { rent, machine } = res.data.data
        this.machine = machine.data
        this.rent = rent.data
      })
    },
    jumpCarInfo(row) {
      this.sendToTabData(row, 'carInfo')
    },
    // 实时数据
    carStatusNow(row) {
      this.sendToTabData(row, 'carLocation')
    },
    // 历史轨迹
    carStatusHistory(row) {
      this.sendToTabData(row, 'carTrack')
    },
    createOrderDTO(row) {
      if (row.maintenanceDTO.taskTypeCode === 'move_car') {
        this.sendToTabData(row, 'moveRecord')
      } else {
        this.$store.commit('sendToTab', {
          name: 'workOrder',
          params: {
            taskSn: row.maintenanceDTO.taskSn,
            from: 'car-status--search'
          }
        })
      }
    },
    // 创建工单
    createOrder(row) {
      this.sendToTabData(row, 'workOrder')
    },
    sendToTabData(data, name) {
      this.$store.commit('sendToTab', {
        name: name,
        params: {
          carSn: data.carSn,
          carNumber: data.carNumber
        }
      })
    },
    handleSearch() {
      let searchObj = { ...this.paging, ...this.searchData }
      this.$service.get_carStatusPagingOrSearch(searchObj).then(res => {
        this.total = res.data.data.totalElements
        this.tableData = res.data.data.records
      })
    },
    // 下拉菜单显示触发
    visibleMenu(row) {
      this.carSn = row.carSn
      this.carNumber = row.carNumber
    },
    // 下拉菜单
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
    }
  }
}
</script>
<style lang="scss">
.station-name {
  cursor: pointer;
}
.handle {
  display: flex;
  align-items: center;
  justify-content: space-around;
  // margin-right: 5px;
}
#car-status-table {
  .tip-status {
    color: #3498db;
    cursor: pointer;
  }
  .car-summary {
    white-space: nowrap;
    ul {
      display: flex;
      li {
        margin-right: 3%;
        font-size: 14px;
        color: #888;
      }
    }
  }
  .el-tag {
    border: none;
  }
}
</style>
