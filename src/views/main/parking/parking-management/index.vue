<template>
  <div>
    <el-card class="table-box">
      <div slot="header">
        <v-search :searchSettings="searchSettings"
                  @search="handleSearch"
                  labelWidth="110px">
          <template slot="stationId"
                    slot-scope="scope">
            <website-select v-model="scope.model.stationId"
                            placeholder="请输入网点名称"
                            isRequest
                            :open='false'
                            ref="websiteSelectionNames"></website-select>
          </template>
        </v-search>
      </div>
      <div class="table-operator">
        <el-button size="small"
                   type="primary"
                   @click="showAdd = true">添加</el-button>
      </div>
      <div class="table-container">
        <table-list @on-information="showInformation"
                    :list='searchData'
                    @on-reload="loadTableData"></table-list>
      </div>
      <div class="table-page">
        <el-pagination :current-page.sync="page"
                       :page-size="pageSize"
                       layout="total, prev, pager, next"
                       :total="pageTotal"
                       @current-change="loadTableData">
        </el-pagination>
      </div>
    </el-card>
    <v-page :visible.sync="showAdd"
            ref="vPage"
            @goBack="loadTableData">
      <template slot="title">
        <h3 style="line-height:30px; display:inline-block">添加车位</h3>
      </template>
      <template slot="content">
        <add-packing @on-hideAdd="hideAdd"></add-packing>
      </template>
    </v-page>
    <v-page :visible.sync="showInfor"
            ref="vPage"
            @goBack="loadTableData">
      <template slot="title">
        <h3 style="line-height:30px; display:inline-block">车位详情</h3>
      </template>
      <template slot="content">
        <packing-information :packingInforMation="propPackingInforMation"></packing-information>
      </template>
    </v-page>
  </div>
</template>
<script>
import { searchSettings } from './search-settings.js'
import tableList from './components/table'
import paginationMixin from '@/mixins/pagination.js'
import searchHistoryMixin from '@/mixins/search-history.js'
import packingInformation from './components/information'
import addPacking from './components/addPacking'
import websiteSelect from '@/components/website-select'
import { handleDate } from '@/utils/date-filter'
import mixin from './util'
export default {
  name: 'timeSharePlans',
  mixins: [searchHistoryMixin, paginationMixin, mixin],
  components: {
    tableList,
    packingInformation,
    addPacking,
    websiteSelect
  },
  data() {
    return {
      searchSettings: searchSettings,
      showAdd: false,
      showInfor: false,
      searchParams: {},
      searchData: [],
      propPackingInforMation: {},
    }
  },
  methods: {
    hideAdd() {
      this.showAdd = false
      this.showInfor = false
      this.loadTableData()
    },
    handleSearch(data) {
      if (data.duringTime && data.duringTime.length) {
        data.startCreatedOn = handleDate(data.duringTime[0], 'day')
        data.endCreatedOn = handleDate(data.duringTime[1], 'day')
      }
      delete data.duringTime
      if (data.stationId) {
        let website = this.$refs.websiteSelectionNames.newListData.filter(
          ele => {
            return ele.value === data.stationId
          }
        )[0]
        data.stationName = website.label
      }
      delete data.stationId
      this.searchParams = data
      this.page = 1
      this.loadTableData()
    },
    showInformation(val) {
      this.showAdd = false
      this.showInfor = true
      this.propPackingInforMation = val
    },
    loadTableData() {
      this.$service.parkingLists(this.searchParams, this.page).then(res => {
        this.searchData = res.data.data.records ? res.data.data.records : []
        this.packingOPen(this.searchData)
        this._changePageTotal(res.data.data.totalElements)
      })
    }
  },
  mounted() {
    this.loadTableData()
  }
}
</script>
<style lang="scss">
</style>
