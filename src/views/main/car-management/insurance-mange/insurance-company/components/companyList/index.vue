<template>
  <div class = "insurance_company_list  components-content">
    <el-table
        :data = "list"
        class="table-container"
        height="100%">
      <!-- <el-table-column
          prop  = "id"
          label = "编号"
          show-overflow-tooltip
          min-width = "200">
      </el-table-column> -->
      <el-table-column
          prop  = "fullName"
          label = "保险公司全称"
          show-overflow-tooltip
          min-width = "400">
      </el-table-column>
      <el-table-column
          min-width = "200"
          prop  = "name"
          show-overflow-tooltip
          label = "公司缩写">
      </el-table-column>
      <el-table-column
          fixed = "right"
          width = "150px"
          label = "操作">
              <template slot-scope="scope">
                <el-button type = "text" @click = "editInsurance(scope.row)">编辑</el-button>
                <el-popover  placement="top" ref = 'popover5' v-model = 'scope.row.popoverShow' >
                    <div >
                        <h4 style="margin:10px">确定删除该保险公司？</h4>
                        <div style="text-align: right; margin: 0">
                            <el-button size="mini" type="text" @click="scope.row.popoverShow = false">取消</el-button>
                            <el-button type="primary" size="mini"  @click = "deleteCompany(scope.row)">确定</el-button>
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
        <el-pagination :current-page.sync="page" :page-size="params.pageSize" layout="total, prev, pager, next" :total="params.total"         @current-change="pageChange">
        </el-pagination>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      page: 1,
    }
  },
  methods: {
    pageChange (val) {
      this.page = val
      this.$emit('on-pageChange', val)
    },
    editInsurance (row) {
      this.$emit('on-edit', row)
    },
    deleteCompany (val) {
      this.$service.deleteCompany(val.id).then((res) => {
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
<style lang="scss">
   .insurance_company_list {
      tbody {
        td {
          span {
            display: inline-block;
          }
        }
      }
   }
</style>
