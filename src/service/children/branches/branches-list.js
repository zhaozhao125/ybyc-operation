import { fetch } from '@/utils/fetch'
import api from '@/service/api/'
// import { STATION_BASE_URL } from '@/config/base-url'

let post_stationPage = obj => {
  return fetch(
    api.BRANCHLIST_PAGE,
    obj,
    'post',
    {},
    {
      defaultCity: {
        name: 'operationCityId'
      }
    }
  )
}
let post_stationDelete = id => {
  return fetch(`${api.BRANCHLIST_DELETE}?id=${id}`, null, 'post')
}
// form-data的提交方式需要把字符串拼接上去 即使是post方式
let post_stationUpdateStatus = (id, isOpen) => {
  return fetch(
    `${api.BRANCHLIST_UPDATESTATUS}?id=${id}&isOpen=${isOpen}`,
    null,
    'post'
  )
}
let get_operationCityList = () => {
  return fetch(api.BRANCHLIST_OPERATIONCITYLIST, null, 'get')
}

let get_districtList = cityId => {
  return fetch(api.BRANCHLIST_DISTRICTLIST, { cityId }, 'get')
}
let get_websiteDetail = id => {
  return fetch(api.BRANCHLIST_WEBSITEDETAIL, { id }, 'get', {})
}
let post_stationAdd = obj => {
  return fetch(api.BRANCHLIST_STATIONADD, obj, 'post')
}
let post_stationUpdate = obj => {
  return fetch(api.BRANCHLIST_STATIONUPDATE, obj, 'post')
}
let get_chargingStationList = (stationName = '') => {
  return fetch(
    `${api.CHARGING_STATIONLIST}?stationName=${stationName}`,
    null,
    'get'
  )
}
// /service-charging/charging / stations / all
export default {
  post_stationPage,
  post_stationDelete,
  post_stationUpdateStatus,
  get_operationCityList, // 下拉城市列表
  get_districtList, // 选择片区
  get_websiteDetail, // 网点详情
  post_stationAdd, // 添加网点
  post_stationUpdate, // 编辑网点
  get_chargingStationList // 获取到所有充电桩数据
}
