<template>
    <div id="coupons-table " class="components-content">
        <!-- 详情页开始 -->
        <v-page :visible.sync="detailPage">
            <h3 slot="title">优惠券详情</h3>
            <template slot="content">
                <!-- 详情页组件 -->
                <v-detail :detailData="detailData" :id="id"></v-detail>
            </template>
        </v-page>
        <!-- 详情页结束 -->

      <!-- 发行列表开始 -->
      <v-page :visible.sync="drawPage">
        <h3 slot="title">发行列表</h3>
        <template slot="content">
          <!-- 发行列表组件 -->
          <drawTable :id="id"></drawTable>
        </template>
      </v-page>
      <!-- 发行列表结束 -->
        <!-- 表格开始 -->
        <el-table :data="tableData" class="table-container" height="100%">
            <el-table-column label="优惠券编码" min-width="110">
                <template slot-scope="scope">
                    <el-button type="text" @click="detailItem(scope.row.id)"> {{scope.row.code}}</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="优惠券名" show-overflow-tooltip min-width="150"></el-table-column>
          <el-table-column label="类型" min-width="90">
            <template slot-scope="scope">
              {{usageTypeList[scope.row.usageType]}}
            </template>
          </el-table-column>
          <el-table-column label="可用城市"  show-overflow-tooltip prop="city" min-width="120">
            <template slot-scope="scope">
              <span v-if="scope.row.city == ''">
                全部
              </span>
              <span v-else>
                {{scope.row.city}}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="可用车型"  show-overflow-tooltip prop="genre" min-width="120">
            <template slot-scope="scope">
              <span v-if="scope.row.genre == ''">
                全部
              </span>
              <span v-else>
                {{scope.row.genre}}
              </span>
            </template>
          </el-table-column>
          <!--<el-table-column label="可用车型" prop="genre" min-width="110">-->
            <!--<template slot-scope="scope">-->
              <!--<div v-if="scope.row.genre == ''">-->
                <!--全部-->
              <!--</div>-->
              <!--<div v-else v-for="item in scope.row.genre.split(',')">-->
                <!--{{item}}-->
              <!--</div>-->
            <!--</template>-->
          <!--</el-table-column>-->
          <el-table-column label="是否使用兑换码" prop="genre" min-width="110">
            <template slot-scope="scope">
              <div  v-if="scope.row.installRedeemCode">
                是
              </div>
              <div  v-else>
                否
              </div>
            </template>
          </el-table-column>
            <el-table-column label="优惠类型" min-width="110">
                <template slot-scope="scope">
                    <div v-if="scope.row.type == 1">
                      <span>现金券</span>
                      <div v-if="scope.row.useMoneyCondition == 0">
                      <span>{{scope.row.money}}元</span>
                      </div>
                      <div v-else>
                        <span>{{scope.row.money}}元（满{{scope.row.useMoneyCondition}}可用）</span>
                      </div>
                      </div>
                  <div v-else>
                    <span>折扣券</span>
                    <div v-if="scope.row.useMoneyTop == 0">
                      <span>{{scope.row.discount/10}}折</span>
                    </div>
                    <div v-else>
                      <span>{{scope.row.discount/10}}折（最高可抵{{scope.row.useMoneyTop}}元）</span>
                    </div>
                  </div>
                </template>
            </el-table-column>
          <el-table-column label="发放量/发行量" min-width="110">
            <template slot-scope="scope">
              <el-button type="text" @click="drawItem(scope.row.id)"> {{scope.row.downAmount}}/<span v-if="scope.row.amount == 0">不限</span><span v-else>{{scope.row.amount}}</span></el-button>
            </template>
          </el-table-column>
          <el-table-column label="每人限领" prop="userGainTimes" min-width="70">
            <template slot-scope="scope">
              <div v-if="scope.row.userGainTimes == 0">
                不限制
              </div>
              <div v-else>
                {{scope.row.userGainTimes}}
              </div>
            </template>
          </el-table-column>
            <el-table-column align="center" label="发行有效期" min-width="145">
                <template slot-scope="scope">
                    <span>{{scope.row.redeemStartTime}}</span><br>
                    <span>{{scope.row.redeemEndTime}}</span>
                </template>
            </el-table-column>
          <el-table-column align="center" label="使用有效期" min-width="145">
            <template slot-scope="scope">
              <div v-if="scope.row.relativeDayNum">
                {{scope.row.relativeDayNum}}天
              </div>
              <div v-else>
              <span>{{scope.row.startDate}}</span><br>
              <span>{{scope.row.endDate}}</span>
              </div>
            </template>
          </el-table-column>
            <el-table-column label="操作" fixed="right" min-width="70">
                <template slot-scope="scope">
                    <el-button type="text" v-if=" hasAuth(scope.row.cityId) && $_has('couponsEdit')" @click="editList(scope.row,2)">编辑</el-button>
                  <el-popover :ref="'deletePop' + scope.$index" title="" width="270" trigger="click" placement="top">
                    <el-button type="text" v-has="'couponsDelete'" slot="reference">删除</el-button>
                    <P style="line-height:25px">
                      <i class="el-icon-warning" style="color:red;margin-right:5px;"></i>确定删除？</p>
                    <div style="text-align: right">
                      <el-button size="small" type="text" @click="handleCancel(scope.$index)">取消</el-button>
                      <el-button type="primary" size="mini" v-has="'activityDel'" @click="deleteItem(scope.row.id,scope.$index)">删除</el-button>
                    </div>
                  </el-popover>
                </template>
            </el-table-column>
        </el-table>
        <!-- 表格结束 -->
        <div class="table-page">
            <el-pagination @current-change="handleCurrentChange" :current-page.sync="paging.page" :page-size="paging.pageSize" layout="total, prev, pager, next" :total="total"></el-pagination>
        </div>
    </div>
