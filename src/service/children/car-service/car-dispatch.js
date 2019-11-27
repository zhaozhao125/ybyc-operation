import { fetch } from '@/utils/fetch'
import api from '@/service/api/'

let getDispatchList = (obj, isLoading, isFullScreen) => {
  return fetch(api.GET_DISPATCHLIST, obj, 'get', null)
}
let getPersonList = cityId => {
  return fetch(api.GET_PERSONLIST, { cityId: cityId }, 'get', null)
}
let getDispatchDetail = id => {
  return fetch(`${api.GET_DISPATCHDETAIL}/${id}`, null, 'get')
}
let getRatchetUsers = obj => {
  return fetch(
    api.GET_RATCHETUSERS,
    {
      page: 1,
      pageSize: 1000,
      name: obj.name,
      areaId: obj.areaId
    },
    'get',
    null
  )
}
export default {
  getDispatchList,
  getDispatchDetail,
  getRatchetUsers,
  getPersonList
}
