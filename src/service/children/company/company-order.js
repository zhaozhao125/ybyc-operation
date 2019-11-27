import {
  fetch
} from '@/utils/fetch'
import api from '@/service/api/'

const companyList = (params) => {
  return fetch(api.COMPANY_ORDER_LIST, params, 'post', false)
}

export default {
  companyList
}
