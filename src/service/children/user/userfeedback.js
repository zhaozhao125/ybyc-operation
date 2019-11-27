import { fetch } from '@/utils/fetch'
import api from '@/service/api/'
import { pageSize } from '@/config/page-config.js'
import fillParams from '@/utils/fill-params.js'

/**
 * 用户反馈列表
 * @param page
 * @param params
 * @returns {*}
 */
const getFeedbackList = (page, params = {}) => {
  params.page = page;
  return fetch(api.Get_Feedback_List, params, 'post', {})
}

const saveUerFeedbackRemark = (params) => {
  return fetch(api.SaveUerFeedbackRemark, params, 'post', {})
}

export default {
  getFeedbackList,
  saveUerFeedbackRemark
}
