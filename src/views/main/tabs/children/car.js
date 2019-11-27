import carStatus from '@/views/main/car-management/car-status/'
import carModel from '@/views/main/car-management/car-model/car-model'
import carLocation from '@/views/main/car-management/car-monitoring/location'
import carInfo from '@/views/main/car-management/car-info'
import carTrack from '@/views/main/car-management/car-monitoring/car-track/car-track'
import carActionRecord from '@/views/main/car-management/car-monitoring/car-action-record/'
import carStartRecord from '@/views/main/car-management/car-monitoring/car-start-record'
import carOfflineRecord from '@/views/main/car-management/car-monitoring/car-offline-record'
import carAlarm from '@/views/main/car-management/car-monitoring/car-alarm'
import carWarningMap from '@/views/main/car-management/car-warning/car-warning-map'
import carWarningRecord from '@/views/main/car-management/car-warning/car-warning-record'
import carWhiteList from '@/views/main/car-management/car-warning/car-white-list'
import carStatusMap from '@/views/main/car-management/car-status-map'
import carHaimaMap from '@/views/main/car-management/car-haima-map/car-haima-map'
import carInsurance from '@/views/main/car-management/insurance-mange/car-insurance'
import insuranceCompany from '@/views/main/car-management/insurance-mange/insurance-company'
// import carStatueMap from '@/views/main/car-management/car-statue-map'
// import carViolation from "@/views/main/car-management/violation/violation";

export default {
  carStatus,
  carModel,
  carLocation,
  carInfo,
  carTrack,
  carActionRecord,
  carStartRecord,
  carOfflineRecord,
  carAlarm,
  carWarningMap,
  carWarningRecord,
  carWhiteList,
  carStatusMap,
  carHaimaMap,
  carInsurance,
  insuranceCompany,
  carViolation: () => import('@/views/main/car-management/violation/violation')
}
