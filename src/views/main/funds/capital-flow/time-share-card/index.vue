<template>
  <div id="advertisingManager">
    <el-card class="table-box">
      <div slot="header">
        <v-search :searchSettings="searchSettings"
                  @search="handleSearch"
                  labelWidth="120px">
        </v-search>
      </div>

      <div class="table-operator">
        <el-button size="small"
                   type="primary"
                   @click="exportFile">导出</el-button>
      </div>

      <div class="car-summary table-operator">
        <ul>
          <li>收支总计:{{sum}} </li>
        </ul>
      </div>

      <div class="table-container">
        <el-table :data="tableData"
                  height="100%">
          <el-table-column label="流水号"
                           prop="accountRecordSn"
                           min-width="280"></el-table-column>
          <el-table-column prop="actionCodeText"
                           label="科目"
                           min-width="140"></el-table-column>
          <el-table-column label="金额"
                           prop="amount"
                           min-width="120"></el-table-column>
          <el-table-column prop="cardTimeShareBefore"
                           label="发生前余额"
                           min-width="120">
            <!-- <template slot-scope="scope">
              <div>
                <div>充值余额：{{scope.row.userMoneyBefore}}</div>
                <div>赠送余额：{{scope.row.userMoneyPresentationBefore}}</div>
              </div>
            </template> -->
          </el-table-column>
          <el-table-column prop="cardTimeShare"
                           label="发生后余额"
                           min-width="120">
            <!-- <template slot-scope="scope">
              <div>
                <div>充值余额：{{scope.row.userMoney}}</div>
                <div>赠送余额：{{scope.row.userMoneyPresentation}}</div>
              </div>
            </template> -->
          </el-table-column>
          <el-table-column prop="operator"
                           label="账户信息"
                           min-width="160">
            <template slot-scope="scope">
              <div>
                <div>{{scope.row.userPhone}}&nbsp;</div>
                <div>{{scope.row.userName}}&nbsp;</div>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="凭证"
                           min-width="260">
            <template slot-scope="scope">
              <el-tooltip v-if="scope.row.evidenceNote"
                          placement="top">
                <div slot="content"
                     v-html="scope.row.evidenceNote"></div>
                <p v-if="scope.row.evidenceNote.length > 20"
                   v-html="trimbr(scope.row.evidenceNote)"></p>
                <p v-else
                   v-html="trimbr(scope.row.evidenceNote)"></p>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="addTime"
                           label="发生时间"
                           min-width="180"></el-table-column>
        </el-table>
      </div>

      <div class='table-page'>
        <el-pagination :current-page="page"
                       :page-size="pageSize"
                       layout="total, prev, pager, next"
                       :total="pageTotal"
                       @current-change="_handlePageChange">
        </el-pagination>
      </div>
    </el-card>

  </div>
</template>
<script>
import searchHistoryMixin from '@/mixins/search-history.js'
import paginationMixin from '@/mixins/pagination.js'
import { handleSubmitSearchData } from '@/utils/common.js'
import { pageSize } from '@/config/page-config.js'
import { handleDate } from '@/utils/date-filter'
import downloadByParama from '@/utils/download.js'

