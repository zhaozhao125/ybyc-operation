<template>
  <div class = "packing_infor">
     <base-infor :detailData="detailData">
        <template slot-scope="scope" slot="parkingShowSn">
            <editInput  :value="detailData.parkingShowSn" type="text" @updateVal="updateinfor" name="parkingShowSn" v-if = "$_has('parkingManagementShowSn')"></editInput>
            <span v-else>{{detailData.parkingShowSn}}</span>
        </template>
        <template slot-scope="scope" slot="cityName">
            <editInput  :value="detailData.cityName" name="cityId" type="citySelect" @updateVal="updateinfor" :showValue = "detailData.cityName" v-if = "$_has('parkingManagementCity')"></editInput>
            <span v-else>{{detailData.cityName}}</span>
        </template>
        <template slot-scope="scope" slot="stationName">
            <editInput  :value="detailData.stationName" name="stationId" type="networkLocation" @updateVal="updateinfor" :showValue = "detailData.stationName" ref = "inputWebsite" v-if = "$_has('parkingManagementWebsite')"></editInput>
             <span v-else>{{detailData.stationName}}</span>
        </template>
     </base-infor>
     <equipment-infor :detailData="detailData">
        <template slot-scope="scope" slot="lockEquipmentOperator">
            <editInput  :value="detailData.lockEquipmentOperator" name="lockEquipmentOperator" type="defineSelect" @updateVal="updateinfor" :defineOptions ="equipmentProducer" :showValue = "detailData.lockEquipmentOperatorName" v-if = "$_has('parkingManagementLockEquipmentOperator')"></editInput>
            <span v-else>{{detailData.lockEquipmentOperatorName}}</span>
        </template>
        <template slot-scope="scope" slot="lockEquipmentId">
            <editInput  :value="detailData.lockEquipmentId"  name="lockEquipmentId" type="text" @updateVal="updateinfor"  v-if = "$_has('parkingManagementLockEquipmentId')"></editInput>
            <span v-else>{{detailData.lockEquipmentId}}</span>
        </template>
        <template slot-scope="scope" slot="lockEquipmentSn">
            <editInput  :value="detailData.lockEquipmentSn" name="lockEquipmentSn" type="text" @updateVal="updateinfor" v-if = "$_has('parkingManagementLockEquipmentSn')"></editInput>
             <span v-else>{{detailData.lockEquipmentSn}}</span>
        </template>
        <template slot-scope="scope" slot="hubSn">
            <editInput  :value="detailData.hubSn"  name="hubSn" type="text" @updateVal="updateinfor" v-if = "$_has('parkingManagementHubSn')"></editInput>
           <span v-else>{{detailData.hubSn}}</span> 
        </template>
         <template slot-scope="scope" slot="lockSn">
            <editInput  :value="detailData.lockSn"  name="lockSn" type="text" @updateVal="updateinfor" v-if = "$_has('parkingManagementLockSn')"></editInput>
           <span v-else>{{detailData.lockSn}}</span> 
        </template>
     </equipment-infor>
     <record-log :recordList="list" :paginationParams ="paginationParams" @on-pageChange="pageChange"></record-log>
  </div>
</template>
<script>
import baseInfor from './baseInformation.vue'
import equipmentInfor from './equipmentInfor.vue'
import recordLog from './recordLog.vue'
import editInput from '@/components/edit-input'
import { handleDictData } from '@/utils/common'
import { inforSettings } from './inforSetting'
import mixin from '../../util'
// import paginationMixin from '@/mixins/pagination.js'
// import searchHistoryMixin from '@/mixins/search-history.js'
export default {
  components: {
    baseInfor,
    equipmentInfor,
    recordLog,
    editInput
  },
  mixins: [mixin],
  props: {
    packingInforMation: {
      default: {},
      type: Object
    }
  },
  data () {
    inforSettings
    return {
      detailData: {},
      list: [],
      paginationParams: {},
      page: 1,
      equipmentProducer: [
        {
          label: '慧泊金',
          value: 'WI'
        }
      ]
    }
  },
  methods: {
    pageChange (val) {
      this.page = val
      this.loadTableData()
    },
    updateinfor (name, updateVal) {
      let obj = {
        parkingSn: this.packingInforMation.parkingSn
      }
      if (name === 'stationId') {
        let stations = this.$refs.inputWebsite.$refs.websiteSelectionNames.newListData
        let website = stations.filter((ele) => {
          return ele.value === updateVal
        })[0]
        obj.stationSn = website.sn
        obj.stationName = website.label
      } else if (name === 'cityId') {
        let city = JSON.parse(window.sessionStorage.getItem('loginData')).cityModels.filter((ele) => {
          return ele.id === updateVal
        })
        obj.cityName = city[0].name
      } 
      obj[name] = updateVal
      this.packingEdit(obj)
    },
    packingEdit (obj) {
      this.$service.parckingEdit(obj).then((res) => {
        this.$message.success('修改成功')
        this.getPackingInfor()
        this.loadTableData()
      }).catch((res) => {
      })
    },
    getPackingInfor () {
      this.$service.packingInfor({parkingSn: this.packingInforMation.parkingSn}).then((res) => {
        this.detailData = res.data.data
        this.detailData.parkingType = this.packingTypeChange(this.detailData.parkingType)
        this.detailData.parkingStatus = this.packingStatusChange(this.detailData.parkingStatus)
        this.detailData.lockStatus = this.lockStatusChange(this.detailData.lockStatus)
        this.detailData.owner = this.ownerChange(this.detailData.owner)
        if (this.detailData.lockEquipmentOperator === 'WI') {
          this.detailData.lockEquipmentOperatorName = '慧泊金'
        }
      })
    },
    loadTableData () {
      this.$service.recordLog({parkingSn: this.packingInforMation.parkingSn}, this.page, 10).then((res) => {
        this.list = res.data.data.records ? res.data.data.records : []
        this.paginationParams = {
          pageSize: res.data.data.pageSize,
          total: res.data.data.totalElements
        }
      })
    }
  },
  mounted () {
    this.getPackingInfor()
    this.loadTableData()
  }
}
</script>
<style lang="scss">
   .packing_infor {
     .packing_record_list {
       .x-detail-block {
         border-bottom: none
       }
     }
   }
</style>
