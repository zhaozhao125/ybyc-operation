<template>
  <section id="area-management-search">
    <v-search :searchSettings="searchSettings" @search="handleSearch">
      <template slot="cityId" slot-scope="scope">
        <search-select v-model="scope.model.cityId" type="city" placeholder="请选择"></search-select>
      </template>
    </v-search>
  </section>
</template>
<script>
import { searchSettings } from './data.js'
import searchHistoryMixin from '@/mixins/search-history.js'
import { submitSearchDataMixin } from '@/mixins/search-page.js'
import searchSelect from '@/components/website-select'
export default {
  name: 'area-management-search',
  mixins: [submitSearchDataMixin, searchHistoryMixin],
  components: {
    searchSelect
  },
  data() {
    return {
      searchSettings: searchSettings
    }
  }
}
</script>