</template>
<script>
import vDetail from './detail'
import drawTable from './draw-table'
import { searchPage } from '@/mixins/search-page'
import websiteSelect from '@/components/website-select'
import popSwitch from '@/components/pop-switch' // 引入switch组件
import { handleDate } from '@/utils/date-filter'
export default {
  name: 'coupons-table',
  mixins: [searchPage],
  data() {
    return {
      id: '',
      usageTypeList: {
        'share': '分时',
        'shortRent': '短长租',
        'charge': '充电'
      },
      selectSiteLoading: false,
      detailPage: false,
      drawPage: false,
      detailData: {},
      successFlagBit: false,
      retList: [],
      auth: ''
    }
  },
  mounted() {
    this.$nextTick(() => {
      let ret = this.$store.getters.authedCities
      this.auth = ret[0].value
      for(let i = 0;i < ret.length;i++){
        this.retList[i] = ret[i].value+''
      }
    })
  },
  methods: {
    hasAuth(cityId){
      if(this.auth == 999){return true}
      let cityList = cityId.split(',');
      for(let j = 0;j < cityList.length;j++){
        if(this.retList.indexOf(cityList[j]+'') < 0){
          return false;
        }
      }
      return true;
    },
    refreshTable() {
      this.handleSearch()
    },
    editList(row, editNum) {
      let nowTime = Date.parse(new Date())
      if (nowTime > Date.parse(new Date(row.redeemEndTime))) {
        this.$message.warning('超过优惠券发行有效期，无法编辑')
        return false
      }
      // 转一下类型
      row.ownerId = String(row.ownerId)
      this.$emit('editorData', row, editNum, row.id)
    },
    handleSearch() {
      let searchObj = { ...this.paging, ...this.searchData }
      console.log(searchObj)
      if (searchObj.addTime) {
        searchObj.datemin = handleDate(searchObj.addTime[0], 'day')
        searchObj.datemax = handleDate(searchObj.addTime[1], 'day')
      }
      this.$service.getCouponsList(searchObj).then(res => {
        this.total = res.data.data.totalElements
        this.tableData = res.data.data.records
      })
    },
    // 优惠券详情
    detailItem(id) {
      let ID = {}
      ID.id = id
      this.$service.getCouponsInfo(ID).then(res => {
        this.detailData = res.data.data
      })
      this.$nextTick(() => {
        this.detailPage = true
      })
    },
    // 优惠券发行列表
    drawItem(id) {
      this.id = id
      this.$nextTick(() => {
        this.drawPage = true
      })
    },
    // 删除优惠券
    deleteItem(id, index) {
      this.$service.delCoupons(id).then(res => {
        this.$message.success('删除优惠券成功')
        this.$refs['deletePop' + index].doClose()
        this.refreshTable()
      }).catch(error => {
        this.$message.warning(error.msg ? error.msg : '删除优惠券失败')
        this.$refs['deletePop' + index].doClose()
      })
    },
    handleCancel(index) {
      this.$refs['deletePop' + index].doClose()
    }
  },
  components: {
    vDetail,
    websiteSelect,
    popSwitch,
    drawTable
  }
}
</script>
<style lang="scss">
#car-info-table {
  .el-switch {
    font-size: 0;
    outline: none;
  }
}
</style>
