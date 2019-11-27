import {
  fetch
} from '@/utils/fetch'
import api from '@/service/api/'

const getCompanyList = (params) => {
  return fetch(api.COMPANY_LIST, params, 'post', {})
}

const createCompany = (params) => {
  return fetch(api.COMPANY_CREATE, params, 'post', {})
}

const updateCompany = (params) => {
  return fetch(api.COMPANY_UPDATE, params, 'post', {})
}

const companyDetails = (params) => {
  return fetch(api.COMPANY_INFO, params, 'post', {})
}

const companyOpened = (params) => {
  return fetch(api.COMPANY_opened, params, 'post', {})
}

const companyClosed = (params) => {
  return fetch(api.COMPANY_closed, params, 'post', {})
}

const companyCharge = (params) => {
  return fetch(api.COMPANY_CHARGE, params, 'post', {}, {
    requestBodyType: 'formData'
  })
}

const companyRefund = (params) => {
  return fetch(api.COMPANY_REFUND, params, 'post', {}, {
    requestBodyType: 'formData'
  })
}

export default {
  getCompanyList,
  createCompany,
  updateCompany,
  companyDetails,
  companyOpened,
  companyClosed,
  companyCharge,
  companyRefund
}
