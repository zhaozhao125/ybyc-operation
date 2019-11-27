import { serviceCharging } from '@/config/base-url'

export default {
  GETCHARGINGPILEGENRELIST: `${serviceCharging}charging/equipmentModels`,
  CHARGINGPILEGENREADD: `${serviceCharging}charging/equipmentModels/add`,
  CHARGINGPILEGENREEDIT: `${serviceCharging}charging/equipmentModels/update`,
  CHARGINGPILEGENREINFO: `${serviceCharging}charging/equipmentModels/detail`,
  CHARGINGPILEGENREDEL: `${serviceCharging}charging/equipmentModels/delete`
}
