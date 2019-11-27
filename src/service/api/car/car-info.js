import { serviceCar, optimusCars } from '@/config/base-url'
export default {
  CARS_INFO: `${serviceCar}info`,
  CARS_INFODETAIL: `${serviceCar}:carSn/info`,
  CARS_INFODISABLE: `${serviceCar}:carSn/info/disable`,
  CARS_INFOENABLE: `${serviceCar}:carSn/info/enable`,
  DOWNLOAD_CARINFO: `${optimusCars}info/export`,
  DOWNLOAD_WEBSITELIST: '/optimus/station/info/export',
  DOWNLOAD_ORDERLIST: '/optimus/order/info/export',
  DOWNLOAD_CARSTATUS: '/optimus/cars/status/export',
  DOWNLOAD_ORDERCOMMENT: '/optimus/order/comment/export',
  CARS_INFOSTICKER: `${optimusCars}:carSn/sticker`,
  CAR_RECORD_LIST: `${serviceCar}info/modify-log`,
  CAR_STATUS_SET: `${serviceCar}info/business-status`
}
