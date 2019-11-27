<template>
  <div id="branches-vehicle-index">
    <el-card class="table-box">
      <div slot="header">
        <my-search @handleSearchData="handleSearchData"></my-search>
      </div>
      <my-table :searchData="searchData"></my-table>
    </el-card>
  </div>
</template>
<script>
import mySearch from './components/search'
import myTable from './components/table'
export default {
  name: 'branches-vehicle-index',
  components: {
    mySearch,
    myTable
  },
  data() {
    return {
      searchData: {}
    }
  },
  mounted() { },
  methods: {
    handleSearchData(searchData) {
      this.searchData = Object.assign({}, searchData)
    }
  }
}
</script>
