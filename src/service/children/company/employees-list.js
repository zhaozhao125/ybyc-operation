import {
  fetch
} from '@/utils/fetch'
import api from '@/service/api/'

const employeesList = (params) => {
  return fetch(api.EMPLOYEES_LIST, params, 'post', {})
}

const employeesAdd = (params) => {
  return fetch(api.EMPLOYEES_ADD, params, 'post', {})
}

const queryAccount = (params) => {
  return fetch(api.EMPLOYEES_QUERY_ACCOUNT, params, 'post', {})
}

const employeesSet = (params) => {
  return fetch(api.EMPLOYEES_SET, params, 'post', {})
}

export default {
  employeesList,
  employeesAdd,
  queryAccount,
  employeesSet
}
