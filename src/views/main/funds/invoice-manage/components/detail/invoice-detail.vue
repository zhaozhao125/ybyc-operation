<template>
  <div class="invoice-detail">
    <v-page :visible.sync="visible" :before-close="closeMe">
      <div class="page-header-container" slot="title">
        <h3 slot="title">发票详情</h3>
        <template v-if="detailData && status == 'pending'">
          <el-button size="small" type="primary" @click="dialogVisible = true">处理</el-button>
        </template>
      </div>
      <div v-if="detailData" class="detail-content" slot="content">
        <detail-basic :detailSettings='detailSettings' :data="detailData" :labelWidth="labelWidth">
          <template slot="status" slot-scope="scope">
            <span v-if="status == 'pending'">待处理</span>
            <span v-if="status == 'processed'">已处理</span>
          </template>
          <template slot="relationOrders" slot-scope="scope">
            <span v-if="tableData.length == 0">暂无开票订单</span>
            <div class="table-container" v-else>
              <el-card class="table-box">
                <div class="table-container">
                  <el-table :data="tableData" min-height='100%'>
                    <el-table-column prop="orderSn" label="订单编号" min-width="150px"></el-table-column>
                    <el-table-column prop="payMoney" label="支付金额（元）" min-width="120px"></el-table-column>
                    <el-table-column prop="invoiceMoney" label="可开票金额（元）" min-width="120px"></el-table-column>
                    <el-table-column prop="payTime" label="支付时间" min-width="150px">
                      <template slot-scope="scope">
                        {{scope.row.payTime/1000 | timeFilter}}
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
                <div class="table-page">
                  <el-pagination :current-page="page" :page-size="pageSize" layout="total, prev, pager, next" :total="pageTotal" @current-change="_handlePageChange">
                  </el-pagination>
                </div>
              </el-card>
            </div>
          </template>
        </detail-basic>
      </div>
    </v-page>
    <el-dialog :visible.sync="dialogVisible" width="25%">
      <span>确定开发票？</span>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="handleInvoice">确 定</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>
import detailBasic from '@/components/detail/v-detail'
import { settings } from './detailSettings'
import paginationMixin from '@/mixins/pagination.js'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    sn: {
      type: String,
      default: ''
    },
    status: String
  },
  mixins: [paginationMixin],
  components: {
    detailBasic
  },
  data() {
    return {
      labelWidth: 150,
      detailData: {},
      tableData: [],
      dialogVisible: false,
      pageSize: 10
    }
  },
  computed: {
    detailSettings() {
      return settings(this.status)
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.getDetail(this.sn)
      }
    }
  },
  methods: {
    loadTableData() {
      this.$service.invoiceRelationOrders({
        page: this.page,
        rows: this.pageSize,
        sn: this.sn
      }).then(res => {
        this.tableData = res.data.data.records
        this._changePageTotal(res.data.data.totalElements)
      })
    },
    closeMe() {
      this.$emit('update:visible', false)
      this.$emit('close')
      return false
    },
    getDetail(sn) {
      if (sn) {
        this.$service.invoiceDetail({ sn }).then(res => {
          this.detailData = res.data.data
        })
        this.loadTableData()
      }
    },
    handleInvoice() {
      this.$service.handleInvoice({ sn: this.sn }).then(res => {
        if (res.data.code == 0) {
          this.dialogVisible = false
          this.status = 'processed'
          Object.assign(this.detailData, res.data.data)
          this.$message({ message: '操作成功', type: 'success' })
        }
      })
    }
  }
}
</script>

<style lang="scss">
</style>
