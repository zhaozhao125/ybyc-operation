// 请求发送服务
import dataService from '@/service/'
import $http from '@/utils/fetch.js'

export function initService(Vue) {
  Vue.use($http)
  Object.defineProperty(Vue.prototype, '$service', {
    value: dataService,
    writable: false
  })
}
