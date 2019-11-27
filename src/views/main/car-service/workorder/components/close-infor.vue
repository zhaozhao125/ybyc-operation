<template>
<el-dialog title="关闭"
           :visible.sync="visible"
           width="500px"
           :before-close="closeMe">
  <div class="workorder-accept-form">
    <el-form :model="formModel"
             label-width="100px"
             size="small"
             ref="form">
      <el-form-item prop="station"
                    label="网点"
                    :rules="formRules">
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
      <el-form-item class="right-button">
        <el-button @click="closeMe">取消</el-button>
        <el-button type="primary"
                   @click="handleAccept"
                   :loading="loading">确认关闭</el-button>
      </el-form-item>
    </el-form>
  </div>
  <searchStation :visible.sync="stationVisible"
                 :carNumber="carNumber"
                 :renderStationScope="false"
                 :showUserVisibleStationOnly="false"
                 ref = "stationParams"
                 @confirm="handleSelectStation"></searchStation>
</el-dialog>

</template>

<script>
import searchStation from '@/components/search-station/';
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
    handeCloseType: {
      type: String
    }
  },

  components: {
    searchStation
  },

  data() {
    return {
      formModel: {
        station: '',
      },
      loading: false,
      stationVisible: false,
      currentStation: null,
      formRules: [
        {
          required: true,
          message: '请设置网点',
          trigger: 'change'
        }
      ],
      loadingStation: false
    }
  },
  destroyed () {
    console.log('distroyed')
  },
  methods: {
    closeMe() {
      this.$emit('update:visible', false)
      this.loading = false
      // this.$refs.form.resetFields()
      this.$refs.form.clearValidate()
    },
    handleAccept() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
           this.$service.closeWorkorder(this.sn, this.handeCloseType, this.currentStation.id).then(res => {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.$emit('success')
            this.closeMe()
          }).catch((res) => {
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
    },
    getDefaultStation() {
      if (this.carSn) {
        this.loadingStation = true
        this.$service.getWorkOrderStation(this.carSn).then(res => {
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
