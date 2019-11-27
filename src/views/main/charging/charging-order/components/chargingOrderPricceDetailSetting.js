export const orderDetailSettings = [{
  label: '',
  items: [{
    label: '桩编号',
    value: 'connectorId',
    name:'connectorId',
    type:'slot'
  }, {
    label: '当前电压',
    value: 'voltageA',
    append:'V'
  }, {
    label: '当前电流',
    value: 'currentA',
    append:"A"
  }, {
    label: '当前功率',
    value: 'power',
    append:"W"
  },{
    label: '计费标准',
    value: 'prices',
    name: 'prices',
    type: 'slot'
  },{
    label: '订单目前计费',
    value: 'totalMoney',
    name:'totalMoney',
    type:'slot',
    append:"元"
  },{
      label: '充电量',
      value: 'totalPower',
      append:"度"
    },{
      label: '充电费',
      value: 'elecMoney',
      append:"元"
    },{
      label: '服务费',
      value: 'serviceMoney',
      append:"元"
    },{
    label: '站位费',
    value: 'parkingMoney',
    name:"parkingMoney",
    type:'slot'
  },{
    label: '最后计费时间',
    value: 'endTime',
  },
  ]
}
]
