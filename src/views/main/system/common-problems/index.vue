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
        <el-button size="small" @click="saveRow({}, 1)" type="primary" v-has="'commonProblemsAdd'">添加问题</el-button>
      </div>

      <div class="table-container">
        <el-table :data="tableData" height="100%">
          <el-table-column label="问题标题" min-width="160">
            <template slot-scope="scope">
              <el-tooltip v-if="scope.row.question_title" placement="top" popper-class="eltooltip">
                <div slot="content" v-html="scope.row.question_title"></div>
                <p v-if="scope.row.question_title.length > 10" v-html="scope.row.question_title.substr(0,10)+'...'" ></p>
                <p v-else v-html="scope.row.question_title"></p>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="问题内容" min-width="160">
            <template slot-scope="scope">
              <el-tooltip v-if="scope.row.question_content" placement="top" popper-class="eltooltip">
                <div slot="content" v-html="scope.row.question_content"></div>
                <p v-if="scope.row.question_content.length > 10" v-html="scope.row.question_content.substr(0,10)+'...'" ></p>
                <p v-else v-html="scope.row.question_content"></p>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="添加时间" prop="created_on" min-width="160"></el-table-column>
          <el-table-column label="添加管理员" prop="created_by" min-width="160"></el-table-column>
          <el-table-column fixed="right" label="操作" min-width="160">
            <template slot-scope="scope">
              <el-button type="text" @click="saveRow(scope.row.question_id, 2)" size="small" v-has="'commonProblemsUpdate'">编辑</el-button>
              <el-button type="text" @click="delRow(scope.row.question_id)" size="small" v-has="'commonProblemsDel'">删除</el-button>
            </template>
          </el-table-column>

        </el-table>
      </div>

      <div class='table-page'>
        <el-pagination :current-page="page" :page-size="pageSize" layout="total, prev, pager, next" :total="pageTotal" @current-change="_handlePageChange">
        </el-pagination>
      </div>

      <v-page :visible.sync="showAddOrEditFlag" @goBack="loadTableData">
        <h3 slot="title">{{subTitle}}</h3>
        <template slot="content">
          <add-or-edit :formData="row" ref="addOrEdit" @closeAndRefresh="closeAndRefresh"></add-or-edit>
        </template>
      </v-page>
    </el-card>

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
  import { pageSize } from '@/config/page-config.js'
  import {handleDictData,handleSubmitSearchData} from "@/utils/common.js";
  import { handleDate } from '@/utils/date-filter';
  import chargingOrderPricce from './components/addOrEdit'
  import addOrEdit from './components/addOrEdit'

  export default {
    name: "common-problems-index",
    components: {
      vPage,
      formGenerator,
      websiteSelect,
      popSwitch,
      chargingOrderPricce,
      addOrEdit,
    },
    mixins: [searchHistoryMixin, paginationMixin],
    data() {
      return {
        subTitle:"",
        showAddOrEditFlag:false,
        row:{},
        showCloseBtn:false,
        changeOrderDetial:{},
        changeOrderDetialFlag:false,
        orderSn:'',
        chargingOrderPricceData:{},
        chargingOrderPriceFlag:false,
        searchData:{},
        provinceList: [],
        labelWidth: '220px',
        tableData: [],
        templateTitle: null,
        rowId: null,
        type:'',
        total:'',
        searchSettings: [{
          label: '标题',
          name: 'keyword',
          type: 'text',
          placeholder: '输入标题',
          visible: true,
        },{
          label: '添加时间',
          name: 'datetimerange',
          type: 'daterange',
          visible: true,
        }],
      };
    },

    computed: {
    },
    created() {
      this.handleSearch()
    },
    methods: {
      delRow(id){
        this.$confirm('删除常见问题, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {
            question_id:id
          };

          this.$service.CommonproblemsDel(params).then(res => {
            if(res.data.code == 0){
              this.loadTableData();
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
            } else {
              this.$message({
                type: 'info',
                message: '删除失败'
              }); 
            }
          })
          
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
      closeAndRefresh(){
        console.dir('closeAndRefresh');
        this.loadTableData();
      },
      saveRow(row, flag){
        let titleCfg = {
          1:"添加常见问题",
          2:"编辑常见问题"
        }

        this.subTitle = titleCfg[flag];
        this.row = {};

        if(flag == 1){
          this.showAddOrEditFlag = true;
        } else {
          let params = {
            question_id: row
          };
          // 获取详情
          this.$service.CommonproblemsDetial(params).then(res => {
            if(res.data.code == 0){
              this.row = res.data.data;
              this.showAddOrEditFlag = true;
            }
          })

        }




      },

      submitCloseChargeOrderRow(){
        console.dir('submitCloseChargeOrderRow');
        if(this.remark.length <= 0){
          this.$message({
            type:'warning',
            message:'内容不能为空'
          });

          return false;
        }

        let params = {
          orderSn:this.changeOrderDetial.sn,
          remark:this.remark
        };

        this.$service.postCloseChargeOrder(params).then(res => {
          console.dir(res);

          if(res.data.code == 0){
            this.$message({
              type:'success',
              message:'操作成功'
            });

            this.showCloseBtnDetial = false;
            // 结束订单重新加载数据
            this.detialBysn(this.changeOrderDetial.sn);
          }
        })

      },
      cancelChargingOrderRow(){
        this.remark = '';
        this.showCloseBtnDetial = false;
      },

      // 结束订单
      closeChargePileOrder(row){
          this.showCloseBtnDetial = true;

      },
      refreshChargingOrderPriceDetails(){
        let params = {
          orderSn:this.orderSn
        };

        this.$service.getCharingOrderPrice(params).then(res => {
          if(res.data.code == 0){
            this.chargingOrderPricceData = this.$service.formateOnlineChargingOrderprice(res.data.data);
            this.chargingOrderPriceFlag = true;
          } else {
            console.dir('页面错');return false;
          }

        })



      },
      exportFile(){},
      showCharingOrderPrice(orderSn) {
        let params = {
          orderSn:orderSn
        };

        this.$service.getCharingOrderPrice(params).then(res => {
          if(res.data.code == 0){
            this.chargingOrderPricceData = this.$service.formateCharingOrderPrice(res.data.data);
            this.chargingOrderPriceFlag = true;
            this.orderSn = orderSn;

          } else {
            console.dir('页面错');return false;
          }

        })
      },

      handleSearch(data={}) {
        let searchData = Object.assign({}, data);
        searchData = handleSubmitSearchData(searchData);
        if (data.datetimerange && data.datetimerange.length) {
          searchData.datemin = handleDate(data.datetimerange[0],'day');
          searchData.datemax = handleDate(data.datetimerange[1], 'day');

          delete data.datetimerange;
          delete searchData.datetimerange;
        }

        this.searchData = searchData;
        this.loadTableData();
      },

      loadTableData() {
        // 加载数据
        this.searchData.page = this.page;
        this.searchData.pageSize = pageSize;

        this.$service.commonProblemsList(this.searchData).then(res => {
          let total = parseInt(res.data.data.pagination.totalCount);
          this._changePageTotal(total);

          if(total > 0){
            this.tableData = res.data.data.list;
          } else {
            this.tableData = [];
          }
          this.row = {};
          this.showAddOrEditFlag = false;
        })

      },

    }
  };
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
  .eltooltip{
    width: 200px;
  }
</style>
