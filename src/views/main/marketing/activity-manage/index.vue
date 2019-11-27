<template>
  <div id="coupons-index" class="list-page">
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
          <el-button type="primary" size="mini" v-has="'addActivity'" @click="addActivity(1)">添加活动</el-button>
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
  name: 'activity-index',
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
      return this.disNum === 1 ? '添加活动' : '编辑活动';
    }
  },
  created() {
    // 获取城市列表
    // this.$service.get_operationCityList().then(res => {
    //   this.provinceList = resultSelectData(res.data.data)
    // })
  },
  methods: {
    importDetail() {
      this.dialogImportVisible = true
    },
    onProgress() {
      // alert();
    },
    editorData(editorData, editNum, id) {
      this.disNum = editNum
      let ID = {}
      ID.id = id
      this.$service.getCouponsInfo(ID).then(res => {
        let tmpData = res.data.data
        this.addOrEditPage = true
        this.carDentifying = id
        tmpData.issueTime = [tmpData.redeemStartTime, tmpData.redeemEndTime]
        tmpData.useTime = [tmpData.startDate, tmpData.endDate]
        if (tmpData.cityId) {
          if (!Array.isArray(tmpData.cityId)) {
            tmpData.cityId = tmpData.cityId.split(',')
          }
        } else{
          tmpData.cityId = [999]
        }

        if (tmpData.genreIdentify) {
          if (!Array.isArray(tmpData.genreIdentify)) {
            tmpData.genreIdentify = tmpData.genreIdentify.split(',')
          }
        }else {
          tmpData.genreIdentify = []
        }
        if (tmpData.redeemCodeCount) {
          tmpData.convertType = 2
        } else{
          tmpData.convertType = 1
        }
        this.formData = tmpData
      })
    },
    // 关闭窗口
    closeAndRefresh(cancel) {
      this.$refs.vPage.goBack();
      // 刷新列表 如果点击返回按钮直接return
      if (cancel) {

      } else {
        this.$refs.myTable.refreshTable();
      }
    },
    // 添加活动
    addActivity(addNum) {
      this.addOrEditPage = true
      for (var key in this.formData) {
        delete this.formData[key]
      }
      this.disNum = addNum
    },
    // 回传搜索数据
    handleSearchData(searchData) {
      this.searchData = Object.assign({}, searchData)
      // console.log(this.searchData.addTime)
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
#activity-index {
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
