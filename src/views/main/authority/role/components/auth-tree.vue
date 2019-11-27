<template>
  <div class="auth-tree">
    <!-- {{checkedAuth}} -->
    <el-tree ref="authTree" v-if="authData" :data="authData.authUrls" :props="defaultProps" show-checkbox node-key="id" :default-expand-all="true" :default-checked-keys="checkedAuth" :check-strictly="true" @current-change="handelCurrentChange" :render-content="treeRender">
    </el-tree>
    <div class="auth-btn-container">
      <el-button type="primary" size="small" @click="changeAuth">保存</el-button>
      <el-button size="small" @click="handleCheckAll">全选</el-button>
      <el-button size="small" @click="handleClearAll">清空</el-button>
    </div>
  </div>

</template>

<script>
import $ from 'webpack-zepto'
import treeRender from './tree-render.js'
export default {
  name: 'auth-tree',

  props: {
    authData: {
      type: Object
    }
  },

  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },

  computed: {
    checkedAuth() {
      let ret = []
      if (this.authData && this.authData.authUrls.length) {
        ret = this.getCheckedAuth(this.authData.authUrls)
      }
      return ret
    }
  },

  created() {
    this.formatAuthData(this.authData.authUrls)
  },

  mounted() {
    this.$nextTick(() => {
      $(this.$el)
        .find('.auth-level3')
        .each(function(index, el) {
          $(el)
            .parents('.el-tree-node__children')
            .eq(0)
            .addClass('auth-url')
        })
      $(this.$el)
        .find('.auth-button')
        .each(function(index, el) {
          $(el)
            .parents('.el-tree-node__children')
            .eq(0)
            .addClass('auth-button-container')
        })
    })
  },

  watch: {
    authData() {
      this.formatAuthData(this.authData.authUrls)
    }
  },

  methods: {
    formatAuthData(authData) {
      if (!authData) {
        return
      }
      authData.forEach(item => {
        if (item.operateModels && item.operateModels.length) {
          item.operateModels.forEach(buttonItem => {
            buttonItem.name = buttonItem.content
            buttonItem.type = 'buttonAuth'
            buttonItem.originalId = buttonItem.id
            buttonItem.id = 'btn' + buttonItem.originalId
          })
          if (item.children && item.children.length) {
            item.children = item.children.concat(item.operateModels)
          } else {
            item.children = item.operateModels
          }
        }
        this.formatAuthData(item.children)
      })
    },
    getCheckedAuth(authList) {
      let ret = []
      authList.forEach(item => {
        if (item.checked) {
          ret.push(item.id)
        }
        if (item.children) {
          ret = ret.concat(this.getCheckedAuth(item.children))
        }
      })
      return ret
    },
    handelCurrentChange(data) {
      console.log('========', data)
    },
    changeAuth() {
      let checkedAuthSet = new Set()
      let checkedButtonSet = new Set()
      this.$refs.authTree.getCheckedNodes().forEach(item => {
        if (item.type === 'buttonAuth') {
          checkedButtonSet.add(item.id)
        } else {
          checkedAuthSet.add(item.id)
        }
        // 如果子树没有全部选中，则getCheckedNodes不会获取父节点
        // 因此只要子树有一个被选中，则父节点就需要被选中
        checkedAuthSet.add(item.parentId)
      })
      console.log('====this.authData====', this.authData)
      this.authData.authUrls.forEach(item => {
        if (
          item.children &&
          item.children.some(child => checkedAuthSet.has(child.id))
        ) {
          checkedAuthSet.add(item.id)
        }
      })
      let checkedAuthKeys = [...checkedAuthSet]
      let checkedButtonKeys = [...checkedButtonSet].map(item =>
        Number(item.replace('btn', ''))
      )
      this.$service
        .updateRoleAuth(
          this.authData.roleId,
          checkedAuthKeys,
          checkedButtonKeys
        )
        .then(res => {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
        })
    },
    treeRender,
    handleCheckAll() {
      this.$refs.authTree.setCheckedNodes(this.authData.authUrls)
    },
    handleClearAll() {
      this.$refs.authTree.setCheckedNodes([])
    }
  }
}
</script>

<style lang="scss">
.auth-tree {
  padding-left: 60px;
  .auth-btn-container {
    position: absolute;
    left: 0;
    bottom: 0;
    background-color: #fff;
    width: 100%;
    padding: 15px 30px;
    z-index: 9;
    box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.3);
  }
  .el-tree {
    padding-bottom: 60px;
  }
  // .el-tree {
  //   >.el-tree-node {
  //     margin-bottom: 20px;
  //     .el-tree-node__children.auth-url{
  //       display: flex;
  //       max-width: 800px;
  //       flex-wrap: wrap;
  //     }
  //     // >.el-tree-node__children {
  //     //   >.el-tree-node {
  //     //     >.el-tree-node__children {
  //     //       display: flex;
  //     //       max-width: 800px;
  //     //       flex-wrap: wrap;
  //     //     }
  //     //   }
  //     // }
  //   }
  // }
  .el-tree {
    .auth-button-container {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      > div {
        flex: 0 0 33.333%;
      }
    }
  }
  .auth-level1 {
    // font-size: 20px;
    // color: $color-red;
    font-weight: bold;
    color: #000;
  }
  // .auth-level2 {
  //   font-size: 18px;
  //   color: $color-yellow;
  // }
  .auth-level3 {
    // font-size: 16px;
    // font-weight: lighter;
    color: $color-gray;
  }
  .auth-button {
    &::before {
      content: '按钮：';
      color: $color-gray;
      font-size: 0.8em;
    }
  }
}
</style>
