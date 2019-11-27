<template>
  <div id="car-info-edit-or-edit">
    <!-- <pre>{{formData}}</pre> -->
    <v-form :formSettings="formSettings"
      @save="submitSave"
      ref="vform"
      :detailDataFlag="detailDataFlag"
      :pileInfo="pileInfo"
      @cancel="cancelSubmit"
      :formData="formData"
      >
      <!--地理位置-->
      <template slot="geoInfo" slot-scope="scope">
        <geo-info @address='getAddress' :lnglat="lnglat" :initaddress="address" :adcode_district="adcode_district"></geo-info>
      </template>

      <!--站位费-->
      <template slot="parkingPrice" slot-scope="scope">
         <el-row>
            <el-col :span="6">
              <!-- <template slot="append">元/小时</template> -->
              <el-row>
                <el-col :span="12"><el-input v-model.number="scope.model.parkingPrice" @change="changeMaxParkingPrice"></el-input></el-col>
                <el-col :span="12">&nbsp;元/小时</el-col>
              </el-row>
            </el-col>

            <el-col :span="1">&nbsp;</el-col>

            <el-col :span="8">
              <el-row>
                <el-col :span="6"><el-checkbox v-model="beforeHoursFreeFlag" @change="changeBeforeHoursFreeFlag">前</el-checkbox></el-col>
                <el-col :span="8">
                  <el-input
                    :disabled="disabledBeforeHoursFreeFlag"
                    v-model.number="scope.model.beforeHoursFree"
                    @change="changeBeforeHoursFreeFlag"
                  ></el-input>
                </el-col>
                <el-col :span="10">&nbsp;小时免收</el-col>
              </el-row>
            </el-col>

            <el-col :span="1">&nbsp;</el-col>

            <el-col :span="8">
              <el-row>
                <el-col :span="10"><el-checkbox v-model="maxParkingPriceFlag" @change="changeMaxParkingPriceFlag">封顶价</el-checkbox></el-col>
                <el-col :span="10">
                  <el-input placeholder="10"
                    :disabled="disabledFlag"
                    v-model.number="scope.model.maxParkingPrice"
                    @change="changeMaxParkingPrice"
                  ></el-input>
                </el-col>
                <el-col :span="4">&nbsp;元</el-col>
              </el-row>

            </el-col>

        </el-row>

      </template>
      <!--充电费用-->
      <template slot="priceArr" slot-scope="scope">

        <el-form ref="form"  label-width="135px" class="free_test">
          <el-form-item label="开始时间" style="height:30px; line-height: 30px" :required="true">
            <el-input v-model.number="startTime" min=0 max=23 placeholder="开始时间0-23">
            </el-input>
          </el-form-item>

          <el-form-item label="结束时间" style="height:30px; line-height: 30px" :required="true">
            <el-input v-model.number="endTime" min=0 max=23 placeholder="结束0-23"></el-input>
          </el-form-item>

          <el-form-item label="电费" style="height:30px; line-height: 30px" :required="true">
            <el-input v-model.number="elecprice" min=0 max=20 placeholder="电费单价不得大于20">
              <template slot="append">元/度</template>
            </el-input>
          </el-form-item>

          <el-form-item label="服务费" style="height:30px; line-height: 30px" :required="true">
            <el-input v-model.number="serviceprice" min=0 max=20 placeholder="服务费单价不得大于20">
              <template slot="append">元/度</template>
            </el-input>
          </el-form-item>

          <el-form-item label="添加费用" style="height:30px; line-height: 30px">
            <el-button class="el-icon-plus el-button--primary" size="small" @click="addmore"></el-button>
          </el-form-item>

        </el-form>

        <!--页面展示设置的服务费用-->
          <el-table v-show="priceArrFlag"
            :data="priceArr"
            style="
            width:100%;
            padding-left:124px;">
            <el-table-column
              prop="startTime"
              label="开始时间"
              width="150">
            </el-table-column>
            <el-table-column
              prop="endTime"
              label="结束时间"
              width="150">
            </el-table-column>
            <el-table-column
              prop="elecPrice"
              width="80"
              label="电费">
            </el-table-column>
            <el-table-column
              prop="servicePrice"
              width="80"
              label="服务费">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  @click="handlePriceRow(scope.$index, scope.row)">删除</el-button>
              </template>
            </el-table-column>

          </el-table>

          <el-form-item label="电费成本" style="margin-top:10px; height:30px; line-height: 30px">
            <el-input v-model.number="electricityActualCost" min=0 max=20 placeholder="电费成本单价不得大于20">
              <template slot="append">元/度</template>
            </el-input>
          </el-form-item>

      </template>
      <template slot="enabled" slot-scope="scope">
        <el-switch
          v-model="enabled"
          active-color="#13ce66"
          inactive-color="#ff4949">
        </el-switch>
      </template>

      <template slot="cityId" slot-scope="scope">
        <search-select v-model="scope.model.cityId" type="city" placeholder="请选择"></search-select>
      </template>
      <template slot="open" slot-scope="scope">
        <el-radio-group v-model="scope.model.open" @change="selectPlaceChange">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </template>
      <template slot="stationId" slot-scope="scope">
        <div v-show="scope.model.open===1" class="select-content">
          <span class="select-name">选择网点</span>
          <span class="select-website-item">
            <website-select v-model="scope.model.stationId" placeholder="请输入网点名称" isRequest @selectItemId='getSelectItemId'></website-select>
            <!-- 根据运营城市id来请求网点数据 -->
          </span>
        </div>
      </template>
    </v-form>
  </div>
