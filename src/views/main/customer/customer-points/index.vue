<template>
  <div id="customer-points">
    <el-card class="table-box">

      <div slot="header">
        <v-search :searchSettings="searchSettings" ref="searchForm" @search="handleSearch" :labelWidth="labelWidth" @subjectChange="handleSubjectChange">
          <template slot="filter" slot-scope="scope">
            <el-cascader :options="options" v-model="scope.model.filter" change-on-select></el-cascader>
          </template>
        </v-search>
      </div>

      <div class="table-operator">
        <span style="margin-right:30px">积分合计：{{pointTotal}}</span>
        <span style="margin-right:30px">积分收入：{{pointInc}}</span>
        <span>积分支出：-{{pointDec}}</span>
      </div>

      <div class="table-container">
        <el-table :data="tableData" height="100%">
          <el-table-column prop="recordSn" label="积分记录编号" show-overflow-tooltip min-width="150px"></el-table-column>
          <el-table-column label="用户信息" min-width="130px">
            <template slot-scope="scope">
              <div>
                <div>{{scope.row.userName}}</div>
                <el-button type="text" style="padding:0" @click="handleUserDetails(scope.row.userId)">{{scope.row.userPhone}}</el-button>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="actionName" label="积分科目" min-width="120px"></el-table-column>
          <el-table-column prop="scoreChange" label="积分值" min-width="100px">
            <template slot-scope="scope">
              <span v-if="scope.row.incDecType=='DEC'">-</span>
              {{scope.row.scoreChange}}
            </template>
          </el-table-column>
          <el-table-column prop="scoreBefore" label="变更前积分" min-width="120px"></el-table-column>
          <el-table-column prop="score" label="变更后积分" min-width="120px"></el-table-column>
          <el-table-column prop="cityNameBelongTo" label="所属城市" min-width="120px"></el-table-column>
          <el-table-column prop="cityName" label="注册城市" min-width="120px"></el-table-column>
          <el-table-column label="积分变更时间" min-width="180px">
            <template slot-scope="scope">
              {{scope.row.createdTime | timeFilter}}
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注" min-width="120px"></el-table-column>
        </el-table>
      </div>

      <div class='table-page'>
        <el-pagination :current-page="page" :page-size="pageSize" layout="total, prev, pager, next" :total="pageTotal" @current-change="_handlePageChange">
        </el-pagination>
      </div>

      <v-customer-details :userId="userId" :btnVisible="btnVisible" :visible.sync="userDetailVisible" @closePage="closePage" @update="update"></v-customer-details>
    </el-card>
  </div>
</template>
<script>
import vCustomerDetails from '../../customer/customer-list/components/customer-details'
import searchSettings from './components/searchSettings.js'
import searchHistoryMixin from '@/mixins/search-history.js'
import paginationMixin from '@/mixins/pagination.js'

export default {
  name: 'customerPoints',
  components: {
    vCustomerDetails
  },
  mixins: [searchHistoryMixin, paginationMixin],
  props: ['params'],
  data() {
    return {
      labelWidth: '130px',
      searchData: {},
      tableData: [],
      searchSettings: searchSettings,
      // 用户信息
      userId: null,
      userDetailVisible: false,
      btnVisible: true,
      // 积分科目
      subjectList: [],
      // 积分合计
      pointTotal: '-',
      // 积分收入
      pointInc: '-',
      // 积分支出
      pointDec: '-'
    }
  },
  created() {
    this.$service.getCustomerPointsSubject().then(res => {
      let subjectList = res.data.data.map(item => {
        return {
          label: item.actionCodeTypeText,
          value: item.actionCodeType,
          type: item.actionCodeIncDecType
        }
      })
      this.subjectList = subjectList
      this.$refs.searchForm.setSelectData('actionCodes', subjectList)
    })
    this.loadTableData()
  },
  mounted() {
    this.handleParamsChange()
  },
  watch: {
    params() {
      this.handleParamsChange()
    }
  },
  methods: {
    /**
     * 积分科目可以与积分收支状态进行级联关联
     * 收支状态为全部时，可选择积分科目中的所有科目；
     * 收支状态为收入时，只能选择收入科目中的选项
     * 收支状态为支出时，只能选择支出科目中的选项
     */
    handleSubjectChange(data) {
      console.log('====data====', data)
      if (data) {
        this.$refs.searchForm.setItemData('actionCodes', [])
        this.$refs.searchForm.setSelectData(
          'actionCodes',
          this.subjectList.filter(item => item.type == data)
        )
      } else {
        this.$refs.searchForm.setSelectData('actionCodes', this.subjectList)
      }
    },
    handleParamsChange() {
      if (this.params && this.params.userPhone) {
        this.searchData.userPhone = this.params.userPhone
        this.searchData.cityId = this.params.cityId
        this.$refs.searchForm.onReset()
        this.searchSettings.find(
          item => item.name == 'selectCity'
        ).optionValue =
          'cityId'
        this.$nextTick(() => {
          this.$refs.searchForm.setItemData({
            selectText: this.params.userPhone,
            selectCity: this.params.cityId
          })
        })
        this.loadTableData()
        this.userDetailVisible = false
      }
    },
    handleSearch(searchData) {
      console.log('====searchData====', searchData)
      if (searchData.cityId) {
        searchData.cityType = 'register'
      } else if (searchData.cityIdBelongTo) {
        searchData.cityId = searchData.cityIdBelongTo
        searchData.cityType = 'belongTo'
        delete searchData.cityIdBelongTo
      }
      this.searchData = searchData
      this.page = 1
      this.loadTableData()
    },
    getPointStatistics(params) {
      this.pointTotal = '-'
      this.pointInc = '-'
      this.pointDec = '-'
      this.$service.getPointStatistics(params).then(res => {
        console.log('====res====', res)
        let result = res.data.data
        this.pointTotal = result.total
        this.pointInc = result.incTotal
        this.pointDec = result.decTotal
      })
    },
    loadTableData() {
      let params = {
        page: this.page,
        pageSize: this.pageSize,
        ...this.searchData
      }
      console.log(params)
      this.$service.getCustomerPointsList(params).then(res => {
        this.tableData = res.data.data.records
        this._changePageTotal(res.data.data.totalElements)
      })
      this.getPointStatistics(params)
      // this.tableData = [{
      //   sn: 'UI201809071354121064',
      //   userName: '测试',
      //   userPhone: '15837185683',
      //   subject: '成功支付订单',
      //   pointsStatus: '支出',
      //   pointsBefore: '30',
      //   modifiedTime: '',
      //   pointsAfter: '165',
      //   cityName: '郑州市',
      //   remark: '哈哈哈哈哈哈'
      // }]
    },
    // 查看用户详情
    handleUserDetails(userId) {
      console.log(userId)
      this.userId = userId
      this.userDetailVisible = true
    },
    closePage() {
      this.loadTableData()
    },
    update(userId) {
      this.getDetails(userId)
    }
  }
}
</script>
<style lang="scss">
</style>
