<template>
  <div  id="car-start-record-index">
    <el-card class="table-box">
      <div slot="header" class="clearfix">
        <my-search @handleSearchData="handleSearchData" @handleReset="handleReset"></my-search>
      </div>

        <my-table :searchData="searchData"></my-table>
        
    </el-card>
  </div>
</template>
<script>
import mySearch from "./components/search";
import myTable from "./components/table";
export default {
  name: "car-start-record-index",
  components: {
    mySearch,
    myTable
  },
  data() {
    return {
      searchData: {}
    };
  },
  mounted() {
    console.log(this.$service, "=====请求的所有接口=====");
  },
  methods: {
    handleSearchData(searchData) {
      this.searchData = Object.assign({}, searchData);
    },
    //重置数据
    handleReset() {
      this.searchData = {};
    }
  }
};
</script>

