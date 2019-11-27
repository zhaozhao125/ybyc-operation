<template>
  <div id="car-info-edit-or-edit">
     <!--<pre>{{formData}}</pre>-->
    <v-form :formSettings="formSettings" @save="submitSave" ref="vform" :formData="formData" @cancel="cancelSubmit" @couponsTypeChange="couponsTypeChange" @timeChange="timeChange" @usageTypeChange="usageTypeChange" @codeTypeChange="codeTypeChange">
      <!--<template slot="cityId" slot-scope="scope">-->
      <!--<search-select v-model="scope.model.cityId" type="city" placeholder="请选择"></search-select>-->
      <!--</template>-->

      <template slot="money" slot-scope="scope">
        <el-input placeholder="" style="width: 160px" v-model="scope.model.money">
          <template slot="append">元</template>
        </el-input>
      </template>
      <template slot="useMoneyCondition" slot-scope="scope">
        <el-input placeholder="不限制" style="width: 160px" v-model="scope.model.useMoneyCondition">
          <template slot="append">元</template>
        </el-input>
        <span class="notice-text">（0代表不限制）</span>
      </template>
      <template slot="discount" slot-scope="scope">
        <el-input placeholder="0-100，例如8折输入80" style="width: 160px" v-model="scope.model.discount">
          <template slot="append">折</template>
        </el-input>
        <span class="notice-text">（0-100，例如8折输入80）</span>
      </template>
      <template slot="useMoneyTop" slot-scope="scope">
        <el-input placeholder="不限制" style="width: 160px" v-model="scope.model.useMoneyTop">
          <template slot="append">元</template>
        </el-input>
        <span class="notice-text">（0代表不限制）</span>
      </template>

      <!--使用条件-->
      <template slot="amount" slot-scope="scope">
        <el-input placeholder="不限制" style="width: 160px" v-model="scope.model.amount">
          <template slot="append">张</template>
        </el-input>
        <span class="notice-text">（0代表不限制）</span>
      </template>
      <template slot="userGainTimes" slot-scope="scope">
        <el-input placeholder="不限制" style="width: 160px" v-model="scope.model.userGainTimes">
          <template slot="append">张</template>
        </el-input>
        <span class="notice-text">（0代表不限制）</span>
      </template>
      <template slot="relativeDayNum" slot-scope="scope">
        <el-input placeholder="请输入" style="width: 160px" v-model="scope.model.relativeDayNum">
          <template slot="append">天</template>
        </el-input>
      </template>
      <!--<template slot="cityId" slot-scope="scope">-->
      <!--<city-select v-model="scope.model.cityId" @input="saveCity" :multiple=true :enableAuth=true :enableAllCity=true>-->
      <!--</city-select>-->
      <!--</template>-->
      <!--<template slot="city" slot-scope="scope">-->
        <!--<el-select v-model="scope.model.city" multiple placeholder="请选择">-->
          <!--<el-option v-for="item in provinceList" :key="item.value" :label="item.label" :value="item.label">-->
          <!--</el-option>-->
        <!--</el-select>-->
      <!--</template>-->
      <template slot="genreIdentify" slot-scope="scope">
        <el-select v-model="scope.model.genreIdentify" multiple placeholder="全部">
          <el-option v-for="(item,index) in genreList" :key="item" :label="item" :value="index">
          </el-option>
        </el-select>
      </template>
      <template slot="installRedeemCode" slot-scope="scope">
        <el-radio-group v-model="scope.model.installRedeemCode" @change="selectPlaceChange">
          <el-radio :label="false">否</el-radio>
          <el-radio :label="true">是</el-radio>
        </el-radio-group>
      </template>
      <template slot="redeemCodeCount" slot-scope="scope">
        <el-input v-if="scope.model.redeemCodeCount && formData.id" placeholder="最多10000个" :disabled="true" style="width: 160px" v-model="scope.model.redeemCodeCount">
          <template slot="append">张</template>
        </el-input>
        <el-input v-else placeholder="最多10000个" style="width: 160px" v-model="scope.model.redeemCodeCount">
          <template slot="append">张</template>
        </el-input>
        <span class="notice-text">（最多10000张）</span>
      </template>
      <!--<div>-->
      <!--<template slot="convertType" slot-scope="scope">-->
      <!--<el-select v-model="scope.model.convertType" placeholder="请选择">-->
      <!--</el-select>-->
      <!--</template>-->
      <!--</div>-->
    </v-form>
  </div>
