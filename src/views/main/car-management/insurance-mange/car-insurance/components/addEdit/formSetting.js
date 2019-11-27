export default [
  {
    label: '保单信息',
    items: [
      {
        label: '保单号',
        name: 'policyNumber',
        type: 'text',
        required: true,
        placeholder: '请输入保单号',
        trigger: 'blur'
      },
      {
        label: '保险公司',
        name: 'insurerId',
        type: 'select',
        placeholder: '请选择保险公司',
        options: [],
        required: true
      },
      {
        label: '险种',
        name: 'riskCode',
        type: 'select',
        required: true,
        placeholder: '请选择险种',
        options: [
          {
            label: '交强险',
            value: 'CLIVTA'
          },
          {
            label: '商业险',
            value: 'VI'
          },
          {
            label: '驾乘险',
            value: 'DRIVING'
          }
        ]
      },
      {
        label: '被保险人',
        name: 'insurant',
        type: 'text',
        placeholder: '请输入被保险人',
        required: true
      },
      {
        label: '购买日期',
        name: 'signDate',
        required: true,
        type: 'datetime',
        placeholder: '请输入购买日期'
      },
      {
        label: '保险期间',
        name: 'insuranceDuring',
        required: true,
        type: 'datetimerange',
        defaultTime: ['00:00:00', '23:59:59']
      },
      {
        label: '保费',
        name: 'premium',
        type: 'slot',
        required: true,
        placeholder: '请输入保费'
      },
      {
        label: '保险返利',
        name: 'rebateRate',
        type: 'slot',
        placeholder: '请输入保险返利',
        required: true
      },
      {
        label: '备注',
        name: 'remarks',
        type: 'text',
        placeholder: '请输入备注'
      }
    ]
  },
  {
    label: '车辆信息',
    items: [
      {
        label: '车辆列表',
        name: 'carList',
        type: 'slot'
      }
    ]
  }
]
