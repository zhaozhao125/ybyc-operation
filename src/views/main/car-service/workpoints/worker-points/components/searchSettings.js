export default [
  {
    type: 'text',
    label: '姓名',
    placeholder: '请输入',
    name: 'name',
    optionValue: 'name',
    visible: true
  },
  {
    label: '城市',
    name: 'cityId',
    type: 'city',
    enableAuth: true,
    visible: true
  },
  {
    label: '角色',
    name: 'roleId',
    placeholder: '请选择',
    type: 'select',
    options: []
  },
  {
    label: '工分汇总日期',
    type: 'month',
    placeholder: '请选择',
    name: 'yearMonthCollect',
    optionValue: 'registerTime',
    default: new Date()
  }
]
