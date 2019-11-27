<template>
  <div id="car-status-index">
    <el-card class="table-box">
      <div slot="header">
        <my-search ref='mySearch' @handleSearchData="handleSearchData" @handleReset="handleReset"></my-search>
      </div>
      <my-table :searchData="searchData" ref="myTable" :otherCarNumber='otherCarNumber'></my-table>
    </el-card>
  </div>
</template>
<script>
import mySearch from './components/search'
import myTable from './components/table'
export default {
  name: 'car-status-index',
  components: {
    mySearch,
    myTable
  },
  mounted() {
    this.handleParamsChange()
  },
  props: ['params'],
  watch: {
    params() {
      this.handleParamsChange()
    }
  },
  data() {
    return {
      searchData: {},
      otherCarNumber: ''
    }
  },
  methods: {
    // 从别的标签页传参到当前页面
    handleParamsChange() {
      console.log(this.params, 'params')
      if (this.params && this.params.carNumber) {
        this.otherCarNumber = this.params.carNumber
        this.$nextTick(() => {
          this.searchData.keyWords = this.params.carNumber
          this.$refs.myTable.handleSearch()
        })
      } else {
        this.otherCarNumber = ''
      }
    },
    handleSearchData(searchData) {
      this.searchData = Object.assign({}, searchData)
    },
    handleReset() {
      this.searchData = {}
    }
  }
}
</script>
