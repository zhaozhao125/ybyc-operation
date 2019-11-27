<template>
  <div id="operations-role">
    <el-card class="table-box">

      <div slot="header">
        <v-search :searchSettings="searchSettings" @search="handleSearch" :labelWidth="labelWidth"></v-search>
      </div>
      <div class="table-operator">
        <el-button type="primary" size="small" @click="handleTemplate()">添加角色</el-button>
      </div>

      <div class="table-container">
        <el-table :data="tableData" height="100%">
          <el-table-column prop="roleName" label="角色名" show-overflow-tooltip min-width="150px"></el-table-column>
          <el-table-column prop="cityName" label="城市" show-overflow-tooltip min-width="120px"></el-table-column>
          <el-table-column prop="grabPriority" label="抢单权重" min-width="120px"></el-table-column>
          <el-table-column prop="detail" label="描述" show-overflow-tooltip min-width="120px"></el-table-column>
          <el-table-column prop="createdBy" label="添加人" min-width="120px"></el-table-column>
          <el-table-column prop="modifiedBy" label="修改人" min-width="120px"></el-table-column>

          <el-table-column label="操作" fixed="right" min-width="100px">
            <template slot-scope="scope">
              <el-button class="el-button--text" type="text" @click="handleTemplate(scope.row)">编辑</el-button>
              <el-popover :ref="'deletePop' + scope.$index" title="" width="270" trigger="click" placement="top">
                <el-button type="text" slot="reference">删除</el-button>
                <P style="line-height:25px">
                  <i class="el-icon-warning" style="color:red;margin-right:5px;"></i>确定删除该角色？</p>
                <div style="text-align: right">
                  <el-button size="small" type="text" @click="handleCancel(scope.$index)">取消</el-button>
                  <el-button type="primary" size="mini" @click="deleteItem(scope.row.id,scope.$index)">删除</el-button>
                </div>
              </el-popover>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class='table-page'>
        <el-pagination :current-page="page" :page-size="pageSize" layout="total, prev, pager, next" :total="pageTotal" @current-change="_handlePageChange">
        </el-pagination>
      </div>

      <add-operations-role :visible.sync="templateVisible" :formData="formData" :templateTitle="templateTitle" @close="close" @loadTableData="loadTableData"></add-operations-role>

    </el-card>
  </div>
</template>
<script>
import addOperationsRole from './components/add-operations-role'
import searchHistoryMixin from '@/mixins/search-history.js'
import paginationMixin from '@/mixins/pagination.js'
import { handleDate } from '@/utils/date-filter'
import { handleSubmitSearchData } from '@/utils/common.js'

