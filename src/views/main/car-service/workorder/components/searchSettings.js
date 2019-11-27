export default [
  {
    label: '搜索',
    name: 'selectText',
    type: 'labelSelectText',
    placeholder: '请输入',
    optionValue: 'carNumber',
    options: [
      {
        label: '车牌号',
        value: 'carNumber'
      },
      {
        label: '处理人',
        value: 'executorUserName'
      },
      {
        label: '处理人电话',
        value: 'executorUserMobile'
      },
      {
        label: '验收人',
        value: 'verifierUserCnName'
      },
      {
        label: '工单编号',
        value: 'sn'
      }
    ],
    visible: true
  },
  {
    label: '城市',
    name: 'cityId',
    type: 'remoteCity',
    visible: true
  },
  {
    label: '工单类型',
    name: 'taskTypes',
    type: 'select',
    placeholder: '不限',
    multiple: true,
    options: [
      {
        label: '清洁单',
        value: 'clean_car'
      },
      {
        label: '调度单',
        value: 'dispatch_car'
      },
      {
        label: '充电单',
        value: 'charge_car'
      },
      {
        label: '维修单',
        value: 'repair_car'
      },
      {
        label: '补料单',
        value: 'lack_materiel'
      },
      {
        label: '巡检单',
        value: 'inspection'
      }
    ],
    visible: false
  },
  {
    label: '工单状态',
    name: 'status',
    type: 'select',
    placeholder: '不限',
    options: [
      {
        label: '待分发',
        value: 'create'
      },
      {
        label: '待处理',
        value: 'dealing'
      },
      {
        label: '待验证',
        value: 'waiting_verity'
      },
      {
        label: '已完成',
        value: 'finish'
      },
      {
        label: '已关闭',
        value: 'closed'
      }
    ]
  },
  {
    label: '工单来源',
    name: 'taskSource',
    type: 'select',
    placeholder: '不限',
    options: [
      {
        label: '系统自动创建',
        value: 'auto'
      },
      {
        label: '后台创建',
        value: 'optimus_admin'
      },
      {
        label: '车服用户创建',
        value: 'cs_admin'
      }
    ],
    visible: false
  },
  {
    label: '分发类型',
    name: 'distributeType',
    type: 'select',
    placeholder: '不限',
    options: [
      {
        label: '指派',
        value: 'assign_task'
      },
      {
        label: '抢单',
        value: 'grab_task'
      }
    ],
    visible: false
  },
  {
    label: '异常工单',
    name: 'exceptionTask',
    type: 'select',
    placeholder: '不限',
    options: [
      {
        label: '是',
        value: true
      },
      {
        label: '否',
        value: false
      }
    ],
    visible: false
  },
  // {
  //   label: '创建时间',
  //   name: 'createTime',
  //   type: 'daterange',
  //   unixTime: true
  // },
  {
    label: '创建时间',
    name: 'time',
    type: 'labelSelectDateRange',
    optionValue: 'createTime',
    options: [
      {
        value: 'createTime',
        label: '创建时间'
      },
      {
        value: 'verifyTime',
        label: '验收时间'
      }
    ]
    // unixTime: true
    // 直接转成时间戳
    // unixTime: true
  }
  // {
  //   label: '验收时间',
  //   name: 'verifyTime',
  //   type: 'daterange',
  //   unixTime: true
  // }
]
