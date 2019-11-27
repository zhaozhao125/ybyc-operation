<template>
  <div id="advertisingManager">
    <el-card class="table-box">
      <div slot="header">
        <v-search :searchSettings="searchSettings" @search="handleSearch" labelWidth="120px">
        </v-search>
      </div>
      <div class="car-summary table-operator">
        <ul>
          <li> 金额总计:{{sum}} </li>
        </ul>
      </div>

      <div class="table-container">
        <el-table :data="tableData" height="100%">
          <el-table-column label="(退/收)款单号" min-width="240px">
            <template slot-scope="scope">
              <div>
                <div>退款单号：{{scope.row.sn}}</div>
                <div>收款单号：{{scope.row.paymentSn}}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="statusText" label="退款状态" min-width="80px"></el-table-column>
          <el-table-column label="用户信息" min-width="120px">
            <template slot-scope="scope">
              <div>
                <div>用户名：{{scope.row.payeeUsername}}</div>
                <div>手机号：{{scope.row.payeeUserPhone}}</div>
                <div>用户编号：{{scope.row.payeeSn}}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="msgContent" label="支付方式" min-width="80px">
            <template slot-scope="scope">
              {{ paymethodTxt[scope.row.refundsPluginId] }}
            </template>
          </el-table-column>
          <el-table-column prop="typeText" label="账户类型" min-width="100px"></el-table-column>
          <el-table-column prop="amount" label="金额（元）" min-width="60px"></el-table-column>
          <el-table-column prop="handleStatus" label="时间信息" min-width="200px">
            <template slot-scope="scope">
              <div>
                <div>发起时间：{{ formatDateTime(scope.row.createDate) }}</div>
                <div>查询时间：{{ formatDateTime(scope.row.refundDate) }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="operator" label="财务审核人" min-width="100px"></el-table-column>
          <el-table-column prop="messageImg" label="备注">
            <template slot-scope="scope">
              <el-tooltip v-if="scope.row.memo" :content="scope.row.memo" placement="top">
                <p>备注</p>
              </el-tooltip>
              <el-tooltip v-else="scope.row.memo" placement="top">
                <p></p>
              </el-tooltip>
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
  import { resultSelectData } from "@/utils/common";
  import popSwitch from '@/components/pop-switch';
  import formGenerator from '@/components/formGenerator';
  import websiteSelect from "@/components/website-select";
  import vPage from "@/components/page";
  import searchHistoryMixin from '@/mixins/search-history.js'
  import paginationMixin from '@/mixins/pagination.js'
  import {handleDictData,handleSubmitSearchData} from "@/utils/common.js";

  export default {
    name: "refund",
    components: {
      vPage,
      formGenerator,
      websiteSelect,
      popSwitch
    },
    mixins: [searchHistoryMixin, paginationMixin],
    data() {
      return {
        paymethodTxt:{
          alipayRefundsPlugin:'支付宝',
          weixinPayRefundsPlugin:'微信支付'
        },
        sum:'',
        searchData:{},
        provinceList: [],
        labelWidth: '220px',
        tableData: [],
        templateTitle: null,
        rowId: null,
        type:'',
        total:'',
        searchSettings: [{
          type: 'labelSelectText',
          placeholder: '请输入',
          name: 'selectText',
          optionValue: 'payeeUserPhone',
          visible: true,
          options: [{
            label: '手机号',
            value: 'payeeUserPhone',
          }, {
            label: '用户名',
            value: 'payeeUsername',
          }, {
            label: '用户编号',
            value: 'payerSn',
          }, {
            label: '收款单号',
            value: 'sn',
          }]
        },{
          type: 'labelSelectDateRange',
          placeholder: '选择时间',
          name: 'dateType',
          visible: true,
          optionValue: 'create',
          default: [new Date(Date.now() - (7 * 24 * 60 * 60 * 1000)), new Date()],
          options: [{
            label: '发起时间',
            value: 'create'
          }, {
            label: '系统查询时间',
            value: 'refund'
          }]
        },{
          label: '支付状态',
          name: 'status',
          type: 'select',
          visible: false,
          options: [
            {
              value:'',
              label:'请选择'
            },{
              value:'refunding',
              label:'退款中'
            },{
              value:'success',
              label:'退款成功'
            },{
              value:'apply_failure',
              label:'退款申请失败'
            },{
              value:'failure',
              label:'退款失败'
            }
          ]
        },{
          label: '支付方式',
          name: 'refundsPluginId',
          type: 'select',
          visible: false,
          options: [
            {
              value:'',
              label:'请选择'
            },{
              value:'weixinPayRefundsPlugin',
              label:'微信'
            },{
              value:'alipayRefundsPlugin',
              label:'支付宝'
            }
          ]
        },{
          label: '账户类型',
          name: 'type',
          type: 'select',
          visible: false,
          options: [
            {
              value:'',
              label:'请选择'
            },{
              value:'timeShareRentDepositRecharge',
              label:'分时保证金'
            },{
              value:'longTermRentViolationDepositRecharge',
              label:'长租违章押金'
            },{
              value:'longTermRentCarDepositRecharge',
              label:'长租车辆押金'
            }
          ]
        }],
      };
    },

    computed: {
      user() {
        return this.$store.getters.user
      }
    },
    created() {
      this.initSearchData()
      this.loadTableData()
    },
    methods: {
      formatDateTime(inputTime) {
        var date = new Date(inputTime);
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        var h = date.getHours();
        h = h < 10 ? ('0' + h) : h;
        var minute = date.getMinutes();
        var second = date.getSeconds();
        minute = minute < 10 ? ('0' + minute) : minute;
        second = second < 10 ? ('0' + second) : second;
        return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second;
      },
      handleSearch(data) {
        let searchData = Object.assign({}, data);
        searchData = handleSubmitSearchData(searchData);

        if (searchData.refund && searchData.refund.length !== 0) {
          searchData.dateStart = this.formatDate(searchData.refund[0]);
          searchData.dateEnd = this.formatDate(searchData.refund[1]);
          searchData.dateType = 'refund';
          delete searchData.refund;
        }

        if (searchData.create && searchData.create.length !== 0) {
          searchData.dateStart = this.formatDate(searchData.create[0]);
          searchData.dateEnd = this.formatDate(searchData.create[1]);
          searchData.dateType = 'create';
          delete searchData.create;
        }

        if(JSON.stringify(data) == '{}'){
          var now = new Date();
          let last1day = new Date(now.getTime() - 0 * 24 * 3600 * 1000);
          var last7days = new Date(now.getTime() - 7 * 24 * 3600 * 1000);

          searchData.dateStart = this.formatDate(last7days);
          searchData.dateEnd = this.formatDate(last1day);
          searchData.dateType = 'create';
        }

        this.searchData = searchData;
        this.page = 1;

        this.loadTableData();
      },
      handleProcess(data, type) {
        this.type = type;
      },

      /**
       * 初始化时间
       */
      initSearchData() {
        var now = new Date();
        let last1day = new Date(now.getTime() - 0 * 24 * 3600 * 1000);
        var last7days = new Date(now.getTime() - 7 * 24 * 3600 * 1000);
        let searchData = {};

        searchData.dateStart = this.formatDate(last7days);
        searchData.dateEnd = this.formatDate(last1day);
        searchData.dateType = 'create';
        this.searchData = searchData;
      },
      loadTableData() {
        // 数据查询
        this.$service.getRefundList(this.page, this.searchData).then(res => {
          let total = 0;

          if(res.data.data.pageData){
            total = res.data.data.pageData.total;
            let rows = res.data.data.pageData.rows;

            this.tableData = rows;
            this.total = total;
            this.sum = res.data.data.sum;

            this._changePageTotal(total)
          } else {
            this.tableData = [];
            this.total = total;
            this.sum = 0;

            this._changePageTotal(total)
          }
        })
      },
      formateContent(data){
        return data
      },
      // 格式化时间
      formatDate(date) {
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        return year + "-" + this.formatTen(month) + "-" + this.formatTen(day);
      },
      formatTen(num) {
        return num > 9 ? num + "" : "0" + num;
      }
    }
  };
</script>
<style lang="scss">
  .el-form-item__label{
    width:100px;
  }
</style>
