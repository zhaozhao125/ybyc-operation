<template>
  <div class="workorder-signin">
    <el-card class="table-box">
      <div slot="header">
        <v-search ref="search" :searchSettings="searchSettings" labelWidth="130px" @search="handleSearch" @reset="handleReset" @changeCity="handleChangeCity">
          <!-- <template slot="districtId" slot-scope="scope">
            <el-select v-model="scope.model.districtId" :placeholder="districtPlaceholder" :disabled="districtDisabled" clearable>
              <el-option v-for="item in districtOptions" :key="item.value" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </template> -->
        </v-search>
      </div>
      <div class="table-container">
        <signinTable :tableData="tableData" @showDetail="handleShowDetail"></signinTable>
      </div>
      <div class="table-page">
        <el-pagination :current-page="page" :page-size="pageSize" layout="total, prev, pager, next" :total="pageTotal" @current-change="_handlePageChange">
        </el-pagination>
      </div>
    </el-card>
    <signinDetail :visible.sync="detailVisible" :signinData="currentData"></signinDetail>
  </div>
</template>

<script>
import searchSettings from './components/searchSettings.js'
import paginationMixin from '@/mixins/pagination.js'
import signinTable from './components/table'
import signinDetail from './components/detail/detail.vue'

export default {
  mixins: [paginationMixin],

  components: {
    signinTable,
    signinDetail
  },

  data() {
    return {
      searchSettings,
      searchParams: {
        signDate: searchSettings[0].value
      },
      tableData: [],
      detailVisible: false,
      currentData: null,

      districtPlaceholder: '请先选择城市',
      districtDisabled: true,
      districtOptions: []
    }
  },

  methods: {
    // 加载列表数据
    loadTableData() {
      this.$service.getSigninList(this.page, this.searchParams).then(res => {
        this.tableData = res.data.data.records || []
        this._changePageTotal(res.data.data.totalElements)
      })
    },
    // 搜索
    handleSearch(data) {
      this.searchParams = data
      this.page = 1
      this.loadTableData()
    },
    // 重置搜索
    handleReset() {
      this.searchParams = null
    },
    handleShowDetail(data) {
      this.currentData = data
      this.detailVisible = true
    },
    handleChangeCity() {
      // this.$refs.search.formModel.districtId = ''
      // this.districtDisabled = true
      // this.districtPlaceholder = '加载中，请稍后'
      // this.$refs.search.formModel.districtId = ''
      // let cityId = this.$refs.search.formModel.areaId
      // this.currentCityId = cityId
      // if (cityId === 999) {
      //   this.districtDisabled = true
      //   this.districtPlaceholder = '请先选择城市'
      // } else {
      //   this.getDistrict(cityId)
      // }
    }
    // 根据城市选择片区
    // getDistrict (cityId) {
    //   this.$service.getDistrictByCity(cityId).then(res => {
    //     this.districtOptions = res.data.data
    //     this.districtDisabled = false
    //     this.districtPlaceholder = '请选择'
    //   })
    // }
  },
  mounted() {
    this.$nextTick(() => {
      this.loadTableData()
      let areaId = this.$refs.search.formModel.areaId
      console.log(areaId)
      if (areaId !== 999) {
        this.getDistrict(areaId)
      }
    })
  }
}
</script>

<style lang="scss">

</style>
