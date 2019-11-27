import {
  serviceUser
} from '@/config/base-url'

export default {
  COMPANY_LIST: `${serviceUser}serviceCompany/basic/list`,
  COMPANY_CREATE: `${serviceUser}serviceCompany/basic`,
  COMPANY_UPDATE: `${serviceUser}serviceCompany/basic/update`,
  COMPANY_INFO: `${serviceUser}serviceCompany/basic/info`,
  COMPANY_opened: `${serviceUser}serviceCompany/basic/open`,
  COMPANY_closed: `${serviceUser}serviceCompany/basic/close`,
  COMPANY_CHARGE: `${serviceUser}serviceCompany/finance/companyMoney/adminManualRechargeBalance`,
  COMPANY_REFUND: `${serviceUser}serviceCompany/finance/companyMoney/adminManualDeductBalance`
}
