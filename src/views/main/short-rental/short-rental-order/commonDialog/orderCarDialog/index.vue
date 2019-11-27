<template>
  <el-dialog :title="dialogParams.title" :visible.sync="dialogVisible" width="700px">
    <car-list :list="carlists" :params="paginationParams" ref="car" @on-pageChange="pageChange" @on-stationChange="stationChange" :cityId="dialogParams.cityId"></car-list>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel" size="small">取 消</el-button>
      <el-button type="primary" size="small" @click="orderCar">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import carList from './carList'
// import returnCarDialogVue from '../../../all-order/returnCarDialog.vue'
export default {
  components: {
    carList
  },
  data() {
    return {
      dialogVisible: false,
      formInline: {},
      dialogParams: {},
      paginationParams: {},
      carlists: [],
      // 网点id
      takeStationId: ''
    }
  },
  methods: {
    cancel() {
      this.dialogVisible = false
      this.$refs.car.sameCarGenre = false
    },
    show(params) {
      console.log(params)
      this.dialogVisible = true
      this.dialogParams = params
      this.takeStationId = params.takeStationId
      this.orderCarList()
      this.$nextTick(() => {
        this.$refs.car.options = [{
          label: this.dialogParams.takeStationName,
          value: this.dialogParams.takeStationId
        }]
        this.$refs.car.returnStationId = this.dialogParams.takeStationId
        this.$refs.car.sameCarGenre = false
      })
    },
    orderCar() {
      if (this.$refs.car.choooseCar.length > 0) {
        let params = {
          orderSn: this.dialogParams.sn,
          operatorUserName: this.$store.state.user.username,
          operatorCnName: this.$store.state.user.cnName,
          carSn: this.$refs.car.choooseCar[this.$refs.car.choooseCar.length - 1].carSn
        }
        this.$service.orderCar(params).then((res) => {
          this.$message.success('排车成功！')
          this.$emit('on-success')
          this.dialogVisible = false
        }).catch((res) => {
          // let rowSelectedStation = this.$refs.car.rowSelectedStation
          // this.reloadCarList(rowSelectedStation)
        })
      } else {
        this.$message.warning('请选择车辆！')
      }
    },
    pageChange(page) {
      this.orderCarList(page)
    },
    stationChange(stationId) {
      this.takeStationId = stationId
      this.orderCarList()
    },
    orderCarList(page = 1) {
      let params = {
        stationId: this.takeStationId,
        orderSn: this.dialogParams.sn
      }
      this.$service.orderCarList(params, page).then((res) => {
        this.carlists = res.data.data.records
        this.paginationParams = {
          pageSize: res.data.data.pageSize,
          total: res.data.data.totalElements,
          takeStationName: this.dialogParams.takeStationName
        }
      }).catch((res) => { })
    }
  }
}
</script>
