<template>
  <div class="v-gallery">
    <ul v-if="imgs" v-show="!inbox">
      <li v-for="(item, index) in imgs" :key="index">
        <span v-if="descriptionType === 'show' && imgDescription && imgDescription[index]">{{imgDescription[index]}}</span>
        <el-tooltip v-if="(descriptionType === 'tooltip') && imgDescription && imgDescription[index]" effect="dark" :content="imgDescription[index]" placement="top">
          <img :src="item" alt="">
        </el-tooltip>
        <img v-else :src="item" alt="">
      </li>
    </ul>
  </div>
</template>
<script>
import Viewer from 'viewerjs'
export default {

  name: 'vGallery',

  props: {
    imgs: {
      type: Array,
      required: true,
      default: () => {
        return []
      }
    },
    // 图片描述文字，顺序与图片数组顺序相同
    imgDescription: {
      type: Array
    },
    descriptionType: {
      type: String,
      default: 'tooltip'
    },
    inbox: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      imgViewer: null
    }
  },

  methods: {
    initViewer() {
      if (this.imgViewer && this.imgViewer.destroy) {
        this.imgViewer.destroy()
      }
      if (this.imgs) {
        this.$nextTick(() => {
          this.imgViewer = new Viewer(this.$el, {
            transition: false,
            inline: this.inbox,
            button: !this.inbox,
            navbar: !this.inbox,
            title: !this.inbox,
            keyboard: !this.inbox,
            loop: !this.inbox
          })
        })
      }
    }
  },

  mounted() {
    if (this.imgs && this.imgs.length) {
      this.$nextTick(() => {
        this.initViewer()
      })
    }
  },

  watch: {
    imgs() {
      if (!this.imgs || !this.imgs.length) {
        if (this.imgViewer && this.imgViewer.destroy) {
          this.imgViewer.destroy()
        }
        return
      }
      console.log('watch imgs change')
      this.initViewer()
    }
  },

  beforeDestroy() {
    if (this.imgViewer && this.imgViewer.destroy) {
      this.imgViewer.destroy()
    }
  }
}
</script>
<style lang="scss">
.v-gallery {
  li {
    position: relative;
    overflow: hidden;
    width: 100px;
    display: inline-block;
    margin: 5px;
    img {
      object-fit: contain;
      object-position: center top;
      width: 100px;
      height: 100px;
      cursor: zoom-in;
    }
    span {
      color: #303133;
      font-size: 14px;
      display: inline-block;
      margin-bottom:5px;
    }
  }
}

</style>
