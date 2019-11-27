<template>
  <div class="create-workorder">
    <v-page :visible.sync="visible" :before-close="handleBeforeClose">
      <h3 slot="title">创建工单</h3>
      <v-form ref="form" slot="content" :formSettings="formSettings" :showButton="false" @typeChange="handleTypeChange" @changDistributeType="handleChangDistributeType">
        <!-- 故障类型 -->
        <template slot="repairTypes" slot-scope="scope">
          <el-checkbox-group v-model="scope.model.repairTypes">
            <el-checkbox v-for="(checkItem) in repairList" :key="checkItem.id" :label="checkItem.id">{{checkItem.name}}</el-checkbox>
          </el-checkbox-group>
        </template>
        <!-- 物料类型 -->
        <template slot="materielTypes" slot-scope="scope">
          <el-checkbox-group v-model="scope.model.materielTypes">
            <el-checkbox v-for="(checkItem) in materiaList" :key="checkItem.id" :label="checkItem.id">{{checkItem.name}}</el-checkbox>
          </el-checkbox-group>
        </template>
        <!-- 选择调度原因 -->
        <!-- <template slot="dispatchReason" slot-scope="scope">
          <el-checkbox-group v-model="scope.model.dispatchReason">
            <el-checkbox v-for="(checkItem) in materiaList" :key="checkItem.id" :label="checkItem.id">{{checkItem.name}}</el-checkbox>
          </el-checkbox-group>
        </template> -->
        <!-- 选择网点 -->
        <template slot="destinationStationId" slot-scope="scope">
          <span v-if="selectedStation" class="selected-station">已选择网点：<span>{{selectedStation.name}}</span></span>
          <el-button type="primary" @click="handleShowStations">选择网点</el-button>
        </template>
        <el-form-item slot="bottom-slot">
          <el-button type="primary" :loading="loading=='create'" :disabled="!!loading" @click="handleCreateWorkorder('create')">创建工单</el-button>
          <el-button type="default" v-if="distributeType=='assign'" :loading="loading=='assign'" :disabled="!!loading" @click="handleCreateWorkorder('assign')">创建并指派</el-button>
        </el-form-item>
      </v-form>
    </v-page>
    <searchStation ref="searchStation" :visible.sync="stationVisible" :carNumber="carNumber" :showUserVisibleStationOnly="false" @confirm="handleSelectStation"></searchStation>
    <!-- <assignList :visible.sync="assignVisible" :title="assignTitle" @success="handleAssignSuccess"></assignList> -->
    <!-- <searchStation></searchStation> -->
  </div>
