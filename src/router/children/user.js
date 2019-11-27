export default [{
  path: '/login',
  name: 'login',
  meta: {
    title: '登录'
  },
  component: resolve => require(['@/views/user/login/'], resolve)
}]
