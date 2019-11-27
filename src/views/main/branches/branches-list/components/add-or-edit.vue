<template>
  <div id="branch-list-edit-or-edit">
    <!-- <pre> {{formData}}</pre> -->
    <v-form :formSettings="formSettings" @save="submitSave" ref="vform" :formData="formData" @rentTypeChange="rentTypeChange" @selectTypeChange="selectTypeChange">
      <!-- 运营城市 -->
      <template slot="operationCityId" slot-scope="scope">
        <search-select v-model="scope.model.operationCityId" type="city" placeholder="请选择" @selectItemId="receiveCityId"></search-select>
      </template>
      <!-- 选择片区 -->
      <template slot="districtId" slot-scope="scope">
        <el-select v-model.number="scope.model.districtId" placeholder="请选择" clearable @change="areaListItem">
          <el-option v-for="item in renderAreaList" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </template>
      <!-- 还车半径 -->
      <template slot="carOffScope" slot-scope="scope">
        <el-input placeholder="请输入还车半径" v-model.number="scope.model.carOffScope">
          <template slot="append">米</template>
        </el-input>
      </template>
      <!-- 合作网点：支付固定车位费 -->
      <template slot="payParkingFee" slot-scope="scope">
        <div class="contract-item">
          <div>
            <el-checkbox v-model="scope.model.payParkingFee" @change='handlePayParkingFee'>支付固定车位费</el-checkbox>
            <div class="operation-info-item">
              <span>车位每个</span>
              <el-input-number v-model="contractItemObj.parkingMoney" :style="itemWidth" :disabled="!scope.model.payParkingFee" size="small" :controls='false' :min='null'></el-input-number>
              <span>元/月</span>
            </div>
          </div>
        </div>
      </template>
      <!-- 合作网点：支付充电电费 -->
      <template slot="payChargeFee" slot-scope="scope">
        <div class="contract-item">
          <div>
            <el-checkbox v-model="scope.model.payChargeFee" @change="handlePayChargeFee">支付充电电费</el-checkbox>
            <div class="operation-info-item">
              <span>基础电费</span>
              <el-input-number v-model="contractItemObj.baseChargeFee" :style="itemWidth" :disabled="!scope.model.payChargeFee" size="small" :controls='false' :min='null'></el-input-number>
              <span>元/kW·h&nbsp;&nbsp;</span>
              <span>差价</span>
              <el-input-number v-model="contractItemObj.differencesChargeFee" :style="itemWidth" :disabled="!scope.model.payChargeFee" size="small" :controls='false' :min='0'></el-input-number>
              <span>元/kW·h</span>
            </div>
          </div>
        </div>
      </template>
      <!-- 合作网点：支付订单分成 -->
      <template slot="orderCommission" slot-scope="scope">
        <div class="contract-item">
          <div>
            <el-checkbox v-model="scope.model.orderCommission" @change="handleOrderCommission">支付订单分成</el-checkbox>
            <div class="operation-info-item">
              <span>佣金比例</span>
              <el-input-number v-model="contractItemObj.commissionRate" :style="itemWidth" :disabled="!scope.model.orderCommission" size="small" :controls='false' :min='null' :max='100'></el-input-number>
              <span>%</span>
            </div>
          </div>
        </div>
      </template>
      <!-- 百步亭：调离规则 -->
      <template slot="transferTime" slot-scope="scope">
        <div class="operation-info-item">
          <span>价格发生累加前</span>
          <el-input-number v-model="scope.model.transferTime" :style="itemWidth" size="small" :controls='false' :min="null"></el-input-number>
          <span>分钟调离</span>
        </div>
      </template>
      <!-- 百步亭：还车服务费 -->
      <template slot="returnCarCharge" slot-scope="scope">
        <div class="operation-info-item">
          <el-input-number v-model="scope.model.returnCarCharge" :style="itemWidth" size="small" :controls='false' :min="null"></el-input-number>
          <span>元</span>
        </div>
      </template>
      <!-- 百步亭：收费规则 -->
      <template slot="chargeRules" slot-scope="scope">
        <el-table ref="priceTable" :data="chargeRules" class="price-table" style="width: 100%">
          <el-table-column prop="startTime" label="开始时间" width="120" align="center">
            <template slot-scope="scope">
              <div class="el-form-item" data-name="startTime">
                <el-time-select size="small" placeholder="起始时间" style="width: 100px" v-model="scope.row.startTime" :picker-options="{ start: '00:00', step: '00:30', end: '24:00'}"></el-time-select>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="endTime" label="结束时间" width="120" align="center">
            <template slot-scope="scope">
              <div class="el-form-item" data-name="endTime">
                <el-time-select size="small" placeholder="结束时间" style="width: 100px" v-model="scope.row.endTime" :picker-options="{ start: '00:00', step: '00:30', end: '24:00'}"></el-time-select>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="parkingCharge" label="停车费（元）" width="150" align="center">
            <template slot-scope="scope">
              <div class="el-form-item" data-name="parkingCharge">
                <el-input-number v-model="scope.row.parkingCharge" :style="itemWidth" size="small" :controls='false' :min="null"></el-input-number>
              </div>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="120">
            <template slot-scope="scope">
              <el-button v-if="scope.$index !== 0" @click.native.prevent="deleteRow(scope.$index, chargeRules)" type="text" size="small">
                删除
              </el-button>
              <el-button v-if="scope.$index === chargeRules.length - 1 && addVisible" @click.native.prevent="addRow(scope.$index, chargeRules)" type="text" size="small">
                添加
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>

      <!-- 营业时间-->
      <template slot="openingHours" slot-scope="scope">
        <div style="display:flex">
          <el-time-select size="small" placeholder="起始时间" v-model="startOpeningHours" :picker-options="pickerOptions"> </el-time-select>
          <el-time-select size="small" placeholder="结束时间" v-model="endOpeningHours" :picker-options="{ start: '00:00', step: '00:30', end: '24:00', minTime: startOpeningHours }"> </el-time-select>
        </div>
      </template>
      <!-- 关联充电站 -->
      <template slot="chargingStation" slot-scope="scope">
        <div class="charging-station">
          <div v-if="chargingStationObj.chargingName">
            <span>{{chargingStationObj.chargingName}}</span>
            <i class="el-icon-circle-close" @click="deleteChargingStation"></i>
          </div>
          <span v-else>暂未关联</span>
          <el-button type="primary" size="small" @click="linkChargingStation">关联充电站</el-button>
        </div>
      </template>
      <!-- 充点桩 -->
      <template slot="chargingPile" slot-scope="scope">
        <div style="color:red">
          <div v-if="chargingStationObj.fastPileNum||chargingStationObj.slowPileNum">
            <span style="color:#000000">快充</span>
            <span>{{chargingStationObj.fastPileNum}}</span>
            <span style="color:#000000">慢充</span>
            <span>{{chargingStationObj.slowPileNum}}</span>
          </div>
          <span v-else>暂无充电桩</span>
        </div>
      </template>

      <!--地理信息 -->
      <template slot="geoInfo" slot-scope="scope">
        <geo-info @fenceInfo="getFenceInfo" @address='getAddress' @renderFanceSuccessOrFail='renderFanceSuccessOrFail' :formGeoInfoData="formData" :disNum="disNum" ref='geoInfo' @coordinateInfo="getCoordinateInfo" @landMark="getLandMark" @clearMapInfo="clearMapInfo" @errorInfo='getErrorInfo' @districtData='getDistrictData'>
        </geo-info>
      </template>
      <!-- 其他信息 -->
      <template slot="otherInfo" slot-scope="scope">
        <el-form label-width="135px">
          <el-form-item label="是否启用网点">
            <el-radio-group v-model="otherInfo.open">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否对app用户可见" v-show="otherInfo.open">
            <el-radio-group v-model="otherInfo.visible">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否开启送车服务">
            <el-radio-group v-model="otherInfo.sendCarService">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <!--根据送车服务判断是否显示 -->
          <div v-show="otherInfo.sendCarService">
            <el-form-item label="送车服务金额">
              <el-input placeholder="请输入送车服务金额" v-model.number="otherForm.sendCarServiceMoney" size="small"></el-input>
            </el-form-item>
            <el-form-item label="送车服务热线">
              <el-input placeholder="请输入送车服务热线" v-model="otherForm.sendCarServiceTel" size="small"></el-input>
            </el-form-item>
            <el-form-item label="送车服务时间">
              <div class="service-time">
                <el-time-select style="width:50%" size="small" placeholder="起始时间" v-model="serviceStartTime" ref='startTime' :picker-options="pickerOptions"> </el-time-select>
                <el-time-select style="width:50%" size="small" placeholder="结束时间" v-model="serviceEndTime" :picker-options="{ start: '00:00', step: '00:30', end: '24:00', minTime: serviceStartTime }"> </el-time-select>
              </div>
            </el-form-item>
            <el-form-item label="送车服务范围">
              <el-input placeholder="请输入送车服务范围" v-model.number="otherForm.sendCarServiceRange" size="small">
                <template slot="append">米</template>
              </el-input>
            </el-form-item>
          </div>
          <el-form-item label="网点描述">
            <el-input placeholder="请输入网点描述" type="textarea" v-model="otherInfo.intro"></el-input>
          </el-form-item>
          <el-form-item label="网点备注">
            <el-input placeholder="请输入网点备注" type="textarea" v-model="otherInfo.remark"></el-input>
          </el-form-item>
        </el-form>
      </template>
    </v-form>
    <searchCharging :visible.sync="chargingStationVisible" v-if="chargingStationVisible" @selectChargingStation='selectChargingStation'></searchCharging>
  </div>
