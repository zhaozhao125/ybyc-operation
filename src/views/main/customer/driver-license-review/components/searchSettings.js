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
  }, {
    label: '用户编号',
    value: 'userId'
  }]
}, {
  label: '用户状态',
  name: 'status',
  type: 'select',
  visible: true,
  placeholder: '请选择',
  options: [{
    label: '待审核',
    value: 1
  }, {
    label: '审核成功',
    value: 2
  },{
    label: '审核失败',
    value: 3
  }]
},{
  label: '提交时间',
  name: 'time',
  type: 'daterange',
  // unixTime: true,
  visible: false
}]
