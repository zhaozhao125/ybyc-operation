<template>
  <div class="return_information">
    <!-- 可增加 x-no-colon 类禁用label后的冒号 -->
    <div class="x-data-detail">
      <div class="x-detail-block">
        <h4 class="x-detail-title">财务审核信息</h4>
        <el-row :gutter="10">
          <el-col :xs="24" :sm="12" :md="8">
            <div class="x-detail-item">
              <div class="x-label">操作人</div>
              <div class="x-value">
                {{checkInformation.finishOperatorCn}}
                   <span v-if="checkInformation.finishOperator && checkInformation.finishOperatorCn">(</span>
                   <span v-if="checkInformation.finishOperator">{{checkInformation.finishOperator}}</span>
                   <span v-if="checkInformation.finishOperator && checkInformation.finishOperatorCn">)</span>
                </div>
            </div>
          </el-col>
        </el-row>
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
  },
  props: {
    checkInformation: {
      default: {},
      type: Object
    }
  }
}
</script>
<style lang="scss">
  .return_information {
    .material_btn {
      .ml-10 {
        margin-left: 10px;
      }
    }
  }
</style>


