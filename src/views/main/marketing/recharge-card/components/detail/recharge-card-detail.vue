<template>
  <div class="recharge-card-detail">
    <v-page :visible.sync="visible" :before-close="closeMe">
      <h3 slot="title">充值卡详情</h3>
      <template slot="content">
        <div class="recharge-card-detail">
          <detail-basic v-if="detailData" :detailSettings='detailSettings' :data="detailData" :labelWidth="labelWidth">
            <template slot="useCountLimit" slot-scope="scope">
              <span v-if="detailData.useCountLimit > 0">{{detailData.useCountLimit}}次</span>
              <span v-else>不限制</span>
            </template>
            <template slot="endDate" slot-scope="scope">
              <span>{{detailData.startDate/1000|formatData}}&nbsp;至&nbsp;{{detailData.endDate/1000|formatData}}</span>
            </template>
            <template slot="cityPermitNames" slot-scope="scope">
              <span v-if="detailData.cityPermitNames">{{detailData.cityPermitNames}}</span>
              <span v-else>全部</span>
            </template>
            <template slot="export" slot-scope="scope">
              <el-button :loading="exportLoading" type="text" @click="exportFile">导出卡号密码</el-button>
            </template>
            <template slot="couldUse" slot-scope="scope">
              <span v-if="detailData.couldUse">开启</span>
              <span v-else>禁用</span>
            </template>
            <template slot="createBy" slot-scope="scope">
              <span v-if="detailData.nickNameCreateBy">{{detailData.nickNameCreateBy}}</span>
              <span v-if="detailData.createBy">（{{detailData.createBy}}）</span>
            </template>
            <template slot="modifiedBy" slot-scope="scope">
              <span v-if="detailData.nickNameModifiedBy">{{detailData.nickNameModifiedBy}}</span>
              <span v-if="detailData.modifiedBy">（{{detailData.modifiedBy}}）</span>
            </template>
            <template slot="issueNumber">
              <span>{{detailData.issueNumber}}张</span>
            </template>
            <template slot="faceValue">
              <span>{{detailData.faceValue}}元</span>
            </template>
          </detail-basic>
        </div>
      </template>
    </v-page>
  </div>

</template>

<script>
import detailBasic from '@/components/detail/v-detail'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    prepaidCardId: {
      type: Number
    }
  },

  components: {
    detailBasic
  },

  data() {
    return {
      labelWidth: 150,
      detailData: {},
      exportLoading: false,
      detailSettings: [
        {
          label: '',
          items: [
            {
              label: '充值卡批次号',
              value: 'batchNum'
            },
            {
              label: '充值卡名称',
              value: 'name',
              type: 'text'
            },
            {
              label: '面值',
              value: 'faceValue',
              type: 'slot'
            },
            {
              label: '发行张数',
              value: 'issueNumber',
              type: 'slot'
            },
            {
              label: '每人使用次数',
              value: 'useCountLimit',
              type: 'slot'
            },
            {
              label: '用户所属城市',
              value: 'cityPermitNames',
              type: 'slot'
            },
            {
              label: '使用有效期',
              value: 'endDate',
              type: 'slot'
            },
            {
              label: '导出',
              value: 'export',
              type: 'slot'
            },
            {
              label: '状态',
              value: 'couldUse',
              type: 'slot'
            },
            {
              label: '添加时间',
              value: 'createOn',
              type: 'time'
            },
            {
              label: '创建人',
              value: 'createBy',
              type: 'slot'
            },
            {
              label: '最后操作时间',
              value: 'modifiedOn',
              type: 'time',
              visibleControl: data => data.modifiedBy
            },
            {
              label: '最后操作人',
              value: 'modifiedBy',
              type: 'slot',
              visibleControl: data => data.modifiedBy
            },
            {
              label: '备注',
              value: 'remark',
              type: 'text'
            }
          ]
        }
      ]
    }
  },

  watch: {
    visible(val) {
      if (val) {
        console.log(this.prepaidCardId)
        this.getDetail(this.prepaidCardId)
      }
    }
  },
  methods: {
    closeMe() {
      this.$emit('update:visible', false)
      this.$emit('close')
      return false
    },
    getDetail(prepaidCardId) {
      if (prepaidCardId !== '') {
        this.$service.rechargeCardDetails({ id: prepaidCardId }).then(res => {
          this.detailData = res.data.data
        })
      }
    },
    exportFile() {
      this.exportLoading = true
      console.log(this.prepaidCardId)
      this.$service.exportRechargeCardInfo(
        this.prepaidCardId,
        '充值卡.xlsx'
      ).then(res => {
        this.exportLoading = false
      }).catch(err => {
        this.exportLoading = false
      })
    }
  }
}
</script>

<style lang="scss">
</style>
