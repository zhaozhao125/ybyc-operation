<template>
  <el-dialog
    :title="dialogParams.title"
    :visible.sync="dialogVisible"
    :width="dialogParams.width"
    >
    <!-- <div v-if="dialogParams.type === 'order'">
      <car-list
        :list="carlists"
        :params="paginationParams"
        ref="car"
        @on-stationChange = "stationChange" 
        @on-pageChange="pageChange"
        ></car-list>
    </div> -->
    <div v-if="dialogParams.type === 'cancel'">
      <cancel-accounts></cancel-accounts>
    </div>
    <div v-if="dialogParams.type === 'settle'">
      <settle-accounts ref="settle" :params="dialogParams"></settle-accounts>
    </div>
    <div v-if="dialogParams.type === 'refund'">
      <div class="all_refund_money">应退<span class="money_account">{{refundMoney}}</span>元，确定退款？</div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false" size="small">取 消</el-button>
      <el-button type="primary" size="small" @click="confirm">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import carList from './dialogContent/carList'
import cancelAccounts from './dialogContent/cancelAccounts'
import settleAccounts from './dialogContent/settleAccounts'
import returnCarDialogVue from './returnCarDialog.vue'
// import refundAccounts from './dialogContent/refund'
export default {
  components: {
    carList,
    cancelAccounts,
    settleAccounts
  //  refundAccounts
  },
  data () {
    return {
      dialogVisible: false,
      // dialogParams: {
      //   title: '排车',
      //   width: '30%',
      // },
      dialogParams: {},
      carlists: [],
      paginationParams: {},
      refundMoney: 0,
      // 网点id
      takeStationId: ''
    }
  },
  methods: {
    // 网点变化是触发检索
    // stationChange (stationId) {
    //   this.takeStationId = stationId
    //   this.orderCarList()
    // },
    // // 分页查询
    // pageChange (page) {
    //   this.orderCarList(page)
    // },
    changeCarlist(cars) {
      this.carlists = cars
    },
    confirm () {
      // this.dialogVisible = false
      switch (this.dialogParams.type) {
        case 'settle':
          this.orderSettle()
          break
        case 'order':
          // this.orderCar()
          break
        case 'cancel':
          this.orderCancel(this.dialogParams.sn)
          break
        case 'refund':
          this.refound()
          break
      }
    },
    orderSettle () {
      let params = {
        orderSn: this.dialogParams.sn,
        itemName: 'other',
        itemMoney: this.$refs.settle.formInline.otherPay,
        remark: this.$refs.settle.formInline.settleRemark,
        operatorUserName: this.$store.state.user.username,
        itemRemark: this.$refs.settle.formInline.itemRemark
      }

      this.$service.orderSettle(params).then((res) => {
        this.dialogVisible = false
        this.$message.success('结算成功！')
        this.$emit('on-operation')
      }).catch((res) => {})
    },
    show (params) {
      this.dialogVisible = true
      this.dialogParams = params
      console.log(this.dialogParams.type)
      if (this.dialogParams.type === 'order') {
        // this.takeStationId = params.takeStationId
        // this.orderCarList()
        // this.$nextTick(() => {
        //   this.$refs.car.options = [{
        //     label: this.dialogParams.takeStationName,
        //     value: this.dialogParams.takeStationId
        //   }]
        //   this.$refs.car.returnStationId = this.dialogParams.takeStationId
        // })
      } else if (this.dialogParams.type === 'refund') {
        this.refoundCheck()
      } else if (this.dialogParams.type === 'settle') {
        if (this.$refs.settle) {
          this.$refs.settle.formInline = {
            itemRemark: '',
            otherPay: 0,
            settleRemark: ''
          }
        }
      }

      this.$nextTick(() => {
        console.dir(this.dialogParams)

        this.reloadCarList()
      })
    },
    refoundCheck () {
      this.$service.refoundCheck({orderSn: this.dialogParams.sn}).then((res) => {
        this.refundMoney = res.data.data.refundMoney
      }).catch((res) => {
        this.refundMoney = 0
      })
    },
    refound () {
      let params = {
        orderSn: this.dialogParams.sn,
        operatorUserName: this.$store.state.user.username,
        operatorCnName: this.$store.state.user.cnName,
        refundMoney: this.refundMoney
      }
      this.$service.refound(params).then((res) => {
        this.$message.success('退款成功！')
        this.dialogVisible = false
        this.$emit('on-operation')
      }).catch((res) => {})
    },
    reloadCarList(row = {}) {
      if (JSON.stringify(row) !== '{}') {
        this.dialogParams.takeStationId = row.value
        this.dialogParams.takeStationName = row.label
      }

      // 异步触发删除页面
      this.$refs.car.returnStationId = this.dialogParams.takeStationId
      this.$refs.car.cityId = this.dialogParams.cityId

      this.$refs.car.options = [{
        label: this.dialogParams.takeStationName,
        value: this.dialogParams.takeStationId
      }]
      this.$refs.car.getAllCarsFromStationid(this.dialogParams.takeStationId)
      this.$refs.car.carlist = []
    },
    // orderCar () {
    //   console.dir('排车第二步')

    //   if (this.$refs.car.choooseCar.length > 0) {
    //     console.log(this.$refs.car.choooseCar)
    //     let params = {
    //       orderSn: this.dialogParams.sn,
    //       operatorUserName: this.$store.state.user.username,
    //       operatorCnName: this.$store.state.user.cnName,
    //       carSn: this.$refs.car.choooseCar[this.$refs.car.choooseCar.length - 1].carSn
    //     }

    //     this.$service.orderCar(params).then((res) => {
    //       this.$message.success('排车成功！')
    //       this.$emit('on-success', this.dialogParams.sn)
    //       this.dialogVisible = false
    //     }).catch((res) => {
    //       if (res.code === '611013') {
    //         console.dir('租车失败，请点击发送租车指令重试')
    //         this.dialogVisible = false
    //         // 关闭窗口和刷新页面
    //         this.$emit('closeRentCarSecondStep')
    //         return false
    //       }

    //       let rowSelectedStation = this.$refs.car.rowSelectedStation
    //       this.reloadCarList(rowSelectedStation)
    //     })
    //   } else {
    //     this.$message.warning('请选择车辆！')
    //   }
    // },
    // orderCarList (page = 1) {
    //   // this.paginationParams = {
    //   //   takeStationName: this.dialogParams.takeStationName,
    //   //   sn: this.dialogParams.sn
    //   // }
    //   // return false
    //   let params = {
    //     stationId: this.takeStationId,
    //     orderSn: this.dialogParams.sn
    //   }
    //   this.$service.orderCarList(params, page).then((res) => {
    //     this.carlists = res.data.data.records
    //     this.paginationParams = {
    //       pageSize: res.data.data.pageSize,
    //       total: res.data.data.totalElements,
    //       takeStationName: this.dialogParams.takeStationName
    //     }
    //   }).catch((res) => {
    //   })
    // },
    // orderSettle () {
    //   this.$service.orderSettle().then((res) => {
    //   }).catch((res) => {
    //   })
    // },
    orderCancel (sn) {
      this.$service.cancelOrder({orderSn: sn, orderCancelType: 'back'}).then((res) => {
      }).catch((res) => {
      })
    }
  }
}
</script>
<style lang="scss">
.all_refund_money {
    .money_account {
      color: #F56C6C;
      font-weight: 700;
      font-size:15px;
      display: inline-block;
      padding-left:5px;
      padding-ringht: 5px;
    }
  }
</style>
