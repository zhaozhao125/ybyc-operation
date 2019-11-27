import { fetch } from '@/utils/fetch'
import api from '@/service/api/'
import { pageSize } from '@/config/page-config.js'
import fillParams from '@/utils/fill-params.js'
import capitalFlow from './capital-flow.js'
import { download } from '@/utils/common'
import axios from 'axios'
import baseUrl from '@/config/base-url'
import { Message, Loading } from 'element-ui'

let loadingStyle = {
  text: '加载中...',
  spinner: 'el-icon-loading',
  background: 'rgba(255,255,255,0.7)',
  target: '.tabs>.el-tabs__content .el-tab-pane:not([aria-hidden])'
}


const getPayList = (page, params = {}) => {
  params.page = page;
  params.pageSize = pageSize;

  return fetch(api.GetPayList, params, 'post', {})
}
const getRefundList = (page, params = {}) => {
  params.page = page;
  params.pageSize = pageSize;

  return fetch(api.getRefundList, params, 'post', {})
}
/**
 * 资金流水：1. 导出
 */
const downloadPaylist = (params, accessToken, fileName, dis) => {
  params.url = api.downloadPaylist;
  postAjax(params, accessToken, fileName, dis)
}
/**
 * 资金流水：1. 导出
 */
const downloadRefundbilllist = (params, accessToken, fileName, dis) => {
  params.url = api.downloadRefundbilllist;
  postAjax(params, accessToken, fileName, dis)
}

function postAjax (params, accessToken, fileName) {
  let loading = Loading.service({ ...loadingStyle })

  axios({
    baseURL: baseUrl || '/',
    method: 'post',
    url: params.url,
    data: params,
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      accessToken: accessToken
    }
  }).then(res => {
    Message.success('导出数据成功')
    download(fileName, res.data)
    loading.close()
  }).catch(error => {
    Message.warning(error.msg ? error.msg : '导出失败')
    loading.close()
  })
}

export default {
  getPayList,
  getRefundList,
  downloadPaylist,
  downloadRefundbilllist
}
