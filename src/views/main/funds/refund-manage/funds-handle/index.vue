<template>
  <!-- 财务处理 -->
  <div class='finance_check'>
    <el-card class="table-box">
      <div slot="header">
        <v-search :searchSettings="searchSettings"
                  @search="handleSearch"
                  :labelWidth="labelWidth"></v-search>
      </div>
      <div class="table-operator">
        <el-button size="small"
                   type="primary"
                   @click='exportFile'>导出</el-button>
      </div>
      <my-table ref="myTable"
                @on-edit='edit'
                :optimusCheckList='checkList'
                :params='paginationParams'
                @on-change="pageChange"></my-table>
    </el-card>
    <v-page :visible.sync="addOrEditPage"
            ref="vPage"
            @goBack="goRefund">
      <template slot="title"
                class='check_title'>
        <h3 style="line-height: 30px; display: inline-block">财务审核</h3>
        <div style="float: right"
             v-if="information.status==='checkSuccess'">
          <el-button size='small'
                     v-has="'fundsHandleRefundCancel'"
                     @click="financeCancel">取消退款</el-button>

        </div>
      </template>
      <template slot="content">
        <check-information :infor='information'
                           @on-reload="backIndex"
                           :searchData="searchData"
                           @getStatus="financeStatus"></check-information>
      </template>
    </v-page>
    <cancel-dialog ref="cancel"
                   @on-cancelSucces='cancelSuccess'></cancel-dialog>
  </div>
</template>
<script>
import myTable from './components/table'
import { searchSettings } from './components/data'
import { handleDate } from '@/utils/date-filter'
import checkInformation from './components/checkInformation'
import cancelDialog from './components/cancelDialog'
export default {
  components: {
    myTable,
    checkInformation,
    cancelDialog
  },
  name: 'optimus-check',
  data() {
    return {
      addOrEditPage: false,
      searchSettings: searchSettings,
      labelWidth: '140px',
      searchData: {
        status: 'checkSuccess'
      },
      page: 1,
      checkList: [],
      information: {},
      dialogHideShow: false,
      paginationParams: {}
    }
  },
  methods: {
    financeStatus(status) {
      this.information.status = status
    },
    backIndex() {
      this.addOrEditPage = false
      this.getDataList()
    },
    cancelSuccess() {
      this.addOrEditPage = false
      this.getDataList()
    },
    financeCancel() {
      this.$refs.cancel.show(this.information)
    },
    edit(row) {
      this.addOrEditPage = true
      this.information = row
    },
    handleSearch(data) {
      this.searchData = data
      let dateRange =
        this.searchData.add ||
        this.searchData.handle ||
        this.searchData.userCancelDate
      if (dateRange) {
        this.searchData.dateStart = handleDate(dateRange[0])
        this.searchData.dateEnd =
          handleDate(dateRange[1]).slice(0, 11) + '23:59:59'
        if (this.searchData.add) {
          delete this.searchData.add
          this.searchData.dateType = 'add'
        } else if (this.searchData.userCancelDate) {
          delete this.searchData.userCancelDate
          this.searchData.dateType = 'user'
        } else {
          delete this.searchData.handle
          this.searchData.dateType = 'handle'
        }
      }
      if (this.searchData.cityIds) {
        this.searchData.cityType = 'belongTo'
      }
      this.page = 1
      this.$refs.myTable.page = 1
      this.getDataList()
    },
    pageChange(val) {
      this.page = val
      this.getDataList()
    },
    getDataList() {
      Object.assign(this.searchData, { isAuditor: 'forFinancial' })
      this.$service
        .getOptimusCheckList(this.page, 20, this.searchData)
        .then(res => {
          this.checkList = res.data.data.rows
          this.paginationParams = {
            total: res.data.data.total,
            pageSize: 20
          }
        })
    },
    exportFile() {
      if (this.checkList.length < 1) {
        this.$message.warning('导出数据为空，请重新查询')
      } else {
        this.$service.exportRefund(
          this.searchData,
          this.$store.getters.token,
          '财务处理.xlsx',
          'refund'
        )
      }
    },
    goRefund() {
      this.getDataList()
    }
  },
  mounted() {
    this.getDataList()
  }
}
</script>
<style lang="scss" scoped>
.finance_check {
  .check_title {
    h3 {
      line-height: 30px;
      display: inline-block;
    }
    div {
      float: right;
    }
  }
}
</style>
