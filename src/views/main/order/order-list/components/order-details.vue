<template>
  <!--分时订单 逾期订单 审核异常还车  企业订单等公用组件-->
  <v-page :visible.sync="visible" :before-close="handleBeforeClose">
    <h3 slot="title">订单详情</h3>
    <template slot="content">
      <div class="order-detail">
        <detail-basic v-if="detailData" :detailSettings='detailSettings' :data="detailData" :labelWidth="labelWidth">
          <!-- 开票状态 -->
          <template slot="invoiceInfo" slot-scope="scope">

            <el-button type="text" @click="handleInvoiceInfo" v-if="!invoiceInfoVisible">查看开票信息</el-button>
            <div v-if="invoiceInfoVisible">
              <div class="invoice-el-table" v-if='invoiceInfo.noInvoice'>
                <el-table :data="invoiceInfo.info" border max-height="250">
                  <el-table-column prop="statusName" label="开票状态">
                  </el-table-column>
                  <el-table-column prop="moneyName" label="可开票金额">
                  </el-table-column>
                </el-table>
              </div>
              <span v-else>{{invoiceInfo.noInvoiceMsg}}</span>
            </div>

          </template>
          <!--网点信息-->
          <template slot="takeStationName" slot-scope="scope">
            <span v-if="detailData.takeStationName !== null">{{detailData.takeStationName}}</span>
            <span v-if="detailData.takeStationType === 'casual'">（百步亭）</span>
            <span v-else-if="detailData.takeStationType === 'contract'">（合作网点）</span>
          </template>
          <template slot="returnStationName" slot-scope="scope">
            <span v-if="detailData.returnStationName !== null">{{detailData.returnStationName}}</span>
            <span v-if="detailData.returnStationType === 'casual'">（百步亭）</span>
            <span v-else-if="detailData.returnStationType === 'contract'">（合作网点）</span>
          </template>
          <!--订单计费-->
          <template slot="dayMoneyTotal" slot-scope="scope">
            <span v-if="detailData.dayMoneyTotal !== null">{{detailData.dayMoneyTotal}}元（{{detailData.dayTimes}}天）</span>
          </template>
          <template slot="onMoneyTodayTotal" slot-scope="scope">
            <span v-if="detailData.onMoneyTodayTotal !== null">{{detailData.onMoneyTodayTotal}}元（{{detailData.onMinuteTodayTotal}}分钟）</span>
          </template>
          <template slot="offMoneyTodayTotal" slot-scope="scope">
            <span v-if="detailData.offMoneyTodayTotal !== null">{{detailData.offMoneyTodayTotal}}元（{{detailData.offMinuteTodayTotal}}分钟）</span>
          </template>
          <template slot="cityCrossMoney" slot-scope="scope">
            <span v-if="detailData.cityCrossMoney !== null">{{detailData.cityCrossMoney}}元（{{detailData.cityCrossMileage}}公里）</span>
          </template>
          <template slot="discountAmount" slot-scope="scope">
            <span v-if="detailData.discountDescription !== null">
              {{detailData.discountAmount}}元
              <span class="discount-description">{{detailData.discountDescription}}</span>
            </span>
          </template>
          <!--订单日志-->
          <template slot="returnCarPolygon" slot-scope="scope">
            <div v-if="detailData.lockRecords">
              <el-table :data="detailData.lockRecords">
                <el-table-column label="锁定时间">
                  <template slot-scope="scope">
                    {{scope.row.lockTime|timeFilter}}
                  </template>
                </el-table-column>
                <el-table-column label="解锁时间">
                  <template slot-scope="scope">
                    {{scope.row.unlockTime|timeFilter}}
                  </template>
                </el-table-column>
                <el-table-column label="锁定理由">
                  <template slot-scope="scope">
                    {{scope.row.lockReason}}
                  </template>
                </el-table-column>
                <el-table-column label="锁单管理员">
                  <template slot-scope="scope">
                    {{scope.row.createdBy}}
                  </template>
                </el-table-column>
                <el-table-column label="解锁管理员">
                  <template slot-scope="scope">
                    {{scope.row.unlockAdmin}}
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div v-else>
              暂无日志信息
            </div>
          </template>
        </detail-basic>
      </div>
    </template>
  </v-page>

