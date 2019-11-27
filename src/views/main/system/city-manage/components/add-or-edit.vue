<template>
  <div id="city-manage-edit-or-edit">
    <!-- {{disNum}} {{addOrEditData}} -->
    <v-form :formSettings="formSettings" ref="vform" @save="submitSave" :formData="formData">
      <!-- 自定义slot -->
      <template slot="operationCity">
        <el-form label-width="130px">
          <el-form-item label="城市选择">
            <!-- 远程搜索开始 -->
            <el-select v-model="operationCityData" :no-data-text="noDataText" :disabled='disNum===2' filterable remote placeholder="请输入运营城市" clearable :remote-method="remoteMethod" @change='changeOperationCity' :loading="loading">
              <el-option v-for="item in operationCityDist" :key="item.id" :label="item.label" :value="item">
                <span style="float: left">{{ item.label }}</span>
                <span style="float: right;margin-right:20px;color: #8492a6; font-size: 13px">{{ item.mergerName }}</span>
              </el-option>
            </el-select>
            <!-- 远程搜索结束 -->
          </el-form-item>
          <div class="polygon-botton">
            <el-button type="primary" id="addPolygon">绘制围栏</el-button>
            <el-button type="primary" id="clearPolygon">清除围栏</el-button>
          </div>
          <div class="operationcity-map">
            <el-amap :zoom="15" :dragEnable="dragEnable" :center="poiResultLocation" :expandZoomRange="true" :zooms="[3,20]" :events="mapEvents" :amap-manager="amapManager" :plugin="plugin"></el-amap>
          </div>
        </el-form>
      </template>
      <template>

      </template>
    </v-form>
  </div>
