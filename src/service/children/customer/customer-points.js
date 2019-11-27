import {
  fetch
} from '@/utils/fetch'
import store from '@/store/'

/**
 * 获取用户积分记录列表
 * @param {Object} params
 */
function getCustomerPointsList(params) {
  return fetch('/service-user/promotion/score/userScoreIntegral/record/page', params, {
    loading: true
  })
}

/**
 * 获取用户积分科目
 */
function getCustomerPointsSubject() {
  return fetch('/service-user/promotion/score/userScoreIntegral/getActionCodeList', {
    type: 'INTEGRAL'
  }, {
    loading: true
  })
}

/**
 * 获取用户积分统计
 * @param {Object} params
 */
function getPointStatistics(params) {
  return fetch('/service-user/promotion/score/userScoreIntegral/record/finance', params, {
    loading: false
  })
}

/**
 * 获取指定用户积分信息
 * @param {String/Number} userId
 */
function getCustomerPoints(userId) {
  return fetch('/service-user/promotion/score/userScoreIntegral/info', {
    userId
  }, {
    loading: false
  })
}

/**
 * 管理员修改用户积分
 * 增加：INC  减少：DEC
 * @param {Object} params
 */
function editCustomerPoints(params) {
  let actionCode
  if (params.type == 'INC') {
    actionCode = 'adminManualRecharge'
  } else if (params.type == 'DEC') {
    actionCode = 'adminManualDeduct'
  } else {
    return Promise.reject(new Error('增减类型无效：只能是INC或DEC'))
  }
  let admin = store.getters.user
  console.log('====admin====', admin)
  return fetch('/service-user/promotion/score/userScoreIntegral/handle', {
    userId: params.userId,
    actionCode,
    floatAmount: params.amount,
    adminNote: params.adminNote,
    adminUser: admin.username,
    adminUsername: admin.cnName
  }, {
    type: 'formData',
    loading: true
  })
}

export default {
  getCustomerPointsList,
  getCustomerPointsSubject,
  getPointStatistics,
  getCustomerPoints,
  editCustomerPoints
}
