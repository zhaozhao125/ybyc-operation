<template>
  <div class="car_insurance_company">
    <el-card class="table-box">
      <div slot="header">
          <v-search :searchSettings="searchSettings" @search="handleSearch" labelWidth="100px"></v-search>
      </div>
      <div class="table-operator">
          <el-button size="small" type="primary" @click = "addInsuranceCompany">添加保险公司</el-button>
      </div>
      <company-list ref="tableList" :list = 'companyList' :params = "paginatiomParams" @on-pageChange = "pageChange" @on-edit = "editInsurance"></company-list>
    </el-card>
    <add-edit ref = "addCompany" @on-reload = "getCompanyList()"></add-edit>
  </div>
</template>
<script>
import { searchSettings } from './components/search-settings.js'
import { handleDate } from '@/utils/date-filter'
import searchStation from '@/components/search-station/'
import companyList from './components/companyList'
import addEdit from './components/addEditDialog'
export default {
  name: 'car-insurance',
  components: {
    companyList,
    addEdit
  },
  data () {
    return {
      searchSettings: searchSettings,
      paginatiomParams: {},
      searchParams: {},
      companyList: []
    }
  },
  methods: {
    editInsurance (row) {
      this.$refs.addCompany.show(row)
    },
    addInsuranceCompany () {
      this.$refs.addCompany.show()
    },
    handleSearch (val) {
      this.$refs.tableList.page = 1
      this.searchParams = val
      this.getCompanyList()
    },
    getCompanyList (page = 1) {
      this.$service.insuranceCompanySerch(this.searchParams, page).then((res) => {
        this.companyList = res.data.data.records
        this.paginatiomParams = {
          pageSize: res.data.data.pageSize,
          total: res.data.data.totalElements
        }
      }).catch((res) => {
      })
    },
    pageChange (val) {
      this.getCompanyList(val)
    }
  },
  mounted () {
    this.getCompanyList()
  }
}
</script>
<style lang="scss">

</style>
