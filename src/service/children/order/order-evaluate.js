import { fetch } from '@/utils/fetch'
import api from '@/service/api/'

const getOrderEvaluateList = params => {
  return fetch(
    api.GET_ORDER_EVALUATE_LIST,
    params,
    'post',
    {},
    {
      defaultCity: {
        name: 'cityId'
      }
    }
  )
}

export default {
  getOrderEvaluateList
}
