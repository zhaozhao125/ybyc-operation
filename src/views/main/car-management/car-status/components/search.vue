<template>
  <section id="car-status-search">
    <!-- {{otherCarNumber}} -->
    <v-search :searchSettings="searchSettings" @search="handleSearch" ref="vSearch" @reset='resetSearch'> </v-search>
  </section>
</template>
<script>
import { searchSettings } from './data.js'
import searchHistoryMixin from '@/mixins/search-history.js'
import { submitSearchDataMixin } from '@/mixins/search-page.js'
import { handleDictData } from '@/utils/common.js'
import searchSelect from '@/components/website-select'
export default {
  name: 'car-status-search',
  mixins: [submitSearchDataMixin, searchHistoryMixin],
  components: {
    searchSelect
  },
  // props: {
  //   otherCarNumber: {
  //     type: String,
  //     default: ''
  //   }
  // },
  data() {
    return {
      searchSettings: searchSettings
    }
  },
  computed: {
    resultOtherCarNumber() {
      return this.otherCarNumber ? this.otherCarNumber : ''
    },
    activeTab() {
      return this.$store.getters.activeTab
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.carsStatusDict()
    })
  },
  methods: {
    // // 处理其他页面传过来的车牌号 index页面调用
    // handleOtherNumber() {
    //   if (this.resultOtherCarNumber) {
    //     this.$refs.vSearch.formModel.keyWords = this.resultOtherCarNumber
    //   }
    // },
    resetSearch() {
      // 清空提交的数据
      this.$store.commit('sendToTab', {
        name: 'carStatus',
        params: {}
      })
      this.$refs.vSearch.formModel.keyWords = ''
    },
    carsStatusDict() {
      this.$service.get_carsStatusDict().then(res => {
        let { models } = res.data.data
        this.searchSettings[5].options = handleDictData(models)
      })
    }
  }
}
</script>
