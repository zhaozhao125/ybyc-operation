<template>
  <div id="car-action-record-index">
    <el-card class="table-box">
      <div slot="header">
        <my-search @handleSearchData="handleSearchData" @handleReset="handleReset"></my-search>
      </div>
      <my-table :searchData="searchData" :otherCarNumber='otherCarNumber' ref="myTable"></my-table>
    </el-card>
  </div>
</template>
<script>
import mySearch from './components/search'
import myTable from './components/table'
export default {
  name: 'car-action-record-index',
  components: {
    mySearch,
    myTable
  },
  props: ['params'],
  watch: {
    params() {
      this.handleParamsChange()
    }
  },
  mounted() {
    this.handleParamsChange()
  },
  data() {
    return {
      otherCarNumber: null,
      searchData: {}
    }
  },

  methods: {
    // 从别的标签页传参到当前页面
    handleParamsChange() {
      if (this.params && this.params.carNumber) {
        this.otherCarNumber = this.params.carNumber
        this.$nextTick(() => {
          this.searchData.keyWords = this.params.carNumber
          this.$refs.myTable.handleSearch()
        })
      } else {
        this.carNumber = ''
      }
    },
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
