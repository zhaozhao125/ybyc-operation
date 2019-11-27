<template>
  <div>
      <v-form ref="vform" slot="content"
        :formSettings="formSettings"
        :formData="formData"
        :showButton="true"
        @fileurlchange="handlefileurl"
        @save="submitSave"
      ></v-form>
  </div>
</template>
<script>
import vForm from '@/components/form/vForm'
import formSettings from './formSettings.js'
export default {
  name: 'add-word-order',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    formData: {
      type: Object,
      require: true
    },
    apiurl: {
      type: String,
      require: true
    }
  },
  components: {
  },

  data() {
    return {
      formSettings
    }
  },
  created() {
    this.initshow()
  },

  mounted() {
  },

  methods: {
    initshow() {
      console.dir(this.formData)
      let file = []
      if (JSON.stringify(this.formData) !== '{}') {
        console.dir('not  empty')
        file.push({
          name: this.formData.app_version_url,
          url: this.formData.app_version_url
        })
      }
      // 文件版本对应
      if (JSON.stringify(this.formData) !== '{}' && this.formData['app_version_number']) {
        this.formSettings[0].items[2].disabled = true
      } else {
        this.formSettings[0].items[2].disabled = false
      }

      if (JSON.stringify(this.formData) !== '{}' && this.formData['is_file'] == '0') {
        this.formSettings[0].items[5].hidden = true
        this.formSettings[0].items[6].hidden = false
        // this.formSettings[0].items[5].disabled = false
        // this.formSettings[0].items[4].disabled = false
      } else if (JSON.stringify(this.formData) !== '{}' && this.formData['is_file'] == '1') {
        // this.formSettings[0].items[4].disabled = true
        this.formSettings[0].items[5].hidden = false
        // this.formSettings[0].items[5].disabled = true
        this.formSettings[0].items[6].hidden = true
        this.formData.file = file
      } else {
        this.formSettings[0].items[5].hidden = false
        this.formSettings[0].items[6].hidden = true
        this.formSettings[0].items[5].disabled = false
        this.formSettings[0].items[4].disabled = false
      }
    },
    submitSave(item) {
      console.info('页面保存文件')
      console.dir(item)
      if (item.is_file === '0') {
        if (item.app_version_url.length <= 0) {
          this.$message.warning('文件路径不能为空')
          return false
        }
        delete item.file
      } else {
        item.app_version_url = item.file[0].url
        if (item.file[0].url.length <= 0) {
          this.$message.warning('上传文件不能为空')
          return false
        }
        delete item.file
      }
      if (this.formData['app_version_id']) {
        item.app_version_id = this.formData['app_version_id']
      }

      console.dir(item)
      this.$service.updateRow(this.apiurl, item).then(res => {
        if (res.data.data.code) {
          this.$message.success('操作成功')
          this.$emit('closeAndRefresh')
        } else {
          this.$message.warning(res.data.data.msg)
        }
      })
    },
    handlefileurl(value) {
      // 连接跳转的问题处理
      console.info('handlefileurl')
      console.dir(value)
      console.dir(this.formSettings)
      console.dir(this.formData)

      if (value == 1) {
        console.info('上传按钮')
        this.formSettings[0].items[5].hidden = false
        this.formSettings[0].items[6].hidden = true
      } else {
        console.info('显示输入框')
        this.formSettings[0].items[5].hidden = true
        this.formSettings[0].items[6].hidden = false
      }
    },

    closeMe() {
      this.$emit('update:visible', false)
      this.$refs.form.resetFields()
    }
  },
  watch: {
  }
}
</script>
