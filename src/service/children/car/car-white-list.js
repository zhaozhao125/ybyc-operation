import { fetch } from '@/utils/fetch'
import api from '@/service/api/'
import fillParams from '@/utils/fill-params.js'
const addWhiteCar = params => {
  return fetch(api.ADD_WHITE_CAR, params, 'post', {})
}

const whiteCarList = (obj = {}, page = 1, pageSize = 20) => {
  obj.page = page
  obj.pageSize = pageSize
  return fetch(
    api.WHITE_CAR_LIST,
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
const deleteWhiteCar = function (id) {
  return fetch(`${api.DELETE_WHITE_CAR}/${id}`, {}, 'delete')
}
export default {
  addWhiteCar,
  whiteCarList,
  deleteWhiteCar
}
