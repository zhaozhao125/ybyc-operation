<template>
  <el-dialog :visible.sync="dialogVisible"  width='425px' center>
    <el-form
      v-if = "showFirstStep"
      ref="form"
      :formData="formData"
      label-width="80px"
    >
      <el-form-item label="第一步:">
        <el-row><el-col>归还当前车辆</el-col></el-row>
      </el-form-item>

      <el-form-item label="车牌号:">
        <el-row>
          <el-col>{{formData.carNumber}} <span><el-button type="text" size="small" @click="carRealStatus(formData)">查看车辆位置</el-button></span></el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="还车网点:">
        <el-row>
          <el-col>
            <el-select
              size="small"
              v-model="returnStationId"
              filterable
              remote
              :clearable="true"
              placeholder="请输入还车网点"
              :remote-method="remoteMethod"
              @change="changeValue"
              >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit(false)" :disabled="disabledFlag" size = 'small'>下一步</el-button>
      </el-form-item>
    </el-form>
    <div v-if = "showErrorMessage">
      <el-row class = 'message_error'>
        <span ><i class="el-icon-warning" type="warning"></i>{{errorMessage}}</span>
      </el-row>
      <el-row>
        请先确认车辆已拉手刹、熄火、车门车窗已关闭。如果仍然无法还车，你可以强制还车。确定强制还车？
      </el-row>
    </div>
    <div v-if = "continueOrderCar">
      <el-row >还车成功！</el-row>
      <el-row >
        车辆{{carNumber}}设置空闲失败，须在车辆状态模块<el-button type="text" @click="setCarFee()">设置空闲</el-button>。
      </el-row>
    </div>
    <span slot="footer" class="dialog-footer" v-if = "showErrorMessage || continueOrderCar">
      <el-button type="primary" size = "small" @click = "onSubmit(true)" v-if = "showErrorMessage">强制还车</el-button>
      <el-button type="primary" size = "small" v-if = "continueOrderCar" @click = "continueOrder">继续排车</el-button>
      <el-button @click="dialogVisible = false" size = "small">取 消</el-button>
    </span>
  </el-dialog>
</template>
<script>
import searchSelect from '@/components/website-select'
import { handleSubmit } from '@/utils/common.js'
import api from '@/service/api/'
import { version } from 'dayjs'

export default {
  name: 'rent-car-first-step',
  props: {
  },
  data() {
    return {
      disabledFlag: true,
      options: [],
      returnStationId: '',
      dialogVisible: false,
      formData: {},
      showErrorMessage: false,
      showFirstStep: true,
      continueOrderCar: false,
      errorMessage: '',
      carNumber: ''
    }
  },
  mounted() {
  },
  methods: {
    show (params) {
      this.dialogVisible = true
      this.formData = params
      this.returnStationId = ''
      this.disabledFlag = true
      this.showFirstStep = true
      this.showErrorMessage = false,
      this.continueOrderCar = false
    },
    changeValue(value) {
      if (value) {
        this.disabledFlag = false
      } else {
        this.disabledFlag = true
      }
    },

    remoteMethod(value) {
      let params = {
        name: value,
        open: true,
        rentType: 3,
        visible: true,
        operationCityId: parseInt(this.formData.cityId)
      }

      this.$service.getAllNetworkStation(params).then((res) => {
        if (res.data.code === '0' && res.data.data.length > 0) {
          this.options = this.$service.formateAllNetworkStation(res.data.data)
          this.disabledFlag = false
        } else {
          this.options = []
          this.disabledFlag = true
        }
      }).catch((res) => {})
    },
    // 车辆位置
    carRealStatus(params) {
      this.$store.commit('sendToTab', {
        name: 'carLocation',
        params: {
          carSn: params.carSn,
          carNumber: params.carNumber
        }
      })
    },
    onSubmit(type) {
      let params = {
        orderSn: this.formData.orderSn,
        returnStationId: this.returnStationId,
        operatorCnName: this.$store.getters.user.cnName,
        operatorUserName: this.$store.getters.user.username,
        force: type
      }
      this.$service.rentCarStepOne(params).then((res) => {
        if (res.data.code == '0') {
          // this.dialogVisible = false
          this.$emit('getOrderInfor')
          this.continueOrderCar = res.data.data.carNumber
          this.showErrorMessage = false
          if (res.data.data.force) {
            this.carNumber = res.data.data.carNumber
          } else {
            this.$emit('exchange-first')
            this.dialogVisible = false
          }
        }
        // this.showErrorMessage = true
        // this.showFirstStep = false
        // this.errorMessage = res.code + res.msg
      }).catch((res) => {
         let code = res.code.slice(0, 2)
         if (code === '51') {
           this.showErrorMessage = true
           this.showFirstStep = false
           this.errorMessage = res.code + res.msg
         } else {
           this.$message.error(res.msg)
         }
      })
    },
    setCarFee() {
      this.$store.commit('sendToTab', {
        name: 'carStatus',
        params: {
          carNumber: this.formData.carNumber
        }
      })
      this.dialogVisible = false
    },
    continueOrder () {
      this.$emit('continueOrder')
      this.dialogVisible = false
    },
    successSubmit() {
      this.$emit('closeAndRefresh')
    }
  },
  components: {
    searchSelect
  }
}
</script>
<style lang="scss">
  .moveleft{
    margin-left: -15px;
  }
  .message_error {
    text-align: center;
    color: #E6A23C;
    margin-bottom: 5px;
    i {
      padding-right: 5px;
    }
  }
</style>
