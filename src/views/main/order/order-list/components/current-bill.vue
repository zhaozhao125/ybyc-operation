<template>
  <el-dialog title="实时计费" :visible.sync="visible" width="55%" class="current-billing" :before-close="handleBeforeClose">
    <detail-basic :detailSettings='currentBillSettings' :data="currentBilllData" :labelWidth="labelWidth">
      <template slot="carNumber" slot-scope="scope">
        {{currentBilllData.carNumber}}
        <span class="online" v-if="currentBilllData.carIsOnline == true">在线</span>
        <span class="outline" v-else>离线</span>
      </template>
      <template slot="onMinutePrice" slot-scope="scope">
        <div>
          行驶单价{{currentBilllData.orderFeeDTO.onMinutePrice}}元/分钟 ,
          停车单价{{currentBilllData.orderFeeDTO.offMinutePrice}}元/分钟
        </div>
        <div>
          日封顶{{currentBilllData.orderFeeDTO.dayMaxPrice}}元 ,
          跨城服务费单价{{currentBilllData.orderFeeDTO.cityServicePrice}}元/公里
        </div>
      </template>
      <template slot="totalMoney" slot-scope="scope">
        <span class="current-price">
          {{currentBilllData.orderFeeDTO.totalMoney}}元
        </span>
      </template>
      <template slot="dayMoneyTotal" slot-scope="scope">
        {{currentBilllData.orderFeeDTO.dayMoneyTotal}}元（{{currentBilllData.orderFeeDTO.dayTimes}}天）
      </template>
      <template slot="onMoneyTodayTotal" slot-scope="scope">
        {{currentBilllData.orderFeeDTO.onMoneyTodayTotal}}元（{{currentBilllData.orderFeeDTO.onMinuteTodayTotal}}分钟）
      </template>
      <template slot="offMoneyTodayTotal" slot-scope="scope">
        {{currentBilllData.orderFeeDTO.offMoneyTodayTotal}}元（{{currentBilllData.orderFeeDTO.offMinuteTodayTotal}}分钟）
      </template>
      <template slot="noDeductiblesPrice" slot-scope="scope">
        <span v-if="currentBilllData.orderFeeDTO.noDeductiblesPrice || currentBilllData.orderFeeDTO.noDeductiblesPrice === 0 || currentBilllData.orderFeeDTO.noDeductiblesPrice === null">
          {{currentBilllData.orderFeeDTO.noDeductiblesPrice === null ? 0 : currentBilllData.orderFeeDTO.noDeductiblesPrice}}元
        </span>
      </template>
      <template slot="citySuburbanMoney" slot-scope="scope">
        <span v-if="currentBilllData.orderFeeDTO.citySuburbanMoney || currentBilllData.orderFeeDTO.citySuburbanMoney === 0 || currentBilllData.orderFeeDTO.citySuburbanMoney === null">
          {{currentBilllData.orderFeeDTO.citySuburbanMoney === null ? 0 : currentBilllData.orderFeeDTO.citySuburbanMoney}}元
        </span>
      </template>
      <template slot="cityCrossMoney" slot-scope="scope">
        {{currentBilllData.orderFeeDTO.cityCrossMoney}}元（{{currentBilllData.orderFeeDTO.cityCrossMileage}}公里）
      </template>
    </detail-basic>
    <div class="refresh">
      <el-button type="primary" size="small" @click="currentBill()">刷新</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { currentBillSettings } from './detailSettings'
import detailBasic from '@/components/detail/v-detail'

export default {
  name: 'current-bill',
  components: {
    detailBasic
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    currentBilllData: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      labelWidth: 150,
      currentBillSettings: currentBillSettings
    }
  },
  methods: {
    handleBeforeClose() {
      this.$emit('update:visible', false)
    },
    currentBill() {
      this.$emit('currentBillEmit')
    }
  }
}
</script>

<style lang="scss">
.refresh {
  position: absolute;
  top: 90px;
  right: 50px;
}
</style>
