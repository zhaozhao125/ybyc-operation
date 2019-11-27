export const orderDetailSettings = [{
  label: '基本信息',
  items: [{
    name: '站点名称',
    fieldName: 'stationName'
  }, {
    name: '城市',
    fieldName: 'cityName'
  }, {
    name: '网点图片',
    fieldName: 'imageArray',
    type: 'img'
  }]
}, {
  label: '营业信息',
  items: [{
    name: '站点类型',
    fieldName: 'stationTypeName'
  }, {
    name: '营业时间',
    fieldName: 'businessTime'
  }, {
    name: '服务电话',
    fieldName: 'telephone'
  }, {
    name: '充电费用',
    fieldName: 'prices_txt',
    type: 'slot'
  }, {
    name: '电费成本',
    fieldName: 'electricityActualCost',
    type: 'slot'
  }, {
    name: '站位费',
    fieldName: 'parkingPrice_txt'
  }, {
    name: '充电桩',
    fieldName: 'charge_pile_num'
  }]
},
{
  label: '地理信息',
  items: [{
    name: '经纬度',
    fieldName: 'lat_lng'
  }, {
    name: '地址',
    fieldName: 'address'
  }, {
    name: '',
    fieldName: 'latlngarr',
    type: 'slot',
    hideColon: true
  }]
}, {
  label: '其他信息',
  items: [{
    name: '是否启用网点',
    fieldName: 'enabled_txt'
  }, {
    name: '充电桩描述',
    fieldName: 'stationIntro'
  }, {
    name: '创建人',
    fieldName: 'createdBy'
  }, {
    name: '创建时间',
    fieldName: 'createdOn_txt'
  }, {
    name: '最后修改人',
    fieldName: 'modifiedBy'
  }, {
    name: '最后修改时间',
    fieldName: 'modifiedOn'
  }]
}
]
