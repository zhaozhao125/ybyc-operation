import {
  fetch
} from '@/utils/fetch'
import api from '@/service/api/'

const getUpToken = ()=>{
  return fetch(api.GET_UP_TOKEN, null, 'get')
}

export default {
  getUpToken
}