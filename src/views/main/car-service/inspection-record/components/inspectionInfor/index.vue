<template>
  <div class="inspection_information">
      <v-page :visible.sync="visible" :before-close="handleBeforeClose">
        <h3 slot="title" >巡检详情</h3>
        <div slot = 'content'>
          <v-detail :detailSettings="inforSetting" :data="detailData" label-align="left" label-width="80px">
            <template slot="sn" slot-scope="props">
              <el-button @click="jumpWork(props.data.taskSn)" type = 'text'  class = 'jump_work'>{{props.data.taskSn}}</el-button>
            </template>
          </v-detail>
          <section-infor :infor = 'sectionsInformation' @on-getInfor = 'getInspectionInfor' v-if = "sectionsInformation.length" @on-jumpCreate = "jumpCreate" @on-jumpWork = "workInfor">
          </section-infor>
          <el-row class = 'inspection_record'>
             <el-col :span = '2' class="left">巡检记录:</el-col>
             <el-col :span = '10'><div v-html = 'remark' class="right"></div></el-col>
          </el-row>
          <v-detail :detailSettings="picSetting" :data="detailData" label-align="left" label-width="80px">
          </v-detail>
          </div>
      </v-page>
  </div>
</template>
<script>
import vDetail from '@/components/detail/v-detail'
import { topSetting, bottomSetting } from './inforSetting'
import sectionInfor from './components/section'
export default {
  components: {
    vDetail,
    sectionInfor
  },
  data () {
    return {
      inforSetting: topSetting,
      picSetting: bottomSetting,
      detailData: {
      },
      sectionsInformation: [],
      remark: ''
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    sn: {
      type: String,
      required: true
    }
  },
  methods: {
    handleBeforeClose () {
      this.$emit('update:visible', false)
      this.$emit('on-inspectionHide')
      return false
    },
    jumpWork (sn) {
      // this.$emit('update:visible', false)
      console.log(sn)
      // this.$emit('workInfor', sn)
      this.$store.commit('sendToTab', {
        name: 'workOrder',
        params: {
          sn: sn
        }
      })
    },
    workInfor (id) {
      console.log(id)
      this.jumpWork(id)
    },
    jumpCreate (value) {
      this.$emit('update:visible', false)
      let obj = {
        taskType: value,
        carNumber: this.detailData.carNumber,
        images: this.detailData.images,
        remark: this.detailData.remark,
        businessSn: this.detailData.id,
      }
      // this.$emit('createWork', obj)
      this.$store.commit('sendToTab', {
        name: 'workOrder',
        params: {
          infor: obj
        }
      })
    },
    getInspectionInfor () {
      this.sectionsInformation = []
      this.$service.getInspectionInfor(`/service-ratchet/ratchet/admin/inspection/info/${this.sn}`).then((res) => {
        this.detailData = res.data.data
        this.remark = this.detailData.remark.replace(/\n/g, '<br/>')
        this.sectionsInformation = [
          {
            content: '外观及用车检查',
            types: res.data.data.typeList.outwardType,
            outwardTypeErrNum: res.data.data.typeList.outwardTypeErrNum,
            changeType: '转为维修单',
            changeVlaue: 'repair_car',
            sn: ''
          },
          {
            content: '物料检查',
            types: res.data.data.typeList.lackMaterial.types,
            outwardTypeErrNum: res.data.data.typeList.lackMaterialErrNum,
            changeType: '转为补料单',
            changeVlaue: 'lack_materiel',
            sn: ''
          },
          {
            content: '清洁检查',
            types: res.data.data.typeList.cleanType.types,
            outwardTypeErrNum: res.data.data.typeList.cleanTypeErrNum,
            changeType: '转为清洁单',
            changeVlaue: 'clean_car',
            sn: ''
          }
        ]
        if (res.data.data.outwardTaskSn) {
          this.sectionsInformation[0].sn = res.data.data.outwardTaskSn
        }
        if (res.data.data.lackMaterialTaskSn) {
          this.sectionsInformation[1].sn = res.data.data.lackMaterialTaskSn
        }
        if (res.data.data.cleanTypeTaskSn) {
          this.sectionsInformation[2].sn = res.data.data.cleanTypeTaskSn
        }
      })
    }
  },
  mounted () {
    this.getInspectionInfor()
  }
}
</script>
<style lang="scss">
   .inspection_information{
     .inspection_record {
        padding: 5px 20px 0px 50px;
        margin-left: 20px;
        .left{
              width: 80px;
              color: #99a9bf;
              margin-right: 15px;
              font-size:15px;
        }
        .right {
          font-size:15px;
        }
     }
     .jump_work {
       height: 24px;
       vertical-align: middle;
       line-height: 0;;
     }
     .z-detail{
       margin-left: 20px;
     }
  }
</style>
