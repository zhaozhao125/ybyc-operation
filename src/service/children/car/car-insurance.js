import { fetch } from '@/utils/fetch'
import api from '@/service/api/'
import fillParams from '@/utils/fill-params.js'
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
const addInsurance = (params = {}) => {
  return fetch(api.ADD_INSURANCE, params, 'post', {})
}

const editInsurance = (params = {}) => {
  return fetch(api.EDIT_INSURANCE, params, 'post', {})
}

const insuranceListSerch = (params = {}, page = 1, pageSize = 20) => {
  params.page = page
  params.pageSize = pageSize
  return fetch(
    api.INSURANCE_LIST,
    params,
    'post',
    {},
    {
      defaultCity: {
        name: 'carCityId'
      }
    }
  )
}

const noInsurance = (params = {}) => {
  return fetch(api.NO_INSURANCE, params, 'post', {})
}

const deleteInsurance = function (id) {
  return fetch(`${api.DELETE_INSURANCE}/${id}`, {}, 'delete')
}

const getInsuranceInfor = function (id) {
  return fetch(`${api.GET_INSURANCE_INFOR}/${id}`, {}, 'get', {})
}

const exportInsurance = (params, accessToken, fileName, dis) => {
  postAjax(params, accessToken, fileName, dis)
}

function postAjax (params, accessToken, fileName, dis) {
  let loading = Loading.service({ ...loadingStyle })
  axios({
    baseURL: baseUrl || '/',
    method: 'post',
    url: dis,
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
export default {
  addInsurance,
  insuranceListSerch,
  deleteInsurance,
  noInsurance,
  getInsuranceInfor,
  editInsurance,
  exportInsurance
}
