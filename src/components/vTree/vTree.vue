<template>
<div class="v-tree">
  <div class="v-tree-container">
    <div class="v-tree-search"
         @keyup.enter="handleSearch"
         style="margin-bottom: 10px;">
      <div class="el-input">
        <el-input placeholder="请输入关键字搜索"
                  v-model="filterText">
          <el-button slot="append"
                     icon="el-icon-search"
                     @click="handleSearch"></el-button>
        </el-input>
      </div>
    </div>
    <el-tree ref="vTree"
             :data="data"
             :props="defaultProps"
             node-key="id"
             :render-content="renderContent"
             highlight-current
             :filter-node-method="filterNode"
             :expand-on-click-node="false"
             @current-change="handleCurrentChange">
    </el-tree>
  </div>
  <el-dialog title="添加"
             :visible.sync="dialogVisible"
             @close="handleCloseDialog">
    <v-form-generator ref="addForm"
                      :showButtons="true"
                      :formSettings="formSettings"
                      @submit="handleAddSubmit"
                      @cancel="handleAddCancel"></v-form-generator>
  </el-dialog>
</div>

</template>

<script>
/*
# 事件：
- current-change: 当前选中节点变化时触发，有data和node两个参数
- add: 添加节点时触发，发送添加节点数据
- remove: 删除节点时触发，发送删除节点数据

# 方法
- appendNode: 向当前节点添加子节点，参数为添加的数据
- removeNode: 无参数时删除当前节点，传入节点数据参数时，删除该数据对应节点
*/
import renderContent from './render.js'
import vFormGenerator from '@/components/formGenerator'
export default {
  components: {
    vFormGenerator
  },
  props: {
    data: { // 传入的Tree数据
      type: Array,
      default: null
    },
    defaultProps: {
      type: Object,
      default() {
        return {
          children: 'children',
          label: 'name'
        }
      }
    },
    nodeKey: { // 同element中tree的node-key
      type: String,
      default: 'id'
    },
    editable: { // 是否可增删节点
      type: Boolean,
      default: true
    },
    editableLevel: {
      type: Number,
      default: 0
    },
    showSearch: { // 是否支持搜索
      type: Boolean,
      default: true
    },
    formSettings: { // 添加节点时的表单设置，详情见formGenerator组件的使用方法
      type: Object,
      default: null
    },
    enableForm: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      filterText: '',
      dialogVisible: false,
      currentStore: null,
      currentData: null,
      id: 1
    }
  },
  methods: {
    filterNode(value, data) {
      if (!value) {
        return true
      }
      return data[this.defaultProps.label].indexOf(value) !== -1
    },
    handleSearch() {
      this.$refs.vTree.filter(this.filterText)
    },
    handleCurrentChange(data, node) {
      this.$emit('current-change', data, node)
    },
    handleCloseDialog() {
      this.$refs.addForm.resetFields()
    },

    showAddForm(store, data) {
      if (this.enableForm) {
        this.currentStore = store
        this.currentData = data
        this.dialogVisible = true
      } else {
        this.$emit('add')
      }
    },
    handleAddSubmit(data) {
      this.$emit('add', Object.assign({}, data))
      this.dialogVisible = false
    },
    handleAddCancel() {
      this.dialogVisible = false
      this.handleCloseDialog()
    },

    appendNode(data) {
      console.log(data, '++++')
      this.currentStore.append(data, this.currentData)
    },
    remove(store, data, node) {
      console.log('========', store, data, node)
      this.currentStore = store
      this.currentData = data
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$emit('remove', data, node, store)
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: '已取消删除'
        // })
      })
    },
    removeNode(data) {
      this.currentStore.remove(data || this.currentData)
    },
    updateKeyChildren(key, data) {
      this.$refs.vTree.updateKeyChildren(key, data)
    },
    getCurrentNode() {
      return this.$refs.vTree.getCurrentNode()
    },
    renderContent: renderContent
  }
}

</script>

<style lang="scss">
.v-tree {
  .el-tree-node__content {
    .tree-item {
      width: 100%;
      position: relative;
    }
    .tree-buttons {
      position: absolute;
      top: 0;
      right: 10px;
      opacity: 0; // transition: opacity .1s;
      .el-button--mini {
        padding: 5px 12px;
      }
    }
    &:hover {
      .tree-buttons {
        opacity: 1;
      }
    }
  }
}
</style>
