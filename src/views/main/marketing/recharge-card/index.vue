<template>
  <div class="recharge-card">
    <el-card class="table-box">
      <div slot="header">
        <v-search :searchSettings="searchSettings" labelWidth="145px" @search="handleSearch" @reset="handleReset"></v-search>
      </div>
      <div class="table-operator">
        <el-button type="primary" size="small" @click="handleRechargeCard">添加充值卡</el-button>
      </div>
      <div class="table-container">
        <el-table :data="tableData" height="100%">
          <el-table-column prop="batchNum" label="充值卡批次号" min-width="120">
            <template slot-scope="scope">
              <el-button type="text" @click="handleShowDetail(scope.row.id)">{{scope.row.batchNum}}</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="充值卡名称" min-width="150"></el-table-column>
          <el-table-column prop="faceValue" label="面值" min-width="120"></el-table-column>
          <el-table-column prop="useCountLimit" label="每人使用次数" min-width="120">
            <template slot-scope="scope">
              <span v-if="scope.row.useCountLimit > 0">{{scope.row.useCountLimit}}</span>
              <span v-else>不限制</span>
            </template>
          </el-table-column>
          <el-table-column prop="cityPermitNames" label="用户所属城市" show-overflow-tooltip min-width="140">
            <template slot-scope="scope">
              <span v-if="scope.row.cityPermitNames">{{scope.row.cityPermitNames}}</span>
              <span v-else>全部</span>
            </template>
          </el-table-column>
          <el-table-column label="使用量/发行量" min-width="130">
            <template slot-scope="scope">
              <el-button type="text" @click="handleShowSendingList(scope.row.id)">
                {{scope.row.useNumber}}/{{scope.row.issueNumber}}</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="createOn" label="添加时间" min-width="170">
            <template slot-scope="scope">
              {{scope.row.createOn | timeFilter}}
            </template>
          </el-table-column>
          <el-table-column prop="couldUse" label="状态" min-width="120px">
            <template slot-scope="scope">
              <popSwitch v-model="scope.row.couldUse" trueText="确定禁用该充值卡么？" falseText="确定启用该充值卡么？" @confirm="handleConfirmSwitch(scope.row)" @cancel="handleCancelSwitch"></popSwitch>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" min-width="100px">
            <template slot-scope="scope">
              <el-button class="el-button--text" type="text" @click="handleRechargeCard(scope.row)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="table-page">
        <el-pagination :current-page="page" :page-size="pageSize" layout="total, prev, pager, next" :total="pageTotal" @current-change="_handlePageChange">
        </el-pagination>
      </div>
    </el-card>
    <v-page :visible.sync="sendingListVisible">
      <h3 slot="title">发行列表</h3>
      <v-sending-list slot="content" :prepaidCardId="prepaidCardId"></v-sending-list>
    </v-page>
    <recharge-card-editor :visible.sync="editorVisible" :formData="formData" @close="close"></recharge-card-editor>
    <recharge-card-detail :visible.sync="detailVisible" :prepaidCardId="prepaidCardId" @close="close"></recharge-card-detail>
  </div>
</template>

<script>
import searchSettings from './components/searchSettings.js'
import paginationMixin from '@/mixins/pagination.js'
import popSwitch from '@/components/pop-switch'
import vSendingList from './components/sending-list'
import rechargeCardEditor from './components/edit/recharge-card-editor'
import rechargeCardDetail from './components/detail/recharge-card-detail'

export default {
  name: 'rechargeCard',

  mixins: [paginationMixin],

  components: {
    popSwitch,
    vSendingList,
    rechargeCardEditor,
    rechargeCardDetail
  },
  data() {
    return {
      sendingListVisible: false,
      searchSettings: searchSettings,
      tableData: [],
      searchData: null,
      editorVisible: false,
      detailVisible: false,
      prepaidCardId: null,
      formData: {}
    }
  },

  created() {
    this.loadTableData()
  },

  watch: {
    sendingListVisible(visible) {
      if (!visible) {
        this.loadTableData()
      }
    }
  },

  methods: {
    close() {
      this.loadTableData()
      this.formData = {}
    },
    handleReset() {
      this.searchData = null
    },
    handleSearch(params) {
      let searchData = Object.assign({}, params)
      if (searchData.createOn && searchData.createOn.length) {
        searchData.addStartDate = searchData.createOn[0].getTime()
        searchData.addEndDate = searchData.createOn[1].getTime()
        delete searchData.createOn
      }
      this.searchData = searchData
      this.page = 1
      this.loadTableData()
    },
    loadTableData() {
      let params = {
        page: this.page,
        rows: this.pageSize,
        ...this.searchData
      }
      this.$service.getRechargeCardList(params).then(res => {
        this.tableData = res.data.data.records
        this._changePageTotal(res.data.data.totalElements)
      })
    },
    handleConfirmSwitch(row) {
      console.log(this.$store.getters.user)
      let params = {
        id: row.id,
        couldUse: !row.couldUse,
        operator: this.$store.getters.user.username,
        operatorNickName: this.$store.getters.user.cnName
      }
      this.$service
        .switchRecahrgeCardStatus(params)
        .then(res => {
          if (res.data.code == '0') {
            // this.loadTableData()
            row.couldUse = !row.couldUse
          }
          this.$message({
            message: '操作成功',
            type: 'success'
          })
        })
    },
    handleCancelSwitch() { },
    handleRechargeCard(row) {
      let nowTime = Date.parse(new Date())
      if (nowTime > Date.parse(new Date(row.startDate))) {
        this.$message.warning('超过充值卡使用开始时间，无法编辑')
        return false
      }
      console.log(row)
      if (row.name) {
        this.formData = row
      }
      this.editorVisible = true
    },
    handleShowDetail(prepaidCardId) {
      this.detailVisible = true
      this.prepaidCardId = prepaidCardId
    },
    handleShowSendingList(prepaidCardId) {
      this.prepaidCardId = prepaidCardId
      this.sendingListVisible = true
    }
  }
}
</script>
