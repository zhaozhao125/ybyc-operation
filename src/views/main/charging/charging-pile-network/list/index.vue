@@ -0,0 +1,255 @@
<template>
  <div id="advertisingManager">
    <el-card class="table-box">
      <div slot="header">
        <v-search :searchSettings="searchSettings" @search="handleSearch" labelWidth="120px">
          <template slot="stationName" slot-scope="scope">
            <div class="select-content">
              <span class="select-website-item">
                <website-select v-model="scope.model.stationName" placeholder="请输入站点名" isRequest ></website-select>
                <!-- 根据运营城市id来请求网点数据 -->
              </span>
            </div>
          </template>
        </v-search>
      </div>
      <div class="table-operator">
        <el-button
          size="small" type="primary" @click="addChargingPileNetwork({}, 1)"
          v-has="'chargingPileNetworkListAdd'"
        >添加站点</el-button>
        <el-button size="small" @click="exportFile">导出</el-button>
      </div>

      <div class="table-container">
        <el-table :data="tableData" height="100%">
          <el-table-column label="站点编号" min-width="140">
            <template slot-scope="scope">
              <el-button type="text" @click="detailItem(scope.row.id, scope.row.enabled)">{{scope.row.stationSn}}</el-button>
            </template>
          </el-table-column>
          <el-table-column label="站点名称" min-width="180">
            <template slot-scope="scope">
              <el-tooltip v-if="scope.row.stationName" placement="top">
                <div slot="content" v-html="scope.row.stationName"></div>
                <p v-if="scope.row.stationName.length > 10" v-html="scope.row.stationName.substr(0,10)+'...'" ></p>
                <p v-else v-html="scope.row.stationName"></p>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="operatorName" label="运营商" min-width="160"></el-table-column>
          <el-table-column label="城市" prop="cityName" min-width="160"></el-table-column>
          <el-table-column prop="user_feedback_problem" label="充电桩" min-width="160">
            <template slot-scope="scope">
              <div>
                <div>快充：{{scope.row.fastPileNum}}</div>
                <div>慢充：{{scope.row.slowPileNum}}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="地址" width="180">
            <template slot-scope="scope">
              <el-tooltip v-if="scope.row.address" placement="top">
                <div slot="content" v-html="scope.row.address"></div>
                <p v-if="scope.row.address.length > 10" v-html="scope.row.address.substr(0,10)+'...'" ></p>
                <p v-else v-html="scope.row.address"></p>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="createdOn" label="创建时间" min-width="180"></el-table-column>
          <el-table-column label="状态" min-width="160">
            <template slot-scope="scope">
              <popSwitch v-model="scope.row.enabled"
                trueText="确定禁止充电站吗？"
                falseText="确定要开启充电站吗？"
                 @confirm="submitChangeChargPileNetworkStatus(scope.row)"
                ></popSwitch>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" min-width="160">
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.showFun"
                type="text"
                @click="addChargingPileNetwork(scope.row, 2)"
                 v-has="'chargingPileNetworkListUpdate'"
                >编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class='table-page'>
        <el-pagination :current-page="page" :page-size="pageSize" layout="total, prev, pager, next" :total="pageTotal" @current-change="_handlePageChange">
        </el-pagination>
      </div>
    </el-card>

    <v-page :visible.sync="detailDataView">
      <h3 slot="title">充电站详情</h3>
      <template slot="content">
        <pile-detial :detailData="detailData" ></pile-detial>
      </template>
    </v-page>

    <!--添加和编辑界面-->
    <v-page :visible.sync="chargePileNewtworkFlag">
      <h3 slot="title">{{pileEditAddTitle}}</h3>
      <template slot="content">
        <pile-edit-add :detailDataFlag="detailDataFlag" :pileInfo="detailData" @closeAndRefresh='cancel' ></pile-edit-add>
      </template>
    </v-page>

  </div>
</template>
<script>
import { resultSelectData } from '@/utils/common'
import popSwitch from '@/components/pop-switch'
import formGenerator from '@/components/formGenerator'
import websiteSelect from './components/website-select'
import vPage from '@/components/page'
import searchHistoryMixin from '@/mixins/search-history.js'
import paginationMixin from '@/mixins/pagination.js'
import { handleDictData, handleSubmitSearchData } from '@/utils/common.js'
import { handleDate } from '@/utils/date-filter'
import { pageSize } from '@/config/page-config.js'
import pileDetial from './components/pileDetial'
import siteMap from '@/components/siteMap/site-map'
import pileEditAdd from './components/pileEditAdd'

