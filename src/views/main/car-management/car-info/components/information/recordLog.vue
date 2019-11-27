<template>
  <div class="car_record_list">
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
                  {{scope.row.modifyOn | timeFilter}}
              </template>
            </el-table-column>
            <el-table-column
              prop="modifyBy"
              label="操作人"
              show-overflow-tooltip
              min-width="150">
              <template slot-scope="scope">
                  <span>{{scope.row.modifyBy ? scope.row.modifyBy : '暂无'}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="address"
              show-overflow-tooltip
              min-width='300'
              label="事件">
              <template slot-scope="scope">
                  <span v-if = "scope.row.type === 'UPDATE'">{{scope.row.field}} 【 {{scope.row.before}} 】 -->【 {{scope.row.current}} 】</span>
                  <span v-if = "scope.row.type === 'ADD'">新增车辆，{{scope.row.field}}--> 【 {{scope.row.current}}】</span>
              </template>
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
    // this.$nextTick(() => {
    //   console.log(this.recordList)
    // })
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
   .car_record_list {
      .delete_border {
         border-bottom: none;
      }
      .no {
        font-size: 14px;
      }
   }
</style>
