export const searchSettings = [{
  type: 'labelSelectText',
  placeholder: '请输入',
  name: 'selectText',
  optionValue: 'carNumber',
  visible: true,
  options: [{
    label: '车牌号',
    value: 'carNumber'
  }, {
    label: '用户姓名',
    value: 'userName'
  }, {
    label: '用户手机号',
    value: 'userPhone'
  }, {
    label: '订单编号',
    value: 'orderSn'
  }, {
    label: '优惠券名称',
    value: 'discountDescription'
  }]
}, {
  label: '订单状态',
  name: 'orderStatus',
  type: 'select',
  options: [{
    label: '预约中',
    value: 'subscribed'
  }, {
    label: '租赁中',
    value: 'rent'
  }, {
    label: '锁单中',
    value: 'locked'
  }, {
    label: '待支付',
    value: 'returned'
  }, {
    label: '已完成',
    value: 'finished'
  }, {
    label: '已取消',
    value: 'cancel'
  }],
  visible: true
}, {
  label: '运营城市',
  type: 'remoteCity',
  placeholder: '请选择',
  name: 'cityId'
}, {
  type: 'labelSelectDateRange',
  placeholder: '请选择时间',
  name: 'selectDate',
  optionValue: 'date',
  options: [{
    label: '下单时间',
    value: 'date'
  }, {
    label: '取车时间',
    value: 'startDate'
  }, {
    label: '还车时间',
    value: 'returnDate'
  }, {
    label: '完成时间',
    value: 'payTime'
  }]
}, {
  label: '车型',
  name: 'carGenreId',
  type: 'select',
  options: []
}, {
  label: '使用优惠券',
  name: 'useDiscount',
  type: 'select',
  placeholder: '请选择',
  options: [{
    label: '使用',
    value: 'true'
  }, {
    label: '不使用',
    value: 'false'
  }]
// }, {
//   label: '是否逾期',
//   name: 'overdue',
//   type: 'select',
//   placeholder: '请选择',
//   options: [{
//     label: '是',
//     value: 'true'
//   }, {
//     label: '否',
//     value: 'false'
//   }]
}, {
  label: '还车来源',
  name: 'returnType',
  type: 'select',
  placeholder: '请选择',
  options: [{
    label: '用户还车',
    value: 'app'
  }, {
    label: '后台还车',
    value: 'background'
  }, {
    label: 'tbox还车',
    value: 'tbox'
  }, {
    label: '中控屏还车',
    value: 'screen'
  }, {
    label: '运维还车',
    value: 'maintenance'
  }, {
    label: '微信还车',
    value: 'weixin'
  }]
}, {
  type: 'labelSelectRemote',
  placeholder: '请输入',
  name: 'selectDateRemote',
  optionValue: 'takeStationId',
  options: [{
    label: '取车网点',
    value: 'takeStationId'
  }, {
    label: '还车网点',
    value: 'returnStationId'
  }]
}]

export const overdueSearchSettings = [{
  type: 'labelSelectText',
  placeholder: '请输入',
  name: 'selectText',
  optionValue: 'carNumber',
  visible: true,
  options: [{
    label: '车牌号',
    value: 'carNumber'
  }, {
    label: '用户姓名',
    value: 'userName'
  }, {
    label: '用户手机号',
    value: 'userPhone'
  }, {
    label: '订单编号',
    value: 'orderSn'
  }, {
    label: '优惠券名称',
    value: 'discountDescription'
  }]
}, {
  label: '运营城市',
  type: 'remoteCity',
  placeholder: '请选择',
  name: 'cityId',
  visible: true
}, {
  type: 'labelSelectDateRange',
  placeholder: '请选择时间',
  name: 'selectDate',
  optionValue: 'date',
  options: [{
    label: '下单时间',
    value: 'date'
  }, {
    label: '取车时间',
    value: 'startDate'
  }, {
    label: '还车时间',
    value: 'returnDate'
  }, {
    label: '完成时间',
    value: 'payTime'
  }]
}, {
  label: '车型',
  name: 'carGenreId',
  type: 'select',
  options: []
}, {
  label: '使用优惠券',
  name: 'useDiscount',
  type: 'select',
  placeholder: '请选择',
  options: [{
    label: '使用',
    value: 'true'
  }, {
    label: '不使用',
    value: 'false'
  }]
}, {
  label: '还车来源',
  name: 'returnType',
  type: 'select',
  placeholder: '请选择',
  options: [{
    label: '用户还车',
    value: 'app'
  }, {
    label: '后台还车',
    value: 'background'
  }, {
    label: 'tbox还车',
    value: 'tbox'
  }, {
    label: '中控屏还车',
    value: 'screen'
  }, {
    label: '运维还车',
    value: 'maintenance'
  }, {
    label: '微信还车',
    value: 'weixin'
  }]
}, {
  type: 'labelSelectRemote',
  placeholder: '请输入',
  name: 'selectDateRemote',
  optionValue: 'takeStationId',
  options: [{
    label: '取车网点',
    value: 'takeStationId'
  }, {
    label: '还车网点',
    value: 'returnStationId'
  }]
}]
