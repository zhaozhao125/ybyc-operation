<template>
  <div class="flex-container">
    <div class="flex-wrapper">
      <div class="flex-box flex-top" v-if="$slots.top">
        <div class="resize-bar top-bar">
          <div class="inside-bar"></div>
        </div>
        <slot name="top"></slot>
      </div>
      <div class="flex-box flex-middle">
        <div class="flex-box flex-left" v-if="$slots.left">
          <div class="resize-bar left-bar">
            <div class="inside-bar"></div>
          </div>
          <slot name="left"></slot>
        </div>
        <div class="flex-box flex-center" v-if="$slots.center">
          <slot name="center"></slot>
        </div>
        <div class="flex-box flex-right" v-if="$slots.right">
          <div class="resize-bar right-bar">
            <div class="inside-bar"></div>
          </div>
          <slot name="right"></slot>
        </div>
      </div>
      <div class="flex-box flex-bottom" v-if="$slots.bottom">
        <div class="resize-bar bottom-bar">
          <div class="inside-bar"></div>
        </div>
        <slot name="bottom"></slot>
      </div>
    </div>
  </div>
</template>
<script>
/*调用示例
import vTest from '@/components/flexContainer'
<v-test topHeight="200px" leftWidth="50%">
  <div class="top" slot="top">
    <h1>top</h1>
  </div>
  <div class="bottom" slot="bottom">
    <h1>bottom</h1>
  </div>
  <div class="left" slot="left">
    <h1>left</h1>
  </div>
  <div class="right" slot="right">
    <h1>right</h1>
  </div>
  <div class="center" slot="center">//此项为必须，其他可任意组合
    <h1>center</h1>
  </div>
</v-test>
*/

window.requestAnimationFrame = (function() {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback) {
      window.setTimeout(callback, 1000 / 60); //定义每秒执行60次动画
    }
})()
export default {
  props: ['topHeight', 'bottomHeight', 'leftWidth', 'rightWidth'],
  methods: {
    bindEvents($el, position) {
      if (!$el.nodeType) {
        throw new Error('flexContainer-bindEvents: 参数不是DOM类型')
        return
      }
      let startX
      let startY
      let startWidth
      let startHeight
      let $container = this.$el
      let $resizer = $el.querySelector('.resize-bar')
      $resizer.addEventListener('mousedown', onMouseDown, false)

      function onMouseDown(event) {
        startX = event.pageX
        startY = event.pageY
        startWidth = $el.clientWidth
        startHeight = $el.clientHeight
        document.body.classList.add('noselect')
        document.addEventListener('mousemove', onMouseMove, false)
        document.addEventListener('mouseup', onMouseUp, false)
      }

      function onMouseMove(event) {
        requestAnimationFrame(() => {
          if (position == 'top') {
            $el.style.height = Math.max(startHeight + (event.pageY - startY), 50) + 'px'
          } else if (position == 'bottom') {
            $el.style.height = Math.max(startHeight - (event.pageY - startY), 69) + 'px'
          } else if (position == 'left') {
            $el.style.width = Math.max(startWidth + (event.pageX - startX), 50) + 'px'
          } else if (position == 'right') {
            $el.style.width = Math.max(startWidth - (event.pageX - startX), 50) + 'px'
          }
        })
      }

      function onMouseUp(event) {
        document.body.classList.remove('noselect')
        document.removeEventListener('mousemove', onMouseMove)
        document.removeEventListener('mouseup', onMouseUp)
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      (this.topHeight && this.$slots.top) && (this.$el.querySelector('.flex-top').style.height = this.topHeight);
      (this.bottomHeight && this.$slots.bottom) && (this.$el.querySelector('.flex-bottom').style.height = this.bottomHeight);
      (this.leftWidth && this.$slots.left) && (this.$el.querySelector('.flex-left').style.width = this.leftWidth);
      (this.rightWidth && this.$slots.right) && (this.$el.querySelector('.flex-right').style.width = this.rightWidth);

      this.$slots.top && this.bindEvents(this.$el.querySelector('.flex-top'), 'top')
      this.$slots.bottom && this.bindEvents(this.$el.querySelector('.flex-bottom'), 'bottom')
      this.$slots.left && this.bindEvents(this.$el.querySelector('.flex-left'), 'left')
      this.$slots.right && this.bindEvents(this.$el.querySelector('.flex-right'), 'right')
    })
  }
}

</script>
<style lang="scss">
body.noselect {
  user-select: none;
}

.flex-container {
  width: 100%;
  height: 100%;
  .flex-wrapper {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    .flex-box {
      position: relative;
      overflow: hidden;
    }
    .flex-top {
      width: 100%;
      height: 100px; // background-color: red;
    }
    .flex-middle {
      flex: 1; // background-color: yellow;
      display: flex;
      flex-direction: row;
      .flex-left {
        width: 100px;
        height: 100%; // background-color: green;
      }
      .flex-right {
        width: 100px;
        height: 100%; // background-color: purple;
      }
      .flex-center {
        flex: 1;
        height: 100%; // background-color: pink;
      }
    }
    .flex-bottom {
      width: 100%;
      height: 100px; // background-color: blue;
    }

    .resize-bar {
      box-shadow: inset 0 0 3px 1px rgba(0, 0, 0, .4);
      position: absolute;
      overflow: hidden;
      opacity: 0.6;
      z-index: 1000;
      .inside-bar {
        margin: auto;
        background-color: #20a0ff;
      }
      &.top-bar,
      &.bottom-bar {
        width: 100%;
        height: 5px;
        cursor: row-resize;
        .inside-bar {
          width: 30px;
          height: 100%;
        }
      }
      &.left-bar,
      &.right-bar {
        width: 5px;
        height: 100%;
        cursor: col-resize;
        .inside-bar {
          width: 100%;
          height: 30px;
          position: absolute;
          top: 0;
          bottom: 0;
        }
      }
      &.top-bar {
        bottom: 0;
      }
      &.bottom-bar {
        top: 0;
      }
      &.left-bar {
        right: 0;
      }
      &.right-bar {
        left: 0;
      }
    }
  }
}

</style>
