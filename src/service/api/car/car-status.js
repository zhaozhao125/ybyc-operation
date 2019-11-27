import { serviceCar, optimusCars } from '@/config/base-url'
export default {
  CARSTATUS_PAGINGORSEARCH: `${serviceCar}status`,
  CARSTATUS_RENT: `/optimus/cars/action/rentable`,
  CARSTATUS_POWER: `${serviceCar}action/power`,
  CARSTATUS_UNPOWER: `${serviceCar}action/unpower`,
  CARSTATUS_REBOOT: `${serviceCar}action/reboot`,
  CARSTATUS_UNMAINTAIN: `${serviceCar}action/clean-card`,
  CARSTATUS_UNLOCK: `${serviceCar}action/unlock`,
  CARSTATUS_LOCK: `${serviceCar}action/lock`,
  CARSTATUS_ANALYSIS: `${optimusCars}status/analysis`
}
