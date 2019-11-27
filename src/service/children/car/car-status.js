import { fetch } from '@/utils/fetch'
import api from '@/service/api/'

let get_carStatusPagingOrSearch = obj => {
  return fetch(
    api.CARSTATUS_PAGINGORSEARCH,
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

let carStatusRent = carSn => {
  return fetch(api.CARSTATUS_RENT, { carSn }, 'post', {})
}
let carStatusPower = carSn => {
  return fetch(api.CARSTATUS_POWER, { carSn }, 'post', {})
}
let carStatusUnpower = carSn => {
  return fetch(api.CARSTATUS_UNPOWER, { carSn }, 'post', {})
}
let carStatusReboot = carSn => {
  return fetch(api.CARSTATUS_REBOOT, { carSn }, 'post', {})
}
let carStatusUnmaintain = carSn => {
  return fetch(api.CARSTATUS_UNMAINTAIN, { carSn }, 'post', {})
}
let carStatusUnlock = carSn => {
  return fetch(api.CARSTATUS_UNLOCK, { carSn }, 'post', {})
}
let carStatusLock = carSn => {
  return fetch(api.CARSTATUS_LOCK, { carSn }, 'post', {})
}

let carStatusAnalysis = () => {
  // 后面的路径和原来的不一样
  return fetch(api.CARSTATUS_ANALYSIS, null, 'get')
}
export default {
  get_carStatusPagingOrSearch, // 分页和搜索
  carStatusPower, // 给动力
  carStatusRent, // 设置空闲
  carStatusUnpower, // 断动力
  carStatusReboot, // 设备重启
  carStatusUnmaintain, // 清空运维卡
  carStatusUnlock, // 开门
  carStatusLock, // 锁门
  carStatusAnalysis // 数据
}
