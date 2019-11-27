@@ -0,0 +1,255 @@
<template>
  <div id="advertisingManager">
    <el-card class="table-box">
      <div slot="header">
        <v-search :searchSettings="searchSettings" @search="handleSearch" labelWidth="120px">
          <template slot="stationId" slot-scope="scope">
            <div class="select-content">
              <span class="select-website-item">
                <website-select-local v-model="scope.model.stationId" placeholder="请输入站点名" isRequest ></website-select-local>
                <!-- 根据运营城市id来请求网点数据 -->
              </span>
            </div>
          </template>
        </v-search>
      </div>
      <div class="table-operator">
        <el-button size="small" type="primary" @click="exportChargingorder">导出订单</el-button>
        <el-button size="small" @click="exportChargingorderMonth">导出上月费用报表</el-button>
      </div>

      <div class="car-summary table-operator">
        <ul>
          <!--<li class="state-rent">已完成</li>-->
          <!--<li class="state-leisure">充电中</li>-->
          <!--<li class="state-rent">充电完成</li>-->
          <!--<li class="state-maintain">维护中：</li>
          <li class="state-low"> 亏电：</li>-->
        </ul>
      </div>

      <div class="table-container">
        <el-table :data="tableData" height="100%">
          <el-table-column label="订单编号" min-width="220">
            <template slot-scope="scope">
              <el-button type="text" @click="detialBysn(scope.row.sn)">{{scope.row.sn}}</el-button>
            </template>
          </el-table-column>
          <el-table-column label="订单状态" min-width="160">
            <template slot-scope="scope">
              <div class="car-summary table-operator">
              <ul>
                <li :class="scope.row.status_class ">{{scope.row.status_txt}}</li>
              </ul>
            </div>
            </template>
          </el-table-column>
          <el-table-column prop="msgContent" label="用户信息" min-width="160">
            <template slot-scope="scope">
              <div>
                <div>{{scope.row.userName}}</div>
                <div>{{scope.row.userTelephone}}</div>
                <div>{{scope.row.userType}}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="充电桩信息" min-width="160">
            <template slot-scope="scope">
              <div>
                <div>{{scope.row.operatorConnectorId}}</div>
                <div>{{scope.row.operatorName}}</div>

              </div>
            </template>
          </el-table-column>
          <el-table-column prop="cityName" label="城市" min-width="160"></el-table-column>
          <el-table-column label="站点信息" width="160">
            <template slot-scope="scope">
              <div>
                <div>{{scope.row.stationName}}</div>
                <div>{{scope.row.device}}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="时间信息" min-width="240">
            <template slot-scope="scope">
              <div>
                <div>开始时间：{{scope.row.startTimeTxt}}</div>
                <div>结束时间：{{scope.row.endTimeTxt}}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="订单资金" min-width="160">
            <template slot-scope="scope">
              <div>
                <div>订单金额：{{scope.row.totalMoney}}</div>
                <div v-if="scope.row.discountAmount">优惠金额：{{scope.row.discountAmount}}</div>
                <div>应付金额：{{scope.row.needPay}}</div>
                <div>实付金额：{{scope.row.actualPay}}</div>
                <div v-if="scope.row.status_txt == '充电中'"><el-button @click="showCharingOrderPrice(scope.row.sn)" type="text" size="small">查看实时计费</el-button></div>
              </div>
            </template>
          </el-table-column>

        </el-table>
      </div>

      <div class='table-page'>
        <el-pagination :current-page="page" :page-size="pageSize" layout="total, prev, pager, next" :total="pageTotal" @current-change="_handlePageChange">
        </el-pagination>
      </div>

      <v-page :visible.sync="chargingOrderPriceFlag">
        <h3 slot="title">充电订单计费
          <el-button class="refresh-return-details" type="primary" size="small" @click="refreshChargingOrderPriceDetails()">刷新</el-button>
        </h3>
        <template slot="content">
          <charging-order-pricce :detailData="chargingOrderPricceData" ref="chargingOrderPrice">
          </charging-order-pricce>
        </template>
      </v-page>
      <!-- 订单详情展示 -->
      <v-page :visible.sync="changeOrderDetialFlag" @goBack="loadTableData">
        <h3 slot="title">充电订单详情
          <el-button v-if="showCloseBtn"
            class="refresh-return-details"
            type="primary" size="small"
            @click="closeChargePileOrder(changeOrderDetial)">结束订单</el-button>
        </h3>
        <template slot="content">
          <charging-order-detial
            :detailData="changeOrderDetial"
            ref="changeOrderDetial">
          </charging-order-detial>
        </template>
      </v-page>
        <!-- 订单详情中结束订单 -->
          <el-dialog
            title="结束订单"
            :visible.sync="showCloseBtnDetial"
            width="30%"
            :before-close="cancelChargingOrderRow"
          >
            <el-row>
              <el-col :span="4"></el-col>
              <el-col :span="4">备注</el-col>
              <el-col :span="16">
                <el-input
                  type="textarea"
                  :autosize="{minRows:2,maxRows:4}"
                  placeholder="请输入内容"
                  v-model="remark">
                </el-input>
                </el-col>
              </el-row>

            <span slot="footer" class="dialog-footer">
              <el-button @click="cancelChargingOrderRow">取 消</el-button>
              <el-button type="primary" @click="submitCloseChargeOrderRow">确 定</el-button>
            </span>
          </el-dialog>

    </el-card>

  </div>
