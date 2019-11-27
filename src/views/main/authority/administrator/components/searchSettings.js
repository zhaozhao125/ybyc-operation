import store from '@/store/'
export default [
  {
    label: '搜索',
    name: 'username',
    type: 'autocomplete',
    placeholder: '用户名',
    visible: true,
    data: []
  },
  {
    label: '状态',
    name: 'status',
    type: 'select',
    options: [
      {
        label: '有效',
        value: 1
      },
      {
        label: '无效',
        value: 0
      }
    ],
    visible: true
  },
  {
    label: '城市',
    name: 'cityId',
    type: 'city'
  },
  {
    label: '角色',
    name: 'roleId',
    type: 'select',
    options: []
  }
]
