import { fetch } from '@/utils/fetch'
import api from '@/service/api/'

const getCityPartnerList = (page, params = {}) => {
  return fetch(api.CITY_PARTNER, {
    page,
    ...params
  }, 'get', {})
}

export default {
  getCityPartnerList
}
