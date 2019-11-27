import { fetch } from '@/utils/fetch'
import api from '@/service/api/'
import { pageSize } from '@/config/page-config.js'
import fillParams from '@/utils/fill-params.js'

/**
 * 反馈问题处理
 * @param page
 * @param params
 * @returns {*}
 */
const getFeedbackproblemTypes = (params = {}) => {
  return fetch(api.getFeedbackproblemTypes, params, 'post', {})
}
/**
 * 用户反馈问题接口
 * @param params
 * @returns {*}
 */
const getFeedbackProblemList = (params = {}) => {
  return fetch(api.getFeedbackProblemList, params, 'post', {})
}

/**
 * 结束反馈 php接口
 * @param params
 * @returns {*}
 */
const closeFeedbackpro = (params = {}) => {
  return fetch(api.closeFeedbackpro, params, 'post', {})
}

/**
 * 结束反馈 :改变反馈数据的状态 php接口
 * @param params
 * @returns {*}
 */
const changeFeedbackpro = (params = {}) => {
  return fetch(api.changeFeedbackpro, params, 'post', {})
}

export default {
  getFeedbackproblemTypes,
  getFeedbackProblemList,
  closeFeedbackpro,
  changeFeedbackpro
}
