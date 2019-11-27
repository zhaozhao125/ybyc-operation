<template>
  <div id="car-alarm-search">
    <v-search :searchSettings="searchSettings" @search="handleSearch"> </v-search>
  </div>
</template>
<script>
import { searchSettings } from './data'
import searchHistoryMixin from '@/mixins/search-history.js'
import { submitSearchDataMixin } from '@/mixins/search-page.js'
import searchSelect from '@/components/website-select'
export default {
  name: 'car-alarm-search',
  mixins: [submitSearchDataMixin, searchHistoryMixin],
  data() {
    return {
      searchSettings: searchSettings
    }
  },
  components: {
    searchSelect
  }
}
</script>