</template>
<script>
import vForm from '@/components/form/vForm'
import geoInfo from './geo-info'
import searchCharging from './search-charging'
import searchSelect from '@/components/website-select'
export default {
  name: 'branch-list-edit-or-edit',
  props: {
    disNum: {
      type: Number,
      require: true
    },
    formData: {
      type: Object,
      require: true
    },
    areaList: Array,
    carDentifying: [String, Number]
  },
  data() {
    let signRule = (rule, value, callback) => {
      if (!value) {
        let errorTip
        switch (rule.field) {
          case 'carOffScope':
            errorTip = '请输入还车半径'
            break
          // case 'commissionRate':
          //   errorTip = '请输入佣金比例'
          //   break
        }
        return callback(new Error(errorTip))
      }
      if (!/^[0-9]*[1-9][0-9]*$/.test(value)) {
        callback(new Error('请输入数字'))
      } else {
        callback()
      }
    }
    let selectTimeRule = (rule, value, callback) => {
      if (!this.startOpeningHours) {
        callback(new Error('请输入起始时间'))
      } else if (!this.endOpeningHours) {
        callback(new Error('请输入结束时间'))
      } else {
        callback()
      }
    }
    let checkPayParkingFee = (rule, value, callback) => {
      if (value && !this.contractItemObj.parkingMoney) {
        callback(new Error('请输入车位费'))
      } else {
        callback()
      }
    }
    let checkPayChargeFee = (rule, value, callback) => {
      if (value) {
        if (!this.contractItemObj.baseChargeFee) {
          callback(new Error('请输入基础电费'))
        } else if (
          !this.contractItemObj.differencesChargeFee &&
          this.contractItemObj.differencesChargeFee !== 0
        ) {
          callback(new Error('请输入基础电费差价'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    let checkOrderCommission = (rule, value, callback) => {
      if (value && !this.contractItemObj.commissionRate) {
        callback(new Error('请输入佣金比例'))
      } else {
        callback()
      }
    }
    let checkChargeRules = (rule, value, callback) => {
      value = this.chargeRules
      let $priceTable = this.$refs.priceTable.$el
      let priceArr = value.map((item, index, arr) => {
        return item
      })
      let errMsg = new Set()
      priceArr.forEach((priceItem, priceIndex) => {
        Object.keys(priceItem).forEach(item => {
          if ($priceTable.querySelectorAll('.el-table__row')[priceIndex]) {
            let $item = $priceTable.querySelectorAll('.el-table__row')[priceIndex].querySelector(`[data-name=${item}]`)
            if ($item) {
              if (!priceItem[item] && priceItem[item] !== 0) {
                $item.classList.remove('is-success')
                $item.classList.add('is-error')
                errMsg.add('输入值不能为空')
                this.addVisible = false
              } else {
                $item.classList.remove('is-error')
                $item.classList.add('is-success')
              }

              let _start = this.chargeRules[0].startTime
              let _end = ''
              if (priceIndex > 0) {
                _end = this.chargeRules[priceIndex - 1].endTime
              } else {
                _end = this.chargeRules[0].endTime
              }
              if (item === 'startTime') {
                if (priceItem[item] && priceIndex > 0) {
                  let start = priceItem[item]
                  if (start !== _end) {
                    $item.classList.remove('is-success')
                    $item.classList.add('is-error')
                    errMsg.add('请输入闭合时间段')
                    this.addVisible = false
                  } else {
                    $item.classList.remove('is-error')
                    $item.classList.add('is-success')
                  }
                }
              } else if (item === 'endTime') {
                if (priceItem[item] && _start && _end) {
                  let end = priceItem[item]
                  if (!(end === _start || (_start === '00:00' && end === '24:00') || (_start === '24:00' && end === '00:00'))
                  ) {
                    this.addVisible = true
                    // console.log('_start:' + _start, '_end:' + _end, 'end:' + end)
                    if (Number(_start.replace(/:/, '.')) < Number(_end.replace(/:/, '.'))) {
                      if (Number(_start.replace(/:/, '.')) < Number(end.replace(/:/, '.')) && Number(end.replace(/:/, '.')) < Number(_end.replace(/:/, '.'))) {
                        $item.classList.remove('is-success')
                        $item.classList.add('is-error')
                        errMsg.add('该时间段已设置价格')
                        this.addVisible = false
                      } else {
                        $item.classList.remove('is-error')
                        $item.classList.add('is-success')
                      }
                    } else if (Number(_start.replace(/:/, '.')) > Number(_end.replace(/:/, '.'))) {
                      if ((Number(end.replace(/:/, '.')) > Number(_start.replace(/:/, '.')) && Number(end.replace(/:/, '.')) <= 24) ||
                        (Number(end.replace(/:/, '.')) >= 0 && Number(end.replace(/:/, '.')) < Number(_end.replace(/:/, '.')))) {
                        $item.classList.remove('is-success')
                        $item.classList.add('is-error')
                        errMsg.add('该时间段已设置价格')
                        this.addVisible = false
                      } else {
                        $item.classList.remove('is-error')
                        $item.classList.add('is-success')
                      }
                    } else {
                      this.addVisible = true
                    }
                  } else {
                    this.addVisible = false
                  }
                }
              }
            }
          }
        })
      })
      if (errMsg.size) {
        return callback(new Error(Array.from(errMsg).join(', ')))
      }
      callback()
    }
    return {
      contractType: true,
      addVisible: false,
      chargeRules: [
        {
          startTime: null,
          endTime: null,
          parkingCharge: null
        }
      ],
      pickerOptions: { start: '00:00', step: '00:30', end: '24:00' },
      userName: this.$store.getters.user.username,
      itemWidth: 'width:80px;',
      stationPersonInfo: {
        principal: '',
        principalPhone: '',
        developer: ''
      },
      contractItemObj: {
        // parkingNum: null,
        parkingMoney: null,
        baseChargeFee: null,
        differencesChargeFee: null,
        commissionRate: null
      },
      startOpeningHours: '00:00',
      endOpeningHours: '24:00',
      chargingStationVisible: false,
      chargingStationObj: {},
      districtData: {},
      fenchInfoError: false,
      areaItemObj: {},
      address: '',
      serviceStartTime: '',
      serviceEndTime: '',
      otherInfo: {
        open: this.disNum === 1 ? true : this.formData.open,
        sendCarService:
          this.disNum === 1 ? false : this.formData.sendCarService,
        remark: this.disNum === 1 ? '' : this.formData.remark,
        intro: this.disNum === 1 ? '' : this.formData.intro,
        visible: true
      },
      // 自定义的其他信息slot数据
      otherForm: {
        sendCarServiceMoney:
          this.disNum === 1 ? '' : this.formData.sendCarServiceMoney,
        sendCarServiceTel:
          this.disNum === 1 ? '' : this.formData.sendCarServiceTel,
        sendCarServiceRange:
          this.disNum === 1 ? null : this.formData.sendCarServiceRange,
        sendCarServiceTime:
          this.disNum === 1 ? '' : this.formData.sendCarServiceTime
      },
      siteList: [],
      position: [113.627646, 34.746128],
      renderAreaList: this.areaList,
      selectSiteLoading: false,
      fenceInfo: {},
      coordinateInfo: {},
      landMark: {},
      renderFanceStatue: null, // 绘制围栏失败
      formSettings: [
        {
          label: '基本信息',
          items: [
            {
              label: '网点名称',
              name: 'name',
              type: 'text',
              required: true
            },
            {
              label: '运营城市',
              name: 'operationCityId',
              type: 'slot',
              required: true
            },
            {
              label: '片区选择',
              name: 'districtId',
              type: 'slot',
              valueType: 'number',
              required: true
            },
            {
              label: '网点图片',
              name: 'imgs',
              type: 'img',
              limit: 4,
              multiple: false,
              tip: [
                '建议图片大小：300*300，最多可传4张',
                '第1张上传网点全景图',
                '第2张上传网点入口图',
                '第3张上传网点出口图',
                '第4张上传车位和充电桩图'
              ],
              required: false,
              hasTextInput: true
            },
            {
              label: '还车半径',
              name: 'carOffScope',
              type: 'slot',
              rule: [
                {
                  validator: signRule
                },
                {
                  required: true,
                  trigger: 'change,blur'
                }
              ]
            }
          ]
        },
        {
          label: '营业信息',
          items: [
            {
              label: '网点租赁类型',
              name: 'rentType',
              type: 'checkbox',
              value: ['fenshi'],
              events: {
                change: 'rentTypeChange'
              },
              required: true,
              min: 1,
              minx: 2,
              options: [
                {
                  label: '分时',
                  value: 'fenshi'
                },
                {
                  label: '短租',
                  value: 'changzu'
                }
              ]
            },
            {
              label: '网点类型',
              name: 'type',
              type: 'select',
              value: 'contract',
              options: [
                {
                  label: '合作网点',
                  value: 'contract'
                },
                {
                  label: '百步亭',
                  value: 'casual'
                }
              ],
              events: {
                change: 'selectTypeChange'
              },
              required: true
            },
            {
              label: '',
              name: 'taskCommission',
              type: 'checkbox',
              value: true,
              options: [{ value: true, label: '支付工单提成' }]
            },
            {
              label: '',
              name: 'payParkingFee',
              value: false,
              type: 'slot',
              rule: [
                {
                  validator: checkPayParkingFee,
                  trigger: 'blur',
                  required: true
                }
              ]
            },
            {
              label: '',
              name: 'payChargeFee',
              value: false,
              type: 'slot',
              rule: [
                {
                  validator: checkPayChargeFee,
                  trigger: 'blur',
                  required: true
                }
              ]
            },
            {
              label: '',
              name: 'orderCommission',
              value: false,
              type: 'slot',
              rule: [
                {
                  validator: checkOrderCommission,
                  trigger: 'blur',
                  required: true
                }
              ]
            },
            {
              label: '计费类型',
              name: 'chargeType',
              type: 'radio',
              value: 'perTimes',
              required: true,
              options: [
                {
                  label: '按次计费',
                  value: 'perTimes'
                }
              ]
            },
            {
              label: '调离规则',
              name: 'transferTime',
              type: 'slot',
              required: true
            },
            {
              label: '收费规则',
              name: 'chargeRules',
              type: 'slot',
              value: [],
              rule: [
                {
                  validator: checkChargeRules,
                  trigger: 'change,blur',
                  required: true
                }
              ]
            },
            {
              label: '还车服务费',
              name: 'returnCarCharge',
              type: 'slot',
              required: true
            },
            {
              label: '可否取物料',
              name: 'haveMateriel',
              type: 'radio',
              value: false,
              options: [
                {
                  label: '是',
                  value: true
                },
                {
                  label: '否',
                  value: false
                }
              ]
            },
            {
              label: '营业时间',
              name: 'openingHours',
              type: 'slot',
              rule: [
                {
                  required: true,
                  trigger: 'change,blur',
                  validator: selectTimeRule
                }
              ]
            },
            {
              label: '',
              name: 'selectHours',
              type: 'slot'
            },
            {
              label: '服务电话',
              name: 'phone',
              placeholder: '请输入服务电话',
              type: 'text',
              required: true
            },
            {
              label: '物理车位',
              name: 'parkings',
              type: 'number',
              controls: true,
              min: 0,
              max: 999,
              value: 1
            },
            {
              label: '最小管理车位',
              name: 'parkingsMin',
              type: 'number',
              controls: true,
              min: 0,
              max: 999,
              value: 1
            },
            {
              label: '最大管理车位',
              name: 'parkingsTop',
              type: 'number',
              controls: true,
              min: 0,
              max: 9999,
              value: 1
            },

            {
              label: '关联充电站',
              name: 'chargingStation',
              type: 'slot'
            },
            {
              label: '充电桩',
              name: 'chargingPile',
              type: 'slot'
            }
          ]
        },
        {
          label: '地理信息',
          slot: 'geoInfo',
          items: []
        },
        {
          label: '业务信息',
          items: [
            {
              label: '网点负责人',
              name: 'principal',
              type: 'text',
              placeholder: '请输入网点负责人'
            },
            {
              label: '负责人电话',
              name: 'principalPhone',
              type: 'text',
              placeholder: '请输入负责人电话'
            },
            {
              label: '网点开发人',
              name: 'developer',
              type: 'text',
              placeholder: '请输入网点开发人'
            }
          ]
        },
        {
          label: '其他信息',
          slot: 'otherInfo',
          items: []
        }
      ],
      restaurants: [],
      selectSite: []
    }
  },
  components: {
    vForm,
    searchSelect,
    geoInfo,
    searchCharging
  },
  mounted() {
    this.$nextTick(() => {
      if (this.disNum === 2) {
        this.rentTypeChange(this.formData.rentType)
        // 合作网点
        if (this.formData.contractBusiness) {
          this.$refs.vform.setData('payParkingFee', this.formData.contractBusiness.payParkingFee)
          this.$refs.vform.setData('payChargeFee', this.formData.contractBusiness.payChargeFee)
          this.$refs.vform.setData('orderCommission', this.formData.contractBusiness.orderCommission)
          this.contractItemObj.baseChargeFee = this.formData.contractBusiness.baseChargeFee
          this.contractItemObj.differencesChargeFee = this.formData.contractBusiness.differencesChargeFee
          this.contractItemObj.commissionRate = this.formData.contractBusiness.commissionRate
          this.contractItemObj.parkingMoney = this.formData.contractBusiness.parkingMoney
        }
        // 百步亭
        if (this.formData.casualBusiness) {
          this.$refs.vform.setData('chargeType', this.formData.casualBusiness.chargeType)
          this.$refs.vform.setData('transferTime', this.formData.casualBusiness.transferTime)
          this.$refs.vform.setData('returnCarCharge', this.formData.casualBusiness.returnCarCharge)
          if (this.formData.casualBusiness.perTimesChargeRules) {
            this.chargeRules = this.formData.casualBusiness.perTimesChargeRules.chargeRules
          } else {
            this.chargeRules = [{
              startTime: null,
              endTime: null,
              parkingCharge: null
            }]
          }
        }
        if (this.formData.sendCarServiceTime) {
          let timeArr = this.formData.sendCarServiceTime.split('-')
          this.serviceStartTime = timeArr[0]
          this.serviceEndTime = timeArr[1]
        }
        if (this.formData.open) {
          this.formData.visible ? (this.otherInfo.visible = true) : (this.otherInfo.visible = false)
        }
      }
      this.receiveCityId(this.formData.operationCityId)
      this.handleOperationInfo(this.formData.type)
    })
  },
  methods: {
    handleOperationInfo(type) {
      if (this.disNum === 2 && this.formData) {
        // 充电站信息
        this.chargingStationObj.chargingId = this.formData.chargingId
        this.chargingStationObj.chargingName = this.formData.chargingName
        this.chargingStationObj.fastPileNum = this.formData.fastPileNum
        this.chargingStationObj.slowPileNum = this.formData.slowPileNum
        let hoursOpenArr = this.formData.openingHours.split('-')
        this.startOpeningHours = hoursOpenArr[0]
        this.endOpeningHours = hoursOpenArr[1]
        // 合作网点默认显示
        this.selectTypeChange(type)
      } else {
        this.selectTypeChange('contract')
      }
    },
    handlePayParkingFee(t) {
      if (!t) {
        this.contractItemObj.parkingMoney = null
      }
    },
    handlePayChargeFee(t) {
      if (!t) {
        this.contractItemObj.baseChargeFee = null
        this.contractItemObj.differencesChargeFee = null
      }
    },
    handleOrderCommission(t) {
      if (!t) {
        this.contractItemObj.commissionRate = null
      }
    },
    selectTypeChange(item) {
      if (item === 'contract') {
        this.contractType = true
        this.formSettings[1].items.find(item => item.name === 'chargeType').hidden = true
        this.formSettings[1].items.find(item => item.name === 'transferTime').hidden = true
        this.formSettings[1].items.find(item => item.name === 'chargeRules').hidden = true
        this.formSettings[1].items.find(item => item.name === 'returnCarCharge').hidden = true

        this.formSettings[1].items.find(item => item.name === 'taskCommission').hidden = false
        this.formSettings[1].items.find(item => item.name === 'payParkingFee').hidden = false
        this.formSettings[1].items.find(item => item.name === 'payChargeFee').hidden = false
        this.formSettings[1].items.find(item => item.name === 'orderCommission').hidden = false
      } else if (item === 'casual') {
        this.contractType = false
        this.formSettings[1].items.find(item => item.name === 'taskCommission').hidden = true
        this.formSettings[1].items.find(item => item.name === 'payParkingFee').hidden = true
        this.formSettings[1].items.find(item => item.name === 'payChargeFee').hidden = true
        this.formSettings[1].items.find(item => item.name === 'orderCommission').hidden = true

        this.formSettings[1].items.find(item => item.name === 'chargeType').hidden = false
        this.formSettings[1].items.find(item => item.name === 'transferTime').hidden = false
        this.formSettings[1].items.find(item => item.name === 'chargeRules').hidden = false
        this.formSettings[1].items.find(item => item.name === 'returnCarCharge').hidden = false
      }
      this.$refs.vform.updateRule()
      this.$nextTick(() => {
        this.$refs.priceTable.$el.querySelectorAll('.is-error').forEach(item => {
          item.classList.remove('is-error')
        })
      })
    },
    deleteChargingStation() {
      this.chargingStationObj = {}
    },
    selectChargingStation(data) {
      this.chargingStationObj = data
    },
    // 关联充电站
    linkChargingStation() {
      this.chargingStationVisible = true
    },
    getDistrictData(data) {
      this.districtData = data
    },
    // 绘制围栏失败事件
    getErrorInfo(fenchInfoError) {
      this.fenchInfoError = fenchInfoError
    },
    areaListItem(id) {
      this.areaItemObj = this.renderAreaList.find(item => {
        return item.value === id
      })
    },
    getAddress(address) {
      this.address = address
    },
    // 获取到围栏数组
    getFenceInfo(fenceInfo) {
      this.fenceInfo = fenceInfo
    },
    // 得到坐标和周边信息
    getCoordinateInfo(coordinateInfo) {
      this.coordinateInfo = coordinateInfo
    },
    // 获取到下拉框改变的地标性建筑
    getLandMark(landMark) {
      this.landMark = landMark
    },
    renderFanceSuccessOrFail(statue) {
      this.renderFanceStatue = statue
    },
    // 清除坐标
    clearMapInfo() {
      this.fenceInfo = Object.assign({}, {})
    },
    // 获取城市的id
    receiveCityId(operationCityId) {
      if (!operationCityId) {
        this.$refs.vform.formModel.districtId = null
        this.renderAreaList = []
        return
      }
      this.$service.get_districtList(operationCityId).then(res => {
        if (!this.firstFlagBit) {
          this.firstFlagBit = true
        } else {
          this.$refs.vform.formModel.districtId = null
        }
        this.renderAreaList = res.data.data.map(item => {
          return {
            value: item.id,
            label: item.name
          }
        })
      })
    },
    // 保存
    submitSave(saveObj) {
      // if (this.fenchInfoError) {
      //   this.$message.warning('获取地理信息失败,请刷新浏览器重新载入')
      //   return
      // }
      // 验证营业信息
      if (saveObj.type === 'contract' && !(saveObj.taskCommission || saveObj.payParkingFee || saveObj.payChargeFee || saveObj.orderCommission)) {
        this.$message({
          message: '请至少选择一个合作网点收费项',
          type: 'warning'
        })
      } else if (this.addVisible) {
        this.$message({
          message: '停车费设置必须涵盖24小时',
          type: 'warning'
        })
      } else {
        //  获取到geo-info组件的验证
        this.$refs.geoInfo.$refs.validaddress.validate(valid => {
          if (valid) {
            // 删除充电桩和充电站 提交自定义的字段
            delete saveObj.chargingStation
            delete saveObj.chargingPile
            if (saveObj.type === 'contract') {
              let contractItemObjCopy = {}
              Object.keys(this.contractItemObj).forEach(item => {
                if (this.contractItemObj[item] !== null) {
                  contractItemObjCopy[item] = this.contractItemObj[item]
                }
              })
              saveObj.contractBusiness = {
                ...contractItemObjCopy,
                taskCommission: saveObj.taskCommission,
                payParkingFee: saveObj.payParkingFee,
                payChargeFee: saveObj.payChargeFee,
                orderCommission: saveObj.orderCommission
              }
            } else if (saveObj.type === 'casual') {
              saveObj.casualBusiness = {
                chargeType: saveObj.chargeType,
                chargeTypeCode: saveObj.chargeType,
                transferTime: saveObj.transferTime,
                returnCarCharge: saveObj.returnCarCharge,
                perTimesChargeRules: { chargeRules: this.chargeRules }
              }
            }
            delete saveObj.taskCommission
            delete saveObj.payParkingFee
            delete saveObj.payChargeFee
            delete saveObj.orderCommission
            delete saveObj.chargeType
            delete saveObj.chargeTypeCode
            delete saveObj.transferTime
            delete saveObj.returnCarCharge
            delete saveObj.chargeRules

            // 充电桩id
            if (this.chargingStationObj.chargingId) {
              saveObj.chargingId = this.chargingStationObj.chargingId
            }
            // 营业时间
            saveObj.openingHours = `${this.startOpeningHours}-${
              this.endOpeningHours
            }`

            if (saveObj.imgs) {
              saveObj.imgs = saveObj.imgs.map(item => {
                return item.url
              })
            }
            // 处理提交的网点租赁类型字段
            if (saveObj.rentType) {
              if (saveObj.rentType.length === 2) {
                saveObj.timeSharingStation = true
                saveObj.longRentStation = true
              } else {
                if (saveObj.rentType[0] === 'fenshi' && saveObj.rentType.length === 1) {
                  saveObj.timeSharingStation = true
                } else {
                  saveObj.longRentStation = true
                }
              }
            }
            delete saveObj.rentType
            // 如果没有开启这个网点 那么app也不展示那么app也不展示
            let submitObj = {
              ...this.stationPersonInfo,
              ...this.otherInfo,
              ...saveObj,
              ...this.fenceInfo,
              ...this.coordinateInfo,
              ...this.landMark,
              ...this.districtData
            }
            submitObj.address = this.address
            // 如果开启送车服务
            if (this.otherInfo.sendCarService) {
              this.otherForm.sendCarServiceTime = this.serviceStartTime && this.serviceEndTime ? `${this.serviceStartTime}-${this.serviceEndTime}` : ''
              submitObj.sendCarServiceMoney = this.otherForm.sendCarServiceMoney
              submitObj.sendCarServiceTime = this.otherForm.sendCarServiceTime
              submitObj.sendCarServiceTel = this.otherForm.sendCarServiceTel
              submitObj.sendCarServiceRange = this.otherForm.sendCarServiceRange
            }
            if (submitObj.imgsUploadText && submitObj.imgsUploadText.length) {
              submitObj.imgDescribe = submitObj.imgsUploadText
            }
            delete submitObj.imgsUploadText
            // 是否在app端展示和是否
            if (!this.otherInfo.open) {
              submitObj.visible = false
            }
            if (this.disNum === 1) {
              // 添加修改人
              submitObj.createdBy = this.userName
              // 添加
              this.addFence(submitObj)
            } else {
              // 编辑修改人
              submitObj.modifiedBy = this.userName
              // 编辑
              this.updataObj(submitObj)
            }
          } else {
            this.$message.warning('请输入网点地址')
            return false
          }
        })
      }
    },
    // 添加
    addFence(submitObj) {
      if (JSON.stringify(this.fenceInfo) === '{}') {
        this.$message.warning('请绘制围栏')
      } else {
        // 添加
        // console.log(submitObj, '添加')
        this.$service.post_stationAdd(submitObj).then(res => {
          this.successSubmit()
        })
      }
    },
    // 编辑
    updataObj(submitObj) {
      let fiterObj = {
        returnCarPolygon: this.formData.returnCarPolygon // 只有这一个值是动态改变的
      }
      // 如果编辑的时候绘制围栏没有改变 就从formdata也就是详情页里拿数据
      let updataObj = {}
      // 绘制围栏成功
      if (!this.renderFanceStatue) {
        // 没有修改直接提交
        if (JSON.stringify(this.fenceInfo) === '{}') {
          updataObj = { ...submitObj, ...fiterObj }
        } else {
          updataObj = submitObj
        }
        updataObj.id = this.formData.id
        // console.log(updataObj, '编辑')
        this.$service.post_stationUpdate(updataObj).then(res => {
          this.successSubmit()
        })
      } else {
        this.$message.warning('请绘制围栏')
      }
    },
    successSubmit() {
      this.$message({
        type: 'success',
        message: this.disNum === 1 ? '添加网点成功' : '编辑网点成功'
      })
      // 关闭页面 并且刷新列表
      this.$emit('closeAndRefresh')
    },
    rentTypeChange(data) {
      if (data.indexOf('changzu') !== -1) {
        this.formSettings[1].items[1].options = [
          {
            label: '合作网点',
            value: 'contract'
          }
        ]
        this.$refs.vform.setData('type', 'contract')
        this.selectTypeChange('contract')
      } else {
        this.formSettings[1].items[1].options = [
          {
            label: '合作网点',
            value: 'contract'
          },
          {
            label: '百步亭',
            value: 'casual'
          }
        ]
      }
    },
    deleteRow(index, rows) {
      rows.splice(index, 1)
      this.chargeRules = rows
      this.addVisible = true
      this.$refs.vform.updateRule()
    },
    addRow(index, rows) {
      let newArr = {
        startTime: rows[index].endTime,
        endTime: null,
        parkingCharge: null
      }
      rows.push(newArr)
      this.chargeRules = rows
      this.addVisible = false
    }
  }
}
</script>
<style lang="scss">
#branch-list-edit-or-edit {
  .select-content {
    margin-left: -65px;
    margin-top: -10px;
    .select {
      padding-right: 8px;
      color: #5a5e66;
    }
  }
  .car-service {
    margin-left: -135px;
  }
  .service-time {
    display: flex;
  }
  .charging-station {
    display: flex;
    > div {
      margin-right: 20px;
      text-align: center;
      span {
        color: #339966;
      }
      i {
        color: #f56c6c;
        cursor: pointer;
      }
    }
    > span {
      color: red;
      margin-right: 20px;
    }
  }
  .contract-item {
    > div {
      display: flex;
      flex-direction: column;
      .operation-info-item {
        margin-left: 25px;
      }
    }
  }
}
</style>
