<template>
  <!-- 收款对账单 -->
  <div id="paymentBill">
    <el-card class="table-box">
      <div slot="header">
        <v-search :searchSettings="searchSettings" @search="handleSearch" labelWidth="120px">
          <template slot="cityId" slot-scope="scope">
            <el-select v-model="scope.model.cityId" multiple placeholder="请选择">
              <el-option
                v-for="item in cityList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </template>
        </v-search>
      </div>
      <div class="table-operator">
        <el-button size="small" type="primary" @click="exportFile" v-has="'paylistDownload'">导出</el-button>
      </div>

      <div class="car-summary table-operator">
        <ul>
          <li> 金额总计:{{sum}} </li>
        </ul>
      </div>

      <div class="table-container">
        <el-table :data="tableData" height="100%">
          <el-table-column prop="sn" label="收款单号" min-width="200px"></el-table-column>
          <el-table-column label="支付状态" min-width="80px">
            <template slot-scope="scope">
              <div>{{ scope.row.statusText }}</div>
            </template>
          </el-table-column>
          <el-table-column label="用户信息" min-width="170px">
            <template slot-scope="scope">
              <div>
                <div>用户名：{{scope.row.payerUsername}}</div>
                <div>手机号：{{scope.row.payerUserPhone}}</div>
                <div>用户编号：{{scope.row.payerSn}}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="msgContent" label="支付方式" min-width="80px">
            <template slot-scope="scope">
              <div>{{ paymethodTxt[scope.row.paymentPluginId] }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="cityNameBelongTo" label="城市" min-width="80px"></el-table-column>
          <el-table-column prop="typeText" label="账户类型" width="200px">
            <template slot-scope="scope">
              <div>
                <div>{{scope.row.typeText === '余额充值' ? '充值余额' : scope.row.typeText }}</div>
                <div>{{scope.row.orderSn}}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="amount" label="金额（元）" min-width="80px"></el-table-column>
          <el-table-column prop="handleStatus" label="时间信息" min-width="180px" show-overflow-tooltip>
            <template slot-scope="scope">
              <div>
                <div>创建时间：{{scope.row.createDate | timeFilter}} </div>
                <div>支付时间：{{scope.row.paymentDate | timeFilter}} </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class='table-page'>
        <el-pagination :current-page="page" :page-size="pageSize" layout="total, prev, pager, next" :total="pageTotal" @current-change="_handlePageChange">
        </el-pagination>
      </div>
    </el-card>

    <v-page v-if="type == 'comment'">
      <el-dialog title="信息备注" :width="dialogWidth" :before-close="handleBeforeClose">
        <el-form ref="commentForm" :model="commentForm" label-width="80px" size="small">
          <el-form-item label="备注" prop="comment">
            <el-input type="textarea" :autosize="{ minRows: 5, maxRows: 10}" placeholder="请输入备注" v-model="commentForm.comment">
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSubmitComment" :loading="formLoading">确定</el-button>
            <el-button @click="handleCancel">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </v-page>
  </div>
</template>
<script>
import searchHistoryMixin from '@/mixins/search-history.js'
import paginationMixin from '@/mixins/pagination.js'

export default {
  name: 'paylist',

  mixins: [searchHistoryMixin, paginationMixin],

  data() {
    return {
      cityList: [],
      paymethodTxt: {
        alipayMobilePlugin: '支付宝',
        weixinpayMobilePlugin: '微信支付'
      },
      statusTxt: {
        wait: '等待支付',
        success: '支付成功',
        failure: '支付失败'
      },
      sum: '',
      searchData: {},
      provinceList: [],
      labelWidth: '220px',
      tableData: [],
      templateTitle: null,
      rowId: null,
      type: '',
      total: '',
      searchSettings: [{
        type: 'labelSelectText',
        placeholder: '请输入',
        name: 'selectText',
        optionValue: 'payerUserPhone',
        visible: true,
        options: [{
          label: '手机号',
          value: 'payerUserPhone'
        }, {
          label: '用户名',
          value: 'payerUsername'
        }, {
          label: '用户编号',
          value: 'payerSn'
        }, {
          label: '收款单号',
          value: 'sn'
        }, {
          label: '订单编号',
          value: 'orderSn'
        }]
      }, {
        type: 'labelSelectDateRange',
        placeholder: '选择时间',
        name: 'dateType',
        visible: true,
        optionValue: 'create',
        default: [new Date(Date.now() - (7 * 24 * 60 * 60 * 1000)), new Date()],
        options: [{
          label: '支付时间',
          value: 'paid'
        }, {
          label: '创建时间',
          value: 'create'
        }]
      }, {
        label: '城市',
        name: 'cityId',
        type: 'city',
        visible: false
      }, {
        label: '支付状态',
        name: 'status',
        type: 'select',
        visible: false,
        options: [
          {
            value: '',
            label: '请选择'
          },
          {
            value: 'wait',
            label: '待支付'
          },
          {
            value: 'success',
            label: '已支付'
          }
        ]
      }, {
        label: '支付方式',
        name: 'paymentPluginId',
        type: 'select',
        visible: false,
        options: [
          {
            value: '',
            label: '请选择'
          },
          {
            value: 'weixinpayMobilePlugin',
            label: '微信'
          },
          {
            value: 'alipayMobilePlugin',
            label: '支付宝'
          }
        ]
      }, {
        label: '账户类型',
        name: 'type',
        type: 'select',
        visible: false,
        options: [
          {
            value: '',
            label: '请选择'
          }, {
            value: 'balanceRecharge',
            label: '充值余额'
          }, {
            value: 'timeShareRentDepositRecharge',
            label: '分时保证金'
          }, {
            value: 'longTermRentViolationDepositRecharge',
            label: '长租违章押金'
          }, {
            value: 'longTermRentCarDepositRecharge',
            label: '长租车辆押金'
          }, {
            value: 'timeShareRent',
            label: '分时订单支付'
          }, {
            value: 'shortRent',
            label: '短/长租订单支付'
          }
        ]
      }]
    }
  },

  computed: {
  },
  created() {
    this.initSearchData()
    this.loadTableData()
  },
  methods: {
    download(obj, s, e) {
      let len = this.tableData.length
      if (len === 0) {
        this.$message.warning('导出数据为空，请重新查询')
      } else {
        let start = new Date(s.replace(/-/g, '/')).getTime()
        let end = new Date(e.replace(/-/g, '/')).getTime()
        if (end - start <= 31 * 24 * 60 * 60 * 1000) {
          this.$service.downloadPaylist(
            obj,
            this.$store.getters.token,
            '收款对账单.xlsx'
          )
        } else {
          this.$message.warning('导出时间范围必须小于等于31天，请重新设置')
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
    formatDateTime(inputTime) {
      if (inputTime) {
        var date = new Date(inputTime)
        var y = date.getFullYear()
        var m = date.getMonth() + 1
        m = m < 10 ? ('0' + m) : m
        var d = date.getDate()
        d = d < 10 ? ('0' + d) : d
        var h = date.getHours()
        h = h < 10 ? ('0' + h) : h
        var minute = date.getMinutes()
        var second = date.getSeconds()
        minute = minute < 10 ? ('0' + minute) : minute
        second = second < 10 ? ('0' + second) : second
        return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second
      } else {
        return ''
      }
    },

    handleSearch(data) {
      let searchData = Object.assign({}, data)

      if (searchData.paid && searchData.paid.length !== 0) {
        searchData.dateStart = this.formatDate(searchData.paid[0])
        searchData.dateEnd = this.formatDate(searchData.paid[1])
        searchData.dateType = 'paid'
        delete searchData.paid
      }

      if (searchData.create && searchData.create.length !== 0) {
        searchData.dateStart = this.formatDate(searchData.create[0])
        searchData.dateEnd = this.formatDate(searchData.create[1])
        searchData.dateType = 'create'
        delete searchData.create
      }

      if (searchData.type == 'timeShareRent' || searchData.type == 'shortRent') {
        searchData.orderType = searchData.type
        delete searchData.type
      }
      if (searchData.cityId) {
        searchData.cityType = 'belongTo'
      }

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

      searchData.dateStart = this.formatDate(last7days)
      searchData.dateEnd = this.formatDate(last1day)
      searchData.dateType = 'create'
      this.searchData = searchData
    },

    handleProcess(data, type) {
      this.type = type
    },
    formateCityList(cityArr) {
      let output = []
      for (let idx in cityArr) {
        output.push({
          label: cityArr[idx].name,
          value: cityArr[idx].id
        })
      }

      this.cityList = output
    },
    loadTableData() {
      this.$service.getAllCities().then(res => {
        this.formateCityList(res.data.data)
      })
      this.$service.getPayList(this.page, this.searchData).then(res => {
        if (res.data.data.pageData) {
          let rows = res.data.data.pageData.rows
          let total = res.data.data.pageData.total

          this.tableData = rows
          this.total = total
          this.sum = res.data.data.sum
          this._changePageTotal(total)
        } else {
          this.tableData = {}
          this.total = 0
          this.sum = 0
          this._changePageTotal(0)
        }
      })
    },
    // 格式化时间
    formatDate(date) {
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      let day = date.getDate()
      return year + '-' + this.formatTen(month) + '-' + this.formatTen(day)
    },
    formatTen(num) {
      return num > 9 ? num + '' : '0' + num
    }
  }
}
</script>
<style lang="scss">

</style>
