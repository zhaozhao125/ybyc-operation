<template>
  <div class="components-content">
    <el-table
      :data="list"
      class="table-container" height="100%"
      >
      <el-table-column
        prop="packageId"
        label="套餐编号"
        show-overflow-tooltip
        width="120">
          <template slot-scope="scope">
            <el-button type="text" @click="$emit('on-information', scope.row)">{{scope.row.packageId}}</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="packageName"
        label="套餐名称"
        show-overflow-tooltip
        width="120">
      </el-table-column>
      <el-table-column
        prop="cityName"
        width="100"
        label="城市"
       >
      </el-table-column>
      <el-table-column
        prop="carGenreName"
        show-overflow-tooltip
        label="车型"
        min-width="150px"
        >
      </el-table-column>
      <el-table-column
        prop="amount"
        width="150"
        label="金额（仅减免租金）"
        >
      </el-table-column>
      <el-table-column
        prop="address"
        width="180"
        label="套餐时段/时长"
        >
        <template slot-scope="scope">
          <span>{{scope.row.periodStartTime, 'HH:mm:ss' | timeFilter}}</span> --
          <span>{{scope.row.periodEndTime, 'HH:mm:ss' | timeFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="时间信息"
        width="250"
        >
        <template slot-scope="scope">
          <span>创建：{{scope.row.createdTime | timeFilter}}</span> <br>
          <span>开始：{{scope.row.startTime | timeFilter}}</span><br>
          <span>结束：{{scope.row.endTime | timeFilter}}</span><br>
        </template>
      </el-table-column>
      <el-table-column
        prop="address"
        label="是否启用"
        width="100"
      >
        <template slot-scope="scope">
          <popSwitch v-model="scope.row.isOpen" trueText="是否禁用该套餐" falseText="是否启用该套餐？" @confirm="handleConfirmSwitch(scope.row)" @cancel="handleCancelSwitch(scope.row)"></popSwitch>
        </template>
      </el-table-column>
      <el-table-column
        prop=""
        label="操作"
        fixed="right"
        width="100px"
      >
        <template slot-scope="scope">
          <el-button type="text" @click="editPlan(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class='table-page'>
      <el-pagination :current-page.sync="page" :page-size="params.pageSize" layout="total, prev, pager, next" :total="params.total"         @current-change="pageChange">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import popSwitch from '@/components/pop-switch'
import definePopver from './popver'
export default {
  components: {
    popSwitch,
    definePopver
  },
  props: {
    list: {
      default: [],
      type: Array
    },
    params: {
      default: {},
      type: Object
    }
  },
  data() {
    return {
      page: 1
    }
  },
  methods: {
    handleConfirmSwitch (val) {
      let obj = {
        packageId: val.packageId,
        isOpen: (val.isOpen = !val.isOpen) ? 1 : 0
      }
      this.$service.editTimeShare(obj).then((res) => {
        this.$emit('on-reload')
      }).catch((res) => {
      })
    },
    handleCancelSwitch (val) {
      console.log(val)
    },
    pageChange (val) {
      this.$emit('on-pageChange', val)
    },
    editPlan (row) {
      if (row.cityId === 998) {
        row.cityId = 999
      }
      let obj = {
        packageId: row.packageId
      }
      this.$service.planStartEnd(obj).then((res) => {
        console.log(res.data)
        if (res.data.data === 0) {
          this.$emit('on-editInformation', row)
        } else {
          this.$message.warning('套餐已开始，无法编辑!')
        }
      }).catch((res) => {
      })
    }
  },
  mounted () {
  }
}
</script>
