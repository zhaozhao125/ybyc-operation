<template>
  <div class="edit-auth">
    <formGenerator class="auth-editor" ref="form" type="update" :formSettings="editSettings" :model="authData" showButtons viewMode @submit="handleSubmitEdit" @cancel="handleCancelEdit"></formGenerator>
    <div class="button-editor">
      <h4>按钮权限
        <el-button type="text" @click="handleShowAddButton">添加</el-button>
      </h4>
      <el-row :gutter="10" v-if="buttonData && buttonData.length">
        <el-col v-for="(item, index) in buttonData" :key="index" :lg="8" :md="12" :xs="24">
          <el-button class="auth-btn" plain size="small" @click="handleShowEditButton(item)">
            {{item.content}}
            <i class="el-icon-close" @click.stop="handleDeleteButton(item, index)"></i>
          </el-button>
        </el-col>
      </el-row>
      <p v-else>这里空空如也（～￣▽￣～）</p>
    </div>
    <addButton :visible.sync="buttonVisible" :buttonData="selectedButton" @add="handleAddButton" @edit="handleEditButton" @close="handleCloseAddButton"></addButton>
  </div>
</template>

<script>
import formGenerator from '@/components/formGenerator'
import editSettings from './editSettings.js'
import addButton from './add-button/add-button'
export default {
  name: 'edit-auth',

  props: {
    authData: {
      type: Object,
      default: () => {}
    }
  },

  components: {
    formGenerator,
    addButton
  },

  data() {
    return {
      editSettings: editSettings,
      buttonVisible: false,
      selectedButton: null,
      buttonData: []
    }
  },

  mounted() {
    if (this.authData && this.authData.operateModels) {
      this.buttonData = this.authData.operateModels
    }
  },

  watch: {
    authData() {
      if (this.authData && this.authData.operateModels) {
        this.buttonData = this.authData.operateModels
      }
    }
  },

  methods: {
    handleCancelEdit() {},
    handleSubmitEdit(data) {
      this.$service.updateAuth(data).then(res => {
        this.$refs.form.hideEditor()
        this.$message({
          message: '修改成功',
          type: 'success'
        })
        this.$emit('update', data)
      })
    },
    handleDeleteButton(data, index) {
      console.log('====data====', data)
      this.$confirm('是否删除该按钮权限?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$service.deleteButtonAuth(data.id).then(res => {
            this.buttonData.splice(index, 1)
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          })
        })
        .catch(() => {})
    },
    handleShowAddButton() {
      this.selectedButton = null
      this.buttonVisible = true
    },
    handleAddButton(data) {
      this.$service
        .createButtonAuth(this.authData.id, data.content, data.marker)
        .then(res => {
          this.buttonData.push(res.data.data)
          this.$message({
            type: 'success',
            message: '添加成功!'
          })
        })
    },
    handleShowEditButton(data) {
      this.selectedButton = data
      this.buttonVisible = true
    },
    handleEditButton(data) {
      console.log('====data====', data)
      this.$service.updateButtonAuth(data).then(res => {
        let index = this.buttonData.findIndex(item => item.id == data.id)
        this.selectedButton = null
        this.buttonData.splice(index, 1, data)
        this.$message({
          type: 'success',
          message: '修改成功!'
        })
      })
    },
    handleCloseAddButton() {
      this.selectedButton = null
    }
  }
}
</script>

<style lang="scss">
.edit-auth {
  .auth-editor {
    padding-bottom: 10px;
    border-bottom: 1px solid $color-border;
  }
  .button-editor {
    padding-top: 15px;
    h4 {
      .el-button {
        margin-left: 20px;
      }
    }
    > p {
      color: $color-gray;
      font-size: 14px;
      text-align: center;
      margin-top: 20px;
    }
    .el-col {
      margin-top: 15px;
    }
    .auth-btn {
      > span {
        transform: translateX(9px);
        display: inline-block;
        transition: all 0.2s ease-out;
      }
      &:hover {
        > span {
          transform: translateX(0);
        }
        i {
          opacity: 1;
        }
      }
      i {
        opacity: 0;
        border-radius: 50%;
        text-align: center;
        position: relative;
        cursor: pointer;
        font-size: 12px;
        height: 13px;
        width: 13px;
        line-height: 13px;
        vertical-align: middle;
        top: -1px;
        right: -5px;
        color: #409eff;
        &:hover {
          background-color: #409eff;
          color: #fff;
        }
      }
    }
  }
}
</style>
