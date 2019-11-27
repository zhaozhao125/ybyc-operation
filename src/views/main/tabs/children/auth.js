// import administrator from '@/views/main/authority/administrator'
// import role from '@/views/main/authority/role/role'
// import auth from '@/views/main/authority/auth/auth'
// let auth = resolve => require(['@/views/main/authority/auth/auth'], resolve)
const administrator = () => import(/* webpackChunkName: "auth" */ '@/views/main/authority/administrator')
const role = () => import(/* webpackChunkName: "auth" */ '@/views/main/authority/role/role')
const auth = () => import(/* webpackChunkName: "auth" */ '@/views/main/authority/auth/auth')

export default {
  administrator,
  role,
  auth
}
