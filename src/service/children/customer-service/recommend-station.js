import {fetch} from '@/utils/fetch'
import api from '@/service/api/'
import {pageSize} from '@/config/page-config.js'
import {download} from '@/utils/common'
//查询用户新建网点反馈列表
const getUserFeedbackNewStationList = (params) => {
  return fetch(api.GET_USER_FEEDBACK_NEW_STATION_LIST, params, 'get', {})
};

//查询用户新建网点反馈坐标
const getUserFeedbackNewStationLocation = (params) => {
  return fetch(api.GET_USER_FEEDBACK_NEW_STATION_LOCATION, params, 'get', {})
};

export default {
  getUserFeedbackNewStationList,
  getUserFeedbackNewStationLocation,
}
