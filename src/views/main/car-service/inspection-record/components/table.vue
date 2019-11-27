<template>
    <div class="components-content">
      <el-table
        :data="list"
        height="100%">
        <el-table-column
            prop="taskSn"
            label="工单编号"
            show-overflow-tooltip
            min-width="100">
            <template slot-scope="scope" >
                <el-button type="text" @click = 'jumpWork(scope.row.taskSn)' >{{scope.row.taskSn}}</el-button>
            </template>
        </el-table-column>
        <el-table-column
            prop="carNumber"
            label="车牌号"
             min-width="100">
        </el-table-column>
        <el-table-column
            prop="inspectorName"
            label="巡检人"
             min-width="100">
        </el-table-column>
        <el-table-column
            prop="result"
            label="巡检结果"
             min-width="100">
        </el-table-column>
        <el-table-column
            prop="status"
            label="处理状态"
            min-width="100"

            >
             <!-- <template slot-scope="scope">
              <div>
                <el-tag v-if="scope.row.status === '已处理'" type="success">{{scope.row.status}}</el-tag>
                <el-tag v-else  type="danger">{{scope.row.status}}</el-tag>
              </div>
           </template> -->
        </el-table-column>
        <el-table-column
            prop="createTime"
            label="巡检时间"
             min-width="100">
        </el-table-column>
       <el-table-column label="操作" fixed="right" min-width="70">
            <template slot-scope="scope" >
                <el-button type="text" @click = 'jumpInspectionInfor(scope.row.id)' v-if = "scope.row.status === '待处理'">处理</el-button>
                <el-button type="text" v-else @click = 'jumpInspectionInfor(scope.row.id)'> 查看详情</el-button>
            </template>
        </el-table-column>
      </el-table>
      <div class='table-page'>
          <el-pagination :current-page.sync="page" :page-size="parseInt(params.pageSize)" layout="total, prev, pager, next" :total="params.total"  @current-change="pageChange">
          </el-pagination>
      </div>
    </div>
  </template>

<script>
import paginationMixin from '@/mixins/pagination.js'
export default {
  data() {
    return {
      page: 1
    }
  },
  props: {
    list: {
      default: [],
      type: Array
    },
    params: Object
  },
  methods: {
    pageChange (val) {
      this.$emit('on-change', val)
    },
    jumpInspectionInfor (id) {
      this.$emit('on-inspectionShow', id)
      console.log(1111111)
      // this.$store.commit('sendToTab', {
      //   name: 'workOrder',
      //   params: {
      //     id: id
      //   }
      // })
    },
    jumpWork (sn) {
      this.$emit('update:visible', false)
      console.log(sn)
      // this.$emit('workInfor', sn)
      this.$store.commit('sendToTab', {
        name: 'workOrder',
        params: {
          sn: sn
        }
      })
    }
  },
  mounted () {
  }
}
</script>