export default {
  name: 'cardTimeShare',

  mixins: [searchHistoryMixin, paginationMixin],
  data() {
    return {
      paymethodTxt: {
        alipayRefundsPlugin: '支付宝',
        weixinPayRefundsPlugin: '微信支付'
      },
      sum: '',
      searchData: {},
      provinceList: [],
      labelWidth: '100px',
      tableData: [],
      templateTitle: null,
      rowId: null,
      type: '',
      total: '',
      searchSettings: [
        {
          type: 'labelSelectText',
          placeholder: '请输入',
          name: 'keyWords',
          optionValue: 'userPhone',
          visible: true,
          options: [
            {
              label: '手机号',
              value: 'userPhone'
            },
            {
              label: '姓名',
              value: 'userName'
            }
          ]
        },
        {
          label: '发生时间',
          name: 'datetimerange',
          type: 'daterange',
          default: [new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), new Date()],
          visible: true
        },
        {
          label: '科目',
          name: 'actionCodes',
          type: 'select',
          placeholder: '不限',
          multiple: true,
          visible: false,
          options: []
        },
        {
          label: '所属城市',
          type: 'city',
          placeholder: '请选择',
          name: 'cityId'
          // enableAuth: true
        }
      ]
    }
  },

  computed: {
    user() {
      return this.$store.getters.user
    }
  },
  created() {
    this.initSubject()
    this.loadTableData()
  },
  methods: {
    loadFundsSum() {
      this.$service.fundsSum(this.searchData).then(res => {
        if (res.data.code == '0') {
          this.sum = res.data.data.sum
        } else {
          this.$message.warning(res.data.msg)
        }
      })
    },
    exportFileNew() {
      let params = {
        data: this.searchData,
        url: 'http://www.baidu.com',
        filename: 'dingdan.xlms',
        acctoken: 'accctoken'
      }

      downloadByParama(params)
    },
    trimbr(value) {
      if (value.length > 20) {
        return (
          value
            .replace(/<br\/>/gi, '')
            .replace(/<\/br>/gi, '')
            .substr(0, 20) + '...'
        )
      } else {
        return value.replace(/<br\/>/gi, '').replace(/<\/br>/gi, '')
      }
    },
    download(obj, s, e) {
      let len = this.tableData.length
      if (len === 0) {
        this.$message.warning('导出数据为空，请重新查询')
      } else {
        let start = new Date(s.replace(/-/g, '/')).getTime()
        let end = new Date(e.replace(/-/g, '/')).getTime()
        if (end - start <= 31 * 24 * 60 * 60 * 1000) {
          this.$service.downloadCapitalFlowBalance(
            obj,
            this.$store.getters.token,
            '分时出行卡.xlsx'
          )
        } else {
          this.$message.warning('导出订单时间范围必须小于等于31天，请重新设置')
        }
      }
    },
    exportFile() {
      let obj = this.searchData
      if (obj) {
        if (obj.hasOwnProperty('dateStart')) {
          this.download(obj, obj.dateStart, obj.dateEnd)
        } else {
          this.$message.warning('导出时间范围必须小于等于31天，请设置时间')
        }
      } else {
        this.$message.warning('导出时间范围必须小于等于31天，请设置时间')
      }
    },
    // 初始化客户设置
    initSubject(type = 'cardTimeShare') {
      let params = {}
      params.userMoneyType = type
      params.forSearch = true
      this.type = type

      this.$service.getCapitalFlowSubjects(params).then(res => {
        if (res.data.code == 0) {
          this.formateSubjects(res.data.data)
        }
      })

      // 初始化最近一周时间
      this.initSearchData()
    },

    formateSubjects(data = []) {
      let tmp = []
      for (let item in data) {
        tmp[item] = {
          label: data[item].userMoneyTypeText,
          value: data[item].userMoneyType
        }
      }
      this.searchSettings[2].options = tmp
    },
    handleSearch(data) {
      let searchData = Object.assign({}, data)
      if (searchData.datetimerange && searchData.datetimerange.length) {
        searchData.dateStart = handleDate(searchData.datetimerange[0], 'day')
        searchData.dateEnd = handleDate(searchData.datetimerange[1], 'day')
        delete searchData.datetimerange
      }
      if (searchData.cityId) {
        searchData.cityType = 'belongTo'
      }
      searchData = handleSubmitSearchData(searchData)

      if (searchData.actionCodes && searchData.actionCodes.length == 0) {
        delete searchData.actionCodes
      }

      searchData.type = this.type
      searchData.rows = pageSize
      searchData.forSearch = true
      this.searchData = searchData
      this.page = 1
      this.loadTableData()
    },
    /**
     * 初始化时间
     */
    initSearchData() {
      var now = new Date()
      let last1day = new Date(now.getTime() - 0 * 24 * 3600 * 1000)
      var last7days = new Date(now.getTime() - 7 * 24 * 3600 * 1000)
      let searchData = {}

      searchData.dateStart = handleDate(last7days, 'day')
      searchData.dateEnd = handleDate(last1day, 'day')
      searchData.forSearch = true
      searchData.type = this.type
      searchData.rows = 20

      this.searchData = searchData
    },

    loadTableData() {
      this.searchData.page = this.page
      this.searchData.rows = pageSize

      this.$service.timeShareCard(this.searchData).then(res => {
        let total = 0

        if (
          res.data.code == 0 &&
          res.data.data.pageData &&
          res.data.data.pageData.total > 0
        ) {
          total = res.data.data.pageData.total
          let rows = res.data.data.pageData.rows
          this.tableData = rows
          this.total = total

          // this.sum = res.data.data.sum
          // log2018-05-04 统计接口更新
          this._changePageTotal(total)

          this.loadFundsSum()
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
.el-form-item__label {
  width: 100px;
}
</style>
