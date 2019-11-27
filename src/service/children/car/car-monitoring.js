import { fetch } from '@/utils/fetch'
import api from '@/service/api/'
import fillParams from '@/utils/fill-params.js'

const getCarPosition = (id, loading) => {
  return fetch(
    fillParams(api.GET_CAR_POSITION, {
      id
    }),
    null,
    'get',
    loading ? {} : null
  )
}

const getCarByNumber = (carNumberOrVin, loading) => {
  return fetch(
    api.GET_CAR_BY_NUMBER,
    {
      carNumberOrVin
    },
    'get',
    loading
  )
}

const getCarTrack = (id, startDate, endDate) => {
  return fetch(
    fillParams(api.GET_CAR_TRACK, {
      id
    }),
    {
      startDate,
      endDate
    },
    'get',
    {}
  )
}

const getCarTrackByOrder = orderId => {
  return fetch(
    fillParams(api.GET_CAR_TRACK_BY_ORDER, {
      orderId: orderId
    }),
    null,
    'get',
    {}
  )
}

export default {
  getCarPosition,
  getCarByNumber,
  getCarTrack,
  getCarTrackByOrder
}
