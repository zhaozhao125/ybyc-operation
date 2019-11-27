<template>
    <div id="charging-genre-detail">
        <detail-basic :detailSettings='detailSettings' :data="detailData">

        </detail-basic>
    </div>
</template>
<script>
import detailBasic from '@/components/detail/v-detail'
export default {
  name: 'charging-genre-detail',
  props: {
    detailData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      numberValidateForm: {
        fileCount: '',
        version:''
      },
      formData:{},
      detailSettings:   [{
        items: [
          {
            label: '类型名称',
            value: 'equipmentModelName'
          },
          {
            label: '设备商',
            value: 'device',
            map:{
              'JD':'洁电',
              'TLD':'特来电',
              'YD':'一电',
              'EN':'驿普乐氏'
            }
          },
          {
            label: '设备型号',
            value: 'deviceModel'
          },
          {
            label: '电流类型',
            value: 'equipmentType',
            map:{
              'AC':'交流',
              'DC':'直流'
            }
          },
          {
            label: '额定功率',
            value: 'power',
            append:'kw.h'
          },
          {
            label: '额定电流',
            value: 'current',
            append:'A'
          },
          {
            label: '设备类型',
            value: 'smart',
            map:{
              true:'智能桩',
              false:'非智能桩'
            }
          },
          {
            label: '类型图片',
            value: 'images',
            type: 'image'
          },
          {
            label: '备注',
            value: 'remark'
          },
          {
            label: '添加时间',
            value: 'createdOn',
            type: 'time'
          },
          {
            label: '添加人',
            value: 'createdBy'
          }
        ]
      }],
      upgradeVisible:false
    }
  },
  mounted() {
    this.$nextTick(() => {

    })
  },
  computed: {
  },
  components: {
    detailBasic
  },
  methods:{

  }
}
</script>
