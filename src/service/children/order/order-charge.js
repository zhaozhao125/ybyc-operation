import { fetch } from '@/utils/fetch'
import api from '@/service/api/'

const getOrderChargeList = params => {
  return fetch(
    api.GET_ORDER_CHARGE_LIST,
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

const addOrderChargeTemplate = params => {
  return fetch(api.ADD_ORDER_CHARGE_TEMPLATE, params, 'post', {})
}

const editOrderChargeTemplate = params => {
  return fetch(api.EDIT_ORDER_CHARGE_TEMPLATE, params, 'post', {})
}

const getSuburbanServicesDetail = params => {
  return fetch(api.GET_SUBURBAN_SERVICES_DETAIL, params, 'post', {}, {
    requestBodyType: 'formData'
  })
}

export default {
  getOrderChargeList,
  addOrderChargeTemplate,
  editOrderChargeTemplate,
  getSuburbanServicesDetail
}
