export const insuranceDetailSettings = [
  {
    label: '保单信息',
    items: [
      {
        name: '保单号',
        fieldName: 'policyNumber'
      },
      {
        name: '保险状态',
        fieldName: 'insuranceStatus'
      },
      {
        name: '保险公司',
        fieldName: 'insurer'
      },
      {
        name: '险种',
        fieldName: 'riskCode'
      },
      {
        name: '被保险人',
        fieldName: 'insurant'
      },
      {
        name: '购买日期',
        fieldName: 'signDate'
      },
      {
        name: '保险期间',
        fieldName: 'effectiveDate'
      },
      {
        name: '保费',
        fieldName: 'premium'
      },
      {
        name: '保险返利',
        fieldName: 'rebateRate'
      },
      {
        name: '备注',
        fieldName: 'remarks'
      }
    ]
  },
  {
    label: '车辆信息',
    items: [
      {
        name: '车辆列表',
        fieldName: 'cityName',
        type: 'slot'
      }
    ]
  }
]
