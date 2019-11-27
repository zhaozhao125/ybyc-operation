export const detailSettings = [{
  label: '基本信息',
  items: [{
    label: '订单编号',
    value: 'sn'
  }, {
    label: '订单状态',
    value: 'orderStatusName',
    type: 'text'
  }, {
    label: '下单时间',
    value: 'createdTimeLong',
    type: 'time'
  }, {
    label: '取车时间',
    value: 'startTimeLong',
    type: 'time'
  }, {
    label: '还车时间',
    value: 'returnTimeLong',
    type: 'time'
  }, {
    label: '完成时间',
    value: 'payTimeLong',
    type: 'time'
  }, {
    label: '取车网点',
    value: 'takeStationName',
    type: 'slot'
  }, {
    label: '还车网点',
    value: 'returnStationName',
    type: 'slot'
  }]
}, {
  label: '用户信息',
  items: [{
    label: '用户姓名',
    value: 'userName'
  }, {
    label: '手机号',
    value: 'userPhone'
  }]
},
{
  label: '车辆信息',
  items: [{
    label: '车牌号',
    value: 'carNumber'
  }, {
    label: '车型',
    value: 'carGenreName'
  }, {
    label: '里程起始数',
    value: 'startMileage',
    type: 'text',
    append: 'km'
  }, {
    label: '里程截止数',
    value: 'endMileage',
    type: 'text',
    append: 'km'
  }, {
    label: '开始电量',
    value: 'startSoc',
    type: 'text',
    append: '%'
  }, {
    label: '结束电量',
    value: 'endSoc',
    type: 'text',
    append: '%'
  }]
},
{
  label: '订单计费',
  items: [{
    label: '租车天数计费',
    value: 'dayMoneyTotal',
    type: 'slot'
  },
  {
    label: '最后一天行驶计费',
    value: 'onMoneyTodayTotal',
    type: 'slot'
  }, {
    label: '最后一天停车计费',
    value: 'offMoneyTodayTotal',
    type: 'slot'
  }, {
    label: '不计免赔服务',
    value: 'noDeductiblesPrice',
    type: 'text',
    append: '元'
  }, {
    label: '还车服务费',
    value: 'returnCarPrice',
    type: 'text',
    append: '元',
    visibleControl: (data) => {
      return data.returnStationType === 'casual'
    }
  }, {
    label: '城郊服务费',
    value: 'citySuburbanMoney',
    type: 'text',
    append: '元'
  }, {
    label: '跨城服务费',
    value: 'cityCrossMoney',
    type: 'slot'
  }, {
    label: '订单金额',
    value: 'orderTotalMoney',
    type: 'text',
    append: '元'
  }, {
    label: '优惠方式',
    value: 'discountTypeName'
  }, {
    label: '优惠金额',
    value: 'discountAmount',
    type: 'slot'
  }, {
    label: '应付金额',
    value: 'needPayMoney',
    type: 'text',
    append: '元'
  }, {
    label: '实付金额',
    value: 'payMoney',
    type: 'text',
    append: '元'
  }
  ]
}, {
  label: '支付信息',
  items: [{
    label: '余额支付',
    value: 'wallet',
    type: 'text',
    append: '元',
    visibleControl: (data) => {
      return data.wallet
    }
  }, {
    label: '微信支付',
    value: 'weiXin',
    type: 'text',
    append: '元',
    visibleControl: (data) => {
      return data.weiXin
    }
  }, {
    label: '支付宝支付',
    value: 'aliPay',
    type: 'text',
    append: '元',
    visibleControl: (data) => {
      return data.aliPay
    }
  }, {
    label: '企业支付',
    value: 'companyWallet',
    type: 'text',
    append: '元',
    visibleControl: (data) => {
      return data.companyWallet
    }
  }, {
    label: '出行卡支付',
    value: 'chargeCard',
    type: 'text',
    append: '元',
    visibleControl: (data) => {
      return data.chargeCard
    }
  }, {
    label: '支付时间',
    value: 'payTimeLong',
    type: 'time'
  }]
}, {
  label: '照片',
  visibleControl: (data) => {
    return data.orderStatusCode !== 'subscribed' && data.orderStatusCode !== 'cancel'
  },
  items: [{
    label: '用车检查',
    value: 'takeCarImages',
    type: 'image',
    descriptionType: 'show'
  }, {
    label: '还车检查',
    value: 'returnCarImages',
    type: 'image',
    descriptionType: 'show',
    visibleControl: (data) => {
      return data.orderStatusCode !== 'rent'
    }
  }]
}, {
  label: '开票信息',
  visibleControl: {
    name: 'orderStatusCode',
    value: 'finished'
  },
  items: [
    {
      label: '',
      value: 'invoiceInfo',
      type: 'slot'
    }
  ]
}, {
  label: '取消原因',
  visibleControl: {
    name: 'orderStatusCode',
    value: 'cancel'
  },
  items: [{
    label: '取消方式',
    value: 'cancelTypeName'
  }, {
    label: '原因',
    value: 'cancelReason'
  }, {
    label: '描述',
    value: 'cancelReasonDescription'
  }, {
    label: '照片',
    value: 'cancelImages',
    type: 'image',
    descriptionType: 'show'
  }]
}, {
  label: '其他信息',
  items: [{
    label: '订单来源',
    value: 'orderSourceName'
  }, {
    label: '还车来源',
    value: 'returnTypeName'
  }, {
    label: '操作人',
    value: 'modifiedBy'
  }, {
    label: '还车原因',
    value: 'backReturnReason',
    visibleControl: (data) => {
      return (data.orderStatusCode === 'returned' || data.orderStatusCode === 'finished') && data.returnTypeCode === 'background'
    }
  }, {
    label: '还车备注',
    value: 'remark'
  }]
}, {
  label: '订单日志',
  items: [{
    label: '',
    value: 'returnCarPolygon',
    type: 'slot'
  }]
}
]

