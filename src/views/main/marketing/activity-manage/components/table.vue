<template>
    <div id="coupons-table " class="components-content">
        <!-- 详情页开始 -->
        <v-page :visible.sync="detailPage">
            <h3 slot="title">活动详情</h3>
            <template slot="content">
                <!-- 详情页组件 -->
                <v-detail :detailData="detailData" :id="id"></v-detail>
            </template>
        </v-page>
        <!-- 详情页结束 -->

      <!-- 发行列表开始 -->
      <!--<v-page :visible.sync="drawPage">-->
        <!--<h3 slot="title">发行列表</h3>-->
        <!--<template slot="content">-->
          <!--&lt;!&ndash; 发行列表组件 &ndash;&gt;-->
          <!--<drawTable :id="id"></drawTable>-->
        <!--</template>-->
      <!--</v-page>-->
      <!-- 发行列表结束 -->
        <!-- 表格开始 -->
        <el-table :data="tableData" class="table-container" height="100%">
            <el-table-column label="活动编号" min-width="130" show-overflow-tooltip>
                <template slot-scope="scope">
                    <el-button type="text" @click="detailItem(scope.row)"> {{scope.row.activity_code}}</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="activity_title" label="活动名称" show-overflow-tooltip min-width="170"></el-table-column>
          <el-table-column prop="activityStatu" label="活动状态" show-overflow-tooltip min-width="80"></el-table-column>
          <el-table-column label="领券方式" min-width="90">
          <template slot-scope="scope">
            {{rewardWayList[scope.row.reward_way]}}
          </template>
        </el-table-column>
          <el-table-column align="center" label="参与次数" min-width="55">
            <template slot-scope="scope">
              <span v-if="scope.row.join_count == 0">不限</span>
              <span v-else>{{scope.row.join_count}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="活动时间" min-width="145">
            <template slot-scope="scope">
              <span>{{scope.row.start_time}}</span><br>
              <span>{{scope.row.end_time}}</span>
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
          <el-table-column prop="forbidden" label="启用状态" min-width="80">
            <template slot-scope="scope">
              <popSwitch v-has="'activityStatusSet'" v-model="scope.row.forbidden" trueText="确定要禁用该活动吗？" falseText="确定要启用该活动吗？" @confirm="handleConfirmSwitch(scope.row)"></popSwitch>
            </template>
          </el-table-column>

            <el-table-column label="操作" fixed="right">
                <template slot-scope="scope">
                    <!--<el-button type="text" @click="editList(scope.row,2)">编辑</el-button>-->
                  <el-popover :ref="'deletePop' + scope.$index" title="" width="270" trigger="click" placement="top">
                    <el-button type="text" v-if="canDel(scope.row.start_time) && $_has('activityDel')" slot="reference">删除</el-button>
                    <P style="line-height:25px">
                      <i class="el-icon-warning" style="color:red;margin-right:5px;"></i>确定删除？</p>
                    <div style="text-align: right">
                      <el-button size="small" type="text" @click="handleCancel(scope.$index)">取消</el-button>
                      <el-button type="primary" size="mini" @click="deleteItem(scope.row.id,scope.$index)">删除</el-button>
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
      rewardWayList: {
        'H5': 'H5领券',
        'redeemCode': '兑换码领券',
        'system': '系统发放'
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
    canDel(startTime){
      let now = Date.parse(new Date());
      let start = Date.parse(new Date(startTime));
      if(now < start){
        return true
      }else{
        return false
      }
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
      this.$service.getActivityList(searchObj).then(res => {
        this.total = Number(res.data.data.pagination.totalCount)
        this.tableData = []
        this.$nextTick(()=>{
          this.tableData = res.data.data.list.map(
            (item, index) => {
              let nowTime = Date.parse(new Date());
              let startTime = Date.parse(new Date(item.start_time));
              let endTime = Date.parse(new Date(item.end_time));
              if(nowTime < startTime){
                item.activityStatu = '未开始';
              }else if(nowTime > startTime && nowTime < endTime){
                item.activityStatu = '进行中';
              }else{
                item.activityStatu = '已结束';
              }
              item.forbidden = item.forbidden == 1 ? true : false;
              return item
            }
          )
        })
      })
    },
    // 活动详情
    detailItem(row) {
      this.detailData = row
      this.$nextTick(() => {
        this.detailPage = true
      })
    },
    handleConfirmSwitch(data) {
      if (data.forbidden) {
        data.forbidden = 2
      } else {
        data.forbidden = 1
      }
      data.modifiedBy = this.$store.getters.user.username
      this.$service.switchActivityStatus(data.id, data.forbidden,data.modifiedBy).then(res => {
        this.$message({
          message: data.forbidden == 2 ? '禁用成功' : '启用成功',
          type: 'success'
        })
        this.handleSearch()
      })
    },
    // 活动参与列表
    drawItem(id) {
      this.id = id
      this.$nextTick(() => {
        this.drawPage = true
      })
    },
    // 删除活动
    deleteItem(id, index) {
      let params = {'id':id}
      this.$service.deleteActivity(params).then(res => {
        this.$message.success('删除成功')
        this.$refs['deletePop' + index].doClose()
        this.refreshTable()
      }).catch(error => {
        this.$message.warning(error.msg ? error.msg : '删除失败')
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