export default {
  name: 'operationsRole',
  components: {
    addOperationsRole
  },
  mixins: [searchHistoryMixin, paginationMixin],
  data() {
    return {
      labelWidth: '80px',
      tableData: [],
      templateTitle: '',
      templateVisible: false,
      searchSettings: [{
        label: '角色名',
        name: 'roleName',
        type: 'text',
        required: true,
        visible: true
      },{
        label: '城市',
        name: 'cityId',
        type: 'city',
        enableAuth: true,
        visible: true
      }],
      defaultFormData: {
        hasCreateAuth: true,
        taskCreateAuthList: [
          {'taskType': 'charge_car', 'hasCreateAuth': false, 'hasAssignAuth': false},
          {'taskType': 'dispatch_car', 'hasCreateAuth': false, 'hasAssignAuth': false},
          {'taskType': 'inspection', 'hasCreateAuth': false, 'hasAssignAuth': false},
          {'taskType': 'clean_car', 'hasCreateAuth': false, 'hasAssignAuth': false},
          {'taskType': 'lack_materiel', 'hasCreateAuth': false, 'hasAssignAuth': false},
          {'taskType': 'repair_car', 'hasCreateAuth': false, 'hasAssignAuth': false}
        ],
        hasAcceptAuth: true,
        taskAcceptAuthList: [
          {'taskType': 'charge_car', 'hasAcceptAuth': false},
          {'taskType': 'dispatch_car', 'hasAcceptAuth': false},
          {'taskType': 'inspection', 'hasAcceptAuth': false},
          {'taskType': 'clean_car', 'hasAcceptAuth': false},
          {'taskType': 'lack_materiel', 'hasAcceptAuth': false},
          {'taskType': 'repair_car', 'hasAcceptAuth': false}
        ]
      },
      formData: {}
    }
  },
  methods: {
    handleSearch(data) {
      let searchData = Object.assign({}, data)
      if (searchData.time && searchData.time.length) {
        searchData.dateStart = handleDate(searchData.time[0], 'day')
        searchData.dateEnd = handleDate(searchData.time[1], 'day')
      }
      delete searchData.time
      searchData = handleSubmitSearchData(searchData)
      this.searchData = searchData
      this.page = 1
      this.loadTableData()
    },
    loadTableData() {
      this.pageSize = 10
      let params = {
        page: this.page,
        pageSize: this.pageSize,
        ...this.searchData
      }
      this.$service.roleList(params).then(res => {
        this.tableData = res.data.data.content
        this._changePageTotal(Number(res.data.data.totalElements))
      })
    },
    handleTemplate(data) {
      this.templateVisible = true
      if (data) {
        data.city = {
          value: data.cityId,
          label:data.cityName
        }
        this.formData = data
        this.formData.taskCreateAuthList = []
        this.formData.taskAcceptAuthList = []
        for (let i = 0; i < data.taskAuthList.length; i++) {
          let createObj = {'taskType': data.taskAuthList[i].taskType, 'hasCreateAuth': data.taskAuthList[i].hasCreateAuth, 'hasAssignAuth': data.taskAuthList[i].hasAssignAuth}
          this.formData.taskCreateAuthList.push(createObj)
          let acceptObj = {'taskType': data.taskAuthList[i].taskType, 'hasAcceptAuth': data.taskAuthList[i].hasAcceptAuth}
          this.formData.taskAcceptAuthList.push(acceptObj)
        }
      } else {
        this.formData = JSON.parse(JSON.stringify(this.defaultFormData))
      }
      this.formData.taskCreateAuthList.map(item => {
        switch (item.taskType) {
          case 'charge_car':
            return item.taskTypeContent = '充电单'
          case 'dispatch_car':
            return item.taskTypeContent = '调度单'
          case 'inspection':
            return item.taskTypeContent = '巡检单'
          case 'clean_car':
            return item.taskTypeContent = '清洁单'
          case 'lack_materiel':
            return item.taskTypeContent = '补料单'
          case 'repair_car':
            return item.taskTypeContent = '维修单'
          default:
            return item.taskTypeContent = '未知'
        }
      })
      this.formData.taskAcceptAuthList.map(item => {
        switch (item.taskType) {
          case 'charge_car':
            return item.taskTypeContent = '充电单'
          case 'dispatch_car':
            return item.taskTypeContent = '调度单'
          case 'inspection':
            return item.taskTypeContent = '巡检单'
          case 'clean_car':
            return item.taskTypeContent = '清洁单'
          case 'lack_materiel':
            return item.taskTypeContent = '补料单'
          case 'repair_car':
            return item.taskTypeContent = '维修单'
          default:
            return item.taskTypeContent = '未知'
        }
      })
      if (!data) {
        this.templateTitle = '添加角色'
      } else {
        this.templateTitle = '编辑角色'
      }
    },
    close() {
      this.loadTableData()
      this.formData = this.defaultFormData
    },
    handleCancel(index) {
      this.$refs['deletePop' + index].doClose()
    },
    deleteItem(id, index) {
      let ID = {}
      ID.id = id
      let obj = {...ID}
      console.log(obj)
      this.$service.deleteRole(obj).then(res => {
        this.$message.success('删除角色成功')
        this.$refs['deletePop' + index].doClose()
        this.loadTableData()
      }).catch(error => {
        this.$message.warning(error.msg ? error.msg : '删除角色失败')
        this.$refs['deletePop' + index].doClose()
      })
    }
  },
  created() {
    this.loadTableData()
  }
}
</script>
<style lang="scss">

</style>
