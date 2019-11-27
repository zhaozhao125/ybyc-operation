<template>
  <div id="move-record-index">
    <el-card class="table-box">
      <div slot="header">
        <v-search :searchSettings="searchSettings" @search="search"> </v-search>
      </div>
      <!-- 表格开始 -->
      <el-table :data="tableData" class="table-container" height="100%">
        <el-table-column prop="carNumber" label="车牌号" min-width="120">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="查看实时数据" placement="top">
              <el-button type="text" @click="carStatusNow(scope.row)">{{scope.row.carNumber}}</el-button>
            </el-tooltip>
          </template>

        </el-table-column>
        <el-table-column label="运维人员信息" min-width="170" show-overflow-tooltip>
          <template slot-scope="scope">
            <div>
              <span>姓名：</span>
              <span> {{scope.row.opsUserName}}</span>
            </div>
            <div>
              <span>手机号：</span>
              <span>{{scope.row.opsUserMobile}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="状态" min-width="80">
          <template slot-scope="scope">
            <div>
              <span v-if="scope.row.over">已结束</span>
              <span v-else>进行中</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="时间信息" show-overflow-tooltip min-width="180">
          <template slot-scope="scope">
            <div>
              <span>开始时间：</span>
              <span>{{scope.row.startDate |formatData}}</span>
            </div>
            <div>
              <span>结束时间：</span>
              <span>{{scope.row.endDate | formatData}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="网点信息" show-overflow-tooltip min-width="250">
          <template slot-scope="scope">
            <div>
              <span>起始网点：</span>
              <span>{{scope.row.startStationName}}</span>
            </div>
            <div>
              <span>结束网点：</span>
              <span>{{scope.row.endStationName}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="挪车距离" min-width="120">
          <template slot-scope="scope">
            <div v-if="scope.row.over">
              <!-- 挪车距离为空 显示未知 -->
              <span v-if="isNaN(scope.row.endOdo)||isNaN(scope.row.startOdo)||scope.row.endOdo===-1||scope.row.startOdo===-1">未知</span>
              <span v-else-if="scope.row.endOdo===scope.row.startOdo">小于1公里</span>
              <span v-else>{{(scope.row.endOdo-scope.row.startOdo).toFixed(1)}}km</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" min-width="120">
          <template slot-scope="scope">
            <div v-if="scope.row.remark" style="white-space:nowrap">
              <p v-if="scope.row.remark.length < 15">{{scope.row.remark}}</p>
              <el-tooltip placement="top" v-else>
                <div slot="content" class="tooltip-content">{{scope.row.remark}}</div>
                <p>{{scope.row.remark.substr(0, 15)}}...</p>
              </el-tooltip>
            </div>
            <span v-else>暂无</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" min-width="70">
          <template slot-scope="scope">
            <div style="margin-right:15px;">
              <el-button type="text" @click="historyCarTrack(scope.row)" v-if="scope.row.over">历史轨迹</el-button>
              <el-button type="text" @click="finish(scope.row)" v-else>结束</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class='table-page'>
        <el-pagination @current-change="handleCurrentChange" :current-page.sync="paging.page" :page-size="paging.pageSize" layout="total, prev, pager, next" :total="total"></el-pagination>
      </div>
    </el-card>
    <!-- 结束挪车弹出框 -->
    <el-dialog @open="openDialog" @close="closeDialog" title="结束挪车" :visible.sync="finishDialogVisible" width="500px">
      <!-- 内层弹出框 -->
      <el-dialog width="350px" title="强制结束" :visible.sync="innerVisible" append-to-body>
        <div class="inner-finish" v-loading="loadingFinishForceCar" :element-loading-text="loadingConfig.loadingText" :element-loading-spinner="loadingConfig.loadingSpinner" :element-loading-background="loadingConfig.loadingBackground">
          <p v-show="code">{{code}}</p>
          <div style="margin-top:10px;">
            <i class="el-icon-warning" style="color:red;padding-right:1px;"></i>
            <span>请确认车辆已拉手刹，熄火，车门，车窗已关闭。确定强制交车？</span>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="handleInnerCancel" size="small">取 消</el-button>
          <el-button type="primary" @click="forceFinish" size="small">强制结束</el-button>
        </div>
      </el-dialog>
      <el-form :model="ruleForm" ref="form" size="small" label-width="100px" v-loading="loadingFinishCar" :element-loading-text="loadingConfig.loadingText" :element-loading-spinner="loadingConfig.loadingSpinner" :element-loading-background="loadingConfig.loadingBackground">
        <el-form-item label="网点" prop="stationName" :rules="formRules">
          <span style="color:red">{{stationName}}</span>
          <el-button type="text" @click="setStation">设置网点</el-button>
          <span class="el-icon-loading" v-if="loadingStation"></span>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="remark" :rows="5" placeholder="请输入挪车结束备注"></el-input>
        </el-form-item>
        <el-form-item class="right-button">
          <el-button @click="cancelFinish">取 消</el-button>
          <el-button type="primary" @click="confirmFinish">确 定</el-button>
        </el-form-item>
      </el-form>
      <searchStation v-if="stationVisible" :visible.sync="stationVisible" @confirm="handleSelectStation" :carNumber='carNumber' @selectChargingStation='selectChargingStation'>
      </searchStation>
    </el-dialog>

  </div>
</template>
<script>
import loadingConfig from '@/config/loading'
import { searchPage } from '@/mixins/search-page'
import { pageSize } from '@/config/page-config'
import { handleSubmitSearchData } from '@/utils/common'
import searchHistoryMixin from '@/mixins/search-history.js'
import searchStation from '@/components/search-station/'
export default {
  name: 'move-record-index',
  mixins: [searchPage, searchHistoryMixin],
  props: ['params'],
  components: {
    searchStation
  },
  data() {
    return {
      formRules: [
        {
          required: true,
          message: '请设置网点',
          trigger: 'change'
        }
      ],
      ruleForm: {
        stationName: '' // 只做验证 不做提交
      },
      loadingStation: false,
      loadingFinishCar: false,
      loadingFinishForceCar: false,
      remark: '',
      carSn: null,
      loadingConfig: loadingConfig,
      stationName: '',
      recordId: null,
      stationVisible: false,
      finishDialogVisible: false,
      innerVisible: false,
      carNumber: '',
      code: '',
      tableData: [],
      stationId: null,
      total: 0,
      paging: {
        page: 1,
        pageSize: pageSize
      },
      searchObj: {},
      searchSettings: [
        {
          label: '搜索',
          name: 'keywords',
          type: 'autocomplete',
          placeholder: '请输入车牌号/手机号/姓名',
          visible: true,
          data: []
        }, {
          label: '城市',
          name: 'cityId',
          type: 'city',
          enableAuth: true,
          visible: true
        }, {
          label: '状态',
          name: 'over',
          type: 'select',
          options: [
            {
              label: '进行中',
              value: 'false'
            },
            {
              label: '已结束',
              value: 'true'
            }
          ]
        }
      ]
    }
  },
  watch: {
    searchData() {
      this.paging.page = 1
      this.handleSearch()
    },
    params() {
      this.paging.page = 1
      this.handleSearch()
    }

  },
  mounted() {
    // console.log(this.params)
    // if (this.params && this.params.carNumber) {
    //   return
    // }
    // this.$nextTick(() => {
    //   this.handleSearch(this.paging)
    // })
  },
  methods: {
    handleInnerCancel() {
      this.finishDialogVisible = false
      this.innerVisible = false
    },
    // 天赚到实时数据页面
    carStatusNow(data) {
      this.$store.commit('sendToTab', {
        name: 'carLocation',
        params: {
          carSn: data.carSn,
          carNumber: data.carNumber
        }
      })
    },
    // 跳转到历史轨迹页面
    historyCarTrack(data) {
      this.$store.commit('sendToTab', {
        name: 'carTrack',
        params: {
          startDate: data.startDate,
          endDate: data.endDate,
          carNumber: data.carNumber
        }
      })
    },
    // 设置网点
    handleSelectStation(data) {
      this.stationId = data.id
      this.ruleForm.stationName = data.name // 只做验证，不做提交
      this.stationName = data.name
      this.$refs.form.clearValidate()
    },
    // 设置网点
    setStation() {
      this.stationVisible = true
    },
    // 打开对话框
    openDialog() {
      this.loadingStation = true
      this.remark = ''
      this.ruleForm.stationName = ''
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
      this.$service
        .getWorkOrderStation(this.carSn)
        .then(res => {
          this.loadingStation = false
          if (!res.data.data.inStation) {
            this.ruleForm.stationName = ''
            this.stationName = '未检测到网点'
          } else {
            this.ruleForm.stationName = res.data.data.name
            this.stationName = res.data.data.name
            this.stationId = res.data.data.id
          }
        })
        .catch(error => {
          this.loadingStation = false
        })
    },
    //  关闭对话框
    closeDialog() {
      this.marker = ''
    },
    // 取消结束
    cancelFinish() {
      this.finishDialogVisible = false
    },
    // 强制结束
    forceFinish() {
      this.loadingFinishForceCar = true
      this.$service.post_moveCompleteForce({
        recordId: this.recordId,
        stationId: this.stationId,
        remark: `${this.code}情况下结束挪车`
      }).then(res => {
        this.loadingFinishForceCar = false
        // 关闭两个对话框
        this.finishDialogVisible = false
        this.innerVisible = false
        this.$message.success(res.data.msg ? res.data.msg : '强制还车成功')
        this.handleSearch()
      }).catch(error => {
        this.loadingFinishForceCar = false
        this.$message.warning(error.msg ? error.msg : '请求错误')
      })
    },
    //   完成结束
    confirmFinish() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loadingFinishCar = true
          this.$service
            .post_moveComplete({
              recordId: this.recordId,
              stationId: this.stationId,
              remark: this.remark
            })
            .then(res => {
              this.loadingFinishCar = false
              this.finishDialogVisible = false
              this.$message.success(res.data.msg)
              this.handleSearch()
            })
            .catch(error => {
              if (error.msg.substr(0, 2) === '51') {
                this.code = error.msg
                this.innerVisible = true
                this.$message.warning(error.msg)
              } else {
                this.$message.error(error.msg ? error.msg : '请求错误')
              }
              this.loadingFinishCar = false
            })
        } else {
          console.log('验证失败')
          return false
        }
      })
    },
    // 结束按钮
    finish(row) {
      this.carSn = row.carSn
      this.recordId = row.id
      this.carNumber = row.carNumber
      this.finishDialogVisible = true
    },
    handleCurrentChange(page) {
      this.paging.page = page
      this.handleSearch()
    },
    // 搜索
    search(searchObj) {
      console.log(searchObj)
      this.paging.page = 1
      this.searchObj = handleSubmitSearchData(searchObj)
      this._saveSearchHistory(searchObj.keywords, 'keywords')
      this.handleSearch()
    },
    handleSearch() {
      if (this.params && this.params.carNumber) {
        this.searchObj.keywords = this.params.carNumber
      }
      let searchObj = { ...this.paging, ...this.searchObj }
      this.$service.get_carMove(searchObj).then(res => {
        this.total = res.data.data.totalElements
        this.tableData = res.data.data.records
      })
    }
  }
}
</script>
<style lang='scss'>
#move-record-index {
  .finish-content {
    font-size: 16px;
    white-space: nowrap;
    display: flex;
    justify-content: center;
    flex-direction: column;
    > div:first-child {
      .station {
        color: red;
      }
    }
    > div:last-child {
      .mark-name {
        padding-right: 5px;
      }
      display: flex;
      margin-top: 15px;
    }
  }
}
.inner-finish {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 16px;
  > p:first-child {
    color: red;
  }
}
// 一会看
.tooltip-content {
  max-width: 300px;
  overflow: hidden;
  white-space: normal;
  word-break: break-word;
  word-wrap: break-word;
}
</style>
