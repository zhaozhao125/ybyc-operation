import { fetch } from '@/utils/fetch'
import api from '@/service/api/'
// import { STATION_BASE_URL } from '@/config/base-url'
// export const STATION_BASE_URL = 'http://47.100.76.78:8510/service-car-station/'
let post_areaList = obj => {
  return fetch(
    api.STATION_DISTRICT_PAGE,
    obj,
    'post',
    {},
    {
      defaultCity: {
        name: 'cityId'
      }
    }
  )
}
let post_stationDistrictDelete = id => {
  return fetch(`${api.STATION_DISTRICT_DELETE}?id=${id}`, null, 'post')
}
// 添加片区
let post_stationDistrictAdd = addObj => {
  return fetch(api.STATION_DISTRICT_ADD, addObj, 'post')
}
// 修改片区
let post_stationDistrictUpdate = updateObj => {
  return fetch(api.STATION_DISTRICT_UPDATE, updateObj, 'post')
}
export default {
  post_areaList,
  post_stationDistrictDelete,
  post_stationDistrictAdd,
  post_stationDistrictUpdate
}
