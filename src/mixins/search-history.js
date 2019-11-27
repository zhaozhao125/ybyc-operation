import { historySize } from '@/config/page-config.js'

export default {
  methods: {
    //
    saveHistoryToComponent(searchText, saveName) {
      if (this.searchSettings) {
        let target = this.searchSettings.find(item => item.name === saveName)
        if (target) {
          // 去掉搜索记录中的重复项
          let index = target.data.findIndex(item => item.value === searchText.value)
          if (index > -1) {
            target.data.splice(index, 1)
          }
          target.data.unshift(searchText)
          if (target.data.length > historySize) {
            target.data = target.data.slice(0, historySize)
          }
        }
      }
    },
    _saveSearchHistory(searchText, saveName) {
      if (searchText) {
        // 将searchText转换为autocomplete组件所需要的格式，并增加保存时间
        searchText = {
          value: searchText,
          date: Date.now()
        }

        // 将搜索记录保存到当前组件
        this.saveHistoryToComponent(searchText, saveName)

        // 记录的搜索条目名与当前组件名相关
        let itemName = `${(this.$options.name || this.$options._componentTag)}-${saveName}-history`

        this.$localforage.getItem(itemName).then(history => {
          if (!history) {
            history = []
          }
          // 去掉搜索记录中的重复项
          let index = history.findIndex(item => item.value === searchText.value)
          if (index > -1) {
            history.splice(index, 1)
          }

          history.unshift(searchText)
          // 记录最大程度
          if (history.length > historySize) {
            history = history.slice(0, historySize)
          }
          this.$localforage.setItem(itemName, history)
        })
      }
    },
    _querySearch(name) {
      if (!this.searchSettings) {
        return (queryString, cb) => {
          cb([])
        }
      }
      let arr = this.searchSettings.find(item => item.name === name).data || []
      return (queryString, cb) => {
        let ret = queryString ? arr.filter(item => item.value.toLowerCase().match(queryString.toLowerCase())) : arr
        cb(ret)
      }
    }
  },

  mounted() {
    if (this.searchSettings) {
      this.searchSettings.filter(item => (item.type === 'autocomplete' && item.data)).forEach(item => {
        let itemName = `${(this.$options.name || this.$options._componentTag)}-${item.name}-history`
        this.$localforage.getItem(itemName).then(value => {
          if (value && value.length) {
            item.data = value
          }
        })
      })
    }
  }
}
