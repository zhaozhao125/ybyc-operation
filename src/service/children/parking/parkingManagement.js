import { fetch } from '@/utils/fetch'
import api from '@/service/api/'

const parkingLists = (params = {}, page = 1, pageSize = 20) => {
  params.page = page
  params.pageSize = pageSize
  return fetch(
    api.PARKING_LIST,
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

const parckingEdit = params => {
  return fetch(api.PARKING_EDIT, params, 'post', {})
}

const lockControl = params => {
  return fetch(api.LOCK_CONTROL, params, 'post', {}, {
    requestBodyType: 'formData'
  })
}

const packingAdd = params => {
  return fetch(api.PACKING_ADD, params, 'post', {})
}

const addWake = params => {
  return fetch(api.ADD_WAKE, params, 'post', {})
}

const recordLog = (params = {}, page = 1, pageSize = 20) => {
  params.page = page
  params.pageSize = pageSize
  return fetch(
    api.RECORD_LOG,
    params,
    'post',
    {}
    // {
    //   defaultCity: {
    //     name: 'cityId'
    //   }
    // }
  )
}

const packingInfor = params => {
  return fetch(
    api.PARKING_INFOR,
    params,
    'post',
    {},
    {
      requestBodyType: 'formData'
    }
  )
}
export default {
  parkingLists,
  parckingEdit,
  lockControl,
  packingAdd,
  packingInfor,
  addWake,
  recordLog
}
