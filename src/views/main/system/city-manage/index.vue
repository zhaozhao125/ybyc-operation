<template>
  <div id="city-manage-index">

    <!-- 添加or编辑开始 -->
    <v-page :visible.sync="showAddOrEditPage" ref="vPage">
      <h3 slot="title"> {{disNum === 1 ? '添加城市' : '编辑城市'}}</h3>
      <template slot="content">
        <add-or-edit @refreshTable='refreshTable' :formData='formData' :disNum='disNum'></add-or-edit>
      </template>
    </v-page>
    <!-- 添加or编辑结束 -->

    <!-- 搜索and列表开始-->
    <el-card class="table-box">
      <div slot="header">
        <v-search :searchSettings="searchSetting" @search="handleSearch" @reset="handleReset" ref='vSearch'>
          <template slot="name" slot-scope="scope">
            <search-select v-model="cityObj" type="city" placeholder="请选择运营城市" integratedValue></search-select>
          </template>
        </v-search>
      </div>
      <div class="table-operator">
        <el-button type="primary" size="small" @click="addCity(1)">添加城市</el-button>
      </div>
      <my-table :searchData='searchData' @editorData='editorData' ref="myTable"></my-table>
    </el-card>
    <!--  搜索and列表结束-->
  </div>

</template>
<script>
import searchSelect from '@/components/website-select'
import addOrEdit from './components/add-or-edit'
import { submitSearchDataMixin } from '@/mixins/search-page'
import searchHistoryMixin from '@/mixins/search-history'
import myTable from './components/table'
// 思路
export default {
  name: 'city-manage-index',
  mixins: [searchHistoryMixin, submitSearchDataMixin],
  data() {
    return {
      cityObj: '', // js可以修改类型 默认定义一个字符串 但是运营城市下拉框会返回对象
      formData: {},
      searchData: {}, // 提交的搜索字段
      disNum: null, // 添加或者编辑标题文案
      showAddOrEditPage: false, // 是否显示添加或者便捷页面
      searchSetting: [
        {
          label: '搜索',
          name: 'name',
          type: 'slot',
          visible: true,
          value: ''
        }
      ]
    }
  },
  methods: {
    handleReset() {
      this.cityObj = {}
    },
    // 刷新列表
    refreshTable() {
      this.showAddOrEditPage = false
      this.$refs.myTable.handleSearch()
      // alert()
    },
    editorData(editorData, editNum) {
      // alert(editNum)
      this.disNum = editNum
      this.formData = editorData
      console.log(this.formData, '带过来的数据')
      this.showAddOrEditPage = true
    },
    // 重置搜索数据
    resetSearch() {
      this.searchData = {}
    },
    // 覆盖mixin处理搜索数据
    handleSearch() {
      let obj = {
        name: this.cityObj.label
      }
      this.searchData = obj
    },
    // 添加运营城市
    addCity(disNum) {
      // 清空对象
      for (var key in this.formData) {
        delete this.formData[key]
      }
      this.disNum = disNum
      this.showAddOrEditPage = true
    }
  },
  components: {
    addOrEdit,
    myTable,
    searchSelect
  }
}
</script>
<style lang="scss">

</style>
