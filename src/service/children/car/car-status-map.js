import { fetch } from '@/utils/fetch'
import api from '@/service/api/'
const getStatusMapPagingOrSearch = params => {
  params.needFields = 'car_sn,rent_status_code,lat,lng'
  params.needAssociation = false
  return fetch(`${api.CARSTATUS_MAPLIST}`, params, 'get')
}
const getCarHaiMaList = params => {
  params.carModelCode = 'hm2017'
  params.needFields = 'car_sn,lat,lng'
  params.needAssociation = false
  // console.log(params, 'params')
  return fetch(`${api.CARSTATUS_MAPLIST}`, params, 'get')
}
const getStatusMapRentStatus = (cityId, rentTypeCode) => {
  return fetch(
    `${api.CARSTATUS_RENTSTSTUS}?cityId=${cityId}&rentTypeCode=${rentTypeCode}`,
    null,
    'get',
    null
  )
}
const getStatusMapNow = carSn => {
  return fetch(`${api.CARSTATUS_STATUSNOW}/${carSn}/status/now`, null, 'get')
}
// CARSTATUS_STATUSNOW
export default {
  getStatusMapPagingOrSearch,
  getCarHaiMaList,
  getStatusMapRentStatus,
  getStatusMapNow
}