</template>
<script>
import vForm from '@/components/form/vForm'
import { handlePolygonArr } from '@/utils/common' // 处理围栏数据
import { AMapManager } from 'vue-amap'
import _debounce from 'lodash/debounce'
let amapManager = new AMapManager()
export default {
  name: 'car-info-edit-or-edit',
  props: {
    disNum: Number,
    formData: Object
  },
  watch: {
    operationCityData(newItem) {
      this.mouseTool.close(true)
      this.renderFenceOk = false
      let map = amapManager.getMap()
      map.setCity(newItem.label)
    }
  },
  computed: {
    // 添加 或者编辑数据
    addOrEditData() {
      return this.formData
    }
  },
  data() {
    let self = this
    return {
      falgBit: false,
      noDataText: '加载中',
      dragEnable: true, // 是否能拖拽地图
      createdBy: this.$store.getters.user.username, // 修改人
      operationCityDist: [], // 远程获取的城市字典
      operationCityData: this.disNum === 1 ? '' : this.formData.name, // 远程搜索的v-model
      loading: false, // 远程搜索loading
      fenceArr: [], // 绘制的围栏数组
      amapManager,
      renderFenceOk: false, // 绘制围栏成功标志位
      formSettings: [
        // 自定义slot
        {
          label: '',
          slot: 'operationCity',
          items: []
        }
      ],
      mouseTool: null, // 全局调用绘图插件
      plugin: [{ pName: 'Scale' }], // 比例尺插件
      poiResultLocation: [113.625328, 34.746611], // 初始位置
      mapEvents: {
        // 初始化时加载
        init(map) {
          if (self.disNum === 2 && self.formData.name) {
            map.setCity(self.formData.name)
          } else {
            map.setCity('郑州市')
          }
          let addPolygonButton = document.getElementById('addPolygon')
          let clearPolygonButton = document.getElementById('clearPolygon')
          AMapUI.loadUI(['control/BasicControl'], BasicControl => {
            let zoomCtrl = new BasicControl.Zoom({
              position: {
                right: '10px',
                bottom: '5px'
              },
              showZoomNum: true
            })
            map.addControl(zoomCtrl)
          })
          // 围栏颜色
          let rectOptions = {
            strokeColor: '#fdd000', // 线颜色
            strokeOpacity: 1, // 线透明度
            strokeWeight: 2, // 线宽
            fillColor: '#fdd000', // 填充色
            fillOpacity: 0.3 // 填充透明度
          }
          self.polygon = new AMap.Polygon({
            map: map,
            path:
              self.disNum === 1
                ? self.fenceArr
                : self.formData.polygon ? self.formData.polygon.slice(0) : [],
            draggable: false,
            ...rectOptions
          })
          // 引入绘图插件  全局调用绘图插件
          self.mouseTool = new AMap.MouseTool(map)
          // 绘制围栏
          AMap.event.addDomListener(
            addPolygonButton,
            'click',
            () => {
              let polygonLength
              if (Object.keys(self.formData).length) {
                polygonLength = self.formData.polygon.length
              } else {
                polygonLength = null
              }
              if (self.renderFenceOk || polygonLength) {
                self.$message.warning('请先清除围栏')
                return
              }
              map.setDefaultCursor('crosshair')
              self.dragEnable = false
              self.mouseTool.polygon(rectOptions)
            },
            false
          )
          // 清除围栏
          AMap.event.addDomListener(
            clearPolygonButton,
            'click',
            () => {
              if (self.renderFenceOk) {
                self.$message.success('清除围栏成功')
              }
              map.setDefaultCursor('pointer')
              self.dragEnable = true
              self.polygon.setMap(null)
              self.mouseTool.close(true)
              self.renderFenceOk = false
              self.formData.polygon = []
            },
            false
          )
          // 绘制完成触发此事件
          self.mouseTool.on('draw', polygonData => {
            // 把坐标点传给连接坐标点插件
            let fenceArr = handlePolygonArr(polygonData.obj.G.path)
            self.$message.success('绘制围栏成功')
            map.setDefaultCursor('pointer')
            fenceArr.push(fenceArr[0])
            self.fenceArr = fenceArr
            self.dragEnable = true
            self.mouseTool.close(false) // 不让再绘制
            self.renderFenceOk = true
          })
        }
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (Object.keys(this.formData).length) {
        this.renderFenceOk = true
        this.fenceArr = this.formData.polygon
      }
    })
  },
  methods: {
    changeOperationCity(item) {
      console.log(item, 'item')
    },
    submitSave() {
      // delete this.operationCityData.mergerName
      if (!Object.keys(this.operationCityData).length) {
        this.$message.warning('请输入运营城市')
        return
      }
      if (!this.renderFenceOk) {
        this.$message.warning('请绘制围栏')
        return
      }
      if (this.disNum === 1) {
        let addData = {
          createdBy: this.createdBy,
          polygon: this.fenceArr.slice(0),
          name: this.operationCityData.label,
          id: this.operationCityData.id
        }
        console.log(addData)
        // 添加运营城市
        this.$service
          .post_operationCityAdd(addData)
          .then(res => {
            this.successTip()
          })
          .catch(error => {
            this.$message.warning(error.msg)
          })
      } else {
        let updateData = {
          createdBy: this.createdBy,
          polygon: this.fenceArr,
          name: this.formData.name,
          id: this.formData.id
        }
        this.$service
          .post_operationCityUpdate(updateData)
          .then(res => {
            this.successTip()
          })
          .catch(error => {
            this.$message.warning(error.msg)
          })
      }
    },
    successTip() {
      this.$message.success(this.disNum === 1 ? '添加运营城市成功' : '修改运营城市成功')
      this.$emit('refreshTable')
    },
    // 远程搜索 选择关键字时会调用此方法
    remoteMethod: _debounce(function (cityName) {
      if (cityName !== '') {
        this.loading = true
        this.$service.get_operationCityDist(cityName).then(res => {
          this.operationCityDist = res.data.data.map(item => {
            return {
              label: item.name,
              id: item.id, // key的唯一标识
              mergerName: item.mergerName
            }
          })
          if (!this.operationCityDist.length) {
            this.noDataText = '无数据'
          } else {
            this.noDataText = '加载中'
          }

          this.loading = false
          console.log(this.operationCityDist, 'operationCityDist')
        })
      } else {
        this.operationCityDist = []
        this.noDataText = '加载中'
      }
    }, 500)
  },
  components: {
    vForm
  }
}
</script>
<style lang="scss" >
#city-manage-edit-or-edit {
  .operationcity-map {
    margin-left: 60px;
    margin-top: 20px;
    height: 600px;
  }
  .polygon-botton {
    margin-left: 60px;
  }
}
</style>
