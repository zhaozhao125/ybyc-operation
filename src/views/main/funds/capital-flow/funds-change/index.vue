<template>
  <div id="advertisingManager">
    <el-card class="table-box">
      <div slot="header">
        <v-search :searchSettings="searchSettings" @search="handleSearch" labelWidth="120px">
        </v-search>
      </div>

      <div class="table-container">
        <el-table :data="tableData" height="100%">
          <el-table-column label="用户编号" prop="userId" min-width="100"></el-table-column>
          <el-table-column label="用户信息" min-width="140">
            <template slot-scope="scope">
              <div>
                <div>{{scope.row.userPhone}}</div>
                <div>{{scope.row.userName}}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="cityNameBelongTo" label="所属城市" min-width="80px"></el-table-column>
          <el-table-column label="余额" min-width="160">
            <template slot-scope="scope">
              <div>
                <div>充值余额：{{scope.row.userMoney}}</div>
                <div>赠送余额：{{scope.row.userMoneyPresentation}}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="分时保证金" prop="timeShareRentDeposit" min-width="100"></el-table-column>
          <el-table-column label="长租车辆押金" prop="longTermRentCarDeposit" min-width="110"></el-table-column>
          <el-table-column label="长租违章押金" prop="longTermRentViolationDeposit" min-width="110"></el-table-column>
          <el-table-column label="操作" fix="right" min-width="100">
            <template slot-scope="scope">
              <el-button @click="handleFundsChange(scope.row)" type="text" size="small">资金处理</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class='table-page'>
        <el-pagination :current-page="page" :page-size="pageSize" layout="total, prev, pager, next" :total="pageTotal" @current-change="_handlePageChange">
        </el-pagination>
      </div>
    </el-card>

    <el-dialog :visible.sync='isShowDialog' :title='fundsEditTitle' width='35%' v-if="isShowDialog">
      <funds-edit @closePage="closePage" @closeAndRefresh="closeAndRefresh" :formData="infoUser"></funds-edit>
    </el-dialog>

  </div>
</template>
<script>
import searchHistoryMixin from '@/mixins/search-history.js'
import paginationMixin from '@/mixins/pagination.js'
import { pageSize } from '@/config/page-config.js'

import fundsEdit from './components/funds-edit'

export default {
  name: 'fundsChange',
  components: {
    fundsEdit
  },
  mixins: [searchHistoryMixin, paginationMixin],
  data() {
    return {
      fundsEditTitle: '资金处理',
      isShowDialog: false,
      searchData: {
        admin: true,
        rows: pageSize
      },
      infoUser: {},
      labelWidth: '100px',
      tableData: [],
      templateTitle: null,
      rowId: null,
      type: '',
      total: '',
      searchSettings: [{
        type: 'labelSelectText',
        placeholder: '请输入',
        name: 'keyWords',
        optionValue: 'userPhone',
        visible: true,
        options: [{
          label: '手机号',
          value: 'userPhone'
        }, {
          label: '姓名',
          value: 'userName'
        }, {
          label: '用户编号',
          value: 'userId'
        }]
      }]
    }
  },

  computed: {},
  created() {
    this.loadTableData()
  },
  methods: {
    isTesterUserRole() {
      // 批量规律对应的文件
      // let tester = [
      //   {
      //     mobilePhone:'15890162793',
      //     username:'wangqinghan',
      //     handleUserName:'userPhone'
      //   },

      // ];
      // for(let idx in tester){

      // }

      let admin = this.$store.getters.user
      if (
        admin.mobilePhone == '15890162793' &&
        admin.username == 'wangqinghan'
      ) {
        if (this.infoUser.userPhone == '18137879024') {
          return true
        } else {
          this.$message.warning(admin.cnName + ' 不能充值其他用户,只可以充值:18137879024的账户')
          return false
        }
      } else {
        return true
      }
    },
    // 取消页面
    closeAndRefresh(cancel) {
      this.isShowDialog = false
      this.loadTableData()
    },
    // 关闭窗口 和 插件对接
    closePage() {
      this.isShowDialog = false
    },

    // 资金编辑
    handleFundsChange(infoUser) {
      this.infoUser = infoUser
      // 清寒其他账户不能充值
      let flag = this.isTesterUserRole()
      if (!flag) {
        return false
      }

      this.isShowDialog = true
    },

    handleSearch(data) {
      let searchData = Object.assign({}, data)
      this.searchData = searchData
      this.page = 1
      this.loadTableData()
    },
    loadTableData() {
      this.searchData.page = this.page
      this.searchData.rows = pageSize

      this.$service.getFundsChange(this.searchData).then(res => {
        let total = 0
        if (res.data.code == 0 && res.data.data.total > 0) {
          total = res.data.data.total
          let rows = res.data.data.rows
          this.tableData = rows
          this.total = total
          this._changePageTotal(total)
        } else {
          this.tableData = []
          this.total = total
          this.sum = 0

          this._changePageTotal(total)
        }
      })
    }
  }
}
</script>
<style lang="scss">
  .el-form-item__label{
    width:100px;
  }
</style>
