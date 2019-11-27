<template>
  <div id="car-alarm-index">
    <el-card class="table-box">
      <div slot="header">
        <my-search @handleSearchData="handleSearchData" @handleReset="handleReset"></my-search>
      </div>
      <my-table :searchData="searchData"></my-table>
    </el-card>
  </div>
</template>
<script>
import mySearch from './components/search'
import myTable from './components/table'
export default {
  name: 'car-alarm-index',
  components: {
    mySearch,
    myTable
  },
  data() {
    return {
      searchData: {}
    }
  },
  methods: {
    handleSearchData(searchData) {
      this.searchData = Object.assign({}, searchData)
    },
    // 重置数据
    handleReset() {
      this.searchData = {}
    }
  }
}
</script>
