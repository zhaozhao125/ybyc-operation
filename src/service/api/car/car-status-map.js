import { serviceCar } from '@/config/base-url'
console.log(serviceCar)
export default {
  CARSTATUS_MAPLIST: `${serviceCar}status`,
  // CAR_HAIMA_LIST: `${serviceCar}status`,
  CARSTATUS_RENTSTSTUS: `${serviceCar}status/analysis/rent-status`,
  CARSTATUS_STATUSNOW: `${serviceCar}`
  //  /2016zdd1201803860114/status/now
}
