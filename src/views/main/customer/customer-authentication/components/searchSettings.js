export default [{
  type: 'labelSelectText',
  placeholder: '请输入',
  name: 'selectText',
  optionValue: 'userPhone',
  options: [{
    label: '手机号',
    value: 'userPhone'
  }, {
    label: '用户姓名',
    value: 'userName'
  }],
  visible: true
}, {
  label: '审核状态',
  name: 'checkDataStatus',
  type: 'select',
  default: '2',
  options: [{
    label: '未上传资料',
    value: '-1'
  }, {
    label: '待审核',
    value: '2'
  }, {
    label: '审核通过',
    value: '1'
  }, {
    label: '审核不通过',
    value: '0'
  }],
  visible: true
}, {
  type: 'labelSelectCity',
  placeholder: '请选择',
  name: 'selectCity',
  optionValue: 'cityId',
  options: [{
    label: '注册城市',
    value: 'cityId'
  }, {
    label: '所属城市',
    value: 'cityIdBelongTo'
  }],
  enableAuth: true
}, {
  label: '审核方式',
  name: 'autoAuditFlag',
  type: 'select',
  placeholder: '请选择',
  options: [{
    label: '系统审核',
    value: '1'
  }, {
    label: '人工审核',
    value: '0'
  }]
}, {
  label: '审核人',
  name: 'auditAdminName',
  type: 'select',
  placeholder: '请选择',
  options: [{
    label: '岳文清',
    value: 'yuewenqing'
  }, {
    label: '李蔓晴',
    value: 'limanqing'
  }, {
    label: '崔宁',
    value: 'cuining'
  }, {
    label: '王欢欢',
    value: 'wanghuanhuan'
  }, {
    label: '张昊杰',
    value: 'zhanghaojie'
  }, {
    label: '房雯雯',
    value: 'fangwenwen'
  }, {
    label: '刘瑞',
    value: 'liurui'
  }, {
    label: '董焱',
    value: 'dongyan'
  }, {
    label: '汪向南',
    value: 'wangxiangnan'
  }, {
    label: '刘玉龙',
    value: 'liuyulong'
  }, {
    label: '杨京亚',
    value: 'yangjingya'
  }, {
    label: '杨潘潘',
    value: 'yangpanpan'
  } ]
}, {
  type: 'labelSelectDateRange',
  placeholder: '请选择时间',
  name: 'selectDate',
  optionValue: 'userUploadTime',
  options: [{
    label: '提交审核时间',
    value: 'userUploadTime'
  }, {
    label: '审核通过时间',
    value: 'disposeTime'
  }]
}]
