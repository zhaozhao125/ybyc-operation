export default [
  {
    type: 'labelSelectText',
    placeholder: '请输入',
    name: 'selectText',
    optionValue: 'userPhone',
    visible: true,
    options: [
      {
        label: '手机号',
        value: 'userPhone'
      },
      {
        label: '姓名',
        value: 'userName'
      }
    ]
  },
  {
    label: '发票状态',
    name: 'status',
    type: 'select',
    options: [
      {
        label: '待处理',
        value: 'pending'
      },
      {
        label: '已处理',
        value: 'processed'
      }
    ],
    visible: true
  },
  {
    label: '运营城市',
    name: 'cityId',
    type: 'city',
    enableAuth: true,
    placeholder: '请选择'
  },
  {
    type: 'labelSelectDateRange',
    placeholder: '请选择时间',
    name: 'selectDate',
    optionValue: 'applyTime',
    options: [
      {
        label: '申请时间',
        value: 'applyTime'
      },
      {
        label: '处理时间',
        value: 'handleTime'
      }
    ]
  }
]
