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
    <el-dialog :visible.sync='isShowDialog' :title='addOrEditName' width='45%' v-if="isShowDialog">
      <add-or-edit :disNum="disNum" @closePage="closePage" ref='addOrEdit' :formData="formData"></add-or-edit>
    </el-dialog>
    <!-- 添加编辑结束 -->
    <el-card class="table-box">
      <div slot="header">
        <my-search @handleSearchData="handleSearchData" @handleReset="handleReset"></my-search>
      </div>
      <div class="table-operator">
        <el-button type="primary" size="mini" v-has="'chargingPileAdd'" @click="addCarInfo(1)">添加充电桩</el-button>
        <el-button size="small" :loading="exportLoading" @click="exportFile">导出</el-button>
        <el-upload class="upload" :action="importUrl" :on-success="uploadSuccess" :before-upload="beforeAvatarUpload" :on-error="onError" :headers="uploadHeaders" :show-file-list="false">
          <el-button size="small">导入</el-button>
        </el-upload>
        <a href='https://h5.1byongche.com/static/templates/%e5%85%85%e7%94%b5%e6%a1%a9%e5%af%bc%e5%85%a5%e6%a8%a1%e6%9d%bf.xls'>
            <el-button size="small" class="download">下载导入模板</el-button>
          </a>
      </div>
      <my-table :searchData="searchData" @editorData="editorData" ref="myTable"></my-table>
    </el-card>
  </div>
</template>
<script>
import BASE_URL from "@/config/base-url";
import mySearch from "./components/search";
import myTable from "./components/table";
import vPage from "@/components/page";
import addOrEdit from "./components/add-or-edit";
import { resultSelectData } from "@/utils/common";
import { handleDate } from '@/utils/date-filter'
export default {
  name: "coupons-index",
  components: {
    mySearch,
    myTable,
    vPage,
    addOrEdit
  },
  data() {
    return {
      isShowDialog: false,
      provinceList: [],
      xportLoading: false,
      exportLoading: false,
      genreList: [],
      dialogImportVisible: false,
      searchData: {},
      res: {},
      importData: {},
      disNum: null,
      formData: {},
      uploadHeaders: {
        accessToken: this.$store.getters.token
      }
    };
  },
  computed: {
    addOrEditName() {
      return this.disNum === 1 ? "添加充电桩" : "编辑充电桩";
    },
    importUrl() {
      return `${BASE_URL}/optimus/charging/equipments/import`;
    }
  },
  created() {
    //获取城市列表
    this.$service.get_operationCityList().then(res => {
      this.provinceList = resultSelectData(res.data.data);
    });
    //获取车型列表
    this.$service.get_carsInfoDict().then(res => {
      this.genreList = res.data.data.models
    })
  },
  methods: {
    // 关闭窗口
    closePage() {
      this.isShowDialog = false
      this.$refs.myTable.handleSearch()
    },
    addCarInfo(addNum) {
      this.isShowDialog = true
      for (var key in this.formData) {
        delete this.formData[key]
      }
      this.disNum = addNum
    },
    importDetail() {
      this.dialogImportVisible = true;
    },
    onError(error) {
      //接口返回500 可能批量导入的字段不正确
      this.$message.warning("批量导入数据失败,请根据模板格式导入");
    },
    beforeAvatarUpload(file) {
      console.log(file, "file");
      let isXls = file.type === "application/vnd.ms-excel";
      if (!isXls) {
        this.$message.warning("导入文件只能是.xls格式");
      }
      return isXls;
    },
    onProgress() {
      // alert();
    },
    exportFile() {
      this.exportLoading = true
      let searchObj = { ...this.searchData }
      if (searchObj.addTime != undefined && searchObj.addTime.length > 0) {
        searchObj.startCreatedOn = handleDate(searchObj.addTime[0], 'day')
        searchObj.endCreatedOn = handleDate(searchObj.addTime[1], 'day')
      }
      this.$service.get_downloadChargingInfo(searchObj, '充电桩信息.xlsx').then(res => {
        this.exportLoading = false
      }).catch(err => {
        this.exportLoading = false
      })
    },
    // 上传文件返回的数据
    uploadSuccess(res) {
      this.importData = res.data;
      this.$notify({
        offset: 200,
        duration: 0,
        title: "导入结果",
        message: (<div>
        <span>总数据：</span>
      <span>{this.importData.total}条&nbsp;&nbsp;</span>
      <span>导入成功：</span>
      <span style={"color: teal"}>
        {this.importData.success}条&nbsp;&nbsp;
    </span>
      <span>导入失败：</span>
      <span style={"color: red"}>{this.importData.fail}条</span>

      </div>)
      });
      this.$refs.myTable.handleSearch();
    },
    editorData(editorData, editNum) {
      this.disNum = editNum
      // this.formData = editorData
      let ID = {}
      ID.sn = editorData.sn
      this.$service.getChargingPileInfo(ID).then(res => {
        this.formData = res.data.data;
        this.formData.stationName = editorData.stationName
      })
      this.isShowDialog = true
    },
    // 回传搜索数据
    handleSearchData(searchData) {
      this.searchData = Object.assign({}, searchData);
    },
    //重置搜索数据
    handleReset() {
      this.searchData = {};
    }
  }
};

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
