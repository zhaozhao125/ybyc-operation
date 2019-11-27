import {
  fetch
} from '@/utils/fetch'
import api from '@/service/api/'

const fundFlowList = (params) => {
  return fetch(api.FUND_FLOW_LIST, params, 'post', {})
}

const fundFlowSubjects = (params) => {
  return fetch(api.FUND_FLOW_SUBJECTS, params, 'post', {})
}

export default {
  fundFlowList,
  fundFlowSubjects
}
