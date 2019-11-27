import carModel from './car-model' // 车型详情
import carInfo from './car-info'
import carStatus from './car-status'
import carMonitoring from './car-monitoring.js'
import carViolation from './car-violation.js'
import carActionRecord from './car-action-record'
import carOfflineRecord from './car-offline-record'
import carStartRecord from './car-start-record'
import carAlarm from './car-alarm'
import carSelect from './car-select'
import dist from './dict.js'
import carWarning from './car-warning'
import carStatusMap from './car-status-map'
import carWhiteList from './car-white-list'
import insuranceCompany from './insurance-company'
import carInsurance from './car-insurance'
export default {
  ...carModel,
  ...carInfo,
  ...carStatus,
  ...carMonitoring,
  ...carViolation,
  ...carActionRecord,
  ...carOfflineRecord,
  ...carStartRecord,
  ...carAlarm,
  ...carSelect,
  ...dist,
  ...carWarning,
  ...carStatusMap,
  ...carWhiteList,
  ...insuranceCompany,
  ...carInsurance
}
