import { fetch } from '@/utils/fetch'
import api from '@/service/api/'
const abnormalReturnCarList = params => {
  return fetch(
    api.ABNORMAL_RETURN_CAR_LIST,
    params,
    'post',
    {},
    {
      requestBodyType: 'formData'
    }
  )
}

export default {
  abnormalReturnCarList
}
