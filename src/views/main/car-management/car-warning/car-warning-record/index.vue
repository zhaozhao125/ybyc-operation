<template>
  <div id="car-warning-record-index">
    <el-card class="table-box">
      <div slot="header">
        <my-search ref='mySearch' @handleSearchData="handleSearchData" @handleReset="handleReset" :otherCarNumber='otherCarNumber'></my-search>
      </div>
      <my-table :searchData="searchData" ref="myTable" :otherCarNumber='otherCarNumber'></my-table>
    </el-card>
  </div>
</template>
<script>
import mySearch from './components/search'
import myTable from './components/table'
export default {
  name: 'car-warning-record-index',
  components: {
    mySearch,
    myTable
  },
  mounted() {
    // this.handleParamsChange()
  },
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
    handleSearchData(searchData) {
      this.searchData = Object.assign({}, searchData)
    },
    handleReset() {
      this.searchData = {}
    }
  }
}
</script>
