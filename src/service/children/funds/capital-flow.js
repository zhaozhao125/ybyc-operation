import { fetch } from '@/utils/fetch'
import api from '@/service/api/'
import { download } from '@/utils/common'
import axios from 'axios'
import baseUrl from '@/config/base-url'
import { Message, Loading } from 'element-ui'
import { downloadAjax } from '@/utils/common.js'

let loadingStyle = {
  text: '加载中...',
  spinner: 'el-icon-loading',
  background: 'rgba(255,255,255,0.7)',
  target: '.tabs>.el-tabs__content .el-tab-pane:not([aria-hidden])'
}

/**
 * 资金流水：1. 账户余额
 */
const getCapitalFlowBalance = (params = {}) => {
  return fetch(api.getCapitalFlowBalance, params, 'post', {})
}
/**
 * 资金流水：1. 账户科目
 */
const getCapitalFlowSubjects = (params = {}) => {
  return fetch(api.getCapitalFlowSubjects, params, 'post', {})
}
/**
 * 资金流水：1. 资金变更
 */
const getFundsChange = (params = {}) => {
  return fetch(api.getFundsChange, params, 'post', {})
}
/**
 * 资金流水：1. 导出
 */
const downloadCapitalFlowBalance = (params, accessToken, fileName, dis) => {
  postAjax(params, accessToken, fileName, dis)
}
/**
 * 资金变更
 */
const handleFundschange = (params = {}) => {
  return fetch(
    params.url,
    params.data,
    'post',
    {},
    {
      requestBodyType: 'formData'
    }
  )
}

function postAjax (params, accessToken, fileName) {
  let loading = Loading.service({ ...loadingStyle })

  axios({
    baseURL: baseUrl || '/',
    method: 'post',
    url: api.downloadCapitalFlowFile,
    data: params,
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      accessToken: accessToken
    }
  })
    .then(res => {
      Message.success('导出数据成功')
      download(fileName, res.data)
      loading.close()
    })
    .catch(error => {
      Message.warning(error.msg ? error.msg : '导出失败')
      loading.close()
    })
}

/**
 * 资金统计接口
 */
const fundsSum = (params = {}) => {
  return fetch(api.fundsSum, params, 'post', false)
}

/**
 * 红包资金流水接口
 */
const redPacketList = (params = {}) => {
  return fetch(api.RED_PACKET_LIST, params, 'post', {})
}

// 分时出行卡列表

const timeShareCard = (params = {}) => {
  return fetch(api.TIME_SHARE_CARD, params, 'post', {})
}

// 分时出行卡科目

const timeShareCardSubjects = (params = {}) => {
  return fetch(api.TIME_SHARE_CARD_SUBJECTS, params, 'post', {})
}
/**
 * 获取红包科目
 */
const getRedPacketSubjects = () => {
  return fetch(api.GET_RED_PACKET_SUBJECTS, {}, 'post', {})
}

const getRedPacketCount = params => {
  return fetch(api.GET_RED_PACKET_COUNT, params, 'post', {})
}

const exportRedPacketData = params => {
  return downloadAjax(api.EXPORT_RED_PACKET_DATA, 'post', params, '红包.xlsx')
}

export default {
  getCapitalFlowBalance,
  getCapitalFlowSubjects,
  downloadCapitalFlowBalance,
  getFundsChange,
  handleFundschange,
  fundsSum,
  redPacketList,
  getRedPacketSubjects,
  getRedPacketCount,
  exportRedPacketData,
  timeShareCard,
  timeShareCardSubjects
}
