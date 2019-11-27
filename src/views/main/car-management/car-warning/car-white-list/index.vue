<template>
  <div>
    <el-card class="table-box">
      <div slot="header">
        <v-search :searchSettings="searchSettings" @search="handleSearch" :labelWidth="labelWidth"></v-search>
      </div>
      <div class="table-operator">
          <el-button size="small" type="primary" @click="addCar">添加车辆</el-button>
      </div>
      <table-list :list = 'searchData' :params = "paginatiomParams"  @on-pageChange = "pageChange" ref='tableList'></table-list>
    </el-card>
    <add-white ref="addWhite" @on-regetList = "getCarList"></add-white>
  </div>
</template>
<script>
import { searchSettings } from './search-setting.js'
import addWhite from './components/addWhite'
import tableList from './components/tableList'
export default {
  components: {
    addWhite,
    tableList
  },
  data () {
    return {
      searchSettings: searchSettings,
      labelWidth: '60px',
      searchParams: {},
      searchData: [],
      paginatiomParams: {}
    }
  },
  methods: {
    pageChange (page) {
      this.getCarList(page)
    },
    handleSearch (val) {
      this.$refs.tableList.resetPage()
      this.searchParams = val
      this.getCarList()
    },
    addCar () {
      this.$refs.addWhite.show()
    },
    getCarList (page = 1) {
      this.$service.whiteCarList(this.searchParams, page).then((res) => {
        this.searchData = res.data.data.records.map((ele) => {
          return Object.assign(ele.infoDTO, { id: ele.id }, { createDate: ele.createDate }, { createBy: ele.createBy })
        })
        this.paginatiomParams = {
          pageSize: 20,
          total: res.data.data.totalElements
        }
      }).catch((res) => {
      })
    }
  },
  mounted () {
    this.getCarList()
  }
}
</script>
