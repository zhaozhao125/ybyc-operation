import { fetch } from '@/utils/fetch'
import api from '@/service/api/'
import { STATION_BASE_URL } from '@/config/base-url'

let get_searchCarsByStation = obj => {
  return fetch(api.BRANCHESVEHICLE_SEARCHCARSBYSTATION, obj, 'get', {})
}
let post_changeStation = obj => {
  return fetch(
    `${api.BRANCHESVEHICLE_CHANGESTATION}?carId=${obj.carId}&newStationId=${
      obj.newStationId
    }&oldStationId=${obj.oldStationId}`,
    {},
    'post'
  )
}
let post_allWebSite = (idOrName, showLoading, isRemote = false, open) => {
  let obj = {}
  if (idOrName && !isRemote) {
    obj.operationCityId = idOrName
  } else {
    obj.name = idOrName
  }
  if (open) {
    obj.open = open
  }
  return fetch(api.ALLWEBSITE, obj, 'post', showLoading,{
    defaultCity: {
      name: 'operationCityId'
    }
  })
}
// 只请求开启的网点
let post_openWebSite = () => {
  return fetch(api.ALLWEBSITE, { open: true }, 'post')
}

let post_shareWebSite = (id, type, name) => {
  let obj = {}
  obj.open = true
  if (id) {
    obj.operationCityId = id
  }
  if (type) {
    obj.rentType = type
  }
  if (name) {
    obj.name = name
  }
  console.log(obj)
  return fetch(api.ALLWEBSITE, obj, 'post')
}

export default {
  get_searchCarsByStation,
  post_changeStation, // // 更换车辆与网点的关系
  post_allWebSite, // 获取所有下拉列表的网点
  post_shareWebSite, // 获取分时网点下拉列表的网点
  post_openWebSite
}
