// 搜索
export const searchSettings = [
  {
    name: 'user',
    type: 'labelSelectText',
    placeholder: '请输入',
    visible: true,
    data: [],
    optionValue: 'userPhone',
    options: [
      {
        value: 'userPhone',
        label: '手机号'
      },
      {
        value: 'userName',
        label: '姓名'
      }
    ]
  },
  {
    label: '审核状态',
    name: 'status',
    type: 'select',
    visible: true,
    optionValue: 'checkSuccess',
    default: 'checkSuccess',
    options: [
      {
        value: 'checkSuccess',
        label: '待处理'
      },
      {
        value: 'refunding',
        label: '退款中'
      },
      {
        value: 'success',
        label: '退款成功'
      },
      {
        value: 'cancle',
        label: '取消退款'
      },
      {
        value: 'failure',
        label: '退款失败'
      }
    ]
  },
  {
    label: '所属城市',
    type: 'city',
    placeholder: '请选择',
    name: 'cityIds',
    multiple: true,
    clearable: true,
    enableAuth: true,
    enableOtherCity: true
  },
  {
    label: '是否有银行卡退款',
    name: 'hasBankRecord',
    type: 'select',
    options: [
      {
        value: true,
        label: '有'
      },
      {
        value: false,
        label: '无'
      }
    ]
  },
  // {
  //   label: '账户类型',
  //   name: 'userMoneyType',
  //   type: 'select',
  //   optionValue: '100',
  //   options: [
  //     {
  //       value: 'timeShareRentDeposit',
  //       label: '分时保证金'
  //     },
  //     {
  //       value: 'longTermRentCarDeposit',
  //       label: '长租车辆押金'
  //     },
  //     {
  //       value: 'longTermRentViolationDeposit',
  //       label: '长租违章押金'
  //     }
  //   ]
  // },
  // {
  //   label: '退款类型',
  //   name: 'amountRate',
  //   type: 'select',
  //   changeOnSelect: true,
  //   options: [
  //     {
  //       value: 'full',
  //       label: '退全额'
  //     },
  //     {
  //       value: 'differ',
  //       label: '退差额'
  //     }
  //   ]
  // },
  {
    label: '',
    name: 'dateType',
    type: 'labelSelectDateRange',
    optionValue: 'add',
    options: [
      {
        value: 'add',
        label: '用户申请时间'
      },
      {
        value: 'check',
        label: '运营审核时间'
      },
      {
        value: 'handle',
        label: '财务处理时间'
      }
    ]
    // unixTime: true
    // 直接转成时间戳
    // unixTime: true
  }
  // {
  //   label: '是否有银行卡有退款',
  //   name: 'hasBankRecord',
  //   type: 'select',
  //   // optionValue: true,
  //   default: '',
  //   options: [
  //     {
  //       value: '',
  //       label: '不限'
  //     },
  //     {
  //       value: true,
  //       label: '有'
  //     },
  //     {
  //       value: false,
  //       label: '无'
  //     }
  //   ]
  // }
]
// 详情页
export const detailSettings = [
  {
    label: '基本信息',
    items: [
      {
        name: '车辆编号',
        fieldName: 'carSn'
      },
      {
        name: '车牌号',
        fieldName: 'carNumber'
      },
      {
        name: '所属车型',
        fieldName: 'carModelName'
      },
      {
        name: '租赁类型',
        fieldName: 'rentTypeCode',
        type: 'slot'
      },
      {
        name: '城市',
        fieldName: 'area',
        type: 'slot'
      },
      {
        name: '车架号',
        fieldName: 'vin'
      },
      {
        name: '发动机号',
        fieldName: 'carEngineNumber'
      },
      {
        name: '车贴',
        fieldName: 'carEngineNumber',
        type: 'slot'
      },
      {
        name: '开始使用日期',
        fieldName: 'useDate',
        type: 'time'
      },
      {
        name: '所属网点',
        fieldName: 'association'
      }
    ]
  },
  {
    label: 'tbox信息',
    items: [
      {
        name: 'tbox类别',
        fieldName: 'tboxTypeName'
      },
      {
        name: 'tbox设备号',
        fieldName: 'tboxSimNumber'
      },
      {
        name: 'tbox sim卡号',
        fieldName: 'carTableSimNumber'
      }
    ]
  },
  {
    label: '审计信息',
    items: [
      {
        name: '创建人',
        fieldName: 'createdBy'
      },
      {
        name: '创建时间',
        fieldName: 'createdOn',
        type: 'time'
      },
      {
        name: '修改人',
        fieldName: 'modifiedBy'
      },
      {
        name: '修改时间',
        fieldName: 'modifiedOn',
        type: 'time'
      }
    ]
  }
]
