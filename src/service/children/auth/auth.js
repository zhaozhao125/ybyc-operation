import { fetch } from '@/utils/fetch'
import api from '@/service/api/'
import { pageSize } from '@/config/page-config.js'
import fillParams from '@/utils/fill-params.js'

const getAdminList = (page = 1, params) => {
  return fetch(
    api.GET_ADMIN_LIST,
    {
      pageInfo: {
        page,
        size: pageSize
      },
      ...params
    },
    'post',
    {
      text: '正在读取用户数据...'
    }
  )
}

const addAdmin = params => {
  return fetch(api.ADD_ADMIN, params, 'post', {})
}

const getAllRoles = () => {
  return fetch(api.GET_ALL_ROLES, null, 'get')
}

const updateAdmin = (userId, data) => {
  return fetch(
    api.UPDATE_ADMIN,
    {
      userId,
      newRoleId: data.newRoleId,
      status: data.status,
      cnName: data.cnName,
      mobilePhone: data.mobilePhone,
      email: data.emailm,
      cities: data.cities
    },
    'post'
  )
}

const resetAdminPassword = (userId, newPassword) => {
  return fetch(
    api.RESET_ADMIN_PASSWORD,
    {
      userId,
      newPassword
    },
    'post',
    {}
  )
}

const getAdminRoleList = () => {
  return fetch(api.GET_ROLE_LIST, null, 'get', {})
}

const getAuthByRole = roleId => {
  return fetch(
    fillParams(api.GET_AUTH_BY_ROLE, {
      roleId
    }),
    null,
    'get',
    {}
  )
}

const addAdminRole = params => {
  return fetch(api.ADD_ROLE, params, 'post')
}

const updateRoleAuth = (roleId, urls, operates) => {
  return fetch(
    api.UPDATE_ROLE,
    {
      roleId,
      urls,
      operates
    },
    'post',
    {}
  )
}

const updateRoleInfo = (roleId, roleName, summary) => {
  return fetch(
    api.UPDATE_ROLE,
    {
      roleId,
      roleName,
      summary
    },
    'post'
  )
}

const getAllAuth = () => {
  return fetch(api.GET_ALL_AUTH, null, 'get', {})
}

const getRoleDetail = urlId => {
  return fetch(
    fillParams(api.GET_ROLE_DETAIL, {
      urlId
    }),
    null,
    'get',
    {}
  )
}

const addAuth = params => {
  return fetch(api.ADD_AUTH, params, 'post')
}

const updateAuth = params => {
  return fetch(api.UPDATE_AUTH, params, 'post', {})
}

const deleteAuth = id => {
  return fetch(
    fillParams(api.DELETE_AUTH, {
      id
    }),
    null,
    'post',
    {}
  )
}

const createButtonAuth = (authUrlId, content, marker) => {
  return fetch(
    api.CREATE_BUTTON_AUTH,
    {
      authUrlId,
      content,
      marker
    },
    'post',
    {}
  )
}

const updateButtonAuth = params => {
  return fetch(api.UPDATE_BUTTON_AUTH, params, 'post')
}

const deleteButtonAuth = id => {
  return fetch(
    api.DELETE_BUTTON_AUTH,
    {
      id
    },
    'post',
    {}
  )
}

const getAllCities = () => {
  return fetch(api.GET_ALL_CITIES, {}, 'get', {})
}

export default {
  getAdminList,
  getAllRoles,
  addAdmin,
  updateAdmin,
  resetAdminPassword,
  getAdminRoleList,
  getAuthByRole,
  addAdminRole,
  updateRoleAuth,
  updateRoleInfo,
  getAllAuth,
  getRoleDetail,
  addAuth,
  updateAuth,
  deleteAuth,
  createButtonAuth,
  updateButtonAuth,
  deleteButtonAuth,
  getAllCities
}
