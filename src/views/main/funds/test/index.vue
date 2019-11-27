<template>
  <div id="advertisingManager">
    <el-card class="table-box">
      <div slot="header">
        <v-search :searchSettings="searchSettings" @search="handleSearch" labelWidth="120px">
        </v-search>
      </div>

      <div class="table-operator">
        <el-button type="primary" size="small">导出</el-button>
        <el-button type="text" size="small">金额总计:{{total}}</el-button>
        <el-button type="text" size="small" @click="showAddTemplate">添加</el-button>
      </div>

      <div class="table-container">
        <el-table :data="tableData" height="100%">
          <el-table-column label="(退/收)款单号">
            <template slot-scope="scope">
              <div>
                <div>退款单号：{{scope.row.userId}}</div>
                <div>收款单号：{{scope.row.userId}}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="userId" label="退款状态" min-width="120px"></el-table-column>
          <el-table-column label="用户信息">
            <template slot-scope="scope">
              <div>
                <div>用户名：{{scope.row.userId}}</div>
                <div>手机号：{{scope.row.userId}}</div>
                <div>用户ID：{{scope.row.userId}}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="msgContent" label="支付方式" min-width="160">
            <template slot-scope="scope">
              <div v-if="scope.row.msgContent" style="white-space:nowrap">
                <p v-if="scope.row.msgContent.length < 10">{{scope.row.msgContent}}</p>
                <el-tooltip placement="top" v-else>
                  <div slot="content" class="tooltip-content">{{formateContent(scope.row.msgContent)}}</div>
                  <p>{{scope.row.msgContent.substr(0, 10)}}...</p>
                </el-tooltip>
              </div>
              <div v-else>-</div>
            </template>
          </el-table-column>
          <el-table-column prop="msgTime" label="账户类型" min-width="120px"></el-table-column>
          <el-table-column prop="messageImg" label="金额（元）"></el-table-column>
          <el-table-column prop="handleStatus" label="时间信息" min-width="100">
            <template slot-scope="scope">
              <div>
                <div>第三方发起时间：{{scope.row.userId}}</div>
                <div>系统查询时间：{{scope.row.userId}}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="messageImg" label="财务审核人"></el-table-column>
          <el-table-column prop="messageImg" label="备注">
            <template slot-scope="scope">
              <el-tooltip :content="scope.row.msgContent" placement="top">
                <p>备注</p>
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
    name: "test",
    components: {
      vPage,
      formGenerator,
      websiteSelect,
      popSwitch
    },
    mixins: [searchHistoryMixin, paginationMixin],
    data() {
      return {
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
          optionValue: 'carNumber',
          visible: true,
          options: [{
            label: '手机号',
            value: 'carNumber',
          }, {
            label: '用户名',
            value: 'userName',
          }, {
            label: '用户ID',
            value: 'userPhone',
          }, {
            label: '收款单号',
            value: 'orderSn',
          }]
        },{
          label: '支付状态',
          name: '',
          type: 'select',
          visible: true,
          options: [
            {
              value:'',
              label:'请选择'
            },{
              value:0,
              label:'退款中'
            },{
              value:1,
              label:'退款成功'
            },{
              value:1,
              label:'退款申请失败'
            },{
              value:1,
              label:'退款失败'
            }
          ]
        },{
          label: '支付方式',
          name: '',
          type: 'select',
          visible: true,
          options: [
            {
              value:'',
              label:'请选择'
            },{
              value:0,
              label:'微信'
            },{
              value:1,
              label:'支付宝'
            }
          ]
        },{
          label: '账户类型',
          name: '',
          type: 'select',
          visible: true,
          options: [
            {
              value:'',
              label:'请选择'
            },{
              value:1,
              label:'分时保证金'
            },{
              value:1,
              label:'长租违章押金'
            },{
              value:1,
              label:'长租车辆押金'
            }
          ]
        },{
          type: 'labelSelectDateRange',
          placeholder: '选择时间',
          name: 'selectDate',
          optionValue: 'date',
          options: [{
            label: '发起时间',
            value: 'date'
          }, {
            label: '系统查询时间',
            value: 'startDate'
          }]
        }],
      };
    },

    computed: {
      user() {
        return this.$store.getters.user
      }
    },
    created() {
      // this.loadTableData()
    },
    methods: {
      // 设置添加模板
      showAddTemplate:function () {

      },
      addNote(data) {
        let idfeedback = data.feedbackId;

        this.$prompt('填写备注信息', '备注', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({ value }) => {
          let params = {};

          params.remark = value;
          params.feedback_id = idfeedback;

          this.$service.saveUerFeedbackRemark(params).then(res => {
            if(res.data.code == 0){
              this.$message({
                type: 'success',
                message: '添加备注成功'
              });

            } else {
              this.$message({
                type: 'info',
                message: '添加备注失败'+res.data.msg
              });
            }
          })

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });
        });
      },
      handleSearch(data) {
        let searchData = Object.assign({}, data);
        searchData = handleSubmitSearchData(searchData);
        if (data.datetimerange && data.datetimerange.length) {
          searchData.datemin = data.datetimerange[0]
          searchData.datemax = data.datetimerange[1]
          delete searchData.datetimerange;
        }

        this.searchData = searchData;
        this.page = 1;
        this.loadTableData();
      },
      handleProcess(data, type) {
        this.type = type;
      },
      loadTableData() {
        // 数据查询
        this.$service.getFeedbackList(this.page, this.searchData).then(res => {
          let rows = res.data.data.rows;
          let total = res.data.data.total;
          rows = this.formateRow(rows);
          this.tableData = rows;
          this.total = total;
          this._changePageTotal(total)
        })
      },
      formateContent(data){
        return data
      },
      //格式化数据
      formateRow(rows){
        let statuscfg = {
          0:'待处理',
          1:'已处理',
        };

        let appTypecfg = {
          1:'租车',
          2:'充电桩',
        };

        let length = rows.length;
        for(let i=0; i< length; i++){
          rows[i].handleStatus = statuscfg[rows[i].handleStatus];
          rows[i].appType = !isNaN(appTypecfg[rows[i].appType])? '其他' : appTypecfg[rows[i].appType];
        }
        return rows;
      },
    }
  };
</script>
<style lang="scss">
  .el-form-item__label{
    width:100px;
  }
</style>
