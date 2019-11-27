import { serviceUser } from '@/config/base-url'
export default {
  RECHARGE_CARD_LIST: `${serviceUser}serviceUser/prepaidCard/page`,
  ADD_RECHARGE_CARD: `${serviceUser}serviceUser/prepaidCard/createPrepaidCard`,
  UPDATE_RECHARGE_CARD: `${serviceUser}serviceUser/prepaidCard/updatePrepaidCard`,
  SWITCH_RECHARGE_CARD_STATUS: `${serviceUser}serviceUser/prepaidCard/updatePrepaidCardStatus`,
  SENDING_LIST: `${serviceUser}serviceUser/prepaidCard/recordPage`,
  RECHARGE_CARD_DETAIL: `${serviceUser}serviceUser/prepaidCard/getPrepaidCard`,
  EXPORT_RECHARGE_CARD_INFO: `/optimus/prepaidCard/record/upload`
}
