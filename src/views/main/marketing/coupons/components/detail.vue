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
      <template slot="amount">
        <div v-if="detailData.amount != 0">
          <div>{{detailData.amount}}张</div>
        </div>
        <div v-else>
          不限制
        </div>
      </template>
      <template slot="userGainTimes">
        <div v-if="detailData.userGainTimes != 0">
          <div>{{detailData.userGainTimes}}张</div>
        </div>
        <div v-else>
          不限制
        </div>
      </template>
      <template slot="issueTime">
        <div>{{detailData.redeemStartTime}} 至 {{detailData.redeemEndTime}}</div>
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
        <div v-if="detailData.redeemCodeCount">
          随机码
        </div>
        <div v-else>
          固定码
        </div>
      </template>
      <template slot="redeemCodeCount" v-if="detailData.redeemCodeCount">
        {{detailData.redeemCodeCount}}张&nbsp;&nbsp;
        <a href="javascript:" @click="exportCode(detailData.id)">导出</a>
      </template>
      <!--<template slot="redeemCode" slot-scope="scope" v-if="scope.data.redeemCode">-->
      <!--{{detailData.redeemCode}}-->
      <!--</template>-->
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
    name: 'coupons-info-detail',
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
        detailSettings:  [
          {
            label: '基本信息',
            items: [
              {
                label: '优惠券名称',
                value: 'name'
              },
              {
                label: '优惠券编号',
                value: 'code'
              },
              {
                label: '使用说明',
                value: 'detail'
              },
              {
                label: '类型',
                value: 'usageType',
                map: {
                  'share': '分时',
                  'shortRent': '短长租',
                  'charge': '充电'
                }
              },
              {
                label: '优惠类型',
                name: 'type',
                type: 'slot'
              }
            ]
          },
          {
            label: '使用条件',
            items: [
              {
                label: '发行量',
                name: 'amount',
                type: 'slot'
              },
              {
                label: '每人限领',
                name: 'userGainTimes',
                type: 'slot'
              },
              {
                label: '发行有效期',
                name: 'issueTime',
                type: 'slot'
              },
              {
                label: '使用有效期',
                name: 'relativeTime',
                type: 'slot'
              },
              {
                label: '可用城市',
                value: 'city'
              },
              {
                label: '可用车型',
                value: 'genre',
                name: 'genre',
                autoHide: true
              }
            ]
          },
          {
            label: '其它',
            items: [
              {
                label: '是否设置兑换码',
                value: 'installRedeemCode',
                map: {
                  true: '是',
                  false: '否'
                }
              },
              {
                label: '兑换码类型',
                value: 'installRedeemCode',
                name: 'isRedeemCodeCount',
                autoHide:true,
                type: 'slot'
              },
              {
                label: '数量',
                value: 'redeemCodeCount',
                name: 'redeemCodeCount',
                autoHide: true,
                type: 'slot'
              },
              {
                label: '兑换码',
                value: 'redeemCode',
                autoHide: true
              },
              {
                label: '备注',
                value: 'remark'
              },
              {
                label: '添加时间',
                value: 'createdOn'
              },
              {
                label: '添加人',
                name: 'createdBy',
                type: 'slot'
              },
              {
                label: '修改人',
                name: 'modifiedBy',
                type: 'slot'
              },
              {
                label: '修改时间',
                value: 'modifiedOn'
              }
            ]
          }
        ],
        erWeiMaUrl: ''
      }
    },
    mounted() {
      this.$nextTick(() => {})
    },
    computed: {},
    components: {
      detailBasic
    },
    methods: {
      exportCode(id) {
        this.$service
          .exportCouponsCode(id)
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
