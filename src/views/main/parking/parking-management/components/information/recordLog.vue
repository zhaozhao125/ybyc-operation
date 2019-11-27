<template>
  <div class="packing_record_list">
    <!-- 可增加 x-no-colon 类禁用label后的冒号 -->
    <div class="x-data-detail">
      <div class="x-detail-block delete_border" >
        <h4 class="x-detail-title">操作记录</h4>
        <div class="no" v-if="recordList.length === 0">暂无</div>
        <div v-else>
           <el-table
            :data="recordList"
            style="width: 100%">
            <el-table-column
              prop="modifyOn"
              label="时间"
              show-overflow-tooltip
              min-width="150">
              <template slot-scope="scope">
                  {{scope.row.createdTime | timeFilter}}
              </template>
            </el-table-column>
            <el-table-column
              prop="operator"
              label="操作人"
              show-overflow-tooltip
              min-width="150">
              <template slot-scope="scope">
                  <span>{{scope.row.operator ? scope.row.operator : '暂无'}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="operatorDescription"
              show-overflow-tooltip
              min-width='300'
              label="事件">
            </el-table-column>
          </el-table>
          <div class='table-page'>
            <el-pagination :current-page="1" :page-size="paginationParams.pageSize" layout="total, prev, pager, next" :total="paginationParams.total"         @current-change="pageChange">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
    }
  },
  mounted () {
  },
  props: {
     recordList: {
      default: [],
      type: Array
    },
    paginationParams: {
      default: {},
      type: Object
    }
  },
  components: {
  },
  methods: {
    pageChange (val) {
      this.$emit('on-pageChange', val)
    }
  }
}
</script>
<style lang="scss">
  .packing_record_list {
    .table-page {
      .el-pagination {
        text-align: right;
        margin-top: 20px;
      }
    }
  }
</style>
