<template>
  <!-- 运营审核 -->
  <div class='optimus_check'>
    <el-card class="table-box">
      <div slot="header">
        <v-search :searchSettings="searchSettings"
                  @search="search"
                  :labelWidth="labelWidth"></v-search>
      </div>
      <div class="table-operator">
        <el-button size="small"
                   type="primary"
                   @click='exportFile'>导出</el-button>
      </div>
      <div class="table-container">
        <my-table ref="myTable"
                  @on-edit='edit'
                  :optimusCheckList='checkList'
                  @on-change="pageChange"></my-table>

      </div>
      <div class="table-page">
        <el-pagination :current-page.sync="page"
                       :page-size="pageSize"
                       layout="total, prev, pager, next"
                       :total="pageTotal"
                       @current-change="getDataList">
        </el-pagination>
      </div>
    </el-card>
    <v-page :visible.sync="addOrEditPage"
            ref="vPage"
            @goBack="goRefund">
      <template slot="title"
                class='check_title'>
        <h3 style='display:inline-block'>运营审核</h3>
        <div class='btn_agree_reject'
             v-if="information.status === 'wait'">
          <el-button type='primary'
                     size='small'
                     v-has="'optimusCheckDepositRefundAgree'"
                     @click="showDialog('agree')">同意退款</el-button>
          <el-button size='small'
                     v-has="'optimusCheckDepositRefundReject'"
                     @click="showDialog('reject')">驳回</el-button>

        </div>
      </template>
      <template slot="content">
        <check-information :infor='information'></check-information>
      </template>
    </v-page>
    <el-dialog :title="dialogTitle"
               :visible.sync="dialogVisible"
               width="30%">
      <el-input type="textarea"
                :rows="2"
                placeholder="请输入内容"
                v-model="remark">
      </el-input>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="dialogVisible = false"
                   size='small'>取 消</el-button>
        <el-button type="primary"
                   @click="refundHandel"
                   size='small'>确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>
import paginationMixin from '@/mixins/pagination.js'
import myTable from './components/table'
import { searchSettings } from './components/data'
import { handleDate } from '@/utils/date-filter'
import checkInformation from './components/checkInformation'
export default {
  components: {
    myTable,
    checkInformation
  },

  mixins: [paginationMixin],

  name: 'optimus-check',
  data() {
    return {
      addOrEditPage: false,
      searchSettings: searchSettings,
      labelWidth: '140px',
      searchData: {
        isAuditor: 'forCheck',
        status: 'wait'
      },
      page: 1,
      checkList: [],
      information: {},
      dialogVisible: false,
      remark: '',
      type: '',
      dialogTitle: '',
      totals: 0
    }
  },
  methods: {
    edit(row) {
      this.addOrEditPage = true
      this.information = row
    },
    showDialog(type) {
      this.dialogVisible = true
      this.remark = ''
      this.type = type
      this.dialogTitle = type === 'agree' ? '同意退款' : '驳回'
    },
    pageChange(val) {
      this.page = val
      this.getDataList()
    },
    search(data) {
      this.searchData = data
      let dateRange =
        this.searchData.add ||
        this.searchData.auditor ||
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
          delete this.searchData.auditor
          this.searchData.dateType = 'auditor'
        }
      }
      if (this.searchData.cityIds) {
        this.searchData.cityType = 'belongTo'
      }
      this.page = 1
      this.getDataList()
    },
    getDataList() {
      // this.searchData.status ? '' : Object.assign(this.searchData, {isAuditor: 'forCheck', status: 'wait'})
      Object.assign(this.searchData, { isAuditor: 'forCheck' })
      this.$service
        .getOptimusCheckList(this.page, 20, this.searchData)
        .then(res => {
          this._changePageTotal(res.data.data.total)
          this.checkList = res.data.data.rows
        })
        .catch(res => {})
    },
    refundHandel() {
      let params = {
        userApplyReturnDepositId: this.information.userApplyReturnDepositId,
        remark: this.remark,
        checkStatus: true,
        adminUser: this.$store.state.user.username,
        adminUsername: this.$store.state.user.cnName
      }
      this.type === 'agree'
        ? (params.checkStatus = true)
        : (params.checkStatus = false)
      this.$service.optimusCheckHandel(params).then(res => {
        this.addOrEditPage = false
        this.dialogVisible = false
        this.$message.success(
          this.type === 'agree' ? '同意退款成功！' : '驳回成功！'
        )
        this.getDataList()
      })
    },
    exportFile() {
      if (this.checkList.length < 1) {
        this.$message.warning('导出数据为空，请重新查询')
      } else {
        this.$service.exportOptimusList(
          this.searchData,
          this.$store.getters.token,
          '运营审核.xlsx',
          'optimus'
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
<style lang = 'scss' scoped>
.optimus_check {
  .btn_agree_reject {
    margin-top: -5px;
    float: right;
  }
}
</style>
