<template>
  <div class="v-page" v-if="visible">
    <el-card>
      <div slot="header" class="v-page--header">
        <el-button type="text" class="return-btn" @click="goBack">
          <i class="el-icon-arrow-left"></i> 返回
        </el-button>
        <div class="v-page--title">
          <slot name="title"></slot>
        </div>
      </div>
      <div class="v-page-content">
        <slot name="content"></slot>
      </div>
    </el-card>
  </div>
</template>
<script>
export default {
  name: 'vPage',
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    // 关闭前回调，return false，则会终止组件内关闭
    beforeClose: {
      type: Function,
      default: () => {
        return true
      }
    }
  },
  data() {
    return {}
  },
  methods: {
    goBack() {
      // 这种写法可以让子组件改变父组件的状态
      // 点击返回时 让外面传过来的数据变为false 也就是改变了父组件传入的数据
      if (this.beforeClose()) {
        this.$emit('update:visible', false)
      }
      this.$emit('goBack')
    }
  },
  mounted() { },
  watch: {
    visible(val) {
      // alert(val)
      this.$emit('update:visible', val)
    }
  }
}

</script>
<style lang="scss">
.v-page {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: $size-padding;
  background-color: $color-white;
  z-index: 99;
  .v-page--header {
    display: flex;
    align-items: center;
    width: 100%;
    .return-btn {
      margin-right: 20px;
    }
    .v-page--title {
      flex: 1;
      > .page-header-container {
        display: flex;
        h3 {
          margin-right: auto;
          display: flex;
          align-items: center;
        }
      }
    }
  }
  >.el-card {
    width: 100%;
    height: 100%;
    >.el-card__header {
      height: 70px;
      padding: 0 20px;
      display: flex;
      align-items: center;
      padding-top: 3px;
    }
    >.el-card__body {
      height: calc(100% - 70px);
      .v-page-content {
        height: 100%;
        overflow: auto;
      }
    }
  }
}
</style>
