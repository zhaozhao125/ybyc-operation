<template>
  <v-page :visible.sync="visible" :before-close="handleBeforeClose">
    <h3 slot="title">{{type=='create'?'添加用户':'编辑用户'}}</h3>
    <v-form ref="form" slot="content" :formSettings="formSettings" :formData="data" :btnLoading="loading" :showButton="true" @save="handleSave"  @changeCity="handleChangeCity">
      <!--角色-->
      <template slot="roleId" slot-scope="scope">
        <el-select v-model="scope.model.roleId" @change="roleChange" :placeholder="'请选择用户角色'" :disabled="selectDisabled">
          <el-option v-for="item in userTypeList" :key="item.id" :label="item.roleName" :value="item.id">
          </el-option>
        </el-select>
      </template>

      <template slot="userDistricts" slot-scope="scope">
        <el-select v-model="scope.model.userDistricts" :placeholder="selectPlaceholder" :disabled="selectDisabled" multiple>
          <el-option v-for="item in districtOptions" :key="item.value" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </template>
      <template slot="userStations" slot-scope="scope">
        <el-select v-model="scope.model.userStations" :placeholder="selectPlaceholder" :disabled="selectDisabled" multiple filterable>
          <el-option v-for="item in stationOptions" :key="item.value" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </template>
      <template slot="userAcceptDistricts" slot-scope="scope">
        <el-select v-model="scope.model.userAcceptDistricts" :placeholder="selectPlaceholder" :disabled="selectDisabled" multiple >
          <el-option v-for="item in districtOptions" :key="item.value" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </template>
      <template slot="userAcceptStations" slot-scope="scope">
        <el-select v-model="scope.model.userAcceptStations" :placeholder="selectPlaceholder" :disabled="selectDisabled" multiple filterable>
          <el-option v-for="item in stationOptions" :key="item.value" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </template>
    </v-form>
  </v-page>
