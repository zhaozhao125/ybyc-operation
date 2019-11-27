<template>
  <div id="area-management-table" class="components-content">
    <!-- 表格开始 -->
    <el-table :data="tableData" height="100%">
      <el-table-column prop="cityName" label="城市" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.cityName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="片区名称" show-overflow-tooltip></el-table-column>
      <el-table-column label="片区属性" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if='scope.row.suburban!==null'>{{scope.row.suburban?'郊区':'城区'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createdOn" label="添加时间" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" fixed="right" width="120">
        <template slot-scope="scope">
          <el-button type="text" @click="editList(scope.row,2)" v-has="'areaManagementEdit'">编辑</el-button>
          <el-popover :ref="'deletePop' + scope.$index" title="" width="200" trigger="click" placement="top">
            <el-button type="text" slot="reference" v-has="'areaManagementDelete'">删除</el-button>
            <P>
              <i class="el-icon-warning" style="color:red;margin-right:5px;"></i>确定删除该片区？</p>
            <div style="text-align: right; margin-top: 10px">
              <el-button size="small" type="text" @click="handleCancel(scope.$index)">取消</el-button>
              <el-button type="primary" size="mini" @click="disableOpen(scope.row.id,scope.$index)">删除</el-button>
            </div>
          </el-popover>
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
  name: 'area-management-table',
  mixins: [branchesSearchPage],
  methods: {
    // 取消删除
    handleCancel(index) {
      this.$refs['deletePop' + index].doClose()
    },
    // 删除片区
    disableOpen(id, index) {
      this.$service.post_stationDistrictDelete(id).then(res => {
        this.$message.success('片区删除成功')
        this.$refs['deletePop' + index].doClose()
        this.handleSearch()
      }).catch(error => {
        this.$message.warning(error.msg)
        this.$refs['deletePop' + index].doClose()
      })
    },
    editList(row, editNum) {
      // alert()
      this.formData = Object.assign({}, row)
      this.$emit('editorData', this.formData, editNum)
    },
    handleSearch() {
      this.flagBit = false
      let searchObj = { ...this.paging, ...this.searchData }
      this.$service.post_areaList(searchObj).then(res => {
        this.total = res.data.data.total
        this.tableData = res.data.data.rows
      })
    }
  }
}
</script>
