import { fetch } from '@/utils/fetch'
import api from '@/service/api/'
import { pageSize } from '@/config/page-config.js'
import { download } from '@/utils/common'

const getDriverLicenseReviewList = (params) => {
  return fetch(api.DRIVER_LICENSE_REVIEW_LIST, params, 'post', {})
}

const getDriverLicenseDetail = (params) => {
  return fetch(api.DRIVER_LICENSE_DETAIL, params, 'post', {})
}

const driverLicenseReview = (params) => {
  return fetch(api.DRIVER_LICENSE_REVIEW, params, 'post', {})
}

export default {
  getDriverLicenseReviewList,
  getDriverLicenseDetail,
  driverLicenseReview,//驾照审核
}
