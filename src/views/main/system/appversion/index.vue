@@ -0,0 +1,255 @@
<template>
  <div id="advertisingManager">
    <el-card class="table-box">
      <div slot="header">
        <v-search ref="search"
                  :searchSettings="searchSettings"
                  @search="handleSearch"
                  labelWidth="120px"></v-search>
      </div>
      <div class="table-operator">
        <el-button size="small"
                   type="primary"
                   @click="addRow({})">添加版本</el-button>
      </div>

      <div class="table-container">
        <el-table :data="tableData"
                  height="100%">
          <el-table-column prop="app_version_id"
                           label="编号"
                           min-width="100"></el-table-column>
          <el-table-column prop="app_type_txt"
                           label="app类型"
                           min-width="120"></el-table-column>
          <el-table-column label="app显示版本号"
                           prop="app_show_version_number"
                           min-width="120"></el-table-column>
          <el-table-column prop="app_version_number"
                           label="升级对应版本号"
                           min-width="120"></el-table-column>
          <el-table-column prop="is_force_update_txt"
                           label="是否强制更新"
                           min-width="120"></el-table-column>
          <el-table-column prop="is_file_txt"
                           label="是否文件"
                           min-width="120px"></el-table-column>
          <el-table-column prop="app_version_description"
                           label="版本描述"
                           min-width="240">
            <template slot-scope="scope">
              <el-tooltip v-if="scope.row.app_version_description"
                          placement="top">
                <div slot="content"
                     v-html="scope.row.app_version_description_txt"></div>
                <p v-if="scope.row.app_version_description.length > 30"
                   v-html="scope.row.app_version_description.substr(0,30)+'...'"></p>
                <p v-else
                   v-html="scope.row.app_version_description"></p>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="app_version_status_txt"
                           label="版本状态"
                           min-width="120"></el-table-column>
          <el-table-column prop="created_on"
                           label="添加时间"
                           min-width="170"></el-table-column>
          <el-table-column fixed="right"
                           label="操作"
                           min-width="160">
            <template slot-scope="scope">
              <el-button @click="addRow(scope.row)"
                         type="text">编辑</el-button>
              <el-button @click="deleteRow(scope.row)"
                         type="text">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div classclass='table-page'>
        <el-pagination :current-page="page"
                       :page-size="pageSize"
                       layout="total, prev, pager, next"
                       :total="pageTotal"
                       @current-change="_handlePageChange">
        </el-pagination>
      </div>

    </el-card>

    <el-dialog title="删除确认"
               :visible.sync="deleteRowFlag"
               width="30%"
               center>
      <span>确定删除该版本么</span>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="deleteRowFlag = false">取 消</el-button>
        <el-button type="primary"
                   @click="deleteRowConfirm">确 定</el-button>
      </span>
    </el-dialog>

    <v-page :visible.sync="addRowFlag">
      <h3 slot="title">{{nameTitle}}</h3>
      <template slot="content">
        <add-workorder :formData="item"
                       @closeAndRefresh="closeAndRefresh"
                       :apiurl="apiurl"></add-workorder>
      </template>
    </v-page>

  </div>
</template>
<script>
import searchHistoryMixin from '@/mixins/search-history.js'
import paginationMixin from '@/mixins/pagination.js'
import { handleDate } from '@/utils/date-filter'
import { pageSize } from '@/config/page-config.js'
import addWorkorder from './components/add-workorder'

export default {
  name: 'appversion',
  components: {
    addWorkorder
  },
  mixins: [searchHistoryMixin, paginationMixin],
  data() {
    return {
      apiurl: '',
      nameTitle: '添加版本',
      addRowFlag: false,
      deleteRowFlag: false,
      workorder: {},
      addWorkOderFlag: false,
      item: {},
      obj: '',
      searchData: {},
      labelWidth: '220px',
      tableData: [],
      templateTitle: null,
      rowId: null,
      type: '',
      total: '',
      searchSettings: [
        {
          label: '搜索',
          name: 'keyword',
          type: 'text',
          visible: true,
          placeholder: '请输入版本号'
        },
        {
          label: 'app类型',
          name: 'app_type',
          type: 'select',
          visible: true,
          placeholder: '全部',
          options: [
            {
              value: '1',
              label: '用车iOS'
            },
            {
              value: '2',
              label: '用车Android'
            },
            {
              value: '3',
              label: '车服iOS'
            },
            {
              value: '4',
              label: '车服Android'
            }
          ]
        },
        {
          label: '版本状态',
          name: 'app_version_status',
          type: 'select',
          visible: false,
          placeholder: '全部',
          options: [
            {
              value: '1',
              label: '启用'
            },
            {
              value: '0',
              label: '禁用'
            }
          ]
        },
        {
          label: '添加时间',
          name: 'datetimerange',
          type: 'daterange',
          visible: false
        }
      ]
    }
  },
  watch: {},
  computed: {},
  created() {
    this.loadTableData()
  },
  methods: {
    addRow(item = {}) {
      if (JSON.stringify(item) !== '{}') {
        this.apiurl = 'edit'
        this.nameTitle = '编辑版本'
      } else {
        this.apiurl = 'add'
        this.nameTitle = '添加版本'
      }

      this.addRowFlag = true
      this.item = item
    },
    deleteRowConfirm() {
      let params = {
        app_version_id: this.item['app_version_id']
      }
      this.$service.deleteRow(params).then(res => {
        if (res.data.data.code) {
          this.$message.success('删除成功')
          this.deleteRowFlag = false
          this.loadTableData()
        } else {
          this.deleteRowFlag = false
          this.$message.warning('删除失败，重新操作')
        }
      })

      // todo 删除接口 删除成功刷新页面
      this.loadTableData()
    },
    closeAndRefresh() {
      // 结束反馈关闭窗口刷新页面
      this.addRowFlag = false
      this.loadTableData()
    },
    deleteRow(item) {
      // 当前操作的数据暂存
      this.item = item
      this.deleteRowFlag = true
    },
    handleSearch(data) {
      let searchData = Object.assign({}, data)

      if (data.datetimerange && data.datetimerange.length) {
        searchData.datemin = handleDate(data.datetimerange[0], 'day')
        searchData.datemax = handleDate(data.datetimerange[1], 'day')
        delete data.datetimerange
        delete searchData.datetimerange
      }
      this.searchData = searchData

      this.page = 1

      this.loadTableData()
    },
    loadTableData() {
      // 数据查询
      this.searchData.page = this.page
      this.searchData.pageSize = pageSize

      this.$service.appVersionList(this.searchData).then(res => {
        let rows = res.data.data.list
        let total = parseInt(res.data.data.total)
        if (total) {
          this.tableData = this.$service.formAppversionRows(rows)
        } else {
          this.tableData = []
        }

        this.total = total
        this._changePageTotal(total)
      })
    }
  }
}
</script>
<style lang="scss">
.el-form-item__label {
  width: 100px;
}
</style>
