import { fetch } from '@/utils/fetch'
import api from '@/service/api/'
import fillParams from '@/utils/fill-params.js'
import { downloadAjax } from '@/utils/common.js'

const addPoint = (params = {}) => {
  return fetch(api.ADD_POINT, params, 'post', {})
}

const editPoint = (params = {}) => {
  return fetch(api.POINT_EDIT, params, 'post', {})
}

const cityPoint = (params = {}) => {
  return fetch(api.CITY_POINT, params, 'post', {})
}

const pointInfor = (params = {}) => {
  return fetch(api.POINT_INFOR, params, 'post', {})
}

const deleteInfor = (params = {}) => {
  return fetch(api.DELETE_POINT, params, 'post', {})
}

const workPointLists = (params = {}, page = 1, pageSize = 20) => {
  params.page = page
  params.pageSize = pageSize
  return fetch(api.WORKER_POINT_LIST, params, 'post', {})
}

const pointStatistic = (params = {}, page = 1, pageSize = 20) => {
  params.page = page
  params.pageSize = pageSize
  return fetch(api.POINT_STATISTIC, params, 'post', {})
}

const exportPoint = params => {
  return downloadAjax(api.EXPORT_POINT, 'post', params, '人员工分汇总.xlsx', {
    defaultCity: {
      name: 'cityId'
    }
  })
}
export default {
  workPointLists,
  addPoint,
  pointInfor,
  editPoint,
  deleteInfor,
  pointStatistic,
  cityPoint,
  exportPoint
}
