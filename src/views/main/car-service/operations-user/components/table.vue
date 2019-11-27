<template>
  <el-table :data="tableData" height="100%">
    <el-table-column label="用户编号" min-width="130">
      <template slot-scope="scope">
        <el-button type="text" @click="showDetailData(scope.row)">{{scope.row.sn}}</el-button>
      </template>
    </el-table-column>
    <el-table-column prop="mobile" label="手机号码" min-width="120">
    </el-table-column>
    <el-table-column prop="name" label="姓名" min-width="120">
    </el-table-column>
    <el-table-column prop="roleName" label="角色名称" min-width="120">
    </el-table-column>
    <el-table-column label="状态" min-width="80">
      <template slot-scope="scope">
        {{scope.row.ready?'开工':'收工'}}
      </template>
    </el-table-column>
    <el-table-column prop="areaName" label="城市" min-width="100">
    </el-table-column>
    <el-table-column prop="userDistricts" label="发单片区/网点" min-width="180">
      <template slot-scope="scope">
        <span v-if="scope.row.userDistricts.length == 1">{{scope.row.userDistricts[0].districtName}}</span>
        <el-tooltip v-if="scope.row.userDistricts.length > 1" effect="dark" placement="right">
          <template slot="content">
            <p v-for="(item, index) in scope.row.userDistricts" :key="index">{{item.districtName}}</p>
          </template>
          <span>{{scope.row.userDistricts[0].districtName}}...</span>
        </el-tooltip>

        <span v-if="scope.row.userStations.length == 1">{{scope.row.userStations[0].stationName}}</span>
        <el-tooltip v-if="scope.row.userStations.length > 1" effect="dark" placement="right">
          <template slot="content">
            <p v-for="(item, index) in scope.row.userStations" :key="index">{{item.stationName}}</p>
          </template>
          <span>{{scope.row.userStations[0].stationName}}...</span>
        </el-tooltip>
      </template>
    </el-table-column>
    <el-table-column prop="userAcceptDistricts" label="接单片区/网点" min-width="180">
      <template slot-scope="scope">
        <span v-if="scope.row.userAcceptDistricts.length == 1">{{scope.row.userAcceptDistricts[0].districtName}}</span>
        <el-tooltip v-if="scope.row.userAcceptDistricts.length > 1" effect="dark" placement="right">
          <template slot="content">
            <p v-for="(item, index) in scope.row.userAcceptDistricts" :key="index">{{item.districtName}}</p>
          </template>
          <span>{{scope.row.userAcceptDistricts[0].districtName}}...</span>
        </el-tooltip>

        <span v-if="scope.row.userAcceptStations.length == 1">{{scope.row.userAcceptStations[0].stationName}}</span>
        <el-tooltip v-if="scope.row.userAcceptStations.length > 1" effect="dark" placement="right">
          <template slot="content">
            <p v-for="(item, index) in scope.row.userAcceptStations" :key="index">{{item.stationName}}</p>
          </template>
          <span>{{scope.row.userAcceptStations[0].stationName}}...</span>
        </el-tooltip>
      </template>
    </el-table-column>
    <!-- <el-table-column prop="summary" label="网点名称" min-width="200">
      <template slot-scope="scope">
        <p v-for="(item, index) in scope.row.userStations" :key="index">{{item.stationName}}</p>
      </template>
    </el-table-column> -->
    <el-table-column prop="handlePerson" label="是否启用" min-width="100">
      <template slot-scope="scope">
        <popSwitch v-model="scope.row.enabled" trueText="确定要禁用该用户吗？" falseText="确定要启用该用户吗？" @confirm="handleConfirmSwitch(scope.row)" @cancel="handleCancelSwitch"></popSwitch>
      </template>
    </el-table-column>
    <!-- <el-table-column prop="createTime" label="创建时间" min-width="150">
      <template slot-scope="scope">
        {{scope.row.createTime|timeFilter}}
      </template>
    </el-table-column> -->
    <el-table-column label="操作" width="128" fixed="right">
      <template slot-scope="scope">
        <el-button type="text" @click="handleEdit(scope.row)" v-has="'operationsUserUpdate'">编辑</el-button>
        <el-popover class="confirm-popover" placement="bottom" width="160" :ref="'resetPopper' + scope.$index">
          <el-button slot="reference" type="text" v-has="'operationsUserResetPassword'">重置密码</el-button>
          <p>确定要重置密码吗？</p>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="handleResetCancel(scope.$index)">取消</el-button>
            <el-button type="primary" size="mini" @click="handleResetConfirm(scope.row, scope.$index)">确定</el-button>
          </div>
        </el-popover>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
import popSwitch from '@/components/pop-switch'
import {getOpUserType} from '@/config/data-dictionary/workorder.js'
export default {

  props: {
    tableData: {
      type: Array,
      default: () => {
        return []
      }
    }
  },

  components: {
    popSwitch
  },

  data() {
    return {

    }
  },

  methods: {
    handleEdit(data) {
      this.$emit('edit', data)
    },
    handleResetConfirm(data, index) {
      this.$refs['resetPopper' + index].showPopper = false
      this.$service.resetOpUserPassword(data.sn).then(res => {
        this.$alert(`用户密码为： ${res.data.msg}`, '重置成功', {
          confirmButtonText: '确定',
          type: 'success',
          callback: action => {

          }
        })
      })
    },
    handleResetCancel(index) {
      this.$refs['resetPopper' + index].showPopper = false
    },
    showDetailData(data) {
      this.$emit('showDetail', data.sn)
    },
    handleConfirmSwitch(data) {
      this.$service.switchOpUserStatus(data.sn, !data.enabled).then(res => {
        data.enabled = !data.enabled
        this.$message({
          message: data.enabled ? '启用成功' : '禁用成功',
          type: 'success'
        })
      })
    },
    handleCancelSwitch() {},
    getUserType: getOpUserType
  }
}
</script>
<style lang="scss">

</style>
