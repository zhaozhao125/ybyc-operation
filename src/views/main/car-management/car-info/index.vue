<template>
  <div id="car-info-index" class="list-page">
    <!-- 导入之后的详情数据 -->
    <el-dialog title="导入失败详情数据" :visible.sync="dialogImportVisible">
      <el-table :data="importData.failRows">
        <el-table-column property="data" label="车牌号" width="150"></el-table-column>
        <el-table-column property="msg" label="失败原因" width="200"></el-table-column>
        <el-table-column property="number" label="失败数据位置" min-width="180">
          <template slot-scope="scope">
            <span>第{{scope.row.number}}行</span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!-- 添加编辑开始 -->
    <v-page :visible.sync="addOrEditPage" ref="vPage">
      <h3 slot="title"> {{addOrEditName}}</h3>
      <template slot="content">
        <add-or-edit :disNum="disNum" @closeAndRefresh="closeAndRefresh" :formData="formData" :carDentifying="carDentifying" @on-net="websetDialogShow"></add-or-edit>
      </template>
    </v-page>
    <!-- 车辆信息和修改 -->
    <!-- <v-page :visible.sync="inforPage" ref="info">
      <h3 slot="title"> 车辆详情</h3>
      <template slot="content">
         <common-infor></common-infor>
      </template>
    </v-page> -->
    <el-card class="table-box">
      <div slot="header">
        <my-search @handleSearchData="handleSearchData" @handleReset="handleReset"></my-search>
      </div>
      <div class="table-operator">
        <el-button type="primary" size="mini" @click="addCarInfo(1)" v-has="'carInfoAddCar'">添加车辆</el-button>
        <el-upload class="upload" v-has="'carInfoUpload'" :action="importUrl" :on-success="uploadSuccess" :before-upload="beforeAvatarUpload" :on-error="onError" :headers="uploadHeaders" :show-file-list="false">
          <el-button size="small">批量导入</el-button>
        </el-upload>
        <a href='https://h5.1byongche.com/static/templates/%E8%BD%A6%E8%BE%86%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xls'>
          <el-button v-has="'carInfoDownload'" size="small" class="download">下载模板</el-button>
        </a>
        <el-button size="small" v-has="'carInfoExport'" :loading="exportLoading" @click="exportFile">导出</el-button>
      </div>
      <my-table :searchData="searchData" @editorData="editorData" :otherCarNumber='otherCarNumber' ref="myTable" @on-reloadList="reloadList"></my-table>
    </el-card>
    <webset-dialog ref="netShow" @closeAndRefresh="closeAndRefresh"></webset-dialog>
  </div>
</template>
<script>
import BASE_URL from '@/config/base-url'
import mySearch from './components/search'
import myTable from './components/table'
import vPage from '@/components/page'
import addOrEdit from './components/add-or-edit'
import websetDialog from './components/websetDialog.vue'
export default {
  name: 'car-info-index',
  components: {
    mySearch,
    myTable,
    vPage,
    addOrEdit,
    websetDialog
  },
  props: ['params'],
  watch: {
    params() {
      this.handleParamsChange()
    }
  },
  mounted() {
    this.handleParamsChange()
  },
  data() {
    return {
      otherCarNumber: null,
      dialogImportVisible: false,
      searchData: {},
      res: {},
      importData: {},
      test: 'wen',
      addOrEditPage: false,
      inforPage: false,
      disNum: null,
      formData: {},
      carDentifying: null,
      uploadHeaders: {
        accessToken: this.$store.getters.token
      },
      exportLoading: false
    }
  },
  computed: {
    addOrEditName() {
      return this.disNum === 1 ? '添加车辆' : '编辑车辆'
    },
    importUrl() {
      return `${BASE_URL}/optimus/cars/info/upload`
    }
  },
  methods: {
    // 车辆信息显示
    // showInfor (val) {
    //   console.log(val)
    //   this.inforPage = true
    //   this.addOrEditPage = false
    // },
    websetDialogShow(val) {
      this.$refs.netShow.show(val)
    },
    // 从别的标签页传参到当前页面
    handleParamsChange() {
      if (this.params && this.params.carNumber) {
        this.otherCarNumber = this.params.carNumber
        this.$nextTick(() => {
          this.searchData.keyWords = this.params.carNumber
          this.$refs.myTable.handleSearch()
        })
      } else {
        this.carNumber = ''
      }
    },
    importDetail() {
      this.dialogImportVisible = true
    },
    onError(error) {
      // 接口返回500 可能批量导入的字段不正确
      this.$message.warning('批量导入数据失败,请根据模板格式导入')
    },
    beforeAvatarUpload(file) {
      console.log(file, 'file')
      let isXls = file.type === 'application/vnd.ms-excel'
      if (!isXls) {
        this.$message.warning('导入文件只能是.xls格式')
      }
      return isXls
    },
    exportFile() {
      this.exportLoading = true
      this.$service.get_downloadCarInfo(this.searchData, '车辆信息.xlsx').then(res => {
        this.exportLoading = false
      }).catch(err => {
        this.exportLoading = false
      })
    },
    onProgress() {
      // alert();
    },
    // 上传文件返回的数据
    uploadSuccess(res) {
      this.importData = res.data
      this.$notify({
        offset: 200,
        duration: 0,
        title: '导入结果',
        message: (<div>
            <span>总数据：</span>
            <span>{this.importData.total}条&nbsp;&nbsp;</span>
            <span>导入成功：</span>
            <span style={'color: teal'}>
              {this.importData.success}条&nbsp;&nbsp;
            </span>
            <span>导入失败：</span>
            <span style={'color: red'}>{this.importData.fail}条</span>
            <el-button
              type="text"
              v-show={this.importData.fail}
              onClick={this.importDetail}
            >
              查看详情
            </el-button>
          </div>)
      })
      this.$refs.myTable.handleSearch()
    },
    editorData(editorData, editNum, carSn) {
      console.log(editorData, editNum, carSn)
      this.disNum = editNum
      this.formData = editorData
      this.addOrEditPage = true
      this.carDentifying = carSn
    },
    // 关闭窗口
    closeAndRefresh(cancel) {
      this.$refs.vPage.goBack()
      // 刷新列表 如果点击返回按钮直接return
      if (cancel) {} else {
        this.$refs.myTable.handleSearch()
      }
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
    },
    reloadList() {
      console.log(22222)
      this.handleParamsChange()
    }
  }
}

</script>
<style lang="scss">
#car-info-index {
  .table-operator {
    display: flex;

    // margin-bottom: 0px;
    .upload {
      margin: 0 12px;
    }

    .download {
      margin-right: 12px;
    }
  }
}

</style>
