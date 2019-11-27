<template>
  <div id="car-alarm-table" class="components-content">
    <el-table :data="tableData" height="100%">
      <el-table-column label="运营城市" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.cityName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="carNumber" label="车牌号" show-overflow-tooltip min-width="120"> </el-table-column>
      <el-table-column prop="alarmTypeName" label="告警类型" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{alarmType(scope.row.alarmTypeCode)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="carState" label="操作时间" show-overflow-tooltip min-width="150">
        <template slot-scope="scope">
          <span>{{scope.row.triggerDate|formatData}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="carState" label="告警地点" show-overflow-tooltip>
        <template slot-scope="scope">
          <site-map :centerPosition="position(scope.row.carLng,scope.row.carLat)"></site-map>
        </template>
      </el-table-column>
    </el-table>
    <div class='table-page'>
      <el-pagination @current-change="handleCurrentChange" :current-page.sync="paging.page" :page-size="paging.pageSize" layout="total, prev, pager, next" :total="total"></el-pagination>
    </div>
  </div>
</template>
<script>
import { searchPage } from '@/mixins/search-page'
import { position } from '@/mixins/position'
export default {
  name: 'car-alarm-table',
  mixins: [searchPage, position],
  methods: {
    alarmType(type) {
      switch (type) {
        case 'lowPower':
          return '亏电'
        case 'active':
          return '离线'
        case 'backHome':
          return '驶入运营城市'
        case 'leaveHome':
          return '驶出运营城市'
      }
    },
    handleSearch() {
      let searchObj = { ...this.paging, ...this.searchData }
      this.$service.get_alarmSearchOrPage(searchObj).then(res => {
        this.total = res.data.data.totalElements
        this.tableData = res.data.data.records
      })
    }
  }
}
</script>
