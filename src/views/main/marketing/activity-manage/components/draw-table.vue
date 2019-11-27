<template>
  <div>

      <v-search :searchSettings="searchSettings" @search="handleSearchData" @handleReset="handleReset" labelWidth="120px">
      </v-search>
    <br>
    <el-table :data="drawData.records" style="width: 100%">
      <el-table-column prop="code" label="优惠券编码" min-width="150"></el-table-column>
      <el-table-column prop="couponsName" label="优惠券名称" min-width="200"></el-table-column>
      <el-table-column label="用户信息" min-width="120">
        <template slot-scope="scope">
          {{scope.row.userName}}<br>
          {{scope.row.userPhone}}
        </template>
      </el-table-column>
      <!--<el-table-column prop="userName" label="姓名"></el-table-column>-->
      <!--<el-table-column prop="userPhone" label="手机号" min-width="130"></el-table-column>-->
      <el-table-column label="优惠券状态" min-width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.isUsed == 0">未使用</span>
          <el-tooltip v-else-if="scope.row.isUsed == 1" class="item" effect="dark" :content="scope.row.addTime" placement="top">
            <span>已使用</span>
          </el-tooltip>
          <span v-else-if="scope.row.isUsed == 2">已失效</span>
        </template>
      </el-table-column>
      <el-table-column prop="orderDiscountAmount" label="订单优惠金额" min-width="120"></el-table-column>
      <el-table-column label="领取时间" min-width="180" align="center">
        <template slot-scope="scope">
          {{scope.row.addTime}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="使用有效期" min-width="200">
        <template slot-scope="scope">
          <div v-if="scope.row.startTime">
            {{scope.row.startTime}}<br>
            {{scope.row.endTime}}
          </div>
          <div v-else>
            {{scope.row.beginDate}}<br>
            {{scope.row.expireDate}}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="发券人" min-width="140">
        <template slot-scope="scope">
          <span v-if="scope.row.voucher">{{scope.row.voucher}}</span>
          <span v-if="scope.row.acountName">({{scope.row.acountName}})</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="table-page">
      <el-pagination @current-change="handleCurrentChange" :current-page.sync="paging.page" :page-size="paging.pageSize" layout="total, prev, pager, next" :total="total"></el-pagination>
    </div>
  </div>
</template>
<script>
import { searchPage } from '@/mixins/search-page'
import { handleDate } from '@/utils/date-filter'
export default {
  name: 'draw-table',
  mixins: [searchPage],
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      drawData: {},
      searchSettings: [
        {
          label: '用户手机号',
          type: 'text',
          name: 'userPhone',
          visible: true,
          placeholder: '请输入'
        },
        {
          label: '优惠券状态',
          name: 'userCouponStatus',
          type: 'select',
          visible: true,
          options: [
            {
              label: '未使用',
              value: '0'
            },
            {
              label: '已使用',
              value: '1'
            },
            {
              label: '已失效',
              value: '2'
            }
          ]
        },
        // {
        //   label: '使用时间',
        //   visible: true,
        //   name: 'useTime',
        //   type: 'daterange',
        //   unixTime: true
        //   // 直接转成时间戳
        //   // unixTime: true
        // },
      ],
      search: {}
    }
  },
  mounted() {
    this.$nextTick(() => {
    })
  },
  computed: {
  },
  components: {
  },
  methods: {
    handleSearch() {
      let searchObj = { ...this.paging, ...this.search }
      searchObj.couponsId = this.id
      if (searchObj.useTime) {
        searchObj.useTimeBegin = searchObj.useTime[0]*1000
        searchObj.useTimeEnd = searchObj.useTime[1]*1000
      }
      this.$service.getCouponsDrawList(searchObj).then(res => {
        this.total = res.data.data.totalElements
        this.drawData = res.data.data
      })
    },
    handleSearchData(searchData) {
      this.search = Object.assign({}, searchData)
      this.handleSearch()
    },
    // 重置搜索数据
    handleReset() {
      this.searchData = {}
    }
  }
}
</script>
<style lang="scss">
</style>