export const returnDetailSettings = [{
  label: '车辆信息',
  items: [{
    label: '车牌号',
    value: 'carNumber'
  }, {
    label: '车型',
    value: 'carGenreName'
  }, {
    label: '计费标准',
    value: 'onMinutePrice',
    type: 'slot'
  }]
}, {
  label: '实时计费',
  items: [{
    label: '租车天数计费',
    value: 'dayMoneyTotal',
    type: 'slot'
  },
  {
    label: '最后一天行驶计费',
    value: 'onMoneyTodayTotal',
    type: 'slot'
  }, {
    label: '最后一天停车计费',
    value: 'offMoneyTodayTotal',
    type: 'slot'
  }, {
    label: '不计免赔服务',
    value: 'noDeductiblesPrice',
    type: 'slot'
  }, {
    label: '还车服务费',
    value: 'returnCarPrice',
    type: 'text',
    append: '元',
    visibleControl: (data) => {
      return data.currentStationType === 'casual'
    }
  }, {
    label: '城郊服务费',
    value: 'citySuburbanMoney',
    type: 'slot'
  }, {
    label: '跨城服务费',
    value: 'cityCrossMoney',
    type: 'slot'
  }, {
    label: '订单目前计费',
    value: 'orderTotalMoney',
    type: 'slot'
  }, {
    label: '最后计费时间',
    value: 'lastBillingTime'
  }
  ]
}, {
  label: '用户信息',
  items: [{
    label: '用户姓名',
    value: 'userName'
  }, {
    label: '手机号',
    value: 'userPhone'
  }, {
    label: '余额',
    value: 'currentUserMoneyTotal',
    type: 'slot'
  }]
}]

export const currentBillSettings = [{
  label: '',
  items: [{
    label: '车牌号',
    value: 'carNumber',
    type: 'slot'
  }, {
    label: '车型',
    value: 'carModelName'
  }, {
    label: '计费标准',
    value: 'onMinutePrice',
    type: 'slot'
  }, {
    label: '订单目前计费',
    value: 'totalMoney',
    type: 'slot'
  },
  {
    label: '租车天数计费',
    value: 'dayMoneyTotal',
    type: 'slot'
  },
  {
    label: '最后一天行驶计费',
    value: 'onMoneyTodayTotal',
    type: 'slot'
  }, {
    label: '最后一天停车计费',
    value: 'offMoneyTodayTotal',
    type: 'slot'
  }, {
    label: '不计免赔服务',
    value: 'noDeductiblesPrice',
    type: 'slot'
  }, {
    label: '城郊服务费',
    value: 'citySuburbanMoney',
    type: 'slot'
  }, {
    label: '跨城服务费',
    value: 'cityCrossMoney',
    type: 'slot'
  }, {
    label: '最后计费时间',
    value: 'orderFeeDTO.lastBillingTime'
  }]
}]
