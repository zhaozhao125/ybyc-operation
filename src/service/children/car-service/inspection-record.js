import { fetch } from '@/utils/fetch'
import api from '@/service/api/'
import { pageSize } from '@/config/page-config.js'

const getInspectionList = (page = 1, params, needLoading) =>
  fetch(
    api.GET_INSPECTION_LIST,
    {
      page,
      pageSize,
      ...params
    },
    'post',
    {},
    {
      defaultCity: {
        name: 'cityId'
      }
    }
  )
export default {
  getInspectionList
}
