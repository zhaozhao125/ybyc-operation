import { pageSize } from '@/config/page-config'
import vSearch from '@/components/search/vSearch'
import siteMap from '@/components/siteMap/site-map'
import { handleSubmitSearchData } from '@/utils/common'

export const searchPage = {
  props: {
    searchData: {
      type: Object
    }
  },
  data () {
    return {
      tableData: [],
      total: 0,
      paging: {
        page: 1,
        pageSize: pageSize
      }
      // flagBit: false // 标志位
    }
  },
  methods: {
    handleCurrentChange (page) {
      // 标志位
      if (this.flagBit) {
        this.flagBit = false
        return
      }
      this.paging.page = page
      this.handleSearch()
    }
  },
  mounted () {
    this.$nextTick(() => {
      // alert(this.otherCarNumber)
      // 只有车辆状态模块再用
      if (this.otherCarNumber) {
        return
      }
      this.handleSearch(this.paging)
    })
  },
  watch: {
    searchData () {
      // this.flagBit = true
      this.paging.page = 1
      this.handleSearch()
    }
  }
}
// 提交的搜索数据
export const submitSearchDataMixin = {
  methods: {
    resetSearch () {
      this.$emit('handleReset')
    },
    handleSearch (searchObj) {
      console.log(searchObj, '提交的字段')
      this.$emit('handleSearchData', handleSubmitSearchData(searchObj))
      this._saveSearchHistory(searchObj.keyWords, 'keyWords')
    }
  },
  components: {
    vSearch
  }
}
export const alarmPosition = {
  methods: {
    // 处理报警地点
    alarmPosition (lng, lat) {
      return [lng, lat]
    }
  },
  components: {
    siteMap
  }
}
// 网点搜索条件
export const branchesSearchPage = {
  data () {
    return {
      tableData: [],
      total: 0,
      // flagBit: false, // 标志位
      paging: {
        page: 1,
        rows: pageSize
      }
    }
  },
  props: {
    searchData: {
      type: Object
    }
  },
  methods: {
    handleCurrentChange (page) {
      // 标志位
      // if (this.flagBit) {
      //     this.flagBit = false
      //     return
      // }
      this.paging.page = page
      this.handleSearch()
    }
  },
  mounted () {
    this.$nextTick(() => {
      if (this.websiteName) {
        return
      }
      this.handleSearch(this.paging)
    })
  },
  watch: {
    searchData () {
      // this.flagBit = true
      this.paging.page = 1
      console.log('监听搜索条件变化')
      this.handleSearch()
    }
  }
}

export const orderSearchPage = {
  props: {
    searchData: {
      type: Object
    }
  },
  data () {
    return {
      tableData: [],
      total: 0,
      paging: {
        page: 1,
        pageSize: 10
      },
      flagBit: false // 标志位
    }
  },
  methods: {
    handleCurrentChange (page) {
      // 标志位
      // if (this.flagBit) {
      //     this.flagBit = false
      //     return
      // }
      this.paging.page = page
      this.handleSearch()
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.handleSearch(this.paging)
    })
  },
  watch: {
    searchData () {
      // this.flagBit = true
      this.paging.page = 1
      this.handleSearch()
    }
  }
}
