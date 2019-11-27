@@ -0,0 +1,255 @@
<template>
  <div id="advertisingManager">
    <el-card class="table-box">
      <div slot="header">
        <v-search ref="search" :searchSettings="searchSettings" @search="handleSearch" labelWidth="120px">
          <template slot="problemType">
            <el-select v-model="problemTypeValue" placeholder="请选择">
              <el-option
                v-for="item in problemType"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </template>
        </v-search>
      </div>
      <div class="car-summary table-operator">
        <ul>
          <li> 共有数据：{{total}}条 </li>
        </ul>
      </div>

      <div class="table-container">
        <el-table :data="tableData" height="100%">
          <el-table-column prop="userId" label="用户信息" min-width="180">
            <template slot-scope="scope">
              <div>
                <div>{{scope.row.user_phone}}</div>
                <div>{{scope.row.user_name}}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="handel_status_txt" label="处理状态" min-width="160"></el-table-column>
          <el-table-column label="问题对象" min-width="160">
            <template>
              <div>{{obj}}</div>
            </template>
          </el-table-column>
          <el-table-column label="问题类别" prop="problem_descript" min-width="160">
            <template slot-scope="scope">
              <el-tooltip v-if="scope.row.problem_descript" placement="top">
                <div slot="content" v-html="scope.row.problem_descript"></div>
                <p v-if="scope.row.problem_descript.length > 10" v-html="scope.row.problem_descript.substr(0,10)+'...'" ></p>
                <p v-else v-html="scope.row.problem_descript"></p>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="user_feedback_problem" label="描述" min-width="160">
            <template slot-scope="scope">
              <el-tooltip v-if="scope.row.user_feedback_problem" placement="top">
                <div slot="content" v-html="scope.row.user_feedback_problem"></div>
                <p v-if="scope.row.user_feedback_problem.length > 10" v-html="scope.row.user_feedback_problem.substr(0,10)+'...'" ></p>
                <p v-else v-html="scope.row.user_feedback_problem"></p>
              </el-tooltip>
            </template>
          </el-table-column>

          <el-table-column label="图片" width="100">
            <template slot-scope="scope">
              <div>
                <el-button type="text" @click="viewImg(scope.row.imgArray)" size="small">图片</el-button>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="car_number" label="车牌号/充电桩编号" min-width="180"></el-table-column>
          <el-table-column prop="cityName" label="注册城市" min-width="120px"></el-table-column>
          <el-table-column prop="cityNameBelongTo" label="所属城市" min-width="120px"></el-table-column>
          <el-table-column prop="created_on" label="反馈时间" min-width="170"></el-table-column>
          <el-table-column fixed="right" prop="handleStatus" label="操作" min-width="160">
            <template slot-scope="scope">
              <el-button v-if="scope.row.handel_status == 1 && obj == '车辆'" @click="transferOrder(scope.row)" type="text" size="small">转工单</el-button>
              <el-button v-if="scope.row.handel_status == 1" @click="closeFeedbackpro(scope.row)" type="text" size="small">结束反馈</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class='table-page'>
        <el-pagination :current-page="page" :page-size="pageSize" layout="total, prev, pager, next" :total="pageTotal" @current-change="_handlePageChange">
        </el-pagination>
      </div>
    </el-card>

    <el-dialog :visible.sync='closeFeedbackproViewFlag' :title='closeFeedbackproTitle' width='35%' v-if="closeFeedbackproViewFlag">
      <close-feedbackpro @closePage="closePage" @closeAndRefresh="closeAndRefresh" :formData="item"></close-feedbackpro>
    </el-dialog>

    <addWorkorder :visible.sync="addWorkOderFlag" :formData="item" @success="handleCreateSuccess" v-if="addWorkOderFlag" @closeAndRefresh="closeAndRefresh"></addWorkorder>
  </div>
</template>
<script>
import searchHistoryMixin from '@/mixins/search-history.js'
import paginationMixin from '@/mixins/pagination.js'
import { handleDate } from '@/utils/date-filter'
import { pageSize } from '@/config/page-config.js'
import imgViewer from '@/components/img-viewer/'
import closeFeedbackpro from './components/close-feedbackpro'
import addWorkorder from './components/add-workorder'

