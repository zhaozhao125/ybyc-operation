export default [{
  label: '',
  items: [{
    label: '姓名',
    value: 'userInfo.name'
  }, {
    label: '手机号',
    value: 'userInfo.mobile'
  }, {
    label: '城市',
    value: 'userInfo.areaName'
  }, {
    label: '片区',
    type: 'slot',
    name: 'district'
  }]
}]
