<template>
  <div class="administrator">
    <el-card class="table-box">
      <div slot="header">
        <v-search :searchSettings="searchSettings" @search="handleSearch"></v-search>
      </div>
      <div class="table-operator">
        <el-button type="primary" size="small" @click="handleNewAdmin">新增</el-button>
      </div>
      <div class="table-container">
        <el-table :data="tableData" height="100%">
          <el-table-column prop="username" label="用户名" min-width="140">
          </el-table-column>
          <el-table-column prop="cnName" label="姓名" min-width="110">
          </el-table-column>
          <el-table-column prop="mobilePhone" label="手机号" min-width="130">
          </el-table-column>
          <el-table-column label="城市权限" min-width="80">
            <template slot-scope="scope">
              <p v-for="(city, cityIndex) in scope.row.cityModels" :key="cityIndex" v-if="city.checked">
                {{city.name}}
              </p>
            </template>
          </el-table-column>
          <el-table-column prop="roleName" label="角色" min-width="100">
          </el-table-column>
          <el-table-column prop="statusContent" label="状态" min-width="80">
            <template slot-scope="scope">
              <span :class="scope.row.statusContent=='有效'?'state-green':'state-gray'">{{scope.row.statusContent}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="130">
            <template slot-scope="scope">
              <el-button type="text" @click="showEdit(scope.row)">修改</el-button>
              <el-button type="text" @click="showResetPassword(scope.row)">重置密码</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="table-page">
        <el-pagination :current-page.sync="page" :page-size="pageSize" layout="total, prev, pager, next" :total="pageTotal" @current-change="_handlePageChange">
        </el-pagination>
      </div>
    </el-card>
    <v-page :visible.sync="newAdminVisible">
      <h3 slot="title">新增管理员</h3>
      <v-form ref="addForm" slot="content" :formSettings="formSettings" @save="handleSaveAdmin">
        <template slot="cities" slot-scope="scope">
          <el-checkbox-group v-model="scope.model.cities" @change="handleCityCheckboxChange">
            <el-checkbox v-for="(checkItem, checkIndex) in cityList" :key="checkIndex" :label="checkItem.value" :disabled="cityDisabled && checkItem.value!=999">{{checkItem.label}}</el-checkbox>
          </el-checkbox-group>
        </template>
      </v-form>
    </v-page>
    <el-dialog title="编辑" :visible.sync="editDialogVisible" width="550px">
      <v-form ref="editForm" :formData="currentData" :formSettings="editSettings" showButton :btnLoading="editLoading" @save="submitEdit" @cancel="cancelEdit">
        <template slot="cities" slot-scope="scope">
          <el-checkbox-group v-model="scope.model.cities" @change="handleCityCheckboxChange">
            <el-checkbox v-for="(checkItem, checkIndex) in cityList" :key="checkIndex" :label="checkItem.value" :disabled="cityDisabled && checkItem.value!=999">{{checkItem.label}}</el-checkbox>
          </el-checkbox-group>
        </template>
      </v-form>
    </el-dialog>
  </div>
</template>
<script>
import searchHistoryMixin from '@/mixins/search-history.js'
import paginationMixin from '@/mixins/pagination.js'
import searchSettings from './components/searchSettings.js'
import formSettings from './components/formSettings.js'
import editSettings from './components/editSettings.js'

export default {
  name: 'administrator',

  mixins: [searchHistoryMixin, paginationMixin],

  data() {
    return {
      searchSettings: searchSettings,
      formInline: {
        user: ''
      },
      tableData: [],
      // 编辑表单
      editDialogVisible: false,
      editSettings: editSettings,
      // 新建表单
      newAdminVisible: false,
      formSettings: formSettings,
      roleList: null,
      currentData: null,
      editLoading: false,
      // 搜索数据
      searchData: {},
      resetPasswordVisible: false,
      // 城市权限列表,
      cityList: null,
      // 在选择全部城市的时候，禁用其他单个城市
      cityDisabled: false
    }
  },

  created() {
    this.loadTableData()
    this.loadRoleList()
  },

  methods: {
    formatTableData(data) {
      return data.map(item => {
        let tmpData = Object.assign({}, item.adminUser)
        Object.assign(tmpData, item.adminRole)
        tmpData.cityModels = item.cityModels
        return tmpData
      })
    },
    loadTableData() {
      this.$service.getAdminList(this.page, this.searchData).then(res => {
        let data = this.formatTableData(res.data.data.content)
        this._changePageTotal(res.data.data.totalElements)
        this.tableData = data
      })
    },
    handleSearch(data) {
      this.searchData = data
      if (data.username) {
        this._saveSearchHistory(data.username, 'username')
      }
      this.page = 1
      this.loadTableData()
    },
    loadRoleList() {
      this.$service.getAdminRoleList().then(res => {
        this.roleList = res.data.data.map(item => {
          return {
            label: item.roleName,
            value: item.roleId
          }
        })
        this.editSettings[0].items.find(
          item => item.name === 'roleId'
        ).options = this.roleList
        this.formSettings[0].items.find(
          item => item.name === 'roleId'
        ).options = this.roleList
        this.searchSettings.find(
          item => item.name === 'roleId'
        ).options = this.roleList
      })
    },
    getAllCities() {
      if (!this.cityList) {
        this.$service.getAllCities().then(res => {
          this.cityList = res.data.data.map(item => {
            return {
              label: item.name,
              value: item.id
            }
          })
        })
      }
    },
    // 显示新增表单
    handleNewAdmin() {
      this.cityDisabled = false
      this.newAdminVisible = true
      this.getAllCities()
    },
    handleCityCheckboxChange(checkedCities) {
      if (checkedCities && checkedCities.some(item => item == 999)) {
        this.cityDisabled = true
        if (this.editDialogVisible) {
          this.$refs.editForm.setData('cities', [999])
        } else {
          this.$refs.addForm.setData('cities', [999])
        }
      } else {
        this.cityDisabled = false
      }
    },
    // 添加管理员
    handleSaveAdmin(data) {
      this.$service.addAdmin(data).then(res => {
        this.newAdminVisible = false
        this.loadTableData()
        this.$message({
          message: '添加成功',
          type: 'success'
        })
      })
    },
    // 显示修改表单
    showEdit(data) {
      this.currentData = data
      this.cityDisabled = false
      this.currentData.cities = data.cityModels
        .filter(item => item.checked)
        .map(item => item.id)
      if (this.currentData.cities.some(item => item == 999)) {
        this.currentData.cities = [999]
        this.cityDisabled = true
      }
      if (!this.cityList) {
        this.cityList = data.cityModels.map(item => {
          return {
            label: item.name,
            value: item.id
          }
        })
      }

      this.editDialogVisible = true
    },
    // 提交修改
    submitEdit(data) {
      this.editLoading = true
      data.status = Number(data.statusVal)
      data.newRoleId = data.roleId
      this.$service
        .updateAdmin(this.currentData.userId, data)
        .then(res => {
          this.editLoading = false
          this.$refs.editForm.clearValidate()
          this.loadTableData()
          this.editDialogVisible = false
          this.$message({
            message: '修改成功',
            type: 'success'
          })
        })
        .catch(e => {
          this.editLoading = false
        })
      // this.editDialogVisible = false
    },
    cancelEdit() {
      this.editDialogVisible = false
    },
    showResetPassword(data) {
      this.currentData = data
      this.resetPasswordVisible = true
      this.$prompt('请输入新密码', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValidator: val => {
          if (!val) {
            return '密码不能为空'
          }
        }
      })
        .then(({ value }) => {
          this.$service
            .resetAdminPassword(this.currentData.userId, value)
            .then(res => {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
            })
        })
        .catch(e => {
          console.log('====e====', e)
        })
    }
  }
}
</script>
<style lang="scss">
.administrator {
  .el-form--inline .el-form-item {
    margin-bottom: 0;
  }
}
</style>
