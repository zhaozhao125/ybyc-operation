<template>
  <div class="return_information">
    <!-- 可增加 x-no-colon 类禁用label后的冒号 -->
    <div class="x-data-detail">
      <div class="x-detail-block">
        <h4 class="x-detail-title">还车信息</h4>
        <el-row :gutter="10">
          <el-col :xs="24" :sm="12" :md="8">
            <div class="x-detail-item">
              <div class="x-label">还车来源</div>
              <div class="x-value">{{returnInformation.returnTypeName}}</div>
            </div>
          </el-col>

          <!-- 后台还车显示操作人 -->
           <el-col :xs="24" :sm="12" :md="8" v-if="returnInformation.returnType === 'background'">
            <div class="x-detail-item">
              <div class="x-label">操作人</div>
              <div class="x-value">
                {{returnInformation.returnOperatorCn}}
                   <span v-if="returnInformation.returnOperator && returnInformation.returnOperatorCn">(</span>
                   <span v-if="returnInformation.returnOperator">{{returnInformation.returnOperator}}</span>
                   <span v-if="returnInformation.returnOperator && returnInformation.returnOperatorCn">)</span>
                </div>
            </div>
          </el-col>
           <el-col :xs="24" :sm="12" :md="8" v-if="returnInformation.returnType === 'background'">
            <div class="x-detail-item">
              <div class="x-label">还车备注</div>
              <div class="x-value">{{returnInformation.returnRemark ? returnInformation.returnRemark : '暂无'}}</div>
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
    returnInformation: {
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
