<template>
  <div id="coupons-table " class="components-content">
    <!-- 详情页开始 -->
    <v-page :visible.sync="detailPage">
      <h3 slot="title">充电桩详情</h3>
      <template slot="content">
        <!-- 详情页组件 -->
        <v-detail :detailData="detailData" :id="id"></v-detail>
      </template>
    </v-page>
    <!-- 详情页结束 -->
    <!-- 表格开始 -->
    <el-table :data="tableData" class="table-container" height="100%">
      <el-table-column label="充电桩编号" min-width="140">
        <template slot-scope="scope">
          <el-button type="text" @click="detailItem(scope.row)"> {{scope.row.sn}}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="接口状态" min-width="100px">
        <template slot-scope="scope">
          <span :class="getCheckDataStatus(scope.row.connectors[0].status)">{{formateStatusText(scope.row.connectors[0].status)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="equipmentModelName" label="充电桩类型" min-width="140px"></el-table-column>
      <el-table-column prop="operatorName" label="运营商" min-width="140px"></el-table-column>
      <el-table-column prop="deviceName" label="设备" min-width="140px"></el-table-column>
      <el-table-column prop="stationName" label="所属站点" min-width="190px"></el-table-column>
      <el-table-column align="center" label="创建时间" min-width="165">
        <template slot-scope="scope">
          <span>{{scope.row.createdOn|timeFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="enabled" label="状态" min-width="100">
        <template slot-scope="scope">
          <popSwitch v-model="scope.row.enabled" trueText="确定要禁用该充电桩吗？" falseText="确定要启用该充电桩吗？" @confirm="handleConfirmSwitch(scope.row)"></popSwitch>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" min-width="70">
        <template slot-scope="scope">
          <el-button type="text" v-if="scope.row.operatorCode == 'YB' && $_has('chargingPileEdit')" @click="editList(scope.row,2)">编辑</el-button>
          <el-popover :ref="'deletePop' + scope.$index" title="" width="270" trigger="click" placement="top">
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <!-- 表格结束 -->
    <div class="table-page">
      <el-pagination @current-change="handleCurrentChange" :current-page.sync="paging.page" :page-size="paging.pageSize" layout="total, prev, pager, next" :total="total"></el-pagination>
    </div>
  </div>
</template>
<script>
import vDetail from './detail'
import { searchPage } from '@/mixins/search-page'
import websiteSelect from '@/components/website-select'
import popSwitch from '@/components/pop-switch' //引入switch组件
import { handleDate } from '@/utils/date-filter'
export default {
  name: 'charging-pile-table',
  mixins: [searchPage],
  data() {
    return {
      id: '',
      selectSiteLoading: false,
      detailPage: false,
      drawPage: false,
      detailData: {},
      successFlagBit: false,
      checkDataStatusText: {
        'OFFLINE': '离线',
        'IDLE': '空闲',
        'USED_UNCHARGE': '占用未充电',
        'USED_CHARGING': '充电中',
        'PARKING': '待拔枪',
        'USED_RESERVED': '预约锁定',
        'ERROR': '故障'
      }
    }
  },
  methods: {
    formateStatusText(status) {
      return this.$service.formateStatusText(status);
    },
    handleConfirmSwitch(data) {
      if (data.enabled) {
        data.enabled = false
      } else {
        data.enabled = true
      }
      let params = { 'sn': data.sn, 'enabled': data.enabled }
      this.$service.chargingPileStatus(params).then(res => {
        this.$message({
          message: data.enabled ? '启用成功' : '禁用成功',
          type: 'success'
        })
        this.loadTableData()
      })
    },
    refreshTable() {
      this.handleSearch()
    },
    editList(row, editNum) {
      // 转一下类型
      row.ownerId = String(row.ownerId)
      this.$emit('editorData', row, editNum)
    },
    handleSearch() {
      let searchObj = { ...this.paging, ...this.searchData }
      if (searchObj.addTime != undefined && searchObj.addTime.length > 0) {
        searchObj.startCreatedOn = handleDate(searchObj.addTime[0], 'day')
        searchObj.endCreatedOn = handleDate(searchObj.addTime[1], 'day')
      }
      console.log(searchObj)
      this.$service.getChargingPileList(searchObj).then(res => {
        this.total = res.data.data.totalElements
        this.tableData = res.data.data.records
      })
    },
    // 充电桩详情
    detailItem(row) {
      this.detailData = row
      this.detailPage = true
      // let ID = {}
      // ID.sn = sn
      // this.$service.getChargingPileInfo(ID).then(res => {
      //   this.detailData = res.data.data
      // })
      // this.$nextTick(() => {
      //   this.detailPage = true
      // })
    },
    getCheckDataStatus(state) {
      switch (state) {
        case '离线':
          return 'state-gray'
        case '空闲':
          return 'state-green'
        case '占用未充电':
          return 'state-yellow'
        case '已插枪':
          return 'state-yellow'
        case '待拔枪':
          return 'state-yellow'
        case '充电中':
          return 'state-blue'
        case '故障':
          return 'state-red'
      }
    }
  },
  components: {
    vDetail,
    websiteSelect,
    popSwitch
  }
}

</script>
<style lang="scss">
#car-info-table {
  .el-switch {
    font-size: 0;
    outline: none;
  }
}

</style>
