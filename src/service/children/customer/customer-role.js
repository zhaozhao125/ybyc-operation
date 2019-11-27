import { fetch } from '@/utils/fetch'
import api from '@/service/api/'
import { pageSize } from '@/config/page-config.js'
import { download } from '@/utils/common'

const getCustomerRoleList = (params) => {
  return fetch(api.CUSTOMER_ROLE_LIST, params, 'post', {})
}
const addCustomerRole = (params) => {
  return fetch(api.ADD_CUSTOMER_ROLE, params, 'post', {})
}
const editCustomerRole = (params) => {
  return fetch(api.EDIT_CUSTOMER_ROLE, params, 'post', {})
}
const delCustomerRole = (params) => {
  return fetch(api.DEL_CUSTOMER_ROLE, params, 'post', {})
}

export default {
  getCustomerRoleList,
  addCustomerRole,
  editCustomerRole,
  delCustomerRole
}