</template>
<script>
import formSettings from './formSettings.js'
import assignList from '../assign-list.vue'
import searchStation from '@/components/search-station/'
export default {

  name: 'add-word-order',

  props: {
    visible: {
      type: Boolean,
      default: false
    },
    getParams: Object
  },

  components: {
    searchStation,
    assignList
  },

  data() {
    formSettings[0].items[0].rule = [{
      validator: this.carNumberValidator,
      trigger: 'blur'
    }]
    return {
      formSettings,
      loading: false,
      // assignVisible: false,
      assignTitle: '指派',
      distributeType: 'assign',
      repairList: [],
      materiaList: [],
      stationVisible: false,
      carSn: '',
      carNumber: '',
      selectedStation: null
    }
  },

  mounted() {
  },

  methods: {
    carNumberValidator(rule, value, callback) {
      if (!value) {
        this.carNumber = ''
        return callback(new Error('请输入车牌号'))
      }
      let carNumber = this.$refs.form.getData('carNumber')
      if ((this.carNumber == carNumber) && this.carSn) {
        return callback()
      }
      this.loading = true
      this.$service.getCarByNumber(carNumber).then(res => {
        let result = res.data
        if (result.data.records.length == 0) {
          this.carNumber = ''
          callback(new Error('查询不到相关车辆'))
        } else {
          this.carSn = res.data.data.records[0].carSn
          this.carNumber = carNumber
          callback()
        }
        this.loading = false
      }).catch(err => {
        callback(new Error('查询车辆失败'))
        this.loading = false
      })
    },
    closeMe() {
      this.$emit('update:visible', false)
      this.$refs.form.resetFields()
    },
    setCarNumber(carNumber, carSn, taskMsg) {
      this.$emit('update:visible', true)
      this.selectedStation = null
      this.$refs.form && this.$refs.form.resetFields()
      this.hideAllType()
      this.$nextTick(() => {
        let form = this.$refs.form
        form.setData('carNumber', carNumber)
        taskMsg && form.setData('taskMsg', taskMsg)
        this.carNumber = carNumber
        this.carSn = carSn
      })
    },
    handleBeforeClose() {
      this.$emit('update:visible', false)
      this.$emit('close')
      this.distributeType = 'assign'
      this.selectedStation = null
      this.hideAllType()
      return false
    },
    getRepairType() {
      this.$service.getRepairType().then(res => {
        this.repairList = res.data.data
      })
    },
    getMaterialType() {
      this.$service.getMaterialType().then(res => {
        this.materiaList = res.data.data
      })
    },
    hideAllType() {
      this.formSettings[0].items.find(item => item.name == 'destinationStationId').hidden = true
      this.formSettings[0].items.find(item => item.name == 'dispatchReason').hidden = true
      this.formSettings[0].items.find(item => item.name == 'repairTypes').hidden = true
      this.formSettings[0].items.find(item => item.name == 'materielTypes').hidden = true
      this.formSettings[0].items.find(item => item.name == 'cleanTaskType').hidden = true
    },
    handleTypeChange(type) {
      // 充电单、清洁单
      if (type == 'clean_car' || type == 'charge_car') {
        this.hideAllType()
        if (type == 'clean_car') {
          this.formSettings[0].items.find(item => item.name == 'cleanTaskType').hidden = false
        }
      } else if (type == 'dispatch_car') {
        // 调度单
        this.formSettings[0].items.find(item => item.name == 'destinationStationId').hidden = false
        this.formSettings[0].items.find(item => item.name == 'dispatchReason').hidden = false
        this.formSettings[0].items.find(item => item.name == 'repairTypes').hidden = true
        this.formSettings[0].items.find(item => item.name == 'materielTypes').hidden = true
        this.formSettings[0].items.find(item => item.name == 'cleanTaskType').hidden = true
      } else if (type == 'repair_car') {
        // 维修单
        if (!this.repairList.length) {
          this.getRepairType()
        }
        this.formSettings[0].items.find(item => item.name == 'destinationStationId').hidden = true
        this.formSettings[0].items.find(item => item.name == 'dispatchReason').hidden = true
        this.formSettings[0].items.find(item => item.name == 'repairTypes').hidden = false
        this.formSettings[0].items.find(item => item.name == 'materielTypes').hidden = true
        this.formSettings[0].items.find(item => item.name == 'cleanTaskType').hidden = true
      } else if (type == 'lack_materiel') {
        if (!this.materiaList.length) {
          this.getMaterialType()
        }
        this.formSettings[0].items.find(item => item.name == 'destinationStationId').hidden = true
        this.formSettings[0].items.find(item => item.name == 'dispatchReason').hidden = true
        this.formSettings[0].items.find(item => item.name == 'repairTypes').hidden = true
        this.formSettings[0].items.find(item => item.name == 'materielTypes').hidden = false
        this.formSettings[0].items.find(item => item.name == 'cleanTaskType').hidden = true
      }
      this.$refs.form.updateRule()
    },
    handleShowStations() {
      this.stationVisible = true
    },
    handleChangDistributeType(type) {
      if (type == 'assign_task') {
        this.distributeType = 'assign'
      } else {
        this.distributeType = 'compete'
      }
    },
    handleCreateWorkorder(type) {
      this.$refs.form.getDataAsync().then(data => {
        if (!data) {
          return
        }
        data.carSn = this.carSn
        data.images = data.images.map(item => item.url)
        data.taskSource = 'optimus_admin'
        data.authorMobile = this.$store.getters.user.mobilePhone
        this.loading = type
        // 如果是调度单，需要传网点名
        if (data.taskType == 'dispatch_car') {
          data.destinationStationName = this.selectedStation.name
        }
        if (type == 'assign' && data.distributeType == 'grab_task') {
          this.$message({
            message: '不能对抢单类型进行指派'
          })
          return
        }
        if (typeof this.getParams === 'object') {
          Object.assign(data, this.getParams)
        }
        this.$service.createWorkorder(data).then(res => {
          this.loading = false
          this.$refs.form.clearForm()
          this.hideAllType()
          // let tabParams = this.$store.getters.tabParams
          // if (tabParams) {
          //   if (tabParams.from === 'car-warning' && tabParams.carNumber === data.carNumber) {
          //     this.$store.commit('sendToTab', {
          //       name: 'carWarningRecord',
          //       params: {
          //         msg: 'success'
          //       }
          //     })
          //   }
          // }
          this.$emit('success', type, res.data.data)
          this.$emit('update:visible', false)
        }).catch(err => {
          this.loading = false
        })
      }).catch(err => {
        console.log('====err====', err)
      })
    },
    // handleAssignSuccess() {
    //   this.assignVisible = false
    //   this.closeMe()
    // }
    handleSelectStation(data) {
      this.selectedStation = data
      this.$refs.form.setData('destinationStationId', data.id)
    }
  },

  watch: {
    visible() {
      if (this.visible) {
        this.$refs.searchStation.resetStation()
        console.log('====this.getParams====', this.getParams)
        if (this.getParams) {
          this.$nextTick(() => {
            let form = this.$refs.form
            form.setData('carNumber', this.getParams.carNumber)
            form.setData('taskType', this.getParams.taskType)
            form.setData('images', this.getParams.images)
            form.setData('taskMsg', this.getParams.remark)
          })
        }
      }
    }
  }
}
</script>
<style lang="scss">
.create-workorder{
  .selected-station{
    display: inline-block;
    margin-right: 20px;
    span{
      color: $color-red;
    }
  }
  .v-form {
    max-width: 900px;
  }
}

</style>