</template>
<script>
/* eslint-disable indent */

import vForm from '@/components/form/vForm'
import searchSelect from '@/components/website-select'
import citySelect from '@/components/city-select'
import { handleDictData, handleSubmit, handleData } from '@/utils/common.js'
import websiteSelect from '@/components/website-select'
import { handleDate } from '@/utils/date-filter'
import {
  areaList,
  carModelList,
  tboxList,
  carRentList,
  carTypeList,
  addCarTypeList
} from '@/config/select-data'
export default {
  name: 'coupons-add-or-edit',
  props: {
    // 判断添加或者编辑
    disNum: {
      type: Number,
      require: true
    },
    formData: {
      type: Object,
      require: true
    },
    copyFormData: {
      type: Object,
      require: false
    },
    provinceList: {
      type: Array,
      require: false
    },
    genreList: {
      type: Object,
      require: false
    },
    carDentifying: [String, Number]
  },
  data: function() {
    return {
      getStationId: null,
      formSettings: [
        {
          label: '基本信息',
          items: [
            {
              label: '优惠券名称',
              name: 'name',
              type: 'text',
              placeholder: '',
              required: true
            },
            {
              label: '使用说明',
              name: 'detail',
              type: 'text',
              placeholder: ''
            },
            {
              label: '类型',
              type: 'select',
              name: 'usageType',
              value: 'share',
              options: [
                {
                  value: 'share',
                  label: '分时'
                },
                {
                  value: 'shortRent',
                  label: '短长租'
                },
                {
                  value: 'charge',
                  label: '充电'
                }
              ],
              events: {
                change: 'usageTypeChange'
              },
              required: true
            },
            {
              label: '优惠类型',
              type: 'select',
              name: 'type',
              value: 1,
              options: [
                {
                  value: 1,
                  label: '金额'
                },
                {
                  value: 2,
                  label: '折扣'
                }
              ],
              events: {
                change: 'couponsTypeChange'
              },
              required: true
            },
            {
              label: '可抵扣金额',
              type: 'slot',
              name: 'money',
              required: true
            },
            {
              label: '最低消费金额',
              type: 'slot',
              name: 'useMoneyCondition',
              value: 0
            },
            {
              label: '折扣',
              type: 'slot',
              name: 'discount',
              hidden: true,
              value: 0
            },
            {
              label: '最高可抵',
              type: 'slot',
              name: 'useMoneyTop',
              value: 0,
              hidden: true
            }
          ]
        },
        {
          label: '使用条件',
          items: [
            {
              label: '发行量',
              type: 'slot',
              name: 'amount',
              value: 0
            },
            {
              label: '每人限领',
              type: 'slot',
              name: 'userGainTimes',
              value: 0
            },
            {
              label: '发行有效期',
              name: 'issueTime',
              type: 'datetimerange',
              required: true,
              defaultTime:['00:00:00','23:59:59']
            },
            {
              label: '使用有效期',
              type: 'select',
              name: 'relativeTime',
              value: false,
              options: [
                {
                  value: false,
                  label: '绝对时间'
                },
                {
                  value: true,
                  label: '相对时间'
                }
              ],
              events: {
                change: 'timeChange'
              },
              required: true
            },
            {
              label: ' ',
              type: 'slot',
              name: 'relativeDayNum',
              hidden: true
            },
            {
              label: ' ',
              name: 'useTime',
              type: 'datetimerange',
              required: true,
              defaultTime:['00:00:00','23:59:59']
            },
            {
              label: '可用城市',
              type: 'city',
              name: 'cityId',
              multiple: true,
              enableAuth: true,
              enableAllCity: true,
              clearable: true,
              required:true
            },
            {
              label: '可用车型',
              type: 'slot',
              name: 'genreIdentify'
            }
          ]
        },
        {
          label: '其它信息',
          items: [
            {
              label: '是否设置兑换码',
              name: 'installRedeemCode',
              type: 'slot',
              value: false,
              options: [
                {
                  label: '否',
                  value: false
                },
                {
                  label: '是',
                  value: true
                }
              ]
            },
            {
              label: '兑换码类型',
              type: 'select',
              name: 'convertType',
              hidden: true,
              value: 1,
              options: [
                {
                  value: 1,
                  label: '固定码'
                },
                {
                  value: 2,
                  label: '随机码'
                }
              ],
              events: {
                change: 'codeTypeChange'
              }
            },
            {
              label: '兑换码',
              name: 'redeemCode',
              type: 'text',
              placeholder: '请输入字母和数字组合',
              hidden: true
            },
            {
              label: '随机码数量',
              type: 'slot',
              name: 'redeemCodeCount',
              hidden: true
            },
            {
              label: '备注',
              name: 'remark',
              type: 'textarea'
            }
          ]
        }
      ],
      websiteOneList: [] // 获取网点数据
    }
  },
  computed: {
    user() {
      return this.$store.getters.user
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (this.formData.id) {
        this.formSettings[2].items[0].hidden = true
        this.formSettings[0].items[3].disabled = true
        // 编辑
        if (this.formData.type == 2) {
          this.formSettings[0].items[4].hidden = true
          this.formSettings[0].items[5].hidden = true
          this.formSettings[0].items[6].hidden = false
          // this.formSettings[0].items[5].required = true
          // this.formSettings[0].items[6].hidden = false
          this.formSettings[0].items[7].hidden = false
        }
        if (this.formData.relativeTime) {
          // 相对时间
          this.formSettings[1].items.find(
            item => item.name == 'useTime'
          ).hidden = true
          this.formSettings[1].items.find(
            item => item.name == 'relativeDayNum'
          ).hidden = false
          this.formSettings[1].items.find(
            item => item.name == 'relativeDayNum'
          ).required = true
        }
        if (this.formData.installRedeemCode) {
          this.formSettings[2].items[1].hidden = false
          this.formSettings[2].items[1].required = true
          if (this.formData.redeemCodeCount) {
            // 随机码
            this.formSettings[2].items[2].hidden = true
            this.formSettings[2].items[3].hidden = false
            this.formSettings[2].items[3].required = true
          } else {
            // 固定码
            this.formSettings[2].items[2].hidden = false
            this.formSettings[2].items[2].required = true
            this.formSettings[2].items[3].hidden = true
          }
        }
        this.formSettings[2].items[1].disabled = true
        this.formSettings[2].items[2].disabled = true
        this.formSettings[2].items[3].disabled = true
        // 判断优惠券类型
        if (this.formData.usageType == 'charge') {
          this.formSettings[1].items[7].hidden = true
        }
        this.formSettings[0].items[2].disabled = true

        this.$refs.vform.updateRule()
      }
    })
  },
  methods: {
    codeTypeChange(type) {
      if (type == 1) {
        // 固定码
        this.formSettings[2].items[2].hidden = false
        this.formSettings[2].items[2].required = true
        this.formSettings[2].items[3].hidden = true
        delete this.$refs.vform.formModel.redeemCodeCount
      } else {
        // 随机码
        this.formSettings[2].items[2].hidden = true
        this.formSettings[2].items[3].hidden = false
        this.formSettings[2].items[3].required = true
        delete this.$refs.vform.formModel.redeemCodeCount
      }
      this.$refs.vform.updateRule()
    },
    selectPlaceChange(type) {
      if (!type) {
        // 无兑换码
        this.formSettings[2].items[1].hidden = true
        this.formSettings[2].items[2].hidden = true
        this.formSettings[2].items[3].hidden = true
        delete this.$refs.vform.formModel.redeemCodeCount
      } else {
        this.formSettings[2].items[1].hidden = false
        this.formSettings[2].items[1].required = true
        this.formSettings[2].items[2].hidden = false
        this.formSettings[2].items[2].required = true
      }
      this.$refs.vform.updateRule()
    },
    couponsTypeChange(type) {
      if (type == 1) {
        // 金额
        this.formSettings[0].items.find(
          item => item.name == 'money'
        ).hidden = false
        this.formSettings[0].items.find(
          item => item.name == 'useMoneyCondition'
        ).hidden = false
        this.formSettings[0].items.find(
          item => item.name == 'discount'
        ).hidden = true
        this.formSettings[0].items.find(
          item => item.name == 'useMoneyTop'
        ).hidden = true
      } else {
        // 折扣
        this.formSettings[0].items.find(
          item => item.name == 'money'
        ).hidden = true
        this.formSettings[0].items.find(
          item => item.name == 'useMoneyCondition'
        ).hidden = true
        this.formSettings[0].items.find(
          item => item.name == 'discount'
        ).hidden = false
        this.formSettings[0].items.find(
          item => item.name == 'discount'
        ).required = true
        this.formSettings[0].items.find(
          item => item.name == 'useMoneyTop'
        ).hidden = false
      }
      this.$refs.vform.updateRule()
    },
    usageTypeChange(type) {
      if (type == 'charge') {
        this.formSettings[1].items[7].hidden = true
      } else {
        this.formSettings[1].items[7].hidden = false
      }
    },
    timeChange(type) {
      if (type == 0) {
        // 绝对时间
        this.formSettings[1].items.find(
          item => item.name == 'useTime'
        ).hidden = false
        this.formSettings[1].items.find(
          item => item.name == 'relativeDayNum'
        ).hidden = true
      } else {
        // 相对时间
        this.formSettings[1].items.find(
          item => item.name == 'useTime'
        ).hidden = true
        this.formSettings[1].items.find(
          item => item.name == 'relativeDayNum'
        ).hidden = false
        this.formSettings[1].items.find(
          item => item.name == 'relativeDayNum'
        ).required = true
      }
      this.$refs.vform.updateRule()
    },
    getSelectItemId(id) {
      this.getStationId = id
    },
    cancelSubmit() {
      this.$emit('closeAndRefresh', 'cancel')
    },
    // 保存字段
    submitSave(addObj) {
      if(addObj.installRedeemCode){
        if(addObj.redeemCodeCount%1 !== 0){
          this.$message.warning('随机码数量必须为整数')
          return false;
        }
      }
      addObj.cityId = addObj.cityId.toString()
      addObj.cityId = addObj.cityId == '999' ? '' : addObj.cityId
      addObj.genreIdentify = addObj.genreIdentify.toString()
      if (!addObj.relativeTime) {
        // 绝对时间
        addObj.startDate = handleDate(addObj.useTime[0])
        addObj.endDate = handleDate(addObj.useTime[1])
      }
      addObj.redeemStartTime = handleDate(addObj.issueTime[0])
      addObj.redeemEndTime =
        handleDate(addObj.issueTime[1])
      console.log(addObj, '=========提交添加的字段=========')

      if (this.disNum === 1) {
        addObj.createdBy = this.user.username
        addObj.nickNameCreateBy = this.user.cnName
        this.$service
          .addCoupons(addObj)
          .then(res => {
            this.successSubmit()
          })
          .catch(error => {
            this.$message.warning(error.msg)
          })
      } else {
        addObj.id = this.formData.id
        console.log(this.user)
        addObj.modifiedBy = this.user.username
        addObj.nickNameModifiedBy = this.user.cnName
        this.$service
          .editCoupons(addObj)
          .then(res => {
            this.successSubmit()
          })
          .catch(error => {
            this.$message.warning(error.msg)
          })
      }
    },
    successSubmit() {
      this.$message({
        type: 'success',
        message: this.disNum === 1 ? '添加优惠券成功' : '编辑优惠券成功'
      })
      // 关闭页面 并且刷新列表
      this.$emit('closeAndRefresh')
    }
  },
  components: {
    vForm,
    searchSelect,
    websiteSelect,
    citySelect
  }
}
</script>
<style lang="scss" >
.el-date-editor {
  display: inline-flex !important;
}
</style>
