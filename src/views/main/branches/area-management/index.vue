<template>
  <div id="area-management-index">
    <!-- 车型详情对话框 开始-->
    <el-dialog :visible.sync='isShowDialog' :title='addOrEditName' width='35%' v-if="isShowDialog">
      <add-or-edit :disNum="disNum" @closePage="closePage" ref='addOrEdit' :formData="formData" :carDentifying="carDentifying"></add-or-edit>
    </el-dialog>
    <!--  车型详情对话框 结束-->
    <el-card class="table-box">
      <div slot="header">
        <my-search @handleSearchData="handleSearchData" @handleReset="handleReset"></my-search>
      </div>

      <div class="table-operator">
        <el-button type="primary" size="mini" @click="addArea(1)" v-has="'areaManagementAddArea'">新增片区</el-button>

      </div>
      <my-table :searchData="searchData" @editorData="editorData" ref="myTable"></my-table>
    </el-card>
  </div>
</template>
<script>
import mySearch from './components/search'
import myTable from './components/table'
import addOrEdit from './components/add-or-edit'
export default {
  name: 'area-management-index',
  components: {
    mySearch,
    myTable,
    addOrEdit
  },
  data() {
    return {
      isShowDialog: false,
      searchData: {},
      addOrEditPage: false,
      disNum: null,
      formData: {},
      carDentifying: null,
      uploadHeaders: {
        accessToken: this.$store.getters.token
      }
    }
  },
  computed: {
    addOrEditName() {
      return this.disNum === 1 ? '新增片区' : '编辑片区'
    }
  },
  mounted() {
    console.log(this.$service, '=====请求的所有接口=====')
  },

  methods: {
    editorData(editorData, editNum) {
      this.disNum = editNum
      this.formData = editorData
      this.isShowDialog = true
    },
    // 关闭窗口
    closePage() {
      this.isShowDialog = false
      this.$refs.myTable.handleSearch()
    },
    // 新增片区
    addArea(addNum) {
      this.isShowDialog = true
      for (var key in this.formData) {
        delete this.formData[key]
      }
      this.disNum = addNum
    },
    // 回传搜索数据
    handleSearchData(searchData) {
      this.searchData = Object.assign({}, searchData)
    },
    // 重置搜索数据
    handleReset() {
      this.searchData = {}
    }
  }
}
</script>
<style lang="scss" scoped>
#area-management-index {
}
</style>
