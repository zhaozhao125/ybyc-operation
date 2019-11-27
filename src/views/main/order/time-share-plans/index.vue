<template>
  <div >
    <el-card class="table-box">
      <div slot="header">
        <v-search :searchSettings="searchSettings" @search="handleSearch" labelWidth="130px"></v-search>
      </div>
      <div class="table-operator">
        <el-button size="small" type="primary" @click="addPlans">添加</el-button>
      </div>
      <table-list @on-editInformation="editPlan" @on-information="showInformation" :list = 'searchData' :params = "paginatiomParams" @on-pageChange="pageChange"
      @on-reload = "reloadList"
      ref="tableList"></table-list>
    </el-card>
    <v-page :visible.sync="showAddEdit" ref="vPage" @goBack="reload"  >
       <template slot="title" >
          <h3 style="line-height:30px; display:inline-block" >{{title}}</h3>
        </template>
        <template slot="content" >
          <add-edit :planInforMation = "propPlanInforMation" :planType="planType" @on-hideAdd = "hideAdd" class="add_edit"></add-edit>
        </template>
    </v-page>
    <v-page :visible.sync="showInfor" ref="vPage" @goBack="reload">
       <template slot="title" >
          <h3 style="line-height:30px; display:inline-block" >套餐详情</h3>
        </template>
        <template slot="content" >
           <plan-information :planInforMation = "propPlanInforMation"></plan-information>
        </template>
    </v-page>
  </div>
</template>
<script>
import { searchSettings } from './search-settings.js'
import tableList from './components/table'
import planInformation from './components/information'
import addEdit from './components/addEditPlan'
export default {
  name: 'timeSharePlans',
  components: {
    tableList,
    planInformation,
    addEdit
  },
  data () {
    return {
      searchSettings: searchSettings,
      showAddEdit: false,
      showInfor: false,
      searchParams: {},
      paginatiomParams: {},
      currentPage: 1,
      searchData: [],
      propPlanInforMation: {},
      title: '添加套餐',
      planType: 'addTimeShare'
    }
  },
  methods: {
    hideAdd () {
      this.showAddEdit = false
      this.showInfor = false
      this.planList(this.currentPage)
    },
    handleSearch (data) {
      this.$refs.tableList.page = 1
      this.currentPage = 1
      if (data.duringTime) {
        let timeDuring = data.duringTime
        data.startTime = Date.parse(timeDuring[0])
        data.endTime = Date.parse(timeDuring[1])
      }
      delete data.duringTime
      this.searchParams = data
      // console.log(data)
      this.planList()
    },
    reload () {
      this.planList(this.currentPage)
    },
    addPlans () {
      this.showAddEdit = true
      this.title = '添加套餐'
      this.planType = 'addTimeShare'
      this.propPlanInforMation = {}
    },
    editPlan (val) {
      this.showAddEdit = true
      this.showInfor = false
      this.propPlanInforMation = val
      console.log(this.propPlanInforMation)
      if (JSON.stringify(this.propPlanInforMation) == '{}') {
        this.title = '添加套餐'
        this.planType = 'addTimeShare'
      } else {
        this.title = '编辑套餐'
        this.planType = 'editTimeShare'
      }
    },
    showInformation (val) {
      this.showAddEdit = false
      this.showInfor = true
      this.propPlanInforMation = val
    },
    getCarList () {
      this.$service.carList().then(res => {
        this.searchSettings[3].options = []
        res.data.data.forEach((ele) => {
          this.searchSettings[3].options.push({
            label: ele.name,
            code: ele.code,
            value: ele.id
          })
        })
      })
    },
    reloadList () {
      this.planList(this.currentPage)
    },
    pageChange (page) {
      this.currentPage = page
      this.planList(page)
    },
    planList (page = 1) {
      this.$service.timeSharePlanList(this.searchParams, page).then((res) => {
        this.searchData = res.data.data.records ? res.data.data.records : []
        this.searchData.forEach((ele) => {
          if (ele.isOpen === 1) {
            ele.isOpen = true
          } else if (ele.isOpen === 0) {
            ele.isOpen = false
          }
        })
        this.paginatiomParams = {
          pageSize: 20,
          total: res.data.data.totalElements
        }
      })
    }
  },
  mounted () {
    this.getCarList()
    this.planList()
  }
}
</script>
<style lang="scss">
</style>
