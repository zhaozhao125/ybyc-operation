<template>
  <div class="order_log">
    <!-- 可增加 x-no-colon 类禁用label后的冒号 -->
    <div class="x-data-detail">
      <div class="x-detail-block">
        <h4 class="x-detail-title">订单日志</h4>
        <div v-if="list.length>0">
          <el-table
            :data="list"
            style="width: 100%">
            <el-table-column
              prop="createdTime"
              label="时间"
              width="300">
              <template slot-scope="scope">
                  <span>{{scope.row.createdTime | timeFilter}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="content"
              show-overflow-tooltip
              label="操作"
            >
            <template slot-scope="scope">
                  <span>{{scope.row.typeName}} <span v-if="scope.row.content">({{scope.row.content}})</span></span>
            </template>
            </el-table-column>
            <el-table-column
              prop="createdBy"
              width="300"
              label="操作人">
              <template slot-scope="scope">
                  <span>{{scope.row.createdByCn}}
                     <span v-if="scope.row.createdByCn && scope.row.createdBy">(</span>
                     <span v-if="scope.row.createdBy">{{scope.row.createdBy}}</span>
                     <span v-if="scope.row.createdByCn && scope.row.createdBy">)</span>
                  </span>
            </template>
            </el-table-column>
          </el-table>
          <div class='table-page'>
            <el-pagination :current-page="1" :page-size="params.pageSize" layout="total, prev, pager, next" :total="params.total"          @current-change="pageChange">
            </el-pagination>
          </div>
        </div>
        <div v-else class="noLog">暂无</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      infor: {}
    }
  },
  mounted () {
  },
  methods: {
    pageChange (val) {
      this.$emit('on-pageChange', val)
    }
  },
  props: {
    list: {
      default: [],
      type: Array
    },
    params: {
      default: {},
      type: Object
    }
  }
}
</script>
<style lang="scss">
  .order_log {
    .table-page {
      margin-top:10px;
      .el-pagination {
        text-align: right;
      }
    }
    .noLog {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.85);
    }
    .x-detail-block {
      border-bottom: none;
    }
  }
</style>
