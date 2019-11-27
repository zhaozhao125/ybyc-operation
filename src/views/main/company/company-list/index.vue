<template>
  <div class="company-list">
    <el-card class="table-box">
      <div slot="header">
        <v-search :searchSettings="searchSettings" labelWidth="130px" @search="handleSearch" @reset="handleReset"></v-search>
      </div>
      <div class="table-operator">
        <el-button type="primary" size="small" @click="handleNewCompany">创建企业</el-button>
      </div>
      <div class="table-container">
        <el-table :data="tableData" height="100%">
          <el-table-column prop="sn" label="编号" min-width="120">
            <template slot-scope="scope">
              <el-button type="text" @click="handleShowDetail(scope.row.sn)">{{scope.row.sn}}</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="企业名称" min-width="180">
          </el-table-column>
          <el-table-column prop="cityName" label="城市" min-width="100">
          </el-table-column>
          <el-table-column prop="staffs" label="企业员工" min-width="90">
            <template slot-scope="scope">
              <el-button type="text" @click="handleShowEmployee(scope.row.sn)">{{scope.row.staffs}}</el-button>
            </template>
          </el-table-column>
          <el-table-column label="余额" min-width="160">
            <template slot-scope="scope">
              <p>充值余额：{{scope.row.companyMoneyDTO.companyMoney}}</p>
              <p>赠送余额：{{scope.row.companyMoneyDTO.companyMoneyPresentation}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="phone" label="联系电话" min-width="150">
          </el-table-column>
          <el-table-column prop="createdTime" label="创建时间" min-width="180">
            <template slot-scope="scope">
              {{scope.row.createdTime | timeFilter}}
            </template>
          </el-table-column>
          <el-table-column prop="opened" label="是否启用" width="100">
            <template slot-scope="scope">
              <span class="state-green" v-if="scope.row.opened">是</span>
              <span class="state-gray" v-else>否</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="table-page">
        <el-pagination :current-page="page" :page-size="pageSize" layout="total, prev, pager, next" :total="pageTotal" @current-change="_handlePageChange">
        </el-pagination>
      </div>
    </el-card>
    <v-page :visible.sync="employeeVisible">
      <h3 slot="title">企业员工</h3>
      <v-employees slot="content" :sn="sn"></v-employees>
    </v-page>
    <company-editor :visible.sync="editorVisible" :formData="formData" @close="close"></company-editor>
    <company-detail :visible.sync="detailVisible" :sn="sn" @edit="edit" @close="close"></company-detail>
  </div>
</template>

<script>
import searchSettings from './components/searchSettings.js'
import paginationMixin from '@/mixins/pagination.js'
import { handleSubmitSearchData } from '@/utils/common.js'
import vEmployees from './components/employees'
import companyEditor from './components/edit/company-editor'
import companyDetail from './components/detail/company-detail'
export default {
  name: 'companyList',

  mixins: [paginationMixin],

  components: {
    vEmployees,
    companyEditor,
    companyDetail
  },
  props: ['params'],
  data() {
    return {
      employeeVisible: false,
      searchSettings: searchSettings,
      tableData: [],
      searchData: null,
      editorVisible: false,
      detailVisible: false,
      sn: '',
      formData: {}
    }
  },

  created() {
    this.loadTableData()
    this.handleParamsChange()
  },

  watch: {
    params() {
      this.handleParamsChange()
    },
    employeeVisible(visible) {
      if (!visible) {
        this.loadTableData()
      }
    }
  },

  methods: {
    handleParamsChange() {
      if (this.params && this.params.companyName) {
        this.formData.name = this.params.companyName
        this.formData.applyId = this.params.id
        this.editorVisible = true
        console.log(this.formData)
      }
    },
    close() {
      this.loadTableData()
      this.formData = {}
    },
    loadTableData() {
      let params = {
        page: this.page,
        rows: this.pageSize,
        ...this.searchData
      }
      this.$service
        .getCompanyList(params)
        .then(res => {
          console.log('====res====', res)
          this.tableData = res.data.data.records
          this._changePageTotal(res.data.data.totalElements)
        })
    },
    handleSearch(params) {
      console.log('====params====', params)
      let searchData = Object.assign({}, params)
      if (searchData.createTime && searchData.createTime.length) {
        searchData.startDate = searchData.createTime[0] * 1000
        searchData.endDate = searchData.createTime[1] * 1000
        delete searchData.createTime
      }
      searchData = handleSubmitSearchData(searchData)
      this.searchData = searchData
      this.page = 1
      this.loadTableData()
    },
    handleReset() {
      this.searchData = null
    },
    handleNewCompany() {
      this.editorVisible = true
    },
    edit(formData) {
      this.formData = formData
      this.detailVisible = false
      this.editorVisible = true
    },
    handleShowDetail(sn) {
      this.detailVisible = true
      this.sn = sn
    },
    handleShowEmployee(sn) {
      this.sn = sn
      this.employeeVisible = true
    }
  }
}
</script>

<style lang="scss">
</style>
