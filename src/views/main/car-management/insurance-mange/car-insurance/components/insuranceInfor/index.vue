<template>
  <div class="insurance_detail">
    <detail-basic :detailSettings='insuranceDetailSettings' :detailData="detailData">
      <template slot="cityName" slot-scope="scope" >
          <car-table :carList = "carList"></car-table>
      </template>
    </detail-basic>
  </div>
</template>

<script>
  import detailBasic from '@/components/detail/vDetail'
  import { insuranceDetailSettings } from './detail-setting.js'
  import dayjs from 'dayjs'
  import vEditor from '@/components/editor/'
  import commonMethods from '../../mixin'
  import carTable from './carTable.vue'
  export default {
    components: {
      detailBasic,
      carTable
    },
    mixins: [commonMethods],
    props: {
      insurance: {
        default: {},
        type: Object
      }
    },
    data () {
      return {
        insuranceDetailSettings: insuranceDetailSettings,
        detailData: {},
        carList: []
      }
    },
    mounted () {
      this.getInsuranceInfor(this.insurance.policyNumber)
    },
    methods: {
      getInsuranceInfor (policyNumber) {
        this.$service.getInsuranceInfor(policyNumber).then((res) => {
          let insueanceDate = res.data.data
          this.detailData = {
            policyNumber: insueanceDate.policyNumber,
            insuranceStatus: this.insuranceStatusChange(insueanceDate.renewStatus, insueanceDate.expirationDate),
            insurant: insueanceDate.insurant,
            insurer: insueanceDate.insurer,
            premium: (insueanceDate.premium / 100).toFixed(2),
            rebateRate: insueanceDate.rebateRate + '%',
            policyNumber: insueanceDate.policyNumber,
            remarks: insueanceDate.remarks ? insueanceDate.remarks : '暂无',
            riskCode: this.insuranceTypeChange(insueanceDate.riskCode),
            signDate: this.timeChange(Number(insueanceDate.signDate)),
            effectiveDate: `${this.timeChange(Number(insueanceDate.effectiveDate))} 至 ${this.timeChange(Number(insueanceDate.expirationDate))}`
          }
          this.carList = res.data.data.carList
        })
      }
    }
  }
</script>

<style lang="scss">
  .insurance_detail {
      .el-table  {
        .el-table__header-wrapper {
          tr {
            th {
              padding-top: 0px;
            }
          }
        }
      }
      .v-detail {
        .detail-block:nth-child(2) {
          border-bottom: none;
        }
      }
  }
</style>
