<template>
  <div class="signin-station">
    <el-card class="table-box">
      <div slot="header">
        <v-search ref="search" :searchSettings="searchSettings" labelWidth="130px" @search="handleSearch" @reset="handleReset" @changeCity="handleChangeCity">
          <template slot="districtId" slot-scope="scope">
            <el-select v-model="scope.model.districtId" :placeholder="districtPlaceholder" :disabled="districtDisabled" clearable>
              <el-option v-for="item in districtOptions" :key="item.value" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </template>
        </v-search>
      </div>
      <div class="table-container">
        <signinStationMap :stationData="stationData"></signinStationMap>
      </div>
    </el-card>
  </div>
</template>

<script>
import searchSettings from './components/searchSettings.js'
import signinStationMap from './components/map'
export default {
  components: { signinStationMap },

  data() {
    return {
      searchSettings,
      searchParams: {
        signDate: searchSettings[0].value
      },
      stationData: null,

      districtPlaceholder: '请先选择城市',
      districtDisabled: true,
      districtOptions: [],
    }
  },

  methods: {
    loadData(){
      this.$service.getSigninStation(this.searchParams).then(res => {
        console.log('====res====', res)
        this.stationData = res.data.data
      })
    },
    handleSearch(data) {
      if (data.operationCityId === 999) {
        delete data.operationCityId
      }
      this.searchParams = data
      console.log(this.searchParams)
      this.loadData()
    },
    handleReset() {
      this.searchParams = null
    },
    handleChangeCity() {
      this.$refs.search.formModel.districtId = ''
      this.districtDisabled = true
      this.districtPlaceholder = '加载中，请稍后'
      this.$refs.search.formModel.districtId = ''
      let cityId = this.$refs.search.formModel.operationCityId
      this.currentCityId = cityId
      if (cityId === 999) {
        this.districtDisabled = true
        this.districtPlaceholder = '请先选择城市'
      } else {
        this.getDistrict(cityId)
      }
      // this.$service.getDistrictByCity(cityId).then(res => {
      //   this.districtOptions = res.data.data
      //   this.districtDisabled = false
      //   this.districtPlaceholder = '请选择'
      // })
    },
    // 根据城市选择片区
    getDistrict (cityId) {
      console.log(cityId)
      // let cityId = this.$refs.search.formModel.areaId
      this.$service.getDistrictByCity(cityId).then(res => {
        this.districtOptions = res.data.data
        this.districtDisabled = false
        this.districtPlaceholder = '请选择'
      })
    }
  },
  mounted(){
    this.$nextTick(() => {
      let operationCityId = this.$refs.search.formModel.operationCityId
      this.getDistrict(operationCityId)
      this.searchParams.operationCityId = operationCityId
      this.loadData()
    })
  }
}
</script>

<style lang="scss">

</style>
