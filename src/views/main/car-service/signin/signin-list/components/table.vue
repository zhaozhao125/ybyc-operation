<template>
  <el-table :data="tableData" height="100%">
    <el-table-column prop="userInfo.name" label="姓名" min-width="100">
    </el-table-column>
    <el-table-column prop="userInfo.mobile" label="手机号码" min-width="150">
    </el-table-column>
    <el-table-column prop="userInfo.areaName" label="城市" min-width="100">
    </el-table-column>
    <!-- <el-table-column prop="userInfo.userDistricts" label="片区" min-width="120">
      <template slot-scope="scope">
        <span v-if="scope.row.userInfo.userDistricts && scope.row.userInfo.userDistricts.length == 1">{{scope.row.userInfo.userDistricts[0].districtName}}</span>
        <el-tooltip v-if="scope.row.userInfo.userDistricts && scope.row.userInfo.userDistricts.length > 1" effect="dark" placement="right">
          <div slot="content">
            <p v-for="(item, index) in scope.row.userInfo.userDistricts" :key="index">{{item.districtName}}</p>
          </div>
          <span>{{scope.row.userInfo.userDistricts[0].districtName}}...</span>
        </el-tooltip>
      </template>
    </el-table-column> -->
    <el-table-column prop="collectionInfo.count" label="今日签到次数" min-width="110">
      <template slot-scope="scope">
        <el-button type="text" :disabled="scope.row.collectionInfo.count === '未签到'" @click="handleClickSigninTimes(scope.row)">{{scope.row.collectionInfo.count}}</el-button>
      </template>
    </el-table-column>
    <el-table-column prop="collectionInfo.firstSignTime" label="开始签到时间" min-width="160"></el-table-column>
    <el-table-column prop="collectionInfo.lastSignTime" label="最后签到时间" min-width="160">
    </el-table-column>
    <el-table-column prop="collectionInfo.lastSignLocation" label="签到网点/地址" min-width="150">
    </el-table-column>
  </el-table>
</template>
<script>
export default {

  props: {
    tableData: {
      type: Array,
      default: () => {
        return []
      }
    }
  },

  data() {
    return {

    }
  },

  methods: {
    handleClickSigninTimes(data) {
      this.$emit('showDetail', data)
    }
  }
}
</script>
<style lang="scss">

</style>
