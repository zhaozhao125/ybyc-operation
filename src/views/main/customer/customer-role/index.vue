<template>
  <div id="customer-list">
    <el-card class="table-box">

      <div slot="header">
        <v-search :searchSettings="searchSettings" @search="handleSearch" :labelWidth="labelWidth"></v-search>
      </div>
      <div class="table-operator">
        <el-button type="primary" size="small" @click="handleTemplate()">添加角色</el-button>
      </div>

      <div class="table-container">
        <el-table :data="tableData" height="100%">
          <el-table-column prop="roleName" label="用户角色" min-width="120px">
          </el-table-column>
          <el-table-column prop="roleFrozenMoney" label="分时保证金" min-width="120px"></el-table-column>
          <el-table-column prop="createdOn" label="添加时间" min-width="120px"></el-table-column>
          <el-table-column prop="createdByName" label="添加管理员" min-width="120px">
          </el-table-column>

          <el-table-column label="操作" fixed="right" min-width="100px">
            <template slot-scope="scope">
              <el-button class="el-button--text" type="text" @click="handleTemplate(scope.row)">编辑</el-button>
              <el-popover :ref="'deletePop' + scope.$index" title="" width="270" trigger="click" placement="top">
                <el-button type="text" slot="reference">删除</el-button>
                <P style="line-height:25px">
                  <i class="el-icon-warning" style="color:red;margin-right:5px;"></i>确定删除该角色？</p>
                <div style="text-align: right">
                  <el-button size="small" type="text" @click="handleCancel(scope.$index)">取消</el-button>
                  <el-button type="primary" size="mini" @click="deleteItem(scope.row.userRoleId,scope.$index)">删除</el-button>
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

      <v-page :visible.sync="templateVisible">
        <h3 slot="title">{{templateTitle === 1 ? "添加角色" : "编辑角色"}}</h3>
        <v-form ref="form" slot="content" :formData="formData" :formSettings="formSettings" :labelWidth="labelWidth"
                @save="handleSaveTemplate">
          <template slot="roleFrozenMoney" slot-scope="scope">
            <el-input placeholder="请输入"  v-model="scope.model.roleFrozenMoney">
              <template slot="append">元</template>
            </el-input>
          </template>
        </v-form>
      </v-page>

    </el-card>
  </div>
</template>
<script>
import searchSettings from './components/searchSettings.js'
import searchHistoryMixin from '@/mixins/search-history.js'
import paginationMixin from '@/mixins/pagination.js'
import { handleDate } from '@/utils/date-filter'
import { handleSubmitSearchData } from '@/utils/common.js'

export default {
  name: 'customerRole',
  mixins: [searchHistoryMixin, paginationMixin],
  data() {
    return {
      labelWidth: '80px',
      searchSettings: searchSettings,
      tableData: [],
      templateTitle: null,
      templateVisible: false,
      formSettings: [
        {
          label: '',
          items: [
            {
              label: '角色名称',
              name: 'roleName',
              type: 'text',
              required: true
            },
            {
              label: '分时保证金',
              name: 'roleFrozenMoney',
              type: 'slot',
              required: true
            }
          ]
        }
      ],
      formData: []
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
      console.log(params)
      this.$service.getCustomerRoleList(params).then(res => {
        this.tableData = res.data.data.rows
        this.tableData.forEach(item => {

        })
        console.log(this.tableData)
        this._changePageTotal(Number(res.data.data.total))
      })
    },
    // 点击添加/编辑
    handleTemplate(data) {
      this.templateVisible = true
      if (data) {
        this.rowId = data.userRoleId

        this.formData = data
        console.log(data)
      } else {
        this.formData = {}
      }
      if (!data) {
        this.templateTitle = 1
      } else {
        this.templateTitle = 2
      }
    },
    // 确认添加/编辑
    handleSaveTemplate(data) {
      // console.log(data)

      if (this.templateTitle === 1) {
        let userName = {
          'createdBy': this.user.username,
          'createdByName': this.user.cnName,
          'modifiedBy': '',
          'modifiedByName': ''
        }
        let temObj = {...userName, ...data}
        console.log(temObj)
        this.$service.addCustomerRole(temObj).then(res => {
          // console.log('====res====', res);
          this.templateVisible = false
          this.loadTableData()
          this.$message({
            message: '添加成功',
            type: 'success'
          })
        })
      } else {
        let userName = {
          'modifiedBy': this.user.username,
          'modifiedByName': this.user.cnName
        }
        let temObj = {...userName, ...data}
        let ID = {}
        ID.userRoleId = this.rowId
        let obj = {...ID, ...temObj}
        console.log(obj)
        this.$service.editCustomerRole(obj).then(res => {
          // console.log('====res====', res);
          this.templateVisible = false
          this.loadTableData()
          this.$message({
            message: '编辑成功',
            type: 'success'
          })
        })
      }
    },
    // 取消删除
    handleCancel(index) {
      this.$refs['deletePop' + index].doClose()
    },
    // 删除
    deleteItem(id, index) {
      let ID = {}
      ID.userRoleId = id
      let obj = {...ID}
      console.log(obj)
      this.$service.delCustomerRole(obj).then(res => {
        this.$message.success('删除角色成功')
        this.$refs['deletePop' + index].doClose()
        this.loadTableData()
      }).catch(error => {
        this.$message.warning(error.msg ? error.msg : '删除角色失败')
        this.$refs['deletePop' + index].doClose()
      })
    },
    // 用户id查询订单详情
    detailItem(id) {
      console.log(id)
    }
  },
  computed: {
    user() {
      return this.$store.getters.user
    }
  },
  created() {
    this.loadTableData()
  }
}
</script>
<style lang="scss">

</style>
