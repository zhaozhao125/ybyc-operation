<template>
    <el-dialog
        :title="handeType"
        :visible.sync="dialogVisible"
        width="400px"
        >
        <div class = "add_company_dialog">
          <v-form ref="form" slot="content" :formSettings="formSettings" :formData="companyInfor" :showButton="false" label-width="110px">
          </v-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false" size = "small">取 消</el-button>
          <el-button type="primary" size = "small" @click = "addEditCompany">确 定</el-button>
        </span>
    </el-dialog>
</template>
<script>
import formSettings from './formSetting.js'
import searchStation from '@/components/search-station/'
export default {
  components: {
    searchStation
  },
  data () {
    return {
      dialogVisible: false,
      formSettings,
      edit: false,
      companyInfor: {}
    }
  },
  computed: {
    handeType () {
      if (this.edit) {
        return '编辑保险公司'
      } else {
        return '添加保险公司'
      }
    }
  },
  methods: {
    show (row) {
      this.dialogVisible = true
      if (row) {
        this.companyInfor = row
        this.edit = true
      } else {
        this.edit = false
        this.companyInfor = {}
      }
    },
    addEditServer (data, type) {
      this.$service[type](data).then((res) => {
        this.dialogVisible = false
        this.$emit('on-reload')
      })
    },
    addEditCompany () {
      this.$refs.form.getDataAsync().then(data => {
        if (!data) {
          return
        }
        if (this.edit) {
          let params = Object.assign(data, {id: this.companyInfor.id})
          this.addEditServer(params, 'editInsuranceCompany')
        } else {
          this.addEditServer(data, 'addInsuranceCompany')
        }
      }).catch(err => {
        console.log('====err====', err)
      })
    }
  }
}
</script>
<style lang="scss">
   .add_company_dialog {
      .v-form {
         .form-section {
           margin-bottom: 0px;
         }
      }
   }
</style>
