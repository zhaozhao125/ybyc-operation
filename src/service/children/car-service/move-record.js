import { fetch } from '@/utils/fetch'
import api from '@/service/api/'
import { pageSize } from '@/config/page-config.js'

let get_carMove = obj => {
  return fetch(api.GET_CARMOVE, obj, 'get', {})
}
let post_moveComplete = obj => {
  return fetch(api.POST_MOVECOMPLETE, obj, 'post')
}
let post_moveCompleteForce = obj => {
  return fetch(api.POST_MOVECOMPLETEFORCE, obj, 'post')
}

export default {
  get_carMove,
  post_moveComplete,
  post_moveCompleteForce
}
