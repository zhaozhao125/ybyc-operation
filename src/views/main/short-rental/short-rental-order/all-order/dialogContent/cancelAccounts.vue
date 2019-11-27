 <template>
    <el-form  :inline="true" :model="formInline" class="all_order_settle">
      <el-form-item label="取消原因">
        <el-select v-model="formInline.region" placeholder="取消原因">
          <el-option label="用户未取车" value="shanghai"></el-option>
          <el-option label="车辆库存不足" value="beijing"></el-option>
          <el-option label="其他" value="beijing"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </template>
  <script>
  export default {
    data() {
      return {
        formInline: {
          user: '',
          region: ''
        }
      }
    },
    methods: {
      onSubmit() {
        console.log('submit!');
      }
    }
  }
</script>
<style lang="scss">
  .all_order_settle {
    .el-input {
      .el-input__inner {
        height: 30px;
        line-height: 30px;
      }
    }
  }
</style>
