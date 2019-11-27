import {
  fetch
} from '@/utils/fetch'
import api from '@/service/api/'
import {
  downloadAjax
} from '@/utils/common.js'
const getRechargeCardList = (params) => {
  return fetch(api.RECHARGE_CARD_LIST, params, 'post', {}, {
    requestBodyType: 'formData'
  })
}
const createRechargeCard = (params) => {
  return fetch(api.ADD_RECHARGE_CARD, params, 'post', {})
}
const updateRechargeCard = (params) => {
  return fetch(api.UPDATE_RECHARGE_CARD, params, 'post', {})
}
const switchRecahrgeCardStatus = (params) => {
  return fetch(api.SWITCH_RECHARGE_CARD_STATUS, params, 'post', {})
}
const sendingList = (params) => {
  return fetch(api.SENDING_LIST, params, 'post', {}, {
    requestBodyType: 'formData'
  })
}
const rechargeCardDetails = (params) => {
  return fetch(api.RECHARGE_CARD_DETAIL, params, 'get', {})
}
const exportRechargeCardInfo = params => {
  return downloadAjax(api.EXPORT_RECHARGE_CARD_INFO + '?prepaidCardId=' + params, 'post', {}, '充值卡卡号密码.xlsx')
}

export default {
  getRechargeCardList,
  createRechargeCard,
  updateRechargeCard,
  switchRecahrgeCardStatus,
  rechargeCardDetails,
  exportRechargeCardInfo,
  sendingList
}
