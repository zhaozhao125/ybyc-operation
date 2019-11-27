import { fetch } from '@/utils/fetch'
import api from '@/service/api/'
import { pageSize } from '@/config/page-config.js'
import { download } from '@/utils/common'

const getChargePileGenreList = (params) => {
  return fetch(api.GETCHARGINGPILEGENRELIST, params, 'get', {})
}

const ChargePileGenreAdd = (params) => {
  return fetch(api.CHARGINGPILEGENREADD, params, 'post', {})
}

const ChargePileGenreEdit = (params) => {
  return fetch(api.CHARGINGPILEGENREEDIT, params, 'post', {})
}

const ChargePileGenreInfo = (params) => {
  return fetch(api.CHARGINGPILEGENREINFO, params, 'get', {})
}

const ChargePileGenreDel = (params) => {
  return fetch(api.CHARGINGPILEGENREDEL+'/'+params,{}, 'post', {})
}

export default {
  getChargePileGenreList,
  ChargePileGenreAdd,
  ChargePileGenreEdit,
  ChargePileGenreInfo,
  ChargePileGenreDel
}
