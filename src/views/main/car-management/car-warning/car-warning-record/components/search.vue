<template>
  <section id="car-warning-record-search">
    <v-search :searchSettings="searchSettings" @search="handleSearch" ref="vSearch" @reset='resetSearch'>
      <template slot="typeCode" slot-scope="scope">
        <el-select v-model="scope.model.typeCode" placeholder="请选择" clearable @change="changeItem" @clear='clearEventSelectItem'>
          <el-option v-for="item in typeDist" :key="item.name" :label="item.name" :value="item.code"> </el-option>
        </el-select>
      </template>
      <template slot="eventCode" slot-scope="scope">
        <el-select v-model="scope.model.eventCode" placeholder="请选择" clearable>
          <el-option v-for="(item, index) in eventDist" :key="index" :label="item.name" :value="item.code"> </el-option>
        </el-select>
      </template>
    </v-search>
  </section>
</template>
<script>
import { searchSettings } from './data'
import searchHistoryMixin from '@/mixins/search-history'
import { submitSearchDataMixin } from '@/mixins/search-page'
export default {
  name: 'car-warning-record-search',
  mixins: [submitSearchDataMixin, searchHistoryMixin],
  props: {
    otherCarNumber: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      searchSettings,
      typeDist: [],
      eventDist: []
    }
  },
  computed: {
    // resultOtherCarNumber() {
    //   return this.otherCarNumber ? this.otherCarNumber : ''
    // },
    // activeTab() {
    //   return this.$store.getters.activeTab
    // }
  },
  mounted() {
    this.$nextTick(() => {
      this.$service.getCarWarningDict().then(res => {
        if (res.data.code === '0') {
          this.typeDist = res.data.data
        }
      })
    })
  },
  methods: {
    changeItem(typeCode) {
      this.$nextTick(() => {
        // console.log(this.$refs.vSearch)
        this.$refs.vSearch.formModel.eventCode = null
      })
      this.typeDist.forEach(item => {
        if (item.code === typeCode) {
          this.eventDist = item.event
        }
      })
    },
    clearEventSelectItem() {
      this.eventDist = []
    }
  }
}
</script>