export default {
  name: 'charging-pile-network-list',
  components: {
    vPage,
    formGenerator,
    websiteSelect,
    popSwitch,
    pileDetial,
    siteMap,
    pileEditAdd
  },

  mixins: [searchHistoryMixin, paginationMixin],
  data() {
    return {
      pileEditAddTitle: '',
      stationNameArr: '',
      pileInfo: {},
      detailDataFlag: 1,
      chargePileNewtworkFlag: false,
      detailPage: false,
      detailData: {},
      detailDataView: false,
      searchData: {},
      provinceList: [],
      labelWidth: '220px',
      tableData: [],
      templateTitle: null,
      rowId: null,
      type: '',
      total: '',
      searchSettings: [{
        label: '站点名称',
        name: 'stationName',
        type: 'text',
        placeholder: '请输入',
        visible: true
      }, {
        label: '运营商',
        name: 'operator',
        type: 'select',
        visible: true,
        options: [
          {
            value: '',
            label: '不限'
          }, {
            value: 'YB',
            label: '一步车电'
          }, {
            value: 'YD',
            label: '一电'
          }, {
            value: 'TLD',
            label: '特来电'
          }
        ]
      }, {
        label: '添加时间',
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
    submitChangeChargPileNetworkStatus(item) {
      // 改变充电站的状态
      let params = {
        id: item.id,
        enabled: !item.enabled
      }

      this.$service.submitChangeChargPileNetworkStatus(params).then(res => {
        this.loadTableData()
        this.$message.success('操作成功')
        // 隐藏选择网点提示
        this.showWebsite = false
      })
        .catch(() => {
          this.error('操作失败')
        })
    },
    detailItem(id, enabled) {
      // 记载对应的详情
      this.$service.getChargingPileNetworkDetial({ id: id }).then(res => {
        this.detailData = this.$service.formateChargePileNetworkDetial(res.data.data)
        this.detailData.enabled = enabled
        console.dir(this.detailData)
        this.$nextTick(() => {
          this.detailDataView = true
        })
      })
    },
    refreshTable() {
      this.loadTableData()
    },
    download(obj) {
      let len = this.tableData.length
      if (len === 0) {
        this.$message.warning('导出数据为空，请重新查询')
      } else {
        this.$service.exportChargingPilenetwork(
          obj,
          this.$store.getters.token,
          '充电站导出.xlsx'
        )
      }
    },
    exportFile() {
      console.info('exportChargingorder')
      let obj = this.searchData
      delete obj.pageSize
      delete obj.page
      this.download(obj)
    },

    addChargingPileNetwork(row = {}, flag = 1) {
      this.detailDataFlag = flag
      if (flag == 2) {
        this.pileEditAddTitle = '编辑充电站'
        this.$service.getChargingPileNetworkDetial2Edit({ id: row.id }).then(res => {
          this.detailData = this.$service.formateChargePileNetworkDetial(res.data.data)
          this.chargePileNewtworkFlag = true
        })
      } else {
        this.pileEditAddTitle = '添加充电站'
        this.chargePileNewtworkFlag = true
        this.detailData = {}
      }
    },
    cancel() {
      this.loadTableData()
      this.chargePileNewtworkFlag = false
    },
    /**
       * 获取对应的反馈问题
       * @param val
       */
    getFeedbackproblemTypes(val) {
      if (!val) {
        // 车辆对象
        val = 1
        this.obj = '车辆'
      } else {
        thhis.obj = objTxtCfg.val
      }
      console.dir(this.obj)

      let params = {
        problemType: val
      }

      this.$service.getChargePileNetworkList(params).then(res => {
        if (res.data.code == 0) {
          this.searchSettings[2].options = res.data.data
        }
      })
    },
    initShow(rows = [], total = 0) {
      // 初始化数据显示
      this.tableData = rows
      this._changePageTotal(total)
    },

    handleSearch(data) {
      this.page = 1
      let searchData = Object.assign({}, data)

      searchData = handleSubmitSearchData(searchData)
      if (data.datetimerange && data.datetimerange.length) {
        searchData.startCreatedOn = handleDate(data.datetimerange[0], 'day')
        searchData.endCreatedOn = handleDate(data.datetimerange[1], 'day')
        delete data.datetimerange
        delete searchData.datetimerange
      }

      this.searchData = searchData
      this.loadTableData()
    },

    handleProcess(data, type) {
      this.type = type
    },
    loadTableData() {
      // 数据查询
      this.searchData.page = this.page
      this.searchData.pageSize = pageSize
      this.detailDataView = false
      this.chargePileNewtworkFlag = false

      this.$service.getChargePileNetworkList(this.searchData).then(res => {
        console.dir(res)

        let rows = []
        let total = 0

        rows = this.$service.formateChargePileNetworkList(res.data.data.records)
        total = res.data.data.totalElements
        this.initShow(rows, total)
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
    },
    getSelectItemId() {
      console.dir('getSelectItemId'); return false
      if (this.stationNameArr.length == 0) {
        return false
      }
    }
  }
}
</script>
<style lang="scss">
  .el-form-item__label{
    width:100px;
  }
</style>
