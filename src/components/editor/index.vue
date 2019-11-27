<template>
  <div>
    <div ref="editor" style="text-align:left"></div>
    <!-- <button v-on:click="getContent">查看内容</button> -->
  </div>
</template>

<script>
import E from 'wangeditor'
import { UP_URL, DOWN_URL } from '@/config/base-url'
export default {
  name: 'editor',

  props: {
    // 编辑器默认内容
    content: {
      type: String,
      default: ''
    },
    height: {
      type: String,
      default: '300px'
    }
  },

  data() {
    return {
      currentContent: '',
      upToken: '',
      editorIns: null
    }
  },

  methods: {
    // 获取编辑器内容
    getContent() {
      return this.currentContent
    },
    setContent(content) {
      this.editorIns && this.editorIns.txt.html(content)
    },
    // 获取上传七牛的token
    getUpToken(cb) {
      this.$service
        .getUpToken()
        .then(res => {
          this.upToken = res.data.data.token
          cb && cb.call(this, this.upToken)
        })
        .catch(e => {
          this.$confirm(
            '获取上传token失败，将无法上传文件，是否重新请求token',
            '提示',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }
          )
            .then(() => {
              this.getUpToken()
            })
            .catch(() => {})
        })
    }
  },

  mounted() {
    this.getUpToken(token => {
      this.currentContent = this.content
      var editor = new E(this.$refs.editor)
      console.log('====editor.customConfig====', editor.customConfig)
      editor.customConfig.onchange = html => {
        this.currentContent = html
        this.$emit('change', html)
      }
      // 配置服务器端地址
      editor.customConfig.uploadImgServer = UP_URL
      editor.customConfig.uploadImgParams = {
        token
      }
      // 将图片大小限制为 1M
      editor.customConfig.uploadImgMaxSize = 1 * 1024 * 1024
      // 限制一次最多上传 5 张图片
      editor.customConfig.uploadImgMaxLength = 1
      // 将 timeout 时间改为 15s
      editor.customConfig.uploadImgTimeout = 15000
      editor.customConfig.uploadFileName = 'file'
      let self = this
      editor.customConfig.uploadImgHooks = {
        fail: function(xhr, editor, result) {
          // 图片上传并返回结果，但图片插入错误时触发
          // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
          self.$message({
            message: '插入图片出错',
            type: 'danger'
          })
        },
        error: function(xhr, editor) {
          // 图片上传出错时触发
          // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
          self.$message({
            message: '上传图片出错',
            type: 'danger'
          })
        },
        timeout: function(xhr, editor) {
          // 图片上传超时时触发
          // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
          self.$message({
            message: '上传图片超时',
            type: 'danger'
          })
        },

        // 如果服务器端返回的不是 {errno:0, data: [...]} 这种格式，可使用该配置
        // （但是，服务器端返回的必须是一个 JSON 格式字符串！！！否则会报错）
        customInsert: function(insertImg, result, editor) {
          // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
          // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果

          // 举例：假如上传图片成功后，服务器端返回的是 {url:'....'} 这种格式，即可这样插入图片：
          var url = DOWN_URL + result.key
          insertImg(url)
          self.$message({
            message: '上传成功',
            type: 'success'
          })
          // result 必须是一个 JSON 格式字符串！！！否则报错
        }
      }
      editor.create()
      this.editorIns = editor
      this.$nextTick(() => {
        editor.txt.html(this.content)
        this.$el.querySelector('.w-e-text-container').style.height = this.height
      })
    })
  }
}
</script>

<style scoped>

</style>
