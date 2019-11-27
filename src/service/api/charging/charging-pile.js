import { serviceCharging } from '@/config/base-url'

export default {
  GETCHARGINGPILELIST: `${serviceCharging}charging/equipments`, // 充电桩列表
  GETCHARGINGPILEINFO: `${serviceCharging}charging/equipments/detail`, // 充电桩详情
  CHARGINGPILEADD: `${serviceCharging}charging/equipments/add`, // 新增充电桩
  CHARGINGPILEEDIT: `${serviceCharging}charging/equipments/update`, // 修改充电桩
  CHARGINGPILESTATUS: `${serviceCharging}charging/equipments/updateStatus`, // 启用，禁用充电桩
  GETCHARGINGPILEGENRE: `${serviceCharging}charging/equipmentModels/allModels`,
  ALLCHARGINGSTATION: `${serviceCharging}charging/stations`,
  CHARGINGSTATIONSTICKER: `${serviceCharging}charging/equipments/qrcode`,
  CHARGINGUPGRADE: `${serviceCharging}charging/equipments/upgrade`,
  DOWNCHARGINGINFO: `/optimus/charging/equipments/export`
}
