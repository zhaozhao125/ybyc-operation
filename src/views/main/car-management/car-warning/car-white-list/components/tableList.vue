<template>
  <div class="components-content">
    <el-table :data="list" class="table-container" height="100%">
      <el-table-column
        label="车辆编号"
        show-overflow-tooltip
        prop="carSn"
        min-width="180">
      </el-table-column>
      <el-table-column
        label="车牌号"
        show-overflow-tooltip
        prop="carNumber"
        min-width="120">
      </el-table-column>
      <el-table-column
        label="租赁类型"
        show-overflow-tooltip
        prop="rentTypeCode"
        min-width="120">
          <template slot-scope="scope">
            <div>
              <span v-if="scope.row.rentTypeCode === 1">分时</span>
              <span v-else-if="scope.row.rentTypeCode === 3">短/长租</span>
              <span v-else>未知</span>
            </div>
          </template>
      </el-table-column>
      <el-table-column
        label="运营城市"
        show-overflow-tooltip
        prop="cityName"
        min-width="120">
      </el-table-column>
      <el-table-column
        label="添加人"
        show-overflow-tooltip
        prop="createBy"
        min-width="120">
      </el-table-column>
      <el-table-column
        label="添加时间"
        show-overflow-tooltip
        prop="createDate"
        min-width="180">
        <template slot-scope="scope">
            {{scope.row.createDate | timeFilter}}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        fixed="right"
        width='120'
        >
        <template slot-scope="scope">
          <el-popover  placement="top" ref = 'popover5' v-model = 'scope.row.popoverShow' >
              <div >
                <h4 style="margin-bottom:20px">确定要删除吗？</h4>
                <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text" @click="scope.row.popoverShow = false">取消</el-button>
                    <el-button type="primary" size="mini" @click="confirmDelete(scope.row)">确定</el-button>
                </div>
              </div>
            <div slot="reference" class="name-wrapper">
                <el-button @click="scope.row.popoverShow = true" type = 'text'>删除</el-button>
            </div>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <div class='table-page'>
      <el-pagination :current-page="page" :page-size="params.pageSize" layout="total, prev, pager, next" :total="params.total"         @current-change="pageChange">
      </el-pagination>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      page: 1
    }
  },
  methods: {
    resetPage() {
      this.page = 1
    },
    pageChange (val) {
      this.page = val
      this.$emit('on-pageChange', val)
    },
    confirmDelete (val) {
      this.$service.deleteWhiteCar(val.id).then((res) => {
        this.$message.success('删除成功！')
        this.$emit('on-pageChange', this.page)
        val.popoverShow = false
      }).catch((res) => {
      })
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
