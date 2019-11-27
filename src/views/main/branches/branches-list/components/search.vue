<template>
  <div id="branches-list-search">
    <v-search :searchSettings="searchSettings" @search="handleSearch" @changeCity="receiveCityId" ref="vSearch" labelWidth='120px'>
      <!-- 选择片区 -->
      <template slot="districtId" slot-scope="scope">
        <el-select v-model="scope.model.districtId" :placeholder="placeholder" clearable ref="districtCity" :disabled="districtDisabled">
          <el-option v-for="item in renderAreaList" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </template>
    </v-search>
  </div>
</template>
<script>
import { searchSettings } from './data'
import { handleDate } from '@/utils/date-filter'

export default {
  name: 'branches-list-search',

  data() {
    return {
      searchSettings,
      renderAreaList: [],
      isEmptySelectData: false,
      districtDisabled: true,
      placeholder: '请先选择城市'
    }
  },
  mounted() {
    console.log(this.$refs.vSearch.formModel.operationCityId)
    this.receiveCityId()
  },
  methods: {

    emptySelectData() {
      // alert(1)
      this.isEmptySelectData = true
      // this.renderAreaList = [];
    },
    resetSearch() {
      this.$emit('handleReset')
      this.renderAreaList = []
    },
    handleSearch(searchObj) {
      if (searchObj.time && searchObj.time.length) {
        searchObj.datemin = handleDate(searchObj.time[0])
        searchObj.datemax = handleDate(searchObj.time[1])
      }
      delete searchObj.time
      this.$emit('handleSearchData', searchObj)
    },
    // 获取城市的id
    receiveCityId(operationCityId) {
      operationCityId = this.$refs.vSearch.formModel.operationCityId
      console.log(operationCityId)
      if (!operationCityId) {
        this.$refs.vSearch.formModel.districtId = null
        this.renderAreaList = []
      } else if (operationCityId === 999) {
        this.districtDisabled = true
        this.placeholder = '请先选择城市'
      } else {
        this.placeholder = '加载中，请稍后'
        this.$service.get_districtList(operationCityId).then(res => {
          this.districtDisabled = false
          this.placeholder = '请选择片区'
          this.$refs.vSearch.formModel.districtId = null
          this.renderAreaList = res.data.data.map(item => {
            return {
              value: item.id,
              label: item.name
            }
          })
          console.log(res.data.data, '片区数据')
        })
      }
    }
  }
}
</script>
