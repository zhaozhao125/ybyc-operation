<template>
  <div class="settle_information">
    <!-- 可增加 x-no-colon 类禁用label后的冒号 -->
    <div class="x-data-detail">
      <div class="x-detail-block">
        <h4 class="x-detail-title">结算信息</h4>
        <el-row :gutter="10">
          <el-col :xs="24" :sm="12" :md="8">
            <div class="x-detail-item">
              <div class="x-label">操作人</div>
              <div class="x-value">
                {{settleInformation.settleOperatorCn}}
                   <span v-if="settleInformation.settleOperatorCn && settleInformation.settleOperator">(</span>
                   <span v-if="settleInformation.settleOperator">{{settleInformation.settleOperator}}</span>
                   <span v-if="settleInformation.settleOperatorCn && settleInformation.settleOperator">)</span>
                </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <div class="x-detail-item">
              <div class="x-label">其它费用备注</div>
              <div class="x-value">{{settleInformation.otherMoneyRemark  ? settleInformation.otherMoneyRemark  : '暂无'}}</div>
            </div>
          </el-col>
           <el-col :xs="24" :sm="12" :md="8">
            <div class="x-detail-item">
              <div class="x-label">结算备注</div>
              <div class="x-value">{{settleInformation.settleRemark ? settleInformation.settleRemark : '暂无'}}</div>
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
    settleInformation: {
      default: {},
      type: Object
    }
  }
}
</script>
<style lang="scss">
  .settle_information {
    .material_btn {
      .ml-10 {
        margin-left: 10px;
      }
    }
  }
</style>
