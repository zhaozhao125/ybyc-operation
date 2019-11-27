<template>
  <div class="edit-news">
    <v-page :visible.sync="visible" :before-close="handleBeforeClose">
      <h3 slot="title">{{detailData ? "编辑新闻" : "添加新闻"}}</h3>
      <v-form ref="form" slot="content" :formData="detailData" :formSettings="formSettings" :labelWidth="labelWidth" @save="handleSaveTemplate">
        <template slot="content">
          <v-editor :content="detailData?detailData.content:''" ref="editor" @change="handleEditorChange"></v-editor>
        </template>
      </v-form>
    </v-page>
  </div>
</template>

<script>
import searchHistoryMixin from '@/mixins/search-history.js'
import paginationMixin from '@/mixins/pagination.js'
import formSettings from './formSettings.js'
import vEditor from '@/components/editor/'

export default {
  name: 'v-details',
  mixins: [searchHistoryMixin, paginationMixin],
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    detailData: {
      type: Object
    }
  },
  components: {
    vEditor
  },
  data() {
    return {
      labelWidth: '150px',
      formSettings: formSettings,
      formData: {}
    }
  },
  methods: {
    handleSaveTemplate(data) {
      let saveData = Object.assign({}, data)
      console.log('====this.$refs.editor====', this.$refs.editor)
      saveData.content = this.$refs.editor.getContent()
      saveData.previewImage = saveData.previewImage[0].url
      let user = this.$store.getters.user
      saveData.creatorId = user.userId
      saveData.creatorName = user.cnName

      if (this.detailData) {
        this.$service.updateNews(this.detailData._id, saveData).then(res => {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.$emit('update', res.data.data)
        })
      } else {
        this.$service.createNews(saveData).then(res => {
          this.$message({
            message: '添加成功',
            type: 'success'
          })
          this.$emit('create', res.data.data)
        })
      }
    },
    handleBeforeClose() {
      this.$emit('update:visible', false)
      return false
    },
    handleEditorChange(html) {
      this.$refs.form.setData('content', html)
    }
  }
}
</script>

<style lang="scss">
.edit-news {
  .v-form {
    max-width: 1200px;
  }
}
</style>
