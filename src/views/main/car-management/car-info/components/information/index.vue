<template>
  <div>
     <base-infor :detailData="detailData">
        <template slot-scope="scope" slot="carNumber">
            <editInput  :value="detailData.carNumber" type="text" @updateVal="updateinfor" name="carNumber"></editInput>
        </template>
        <template slot-scope="scope" slot="cityName">
            <editInput  :value="detailData.cityName" name="cityId" type="citySelect" @updateVal="updateinfor" :showValue = "detailData.cityName"></editInput>
        </template>
        <template slot-scope="scope" slot="carModelCode">
            <editInput  :value="detailData.carModelCode" name = "carModelCode" type="defineSelect" @updateVal="updateinfor" :defineOptions ="carModels" :showValue = "detailData.carModelName"></editInput>
        </template>
        <template slot-scope="scope" slot="vin">
            <editInput  :value="detailData.vin"  name = "vin" type="text" @updateVal="updateinfor"></editInput>
        </template>
        <template slot-scope="scope" slot="carEngineNumber">
            <editInput  :value="detailData.carEngineNumber" name="carEngineNumber" type="text" @updateVal="updateinfor"></editInput>
        </template>
        <template slot-scope="scope" slot="association">
            <editInput  :value="detailData.association" name="stationId" type="networkLocation" @updateVal="updateinfor" :showValue = "detailData.association"></editInput>
        </template>
        <template slot-scope="scope" slot="carAllowance">
          <a :href="erWeiMaUrl"  style="color:#5dade2" :download="erweimaName">下载二维码</a>
        </template>
     </base-infor>
     <tbox-infor :detailData="detailData">
        <template slot-scope="scope" slot="tboxTypeCode">
            <editInput  :value="detailData.tboxTypeCode" name="tboxTypeCode" type="defineSelect" @updateVal="updateinfor" :defineOptions ="tboxList" :showValue = "detailData.tboxTypeName"></editInput>
        </template>
        <template slot-scope="scope" slot="tboxSimNumber">
            <editInput  :value="detailData.tboxSimNumber" name="tboxSimNumber" type="text" @updateVal="updateinfor" ></editInput>
        </template>
        <template slot-scope="scope" slot="carTableSimNumber">
            <editInput  :value="detailData.carTableSimNumber"  name="carTableSimNumber" type="text" @updateVal="updateinfor"></editInput>
        </template>
     </tbox-infor>
     <other-infor :detailData="detailData">
        <template slot-scope="scope" slot="ownerId">
            <editInput :value="detailData.ownerId" name="ownerId" type="defineSelect" @updateVal="updateinfor" :defineOptions ="ownerList" 
            :showValue = "detailData.ownerName"></editInput>
        </template>
     </other-infor>
     <!-- <record-log :recordList="recordList"></record-log> -->
     <record-log :recordList="list" :paginationParams ="paginationParams" @on-pageChange = "pageChange"></record-log>
  </div>
</template>
<script>
import baseInfor from './baseInformation.vue'
import tboxInfor from './tboxInformation.vue'
import otherInfor from './otherInformation.vue'
import recordLog from './recordLog.vue'
import editInput from '@/components/edit-input'
import { handleDictData } from '@/utils/common'
import { inforSettings } from './inforSetting'
export default {
  components: {
    baseInfor,
    tboxInfor,
    recordLog,
    editInput,
    otherInfor
  },
  props: {
    detailData: {
      default: {},
      type: Object
    },
    list: {
      default: [],
      type: Array
    },
    paginationParams: {
      default: {},
      type: Object
    }
  },
  data () {
    inforSettings
    return {
      carModels: [],
      tboxList: [],
      recordList: [],
      ownerList: [],
      erWeiMaUrl: '',
      erweimaName: ''
    }
  },
  methods: {
    pageChange (val) {
      this.$emit('on-pageChange', val)
    },
    updateinfor (name, updateVal) {
      let obj = {}
      obj[name] = updateVal
      this.put_carInfoPut(this.detailData.carSn, obj)
    },
    carModelsChange (val) {
      let resoult = []
      for (let key in val) {
          resoult.push(
            {
              label: val[key],
              value: key
            }
          )
        }
      return resoult
    },
    carsInfoDict() {
      this.$service.get_carsInfoDict().then(res => {
        this.carModels = this.carModelsChange(res.data.data.models)
        this.tboxList = this.carModelsChange(res.data.data.tbox)
        this.ownerList = this.carModelsChange(res.data.data.owners)
        if (this.ownerList.length > 0) {
          this.ownerList.forEach((ele) => {
            ele.value = parseInt(ele.value)
            console.log(ele.value)
          })
        }
      })
    },
    carRecordList (page=1) {
      this.$service.carRecordList({carSn: this.detailData.carSn}, page).then((res) => {
        this.recordList = res.data.data.records
      }).catch((res) => {
      })
    },
    put_carInfoPut (sn, params) {
      this.$service.put_carInfoPut(sn, params).then((res) => {
        this.$message.success('修改成功')
        this.$emit('on-putSuccess')
        this.carRecordList()
      }).catch((res) => {
      })
    },
    getCarAllowance () {
      this.$service
      .get_carInfoSticker(this.detailData.carSn)
        .then(res => {
          this.erWeiMaUrl = res.data.data
          this.erweimaName = `${this.detailData.carNumber}.jpg`
        })
        .catch(error => {
          this.$message.warning(error.msg)
        })
    }
  },
  mounted () {
    this.carsInfoDict()
    // this.carRecordList()
    this.getCarAllowance()
    console.log(this.detailData)
  }
}
</script>
