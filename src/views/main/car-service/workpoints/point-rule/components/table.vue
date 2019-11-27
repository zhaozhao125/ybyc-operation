<template>
  <div class="table-container point_rule_list">
    <el-table :data="tableData" height="100%" >
          <el-table-column label="工分规则名称" min-width="200px" prop="name" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="cityName" label="城市" min-width="120px"></el-table-column>
          <el-table-column prop="createdBy" label="添加人" min-width="120px"></el-table-column>
          <el-table-column prop="updateBy" label="修改人" min-width="120px"></el-table-column>
          <el-table-column prop="updateTime" label="最后修改时间" min-width="150px"></el-table-column>
          <el-table-column prop="contact" label="操作" min-width="120px">
            <template slot-scope="scope" width = '150px'>
              <el-button type = "text" @click = "editRule(scope.row)">编辑</el-button>
              <el-popover  placement="top" ref = 'popover5' v-model = 'scope.row.popoverShow' >
                    <div >
                        <h4 style="margin:10px">确定删除该工分规则？</h4>
                        <div style="text-align: right; margin: 0">
                            <el-button size="mini" type="text" @click="scope.row.popoverShow = false">取消</el-button>
                            <el-button type="primary" size="mini" @click = "deleteRule(scope.row)">确定</el-button>
                        </div>
                    </div>
                    <div slot="reference" class="name-wrapper">
                        <el-button @click="scope.row.popoverShow = true" type = 'text'>删除</el-button>
                    </div>
                </el-popover>
            </template>
          </el-table-column>
      </el-table>
  </div>
</template>

<script>
import popSwitch from '@/components/pop-switch'
export default {
  name: 'worker-point',
  components: {
    popSwitch
  },
  props: {
    tableData: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
    }
  },
  methods: {
    deleteRule (row) {
      this.$service.deleteInfor({id: row.id}).then((res) => {
         row.popoverShow = false
         this.$emit('reload')
         this.$message.success('删除成功')
      })
    },
    editRule (row) {
      this.$emit('editRule', row)
    }
  }
}
</script>
<style lang="scss">
   .point_rule_list {
      tbody {
        td {
          span {
            display: inline-block;
          }
        }
      }
   }
</style>
