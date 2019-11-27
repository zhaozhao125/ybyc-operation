export default [{
  type: 'labelSelectText',
  placeholder: '请输入',
  visible: true,
  name: 'selectText',
  optionValue: 'userPhone',
  options: [
    {
      label: '用户手机号',
      value: 'userPhone'
    }, {
      label: '订单编号',
      value: 'orderSn'
    }]
}, {
  label: '订单类型',
  name: 'orderType',
  type: 'select',
  placeholder: '不限',
  options: [{
    label: '短租',
    value: 'short'
  }, {
    label: '长租',
    value: 'longRent'
  }],
  visible: true
}, {
  label: '操作类型',
  name: 'typeFilter',
  type: 'select',
  placeholder: '不限',
  options: [{
    label: '首租支付',
    value: 'first'
  }, {
    label: '续租支付',
    value: 'rerent'
  }]
}, {
  label: '城市',
  type: 'city',
  placeholder: '请选择',
  name: 'cityId',
  enableAuth: true

}, {
  label: '支付时间',
  name: 'date',
  type: 'daterange',
  placeholder: '请选择时间',
  data: []
}]
