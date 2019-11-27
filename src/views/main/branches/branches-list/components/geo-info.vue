<template>
  <section id="branch-list-geo-info">
    <!-- {{disNum}} -->
    <!-- {{formGeoInfoData.location}} -->
    <div class="button-bolck">
      <el-button type="primary" id="addPolygon">绘制围栏</el-button>
      <el-button type="primary" id="clearPolygon">清除围栏</el-button>
    </div>
    <div class="geo-info">
      <el-amap :zoom="15" :expandZoomRange="true" :dragEnable="dragEnable" :zooms="[3,20]" :center="poiResultLocation" :mapStyle='mapStyle' :scrollWheel="false" :events="mapEvents" :amap-manager="amapManager" :plugin="plugin"></el-amap>
    </div>
    <el-form :model="validaddress" ref="validaddress" label-width="130px">
      <el-form-item label="经纬度" prop="lngitude">
        <el-input placeholder="" v-model="renderLngLat" disabled> </el-input>
      </el-form-item>
      <el-form-item label="地址" prop="renderaddress" :rules="[ { required: true, message: '请输入网点地址'} ]">
        <el-input placeholder="请输入网点地址" v-model="validaddress.renderaddress" id="pickerInput"> </el-input>
      </el-form-item>
    </el-form>
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
    'validaddress.renderaddress'(newaddress) {
      this.$emit('address', newaddress)
    }
  },
  data() {
    let self = this
    return {
      amapManager,
      mapStyle: mapConfig.mapStyle[mapConfig.selectedStyle].url,
      mapCursor: 'Crosshair', // 地图默认鼠标样式
      dragEnable: true, // 是否能拖拽地图
      plugin: [{ pName: 'Scale' }], // 比例尺插件
      addOrUpdata: this.disNum, // 用于区别添加还是编辑
      poiResultLocation: [113.658075, 34.745793], // 初始位置
      renderlatitude: '',
      renderLngLat: '',
      // 验证信息
      validaddress: {
        renderaddress: ''
      },

      positionPicker: null, // 拿到拖拽选址组件实例
      mouseTool: null, // 注册全局绘制围栏插件实例
      polygon: null, // 绘制围栏成功时的插件实例 (连接坐标点)
      fenceArr: [], //  围栏·经纬度数组 复制数组
      renderFenceOk: false, // 绘制围栏成功标志位
      positionMark: [],
      landmarkFlagBit: false, // 是否提交地标标志位
      addressFlagBit: true,
      addIsOut: false,
      addFlagBit: true, // 编辑标志位
      lockPicker: true,
      mapEvents: {
        // 初始化时加载
        init(map) {
          setTimeout(() => {
            self.lockPicker = false
          }, 500)
          let addPolygonButton = document.getElementById('addPolygon')
          let clearPolygonButton = document.getElementById('clearPolygon')
          // 引入放大缩小工具插件
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

          let cloneFenceArr = []
          if (self.formGeoInfoData && self.formGeoInfoData.returnCarPolygon) {
            cloneFenceArr = self.formGeoInfoData.returnCarPolygon.slice(0)
          }
          self.polygon = new AMap.Polygon({
            map: map,
            path: self.addOrUpdata === 1 ? self.fenceArr : cloneFenceArr,
            draggable: false,
            ...fenchColor
          })
          map.setFitView()
          // 引入绘图插件  全局调用绘图插件
          self.mouseTool = new AMap.MouseTool(map)
          // 绘制围栏
          AMap.event.addDomListener(
            addPolygonButton,
            'click',
            resData => {
              if (self.renderFenceOk) {
                self.$message.warning('请先清除围栏')
                return
              }
              map.setDefaultCursor('crosshair')

              if (self.addOrUpdata === 2) {
                if (!self.addFlagBit) {
                  self.mouseTool.polygon(fenchColor)
                  return
                }
                self.$message.warning('请先清除围栏')
                return
              } else {
                self.mouseTool.polygon(fenchColor)
              }

              self.dragEnable = false
            },
            false
          )
          // 清除围栏
          AMap.event.addDomListener(
            clearPolygonButton,
            'click',
            () => {
              // 移除计算的围栏
              self.dragEnable = true
              if (self.renderFenceOk || self.addOrUpdata === 2) {
                self.$message.success('清除围栏成功')
              }
              map.setDefaultCursor('pointer')
              self.polygon.setMap(null)
              self.mouseTool.close(true)
              self.renderFenceOk = false
              self.fenceArr = []
              self.addOrUpdata = ''
              self.$emit('clearMapInfo')
              self.$emit('renderFanceSuccessOrFail', true)
            },
            false
          )
          // 绘制完成触发此事件
          self.mouseTool.on('draw', polygonData => {
            console.log(polygonData, '绘制完成触发此事件')
            self.mouseTool.close(false)
            map.setDefaultCursor('pointer')
            // 把坐标点传给连接坐标点插件
            let fenceArr = handlePolygonArr(polygonData.obj.G.path)
            self.fenceArr = fenceArr
            // 计算这个点是否在围栏外
            self.polygon = new AMap.Polygon({
              map: map,
              path: self.fenceArr,
              draggable: false,
              ...fenchColor,
              fillOpacity: 0 // 填充透明度
            })

            if (!self.polygon.contains(self.positionMark)) {
              self.$message.warning('围栏范围必须将坐标点包含在内')
              self.polygon.setMap(null)
              self.mouseTool.close(true)
            } else {
              self.$message.success('绘制围栏成功')
              self.renderFenceOk = true
              self.dragEnable = true
              // 把第一个坐标添加到最后
              fenceArr.push(fenceArr[0])
              self.$emit('renderFanceSuccessOrFail', false)
              self.$emit('fenceInfo', {
                returnCarPolygon: [...handlePolygonArr(fenceArr)], // 经纬度数组
                location: self.positionMark, // 经纬度
                address: self.validaddress.renderaddress // 地址
              })
            }
          })
          // 拖拽选址组件
          AMapUI.loadUI(['misc/PositionPicker'], PositionPicker => {
            const positionPicker = new PositionPicker({
              mode: 'dragMap',
              map: amapManager.getMap(),
              iconStyle: {
                // 自定义外观
                url: './static/img/website.png',
                size: [30, 35],
                ancher: [17, 31.5]
              }
            })

            // 拖拽坐标点触发事件
            positionPicker.on('success', positionResult => {
              console.log(positionResult, '坐标信息')
              let { lng, lat } = positionResult.position
              self.positionMark = [lng, lat]
              self.renderaddress = positionResult.address
              let name = positionResult.regeocode.addressComponent.district // 行政区名字
              self.$emit('districtData', {
                areaName: name,
                poi: name
              })
              //   绘制围栏是否失败
              self.$emit('errorInfo', false)
              //   console.log(name, 'poi')
              //   console.log(self.areaName, '拖拽时片区')
              //   console.log(positionResult, 'positionResult')
              // 第一次进
              if (!self.a) {
                // 添加
                if (self.addOrUpdata === 1) {
                  self.renderLngLat = self.poiResultLocation.join(',') // 经纬度
                } else {
                  self.validaddress.renderaddress = self.formGeoInfoData.address
                  if (
                    self.formGeoInfoData.location &&
                    self.formGeoInfoData.location.length
                  ) {
                    self.renderLngLat =
                      self.formGeoInfoData.location[0] +
                      ',' +
                      self.formGeoInfoData.location[1]
                  }
                }
                self.a = true
              } else {
                self.validaddress.renderaddress = positionResult.address
                self.renderLngLat =
                  positionResult.position.lng +
                  ',' +
                  positionResult.position.lat
                self.renderlatitude = positionResult.position.lat
              }
              function isMarkOut() {
                self.$emit('fenceInfo', {})
                self.polygon.setMap(null)
                self.mouseTool.close(true)
                self.$emit('renderFanceSuccessOrFail', true)
              }
              if (
                !self.lockPicker &&
                self.addOrUpdata === 2 &&
                !self.polygon.contains(self.positionMark) &&
                self.addFlagBit
              ) {
                isMarkOut()
                self.addFlagBit = false
              } else if (
                !self.polygon.contains(self.positionMark) &&
                self.renderFenceOk
              ) {
                isMarkOut()
                self.renderFenceOk = false
              } else {
                // 提交坐标信息
                let emitObj = {
                  location: self.positionMark, // 经纬度
                  address: self.validaddress.renderaddress // 地址
                }

                self.$emit('coordinateInfo', emitObj)
              }
            })
            positionPicker.on('fail', positionResult => {
              self.$message.warning('获取地理信息失败,请刷新浏览器重新载入')
              self.validaddress.renderaddress = '获取地址失败'
              self.renderLngLat = '获取经纬度失败'
              // 如果绘制失败 发送出来一个 事件
              self.$emit('errorInfo', true)
            })
            if (self.disNum === 1) {
              positionPicker.start(self.formGeoInfoData.location) // 中心坐标点
            } else {
              if (
                self.formGeoInfoData.location &&
                self.formGeoInfoData.location.length
              ) {
                positionPicker.start(self.formGeoInfoData.location) // 中心坐标点
              }
            }
            self.positionPicker = positionPicker
          })
        }
      }
    }
  },

  computed: {
    // 编辑时的围栏数组
    cloneFenceArr() {
      // 判断这个数组是否为null
      if (this.formGeoInfoData.returnCarPolygon) {
        return this.formGeoInfoData.returnCarPolygon.slice(0)
      }
    }
  },
  props: {
    // // 传入的数据
    formGeoInfoData: {
      type: Object,
      required: false
    },
    disNum: Number
  }
}
</script>
<style lang="scss">
#branch-list-geo-info {
  .button-bolck {
    display: flex;
  }
  .name {
    text-overflow: ellipsis;
    overflow: hidden;
  }
  // 地图
  .geo-info {
    margin: 20px 0;
    height: 450px;
  }
  .addr {
    font-size: 12px;
    color: #b4b4b4;
  }

  .highlighted .addr {
    color: #ddd;
  }
}
</style>
