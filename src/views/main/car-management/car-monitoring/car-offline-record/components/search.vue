<template>
  <div id="car-offline-record-search">
    <v-search :searchSettings="searchSettings" @search="handleSearch"></v-search>
  </div>
</template>
<script>
import { searchSettings } from './data'
import searchHistoryMixin from '@/mixins/search-history.js'
import { submitSearchDataMixin } from '@/mixins/search-page.js'
import { handleDictData } from '@/utils/common'
export default {
  name: 'car-offline-record-search',
  mixins: [submitSearchDataMixin, searchHistoryMixin],
  data() {
    return {
      searchSettings: searchSettings
    }
  },
  mounted() {
    console.log(searchSettings, 'search')
    this.$service.get_carsInfoDict().then(res => {
      this.searchSettings[2].options = handleDictData(res.data.data.models)
    })
  }
}
</script>
