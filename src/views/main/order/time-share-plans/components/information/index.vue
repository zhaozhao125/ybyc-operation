<template>
  <div class="plan_detail">
    <detail-basic :detailSettings='planDetailSettings' :detailData="detailData">
      <template slot="activityDescUrl" slot-scope="scope" >
           <!-- <v-editor ref="editor" @change="handleEditorChange" :content="planInforMation?planInforMation.activityDescUrl:''" class="plan_edit"></v-editor> -->
           <div v-html="planInforMation.activityDescUrl" class="activityDescUrl"></div>
      </template>
    </detail-basic>
  </div>
</template>

<script>
import detailBasic from '@/components/detail/vDetail'
import { planDetailSettings } from './detail-setting.js'
import dayjs from 'dayjs'
import vEditor from '@/components/editor/'
export default {
  components: {
    detailBasic,
    vEditor
  },
  props: {
    planInforMation: {
      default: {},
      type: Object
    }
  },
  data () {
    return {
      planDetailSettings: planDetailSettings,
      detailData: {
        stationName: 123
      }
    }
  },
  mounted () {
    console.log(this.planInforMation)
    this.detailData = {
      packageName: this.planInforMation.packageName,
      packageDecription: this.planInforMation.packageDecription,
      packageIconUrl: [this.planInforMation.packageIconUrl],
      cityName: this.planInforMation.cityName,
      carGenreName: this.planInforMation.carGenreName,
      planTime: `${this.timeChange(this.planInforMation.periodStartTime, 'HH:mm:ss')} -- ${this.timeChange(this.planInforMation.periodEndTime, 'HH:mm:ss')}`,
      amount: `${this.planInforMation.amount} 元`,
      planDate: `${this.timeChange(this.planInforMation.startTime)} -- ${this.timeChange(this.planInforMation.endTime)}`,
      isOpen: this.planInforMation.isOpen ? '启用' : '禁用',
      createdBy: this.planInforMation.createdBy ? this.planInforMation.createdBy : '暂无',
      createdTime: this.timeChange(this.planInforMation.createdTime),
      modifiedBy: this.planInforMation.modifiedBy ? this.planInforMation.modifiedBy : '暂无',
      modifiedTime: this.timeChange(this.planInforMation.modifiedTime)
    }
  },
  methods: {
    timeChange (value, format) {
      if (!format) {
        format = 'YYYY-MM-DD HH:mm:ss'
      }
      if (!isNaN(value)) {
        if (String(value).length === 10) {
          return dayjs.unix(value).format(format)
        } else if (String(value).length === 13) {
          return dayjs(value).format(format)
        } else {
          return '暂无'
        }
      }
      let date = new Date(value)
      if (!isNaN(date.getTime())) {
        return dayjs(value).format(format)
      }
      return '暂无'
    },
    handleEditorChange () {
    }
  }
}
</script>

<style lang="scss">
  .plan_detail {
    .detail-content {
      .show-picture {
        padding-left:0px;
        margin-top:0px;
      }
    }
    .activityDescUrl {
      overflow-x: auto;
    }
  }
</style>
