export default [{
  items: [{
    label: '车牌号',
    name: 'carNumber',
    type: 'text',
    required: true,
    value:'nj'
  }, {
    label: '工单类型',
    name: 'taskType',
    type: 'select',
    options: [{
      label: '清洁单',
      value: 'clean_car'
    }, {
      label: '充电单',
      value: 'charge_car'
    }, {
      label: '调度单',
      value: 'dispatch_car'
    }, {
      label: '维修单',
      value: 'repair_car'
    }, {
      label: '补料单',
      value: 'lack_materiel'
    }],
    events: {
      change: 'typeChange'
    },
    required: true
  }, {
    label: '选择目的网点',
    name: 'destinationStationId',
    type: 'slot',
    required: true,
    hidden: true
  }, {
    label: '故障类型',
    name: 'repairTypes',
    type: 'slot',
    value: [],
    // options: [{
    //   label: '轮胎故障',
    //   value: 1
    // }, {
    //   label: '充电机故障',
    //   value: 2
    // }, {
    //   label: 'tbox故障',
    //   value: 3
    // }, {
    //   label: '车身故障',
    //   value: 4
    // }, {
    //   label: '零配件故障',
    //   value: 5
    // }, {
    //   label: '空调故障',
    //   value: 6
    // }, {
    //   label: '玻璃故障',
    //   value: 7
    // }, {
    //   label: '事故故障',
    //   value: 8
    // }, {
    //   label: '启动故障',
    //   value: 9
    // }, {
    //   label: '动力电池故障',
    //   value: 10
    // }, {
    //   label: '动力转向系统故障',
    //   value: 11
    // }, {
    //   label: '其他故障',
    //   value: 12
    // }],
    required: true,
    hidden: true
  }, {
    label: '物料类型',
    name: 'materielTypes',
    type: 'slot',
    value: [],
    // options: [{
    //   label: '便携式充电器',
    //   value: 1
    // }, {
    //   label: '30米充电线',
    //   value: 2
    // }, {
    //   label: '10A转16A插座',
    //   value: 3
    // }, {
    //   label: '灭火器',
    //   value: 4
    // }, {
    //   label: '工具包',
    //   value: 5
    // }, {
    //   label: '拖车钩',
    //   value: 6
    // }, {
    //   label: '三脚架',
    //   value: 7
    // }, {
    //   label: '前脚垫',
    //   value: 8
    // }, {
    //   label: '后备箱垫',
    //   value: 9
    // }, {
    //   label: '行驶证',
    //   value: 10
    // }, {
    //   label: '年审标',
    //   value: 11
    // }, {
    //   label: '交强险标',
    //   value: 12
    // }, {
    //   label: '车钥匙',
    //   value: 13
    // }, {
    //   label: '车贴',
    //   value: 14
    // }, {
    //   label: '非保险范围车辆配件',
    //   value: 15
    // }],
    required: true,
    hidden: true
  }, {
    label: '优先级',
    name: 'priority',
    type: 'radio',
    options: [{
      label: '紧急',
      value: 7
    }, {
      label: '一般',
      value: 5
    }],
    value: 5,
    required: true
  }, {
    label: '分发类型',
    name: 'distributeType',
    type: 'radio',
    options: [{
      label: '指派',
      value: 'assign_task'
    }, {
      label: '抢单',
      value: 'grab_task'
    }],
    value: 'grab_task',
    events: {
      change: 'changDistributeType'
    },
    required: true
  }, {
    label: '工单描述',
    name: 'taskMsg',
    type: 'textarea'
  }, {
    label: '图片照片',
    name: 'images',
    type: 'img',
    limit: 6,
    tip: '最多只能上传6张照片'
  }]
}]
