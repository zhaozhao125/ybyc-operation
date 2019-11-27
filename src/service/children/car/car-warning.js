import { fetch } from '@/utils/fetch'
import api from '@/service/api/'

const getCarWarningList = params => {
  return fetch(`${api.CAR_WARNING_LIST}`, params, 'get')
}

const getCarWarningStatue = id => {
  return fetch(`${api.CAR_WARNING_STATUE}/${id}/car/status`, null, 'get', null)
}
const getCarWarningDict = cityId => {
  return fetch(api.CAR_WARNING_DICT, { cityId }, 'get', null)
}
const getCarWarningDictStatistics = (cityId, startDate, endDate) => {
  return fetch(
    api.CAR_WARNING_STATISTICS,
    { cityId, startDate, endDate },
    'get',
    null
  )
}
// 告警记录接口
const getCarWarningAlarm = param => {
  return fetch(
    `${api.CAR_WARNING_ALARM}`,
    param,
    'get',
    {},
    {
      defaultCity: {
        name: 'cityId'
      }
    }
  )
}
// 告警处理
const getCarWarningHandleMark = (carSn, handleStatusCode, handleMsg) => {
  return fetch(
    `${api.CAR_WARNING_HANDLEMARK}/${carSn}/handle-status`,
    {
      handleStatusCode: handleStatusCode,
      handleMsg: handleMsg
    },
    'put',
    null
  )
}
// 批量删除
const putDeleteSelect = (idList, handleStatusCode, handleMsg) => {
  return fetch(
    api.CAR_DELET_LIST,
    {
      idList,
      handleStatusCode,
      handleMsg
    },
    'put',
    null
  )
}
export default {
  getCarWarningList,
  getCarWarningStatue,
  putDeleteSelect,
  getCarWarningDict,
  getCarWarningDictStatistics,
  getCarWarningAlarm,
  getCarWarningHandleMark
}
