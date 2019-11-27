export default [{
  label: '订单编号',
  name: 'orderSn',
  type: 'text',
  placeholder: '请输入',
  visible: true
}, {
  label: '提交异常时间',
  name: 'date',
  type: 'daterange',
  placeholder: '请选择时间',
  data: [],
  visible: true
}, {
  label: '订单状态',
  name: 'orderStatus',
  type: 'select',
  options: [{
    label: '锁单中',
    value: 'locked'
  }, {
    label: '待支付',
    value: 'returned'
  }, {
    label: '已完成',
    value: 'finished'
  }],
  visible: true
}]
