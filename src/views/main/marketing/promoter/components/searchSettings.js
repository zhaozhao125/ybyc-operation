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
  label: '用户角色',
  type: 'remoteRole',
  placeholder: '请选择',
  name: 'userRoleId',
  visible: true
}, {

  label: '发生时间',
  visible: true,
  name: 'createTime',
  type: 'daterange'
  // unixTime: true
}]
