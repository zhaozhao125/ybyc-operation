<template>
    <div>
      <el-card class="table-box">
        <div slot="header">
          <v-search :searchSettings="searchSettings" :labelWidth="labelWidth" @search = "handeleSearch"></v-search>
        </div>
          <inspection-table ref="tableList" :list = 'inspectionList' :params = 'paginationParams' @on-change = "pageChange" @on-inspectionShow = "showInspectionInfor"></inspection-table>
      </el-card>
      <inspection-infor
                  v-if="currentInspection"
                  :visible.sync="inspectionVisible"
                  :sn="currentInspection"
                  @on-inspectionHide = "hideInspectionInfor"
                  ></inspection-infor>
  </div>

</template>
<script>
import { searchSettings } from './components/data'
import inspectionTable from './components/table'
import inspectionInfor from './components/inspectionInfor'
export default {
  components: {
    inspectionTable,
    inspectionInfor
  },
  name: 'inspectionRecord',
  data () {
    return {
      searchSettings: searchSettings,
      labelWidth: '120px',
      page: 1,
      searchData: {
        pageSize: 20
      },
      inspectionList: [],
      paginationParams: {},
      inspectionVisible: false,
      currentInspection: ''
    }
  },
  props: [
    'params'
  ],
  methods: {
    getInspectionList () {
      this.$service.getInspectionList(this.page, this.searchData).then(res => {
        this.inspectionList = res.data.data.records
        this.paginationParams = {
          total: res.data.data.totalElements,
          pageSize: 20,
        }
        // this.paginationParams = {
        //   total: res.data.data.total,
        //   pageSize: this.searchData.pageSize,
        // }
      })
    },
    handeleSearch (data) {
      this.page = 1
      this.$refs.tableList.page = 1
      this.searchData = data
      if (this.searchData.time && this.searchData.time.length > 0) {
        this.searchData.startDate = Date.parse(this.searchData.time[0]) / 1000
        this.searchData.endDate = Date.parse(this.searchData.time[1]) / 1000
      }
      delete this.searchData.time
      this.getInspectionList()
    },
    pageChange (val) {
      this.page = val
      this.getInspectionList()
    },
    showInspectionInfor (id) {
      this.inspectionVisible = false
      this.currentInspection = ''
      this.$nextTick(() => {
        this.inspectionVisible = true
        this.currentInspection = id + ''
      })
    },
    hideInspectionInfor () {
      this.inspectionVisible = false
      this.currentInspection = ''
    },
    handleParamsChange() {
      if (this.params && this.params.id) {
        // this.addVisible = false
        // this.assignVisible = false
        // this.detailVisible = false
        // this.stationVisible = false
        // this.rejectFormVisible = false
        // this.acceptFormVisible = false

        this.inspectionVisible = false
        this.currentInspection = ''
        this.$nextTick(() => {
          this.inspectionVisible = true
          this.currentInspection = this.params.id + ''
        })
        // this.handelInspectionDetail(this.params.id)
      }
    }
  },
  mounted () {
    this.getInspectionList()
    this.$nextTick(() => {
      this.handleParamsChange()
    })
  },
  watch: {
    params() {
      this.handleParamsChange()
    }
  }
}
</script>
