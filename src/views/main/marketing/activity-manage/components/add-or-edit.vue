<template>
  <div id="car-info-edit-or-edit">
     <!--<pre>{{formData}}</pre>-->
    <v-form :formSettings="formSettings" @save="submitSave" ref="vform" :formData="formData" @cancel="cancelSubmit" @activityTypeChange="activityTypeChange" @timeChange="timeChange" @usageTypeChange="usageTypeChange" @codeTypeChange="codeTypeChange">

      <template slot="money" slot-scope="scope">
        <el-input placeholder="" style="width: 160px" v-model="scope.model.money">
          <template slot="append">元</template>
        </el-input>
      </template>
      <template slot="joinCount" slot-scope="scope">
        <el-input placeholder="不限制" style="width: 160px" v-model="scope.model.joinCount">
          <template slot="append">次</template>
        </el-input>
        <span class="notice-text">（0代表不限制）</span>
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
      <template slot="randomRedeemCodeCount" slot-scope="scope">
        <el-input v-if="scope.model.randomRedeemCodeCount && formData.id" placeholder="最多5000个" :disabled="true" style="width: 160px" v-model="scope.model.randomRedeemCodeCount">
          <template slot="append">张</template>
        </el-input>
        <el-input v-else placeholder="最多5000个" style="width: 160px" v-model="scope.model.randomRedeemCodeCount">
          <template slot="append">个</template>
        </el-input>
        <span class="notice-text">（最多5000个）</span>
      </template>
      <template slot="couponsList" slot-scope="scope">
        <a style="color: #5badfc" href="javascript:" @click="showAddCoupons">添加优惠券</a>
        <template>
          <el-table
            :data="couponsList"
            style="width: 100%"
            max-height="250">
            <el-table-column
              fixed
              prop="couponsName"
              label="优惠券"
              >
            </el-table-column>
            <el-table-column
              prop="couponsCount"
              label="数量"
              width="150">
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="120">
              <template slot-scope="scope">
                <el-button
                  @click.native.prevent="deleteRow(scope.$index, couponsList)"
                  type="text"
                  size="small">
                  移除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </template>
    </v-form>
    <!-- 添加优惠券开始-->
    <div class="dialog-contant">
      <el-dialog :append-to-body = "dialogVisible" :visible.sync='dialogVisible' title='添加优惠券' v-if="dialogVisible" width='35%'>
        <div class="v-form">
          <v-form :formSettings="couponsFormSettings" @save="couponsSave" :formData = "couponsData" @cancel="cancelCoupons">
            <template slot="couponsName" slot-scope="scope">
              <div class="select-content">
                <website-select ref="website" v-model="scope.model.couponsName"  placeholder="请输入优惠券" isRequest ></website-select>
              </div>
            </template>
            <template slot="couponsCount" slot-scope="scope">
              <el-input style="width: 160px" v-model="scope.model.couponsCount">
                <template slot="append">张</template>
              </el-input>
            </template>
          </v-form>
        </div>
      </el-dialog>
    </div>
    <!-- 添加优惠券结束 -->

  </div>
