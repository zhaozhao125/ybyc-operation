import { fetch } from '@/utils/fetch'
import api from '@/service/api/'
import { pageSize } from '@/config/page-config.js'

const getSigninList = (page = 1, params) =>
  fetch(
    api.GET_SIGNIN_LIST,
    {
      page,
      pageSize,
      ...params
    },
    'post',
    {},
    {
      defaultCity: {
        name: 'areaId'
      }
    }
  )

const getSigninDetail = (userSn, signDate) =>
  fetch(
    api.GET_SIGNIN_DETAIL,
    {
      userSn,
      signDate
    },
    'post',
    {}
  )

const getSigninStation = params =>
  fetch(
    api.GET_SIGNIN_STATION,
    params,
    'post',
    {},
    {
      defaultCity: {
        name: 'operationCityId'
      }
    }
  )

export default {
  getSigninList,
  getSigninDetail,
  getSigninStation
}
