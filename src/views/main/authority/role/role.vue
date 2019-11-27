<template>
  <div class="role-management">
    <el-card>
      <div class="table-operator" slot="header">
        <el-button type="primary" size="small" @click="handleNewRole">新增</el-button>
      </div>
      <div class="table-container">
        <el-table :data="tableData">
          <el-table-column prop="roleName" label="角色名" min-width="120">
          </el-table-column>
          <el-table-column prop="summary" label="描述" min-width="180">
          </el-table-column>
          <el-table-column label="操作" min-width="150">
            <template slot-scope="scope">
              <el-button type="text" @click="showAuth(scope.row)" width="150">查看权限</el-button>
              <el-button type="text" @click="showEdit(scope.row)" width="150">修改信息</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <v-page :visible.sync="authVisible" v-if="currentRole">
      <h3 slot="title">查看 {{currentRole.roleName}} 权限</h3>
      <authTree slot="content" :authData="currentRoleAuth"></authTree>
    </v-page>
    <el-dialog title="新增角色信息" :visible.sync="addVisible" width="500px">
      <formGenerator ref="editForm" type="add" :formSettings="editSettings" labelWidth="90px" showButtons :btnLoading="formLoading" @submit="submitAdd" @cancel="cancelAdd"></formGenerator>
    </el-dialog>
    <el-dialog title="修改角色信息" :visible.sync="editVisible" width="500px">
      <formGenerator ref="editForm" type="update" :model="currentRole" :formSettings="editSettings" labelWidth="90px" showButtons :btnLoading="formLoading" @submit="submitEdit" @cancel="cancelEdit"></formGenerator>
    </el-dialog>
  </div>
</template>
<script>
import authTree from './components/auth-tree.vue'
import editSettings from './components/editSettings.js'
export default {

  name: 'role',

  components: {
    authTree
  },

  data() {
    return {
      tableData: [],
      currentRole: null,
      authVisible: false,
      currentRoleAuth: null,
      editVisible: false,
      addVisible: false,
      editSettings: editSettings,
      formLoading: false
    }
  },

  methods: {
    loadTableData() {
      this.$service.getAdminRoleList().then(res => {
        this.tableData = res.data.data
      })
    },
    handleNewRole() {
      this.addVisible = true
    },
    showAuth(role) {
      this.currentRole = role
      this.$service.getAuthByRole(role.roleId).then(res => {
        this.currentRoleAuth = res.data.data
        this.authVisible = true
      })
    },
    showEdit(role) {
      this.currentRole = role
      this.editVisible = true
      this.$nextTick(() => {
        this.$refs.editForm.clearValidate()
      })
    },
    submitAdd(data) {
      this.formLoading = true
      this.$service.addAdminRole(data).then(res => {
        this.addVisible = false
        this.$message({
          message: '添加成功',
          type: 'success'
        })
        this.loadTableData()
        this.this.formLoading = false
      }).catch(err => {
        this.formLoading = false
      })
    },
    cancelAdd() {
      this.addVisible = false
    },
    submitEdit(data) {
      this.formLoading = true
      this.$service.updateRoleInfo(this.currentRole.roleId, data.roleName, data.summary).then(res => {
        this.$refs.editForm.clearValidate()
        this.editVisible = false
        this.$message({
          message: '修改成功',
          type: 'success'
        })
        this.loadTableData()
        this.formLoading = false
      }).catch(err => {
        this.formLoading = false
      })
    },
    cancelEdit() {
      this.editVisible = false
    }
  },

  mounted() {
    this.loadTableData()
  }
}
</script>
<style lang="scss" scoped>

</style>