</template>
<script>
import vForm from '@/components/form/vForm'
import searchSelect from '@/components/website-select'
import citySelect from '@/components/city-select'
import { handleDictData, handleSubmit, handleData } from '@/utils/common.js'
import websiteSelect from './coupons-list-select'
import { handleDate } from '@/utils/date-filter'
export default {
  name: 'activity-add-or-edit',
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
    }
  },
  data: function() {
    return {
      dialogVisible:false,
      couponsData:null,
      couponsList: [],
      couponsFormSettings: [
        {
          label: '',
          items: [{
            label: '优惠券名',
            name: 'couponsName',
            type: 'slot',
            required: true
          },{
            label: '数量',
            name: 'couponsCount',
            type: 'number',
            required: true,
            value:1,
            append:'张'
            }]
        }
      ],
      formSettings: [
        {
          label: '基本信息',
          items: [
            {
              label: '活动名称',
              name: 'activityTitle',
              type: 'text',
              placeholder: '',
              required: true
            },
            {
              label: '活动编号',
              name: 'activityCode',
              type: 'text',
              placeholder: '',
              required: true
            },
            {
              label: '活动时间',
              name: 'activityTime',
              type: 'datetimerange',
              required: true,
              defaultTime:['00:00:00','23:59:59']
            },
            {
              label: '领券方式',
              type: 'select',
              name: 'rewardWay',
              value: 'H5',
              options: [
                {
                  value: 'H5',
                  label: 'H5领券'
                },
                {
                  value: 'redeemCode',
                  label: '兑换码领券'
                },
                {
                  value: 'system',
                  label: '系统发放'
                }
              ],
              events: {
                change: 'activityTypeChange'
              },
              required: true
            },
            {
              label: '可参与次数',
              type: 'slot',
              name: 'joinCount',
              value: 1,
              required: true
            },
            {
              label: '活动对象',
              type: 'select',
              name: 'activityRule',
              value: 'all',
              options: [
                {
                  value: 'all',
                  label: '不限'
                },
                {
                  value: 'new',
                  label: '新用户'
                },
                {
                  value: 'old',
                  label: '老用户'
                }
              ],
              required: true
            },
            {
              label: '兑换码类型',
              type: 'select',
              name: 'redeemCodeType',
              hidden: true,
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
              label: '兑换码#',
              name: 'redeemCode',
              type: 'text',
              placeholder: '请输入字母和数字组合',
              hidden: true
            },
            {
              label: '随机码数量',
              type: 'slot',
              name: 'randomRedeemCodeCount',
              hidden: true
            },
            {
              label: '优惠券包',
              type: 'slot',
              name: 'couponsList',
              hidden: false,
              required: true
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

    })
  },
  methods: {
    deleteRow(index, rows) {
      rows.splice(index, 1);
    },
    couponsSave(couponsObj){
      if(couponsObj.couponsCount == 0){
        this.$message.warning('优惠券数量不能为0')
        return false
      }
      if(couponsObj.couponsCount%1 !== 0){
        this.$message.warning('优惠券数量必须为整数')
        return false
      }
      let couponsInfo = couponsObj.couponsName.split('%|%')
      if(Number(couponsInfo[2]) != 0){
        if(couponsObj.couponsCount >= couponsInfo[2]){
          this.$message.warning('必须小于发行量')
          return false
        }
      }
      if(Number(couponsInfo[3]) != 0){
        if(couponsObj.couponsCount > couponsInfo[3]){
          this.$message.warning('必须小于等于限领张数')
          return false
        }
      }
      let hasId = false
      for(let i = 0;i < this.couponsList.length;i++){
        if(couponsInfo[1] == this.couponsList[i].couponsId){
          hasId = true
        }
      }

      if(hasId){
        this.$message.warning('请勿重复添加')
        return false
      }

      this.couponsList.push({
        'couponsName': couponsInfo[0],
        'couponsId': couponsInfo[1],
        'couponsCount': couponsObj.couponsCount
      })
      this.$refs.vform.setData('couponsList', this.couponsList);
      this.dialogVisible = false
    },
    showAddCoupons(){
      this.dialogVisible = true
    },
    cancelCoupons(){
    },
    codeTypeChange(type) {
      if (type == 1) {
        // 固定码
        this.formSettings[0].items[7].hidden = false
        this.formSettings[0].items[7].required = true
        this.formSettings[0].items[8].hidden = true
        delete this.$refs.vform.formModel.randomRedeemCodeCount
      } else {
        // 随机码
        this.formSettings[0].items[8].hidden = false
        this.formSettings[0].items[7].hidden = true
        this.formSettings[0].items[8].required = true
        delete this.$refs.vform.formModel.randomRedeemCodeCount
      }
      this.$refs.vform.updateRule()
    },
    activityTypeChange(type) {
      if (type == 'H5') {
        // H5活动
        this.formSettings[0].items.find(
          item => item.name == 'activityRule'
        ).hidden = false

        this.formSettings[0].items.find(
          item => item.name == 'redeemCodeType'
        ).hidden = true
        this.$refs.vform.formModel.redeemCodeType = 1
        this.formSettings[0].items.find(
          item => item.name == 'redeemCode'
        ).hidden = true
        this.formSettings[0].items.find(
          item => item.name == 'joinCount'
        ).hidden = false
        this.formSettings[0].items.find(
          item => item.name == 'randomRedeemCodeCount'
        ).hidden = true

      } else if(type == 'redeemCode') {
        // 兑换码
        this.formSettings[0].items.find(
          item => item.name == 'activityRule'
        ).hidden = true

        this.formSettings[0].items.find(
          item => item.name == 'redeemCodeType'
        ).hidden = false
        this.formSettings[0].items.find(
          item => item.name == 'redeemCodeType'
        ).required = true
        this.formSettings[0].items.find(
          item => item.name == 'redeemCode'
        ).hidden = false
        this.formSettings[0].items.find(
          item => item.name == 'redeemCode'
        ).required = true
        this.formSettings[0].items.find(
          item => item.name == 'joinCount'
        ).hidden = false

      }else{
        //系统发放
        this.formSettings[0].items.find(
          item => item.name == 'activityRule'
        ).hidden = true
        this.formSettings[0].items.find(
          item => item.name == 'redeemCodeType'
        ).hidden = true
        this.$refs.vform.formModel.redeemCodeType = 1
        this.formSettings[0].items.find(
          item => item.name == 'redeemCode'
        ).hidden = true
        this.formSettings[0].items.find(
          item => item.name == 'randomRedeemCodeCount'
        ).hidden = true
        this.formSettings[0].items.find(
          item => item.name == 'joinCount'
        ).hidden = true
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
    cancelSubmit() {
      this.$emit('closeAndRefresh', 'cancel')
    },
    // 保存字段
    submitSave(addObj) {
      if(addObj.rewardWay == 'redeemCode' && addObj.redeemCodeType == 1){
        if(!isNaN(addObj.redeemCode)){
          this.$message.warning('固定码必须为字母或字母数字组合')
          return false
        }
      }
      addObj.startTime = handleDate(addObj.activityTime[0])
      addObj.endTime = handleDate(addObj.activityTime[1])
      if(addObj.rewardWay == 'H5'){
        //拼接url
        addObj.link = 'http://test.1byongche.cn/h5/activity/'+addObj.activityCode
      }
      console.log(addObj, '=========提交添加的字段=========')

      if (this.disNum === 1) {
        addObj.createdBy = this.user.username
        // addObj.nickNameCreateBy = this.user.cnName
        this.$service
          .addActivity(addObj)
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
        message: this.disNum === 1 ? '添加活动成功' : '编辑活动成功'
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
