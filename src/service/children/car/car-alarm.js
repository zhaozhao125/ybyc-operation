import { fetch } from '@/utils/fetch'
import api from '@/service/api/'
let get_alarmSearchOrPage = obj => {
  return fetch(
    api.CAR_ALARM,
    obj,
    'get',
    {},
    {
      defaultCity: {
        name: 'cityId'
      }
    }
  )
}
export default {
  get_alarmSearchOrPage
}
