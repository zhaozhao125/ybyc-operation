import carActionRecord from './car-action-record.js'
import carAlarm from './car-alarm.js'
import carInfo from './car-info.js'
import carModel from './car-model.js'
import carMonitoring from './car-monitoring.js'
import carOfflineRecord from './car-offline-record.js'
import carStartRecord from './car-start-record.js'
import carStatus from './car-status.js'
import carViolation from './car-violation.js'
import carSelect from './car-select.js'
import dist from './dist.js'
import carWarning from './car-warning.js'
import carStatusMap from './car-status-map.js'
import carWhiteList from './car-white-list.js'
import insuranceCompany from './insurance-company'
import carInsurance from './car-insurance'
export default {
  ...carActionRecord,
  ...carAlarm,
  ...carInfo,
  ...carModel,
  ...carMonitoring,
  ...carOfflineRecord,
  ...carStartRecord,
  ...carStatus,
  ...carViolation,
  ...carSelect,
  ...dist,
  ...carWarning,
  ...carStatusMap,
  ...carWhiteList,
  ...insuranceCompany,
  ...carInsurance
}
