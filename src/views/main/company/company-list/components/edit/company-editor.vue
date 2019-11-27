<template>
<v-page :visible.sync="visible" :before-close="closeMe">
  <h3 slot="title">{{formData.phone ? "编辑企业" : "创建企业"}}</h3>
  <v-form slot="content" ref="form" :formSettings="formSettings" :formData="formData" label-width="150px" @save="handleSave"></v-form>
</v-page>
</template>

<script>
import formSettings from './formSettings.js'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    formData: {
      type: Object
    }
  },
  data() {
    return {
      formSettings
    }
  },
  watch: {
    formData(data) {
      if (data.sn) {
        if (data.legalPersonIdentityFrontImg !== '') {
          data.legalPersonIdentityFrontImg = [{url: data.legalPersonIdentityFrontImg}]
        } else {
          data.legalPersonIdentityFrontImg = []
        }
        data.businessLicenceImg = [{url: data.businessLicenceImg}]
        data.contracts = data.contracts.map((item, i) => {
          let obj = {url: item}
          return obj
        })
      }
    }
  },
  methods: {
    closeMe() {
      this.$emit('update:visible', false)
      this.$emit('close')
      return false
    },
    handleSave(data) {
      if (data.legalPersonIdentityFrontImg.length !== 0) {
        data.legalPersonIdentityFrontImg = data.legalPersonIdentityFrontImg[0].url
      } else {
        data.legalPersonIdentityFrontImg = ''
      }
      data.businessLicenceImg = data.businessLicenceImg[0].url
      data.contracts = data.contracts.map((item, i) => {
        console.log(item)
        return item.url
      })
      console.log('====data====', data)
      console.log('====formData====', this.formData)
      if (this.formData.phone) {
        console.log('edit')
        data.sn = this.formData.sn
        this.$service.updateCompany(data).then(res => {
          this.$message({
            message: res.data.msg,
            type: 'success'
          })
          if (res.data.code == '0') {
            this.closeMe()
          }
        })
      } else {
        console.log('add')
        if (this.formData.applyId) {
          data.applyId = this.formData.applyId
        }
        this.$service.createCompany(data).then(res => {
          this.$message({
            message: res.data.msg,
            type: 'success'
          })
          if (res.data.code == '0') {
            this.closeMe()
          }
        })
      }
    }
  }
}
</script>

<style lang="scss">

</style>
