<template>
  <div class="v-gallery">
    <ul v-if="imgs" v-show="!inbox">
      <li class="img-li" v-for="(item, index) in imgs" :key="index">
        <el-tooltip v-if="imgDescription && imgDescription[index]" effect="dark" :content="imgDescription[index]" placement="top">
          <img :src="item" alt="">
        </el-tooltip>
        <img class="img" v-else :src="item" alt="">
      </li>
    </ul>
  </div>
</template>
<script>
import Viewer from 'viewerjs';
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
  .img-li {
    position: relative;
    overflow: hidden;
    width: 500px;
    display: inline-block;
    margin: 5px;
    .img {
      object-fit: contain;
      object-position: center;
      width: 400px;
      height: 300px;
      cursor: zoom-in;
    }
  }
}

</style>
