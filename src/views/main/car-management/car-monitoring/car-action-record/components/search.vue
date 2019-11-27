<template>
  <section id="car-action-record-search">
    <v-search :searchSettings="searchSettings" @search="handleSearch"></v-search>
  </section>
</template>
<script>
import { searchSettings } from './data'
import searchHistoryMixin from '@/mixins/search-history.js'
import { submitSearchDataMixin } from '@/mixins/search-page.js'
export default {
  name: 'car-action-record-search',
  mixins: [submitSearchDataMixin, searchHistoryMixin],
  data() {
    return {
      searchSettings: searchSettings
    }
  }
}
</script>
