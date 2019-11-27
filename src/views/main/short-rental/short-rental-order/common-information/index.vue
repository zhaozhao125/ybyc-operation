<template>
  <div>
    <base-infor :baseInformation="information" @on-resetTime="resetTime" :authority="authority"></base-infor>
    <user-infor @on-showUser='showBindCard' :userInformation="information" :authority="authority"></user-infor>
    <car-infor @on-materialDialog='showMaterial' :carInformation="information" @on-orderCarDialog="orderCar()" :authority="authority"></car-infor>
    <order-money :orderMoney="information"></order-money>
    <!-- <picture-list :pictureLists="information" v-if="information.orderStatus!=='subscribed' && information.orderStatus!=='cancel'"></picture-list> -->
    <div id="all_pic_list"  v-if="information.orderStatus!=='subscribed' && information.orderStatus!=='cancel'">
      <div class="x-data-detail">
        <div class="x-detail-block">
          <h4 class="x-detail-title">照片</h4>
          <v-detail :detailSettings="usePicSetting" :data="beforeImg" label-align="left" label-width="80px" class="car_pic">
          </v-detail>
          <v-detail :detailSettings="returnPicSetting" :data="afterImg" label-align="left" label-width="80px" class="car_pic">
          </v-detail>
        </div>
      </div>
    </div>
    <return-information :returnInformation="information" v-if="information.orderStatus==='returned' ||   information.orderStatus==='finished'"></return-information>
    <settle-information :settleInformation="information" v-if="information.settleStatus==='settled'"></settle-information>
    <finance-check :checkInformation="information" v-if="information.orderStatus==='finished'"></finance-check>
    <order-log :list='logList' :params='paginatiomParams' @on-pageChange='pageChange' ></order-log>
  </div>
</template>
<script>
import baseInfor from './baseInformation'
import userInfor from './userInformation'
import carInfor from './carInformation'
import orderMoney from './orderMoney'
import orderLog from './orderLog'
// import pictureList from './pictureList'
import returnInformation from './returnCarInformation.vue'
import settleInformation from './settleInformation.vue'
import financeCheck from './financeCheck.vue'
import vDetail from '@/components/detail/v-detail'
export default {
  components: {
    baseInfor,
    userInfor,
    carInfor,
    orderMoney,
    orderLog,
    // pictureList,
    returnInformation,
    settleInformation,
    financeCheck,
    vDetail
  },
  data () {
    return {
      test: 123,
      logList: [],
      paginatiomParams: {},
      baseInfomation: {},
      orderMoney: {},
      pictureLists: {},
      orderLog: {},
      usePicSetting: [{
        label: '',
        items: [
          {
            label: '用车检查',
            value: 'images',
            type: 'image',
            descriptionType: 'show'
          }
        ]
      }],
      returnPicSetting: [{
        label: '',
        items: [
          {
            label: '还车检查',
            value: 'images',
            type: 'image',
            descriptionType: 'show'
          }
        ]
      }]
    }
  },
  props: {
    sn: {
      default: '',
      type: String
    },
    information: {
      default: {},
      type: Object
    },
    beforeImg: {
      default: {},
      type: Object
    },
    afterImg: {
      default: {},
      type: Object
    },
    authority: {
      default: {},
      type: Object
    }
  },
  destroyed () {
  },
  methods: {
    resetTime () {
      this.$emit('on-resetTime')
    },
    orderCar () {
      // this.getOrderLog()
      this.$emit('on-exchangeCar')
    },
    showBindCard (cardNumber) {
      this.getOrderLog()
      this.$emit('on-bindCard', cardNumber)
    },
    showMaterial (val) {
      this.getOrderLog()
      this.$emit('on-materialDialog', val)
    },
    getOrderLog (page = 1) {
      this.$service.orderLog({orderSn: this.sn}, page).then((res) => {
        this.logList = res.data.data.records
        this.paginatiomParams = {
          pageSize: res.data.data.pageSize,
          total: res.data.data.totalElements
        }
      }).catch((res) => {})
    },
    pageChange (val) {
      this.getOrderLog(val)
    }
  },
  mounted () {
    this.getOrderLog()
  }
}
</script>
<style lang="scss">
  #all_pic_list {
    .detail-section > ul {
      padding:0;
      .item-label {
        margin-right:0;
        color: #606266;
        font-weight:700;
        font-size:14px;
      }
      .item-value {
        .v-gallery {
          li {
            margin-top:0;
            span {
              font-size: 12px;
              padding-left:12px;
            }
          }
        }
      }
    }
  }
</style>
