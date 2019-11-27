<template>
  <div id="coupons-index" class="list-page">
    <!-- 导入之后的详情数据 -->
    <el-dialog title="导入失败详情数据" :visible.sync="dialogImportVisible">
      <el-table :data="importData.failRows">
        <el-table-column property="couponsCode" label="优惠券编号" width="150"></el-table-column>
        <el-table-column property="errorMessage" label="失败原因" width="200"></el-table-column>
        <el-table-column property="excelNumber" label="失败数据位置" min-width="180">
          <template slot-scope="scope">
            <span >第{{scope.row.excelNumber}}行</span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!-- 添加编辑开始 -->
    <v-page :visible.sync="addOrEditPage" ref="vPage">
      <h3 slot="title"> {{addOrEditName}}</h3>
      <template slot="content">
        <add-or-edit :disNum="disNum" :provinceList="provinceList" :genreList="genreList" @closeAndRefresh="closeAndRefresh" :formData="formData"></add-or-edit>
      </template>
    </v-page>
    <!-- 添加编辑结束 -->
    <el-card class="table-box">
      <div slot="header">
        <my-search @handleSearchData="handleSearchData" @handleReset="handleReset"></my-search>
      </div>
      <div class="table-operator">
        <el-button type="primary" v-has="'couponsAdd'" size="mini" @click="addCarInfo(1)">添加优惠券</el-button>
        <el-upload class="upload" :action="importUrl" :on-success="uploadSuccess" :before-upload="beforeAvatarUpload" :on-error="onError" :headers="uploadHeaders" :show-file-list="false">
          <el-button v-has="'batchSendCoupons'" size="small">批量发券</el-button>
        </el-upload>
        <a href='https://h5.1byongche.com/static/templates/%e4%bc%98%e6%83%a0%e5%88%b8%e5%af%bc%e5%85%a5%e6%a8%a1%e7%89%88.xls'>
            <el-button size="small" class="download">下载模板</el-button>
          </a>
      </div>
      <my-table :searchData="searchData" @editorData="editorData" ref="myTable"></my-table>
    </el-card>
  </div>
</template>
<script>
import BASE_URL from '@/config/base-url';
import mySearch from './components/search';
import myTable from './components/table';
import vPage from '@/components/page';
import addOrEdit from './components/add-or-edit';
import { resultSelectData } from '@/utils/common';
export default {
  name: 'coupons-index',
  components: {
    mySearch,
    myTable,
    vPage,
    addOrEdit
  },
  data() {
    return {
      provinceList: [],
      genreList: [],
      dialogImportVisible: false,
      searchData: {},
      res: {},
      importData: {},
      addOrEditPage: false,
      disNum: null,
      formData: {},
      uploadHeaders: {
        accessToken: this.$store.getters.token
      }
    }
  },
  computed: {
    addOrEditName() {
      return this.disNum === 1 ? '添加优惠券' : '编辑优惠券';
    },
    importUrl() {
      return `${BASE_URL}/optimus/coupons/info/upload`
    }
  },
  created() {
    // 获取城市列表
    this.$service.get_operationCityList().then(res => {
      this.provinceList = resultSelectData(res.data.data)
    })
    //获取车型列表
    this.$service.get_carsInfoDict().then(res => {
      this.genreList = res.data.data.models
    })
  },
  methods: {
    importDetail() {
      this.dialogImportVisible = true
    },
    onError(error) {
      // 接口返回500 可能批量导入的字段不正确
      this.$message.warning('批量导入数据失败,请根据模板格式导入')
    },
    beforeAvatarUpload(file) {
      console.log(file, 'file')
      let isXls = file.type === 'application/vnd.ms-excel';
      if (!isXls) {
        this.$message.warning('导入文件只能是.xls格式')
      }
      return isXls
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
    editorData(editorData, editNum, id) {
      this.disNum = editNum
      let ID = {}
      ID.id = id
      // console.log(editorData)
      this.$service.getCouponsInfo(ID).then(res => {
        let tmpData = res.data.data
        // console.log(this.formData,1111)
        this.addOrEditPage = true
        this.carDentifying = id
        tmpData.issueTime = [tmpData.redeemStartTime, tmpData.redeemEndTime]
        tmpData.useTime = [tmpData.startDate, tmpData.endDate]
        if (tmpData.cityId) {
          if (!Array.isArray(tmpData.cityId)) {
            tmpData.cityId = tmpData.cityId.split(',')
          }
        } else {
          tmpData.cityId = [999]
        }
        if (tmpData.genreIdentify) {
          if (!Array.isArray(tmpData.genreIdentify)) {
            tmpData.genreIdentify = tmpData.genreIdentify.split(',')
          }
        } else {
          tmpData.genreIdentify = []
        }
        if (tmpData.redeemCodeCount) {
          tmpData.convertType = 2
        } else {
          tmpData.convertType = 1
        }
        this.formData = tmpData
        console.log(tmpData, 111)
      })
    },
    // 关闭窗口
    closeAndRefresh(cancel) {
      this.$refs.vPage.goBack();
      // 刷新列表 如果点击返回按钮直接return
      if (cancel) {} else {
        this.$refs.myTable.handleSearch();
      }
    },
    // 添加优惠券
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
      console.log(this.searchData.addTime)
      if (this.searchData.addTime == undefined || this.searchData.addTime.length == 0) {
        this.searchData.addTime = ['', '']
      }
    },
    // 重置搜索数据
    handleReset() {
      this.searchData = {}
    }
  }
}

</script>
<style lang="scss">
#coupons-index {
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
