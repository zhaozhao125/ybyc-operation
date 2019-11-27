<template>
  <div id="chargingPileGenre">
    <!-- 详情页开始 -->
    <v-page :visible.sync="detailPage">
      <h3 slot="title">充电桩详情</h3>
      <template slot="content">
        <!-- 详情页组件 -->
        <v-detail :detailData="detailData"></v-detail>
      </template>
    </v-page>
    <!-- 详情页结束 -->
    <el-card class="table-box">
      <div slot="header">
        <v-search :searchSettings="searchSettings" @search="handleSearch" labelWidth="120px">
        </v-search>
      </div>

      <div class="table-operator">
        <el-button type="primary" size="small" v-has="'chargingPileGenreAdd'" @click="addGenre(1)">添加类型</el-button>
      </div>

      <div class="table-container">
        <el-table :data="tableData" height="100%">
          <el-table-column prop="id" align="center" min-width="40px" label="id"></el-table-column>
          <el-table-column label="充电桩类型名称" min-width="140">
            <template slot-scope="scope">
              <el-button type="text" @click="detailItem(scope.row)"> {{scope.row.equipmentModelName}}</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="equipmentType" label="电流类型" min-width="100px">
            <template slot-scope="scope">
              <div v-if="scope.row.equipmentType == 'AC'">交流</div>
              <div v-if="scope.row.equipmentType == 'DC'">直流</div>
            </template>
          </el-table-column>
          <el-table-column prop="smart" label="设备类型" min-width="100px">
            <template slot-scope="scope">
              <div v-if="scope.row.smart">智能桩</div>
              <div v-else>非智能桩</div>
            </template>
          </el-table-column>

          <el-table-column prop="createdOn" label="添加时间" min-width="200px">
            <template slot-scope="scope">
              <div>
                <div>{{scope.row.createdOn|timeFilter}}</div>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="操作" fixed="right" min-width="100px">
            <template slot-scope="scope">
              <el-button class="el-button--text" v-has="'chargingPileGenreEdit'" type="text" @click="editList(scope.row,2)">编辑</el-button>
              <el-popover :ref="'deletePop' + scope.$index" title="" width="270" trigger="click" placement="top">
                <el-button type="text" v-has="'chargingPileGenreDel'" slot="reference">删除</el-button>
                <P style="line-height:25px">
                  <i class="el-icon-warning" style="color:red;margin-right:5px;"></i>充电桩类型删除后，相关数据无法查询，请谨慎操作。确定删除？</p>
                <div style="text-align: right">
                  <el-button size="small" type="text" @click="handleCancel(scope.$index)">取消</el-button>
                  <el-button type="primary" size="mini" @click="deleteItem(scope.row.id,scope.$index)">删除</el-button>
                </div>
              </el-popover>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class='table-page'>
        <el-pagination :current-page="page" :page-size="pageSize" layout="total, prev, pager, next" :total="pageTotal" @current-change="_handlePageChange">
        </el-pagination>
      </div>
    </el-card>

    <!-- 添加编辑开始 -->
    <el-dialog :visible.sync='isShowDialog' :title='addOrEditName' width='45%' v-if="isShowDialog">
      <add-or-edit :disNum="disNum" @closePage="closePage" ref='addOrEdit' :formData="formData"></add-or-edit>
    </el-dialog>
    <!-- 添加编辑结束 -->

  </div>
</template>
<script>
  import vDetail from './components/detail';
import { resultSelectData } from '@/utils/common';
import popSwitch from '@/components/pop-switch'
  import websiteSelect from '@/components/website-select';
import searchHistoryMixin from '@/mixins/search-history.js'
import paginationMixin from '@/mixins/pagination.js'
import {handleDictData, handleSubmitSearchData} from '@/utils/common.js';
import { handleDate } from '@/utils/date-filter'
import addOrEdit from "./components/add-or-edit";

export default {
  name: 'chargingPileGenre',
  components: {
    websiteSelect,
    popSwitch,
    addOrEdit,
    vDetail
  },
  mixins: [searchHistoryMixin, paginationMixin],
  data() {
    return {provinceList: [],
      detailPage: false,
      labelWidth: '220px',
      tableData: [],
      detailData: {},
      isShowDialog: false,
      disNum: null,
      formData: {},
      templateTitle: null,
      templateVisible: false,
      rowId: null,
      searchSettings: [{
        label: '类型名称',
        type: 'text',
        name: 'equipmentModelName',
        visible: true
      },
        {
          label: '添加时间',
          visible: true,
          name: 'createdOn',
          type: 'daterange',
          // unixTime: true
          // 直接转成时间戳
          // unixTime: true
        }
      ]}
    },

  computed: {
    user() {
      return this.$store.getters.user
    },
    addOrEditName() {
      return this.disNum === 1 ? "添加充电桩类型" : "编辑充电桩类型";
    },
  },
  created() {
    this.loadTableData()
  },
  methods: {
    // 关闭窗口
    closePage() {
      this.isShowDialog = false
      this.loadTableData()
    },
    addGenre(addNum) {
      this.isShowDialog = true
      for (var key in this.formData) {
        delete this.formData[key]
      }
      this.disNum = addNum
    },
    handleSearch(data) {
      let searchData = Object.assign({}, data)
        searchData = handleSubmitSearchData(searchData)
      if(searchData.createdOn != undefined && searchData.createdOn.length > 0){
        searchData.startCreatedOn = handleDate(searchData.createdOn[0],'day')
        searchData.endCreatedOn = handleDate(searchData.createdOn[1],'day')
      }
      console.log(searchData)
      this.searchData = searchData
        this.page = 1
        this.loadTableData()
      },
    editList(editorData, editNum) {
      this.disNum = editNum
      if (editorData.images) {
        editorData.images = [
          {
            name: editorData.images[0].split('/').pop(),
            url: editorData.images[0]
          }
        ]
      }else{
        editorData.images = []
      }
      this.formData = editorData
      // let ID = {}
      // ID.id = editorData.id
      // this.$service.ChargePileGenreInfo(ID).then(res => {
      //   console.log(res.data.data)
      //   this.formData =  res.data.data.records;
      // })
      this.isShowDialog = true
    },
    // 详情
    detailItem(row) {
      console.log(row,1111)
      this.detailData = row
      this.detailPage = true
      // let ID = {}
      // ID.sn = sn
      // this.$service.getChargingPileInfo(ID).then(res => {
      //   this.detailData = res.data.data
      // })
      // this.$nextTick(() => {
      //   this.detailPage = true
      // })
    },
    // 取消删除
    handleCancel(index) {
      this.$refs['deletePop' + index].doClose()
      },
    // 删除类型
    deleteItem(id, index) {
      // let ID = {}
      //   ID.id = id
      //   let obj = {...ID}
      //   console.log(obj)
      this.$service.ChargePileGenreDel(id).then(res => {
        this.$message.success('删除成功')
          this.$refs['deletePop' + index].doClose()
          this.loadTableData()
        }).catch(error => {
        this.$message.warning(error.msg ? error.msg : '删除失败')
        this.$refs['deletePop' + index].doClose()
        })
      },

    loadTableData() {
      this.pageSize = 20
        let params = {page: this.page, pageSize: this.pageSize, ...this.searchData}

        this.$service.getChargePileGenreList(params).then(res => {
          console.log(res)
          this.tableData = res.data.data.records;
          this._changePageTotal(Number(res.data.data.totalElements))
        })
      }
  }
}
</script>
<style lang="scss">
  .el-form-item__label{
    width:100px;
  }
</style>
