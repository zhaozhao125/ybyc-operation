<template>
  <section id="branches-vehicle-search">
    <v-search :searchSettings="searchSetting" @search="handleSearch" hideReset>
      <template slot="stationId" slot-scope="scope">
        <website-select v-model="scope.model.stationId" placeholder="请输入网点名称" isRequest :open='false'></website-select>
      </template>
    </v-search>
  </section>
</template>
<script>
import { submitSearchDataMixin } from '@/mixins/search-page.js'
import websiteSelect from '@/components/website-select'
export default {
  name: 'branches-vehicle-search',
  mixins: [submitSearchDataMixin],
  data() {
    return {
      searchSetting: [
        {
          label: '搜索',
          name: 'stationId',
          type: 'slot',
          visible: true // 默认显示
        }
      ],
      selectSiteLoading: false,
      selectSite: [],
      siteList: []
    }
  },
  mounted() {
    this.$nextTick(() => {
    })
  },
  methods: {
    handleSearch(stationId) {
      console.log(stationId, '====')
      this.$emit('handleSearchData', stationId)
    }
  },
  components: {
    websiteSelect
  }
}
</script>
