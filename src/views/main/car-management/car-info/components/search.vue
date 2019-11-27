<template>
  <div id="car-info-search">
    <v-search :searchSettings="searchSettings" @search="handleSearch"> </v-search>
  </div>
</template>
<script>
import { searchSettings } from './data'
import searchHistoryMixin from '@/mixins/search-history'
import { submitSearchDataMixin } from '@/mixins/search-page'
import { handleDictData } from '@/utils/common'
import searchSelect from '@/components/website-select'
export default {
  name: 'car-info-search',
  mixins: [submitSearchDataMixin, searchHistoryMixin],
  data() {
    return {
      searchSettings: searchSettings
    }
  },
  mounted() {
    // 获取字典下拉列表
    this.carsInfoDict()
  },
  components: {
    searchSelect
  },
  methods: {
    carsInfoDict() {
      this.$service.get_carsInfoDict().then(res => {
        let { models, owners } = res.data.data
        this.searchSettings[3].options = handleDictData(models)
        this.searchSettings[4].options = handleDictData(owners)
      })
    }
  }
}
</script>
