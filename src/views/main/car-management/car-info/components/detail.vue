<template>
  <div id="car-info-detail">
    <detail-basic :detailSettings='detailSettings' :detailData="detailData">
      <span slot="area" v-if="detailData.cityName">{{detailData.cityName}} </span>
      <span slot="rentTypeCode" v-if="detailData.rentTypeCode===1">分时</span>
      <span slot="rentTypeCode" v-if="detailData.rentTypeCode===3">短/长租</span>
      <template slot="carEngineNumber">
        <a :href="erWeiMaUrl" :download="erweimaName" style="color:#5dade2">下载二维码</a>
      </template>
    </detail-basic>
  </div>
</template>
<script>
import detailBasic from '@/components/detail/vDetail'
import { detailSettings } from './data'
export default {
  name: 'car-info-detail',
  props: {
    detailData: {
      type: Object,
      required: true
    },
    carSn: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      detailSettings: detailSettings,
      erWeiMaUrl: ''
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$service
        .get_carInfoSticker(this.carSn)
        .then(res => {
          this.erWeiMaUrl = res.data.data
        })
        .catch(error => {
          this.$message.warning(error.msg)
        })
    })
  },
  computed: {
    erweimaName() {
      return `${this.detailData.carNumber}.jpg`
    }
  },
  components: {
    detailBasic
  }
}
</script>
