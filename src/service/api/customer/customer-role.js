import { serviceUser } from '@/config/base-url'
export default {
  /** 用户角色列表 **/
  CUSTOMER_ROLE_LIST: `${serviceUser}serviceUser/basic/userRole/page`,
  ADD_CUSTOMER_ROLE: `${serviceUser}serviceUser/basic/userRole/create`,
  EDIT_CUSTOMER_ROLE: `${serviceUser}serviceUser/basic/userRole/update`,
  DEL_CUSTOMER_ROLE: `${serviceUser}serviceUser/basic/userRole/delete`,

}
