import { fetch } from '@/utils/fetch'
import api from '@/service/api/'
import { pageSize } from '@/config/page-config.js'

// 获取网点数据
const getStationByName = (name = '') =>
  fetch(
    api.ALLWEBSITE,
    {
      name
    },
    'post'
  )

const getStationByCityId = (operationCityId, open = true) =>
  fetch(
    api.ALLWEBSITE,
    {
      operationCityId,
      open
    },
    'post'
  )

const getStationByNameInCertainCity = (operationCityId, name, open = true) =>
  fetch(
    api.ALLWEBSITE,
    {
      operationCityId,
      name,
      open
    },
    'post'
  )

const getStationByNameInCertainCityType = (
  name,
  operationCityId,
  rentType,
  open = true,
  showUserVisibleStationOnly = true
) => {
  let params = {
    name,
    open
  }
  if (operationCityId) {
    params.operationCityId = operationCityId
  }
  if (rentType) {
    params.rentType = rentType
  }
  if (showUserVisibleStationOnly) {
    params.visible = showUserVisibleStationOnly
  }
  return fetch(api.ALLWEBSITE, params, 'post')
}

// 获取运维用户数据
const getOpUser = (page = 1, params) =>
  fetch(
    api.GET_OPUSER,
    {
      page,
      pageSize,
      ...params
    },
    'get',
    {},
    {
      defaultCity: {
        name: 'areaId'
      }
    }
  )

// 根据城市查询片区
const getDistrictByCity = (cityId = '', suburban) =>
  fetch(
    api.GET_DISTRICT_BY_CITY,
    {
      cityId,
      suburban
    },
    'get',
    {},
    {
      defaultCity: {
        name: 'areaId'
      }
    }
  )

const addOpUser = params => fetch(api.ADD_OPUSER, params, 'post')

const getOpUserDetail = sn =>
  fetch(
    api.GET_OPUSER_DETAIL,
    {
      sn
    },
    'get',
    {}
  )

const switchOpUserStatus = (sn, enabled) =>
  fetch(
    api.SWITCH_OPUSER_STATUS,
    {
      sn,
      enabled
    },
    'post',
    {}
  )

const resetOpUserPassword = sn =>
  fetch(
    api.RESET_OPUSER_PASSWORD,
    {
      sn
    },
    'post',
    {}
  )

const updateOpUser = params => fetch(api.UPDATE_OPUSER, params, 'post', {})

export default {
  getStationByName,
  getStationByCityId,
  getStationByNameInCertainCity,
  getStationByNameInCertainCityType,
  getOpUser,
  getDistrictByCity,
  addOpUser,
  getOpUserDetail,
  switchOpUserStatus,
  resetOpUserPassword,
  updateOpUser
}
