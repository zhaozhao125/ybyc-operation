import { fetch } from '@/utils/fetch'
import api from '@/service/api/'

// const timeSharePlanList = params => {
//   return fetch(api.TIME_SAHRE_PLAN_LIST, params, 'post', {})
// }
const timeSharePlanList = (params = {}, page = 1, pageSize = 20) => {
  params.page = page
  params.pageSize = pageSize
  return fetch(api.TIME_SAHRE_PLAN_LIST, params, 'post', {}, {
    defaultCity: {
      name: 'cityId'
    }
  })
}

const addTimeShare = params => {
  return fetch(api.ADD_TIME_SHARE, params, 'post', {})
}

const editTimeShare = params => {
  return fetch(api.EDIT_TIME_SHARE, params, 'post', {})
}

const planNameCheck = params => {
  return fetch(api.PLAN_NAME_CHECK, params, 'post', {})
}

const planNameCheckeEdit = params => {
  return fetch(api.PLAN_NAME_CHECK_EDIT, params, 'post', {})
}

const planStartEnd = params => {
  return fetch(api.PLAN_START_END, params, 'post', {})
}
export default {
  timeSharePlanList,
  addTimeShare,
  editTimeShare,
  planNameCheck,
  planNameCheckeEdit,
  planStartEnd
}
