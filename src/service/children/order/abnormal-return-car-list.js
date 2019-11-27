import { fetch } from '@/utils/fetch'
import api from '@/service/api/'
const abnormalReturnCarOrderList = params => {
  return fetch(api.ABNORMAL_RETURN_CAR_ORDER_LIST, params, 'post', {})
}
const abnormalReturnCarOrderDetail = params => {
  return fetch(
    api.ABNORMAL_RETURN_CAR_ORDER_DETAIL,
    params,
    'post',
    {},
    {
      requestBodyType: 'formData'
    }
  )
}
// /timeshareOrder/backend/order/exception/detail
export default {
  abnormalReturnCarOrderList,
  abnormalReturnCarOrderDetail
}
