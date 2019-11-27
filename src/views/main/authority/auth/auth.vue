<template>
  <div class="auth-management">
    <el-card>
      <div slot="header">
        <div class="table-operator">
          <el-button type="primary" size="small" @click="handleAddRootAuth">新增一级菜单</el-button>
        </div>
      </div>
      <el-row :gutter="30">
        <el-col :span="12">
          <v-tree ref="authTree" v-if="treeData" :data="treeData" @current-change="handleChangeAuth" :formSettings="addSettings" @add="handleAddChildAuth" @remove="handleRemoveAuth" :editableLevel="2"></v-tree>
        </el-col>
        <el-col :span="12" v-if="currentAuth">
          <!-- {{currentAuth}} -->
          <editAuth :auth-data="currentAuth" @update="handleUpdateSuccess"></editAuth>
        </el-col>
      </el-row>
    </el-card>
    <el-dialog title="新增权限" :visible.sync="addAuthVisible" width="500px">
      <formGenerator ref="addForm" type="update" :formSettings="addSettings" :model="addModel" showButtons :btnLoading="formLoading" @submit="handleAddAuth" @cancel="handleCancelAdd"></formGenerator>
    </el-dialog>
  </div>
</template>
<script>
import vTree from '@/components/vTree/vTree'
import editAuth from './components/edit-auth.vue'
import formGenerator from '@/components/formGenerator'
import addSettings from './components/addSettings.js'
let levelArr = ['', '一级菜单', '普通菜单', '权限URL']
export default {
  name: 'auth',

  components: {
    vTree,
    editAuth,
    formGenerator
  },

  data() {
    return {
      treeData: null,
      addAuthVisible: false,
      currentAuth: null,
      addSettings: addSettings,
      addModel: {},
      formLoading: false
    }
  },

  methods: {
    loadTreeData() {
      this.$service.getAllAuth().then(res => {
        this.treeData = res.data.data
      })
    },
    clearAddFormValidate() {
      this.$nextTick(() => {
        this.$refs.addForm.clearValidate()
      })
    },
    handleAddRootAuth() {
      this.addModel = {
        parentName: '无',
        parentId: '',
        cnLevel: '一级菜单',
        typeLevel: 1
      }
      this.clearAddFormValidate()
      this.addAuthVisible = true
    },
    handleChangeAuth(data) {
      this.currentAuth = data
    },
    handleAddAuth(data) {
      this.formLoading = true
      this.$service
        .addAuth(data)
        .then(res => {
          this.addAuthVisible = false
          this.$message({
            message: '添加成功',
            type: 'success'
          })
          this.loadTreeData()
          this.formLoading = false
        })
        .catch(err => {
          this.formLoading = false
        })
    },
    handleCancelAdd() {
      this.addAuthVisible = false
    },
    handleAddChildAuth() {
      this.$nextTick(() => {
        console.log('====this.currentAuth====', this.currentAuth)
        this.addModel = {
          parentName: this.currentAuth.name,
          parentId: this.currentAuth.id,
          cnLevel: levelArr[this.currentAuth.typeLevel + 1],
          typeLevel: this.currentAuth.typeLevel + 1
        }
        this.clearAddFormValidate()
        this.addAuthVisible = true
      })
    },
    handleRemoveAuth(data, node, store) {
      console.log('====remove====', data, node, store)
      if (data.children && data.children.length) {
        this.$message({
          message: '只能删除下级为空的权限',
          type: 'warning'
        })
        return
      }
      this.$service.deleteAuth(data.id).then(res => {
        console.log('====res====', res)
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        if (data.typeLevel == 1) {
          let index = node.parent.data.findIndex(item => item.id == data.id)
          node.parent.data.splice(index, 1)
        } else {
          let index = node.parent.data.children.findIndex(
            item => item.id == data.id
          )
          node.parent.data.children.splice(index, 1)
        }

        // this.loadTreeData()
      })
    },
    handleUpdateSuccess(data) {
      Object.assign(this.currentAuth, data)
      // this.currentAuth.name = data.name
      // this.currentAuth.summary = data.summary
      // this.currentAuth.typeLevel = data.typeLevel
      // this.currentAuth.url = data.url
      // this.currentAuth.icon = data.icon
      // this.currentAuth.marker = data.marker
      // this.$refs.authTree.updateKeyChildren(this.currentAuth.id, this.currentAuth)
    }
  },

  mounted() {
    this.loadTreeData()
  }
}
</script>
<style lang="scss">
.auth-management {
  height: 100%;
  > .el-card {
    height: 100%;
    .el-card__body {
      height: calc(100% - 60px);
      .el-row {
        height: 100%;
        .el-col {
          height: 100%;
          .v-tree {
            height: 100%;
            .v-tree-container {
              height: 100%;
              > .el-tree {
                height: calc(100% - 50px);
                overflow: auto;
              }
            }
          }
        }
      }
    }
  }
}
</style>
