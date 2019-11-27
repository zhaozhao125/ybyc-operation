export default [{
  label: '用户手机号',
  name: 'userPhone',
  type: 'text',
  visible: true
}, {
  label: '充值卡状态',
  name: 'status',
  type: 'select',
  visible: true,
  placeholder: '请选择',
  options: [{
    label: '未使用',
    value: '0'
  }, {
    label: '已使用',
    value: '1'
  }, {
    label: '已失效',
    value: '2'
  }]
}]
