import Vue from 'vue'
export default Vue.filter('formatData', function (now, isHuor) {
  if (!now) return ''
  let nowDate = new Date(now * 1000) // 是为时间戳转换成标准时间
  return handleDate(nowDate, isHuor)
})
/**
 * 网点列表页面&分时订单在用
 */
export function handleDate (nowDate, type) {
  if (typeof nowDate === 'string') {
    return nowDate
  }
  let year = nowDate.getFullYear()
  let month
  if (nowDate.getMonth() === 0) {
    month = nowDate.getMonth() + '1'
  } else if (nowDate.getMonth() > 0 && nowDate.getMonth() < 9) {
    month = '0' + (nowDate.getMonth() + 1)
  } else {
    month = nowDate.getMonth() + 1
  }
  let date =
    nowDate.getDate() < 10 ? '0' + nowDate.getDate() : nowDate.getDate()
  let hour =
    nowDate.getHours() < 10 ? '0' + nowDate.getHours() : nowDate.getHours()
  let minute =
    nowDate.getMinutes() < 10
      ? '0' + nowDate.getMinutes()
      : nowDate.getMinutes()
  let second =
    nowDate.getSeconds() < 10
      ? '0' + nowDate.getSeconds()
      : nowDate.getSeconds()
  if (type && type === 'day') {
    return year + '-' + month + '-' + date
  } else {
    return (
      year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second
    )
  }
}
