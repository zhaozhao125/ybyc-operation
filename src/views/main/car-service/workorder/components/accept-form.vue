<template>
<el-dialog title="验收"
           :visible.sync="visible"
           width="500px"
           :before-close="closeMe">
  <div class="workorder-accept-form">
    <el-form :model="formModel"
             label-width="100px"
             size="small"
             ref="form"
             :rules="formRules">
      <el-form-item prop="station"
                    label="网点"
                   >
        <div class="station-setter">
          <span class="station-name"
                v-if="currentStation">{{currentStation.name}}</span>
          <span class="el-icon-loading"
                v-if="loadingStation"></span>
          <el-button type="text"
                     @click="handleSetStation"
                     :disabled="loadingStation">设置网点</el-button>
        </div>
      </el-form-item>
            <el-form-item prop="maintainDistanceM"
                    label=""
                  >
            <div v-if = "!maintainDistanceM && taskType == 'dispatch_car'">
              <span>未检测到运维距离，请手动填写。根据起始网点，目的地网点预估</span>
              <el-input-number v-model = "formModel.maintainDistanceM" :controls='false' style = "width: 100px" :precision=2 :step="0.1" @blur="toFixedTwo"></el-input-number>
              <span>km</span>
            </div>
      </el-form-item>
      <el-form-item prop="remark"
                    label="验收备注">
        <el-input type="textarea"
                  v-model="formModel.remark"
                  placeholder=" 请输入验收备注"></el-input>
      </el-form-item>
      <el-form-item class="right-button">
        <el-button @click="closeMe">取消</el-button>
        <el-button type="primary"
                   @click="handleAccept"
                   :loading="loading">确认验收</el-button>
      </el-form-item>
    </el-form>
  </div>
  <searchStation :visible.sync="stationVisible"
                 :carNumber="carNumber"
                 :renderStationScope="false"
                 :showUserVisibleStationOnly="false"
                 v-if = "stationVisible"
                 @confirm="handleSelectStation"></searchStation>
</el-dialog>

</template>

<script>
import searchStation from '@/components/search-station/'
export default {

  props: {
    visible: {
      type: Boolean,
      default: false
    },
    sn: {
      type: String,
      required: true
    },
    carSn: {
      type: String
    },
    carNumber: {
      type: String
    },
    taskType: {
      type: String,
    },
    maintainDistanceM: {
      type: Boolean
    }
  },

  components: {
    searchStation
  },

  data() {
    return {
      // maintainDistanceM: true,
      formModel: {
        station: '',
        remark: '',
        maintainDistanceM: undefined
      },
      orderinformation: {},
      loading: false,
      stationVisible: false,
      currentStation: null,
      // formRules: [
      //   {
      //     required: true,
      //     message: '请设置网点',
      //     trigger: 'change'
      //   }
      // ],
      formRules: {
        station: [
          {
            required: true,
            message: '请设置网点',
            trigger: 'change'
          }
        ],
        maintainDistanceM: [
          {
            required: true,
            message: '请设置距离',
            trigger: 'blur'
          }
        ]
      },
      loadingStation: false
    }
  },

  methods: {
    toFixedTwo () {
      if (this.formModel.maintainDistanceM) {
        this.formModel.maintainDistanceM = this.formModel.maintainDistanceM.toFixed(2)
      }
    },
    closeMe() {
      this.formModel.remark = ''
      this.$emit('update:visible', false)
      this.loading = false
      // this.$refs.form.resetFields()
      this.$refs.form.clearValidate()
    },
    handleAccept() {
      if (!this.maintainDistanceM && this.taskType == 'dispatch_car') {
        this.formRules.maintainDistanceM[0].required = true
      } else {
        this.formRules.maintainDistanceM[0].required = false
      }
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          let maintainDistanceRes = this.formModel.maintainDistanceM ? this.formModel.maintainDistanceM * 1000 : this.formModel.maintainDistanceM
          this.$service.verifyWorkorder(this.sn, 'pass', this.formModel.remark, this.currentStation.id, this.currentStation.name, maintainDistanceRes).then(res => {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.$emit('success')
            this.closeMe()
          }).catch(err => {
            this.loading = false
          })
        }
      })
    },
    handleSetStation() {
      this.stationVisible = true
    },
    handleSelectStation(data) {
      this.currentStation = data
      this.formModel.station = data.id
      this.$refs.form.clearValidate()
      if (!this.maintainDistanceM && this.taskType == 'dispatch_car') {
        this.getDistance()
      }
    },
    getDistance () {
      let params = {}
      params.endStationId = this.currentStation.id
      params.sn = this.sn
      this.$service.getDistance(params).then((res) => {
        if (res.data.data) {
          this.formModel.maintainDistanceM = (res.data.data / 1000).toFixed(2)
        }
      })
    },
    getDefaultStation() {
      this.formModel.station = ''
      if (this.carSn) {
        this.loadingStation = true
        this.$service.getWorkOrderStation(this.carSn).then(res => {
          this.orderinformation = res.data.data
          if (res.data.data.inStation) {
            this.currentStation = {
              id: res.data.data.id,
              name: res.data.data.name
            }
            this.formModel.station = this.currentStation.id
          } else {
            this.currentStation = {
              name: '未检测到网点'
            }
          }
          this.loadingStation = false
        }).catch(err => {
          this.loadingStation = false
        })
      }
    }
  },

  created() {
    this.getDefaultStation()
  },

  watch: {
    carSn() {
      this.getDefaultStation()
    },
    visible (val) {
      if (val) {
        this.formModel.maintainDistanceM = undefined
        if (this.orderinformation.inStation) {
          this.getDistance()
        }
        this.getDefaultStation()

        // if (this.formModel.station) {
        // } else {
        //   this.formModel.station = ''
        // }
      }
    }
  }
}
</script>

<style lang="scss">
.workorder-accept-form {
  .station-name {
    color: $color-red;
  }
}
</style>
