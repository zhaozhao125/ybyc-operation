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
               >{{currentStation.name}}</span>
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
                 @confirm="handleSelectStation"></searchStation>
</el-dialog>

</template>

<script>
import searchStation from '@/components/search-station/';
export default {

  props: {
    // visible: {
    //   type: Boolean,
    //   default: false
    // },
    sn: {
      type: String,
      required: true
    },
    carSn: {
      type: String
    },
    carNumber: {
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
        remark: ''
      },
      loading: false,
      stationVisible: false,
      currentStation: {
        name: ''
      },
      formRules: [
        {
          required: true,
          message: '请设置网点',
          trigger: 'change'
        }
      ],

      loadingStation: false,
      visible: false,
      stationParams: {}
    }
  },

  methods: {
    show (val) {
      this.visible = true
      this.stationParams = val
      this.getDefaultStation(val)
    },
    closeMe() {
      this.formModel.remark = ''
      // this.$emit('update:visible', false)
      this.loading = false
      this.$refs.form.clearValidate()
      this.visible = false
    },
    // 确认关闭
    handleAccept() {
      this.$refs.form.validate(valid => {
        if (valid) {
           this.loading = true
          this.$emit('on-close', this.currentStation.id)
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
    getDefaultStation(val) {
        if (val.inStation) {
             this.currentStation = {
              id: val.id,
              name: val.name
            }
            this.formModel.station = this.currentStation.id
        } else {
              this.currentStation = {
              name: '未检测到网点'
            }
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
