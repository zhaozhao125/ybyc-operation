<template>
  <div id="branch-list-index" class="list-page">
    <!-- 添加编辑开始 -->
    <v-page :visible.sync="addOrEditPage" ref="vPage">
      <h3 slot="title"> {{addOrEditName}}</h3>
      <template slot="content">
        <add-or-edit :disNum="disNum" @closeAndRefresh="closeAndRefresh" :formData="formData" :areaList="areaList"></add-or-edit>
      </template>
    </v-page>
    <!-- 添加编辑结束  -->
    <el-card class="table-box">
      <div slot="header">
        <my-search @handleSearchData="handleSearchData" @handleReset="handleReset" ref='mySearch'></my-search>
      </div>
      <div class="table-operator">
        <el-button type="primary" size="small" @click="addCarInfo(1)" v-has="'branchesListAdd'">添加网点</el-button>
        <!-- 导出 -->
        <el-button size="small" :loading="exportLoading" @click="exportFile" v-has="'branchesListExport'">导出</el-button>
      </div>
      <my-table :searchData="searchData" @editorData="editorData" ref='myTable' :websiteName='websiteName'></my-table>
    </el-card>
  </div>
</template>
<script>
import mySearch from './components/search'
import myTable from './components/table'
import vPage from '@/components/page'
import addOrEdit from './components/add-or-edit'
export default {
  name: 'branch-list-index',
  props: ['params'],
  watch: {
    params() {
      this.handleParamsChange()
    }
  },
  components: {
    mySearch,
    myTable,
    vPage,
    addOrEdit
  },
  data() {
    return {
      websiteName: '',
      searchData: {},
      addOrEditPage: false,
      disNum: null,
      formData: {},
      carDentifying: null,
      areaList: [], // 片区数据
      uploadHeaders: {
        accessToken: this.$store.getters.token
      },
      exportLoading: false
    }
  },
  mounted() {
    this.handleParamsChange()
  },
  computed: {
    addOrEditName() {
      return this.disNum === 1 ? '添加网点' : '编辑网点'
    }
  },
  methods: {
    // 从别的标签页传参到当前页面
    handleParamsChange() {
      // console.log(this.params, 'params')
      if (this.params && this.params.websiteName) {
        this.websiteName = this.params.websiteName
        this.$nextTick(() => {
          this.searchData.name = this.params.websiteName
          this.$refs.myTable.handleSearch()
        })
      } else {
        this.websiteName = ''
      }
    },
    exportFile() {
      this.exportLoading = true
      this.$service.get_downloadWebsiteList(
        this.searchData,
        '网点.xlsx'
      ).then(res => {
        this.exportLoading = false
      }).catch(err => {
        this.exportLoading = false
      })
    },
    editorData(editorData, editNum, areaList) {
      this.disNum = editNum
      if (this.disNum === 2 && editorData.imgDescribe && editorData.imgDescribe.length) {
        editorData.imgsUploadText = editorData.imgDescribe
      }
      this.formData = editorData
      this.addOrEditPage = true
      // 片区下拉列表数据·
      this.areaList = areaList
    },
    // 关闭窗口
    closeAndRefresh() {
      this.$refs.vPage.goBack()
      this.$refs.myTable.handleSearch()
    },
    // 添加车辆
    addCarInfo(addNum) {
      this.addOrEditPage = true
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
<style lang="scss">

</style>
