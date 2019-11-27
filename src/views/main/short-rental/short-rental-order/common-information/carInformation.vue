<template>
  <div class="car_information">
    <!-- 可增加 x-no-colon 类禁用label后的冒号 -->
    <div class="x-data-detail">
      <div class="x-detail-block">
        <h4 class="x-detail-title">车辆物料信息</h4>
        <el-row :gutter="10">
          <el-col :xs="24" :sm="12" :md="8">
            <div class="x-detail-item">
              <div class="x-label">车牌号</div>
              <div class="x-value">{{carInformation.carNumber ? carInformation.carNumber: '未排车'}}
                <el-button type="text" v-if="carInformation.carNumber && (carInformation.orderStatus === 'rent' || carInformation.orderStatus === 'subscribed') && $_has(authority.exchangeCar)" @click="exchangeCar">换车</el-button>
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <div class="x-detail-item">
              <div class="x-label">车型</div>
              <div class="x-value">{{carInformation.carGenreName}}</div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <div class="x-detail-item">
              <div class="x-label">物料信息</div>
              <div class="x-value material_btn">
                <div v-if="carInformation.materielStatus=== 'unreceived'">
                  <span>未领取</span>
                  <el-button type="text" @click="getMaterial" class="ml-10" v-if="carInformation.orderStatus=== 'rent' && $_has(authority.getMaterial)">领取</el-button>
                </div>
                <div v-if="carInformation.materielStatus=== 'received'">
                  <span>已领取</span>
                  <el-button type="text" @click="returnMaterial" class="ml-10" v-if="carInformation.orderStatus=== 'rent' && $_has(authority.returnMaterial)">归还</el-button>
                </div>
                <div v-if="carInformation.materielStatus=== 'returned'">
                  <span>已归还</span>
                  <el-button type="text" @click="reviewMaterial" class="ml-10" v-if="carInformation.orderStatus=== 'rent' || carInformation.orderStatus=== 'returned' || carInformation.orderStatus=== 'finished'">查看</el-button>
                </div>
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
  data() {
    return {
      infor: {}
    }
  },
  mounted() {
  },
  methods: {
    getMaterial() {
      let obj = {
        title: '领取物料',
        type: 'getMaterial'
      }
      this.$emit('on-materialDialog', obj)
    },
    returnMaterial() {
      let obj = {
        title: '归还物料',
        type: 'returnMaterial'
      }
      this.$emit('on-materialDialog', obj)
    },
    reviewMaterial() {
      let obj = {
        title: '查看',
        type: 'reviewMaterial'
      }
      this.$emit('on-materialDialog', obj)
    },
    exchangeCar() {
      this.$emit('on-orderCarDialog')
    }
  },
  props: {
    carInformation: {
      default: {},
      type: Object
    },
    authority: {
      default: {},
      type: Object
    }
  }
}
</script>
<style lang="scss">
  .car_information {
    .material_btn {
      .ml-10 {
        margin-left: 10px;
      }
    }
  }
</style>
