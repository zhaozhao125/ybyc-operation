import { fetch } from '@/utils/fetch'
import api from '@/service/api/'
import { downloadAjax } from '@/utils/common.js'

const getInvoiceList = params => {
  return fetch(api.INVOICE_LIST, params, {
    defaultCity: {
      name: 'cityId'
    }
  })
}
const invoiceDetail = params => {
  return fetch(
    api.INVOICE_DETAIL,
    params,
    'post',
    {},
    {
      requestBodyType: 'formData'
    }
  )
}
const invoiceRelationOrders = params => {
  return fetch(api.INVOICE_RELATION_ORDERS, params, 'post', {})
}
const invoiceExport = (params, fileName) => {
  return downloadAjax(api.INVOICE_EXPORT, 'post', params, fileName, {
    defaultCity: {
      name: 'cityId'
    }
  })
}
const handleInvoice = params => {
  return fetch(api.INVOICE_HANDLE_STATUS, params, 'post', {})
}
const invoiceOrderInfo = params => {
  return fetch(
    api.INVOICE_ORDER_INFO,
    params,
    'post',
    {},
    {
      requestBodyType: 'formData'
    }
  )
}

export default {
  getInvoiceList,
  invoiceDetail,
  invoiceRelationOrders,
  invoiceExport,
  handleInvoice,
  invoiceOrderInfo
}
