<template>
  <div id="branches-list-detail">
    <!-- <pre> {{detailData}}</pre> -->
    <detail-basic :detailSettings='detailSettings' :data="detailData" detailWidth='width:600px'>
      <span slot="area" v-if="detailData.provinceName||detailData.cityName">{{detailData.provinceName+'-'+detailData.cityName}} </span>
      <!-- 经纬度 -->
      <span slot="location" v-if="detailData.location">{{detailData.location[0]+","+detailData.location[1]}}</span>
      <!-- is启用网点 -->
      <template slot="open">
        <span v-if="detailData.open">启用</span>
        <span v-else>禁用</span>
      </template>
      <template slot="visible">
        <span v-if="detailData.visible">是</span>
        <span v-else>否</span>
      </template>
      <span slot="commissionRate" v-if="detailData.commissionRate">{{detailData.commissionRate}}&nbsp;%</span>
      <template slot="sendCarService">
        <span v-if="detailData.sendCarService">是</span>
        <span v-else>否</span>
      </template>
      <template slot="fastPileNum">
        <span v-if="detailData.fastPileNum !== undefined">快充：{{detailData.fastPileNum}}&nbsp;&nbsp;</span>
        <span v-if="detailData.slowPileNum !== undefined">慢充：{{detailData.slowPileNum }}</span>
      </template>
      <template slot="type">
        <div v-if="!(detailData.commissionRate== undefined&&detailData.type)">
          <span>合作网点&nbsp;&nbsp;</span>
        </div>
        <div v-if="detailData.type==='contract'">
          <span>合作网点</span>
        </div>
        <div v-else-if="detailData.type==='casual'">
          <span>百步亭</span>
        </div>
      </template>
      <!-- 合作网点 -->
      <template slot="contractBusiness" v-if="detailData.contractBusiness">
        <div>
            <p v-show="detailData.contractBusiness.taskCommission">
              <span>收取工单提成</span>
            </p>
            <p v-show="detailData.contractBusiness.payParkingFee">
              <span>收取固定车位费</span>
              <span>车位每个{{detailData.contractBusiness.parkingMoney}}元/月</span>
            </p>
            <p v-show="detailData.contractBusiness.payChargeFee">
              <span>收取充电电费</span>
              <span>基础电费{{detailData.contractBusiness.baseChargeFee}}/kW·h</span>
              <span>差价{{detailData.contractBusiness.differencesChargeFee}}元/kW·h</span>
            </p>
            <p v-show="detailData.contractBusiness.orderCommission">
              <span>收取订单分成</span>
              <span>佣金比例{{detailData.contractBusiness.commissionRate}}%</span>
            </p>
          </div>
      </template>
      <!-- 百步亭 -->
      <template slot="chargeTypeName" v-if="detailData.casualBusiness">
        <span>{{detailData.casualBusiness.chargeTypeName}}</span>
      </template>
      <template slot="transferTime" v-if="detailData.casualBusiness">
        <span>价格发生累加前{{detailData.casualBusiness.transferTime}}分钟调离</span>
      </template>
      <template slot="chargeRules" v-if="detailData.casualBusiness">
        <div v-if="detailData.casualBusiness.perTimesChargeRules">
          <el-table :data="detailData.casualBusiness.perTimesChargeRules.chargeRules" class="price-table" style="width: 100%">
          <el-table-column prop="startTime" label="开始时间" width="120" align="center"></el-table-column>
          <el-table-column prop="endTime" label="结束时间" width="120" align="center"></el-table-column>
          <el-table-column prop="parkingCharge" label="停车费（元）" width="150" align="center"></el-table-column>
        </el-table>
        </div>
      </template>
      <template slot="returnCarCharge" v-if="detailData.casualBusiness">
        <span>{{detailData.casualBusiness.returnCarCharge}}元</span>
      </template>
      <template slot="websiteCar">
        <span>分时车辆数：{{detailData.carNum}}，</span>
        <span>app显示车辆数：{{detailData.appCarNum}}，</span>
        <span>短租车辆数：{{detailData.longCarNum}}</span>
      </template>
      <!-- 地图 -->
      <template slot="returnCarPolygon">
        <div class="geo-info">
          <el-amap :zoom="18" :expandZoomRange="true" :zooms="[3,20]" :scrollWheel='false' :center="centerLocation" :events="mapEvents" :amap-manager="amapManager" :plugin="plugin" :mapStyle='mapStyle'>
            <el-amap-marker :position='centerLocation' :content="problemIcon()" zIndex="1000"></el-amap-marker>
          </el-amap>
        </div>
      </template>
    </detail-basic>
  </div>
</template>
<script>
import detailBasic from '@/components/detail/v-detail'
import { detailSettings } from './data'
import { AMapManager } from 'vue-amap'
import mapConfig, { fenchColor } from '@/config/map-config'
// import { handleWebsiteType } from "@/utils/common";
let amapManager = new AMapManager()
export default {
  name: 'branches-list-detail',
  props: {
    detailData: {
      type: Object,
      required: true
    }
  },
  data() {
    let self = this
    return {
      mapStyle: mapConfig.mapStyle[mapConfig.selectedStyle].url,
      plugin: [{ pName: 'Scale' }],
      amapManager,
      detailSettings: detailSettings,
      mapEvents: {
        init(map) {
          AMapUI.loadUI(['control/BasicControl'], BasicControl => {
            let zoomCtrl = new BasicControl.Zoom({
              position: {
                right: '10px',
                bottom: '10px'
              },
              showZoomNum: true
            })
            map.addControl(zoomCtrl)
          })
          // map.setFitView()// 地图自适应
          // console.log('围栏数据', self.detailData.returnCarPolygon)
          let polygon = new AMap.Polygon({
            map: map,
            path: [...self.detailData.returnCarPolygon],
            draggable: false,
            ...fenchColor
          })
          polygon.setMap(map)
          map.setFitView()
        }
      }
    }
  },
  methods: {
    problemIcon() {
      return `<img src="./static/img/website.png" class="icon"></img>`
    }
    // websiteType(type) {
    //     return handleWebsiteType(type);
    // }
  },
  computed: {
    centerLocation() {
      if (this.detailData.location && this.detailData.location.length) {
        return this.detailData.location
      } else {
        return [113.658075, 34.745793]
      }
    }
  },
  mounted() {
    if (this.detailData.type === 'casual') {
      this.detailSettings[1].items.find(item => item.value === 'chargeTypeName').hidden = true
      this.detailSettings[1].items.find(item => item.value === 'transferTime').hidden = true
      this.detailSettings[1].items.find(item => item.value === 'chargeRules').hidden = true
      this.detailSettings[1].items.find(item => item.value === 'returnCarCharge').hidden = true
    }
  },
  components: {
    detailBasic
  }
}
</script>
<style lang='scss'>
#branches-list-detail {
  .icon {
    // width: 41px;
    object-fit: contain;
    object-position: center;
    width: 100%;
    width: 27px;
  } // 地图
  .geo-info {
    margin: 10px 0 20px -85px;
    height: 450px;
    width: 600px;
  }
}
</style>
