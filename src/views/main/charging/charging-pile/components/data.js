// 搜索
export const searchSettings = [
  {
    type: 'labelSelectText',
    placeholder: '请输入',
    visible: true,
    optionValue: 'sn',
    options: [
      {
        value: 'sn',
        label: '桩编号'
      },
      {
        value: 'hardAddress',
        label: '桩硬件地址'
      }
    ]
  },
  {
    label: '接口状态',
    name: 'connectorStatus',
    type: 'select',
    changeOnSelect: true,
    visible: true,
    options: [
      {
        value: 'IDLE',
        label: '空闲'
      },
      {
        value: 'USED_UNCHARGE',
        label: '占用未充电'
      },
      {
        value: 'USED_CHARGING',
        label: '充电中'
      },
      {
        value: 'PARKING',
        label: '待拔枪'
      },
      {
        value: 'ERROR',
        label: '故障'
      },
      {
        value: 'OFFLINE',
        label: '离线'
      }
    ]
  },
  {
    label: '城市',
    name: 'cityId',
    type: 'remoteCity',
    visible: false
  },
  {
    label: '充电桩类型',
    name: 'equipmentModelId',
    type: 'select',
    changeOnSelect: true,
    visible: false,
    options: []
  },
  {
    label: '运营商',
    name: 'operator',
    type: 'select',
    changeOnSelect: true,
    visible: false,
    options: [
      {
        value: 'YB',
        label: '一步车电'
      },
      {
        value: 'TLD',
        label: '特来电'
      },
      {
        value: 'YD',
        label: '一电'
      }
    ]
  },
  {
    label: '设备商',
    name: 'device',
    type: 'select',
    changeOnSelect: true,
    visible: false,
    options: [
      {
        value: 'JD',
        label: '洁电'
      },
      {
        value: 'TLD',
        label: '特来电'
      },
      {
        value: 'YD',
        label: '一电'
      },
      {
        value: 'EN',
        label: '驿普乐氏'
      }
    ]
  },
  {
    label: '在线状态',
    name: 'online',
    type: 'select',
    changeOnSelect: true,
    visible: false,
    options: [
      {
        value: true,
        label: '在线'
      },
      {
        value: 'false',
        label: '离线'
      }
    ]
  },
  {
    label: '站点名称',
    name: 'stationId',
    visible: false,
    type: 'slot'
  },
  {
    label: '添加时间',
    visible: false,
    name: 'addTime',
    type: 'daterange'
    // unixTime: true
    // 直接转成时间戳
    // unixTime: true
  }
]
// 详情页
export const detailSettings = [
  {
    label: '基本信息',
    items: [
      {
        label: '充电桩编号',
        name: 'sn',
        type: 'slot'
      },
      {
        label: '充电桩名称',
        value: 'equipmentName'
      },
      {
        label: '接口状态',
        name: 'status',
        type: 'slot'
      },
      {
        label: '桩硬件地址',
        value: 'hardAddress'
      },
      {
        label: '运营商',
        value: 'operatorName'
      },
      {
        label: '运营商桩编号',
        value: 'operatorEquipmentId'
      },
      {
        label: '设备商',
        value: 'deviceName'
      },
      {
        label: '桩类型',
        value: 'equipmentModelName'
      },
    ]
  },
  {
    label: '创建信息',
    items: [
      {
        label: '创建人',
        value: 'createdBy'
      },
      {
        label: '创建时间',
        value: 'createdOn',
        type: 'time'
      },
      {
        label: '桩来源',
        value: 'equipmentSource'
      },
      {
        label: '描述',
        value: 'description'
      }
    ]
  }
]
