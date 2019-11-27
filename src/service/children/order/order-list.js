import { fetch } from '@/utils/fetch'
import api from '@/service/api/'

const getOrderList = params => {
  return fetch(
    api.ORDER_LIST,
    params,
    'post',
    {},
    {
      defaultCity: {
        name: 'cityId'
      }
    }
  )
}

const getOrderInfo = params => {
  return fetch(api.ORDER_INFO, params, 'post', {})
}

const getOrderCurrentBilling = params => {
  return fetch(
    api.ORDER_CURRENT_BILLING,
    params,
    'post',
    {},
    {
      requestBodyType: 'formData'
    }
  )
}

const orderReturnDetails = params => {
  return fetch(
    api.ORDER_RETURN_DETAILS,
    params,
    'post',
    {},
    {
      requestBodyType: 'formData'
    }
  )
}

const orderCoupons = params => {
  return fetch(api.ORDER_COUPONS, params, 'post', {}, {
    requestBodyType: 'formData'
  })
}

const orderCouponsInfo = params => {
  return fetch(api.ORDER_COUPONS_INFO, params, 'post', {})
}

const orderReturnCar = params => {
  return fetch(api.ORDER_RETURN_CAR, params, 'post', {}, {
    requestBodyType: 'formData',
    noErrorMsg: true
  })
}
const orderReturnCarCopy = params => {
  return fetch(api.ORDER_RETURN_CAR_COPY, params, 'post', {})
}

const orderLock = params => {
  return fetch(api.ORDER_LOCK, params, 'post', {})
}

const orderUnlock = params => {
  return fetch(api.ORDER_UNLOCK, params, 'post', {})
}

export default {
  getOrderList,
  getOrderInfo,
  getOrderCurrentBilling,
  orderReturnDetails,
  orderReturnCar,
  orderReturnCarCopy,
  orderCoupons,
  orderCouponsInfo,
  orderLock,
  orderUnlock
}
