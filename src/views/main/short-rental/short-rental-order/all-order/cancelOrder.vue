<template>
  <el-form ref="form"
           :model="form"
           :formData="formData"
           :orderSn="orderSn"
           label-width="80px">
    <el-form-item label="取消原因:">
      <el-select v-model="form.reasonCode" @change="isOther" size = "small" >
        <el-option v-for="(item, index) in formData"
                   :key="item.reasonCode"
                   :label="item.reason"
                   :value="index"
        ></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="" v-if="showAdminNote">
      <el-input
        type="textarea"
        v-model="form.adminNote"></el-input>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="onSubmit" size = "small">取消订单</el-button>
      <el-button @click="cancelSubmit" size = "small">放弃</el-button>
    </el-form-item>

  </el-form>
</template>
<script>
import searchSelect from '@/components/website-select'
import { handleSubmit } from '@/utils/common.js'
import api from '@/service/api/'
import returnCarDialogVue from './returnCarDialog.vue'

export default {
  name: 'cancel-order',
  props: {
    formData: {
      type: Array,
      require: true
    },
    orderSn: {
      type: String,
      require: true
    }
  },
  data() {
    return {
      showAdminNote: false,
      admin: {},
      infoUser: {},
      form: {
        reasonCode: '',
        reason: '',
        adminNote: ''
      }
    }
  },
  mounted() {
    this.$nextTick(() => {})
  },
  methods: {
    isOther(key) {
      let value = this.formData[key]['reason']

      if (value == '其他') {
        this.showAdminNote = true
      } else {
        this.showAdminNote = false
      }
    },

    cancelSubmit() {
      this.$emit('closeAndRefresh', 'cancel')
    },

    onSubmit(event) {
      let params = {
        orderSn: this.orderSn,
        orderCancelType: 'back',
        reasonCode: this.form.reasonCode,
        reason: this.formData[this.form.reasonCode].reason,
        operatorCnName: this.$store.getters.user.cnName,
        operatorUserName: this.$store.getters.user.username,
        // adminId: this.$store.getters.user.userId,
        description: this.form.adminNote
      }
      // console.dir(params); return false

      this.$service.cancelOrder(params).then((res) => {
        this.$message.success('取消订单成功！')
        // this.successSubmit()
        this.$emit('closeAndRefresh')
      }).catch((res) => {
      })
    },
    // successSubmit() {
    //   this.$emit('closeAndRefresh')
    // }
  },
  components: {
    searchSelect
  }
}
</script>
<style lang="scss">
  .moveleft{
    margin-left: -15px;
  }
</style>
