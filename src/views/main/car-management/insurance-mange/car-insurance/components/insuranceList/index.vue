<template>
  <div class="insurance_list components-content">
    <el-table :data="list"
              class="table-container"
              height="100%">
      <el-table-column prop="carNumber"
                       label="车牌号"
                       show-overflow-tooltip
                       width="120">
      </el-table-column>
      <el-table-column prop="carVin"
                       label="车架号"
                       show-overflow-tooltip
                       width="180">
      </el-table-column>
      <el-table-column prop="carUseFor"
                       label="车辆类别"
                       show-overflow-tooltip
                       width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.carUseFor === 'rent'">租赁</span>
          <span v-if="scope.row.carUseFor === 'sale'">销售</span>
        </template>
      </el-table-column>
      <el-table-column prop="policyNumber"
                       label="保单号"
                       min-width="200">
        <template slot-scope="scope">
          <el-tooltip class="item"
                      effect="dark"
                      content="查看保单详情"
                      placement="top">
            <!-- <el-button type="text" @click="detailItem(scope.row.carSn)"> {{scope.row.carNumber}}</el-button> -->
            <el-button type="text"
                       @click="$emit('on-showInsurance', scope.row)">{{scope.row.policyNumber}}</el-button>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="slipStatus"
                       label="保险状态"
                       show-overflow-tooltip
                       width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.renewStatus === 'uncertain'">
            <span v-if="Number(scope.row.expirationDate) * 1000 >= Date.now()">在保</span>
            <span v-else>脱保</span>
          </span>
          <span v-if="scope.row.renewStatus === 'ignored'">不续保</span>
          <!-- <span v-if = "scope.row.renewStatus === 'confirmed'">已续保</span> -->
        </template>
      </el-table-column>
      <el-table-column prop="insurer"
                       label="保险公司"
                       show-overflow-tooltip
                       min-width="150">
      </el-table-column>
      <el-table-column prop="riskCode"
                       label="险种"
                       show-overflow-tooltip
                       width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.riskCode === 'VI'">商业险</span>
          <span v-if="scope.row.riskCode === 'CLIVTA'">交强险</span>
          <span v-if="scope.row.riskCode === 'DRIVING'">驾乘险</span>
        </template>
      </el-table-column>
      <el-table-column prop="expirationDate"
                       label="终保日期"
                       show-overflow-tooltip
                       width="130">
        <template slot-scope="scope">
          <span>{{Number(scope.row.expirationDate) | timeFilter('YYYY-MM-DD')}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="premium"
                       label="保单金额"
                       show-overflow-tooltip
                       width="120">
        <template slot-scope="scope">
          <span>￥{{scope.row.premium ? (scope.row.premium / 100).toFixed(2) : 0}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="insurant"
                       label="被保险人"
                       show-overflow-tooltip
                       width="120">
      </el-table-column>
      <el-table-column prop="address"
                       fixed="right"
                       width="200px"
                       label="操作">
        <template slot-scope="scope">
          <el-button type="text"
                     @click="$emit('on-continueInsurance', scope.row)"
                     v-if="scope.row.renewStatus === 'uncertain' && $_has('carInsuranceRenew')">续保</el-button>
          <el-button type="text"
                     @click="uninsuranceHandel(scope.row)"
                     v-if="scope.row.renewStatus === 'uncertain' && $_has('carInsuranceNotRenew')">不续保</el-button>
          <el-button type="text"
                     v-has="'carInsuranceEdit'"
                     @click="$emit('on-handelInsurance', scope.row)">编辑</el-button>
          <el-popover placement="top"
                      ref='popover5'
                      v-has="'carInsuranceDelete'"
                      v-model='scope.row.popoverShow'>
            <div>
              <h4 style="margin:10px">确定删除该车辆关联的同一保单？</h4>
              <div style="text-align: right; margin: 0">
                <el-button size="mini"
                           type="text"
                           @click="scope.row.popoverShow = false">取消</el-button>
                <el-button type="primary"
                           size="mini"
                           @click="deleteInsurance(scope.row)">确定</el-button>
              </div>
            </div>
            <div slot="reference"
                 class="name-wrapper">
              <el-button @click="scope.row.popoverShow = true"
                         type='text'>删除</el-button>
            </div>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <div class='table-page'>
      <el-pagination :current-page="params.page"
                     :page-size="params.pageSize"
                     layout="total, prev, pager, next"
                     :total="params.total"
                     @current-change="pageChange">
      </el-pagination>
    </div>
    <!-- <uninsurance-dialog ref = "uninsurance" ></uninsurance-dialog> -->
  </div>
</template>
<script>
// import uninsuranceDialog from './uninsuranceDialog'
export default {
  components: {
    // uninsuranceDialog
  },
  props: {
    list: {
      default: () => [],
      type: Array
    },
    params: {
      default: () => {
        return {}
      },
      type: Object
    }
  },
  data() {
    return {
      page: 1
    }
  },
  methods: {
    deleteInsurance(val) {
      this.$service.deleteInsurance(val.policyNumber).then(res => {
        val.popoverShow = false
        this.$message.success('删除成功')
        this.$emit('on-pageChange', this.page)
      })
    },
    pageChange(val) {
      this.page = val
      this.$emit('on-pageChange', val)
    },
    setNoInsurance(id) {
      let params = {
        id: id,
        renewStatus: 'ignored'
      }
      this.$service.noInsurance(params).then(res => {
        this.$message.success('设置不续保成功')
        this.$emit('on-pageChange', this.page)
      })
    },
    uninsuranceHandel(val) {
      this.$confirm('该车辆确定不再续保？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.setNoInsurance(val.id)
        })
        .catch(() => {})
    }
  }
}
</script>
<style lang="scss">
.insurance_list {
  tbody {
    td {
      span {
        display: inline-block;
      }
    }
  }
}
</style>
