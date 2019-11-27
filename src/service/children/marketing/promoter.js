import {
  fetch
} from '@/utils/fetch'
import api from '@/service/api/'
// 推广员
const promoterList = (params) => {
  return fetch(api.PROMOTER_LIST, params, 'post', {})
}
// 用户列表
const getPromoterCustomerList = (params) => {
  return fetch(api.PROMOTER_CUSTOMER_LIST, params, 'post', {})
}
// 添加推广员
const addPromoter = params => {
  return fetch(api.ADD_PROMOTER, params, 'post', {})
}
/**
 * 删除推广员
 * @param {Array} params 推广人员id的数据
 */
const delPromoter = params => {
  return fetch(api.DELETE_PROMOTER, params, 'post', {})
}

export default {
  promoterList,
  getPromoterCustomerList,
  addPromoter,
  delPromoter
}
