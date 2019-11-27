import { fetch } from '@/utils/fetch'
import api from '@/service/api/'
import { pageSize } from '@/config/page-config.js'
import { download } from '@/utils/common'
import { downloadAjax } from '@/utils/common'

const getChargingPileList = (params) => {
  return fetch(api.GETCHARGINGPILELIST, params, 'post', {},{
    defaultCity:{
      name: 'cityId'
    }
  })
}

const getChargingPileInfo = (params) => {
  return fetch(api.GETCHARGINGPILEINFO, params, 'get', {})
}

const chargingPileEdit = (params) => {
  return fetch(api.CHARGINGPILEEDIT, params, 'post', {})
}

const chargingPileAdd = (params) => {
  return fetch(api.CHARGINGPILEADD, params, 'post', {})
}

const chargingPileUpgrade = (params) => {
  return fetch(api.CHARGINGUPGRADE, params, 'post', {})
}

const chargingPileStatus = (params) => {
  return fetch(api.CHARGINGPILESTATUS, params, 'post', {})
}

const getChargingPileGenre = (params) => {
  return fetch(api.GETCHARGINGPILEGENRE, params, 'get', {})
}

const get_chargingPileInfoSticker = (params) => {
  return fetch(api.CHARGINGSTATIONSTICKER, params, 'get', {})
}

let post_allChargingStation = (idOrName, showLoading) => {
  let obj = {}
  obj.stationName = idOrName
  obj.page = 1
  obj.pageSize = 200
  return fetch(api.ALLCHARGINGSTATION, obj, 'post', showLoading)
}

let get_downloadChargingInfo = (params, fileName) => {
  // getAjax(params, accessToken, fileName, dis)
  return downloadAjax(api.DOWNCHARGINGINFO, 'post', params, fileName, {
    defaultCity:{
      name: 'cityId'
    }
  })
}
const formateStatusText = (status) => {
  if (status === '已插枪') {
    status = '占用未充电'
  }
  return status
}

export default {
  getChargingPileList,
  getChargingPileInfo,
  get_downloadChargingInfo,
  chargingPileEdit,
  chargingPileAdd,
  chargingPileStatus,
  getChargingPileGenre,
  post_allChargingStation, // 获取所有下拉列表的充电站,
  get_chargingPileInfoSticker,
  chargingPileUpgrade,
  formateStatusText
}
