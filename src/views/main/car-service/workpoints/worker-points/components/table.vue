<template>
  <div class="table-container">
    <el-table :data="tableData" height="100%" >
          <el-table-column label="用户编号" min-width="120px" prop="userSn" show-overflow-tooltip>
            <!-- <template slot-scope="scope">
              <span v-if="!scope.row.id">未知</span>
              <el-button type="text" v-else @click="showDetail(scope.row.id)">{{scope.row.id}}</el-button>
            </template> -->
          </el-table-column>
          <el-table-column prop="name" label="姓名" min-width="120px">
            <template slot-scope="scope">
              <span v-if="!scope.row.userName">未知</span>
              <el-button type="text" v-else @click="showDetail(scope.row.userSn)">{{scope.row.userName}}</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="cityName" label="城市" min-width="120px"></el-table-column>
          <el-table-column prop="roleName" label="角色" min-width="200px" show-overflow-tooltip></el-table-column>
          <el-table-column prop="ruleName" label="工分规则名称" min-width="200px" show-overflow-tooltip></el-table-column>
          <el-table-column prop="chargeCarScore" label="充电单" min-width="120px">
            <template slot-scope="scope">
               <span>{{scope.row.chargeCarScore}}</span> <br>
               <span >({{scope.row.chargeCarNum}}单)</span>
            </template>
          </el-table-column>
          <el-table-column prop="cleanCarScore" label="清洁单" min-width="120px">
            <template slot-scope="scope">
               <span>{{scope.row.cleanCarScore}}</span> <br>
               <span >({{scope.row.cleanCarNum }}单)</span>
            </template>
          </el-table-column>
          <el-table-column prop="inspectCarScore" label="巡检单" min-width="120px">
            <template slot-scope="scope">
               <span>{{scope.row.inspectCarScore}}</span> <br>
               <span>({{scope.row.inspectCarNum  }}单)</span>
            </template>
          </el-table-column>
          <el-table-column prop="dispatchCarScore" label="调度单" min-width="120px">
              <template slot-scope="scope">
               <span>{{scope.row.dispatchCarScore}}</span> <br>
               <span >({{scope.row.dispatchCarNum   }}单)</span>
            </template>
          </el-table-column>
          <el-table-column prop="repairCarScore" label="维修单" min-width="120px">
              <template slot-scope="scope">
               <span>{{scope.row.repairCarScore}}</span> <br>
               <span >({{scope.row.repairCarNum }}单)</span>
            </template>
          </el-table-column>
          <el-table-column prop="lockCarScore" label="补料单" min-width="120px">
              <template slot-scope="scope">
               <span>{{scope.row.lockCarScore}}</span> <br>
               <span >({{scope.row.lockCarNum     }}单)</span>
            </template>
          </el-table-column>
          <el-table-column prop="allScore" label="工分汇总" min-width="120px">
          </el-table-column>
      </el-table>
  </div>
</template>

<script>
import popSwitch from '@/components/pop-switch'
export default {
  name: 'worker-point',
  components: {
    popSwitch
  },
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
    showDetail (id) {
      this.$store.commit('sendToTab', {
        name: 'operationsUser',
        params: {
          sn: id
        }
      })
    }
  }
}
</script>
<style lang="scss">
</style>
