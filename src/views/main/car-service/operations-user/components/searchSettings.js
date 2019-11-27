export default [{
  label: '搜索',
  name: 'selectText',
  type: 'labelSelectText',
  placeholder: '请输入',
  visible: true,
  optionValue: 'mobile',
  options: [{
    label: '手机号码',
    value: 'mobile'
  }, {
    label: '姓名',
    value: 'name'
  }, {
    label: '用户编号',
    value: 'sn'
  }]
}, {
  label: '城市',
  name: 'areaId',
  type: 'remoteCity',
  events: {
    change: 'changeCity'
  },
  visible: true
}, {
  label: '发单片区',
  name: 'districtId',
  type: 'slot',
  visible: false
}, {
  label: '发单网点',
  name: 'stationId',
  type: 'slot',
  visible: false
}, {
  label: '用户角色',
  type: 'remoteCarServiceRole',
  placeholder: '请选择',
  name: 'roleId',
  // label: '角色',
  // name: 'userType',
  // type: 'select',
  // placeholder: '不限',
  // options: [{
  //   label: '运维人员',
  //   value: 'OFFICIAL'
  // }, {
  //   label: '网点负责人',
  //   value: 'STATION'
  // }, {
  //   label: '众包人员',
  //   value: 'UNOFFICIAL'
  // }],
  visible: false
}, {
  label: '添加时间',
  name: 'createTime',
  type: 'daterange',
  unixTime: true
}]
