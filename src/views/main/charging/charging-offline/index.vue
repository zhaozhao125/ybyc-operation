@@ -0,0 +1,255 @@
<template>
  <div id="advertisingManager">
    <el-card class="table-box">
      <div slot="header">
        <v-search :searchSettings="searchSettings" @search="handleSearch" labelWidth="120px">
        </v-search>
      </div>

      <div class="table-container">
        <el-table :data="tableData" height="100%">
          <el-table-column label="桩编号" prop="equipmentSn"></el-table-column>
          <el-table-column label="类别" prop="logType">
            <template slot-scope="scope">
              <el-tooltip v-if="scope.row.logType == '故障'" placement="top">
                <div slot="content" v-html="scope.row.errorCode"></div>
                <p v-if="scope.row.logType.length > 10" v-html="scope.row.logType.substr(0,10)+'...'" ></p>
                <p v-else v-html="scope.row.logType"></p>
              </el-tooltip>
              <div v-else>{{scope.row.logType}}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作时间" prop="createdDate"></el-table-column>
        </el-table>
      </div>

      <div class='table-page'>
        <el-pagination :current-page="page" :page-size="pageSize" layout="total, prev, pager, next" :total="pageTotal" @current-change="_handlePageChange">
        </el-pagination>
      </div>

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

export default {
  name: 'charging-offline-index',
  components: {
    vPage,
    formGenerator,
    websiteSelect,
    popSwitch,
  },
  mixins: [searchHistoryMixin, paginationMixin],
  data() {
    return {
      searchData: {},
      labelWidth: '220px',
      tableData: [],
      type: '',
      total: '',
      searchSettings: [{
        label: '桩编号',
        name: 'equipmentSn',
        type: 'text',
        placeholder: '请输入',
        visible: true,
      }, {
        label: '类别',
        name: 'logType',
        type: 'select',
        visible: true,
        options: [
          {
            value: '',
            label: '不限'
          },
          {
            value: 'offline',
            label: '离线'
          },
          {
            value: 'online',
            label: '上线'
          },
          {
            value: 'error',
            label: '故障'
          }, {
            value: 'error_recover',
            label: '故障恢复'
          },
        ]
      }, {
        label: '发生时间',
        name: 'createdDate',
        type: 'daterange',
        visible: false,
      },

      ],
    }
  },

  computed: {
  },
  created() {
    this.handleSearch()
  },
  methods: {
    handleSearch(data = {}) {
      this.page = 1
      let searchData = Object.assign({}, data)
      searchData = handleSubmitSearchData(searchData)
      if (data.createdDate && data.createdDate.length) {
        searchData.startTime = handleDate(data.createdDate[0], 'day')
        searchData.endTime = handleDate(data.createdDate[1], 'day')

        delete data.createdDate
        delete searchData.createdDate
      }

      this.searchData = searchData
      this.loadTableData()
    },

    loadTableData() {
      // 加载数据
      this.searchData.page = this.page
      this.$service.getchargingOffline(this.searchData).then(res => {
        let total = res.data.data.totalElements
        this._changePageTotal(total)
        if (total > 0) {
          this.tableData = this.$service.formateChargingOrderList(res.data.data.records)
        } else {
          this.tableData = []
        }
      })
    },

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
