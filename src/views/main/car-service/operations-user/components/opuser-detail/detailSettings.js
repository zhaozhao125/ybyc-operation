export default [{
  label: '',
  items: [{
    label: '编号',
    value: 'sn'
  }, {
    label: '姓名',
    value: 'name'
  }, {
    label: '手机号',
    value: 'mobile'
  }, {
    label: '角色',
    value: 'roleName'
  }, {
    label: '运维城市',
    value: 'areaName'
  }, {
    label: '发单网点',
    value: 'userStations.stationName',
    divider: '、',
    autoHide: true
  },{
    label: '发单片区',
    value: 'userDistricts.districtName',
    divider: '、',
    autoHide: true
  }, {
    label: '接单网点',
    value: 'userAcceptStations.stationName',
    divider: '、',
    autoHide: true
  }, {
    label: '接单片区',
    value: 'userAcceptDistricts.districtName',
    divider: '、',
    autoHide: true
  },{
    label: '状态',
    value: 'ready',
    map: {
      true: '开工',
      false: '收工'
    }
  }, {
    label: '是否可用',
    value: 'enabled',
    map: {
      true: '可用',
      false: '禁用'
    }
  }, {
    label: '创建时间',
    value: 'createTime',
    type: 'time'
  }, {
    label: '修改时间',
    value: 'modifyTime',
    type: 'time'
  }]
}]
