export default [{
  label: '搜索',
  name: 'selectText',
  type: 'labelSelectText',
  placeholder: '请输入',
  optionValue: 'companyName',
  options: [{
    label: '企业名称',
    value: 'companyName'
  }, {
    label: '用户姓名',
    value: 'applyUserName'
  }, {
    label: '用户手机号',
    value: 'applyUserPhone'
  }],
  visible: true
}, {
  label: '处理状态',
  name: 'status',
  type: 'select',
  default: 'applying',
  options: [{
    label: '待审核',
    value: 'applying'
  }, {
    label: '已创建',
    value: 'success'
  }, {
    label: '已拒绝',
    value: 'fail'
  }],
  visible: true
}, {
  label: '申请时间',
  name: 'applyTime',
  type: 'daterange',
  unixTime: true
}]
