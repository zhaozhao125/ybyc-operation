import { fetch } from '@/utils/fetch'
import api from '@/service/api/'
import capitalFlow from './capital-flow.js'
import fundsBill from './funds-bill.js'
import invoice from './invoice.js'
import { Message, Loading } from 'element-ui'
import { download } from '@/utils/common'
import axios from 'axios'
import baseUrl from '@/config/base-url'

let loadingStyle = {
  text: '加载中...',
  spinner: 'el-icon-loading',
  background: 'rgba(255,255,255,0.7)',
  target: '.tabs>.el-tabs__content .el-tab-pane:not([aria-hidden])'
}
// 财务处理/运营审核列表
const getOptimusCheckList = (page, pageSize, params = {}) => {
  params.page = page
  params.pageSize = pageSize
  return fetch(api.getOptimusCheckList, params, 'post', {}, {
    defaultCity: {
      name: 'cityIds',
      type: Array
    }
  })
}
// 运营审核
const optimusCheckHandel = (params = {}) => {
  return fetch(api.optimusCheckHandel, params, 'post', {})
}
// 财务取消
const financeCancel = (params = {}) => {
  return fetch(api.financeCancel, params, 'post', {})
}

// 流水列表
const accountCapitalList = (params = {}) => {
  return fetch(api.accountCapitalList, params, 'post', {})
}
// 银行卡退款
// const bankCardRefund = (params = {}) => {
//   return fetch(api.bankCardRefund, params, 'post', {})
// }
// 支付宝、微信退款、银行卡
const confirmRefund = (params = {}) => {
  return fetch(api.confirmRefund, params, 'post', {})
}
// 银行卡取消退款
const cancelRefund = (params = {}) => {
  return fetch(api.cancelRefund, params, 'post', {})
}

// 财务处理查看详情
const refundHandelInfor = (params = {}) => {
  return fetch(api.refundHandelInfor, params, 'post', {})
}
// 运营导出
let exportOptimusList = (params, accessToken, fileName, dis) => {
  postAjax(params, accessToken, fileName, dis)
}
// 财务导出
let exportRefund = (params, accessToken, fileName, dis) => {
  postAjax(params, accessToken, fileName, dis)
}

function postAjax (params, accessToken, fileName, dis) {
  let loading = Loading.service({ ...loadingStyle })
  axios({
    baseURL: baseUrl || '/',
    method: 'post',
    url: disType(dis),
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

function disType (dis) {
  switch (dis) {
    case 'optimus':
      return api.exportOptimusList
    case 'refund':
      return api.exportRefund
  }
}

export default {
  getOptimusCheckList,
  ...fundsBill,
  ...capitalFlow,
  ...invoice,
  optimusCheckHandel,
  accountCapitalList,
  // bankCardRefund,
  confirmRefund,
  cancelRefund,
  refundHandelInfor,
  exportOptimusList,
  exportRefund,
  financeCancel
}
