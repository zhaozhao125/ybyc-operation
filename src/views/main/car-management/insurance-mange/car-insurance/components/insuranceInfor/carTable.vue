<template>
    <el-table
      :data="carList"
      style="width: 80%">
      <el-table-column
        prop="carNumber"
        label="车牌号"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="carCityName"
        label="城市"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="carUseFor"
        label="车辆类别"
        min-width="120">
           <template slot-scope="scope">
               <span v-if = "scope.row.carUseFor === 'sale'">销售</span>
               <span v-if = "scope.row.carUseFor === 'rent'">租赁</span>
           </template>
      </el-table-column>
      <el-table-column
        prop="carModelName"
        label="所属车型"
        min-width="180">
      </el-table-column>
      <el-table-column
        prop="carVin"
        label="车架号"
        min-width="180">
      </el-table-column>
    </el-table>
</template>
<script>
export default {
  props: {
    carList: {
      default: [],
      type: Array
    }
  }
}
</script>
