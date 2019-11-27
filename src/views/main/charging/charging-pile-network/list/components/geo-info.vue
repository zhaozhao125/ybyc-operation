<template>
  <section id="charge-geo-info">
    <el-form ref="validaddress" label-width="130px" :lnglat="lnglat" :initaddress="initaddress">
      <el-form-item label="经纬度" :rules="[ { required: true, message: '请输入经纬度,使用逗号分割'} ]">
        <el-input placeholder="" v-model="renderLngLat"> </el-input>
      </el-form-item>
      <el-form-item label="地址" :rules="[ { required: true, message: '请输入充电站地址'} ]">
        <el-input placeholder="请输入充电站地址" v-model="address"  id="pickerInput"> </el-input>
      </el-form-item>
    </el-form>

    <div class="geo-info">
      <el-amap
        :mapStyle='mapStyle'
        :zooms="[3,20]" :events="mapEvents" :amap-manager="amapManager">
        <el-amap-marker
          :icon="marker.icon"
          :position="marker.position"
          :events="marker.events"
          :visible="marker.visible"
          :draggable="marker.draggable"
        ></el-amap-marker>
      </el-amap>
    </div>
  </section>
</template>
<script>
import { AMapManager } from 'vue-amap'
import { handlePolygonArr } from '@/utils/common' // 处理围栏数据
import mapConfig, { fenchColor } from '@/config/map-config'
let amapManager = new AMapManager()
export default {
  name: 'branch-list-geo-info',
  watch: {
    'address'(newaddress) {
      this.params.address = newaddress
      this.$emit('address', this.params)
    },
    'renderLngLat'(newValue) {
      let lnglatArr = newValue.split(',')
      this.params.lng = lnglatArr[0]
      this.params.lat = lnglatArr[1]
      this.$emit('address', this.params)
    },
    'lnglat'(newValue) {
      this.lnglatArr = newValue
    }
  },
  mounted() {
    this.renderLngLat = this.lnglat
    this.address = this.initaddress
    let lnglat = this.lnglat
    lnglat = lnglat.split(',')

    this.adcode = this.params[0]
    this.district = this.params[1]

    this.marker.position[lnglat[0], lnglat[1]]
  },
  data() {
    let self = this
    return {
      marker: {
        position: [113.670004, 34.764779],
        icon: './static/img/charging.png',
        events: {
          dragend: (e) => {
            // 删除其他的充电站点地图
            console.log('---event---: dragend')
            this.marker.position = [e.lnglat.lng, e.lnglat.lat]
          }
        },
        visible: true,
        draggable: true,
        template: '<span>1</span>'
      },
      amapManager,
      params: {
        address: '',
        lng: '',
        lat: ''
      },
      mapStyle: mapConfig.mapStyle[mapConfig.selectedStyle].url,
      poiResultLocation: [113.658075, 34.745793], // 初始位置
      renderLngLat: '',
      // 验证信息
      address: '',
      mapEvents: {
        // 初始化时加载
        init(map) {},
        click(event) {
          let { lng, lat } = event.lnglat
          self.renderLngLat = event.lnglat.L + ',' + event.lnglat.N
          self.marker.position = [lng, lat]

          var geocoder = new AMap.Geocoder({
            radius: 1000,
            extensions: 'all'
          })

          geocoder.getAddress([lng, lat], function(status, result) {
            if (status === 'complete' && result.info === 'OK') {
              if (result && result.regeocode) {
                console.dir(result)
                let address = result.regeocode.formattedAddress
                self.address = address
                self.params = {
                  address: address,
                  lng: lng,
                  lat: lat,
                  adcode: Number.parseInt(result.regeocode.addressComponent.adcode),
                  district: result.regeocode.addressComponent.district
                }

                self.$emit('address', self.params)
                self.$nextTick()
              }
            }
          })
        }
      }
    }
  },

  computed: {
  },
  props: {
    // // 传入的数据
    formGeoInfoData: {
      type: Object,
      required: false
    },
    disNum: Number,
    lnglat: String,
    initaddress: String,
    adcode_district: Array
  }
}
</script>
<style lang="scss">
  #charge-geo-info {
    .button-bolck {
      display: flex;
    }
    .name {
      text-overflow: ellipsis;
      overflow: hidden;
    }
    // 地图
    .geo-info {
      margin: 20px 100px;
      height: 450px;
      width: 100%;
    }
    .addr {
      font-size: 12px;
      color: #b4b4b4;
    }

    .highlighted .addr {
      color: #ddd;
    }
    .amap-icon{
      img{
        width: 30px;
      }

    }
  }
</style>
