export default [{
  type: 'labelSelectText',
  placeholder: '请输入',
  name: 'selectText',
  optionValue: 'userPhone',

  visible: true,
  options: [{
    label: '手机号',
    value: 'userPhone'

  }, {
    label: '姓名',
    value: 'userName'

  }]
}, {
  label: '发生时间',
  visible: true,
  name: 'addTime',
  type: 'daterange',
  // unixTime: true
  default: [new Date(Date.now() - (7 * 24 * 60 * 60 * 1000)), new Date()]
}, {
  label: '科目',
  name: 'actionCodes',
  type: 'select',
  placeholder: '不限',
  multiple: true,
  visible: false,
  options: []
}, {
  label: '所属城市',
  type: 'city',
  placeholder: '请选择',
  name: 'cityId'
  // enableAuth: true
}]