</template>
<script>
import formSettings from './formSettings.js'
export default {

  name: 'add-opuser',

  props: {
    visible: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object
    },
    type: {
      tpye: String,
      default: 'create'
    }
  },

  data() {
    return {
      formSettings,
      districtOptions: [],
      userTypeList: [],
      selectDisabled: false,
      selectPlaceholder: '请先选择地区',
      stationOptions: [],
      model: [],
      loading: false,
      carAuthScopeOnAcceptCopy: '',
      carAuthScopeOnCreateCopy: ''
    }
  },
  created() {
    this.$nextTick(() => {
      // this.getAllRoles()
    })
  },
  methods: {
    clearForm() {
      this.$refs.form.clearForm()
      this.loading = false
    },
    handleBeforeClose() {
      this.$emit('update:visible', false)
      this.formSettings[0].items.find(item => item.name === 'userStations').hidden = true
      this.formSettings[0].items.find(item => item.name === 'userDistricts').hidden = true
      this.formSettings[0].items.find(item => item.name === 'userAcceptStations').hidden = true
      this.formSettings[0].items.find(item => item.name === 'userAcceptDistricts').hidden = true
      return false
    },
    getAllRoles(id) {
      this.$service.getRoleIndex({ cityId: id }).then(res => {
        if (res.data.code == 0) {
          this.userTypeList = res.data.data
          console.log(this.userTypeList)
        }
      })
    },
    handleChangeCity(action) {
      let cityId = this.$refs.form.formModel.areaId.value
      this.$refs.form.setData('roleId', '')
      this.userTypeList = []
      this.getAllRoles(cityId)

      this.selectDisabled = true
      this.selectPlaceholder = '加载中，请稍后'

      this.$refs.form.formModel.userStations = []
      this.$refs.form.formModel.userAcceptStations = []

      this.$service.post_allWebSite(cityId).then(res => {
        this.stationOptions = res.data.data
        this.selectDisabled = false
        this.selectPlaceholder = '请选择'
      })

      this.$refs.form.formModel.userDistricts = []
      this.$refs.form.formModel.userAcceptDistricts = []

      this.$service.getDistrictByCity(cityId).then(res => {
        this.districtOptions = res.data.data
        this.selectDisabled = false
        this.selectPlaceholder = '请选择'
      })
    },
    roleChange(roleId, initial) {
      this.$service.getRoleInfo({ 'id': roleId }).then(res => {
        if (res.data.code == 0) {
          this.carAuthScopeOnAcceptCopy = res.data.data.carAuthScopeOnAccept
          this.carAuthScopeOnCreateCopy = res.data.data.carAuthScopeOnCreate
          this.formSettings[0].items.find(item => item.name === 'userStations').hidden = true
          this.formSettings[0].items.find(item => item.name === 'userDistricts').hidden = true
          this.formSettings[0].items.find(item => item.name === 'userAcceptStations').hidden = true
          this.formSettings[0].items.find(item => item.name === 'userAcceptDistricts').hidden = true
          // 拥有发单权限
          if (res.data.data.hasCreateAuth) {
            if (res.data.data.carAuthScopeOnCreate === 'station') {
              this.formSettings[0].items.find(item => item.name === 'userStations').required = true
              this.formSettings[0].items.find(item => item.name === 'userStations').hidden = false
            } else {
              this.formSettings[0].items.find(item => item.name === 'userDistricts').required = true
              this.formSettings[0].items.find(item => item.name === 'userDistricts').hidden = false
            }
          }
          // 拥有接单权限
          if (res.data.data.hasAcceptAuth) {
            if (res.data.data.carAuthScopeOnAccept === 'station') {
              this.formSettings[0].items.find(item => item.name === 'userAcceptStations').required = true
              this.formSettings[0].items.find(item => item.name === 'userAcceptStations').hidden = false
            } else {
              this.formSettings[0].items.find(item => item.name === 'userAcceptDistricts').required = true
              this.formSettings[0].items.find(item => item.name === 'userAcceptDistricts').hidden = false
            }
          }
          this.$refs.form.updateRule()
          if (!initial) {
            this.$refs.form.setData('userAcceptDistricts', [])
            this.$refs.form.setData('userAcceptStations', [])
            this.$refs.form.setData('userDistricts', [])
            this.$refs.form.setData('userStations', [])
          }
        }
      })
    },
    handleSave(data) {
      let params = Object.assign({}, data)
      if (params.userAcceptDistricts.length > 0) {
        let userAcceptDistricts = this.districtOptions.filter(item => params.userAcceptDistricts.some(id => id === item.id)).map(item => {
          return {
            districtId: item.id,
            districtName: item.name
          }
        })
        params.userAcceptDistricts = userAcceptDistricts
      } else {
        delete params.userAcceptDistricts
      }
      if (params.userDistricts.length > 0) {
        let userDistricts = this.districtOptions.filter(item => params.userDistricts.some(id => id === item.id)).map(item => {
          return {
            districtId: item.id,
            districtName: item.name
          }
        })
        params.userDistricts = userDistricts
      } else {
        delete params.userDistricts
      }
      if (params.userStations.length > 0) {
        let userStations = this.stationOptions.filter(item => params.userStations.some(id => id === item.id)).map(item => {
          return {
            stationId: item.id,
            stationName: item.name
          }
        })
        params.userStations = userStations
      } else {
        delete params.userStations
      }
      if (params.userAcceptStations.length > 0) {
        let userAcceptStations = this.stationOptions.filter(item => params.userAcceptStations.some(id => id === item.id)).map(item => {
          return {
            stationId: item.id,
            stationName: item.name
          }
        })
        params.userAcceptStations = userAcceptStations
      } else {
        delete params.userAcceptStations
      }

      let areaId = params.areaId.value
      let areaName = params.areaId.label
      params.areaId = areaId
      params.areaName = areaName
      this.loading = true

      console.log(this.carAuthScopeOnAcceptCopy, this.carAuthScopeOnCreateCopy)
      if (this.carAuthScopeOnAcceptCopy === 'district') {
        delete params.userAcceptStations
      } else if (this.carAuthScopeOnAcceptCopy === 'station') {
        delete params.userAcceptDistricts
      }
      if (this.carAuthScopeOnCreateCopy === 'district') {
        delete params.userStations
      } else if (this.carAuthScopeOnAcceptCopy === 'station') {
        delete params.userDistricts
      }
      if (this.type == 'update') {
        params.sn = this.data.sn
        this.$service.updateOpUser(params).then(res => {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.loading = false
          this.$emit('success')
        }).catch(err => {
          this.loading = false
        })
      } else {
        this.$service.addOpUser(params).then(res => {
          this.$alert(`用户密码为： ${res.data.data.passwd}`, '添加成功', {
            confirmButtonText: '确定',
            type: 'success',
            callback: action => {
              this.loading = false
              this.$emit('success')
            }
          })
        }).catch(err => {
          this.loading = false
        })
      }
    }
  },
  watch: {
    visible(key) {
      if (key) {
        if (this.data) {
          this.getAllRoles(this.data.areaId.value)
        }
      }
    },
    data(data) {
      if (this.type) {
        this.$nextTick(() => {
          if (this.type === 'update') {
            this.roleChange(data.roleId, true)
            this.$service.post_allWebSite(data.areaId.value).then(res => {
              this.stationOptions = res.data.data
              this.selectDisabled = false
              this.selectPlaceholder = '请选择'
            })
            this.$service.getDistrictByCity(data.areaId.value).then(res => {
              this.districtOptions = res.data.data
              this.selectDisabled = false
              this.selectPlaceholder = '请选择'
            })
          }
        })
      }
    }
  }
}

</script>
<style lang="scss">

</style>
