<template>
  <section id="car-action-record-table" class="components-content">
    <el-table :data="tableData" height="100%">
      <el-table-column prop="user" label="账号信息" show-overflow-tooltip>
        <template slot-scope="scope">
          <div class="user-name">
            <span v-show="scope.row.userName">{{scope.row.userName}} </span>
            <span v-show="scope.row.userSn">{{scope.row.userSn}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作来源" show-overflow-tooltip>
        <template slot-scope="scope">
          <div>
            <span v-if="scope.row.userType ==='optimus'">后台</span>
            <span v-else-if="scope.row.userType ==='payMoney'">用户APP</span>
            <span v-else-if="scope.row.userType ==='makeMoney'">车服APP</span>
            <span v-else>未知</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="carNumber" label="车牌号" show-overflow-tooltip min-width="120"> </el-table-column>
      <el-table-column label="操作类型" show-overflow-tooltip>
        <template slot-scope="scope">
          <div>
            <span>{{handleType(scope.row.actionName)}}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="carState" label="操作时间" show-overflow-tooltip>
        <template slot-scope="scope">
          <div>
            <span>{{scope.row.triggTime|formatData}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="carNumber" label="操作结果" show-overflow-tooltip>
        <template slot-scope="scope">
          <div>
            <el-tag type="success" v-if="scope.row.resultCode=='0'">成功</el-tag>
            <el-tooltip class="item" effect="dark" :content="scope.row.resultCode" placement="top" v-else>
              <el-tag type="danger" style="cursor:pointer">失败</el-tag>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class='table-page'>
      <el-pagination @current-change="handleCurrentChange" :current-page.sync="paging.page" :page-size="paging.pageSize" layout="total, prev, pager, next" :total="total"></el-pagination>
    </div>
  </section>
</template>
<script>
import { searchPage } from '@/mixins/search-page'
export default {
  name: 'car-action-record-table',
  mixins: [searchPage],
  props: ['otherCarNumber'],
  data() {
    return {
      mobilePhone: this.$store.getters.user.mobilePhone
    }
  },
  mounted() {
    console.log(this.optimusName, '==========')
  },
  methods: {
    // 操作类型
    handleType(type) {
      switch (type) {
        case 'rent':
          return '租车'
        case 'repay':
          return '还车'
        case 'subscribe':
          return '预约'
        case 'unsubscribe':
          return '取消预约'
        case 'unlock':
          return '开门'
        case 'lock':
          return '关门'
        case 'find':
          return '寻车'
        case 'unrentable':
          return '设置故障'
        case 'reboot':
          return '重启终端'
        case 'power':
          return '给动力'
        case 'unpower':
          return '断动力'
        case 'maintain':
          return '开始运维'
        case 'unmaintain':
          return '结束运维'
        case 'rentable':
          return '设置空闲'
        case 'cleanCard':
          return '清空运维卡'
        case 'preMaintain':
          return '运维准备'
        case 'postMaintain':
          return '运维开始'
        case 'preUnmaintain':
          return '运维交车'
        case 'postUnmaintain':
          return '运维完成'
        case 'btUnlock':
          return '蓝牙开门'
        case 'btLock':
          return '蓝牙关门'
        case 'btPower':
          return '蓝牙给动力'
        case 'getBluetoothKey':
          return '获取蓝牙信息'
        default:
          return '未知'
      }
    },
    handleSearch() {
      let searchObj = { ...this.paging, ...this.searchData }
      this.$service.get_actionRecordSearchOrPage(searchObj).then(res => {
        this.total = res.data.data.totalElements
        this.tableData = res.data.data.records
        console.log(this.tableData)
      })
    }
  }
}
</script>
<style lang='scss'>
#car-action-record-table {
  .user-name {
    display: flex;
    flex-direction: column;
  }
}
</style>
