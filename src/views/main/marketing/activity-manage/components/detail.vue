<template>
  <div id="coupons-info-detail">
    <detail-basic :detailSettings='detailSettings' :data="detailData">
      <!--<span slot="area" v-if="detailData.cityName">{{detailData.cityName}} </span>-->
      <!--<span slot="rentTypeCode" v-if="detailData.rentTypeCode===1">分时</span>-->
      <!--<span slot="rentTypeCode" v-if="detailData.rentTypeCode===3">长租</span>-->
      <!--<template slot="carEngineNumber">-->
      <!--<a :href="erWeiMaUrl" :download="erweimaName" style="color:#5dade2">下载二维码</a>-->
      <!--</template>-->
      <template slot="type">
        <div v-if="detailData.type == 1">
          <div>金额</div>
          <div>{{detailData.money}}元
            <span v-if="detailData.useMoneyCondition != 0">（满{{detailData.useMoneyCondition}}元可用）</span>
          </div>
        </div>
        <div v-if="detailData.type == 2">
          <div>折扣</div>
          <div>{{detailData.discount/10}}折
            <span v-if="detailData.useMoneyTop != 0">（最高可抵{{detailData.useMoneyTop}}元）</span>
          </div>
        </div>
      </template>
      <template slot="userGainTimes">
        <div v-if="detailData.join_count != 0">
          <div>{{detailData.join_count}}次</div>
        </div>
        <div v-else>
          不限制
        </div>
      </template>
      <template slot="issueTime">
        <div>{{detailData.start_time}} 至 {{detailData.end_time}}</div>
      </template>
      <template slot="relativeTime">
        <div v-if="detailData.relativeTime">
          {{detailData.relativeDayNum}}天
        </div>
        <div v-else>
          {{detailData.startDate}} 至 {{detailData.endDate}}
        </div>
      </template>
      <!--<template slot="installRedeemCode">-->
      <!--<div v-if="detailData.installRedeemCode">是</div>-->
      <!--<div v-else>否</div>-->
      <!--</template>-->
      <template slot="isRedeemCodeCount">
        <div v-if="detailData.redeem_code_type == 2">
          随机码
        </div>
        <div v-else>
          固定码
        </div>
      </template>
      <template slot="redeemCodeCount" v-if="detailData.random_redeem_code_count">
        {{detailData.random_redeem_code_count}}个&nbsp;&nbsp;
        <a href="javascript:" @click="exportCode(detailData.activity_code)">导出随机码</a>
      </template>
      <template slot="couponsList">
        <template>
          <el-table
            :data="couponsList"
            style="width:55%"
            max-height="450">
            <el-table-column
              fixed
              prop="coupons_name"
              label="优惠券"
              width="600px"
            >
            </el-table-column>
            <el-table-column
              prop="count"
              label="数量">
            </el-table-column>
          </el-table>
        </template>
      </template>
      <template slot="createdBy">
        <span v-if="detailData.nickNameCreateBy">{{detailData.nickNameCreateBy}}</span>
        <span v-if="detailData.createdBy">({{detailData.createdBy}})</span>
      </template>
      <template slot="modifiedBy">
        <span v-if="detailData.nickNameModifiedBy">{{detailData.nickNameModifiedBy}}</span>
        <span v-if="detailData.modifiedBy">({{detailData.modifiedBy}})</span>
      </template>
    </detail-basic>
  </div>
</template>
<script>
  import detailBasic from '@/components/detail/v-detail'
  // import { detailSettings } from './data'
  export default {
    name: 'activity-info-detail',
    props: {
      detailData: {
        type: Object,
        required: true
      },
      id: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        couponsList:[],
        detailSettings:  [
          {
            label: '',
            items: [
              {
                label: '活动编号',
                value: 'activity_code'
              },
              {
                label: '活动名称',
                value: 'activity_title'
              },
              {
                label: '活动有效期',
                name: 'issueTime',
                type: 'slot'
              },
              {
                label: '领取方式',
                value: 'reward_way',
                map: {
                  'H5': 'H5领券',
                  'redeemCode': '兑换码领券',
                  'system': '系统发放'
                }
              },
              {
                label: '可参加次数',
                name: 'userGainTimes',
                value: 'activity_rule',
                autoHide: true,
                type: 'slot'
              },
              {
                label: '活动对象',
                value: 'activity_rule',
                autoHide: true,
                map: {
                  'all': '不限',
                  'new': '新用户',
                  'old': '老用户'
                }
              },
              {
                label: '兑换码类型',
                value: 'redeem_code_type',
                name: 'isRedeemCodeCount',
                autoHide:true,
                type: 'slot'
              },
              {
                label: '兑换码',
                value: 'redeem_code',
                autoHide: true
              },
              {
                label: '随机码数量',
                value: 'random_redeem_code_count',
                name: 'redeemCodeCount',
                autoHide: true,
                type: 'slot'
              },
              {
                label: 'H5地址',
                value: 'link',
                autoHide: true
              },
              {
                label: '优惠券包',
                name: 'couponsList',
                type: 'slot'
              },
              {
                label: '备注',
                value: 'remark'
              },
              {
                label: '创建人',
                value: 'created_by'
              },
              {
                label: '创建时间',
                value: 'created_on'
              },
              {
                label: '最后修改人',
                value: 'modified_by'
              },
              {
                label: '最后修改时间',
                value: 'modified_on'
              }
            ]
          }
        ],
        erWeiMaUrl: ''
      }
    },
    mounted() {
      this.$nextTick(() => {
        let code = {'activityCode':this.detailData.activity_code}
        if(this.detailData.reward_way == 'system'){
          this.detailData.activity_rule = ''
          this.detailData.redeem_code_type = ''
        }
        console.log(this.detailData.reward_way,111)
        this.$service
          .getActivityCouponsList(code)
          .then(res => {
            this.couponsList = res.data.data
          })
          .catch(error => {
            this.$message.warning(error.msg)
          })
      })
    },
    computed: {},
    components: {
      detailBasic
    },
    methods: {
      exportCode(code) {
        this.$service
          .exportActivityCode(code)
          .then(res => {
            // this.$message({
            //   message: '下载成功',
            //   type: 'success'
            // })
          })
          .catch(err => {
            this.$message({
              message: '下载出错',
              type: 'error'
            })
          })
      }
    }
  }
</script>
<style lang="scss">
  #coupons-info-detail{
    .z-detail{
      .detail-section{
        .detail-item{
          align-items:flex-start;
        }
      }
    }
  }
</style>
