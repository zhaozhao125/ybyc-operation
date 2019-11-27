import { fetch } from '@/utils/fetch'
import api from '@/service/api/'
import { pageSize } from '@/config/page-config.js'
import { download } from '@/utils/common'
import { handleDate } from '@/utils/date-filter';

const commonProblemsList = (params) => {
  console.dir('getCommonproblemsList');
  return fetch(api.CommonproblemsList, params, 'post', {})
}
const CommonproblemsDetial = (params) => {
  console.dir('CommonproblemsDetial');
  return fetch(api.CommonproblemsDetial, params, 'post', {})
}
const CommonproblemsChange = (url, params) => {
  console.dir('CommonproblemsChange');
  return fetch(url, params, 'post', {})
}
const CommonproblemsDel = (params) => {
  console.dir('CommonproblemsDel');
  return fetch(api.CommonproblemsDel, params, 'post', {})
}

export default {
  commonProblemsList,
  CommonproblemsDetial,
  CommonproblemsChange,
  CommonproblemsDel
}
