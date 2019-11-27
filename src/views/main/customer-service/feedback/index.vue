@@ -0,0 +1,255 @@
<template>
  <div id="advertisingManager">
    <el-card class="table-box">
      <div slot="header">
        <v-search :searchSettings="searchSettings" @search="handleSearch" labelWidth="120px">
        </v-search>
      </div>
      <div class="car-summary table-operator">
        <ul>
          <li> 共有数据：{{total}}条 </li>
        </ul>
      </div>

      <div class="table-container">
        <el-table :data="tableData" height="100%">
          <el-table-column prop="userId" label="用户编号" min-width="100"></el-table-column>
          <el-table-column prop="userPhone" label="用户手机号" min-width="160"></el-table-column>
          <el-table-column prop="msgContent" label="反馈内容" min-width="160">
            <template slot-scope="scope">
              <div v-if="scope.row.msgContent" style="white-space:nowrap">
                <p v-if="scope.row.msgContent.length < 10">{{scope.row.msgContent}}</p>
                <el-tooltip placement="top" v-else>
                  <div slot="content" class="tooltip-content">{{htmlDecode(scope.row.msgContent)}}</div>
                  <p>{{htmlDecode(scope.row.msgContent).substr(0, 10)}}...</p>
                </el-tooltip>
              </div>
              <div v-else>-</div>
            </template>
          </el-table-column>
          <el-table-column label="反馈时间" min-width="160">
            <template slot-scope="scope">
              <div>{{ formatDateTime(scope.row.msgTime) }}</div>
            </template>

          </el-table-column>
          <el-table-column prop="handleStatus" label="处理状态" min-width="160"></el-table-column>

          <el-table-column fixed="right" label="备注" width="100">
            <template slot-scope="scope">
              <el-button  v-if="scope.row.handleStatus !== '已处理'" @click="addNote(scope.row)" type="text" size="small">备注</el-button>
              <el-button  v-else @click="addNote(scope.row)" type="text" size="small">备注</el-button>
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
import popSwitch from '@/components/pop-switch'
import formGenerator from '@/components/formGenerator'
import websiteSelect from '@/components/website-select'
import vPage from '@/components/page'
import searchHistoryMixin from '@/mixins/search-history.js'
import paginationMixin from '@/mixins/pagination.js'
import {handleSubmitSearchData} from '@/utils/common.js'
import { handleDate } from '@/utils/date-filter'

export default {
  name: 'feedback',
  components: {
    vPage,
    formGenerator,
    websiteSelect,
    popSwitch
  },
  mixins: [searchHistoryMixin, paginationMixin],
  data() {
    return {
      searchData: {},
      provinceList: [],
      labelWidth: '220px',
      tableData: [],
      templateTitle: null,
      rowId: null,
      type: '',
      total: '',
      searchSettings: [{
        label: '关键字',
        name: 'keyword',
        type: 'text',
        placeholder: '输入用户手机号',
        visible: true,
        data: []
      }, {
        label: '城市',
        name: 'cityId',
        type: 'city',
        visible: true
      }, {
        label: '处理状态',
        name: 'handleStatus',
        type: 'select',
        visible: false,
        placeholder: '不限',
        options: [
          {
            value: 0,
            label: '待处理'
          },
          {
            value: 1,
            label: '已处理'
          }
        ]
      }, {
        label: '反馈日期范围',
        name: 'datetimerange',
        type: 'daterange',
        visible: false
      }]
    }
  },

  computed: {
  },
  created() {
    this.loadTableData()
  },
  methods: {
    formatDateTime(inputTime, type = 'all') {
      inputTime *= 1000

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
      if (type == 'ymd') {
        return y + '-' + m + '-' + d
      } else {
        return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second
      }
    },

    addNote(data) {
      let idfeedback = data.feedbackId
      let msg = data.remark

      this.$prompt('填写备注信息', '备注', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: msg
      }).then(({ value }) => {
        let params = {}
        params.remark = value
        params.feedback_id = idfeedback

        this.$service.saveUerFeedbackRemark(params).then(res => {
          if (res.data.code == 0) {
            this.$message({
              type: 'success',
              message: '添加备注成功'
            })

            this.loadTableData()
          } else {
            this.$message({
              type: 'info',
              message: '添加备注失败' + res.data.msg
            })

            this.loadTableData()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        })
      })
    },
    htmlDecode(str) {
      // 一般可以先转换为标准 unicode 格式（有需要就添加：当返回的数据呈现太多\\\u 之类的时）
      str = unescape(str.replace(/\\u/g, '%u'))
      // 再对实体符进行转义
      // 有 x 则表示是16进制，$1 就是匹配是否有 x，$2 就是匹配出的第二个括号捕获到的内容，将 $2 以对应进制表示转换
      str = str.replace(/&#(x)?(\w+);/g, function($, $1, $2) {
        return String.fromCharCode(parseInt($2, $1 ? 16 : 10))
      })

      return str
    },
    handleSearch(data) {
      this.page = 1
      let searchData = Object.assign({}, data)

      searchData = handleSubmitSearchData(searchData)
      if (data.datetimerange && data.datetimerange.length) {
        searchData.dateStart = handleDate(data.datetimerange[0], 'day')
        searchData.dateEnd = handleDate(data.datetimerange[1], 'day')

        delete data.datetimerange
        delete searchData.datetimerange
      }

      if (data.handleStatus == 0) {
        searchData.handleStatus = 0
      }

      this.searchData = searchData
      this.loadTableData()
    },
    handleProcess(data, type) {
      this.type = type
    },
    loadTableData() {
      // 数据查询
      this.$service.getFeedbackList(this.page, this.searchData).then(res => {
        let rows = res.data.data.rows
        let total = res.data.data.total
        rows = this.formateRow(rows)
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