</template>
<script>
import vForm from '@/components/form/vForm'
import searchSelect from '@/components/website-select'
import { handleDictData, handleSubmit, handleData } from '@/utils/common.js'
import websiteSelect from '@/components/website-select'
import siteMap from '@/components/siteMap/site-map'
import { AMapManager } from 'vue-amap'
import geoInfo from './geo-info'

import {
  carRentList
} from '@/config/select-data'
let amapManager = new AMapManager()
export default {
  name: 'pile-edit-add',
  props: {
    detailDataFlag: {
      type: Number,
      require: true
    },
    // 判断添加或者编辑
    disNum: {
      type: Number,
      require: true
    },
    pileInfo: {
      type: Object,
      require: true
    },
    copyFormData: {
      type: Object,
      require: false
    },
    carDentifying: [String, Number]
  },
  components: {
    vForm,
    searchSelect,
    websiteSelect,
    siteMap,
    geoInfo
  },

  data() {
    let self = this
    // 自定义验证规则
    let selectWebsiteRule = (rule, value, callback) => {
      if (!value) {
        if (this.$refs.vform.formModel.open === 0) {
          callback()
        } else {
          callback(new Error('请输入网点名称'))
        }
      } else {
        callback()
      }
    }
    return {
      disabledBeforeHoursFreeFlag: false,
      beforeHoursFreeFlag: true,
      electricityActualCost: '',
      disabledFlag: false,
      maxParkingPriceFlag: true,
      id: 0,
      urlApi: '',
      formData: {
        images: []
      },
      lnglat: '',
      id: 0,
      lng: '',
      lat: '',
      district: '',
      adcode: '',
      adcode_district: [],
      address: '',
      parkingPrice: '',
      priceArrFlag: false,
      amapManager,
      enabled: true,
      getStationId: null,
      priceArr: [],
      startTime: '',
      endTime: '',
      elecprice: '',
      serviceprice: '',
      formSettings: [
        {
          label: '基本信息',
          items: [
            {
              label: '站点名称',
              name: 'stationName',
              type: 'text',
              required: true,
              valueType: 'string'
            },
            {
              label: '城市',
              name: 'cityId',
              type: 'slot',
              required: true
            },
            {
              label: '网点图片',
              name: 'images',
              type: 'img',
              required: false,
              limit: 4,
              multiple: false,
              tip: '建议图片大小：300*300，最多可4传张',
              maxSize: 200
            }
          ]
        },
        {
          label: '营业信息',
          items: [
            {
              label: '站点类型',
              required: true,
              name: 'stationType',
              type: 'select',
              valueType: 'string',
              options: [
                {label: '开放站点', value: 'OPEN'},
                {label: '专用站点', value: 'SPECIAL'}
              ]
            },
            {
              label: '营业时间',
              name: 'openTime',
              type: 'text',
              required: true
            },
            {
              label: '服务电话',
              name: 'telephone',
              type: 'text',
              required: true,
              placeholder: '服务电话'
            },
            {
              label: '站位费',
              name: 'parkingPrice',
              type: 'slot',
              placeholder: '请输入站位费'
            },
            {
              label: '封顶价',
              name: 'maxParkingPrice',
              type: 'slot',
              hidden: true,
              placeholder: '请输入站位费'
            },
            {
              label: '前免收',
              name: 'beforeHoursFree',
              type: 'slot',
              value: 4,
              hidden: true
            }
          ]
        },
        {
          label: '费用设置',
          slot: 'priceArr',
          items: []
        },
        {
          label: '地理信息',
          slot: 'geoInfo',
          items: []
        },
        {
          label: '其他信息',
          items: [
            {
              label: '是否启用充电站',
              name: 'enabled',
              type: 'slot'
            },
            {
              label: '网点描述',
              name: 'stationIntro',
              type: 'textarea'
            }
          ]
        }
      ],
      websiteOneList: [] // 获取网点数据
    }
  },
  watch: {
    maxParkingPriceFlag: function(value) {
      if (value) {
        // 数据验证
        this.changeMaxParkingPrice()
      }
    },
    electricityActualCost: function(value) {
      this.checkItem('electricityActualCost', value)
    }
  },
  mounted () {
    this.initData()
  },

  methods: {
    // 字段验证
    checkItem(column, value) {
      switch (column) {
        case 'electricityActualCost':
          if (value >= 0 && value <= 20) {
            return true
          } else {
            this.$message.warning('电费成本单价不得大于20')
            return false
          }
          break

        default:
          break
      }
    },
    changeMaxParkingPrice() {
      console.dir(this.$refs.vform.formModel.maxParkingPrice)

      if (
        this.maxParkingPriceFlag === true &&
        (
          isNaN(parseInt(this.$refs.vform.formModel.maxParkingPrice)) ||
          this.$refs.vform.formModel.maxParkingPrice <= 0 ||
          this.$refs.vform.formModel.maxParkingPrice > 1000 ||
          this.$refs.vform.formModel.maxParkingPrice < this.$refs.vform.formModel.parkingPrice
        )
      ) {
        this.$message.warning('封顶价必须为在（1-999）之间且不能小于站位费单价')
        return false
      }

      return true
    },
    changeMaxParkingPriceFlag() {
      if (this.maxParkingPriceFlag) {
        // 默认的封顶价
        this.disabledFlag = false
        this.$refs.vform.formModel.maxParkingPrice = 10
      } else {
        this.disabledFlag = true
        this.$refs.vform.formModel.maxParkingPrice = 0
      }
    },
    showBeforeHoursFreeFlag() {
      if (!this.beforeHoursFreeFlag) {
        this.disabledBeforeHoursFreeFlag = true
      } else {
        this.disabledBeforeHoursFreeFlag = false
      }
    },
    changeBeforeHoursFreeFlag() {
      this.showBeforeHoursFreeFlag()

      if (this.beforeHoursFreeFlag) {
        let value = this.$refs.vform.formModel.beforeHoursFree
        if (typeof (value) === 'string' && value.length === 0) {
          this.$refs.vform.formModel.beforeHoursFree = 4
          value = 4
        }

        if (value <= 0) {
          this.$message.warning('免收站位费时长必须大于0')
          return false
        } else {
          return true
        }
      } else {
        return true
      }
    },
    formateImages(imageArray) {
      // 格式化图片信息
      if (!imageArray) {
        return false
      } else {
        let imgData = []

        for (let idx in imageArray) {
          imgData.push({
            url: imageArray[idx],
            name: imageArray[idx]
          })
        }
        return imgData
      }
    },
    initData() {
      console.info('pileinfo :')
      console.dir(this.pileInfo)
      if (this.detailDataFlag == 2) {
        this.formData.images = this.formateImages(this.pileInfo.imageArray)
        this.$refs.vform.updateForm()
        this.priceArr = this.pileInfo.prices
        if (this.priceArr.length > 0) {
          this.priceArrFlag = true
        } else {
          this.priceArrFlag = false
        }

        this.$refs.vform.formModel.stationName = this.pileInfo.stationName
        this.$refs.vform.formModel.cityId = this.pileInfo.cityId
        this.$refs.vform.formModel.stationType = this.pileInfo.stationType
        this.$refs.vform.formModel.openTime = this.pileInfo.openTime
        this.$refs.vform.formModel.telephone = this.pileInfo.telephone
        this.$refs.vform.formModel.parkingPrice = this.pileInfo.parkingPrice

        if (this.pileInfo.maxParkingPrice) {
          this.$refs.vform.formModel.maxParkingPrice = this.pileInfo.maxParkingPrice
        } else {
          this.$refs.vform.formModel.maxParkingPrice = 0
          this.maxParkingPriceFlag = false
          this.changeMaxParkingPriceFlag()
        }
        // 免单编辑页面
        if (this.pileInfo.beforeHoursFree) {
          this.$refs.vform.formModel.beforeHoursFree = this.pileInfo.beforeHoursFree
          this.beforeHoursFreeFlag = true
        } else {
          this.$refs.vform.formModel.beforeHoursFree = ''
          this.beforeHoursFreeFlag = false
        }
        // 电费成本
        if (this.pileInfo.electricityActualCost) {
          this.electricityActualCost = this.pileInfo.electricityActualCost_edit
        } else {
          this.electricityActualCost = ''
        }

        this.lat = this.pileInfo.lat
        this.lng = this.pileInfo.lng

        // 区域地理位置信息
        this.adcode_district = [this.pileInfo.adcode, this.pileInfo.district]
        this.lnglat = this.pileInfo.lng + ',' + this.pileInfo.lat
        this.address = this.pileInfo.address
        this.enabled = this.pileInfo.enabled
        this.adcode = this.pileInfo.adcode
        this.district = this.pileInfo.district

        this.$refs.vform.formModel.stationIntro = this.pileInfo.stationIntro
        this.id = this.pileInfo.id

        this.urlApi = 'edit'
      } else {
        this.urlApi = 'add'
        this.$refs.vform.formModel.maxParkingPrice = 10
      }
    },

    showMsg(msg) {
      // 信息提示
      this.$message({
        showClose: true,
        message: msg
      })
      return false
    },

    // 删除单条数据
    handlePriceRow(idx, row) {
      this.priceArr.splice(idx, 1)
    },

    // 设置对应的位置
    getAddress(params) {
      console.info('设置对应坐标')
      console.dir(params)

      this.address = params.address
      this.lng = params.lng
      this.lat = params.lat
      this.adcode = params.adcode
      this.district = params.district
    },
    cancelSubmit() {
      this.$emit('closeAndRefresh', 'cancel')
    },
    getImageUrls(images) {
      if (images.length == 0) {
        return []
      }
      let img = []
      for (let idx in images) {
        img[idx] = images[idx].url
      }
      return img
    },
    // 保存字段
    submitSave(addObj) {
      // 2018.05.22 站位 服务 电费 可以为0元
      if (this.priceArr.length <= 0) {
        this.showMsg('费用设置不能为空')
        return false
      }
      if (this.lng.length <= 0 || this.lat.length <= 0) {
        this.showMsg('经纬度不能为空')
        return false
      }
      // 站位费入库验证
      if (!this.changeMaxParkingPrice()) {
        return false
      }

      let data = {}
      if (addObj.maxParkingPrice) {
        // 存在封顶价
        data = {
          stationName: addObj.stationName,
          cityId: addObj.cityId,
          address: this.address,
          lng: this.lng,
          lat: this.lat,
          adcode: this.adcode,
          district: this.district,
          openTime: addObj.openTime,
          stationIntro: addObj.stationIntro,
          parkingPrice: addObj.parkingPrice,
          maxParkingPrice: addObj.maxParkingPrice,
          stationType: addObj.stationType,
          images: (this.getImageUrls(addObj.images)),
          prices: (this.priceArr),
          enabled: this.enabled,
          telephone: addObj.telephone,
          url: this.urlApi
        }
      } else {
        data = {
          stationName: addObj.stationName,
          cityId: addObj.cityId,
          address: this.address,
          lng: this.lng,
          lat: this.lat,
          adcode: this.adcode,
          district: this.district,
          openTime: addObj.openTime,
          stationIntro: addObj.stationIntro,
          parkingPrice: addObj.parkingPrice,
          stationType: addObj.stationType,
          images: (this.getImageUrls(addObj.images)),
          prices: (this.priceArr),
          enabled: this.enabled,
          telephone: addObj.telephone,
          url: this.urlApi
        }
      }

      // 充电成本费
      let electricityActualCostRes = this.checkItem('electricityActualCost', this.electricityActualCost)
      if (!electricityActualCostRes) {
        return false
      }
      if (this.electricityActualCost) {
        data.electricityActualCost = this.electricityActualCost
      }
      // 前X小时站位费免收
      let beforeHoursFreeFlagRes = this.changeBeforeHoursFreeFlag()
      if (!beforeHoursFreeFlagRes) {
        return false
      }
      if (this.beforeHoursFreeFlag && this.$refs.vform.formModel.beforeHoursFree) {
        data.beforeHoursFree = this.$refs.vform.formModel.beforeHoursFree
      }

      if (this.urlApi == 'edit') {
        // 编辑时添加主键
        data.id = this.id
      }

      console.dir(data)
      this.$service
        .addChargingPileNetwork(data)
        .then(res => {
          this.successSubmit()
        })
        .catch(error => {
          this.$message.warning(error.msg)
        })
    },

    _checkAddPriceRule(row, lastNodes) {
      if (
        (row.startTime != 0 && !row.startTime) ||
          !row.endTime
      ) {
        return this.showMsg('添加数据不能为非法数字且不能为空！！！')
      }

      // row 添加的数据时间 检测
      if (row.elecprice > 20 || row.elecprice < 0) {
        return this.showMsg('电费单价必须小于20')
      }
      if (row.serviceprice > 20 || row.serviceprice < 0) {
        return this.showMsg('服务费单价必须小于20')
      }
      if (row.startTime < 0 || row.startTime > 23) {
        return this.showMsg('开始时间必须在 0-23 之间')
      }
      if (row.endTime < 0 || row.endTime > 23 || row.startTime >= row.endTime) {
        return this.showMsg('结束时间必须在 0-23 之间 且必须大于开始时间')
      }
      if (
        (row.elecprice % 1 !== 0 && row.elecprice.toString().split('.')[1].length > 2) ||
          ((row.serviceprice % 1 !== 0) && (row.serviceprice.toString().split('.')[1].length > 2))
      ) {
        return this.showMsg('电费/服务费单价保留2位小数')
      }

      if (JSON.stringify(lastNode) == '{}') {
        return row
      }

      let lastNode = []
      // 全部节点验证
      for (let idx in lastNodes) {
        lastNode = lastNodes[idx]
        // 交集判断
        if (
          (row.startTime >= lastNode.startTime && row.startTime <= lastNode.endTime) ||
            (row.endTime >= lastNode.startTime && row.endTime <= lastNode.endTime) ||
            (lastNode.endTime >= row.startTime && lastNode.endTime <= row.endTime) ||
            (lastNode.endTime >= row.startTime && lastNode.endTime <= row.endTime)
        ) {
          return this.showMsg('设置的时间段区间存在交集')
        }
      }

      return row
    },
    addmore() {
      console.dir('添加一组新的选项')
      let row = {
        elecprice: parseFloat(this.elecprice),
        serviceprice: parseFloat(this.serviceprice),
        startTime: parseInt(this.startTime),
        endTime: parseInt(this.endTime)
      }
      let lastNode = {}
      if (this.priceArr.length > 0) {
        lastNode = this.priceArr[this.priceArr.length - 1]
      }

      data = this._checkAddPriceRule(row, this.priceArr)

      if (!data) {
        return false
      }

      let data = {
        startTime: parseInt(this.startTime),
        endTime: parseInt(this.endTime),
        elecPrice: parseFloat(this.elecprice).toFixed(2),
        servicePrice: parseFloat(this.serviceprice).toFixed(2)
      }

      this.priceArrFlag = true
      this.priceArr.push(data)
    },

    // 页面提示 + 触发父级事件
    successSubmit(msg = {type: 'success', msg: '操作成功'}, fatherEvent = 'closeAndRefresh') {
      this.$message({
        type: msg.type,
        message: msg.msg
      })
      // 关闭页面 并且刷新列表
      this.$emit(fatherEvent)
    },
    selectPlaceChange(item) {
      if (item === 0) {
        this.$refs.vform.$refs.vForm.clearValidate()
      }
    }
  }

}
</script>
<style lang="scss" >
  #car-info-edit-or-edit {
    .free_test {
      .el-form-item {
        .el-form-item__label {
          line-height:40px
        }
        .el-input__inner {
          height:32px;
          line-height:32px
        }
      }
    }
    .select-content {
      display: flex;
      margin-left: -65px;
      margin-top: -10px;
      .select-name {
        padding-right: 8px;
        color: #5a5e66;
        white-space: nowrap;
      }
      .select-website-item {
        width: 100%;
      }
      .el-select {
        width: 100%;
      }
    }
  }
  .amap-demo {
    height:300px;
    width:1000px;
  }
  .fixWid{
    width: 214px;
    display: inline-block;
    text-align: center;
  }

</style>
