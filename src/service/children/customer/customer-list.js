import {
  fetch
} from '@/utils/fetch'
import api from '@/service/api/'
import {
  pageSize
} from '@/config/page-config.js'
import {
  download
} from '@/utils/common'
// 用户列表
const getCustomerList = (params) => {
  params.admin = true
  return fetch(api.CUSTOMER_LIST, params, 'post', {}, {
    // defaultCity: {
    //   name: 'cityId'
    // }
  })
}
// 用户状态停用启用
const switchCustomerStatus = (userId, statusCode) =>
  fetch(
    api.SWITCH_CUSTOMER_STATUS, {
      userId,
      statusCode
    }, 'post', {}
  )
// 用户角色列表
let getRoleList = (params) => {
  return fetch(api.ALL_CUSTOMER_ROLE_LIST, params, 'post', {
    requestBodyType: 'formData'
  })
}
// 用户详情
const getCustomerDetail = (params) => {
  return fetch(api.USER_DETAIL, params, 'post', {})
}
// 用户详情
const getAuditDetail = (params) => {
  return fetch(api.AUDIT_DETAIL, params, 'post', {})
}
// 编辑用户
const updateCustomer = (params) => {
  return fetch(api.CUSTOMER_UPDATE, params, 'post', {})
}
// 用户信息审核
const checkAudit = (params) => {
  return fetch(api.CHECK_AUDIT, params, 'post', {})
}
// 重置预约次数
const resetReserveCount = (params) => {
  return fetch(api.RESET_RESERVE_COUNT, params, 'post', {})
}
// 发送消息
const sendMsg = (params) => {
  return fetch(api.SEND_SMS, params, 'post', {})
}
// 获取用户所有优惠券
const getUserCouponsList = (params) => {
  return fetch(api.USER_COUPONS_LIST, params, 'post', {}, {
    requestBodyType: 'formData'
  })
}
// 删除优惠券
const deleteCoupons = (params) => {
  return fetch(api.DELETE_USER_COUPONS, params, 'post', {}, {
    requestBodyType: 'formData'
  })
}
// 查看用户可以分配优惠券
const isAssignedCoupons = (params) => {
  return fetch(api.IS_ASSIGNED_COUPONS, params, 'post', {}, {
    requestBodyType: 'formData'
  })
}
// 给用户分配优惠券
const assigneCoupons = (params) => {
  return fetch(api.ASSIGNE_COUPONS, params, 'post', {}, {
    requestBodyType: 'formData'
  })
}

export default {
  getCustomerList,
  switchCustomerStatus,
  getRoleList,
  getCustomerDetail,
  getAuditDetail,
  updateCustomer,
  checkAudit,
  resetReserveCount,
  sendMsg,
  getUserCouponsList,
  deleteCoupons,
  isAssignedCoupons,
  assigneCoupons
}
