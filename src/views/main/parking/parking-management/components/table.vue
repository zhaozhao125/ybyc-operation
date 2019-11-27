<template>
  <el-table :data="list"
            class="table-container"
            height="100%">
    <el-table-column prop="parkingSn"
                     label="车位编号"
                     show-overflow-tooltip
                     min-width="130">
      <template slot-scope="scope">
        <el-button type="text"
                   @click="$emit('on-information', scope.row)">{{scope.row.parkingSn}}</el-button>
      </template>
    </el-table-column>
    <el-table-column prop="parkingShowSn"
                     label="显示编号"
                     show-overflow-tooltip
                     align="center"
                     min-width="120">
    </el-table-column>
    <el-table-column prop="cityName"
                     min-width="100"
                     label="城市">
    </el-table-column>
    <el-table-column prop="parkingType"
                     show-overflow-tooltip
                     label="车位类型"
                     min-width="100px">
      <template slot-scope="scope">
        <span>{{packingTypeChange(scope.row.parkingType)}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="parkingStatus"
                     mni-width="100"
                     label="车位状态">
      <template slot-scope="scope">
        <span>{{packingStatusChange(scope.row.parkingStatus)}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="lockStatus"
                     min-width="100"
                     label="地锁状态"
                     show-overflow-tooltip>
      <template slot-scope="scope">
        <span>{{lockStatusChange(scope.row.lockStatus)}}</span>
      </template>
    </el-table-column>
    <el-table-column label="地锁信息"
                     min-width="150"
                     show-overflow-tooltip>
      <template slot-scope="scope">
        <span>{{lockName(scope.row.lockEquipmentOperator)}}</span> <br>
        <span v-if="scope.row.lockEquipmentId">设备ID {{scope.row.lockEquipmentId}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="stationName"
                     min-width="200"
                     label="所属网点"
                     show-overflow-tooltip>
      <template slot-scope="scope">
        <span>{{scope.row.stationSn}}</span> <br />
        <span>{{scope.row.stationName}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="owner"
                     min-width="150"
                     label="所有人"
                     align="center"
                     show-overflow-tooltip>
      <template slot-scope="scope">
        <span>{{ownerChange(scope.row.owner)}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="amount"
                     min-width="150"
                     label="创建时间">
      <template slot-scope="scope">
        <span>{{scope.row.createTime | timeFilter}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="amount"
                     min-width="150"
                     label="最后修改时间">
      <template slot-scope="scope">
        <span>{{scope.row.modifiedTime | timeFilter}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="address"
                     label="是否启用"
                     min-width="100"
                     align="center">
      <template slot-scope="scope">
        <popSwitch v-model="scope.row.isEnable"
                   trueText="是否禁用该车位？"
                   falseText="是否启用该车位？"
                   @confirm="handleConfirmSwitch(scope.row)"></popSwitch>
      </template>
    </el-table-column>
    <el-table-column prop=""
                     label="操作"
                     fixed="right"
                     width="220px">
      <template slot-scope="scope">
        <div class="handle">
          <el-button type="text"
                     @click="handelLock('hb', scope.row)">升锁</el-button>
          <el-button type="text"
                     @click="handelLock('ha', scope.row)">降锁</el-button>
          <el-dropdown @command="handleMenuActiom"
                       @visible-change="visibleMenu(scope.row)">
            <span class="el-dropdown-link">更多操作
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="hh">休眠</el-dropdown-item>
              <el-dropdown-item command="hi">唤醒</el-dropdown-item>
              <el-dropdown-item command="hg">鸣叫</el-dropdown-item>
              <el-dropdown-item command="hj">静音</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import popSwitch from '@/components/pop-switch'
import mixin from '../util'
export default {
  components: {
    popSwitch
  },
  mixins: [mixin],
  props: {
    list: {
      default: () => {
        return []
      },
      type: Array
    }
  },
  data() {
    return {
      packingRow: {}
    }
  },
  methods: {
    conformDialog(type, row) {
      this.$confirm(
        '点击确定后，地锁状态会有1-10秒延迟，确定要执行此操作吗？',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          let obj = {
            parkingSn: row.parkingSn,
            uid: this.$store.state.user.userId,
            lockSn: row.lockSn,
            action: type
          }
          this.handelLockServer(obj)
        })
        .catch(() => {})
    },
    handelLock(type, row) {
      this.conformDialog(type, row)
    },
    handleMenuActiom(menuItem) {
      this.conformDialog(menuItem, this.packingRow)
    },
    handelLockServer(obj) {
      this.$service
        .lockControl(obj)
        .then(res => {
          this.$emit('on-reload')
          this.$message.success('操作成功')
        })
        .catch(res => {})
    },
    visibleMenu(row) {
      this.packingRow = row
    },
    handleConfirmSwitch(val) {
      let obj = {
        parkingSn: val.parkingSn,
        isEnable: (val.isEnable = !val.isEnable) ? 1 : 0
      }
      console.log(obj)
      this.$service
        .parckingEdit(obj)
        .then(res => {
          this.$emit('on-reload')
        })
        .catch(res => {})
    }
  },
  mounted() {}
}
</script>