export default {
  name: 'feedbackproblem',
  components: {
    closeFeedbackpro,
    addWorkorder
  },
  mixins: [searchHistoryMixin, paginationMixin],
  data() {
    return {
      workorder: {},
      addWorkOderFlag: false,
      item: {},
      closeFeedbackproTitle: '结束反馈',
      closeFeedbackproViewFlag: false,
      obj: '',
      problemTypeValue: '车辆',
      problemType: [{
        value: '1',
        label: '车辆'
      }, {
        value: '2',
        label: '充电桩'
      }],
      searchData: {
        problemType: 1
      },
      provinceList: [],
      labelWidth: '220px',
      tableData: [],
      templateTitle: null,
      rowId: null,
      type: '',
      total: '',
      searchSettings: [{
        label: '处理状态',
        name: 'handel_status',
        type: 'select',
        visible: true,
        placeholder: '不限',
        options: [
          {
            value: 1,
            label: '待处理'
          },
          {
            value: 3,
            label: '已处理'
          }
        ]
      }, {
        label: '问题对象',
        name: 'problemType',
        type: 'slot',
        visible: true,
        options: [{
          value: 1,
          label: '车辆'
        },
        {
          value: 2,
          label: '充电桩'
        }
        ]
      }, {
        label: '问题类型',
        name: 'user_feedback_problem_category_id',
        type: 'select',
        visible: false,
        options: []
      }, {
        label: '反馈日期范围',
        name: 'datetimerange',
        type: 'daterange',
        visible: false
      }]
    }
  },
  watch: {
    'problemTypeValue': {
      handler: function (val, oldVal) {
        if (val) {
          if (val == '车辆' || val == 1) {
            val = 1
            this.obj = '车辆'
          } else {
            this.obj = '充电桩'
          }
          this.getFeedbackproblemTypes(val)
          this.page = 1
          this.loadTableData()
        }
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
  },
  created() {
    this.loadTableData()
  },
  methods: {
    closeAndRefresh() {
      // 结束反馈关闭窗口刷新页面
      this.closeFeedbackproViewFlag = false
      this.loadTableData()
    },
    transferOrder(item) {
      console.dir('转工单')

      this.addWorkOderFlag = true
      this.item = item
    },
    closeFeedbackpro(item) {
      this.closeFeedbackproViewFlag = true
      item.obj = this.obj
      this.item = item
    },

    viewImg(imgData) {
      imgViewer.viewImg(imgData)
    },
    /**
       * 获取对应的反馈问题
       * @param val
       */
    getFeedbackproblemTypes(val) {
      if (!val) {
        // 车辆对象
        val = 1
        this.searchData.problemType = 1
      } else {
        this.searchData.problemType = val
      }
      let params = {
        problemType: val
      }
      console.dir(this.searchSettings)

      this.$service.getFeedbackproblemTypes(params).then(res => {
        this.searchSettings[2].options = []
        this.$refs.search.formModel.user_feedback_problem_category_id = ''

        if (res.data.code == 0) {
          this.searchSettings[2].options = res.data.data
        }
      })
    },

    handleSearch(data) {
      this.page = 1
      let searchData = Object.assign({}, data)

      if (data.datetimerange && data.datetimerange.length) {
        searchData.datemin = handleDate(data.datetimerange[0], 'day')
        searchData.datemax = handleDate(data.datetimerange[1], 'day')
        delete data.datetimerange
        delete searchData.datetimerange
      }

      this.searchData = searchData

      if (this.problemTypeValue != 1 && this.problemTypeValue != '车辆') {
        this.obj = '充电桩'
        this.searchData.problemType = 2
      } else {
        this.obj = '车辆'
        this.searchData.problemType = 1
      }

      this.loadTableData()
    },

    handleProcess(data, type) {
      this.type = type
    },

    loadTableData() {
      // 数据查询
      this.searchData.page = this.page
      this.searchData.pageSize = pageSize

      this.$service.getFeedbackProblemList(this.searchData).then(res => {
        let rows = res.data.data.list
        console.dir(rows)
        let total = parseInt(res.data.data.pagination.totalCount)
        this.tableData = rows
        this.total = total
        this._changePageTotal(total)
      })
    },
    formateContent(data) {
      return data
    },
    // 格式化数据
    formateRow(rows) {
      let statuscfg = {
        0: '待处理',
        1: '已处理'
      }

      let appTypecfg = {
        1: '租车',
        2: '充电桩'
      }

      let length = rows.length
      for (let i = 0; i < length; i++) {
        rows[i].handleStatus = statuscfg[rows[i].handleStatus]
        rows[i].appType = !isNaN(appTypecfg[rows[i].appType]) ? '其他' : appTypecfg[rows[i].appType]
      }
      return rows
    }
  }
}
</script>
<style lang="scss">
  .el-form-item__label{
    width:100px;
  }
</style>
