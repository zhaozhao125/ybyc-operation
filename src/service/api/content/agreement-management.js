import { servicePhp } from '@/config/base-url'
export default {
  /** 协议内容 **/
  AGREEMENTCONTENT: `${servicePhp}system/get-agreement-content`,
  UPDATEUSERAGREEMENT: `${servicePhp}system/update-user-agreement-content`,
  UPDATERECHARGEAGREEMENT: `${servicePhp}system/update-recharge-agreement-content`
}
