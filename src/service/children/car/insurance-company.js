import { fetch } from '@/utils/fetch'
import api from '@/service/api/'
import fillParams from '@/utils/fill-params.js'

const addInsuranceCompany = (params = {}) => {
  return fetch(api.ADD_INSURANCE_COMPANY, params, 'post', {})
}

const editInsuranceCompany = (params = {}) => {
  return fetch(api.EDIT_COMPANY, params, 'post', {})
}

const insuranceCompanySerch = (params = {}, page = 1, pageSize = 20) => {
  params.page = page
  params.pageSize = pageSize
  return fetch(api.INSURANCE_COMPANY_SEARCH, params, 'post', {})
}

const deleteCompany = function (id) {
  return fetch(`${api.DELETE_COMPANY}/${id}`, {}, 'delete')
}

const whiteCarList = (obj = {}, page = 1, pageSize = 20) => {
  obj.page = page
  obj.pageSize = pageSize
  return fetch(
    api.WHITE_CAR_LIST,
    obj,
    'get',
    {},
    {
      defaultCity: {
        name: 'cityId'
      }
    }
  )
}
export default {
  addInsuranceCompany,
  editInsuranceCompany,
  insuranceCompanySerch,
  deleteCompany
}
