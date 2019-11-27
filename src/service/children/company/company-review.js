import {
  fetch
} from '@/utils/fetch'
import api from '@/service/api/'

const getCompanyReviewList = (params) => {
  return fetch(api.COMPANY_REVIEW_LIST, params, 'post', {})
}

const rejectCompanyApply = (params) => {
  return fetch(api.COMPANY_REVIEW_REFUSE, params, 'post', {})
}

export default {
  getCompanyReviewList,
  rejectCompanyApply
}
