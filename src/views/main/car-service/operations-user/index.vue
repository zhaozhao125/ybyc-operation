<template>
  <div class="operations-user">
    <el-card class="table-box">
      <div slot="header">
        <v-search ref="search" :searchSettings="searchSettings" labelWidth="120px" @search="handleSearch" @reset="handleResetSearch" @changeCity="handleChangeCity">
          <template slot="districtId" slot-scope="scope">
            <el-select v-model="scope.model.districtId" :placeholder="districtPlaceholder" :disabled="districtDisabled" clearable>
              <el-option v-for="item in districtOptions" :key="item.value" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </template>
          <template slot="stationId" slot-scope="scope">
            <el-select v-model="scope.model.stationId" :placeholder="stationPlaceholder"  remote filterable clearable :remote-method="searchStationMethod" :loading="loadingStation">
              <el-option v-for="item in stationOptions" :key="item.value" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </template>
        </v-search>
      </div>
      <div class="table-operator">
        <el-button type="primary" size="small" @click="handleShowCreateUser" v-has="'operationsUserAddUser'">添加用户</el-button>
      </div>
      <div class="table-container">
        <opUserTable :tableData="tableData" @showDetail="handleShowDetail" @edit="handleEdit"></opUserTable>
      </div>
      <div class="table-page">
        <el-pagination :current-page="page" :page-size="pageSize" layout="total, prev, pager, next" :total="pageTotal" @current-change="_handlePageChange">
        </el-pagination>
      </div>
    </el-card>
    <addOpUser :visible.sync="addVisible" :data="currentData" :type="formType" @success="handleCreateUserSuccess"></addOpUser>
    <opuserDetail :visible.sync="detailVisible" :data="currentData"></opuserDetail>
  </div>
</template>
<script>
import searchSettings from './components/searchSettings.js'
import searchHistoryMixin from '@/mixins/search-history.js'
import paginationMixin from '@/mixins/pagination.js'
import opUserTable from './components/table.vue'
import addOpUser from './components/add-opuser/add-opuser'
import opuserDetail from './components/opuser-detail/opuser-detail'
export default {

  name: 'operations-user',

  mixins: [
    searchHistoryMixin,
    paginationMixin
  ],

  props: [
    'params'
  ],

  components: {
    opUserTable,
    addOpUser,
    opuserDetail
  },

  data() {
    return {
      searchSettings,
      districtOptions: [],
      districtDisabled: true,
      districtPlaceholder: '请先选择城市',
      stationDisabled: true,
      stationPlaceholder: '请先选择城市',
      stationOptions: [],
      searchParams: null,
      tableData: [],
      addVisible: false,
      detailVisible: false,
      currentData: null,
      formType: '',
      loadingStation: false,
      currentCityId: ''
    }
  },

  methods: {
    loadTableData() {
      this.$service.getOpUser(this.page, this.searchParams).then(res => {
        this.tableData = res.data.data.records
        this._changePageTotal(res.data.data.totalElements)
      })
    },
    handleChangeCity() {
      console.log('====change====')
      this.$refs.search.formModel.districtId = ''
      this.$refs.search.formModel.stationId = ''
      this.districtDisabled = true
      this.districtPlaceholder = '加载中，请稍后'
      this.stationDisabled = true
      this.stationPlaceholder = '加载中，请稍后'
      this.$refs.search.formModel.districtId = ''
      let areaId = this.$refs.search.formModel.areaId
      if (areaId !== 999) {
        this.getDistrict(areaId)
      } else {
        this.districtPlaceholder = '请先选择城市'
      }
      // let cityId = this.$refs.search.formModel.areaId
      // this.currentCityId = cityId
      // this.$service.getDistrictByCity(cityId).then(res => {
      //   this.districtOptions = res.data.data
      //   this.districtDisabled = false
      //   this.districtPlaceholder = '请选择'
      // })
      this.stationPlaceholder = '请搜索网点'
      this.stationDisabled = false
      // this.$service.post_allWebSite(cityId).then(res => {
      //   this.stationOptions = res.data.data
      //   this.stationDisabled = false
      //   this.stationPlaceholder = '请选择'
      // })
    },
    searchStationMethod(query) {
      if (query !== '') {
        this.loadingStation = true
        this.$service.getStationByNameInCertainCity('', query).then(res => {
          console.log('====res====', res)
          this.stationOptions = res.data.data
          this.loadingStation = false
        })
      }
    },
    handleSearch(data) {
      console.log('====data====', data)
      this.searchParams = Object.assign({}, data)
      if (data.createTime && data.createTime.length) {
        this.searchParams.startCreateTime = data.createTime[0]
        this.searchParams.endCreateTime = data.createTime[1]
      }
      if (data.keywords) {
        this._saveSearchHistory(data.keywords, 'keywords')
      }
      this.page = 1
      this.loadTableData()
    },
    handleResetSearch() {
      this.searchParams = null
    },
    handleShowCreateUser() {
      this.formType = 'create'
      this.addVisible = true
      this.currentData = null
    },
    handleCreateUserSuccess(data) {
      this.addVisible = false
      this.loadTableData()
    },
    handleEdit(data) {
      this.formType = 'update'
      this.$service.getOpUserDetail(data.sn).then(res => {
        let currentData = res.data.data
        // currentData.userType = currentData.userType.code

        if (currentData.userAcceptStations.length > 0) { currentData.userAcceptStations = currentData.userAcceptStations.map(item => item.stationId) }

        if (currentData.userAcceptDistricts.length > 0) {
          currentData.userAcceptDistricts = currentData.userAcceptDistricts.map(item => item.districtId)
        }
        if (currentData.userDistricts.length > 0) {
          currentData.userDistricts = currentData.userDistricts.map(item => item.districtId)
        }
        if (currentData.userStations.length > 0) {
          currentData.userStations = currentData.userStations.map(item => item.stationId)
        }

        currentData.areaId = {
          value: currentData.areaId,
          label: currentData.areaName
        }
        this.addVisible = true
        this.currentData = currentData
      })
    },
    handleShowDetail(executorUserSn) {
      this.$service.getOpUserDetail(executorUserSn).then(res => {
        this.currentData = res.data.data
        this.detailVisible = true
      })
    },
    handleParamsChange() {
      if (this.params) {
        if (this.params.executorUserMobile) {
          this.$service.getOpUser(1, {
            mobile: this.params.executorUserMobile
          }).then(res => {
            let opuser = res.data.data.records[0]
            if (opuser) {
              this.handleShowDetail(opuser)
            }
          })
        }
        if (this.params.executorUserSn) {
          this.handleShowDetail(this.params.executorUserSn)
        }
        if (this.params.sn) {
          this.handleShowDetail(this.params.sn)
        }
      }
    },
    // 根据城市选择片区
    getDistrict (areaId) {
      // let cityId = this.$refs.search.formModel.areaId
      this.currentCityId = areaId
      this.$service.getDistrictByCity(areaId).then(res => {
        this.districtOptions = res.data.data
        this.districtDisabled = false
        this.districtPlaceholder = '请选择'
      })
    }
  },

  created() {
    this.loadTableData()
  },

  mounted() {
    this.handleParamsChange()
    let areaId = this.$refs.search.formModel.areaId
    this.districtDisabled = areaId === 999
    this.districtPlaceholder = areaId === 999 ? '请先选择城市' : '请选择片区'
    if (areaId !== 999) {
      this.getDistrict(areaId)
    }
  },
  watch: {
    params() {
      this.handleParamsChange()
    }
  }
}

</script>
<style lang="scss">

</style>
