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
    label: '用户姓名',
    value: 'userName'
  }, {
    label: '用户编号',
    value: 'userId'
  }, {
    label: '身份证号',
    value: 'userIdentityNumber'
  }]
}, {
  label: '是否管理员',
  name: 'role',
  type: 'select',
  placeholder: '请选择',
  options: [{
    label: '是',
    value: 'manager'
  }, {
    label: '否',
    value: 'general'
  }]
}, {
  type: 'labelSelectDateRange',
  placeholder: '请选择',
  name: 'selectDate',
  optionValue: 'registerTime',
  unixTime: true,
  options: [{
    label: '注册时间',
    value: 'registerTime'
  }, {
    label: '认证通过时间',
    value: 'userUploadTime'
  }, {
    label: '首充保证金时间',
    value: 'timeShareRechargeFirstTime'
  }, {
    label: '首单时间',
    value: 'timeShareOrderFirstTime'
  }]
}, {
  visible: true,
  type: 'labelSelectCity',
  placeholder: '请选择',
  name: 'selectCity',
  optionValue: 'cityId',
  options: [{
    label: '注册城市',
    value: 'cityId'
  }, {
    label: '所属城市',
    value: 'cityIdBelongTo'
  }],
  enableAuth: true
}]