</template>
<script>
import { resultSelectData } from '@/utils/common'
import popSwitch from '@/components/pop-switch'
import formGenerator from '@/components/formGenerator'
import websiteSelect from '@/components/website-select'
import vPage from '@/components/page'
import searchHistoryMixin from '@/mixins/search-history.js'
import paginationMixin from '@/mixins/pagination.js'
import { handleDictData, handleSubmitSearchData } from '@/utils/common.js'
import { handleDate } from '@/utils/date-filter'
import chargingOrderPricce from './components/chargingOrderPricce'
import chargingOrderDetial from './components/chargingOrderDetial'
import websiteSelectLocal from './components/website-select'

export default {
  name: 'charging-order-index',
  components: {
    vPage,
    formGenerator,
    websiteSelect,
    popSwitch,
    chargingOrderPricce,
    chargingOrderDetial,
    websiteSelectLocal
  },
  mixins: [searchHistoryMixin, paginationMixin],
  props: [
    'params'
  ],
  data() {
    return {
      remark: '',
      showCloseBtnDetial: false,
      showCloseBtn: false,
      changeOrderDetial: {},
      changeOrderDetialFlag: false,
      orderSn: '',
      chargingOrderPricceData: {},
      chargingOrderPriceFlag: false,
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
        name: 'keywords',
        optionValue: 'userName',
        visible: true,
        options: [{
          label: '用户名',
          value: 'userName'
        }, {
          label: '手机号',
          value: 'userTelephone'
        }, {
          label: '订单编号',
          value: 'sn'
        }, {
          label: '桩编号',
          value: 'equipmentSn'
        }]
      }, {
        label: '订单状态',
        name: 'orderStatus',
        type: 'select',
        visible: true,
        options: [
          {
            value: '',
            label: '不限'
          },
          {
            value: 'CHARGING',
            label: '充电中'
          },
          {
            value: 'COMPLETED',
            label: '已完成'
          }
        ]
      }, {
        label: '城市',
        name: 'cityId',
        type: 'remoteCity',
        visible: false
      }, {
        label: '订单来源',

        name: 'userType',
        type: 'select',
        visible: false,
        options: [
          {
            value: '',
            label: '不限'
          },
          {
            value: 'OPS',
            label: '车服充电'
          },
          {
            value: 'USER',
            label: '用户自主充电'
          },
          {
            value: 'RETURN_CAR',
            label: '用户还车充电'
          }
        ]
      }, {
        label: '下单时间',
        name: 'datetimerange',
        type: 'daterange',
        visible: false
      }, {
        label: '充电站',
        name: 'stationId',
        type: 'slot',
        placeholder: '输入充电站名',
        visible: false
      }]
    }
  },

  computed: {
  },
  created() {
    this.handleSearch()
  },
  mounted () {
    this.handleParamsChange()
  },
  watch: {
    params() {
      this.handleParamsChange()
    }
  },
  methods: {
    handleParamsChange() {
      if (this.params) {
        if (this.params.orderSn) {
          this.detialBysn(this.params.orderSn)
        }
      }
    },
    exportChargingorderMonth() {
      let obj = {}
      this.$service.exportChargingorderMonth(
        obj,
        this.$store.getters.token,
        '充电订单上月费用报表.xlsx'
      )
    },

    download(obj, s, e) {
      let len = this.tableData.length
      if (len === 0) {
        this.$message.warning('导出数据为空，请重新查询')
      } else {
        let start = new Date(s.replace(/-/g, '/')).getTime()
        let end = new Date(e.replace(/-/g, '/')).getTime()
        if (end - start <= 31 * 24 * 60 * 60 * 1000) {
          this.$service.exportChargingorder(
            obj,
            this.$store.getters.token,
            '充电订单.xlsx'
          )
        } else {
          this.$message.warning('导出时间范围必须小于等于31天，请重新设置')
        }
      }
    },

    exportChargingorder() {
      console.info('exportChargingorder')
      let obj = this.searchData

      if (obj) {
        if (obj.hasOwnProperty('startCreatedOn')) {
          this.download(obj, obj.startCreatedOn, obj.endCreatedOn)
        } else {
          this.$message.warning('导出时间范围必须小于等于31天，请设置时间')
        }
      } else {
        this.$message.warning('导出时间范围必须小于等于31天，请设置时间')
      }
    },
    submitCloseChargeOrderRow() {
      console.dir('submitCloseChargeOrderRow')
      if (this.remark.length <= 0) {
        this.$message({
          type: 'warning',
          message: '内容不能为空'
        })

        return false
      }

      let params = {
        orderSn: this.changeOrderDetial.sn,
        remark: this.remark
      }

      this.$service.postCloseChargeOrder(params).then(res => {
        console.dir(res)

        if (res.data.code == 0) {
          this.$message({
            type: 'success',
            message: '操作成功'
          })

          this.showCloseBtnDetial = false
          // 结束订单重新加载数据
          this.detialBysn(this.changeOrderDetial.sn)
        }
      })
    },
    cancelChargingOrderRow() {
      this.remark = ''
      this.showCloseBtnDetial = false
    },

    // 结束订单
    closeChargePileOrder(row) {
      this.showCloseBtnDetial = true
    },
    detialBysn(sn) {
      if (sn.length > 0) {
        let params = {
          orderSn: sn
        }

        this.$service.getChargeOrderDetialRow(params).then(res => {
          if (res.data.code == 0) {
            console.dir(res.data.data)

            this.changeOrderDetial = this.$service.formateChargingOrderRow(res.data.data)
            this.changeOrderDetialFlag = true
            this.remark = ''

            // 结束订单btn显示
            if (this.changeOrderDetial.orderStatus == '已完成') {
              this.showCloseBtn = false
            } else {
              this.showCloseBtn = true
            }
          } else {
            console.dir('页面错'); return false
          }
        })
      } else {
        return false
      }
    },
    refreshChargingOrderPriceDetails() {
      let params = {
        orderSn: this.orderSn
      }

      this.$service.getCharingOrderPrice(params).then(res => {
        if (res.data.code == 0) {
          this.chargingOrderPricceData = this.$service.formateOnlineChargingOrderprice(res.data.data)
          this.chargingOrderPriceFlag = true
        } else {
          console.dir('页面错'); return false
        }
      })
    },
    exportFile() {},
    showCharingOrderPrice(orderSn) {
      let params = {
        orderSn: orderSn
      }

      this.$service.getCharingOrderPrice(params).then(res => {
        if (res.data.code == 0) {
          this.chargingOrderPricceData = this.$service.formateCharingOrderPrice(res.data.data)
          console.dir('对应的数据')
          console.dir(this.chargingOrderPricceData)

          this.chargingOrderPriceFlag = true
          this.orderSn = orderSn
        } else {
          console.dir('页面错'); return false
        }
      })
    },

    handleSearch(data = {}) {
      this.page = 1
      let searchData = Object.assign({}, data)
      searchData = handleSubmitSearchData(searchData)
      if (data.datetimerange && data.datetimerange.length) {
        searchData.startCreatedOn = handleDate(data.datetimerange[0], 'day')
        searchData.endCreatedOn = handleDate(data.datetimerange[1], 'day')

        delete data.datetimerange
        delete searchData.datetimerange
      }

      this.searchData = searchData
      this.loadTableData()
    },

    loadTableData() {
      // 加载数据
      this.searchData.page = this.page
      console.dir(this.searchData)

      this.$service.getChargingOrderList(this.searchData).then(res => {
        let total = res.data.data.totalElements
        this._changePageTotal(total)
        if (total > 0) {
          this.tableData = this.$service.formateChargingOrderList(res.data.data.records)
        } else {
          this.tableData = []
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
  .car-summary {
    white-space: nowrap;
    ul {
      display: flex;
      li {
        margin-right: 3%;
        font-size: 14px;
        color: #888;
      }
    }
  }
  .refresh-return-details {
    position: fixed;
    top: 160px;
    right: 160px;
  }
</style>
