// optimus
// const BASE_URL = 'http://api.optimus.1byongche.com'
let BASE_URL = 'http://47.100.76.78:8510' // 测试地址1

if (process.env.VUE_APP_ENV) {
  if (process.env.VUE_APP_ENV == 'development') {
    BASE_URL = 'http://47.100.76.78:8510' // 测试地址
    // BASE_URL = 'http://api.optimus.1byongche.com' // 正式地址
  } else if (process.env.VUE_APP_ENV == 'production') {
    BASE_URL = 'http://api.optimus.1byongche.com' // 正式地址
  } else if (process.env.VUE_APP_ENV == 'development2') {
    BASE_URL = 'http://47.100.76.78:9510' // 开发环境
  }
}
// 七牛上传地址七牛上传地址
export const UP_URL = 'http://upload.qiniup.com/'
// 七牛下载地址
export const DOWN_URL = 'http://static1.1byongche.com/'

// 第二基准路径
export const serviceUser = '/service-user/' // 用户
export const serviceCarStation = '/service-car-station/' // 网点
export const serviceCar = '/service-car/cars/' // 车辆

export const optimusCars = '/optimus/cars/' // 导入导出
export const serviceCommon = '/service-common/common/' // 运营城市

// BASE_URL = 'http://phpmroservice.net' // 正式地址
// export const servicePhp = '/' // php微服务
export const servicePhp = '/service-php/' // php微服务
// 充电桩
export const serviceCharging = '/service-charging/'

export default BASE_URL
