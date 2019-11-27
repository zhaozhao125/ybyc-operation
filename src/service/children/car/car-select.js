import { fetch } from '@/utils/fetch'
import api from '@/service/api/'
let get_carsSelectModelsAll = obj => {
  return fetch(`${api.CAR_SELECT}/cars/models/all`, obj, 'get', {})
}

export default {
  get_carsSelectModelsAll
}
