<template>
  <el-tabs v-model="activeTabName" class="tabs" type="card" closable @tab-remove="removeTab" @tab-click="handleClickTab">
    <el-tab-pane v-for="(tab) in tabs" v-if="tab" :key="tab.name" :label="tab.label" :name="tab.name">
      <!-- <div class="breadcrumb-container">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item v-for="(item, index2) in tab.breadcrumb"
                            :key="index2">{{item}}</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button class="refresh-btn"
                 type="primary"
                 size="small" @click="refreshTab(index)">刷新</el-button>
    </div> -->
      <!-- <pre>{{tabs}}</pre> -->
      <component v-if="tab.name" :params="tab.params" :is="tab.name"></component>
    </el-tab-pane>
    <vue-context-menu class="right-menu" :target="contextMenuTarget" :show="contextMenuVisible" @update:show="(show) => contextMenuVisible = show">
      <a href="javascript:;" @click="closeCurrentTab">关闭</a>
      <a href="javascript:;" @click="closeOtherTabs">关闭其他</a>
      <a href="javascript:;" @click="refreshThisTab">刷新此页</a>
    </vue-context-menu>
  </el-tabs>
</template>
<script>
import $ from 'webpack-zepto'
import { component as VueContextMenu } from '@xunlei/vue-context-menu'
import car from './children/car.js'
import order from './children/order.js'
import shortRental from './children/short-rental.js'
import system from './children/system.js'
import auth from './children/auth.js'
import user from './children/user.js'
import branches from './children/branches.js'
import carService from './children/car-service.js'
import marketing from './children/marketing.js'
import customerService from './children/customer-service.js'
import feedback from './children/user-feedback.js'
import feedbackproblem from './children/user-feedbackpro.js'
import funds from './children/funds.js'
import customer from './children/customer.js'
import charging from './children/charging.js'
import content from './children/content.js'
import company from './children/company.js'
import parking from './children/parking.js'
export default {
  name: 'tabs',
  components: {
    'vue-context-menu': VueContextMenu,
    ...car,
    ...order,
    ...shortRental,
    ...system,
    ...auth,
    ...user,
    ...branches,
    ...carService,
    ...marketing,
    ...customerService,
    ...feedback,
    ...feedbackproblem,
    ...funds,
    ...customer,
    ...charging,
    ...content,
    ...company,
    ...parking
  },

  data() {
    return {
      activeTabName: this.$store.getters.activeTab.name,
      contextMenuTarget: null,
      contextMenuVisible: false,
      contextMenuIndex: 0
    }
  },

  computed: {
    tabs() {
      return this.$store.getters.tabs
    },
    activeTab() {
      return this.$store.getters.activeTab
    },
    tabParams() {
      return this.$store.getters.tabParams
    }
  },

  methods: {
    removeTab(tabName) {
      this.$store.commit('removeTab', tabName)
    },
    handleClickTab(tab) {
      this.$store.commit('clickTab', tab.name)
    },
    refreshTab(index) {
      let tmpName = this.tabs[index].name
      this.tabs[index].name = ''
      // 清除当前tab的参数
      this.$store.commit('clearTabParam', tmpName)
      this.$nextTick(() => {
        this.tabs[index].name = tmpName
      })
    },
    closeCurrentTab() {
      this.contextMenuVisible = false
      if (this.tabs.length === 1) {
        this.removeTab(this.activeTab.name)
      } else {
        this.removeTab(this.tabs[this.contextMenuIndex].name)
      }
    },
    closeOtherTabs() {
      this.contextMenuVisible = false
      if (this.tabs.length > 1) {
        this.$store.commit('clickTab', this.tabs[this.contextMenuIndex].name)
        this.$store.commit('removeOtherTabs')
      }
    },
    refreshThisTab() {
      this.contextMenuVisible = false
      this.refreshTab(this.contextMenuIndex)
    }
  },

  watch: {
    activeTab(tab) {
      this.activeTabName = tab.name
      console.log('====this.activeTabName====', this.activeTabName)
    },
    tabParams(newData) {
      if (newData.name) {
        let targetTab = this.tabs.find(item => item.name === newData.name)
        if (targetTab) {
          targetTab.params = newData.params
          this.$store.commit('clickTab', targetTab.name)
        } else {
          this.$store.commit('addTab', newData)
        }
      }
    }
  },

  mounted() {
    this.contextMenuTarget = this.$el.querySelector('.el-tabs__nav')
    // 给标签绑定右键事件，获取点击tab的index
    $(this.$el).find('.el-tabs__nav').on('contextmenu', (event) => {
      event.preventDefault()
      let $targetTab = $(event.target)
      if (!$targetTab.hasClass('el-tabs__item')) {
        $targetTab = $targetTab.parent('.el-tabs__item')
      }
      let tabIndex = $targetTab.index()
      this.contextMenuIndex = tabIndex
    })
  }
}

</script>
<style lang="scss">
.tabs {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: $color-bg;
  .el-tabs__header {
    height: 60px;
    padding: 15px $size-padding 0;
    margin-bottom: 0;
    user-select: none;
    .el-tabs__nav {
      border: none;
    }
    .el-tabs__item {
      height: 44px;
      line-height: 44px;
      border: 1px solid $color-border-dark !important;
      border-bottom-color: $color-bg-dark !important;
      margin-right: 6px;
      background-color: $color-bg-dark;
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
      letter-spacing: 1px;
      &.is-closable {
        border-color: #bac2c3 !important;
        border-bottom: none !important;
        background-color: #e5e6e6;
      }
    }
    .el-tabs__item.is-active {
      height: 45px;
      background-color: $color-white;
      border-bottom-color: $color-white !important;
    }
  }
  .el-tabs__content {
    position: absolute;
    top: 60px;
    bottom: $size-padding;
    left: $size-padding;
    right: $size-padding;
    background-color: $color-white;
    border: 1px solid $color-border-dark;
    border-top: none;
    background-image: url('~@/assets/img/opening.png');
    background-repeat: no-repeat;
    background-position: center;
    .el-tab-pane {
      width: 100%;
      height: 100%;
      overflow: auto;
      background-color: #fff;
      > div:first-child {
        padding: $size-padding;
      }
    }
  }
  .el-card {
    box-shadow: none!important;
    border: none;
  }
  /* .breadcrumb-container {
    padding: 0px 10px 10px;
    .el-breadcrumb {
      display: inline-block;
    }
    .refresh-btn {
      margin-left: 50px;
    }
  } */
  .right-menu {
    position: fixed;
    background: #fff;
    border-radius: 3px;
    border: 1px solid #eee;
    box-shadow: 0 0.5em 1em 0 rgba(0, 0, 0, 0.1);
    z-index: 999;
    display: none;
    padding: 5px 0;
    a {
      font-size: 14px;
      width: 100px;
      height: 30px;
      line-height: 30px;
      padding: 2px 10px;
      display: block;
      color: #1a1a1a;
      &:hover {
        color: #fff;
        background: $color-blue;
      }
    }
  }
}

.tabs > .el-tabs__content > .el-tab-pane {
  > div {
    height: 100%;
    .table-box {
      height: 100%;
      display: flex;
      flex-direction: column;
      > .el-card__header {
        padding-bottom: $size-padding;
      }
      > .el-card__body {
        padding: $size-padding 0 0;
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        .table-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
      }
    }
  }
}

</style>
