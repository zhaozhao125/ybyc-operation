<template>
  <div id="city-manage-table" class="components-content">
    <!-- 表格开始 -->
    <el-table :data="tableData" height="100%">
      <el-table-column label="运营城市" prop="name" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="carModelName" label="添加时间" show-overflow-tooltip>
        <template slot-scope="scope">
          <div>
            <span v-if="scope.row.createdOn">{{scope.row.createdOn}}</span>
            <span v-else>暂无</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="vin" label="添加人" show-overflow-tooltip>
        <template slot-scope="scope">
          <div>
            <span v-if="scope.row.createdBy">{{scope.row.createdBy}}</span>
            <span v-else>暂无</span>
          </div>
        </template>

      </el-table-column>
      <el-table-column label="操作" fixed="right" min-width="20">
        <template slot-scope="scope">
          <el-button type="text" @click="editList(scope.row.id,2)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 表格结束 -->
    <div class='table-page'>
      <el-pagination @current-change="handleCurrentChange" :current-page.sync="paging.page" :page-size="paging.rows" layout="total, prev, pager, next" :total="total"></el-pagination>
    </div>
  </div>
</template>
<script>
import { branchesSearchPage } from '@/mixins/search-page'
export default {
  name: 'city-manage-table',
  mixins: [branchesSearchPage],
  data() {
    return {}
  },
  methods: {
    // 编辑列表
    editList(id, editNum) {
      // console.log(row,'row')
      this.$service.get_operationCityInfo(id).then(res => {
        console.log(res.data.data, '数据')
        this.$emit('editorData', Object.assign({}, res.data.data), editNum)
      })
    },
    handleSearch() {
      let searchObj = { ...this.paging, ...this.searchData, ...this.name }
      console.log(searchObj, 'searchObj')
      this.$service.post_operationManagePagingOrSearch(searchObj).then(res => {
        this.total = res.data.data.total
        this.tableData = res.data.data.rows
      })
    }
  }
}
</script>
<style lang="scss">
#city-manage-table {
  .table-page {
    margin-top: 20px;
    float: right;
  }
}
</style>
