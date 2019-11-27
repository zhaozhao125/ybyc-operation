<template>
  <el-dialog v-if="remarkData" :title="title" width="500px" :visible.sync="visible" :before-close="closeMe">
    <el-form label-width="100px">
      <el-form-item label="图片" v-if="remarkData.vouchers && remarkData.vouchers.length">
        <v-gallery :imgs="remarkData.vouchers"></v-gallery>
      </el-form-item>
      <el-form-item label="备注">
        <span v-html="remark.replace(/\n/g, '<br>')"></span>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import vGallery from '@/components/gallery/vGallery'
export default {

  props: {
    visible: {
      type: Boolean,
      default: false
    },
    remarkData: {
      required: true,
      default: null
    }
  },

  components: {
    vGallery
  },

  data() {
    return {

    }
  },

  computed: {
    title() {
      if (!this.remarkData) {
        return ''
      }
      if (this.remarkData.recordType == 'commit_vouchers') {
        return '查看凭证'
      }
      if (this.remarkData.recordType == 'verify_err') {
        return '查看驳回备注'
      }
      if (this.remarkData.recordType == 'verify_pass') {
        return '查看验收备注'
      }
      return ''
    },
    remark() {
      if (!this.remarkData) {
        return ''
      }
      if (this.remarkData.recordType == 'commit_vouchers') {
        if (this.remarkData.voucherRemark) {
          return this.remarkData.voucherRemark
        } else {
          return ''
        }
        // return this.remarkData.voucherRemark
      }
      if (this.remarkData.recordType == 'verify_err') {
        if (this.remarkData.verifyMsg) {
          return this.remarkData.verifyMsg
        } else {
          return ''
        }
        // return this.remarkData.verifyMsg
      }
      if (this.remarkData.recordType == 'verify_pass') {
        if (this.remarkData.verifyMsg) {
          return this.remarkData.verifyMsg
        } else {
          return ''
        }
        // return this.remarkData.verifyMsg
      }
      return ''
    }
  },

  methods: {
    closeMe() {
      this.$emit('update:visible', false)
      return false
    }
  }
}
</script>
<style lang="scss">


</style>
