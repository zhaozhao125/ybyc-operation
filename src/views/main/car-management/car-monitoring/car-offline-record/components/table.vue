<template>
  <div id="car-offline-record-table" class="components-content">
    <el-table :data="tableData" height="100%">
      <el-table-column prop="carNumber" label="车牌号" show-overflow-tooltip min-width="120"> </el-table-column>
      <el-table-column label="类别" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-tag v-if="scope.row.typeCode ==='activeRegain'" type="success">上线</el-tag>
          <el-tag v-else type="danger">离线</el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="carModelName" label=" 车型" show-overflow-tooltip min-width="100"> </el-table-column>
      <el-table-column prop="carState" label="操作时间" show-overflow-tooltip min-width="150">
        <template slot-scope="scope">
          <span>{{scope.row.notifyDate|formatData}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="carState" label="操作地点" show-overflow-tooltip>
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
import { tableSettings } from './data'
import { searchPage } from '@/mixins/search-page'
import { position } from '@/mixins/position'
export default {
  name: 'car-offline-record-table',
  mixins: [searchPage, position],
  methods: {
    handleSearch() {
      let searchObj = { ...this.paging, ...this.searchData }
      this.$service.get_offlineRecordSearchOrPage(searchObj).then(res => {
        this.total = res.data.data.totalElements
        this.tableData = res.data.data.records
      })
    }
  }
}
</script>
