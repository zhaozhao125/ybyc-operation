<template>
  <div class="order-detail">
    <detail-basic :detailSettings='orderDetailSettings' :detailData="detailData" :formData="detailData">
      <template slot="latlngarr">
        <div class="geo-info">
          <el-amap
            :mapStyle='mapStyle'
            vid="amapDemo" :zoom="zoom" :center="center" class="amap-demo">
            <el-amap-marker vid="component-marker" :position="componentMarker.position" :content-render="componentMarker.contentRender" ></el-amap-marker>
            <el-amap-marker
              v-for="(marker, index) in markers"
              :key="index"
              :position="marker.position"
              :icon="marker.icon"
              :events="marker.events"
              :visible="marker.visible"
              :draggable="marker.draggable"
              :vid="index">
            </el-amap-marker>
          </el-amap>
        </div>
      </template>

      <template slot="prices_txt" slot-scope="row">
        <div v-html="row.model.prices_txt" ></div>
      </template>
      <template slot="electricityActualCost" v-if="row.model.electricityActualCost" slot-scope="row">
        <div v-html="row.model.electricityActualCost" ></div>
      </template>

    </detail-basic>
  </div>
</template>

<script>
import detailBasic from '@/components/detail/vDetail'
import {orderDetailSettings} from './detailSettings'
import siteMap from '@/components/siteMap/site-map'
import { fenchColor } from '@/config/map-config'
import { AMapManager } from 'vue-amap'
import mapConfig from '@/config/map-config'

let amapManager = new AMapManager()

const exampleComponents = {
  props: ['text'],
  template: `<div>{{text}}</div>`
}

export default {
  name: 'pile-detial',
  components: {
    detailBasic,
    siteMap
  },
  props: {
    detailData: {
      type: Object,
      required: true
    }
  },
  computed: {
    centerLocation() {
      return this.detailData.location
    }
  },
  methods: {
    problemIcon() {
      return `<img src="./static/img/website.png" class="icon"></img>`
    }
  },
  data() {
    let self = this
    return {
      zoom: 15,
      center: self.detailData.location,
      markers: [
        {
          position: self.detailData.location,
          icon: './static/img/charging.png',
          events: {
            dragend: (e) => {
              this.markers[0].position = [e.lnglat.lng, e.lnglat.lat]
            }
          },
          visible: true,
          draggable: false,
          template: '<span>1</span>'
        }
      ],
      renderMarker: {
        position: self.detailData.location,
        contentRender: (h, instance) => {
          return h(
            'div',
            {
              style: {background: '#80cbc4', whiteSpace: 'nowrap', border: 'solid #ddd 1px', color: '#f00'},
              on: {
                click: () => {
                  const position = this.renderMarker.position
                  this.renderMarker.position = [position[0] + 0.002, position[1] - 0.002]
                }
              }
            },
            ['marker inner text']
          )
        }
      },
      componentMarker: {
        position: self.detailData.location,
        contentRender: (h, instance) => h(exampleComponents, {style: {backgroundColor: '#CCC'}, props: {text: self.detailData.stationName}}, ['xxxxxxx'])
      },
      slotMarker: {
        position: self.detailData.location
      },
      formData: {},
      mapStyle: mapConfig.mapStyle[mapConfig.selectedStyle].url,
      plugin: [{ pName: 'Scale' }],
      orderDetailSettings: orderDetailSettings
    }
  }
}
</script>

<style lang="scss">
  .order-detail {
    .discount-description {
      color: $color-red;
      margin-left: 20px;
    }
    .lockLog {
      margin-left: -90px;
    }
  }
  .geo-info {
    margin: 10px 0 20px -85px;
    height: 450px;
    width: 100%;
  }
  .amap-icon{
    img{
      width: 30px;
    }
  }
</style>
