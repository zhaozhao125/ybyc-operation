import mainPage from '@/views/main/main-page'
export default [{
  path: '/',
  name: 'index',
  redirect: {
    name: 'dashboard'
  }
}, {
  path: '/dashboard',
  name: 'dashboard',
  meta: {
    title: '控制面板',
    requireAuth: true
  },
  component: mainPage
}, {
  path: '/test',
  component: resolve => require(['@/test/test'], resolve)
}, {
  path: '/test2',
  component: resolve => require(['@/test/detail'], resolve)
}, {
  path: '/customer-service/feedbackproblem',
  component: resolve => require(['@/views/main/customer-service/feedbackproblem'], resolve)
}, {
  path: '/charging/charging-pile-network/list',
  component: resolve => require(['@/views/main/charging/charging-pile-network/list/index'], resolve)
}]