</template>

<script>
import detailBasic from '@/components/detail/v-detail'
import { detailSettings } from './detailSettings'
import siteMap from '@/components/siteMap/site-map'
import vPage from '@/components/page'

export default {
  name: 'order-details',
  components: {
    vPage,
    detailBasic,
    siteMap
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    orderId: {
      type: Number
    },
    orderStatusCode: {
      type: String
    }
  },
  data() {
    return {
      labelWidth: 150,
      detailData: null,
      detailSettings,
      invoiceInfo: null,
      invoiceInfoVisible: false
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.invoiceInfoVisible = false
        this.getDetails()
      }
    }
  },
  methods: {
    handleBeforeClose() {
      this.$emit('update:visible', false)
    },
    getDetails() {
      let params = {
        key: 'id',
        value: this.orderId,
        needLog: true,
        needComment: true
      }
      if (
        this.orderStatusCode === 'rent' ||
        this.orderStatusCode === 'locked' ||
        this.orderStatusCode === 'returned' ||
        this.orderStatusCode === 'finished'
      ) {
        params.needTakeCarImages = true
      }
      if (
        this.orderStatusCode === 'locked' ||
        this.orderStatusCode === 'returned' ||
        this.orderStatusCode === 'finished'
      ) {
        params.needReturnCarImages = true
      }
      if (this.orderStatusCode === 'cancel') {
        params.needCancelImages = true
      }
      this.$service
        .getOrderInfo(params)
        .then(res => {
          this.detailData = res.data.data

          if (this.detailData.payWayDetail) {
            Object.assign(this.detailData, this.detailData.payWayDetail)
            //   this.detailData.payWayDetail.map(item => {
            //     Object.assign(this.detailData, item)
            //   })
          }

          let takeCarImages = res.data.data.takeCarImages
            ? this.pictureChange(res.data.data.takeCarImages)
            : {}
          this.detailData.takeCarImages = takeCarImages.images
          this.detailData.takeCarImagesImgDescription =
            takeCarImages.imagesImgDescription

          let returnCarImages = res.data.data.returnCarImages
            ? this.pictureChange(res.data.data.returnCarImages)
            : {}
          this.detailData.returnCarImages = returnCarImages.images
          this.detailData.returnCarImagesImgDescription =
            returnCarImages.imagesImgDescription
        })
        .catch(e => {
          this.$emit('update:visible', false)
        })
    },
    handleInvoiceInfo() {
      let params = {
        orderSn: this.detailData.sn,
        orderType: 'timeShareRent'
      }
      // 发票
      this.$service
        .invoiceOrderInfo(params)
        .then(res => {
          if (res.data.code == 0) {
            this.invoiceInfo = res.data.data
            this.invoiceInfoVisible = true
          }
        })
    },
    pictureChange(list, name) {
      let resoult = {
        images: [],
        imagesImgDescription: []
      }
      list.forEach(ele => {
        switch (ele.key) {
          case 'left_front':
            ele.key = '左前45°'
            break
          case 'right_front':
            ele.key = '右前45°'
            break
          case 'front_row':
            ele.key = '前排'
            break
          case 'back_row':
            ele.key = '后排'
            break
          case 'center_back':
            ele.key = '正后方'
            break
          case 'damage_part':
            ele.key = '车辆伤损部位'
            break
        }
        if (ele && ele.url) {
          resoult.images.push(ele.url)
          resoult.imagesImgDescription.push(ele.key)
        }
      })
      return resoult
    }
  }
}
</script>

<style lang="scss">
.order-detail {
  .discount-description {
    color: $color-red;
    margin-left: 20px;
  }
  .invoice-el-table {
    width: 370px;
    // margin-left: -100px;
  }
}
</style>
