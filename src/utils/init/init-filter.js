import '@/utils/date-filter'
import dayjs from 'dayjs'

export function initFilter(Vue) {
  // 时间格式化过滤器
  Vue.filter('timeFilter', function (value, format) {
    if (!format) {
      format = 'YYYY-MM-DD HH:mm:ss'
    }
    if (!isNaN(value)) {
      if (String(value).length === 10) {
        return dayjs.unix(value).format(format)
      } else if (String(value).length === 13) {
        return dayjs(value).format(format)
      } else {
        return '暂无'
      }
    }
    let date = new Date(value)
    if (!isNaN(date.getTime())) {
      return dayjs(value).format(format)
    }
    if (typeof value === 'string') {
      return value
    }
    return '暂无'
  })
}
