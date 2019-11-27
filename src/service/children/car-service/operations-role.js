import { fetch } from '@/utils/fetch'
import api from '@/service/api/'

const roleList = params => fetch(api.ROLE_LIST, params, 'post')
const addRole = params => fetch(api.ROLE_ADD, params, 'post')
const editRole = params => fetch(api.ROLE_EDIT, params, 'post')
const deleteRole = params => fetch(api.ROLE_DELETE, params, 'post')
const getRoleIndex = params => fetch(api.ROLE_INDEX, params, 'get')
const getRoleInfo = params => fetch(api.ROLE_INFO, params, 'get')

export default {
  roleList,
  addRole,
  editRole,
  deleteRole,
  getRoleIndex,
  getRoleInfo
}
