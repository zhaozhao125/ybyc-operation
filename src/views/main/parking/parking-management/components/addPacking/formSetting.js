export default [
  {
    label: '基本信息',
    items: [
      {
        label: '显示编号',
        name: 'parkingShowSn',
        type: 'text',
        required: true,
        placeholder: '请输入3位的车位显示编号（同一个网点下显示编号不能重复）',
        maxlength: 3
      },
      {
        label: '城市',
        name: 'cityId',
        type: 'remoteCity',
        isShowAll: false,
        required: true,
        placeholder: '请选择'
      },
      {
        label: '车位类型',
        name: 'parkingType',
        required: true,
        type: 'select',
        placeholder: '请选择',
        options: [
          {
            label: '分时租赁',
            value: 0
          }
        ],
        events: {
          change: 'packingType'
        }
      },
      {
        label: '所属网点',
        name: 'stationId',
        type: 'slot',
        placeholder: '请输入所属的网点名称'
      },
      {
        label: '所有人',
        name: 'owner',
        type: 'select',
        placeholder: '请选择',
        options: [
          {
            label: '一步用车',
            value: 'YB'
          }
        ]
      }
    ]
  },
  {
    label: '设备信息',
    items: [
      {
        label: '设备商',
        name: 'lockEquipmentOperator',
        type: 'select',
        required: true,
        placeholder: '请选择',
        options: [
          {
            label: '慧泊金',
            value: 'WI'
          }
        ]
      },
      {
        label: '车位ID',
        name: 'lockSn',
        type: 'text',
        required: true,
        placeholder: '请输入车位ID'
      },
      {
        label: '设备ID',
        name: 'lockEquipmentId',
        type: 'text',
        placeholder: '请输入设备编号'
      },
      {
        label: '设备SN',
        name: 'lockEquipmentSn',
        type: 'text',
        placeholder: '请输入设备SN'
      },
      {
        label: 'HUB编号',
        name: 'hubSn',
        type: 'text',
        placeholder: '请输入HUB编号'
      }
    ]
  },
  {
    label: '',
    items: [
      {
        label: '是否启用',
        name: 'isEnable',
        type: 'switch',
        activeColor: 'rgb(19, 206, 102)',
        inactiveColor: 'rgb(220, 223, 230)',
        activeValue: 1,
        inactiveValue: 0,
        events: {
          change: 'isOpen'
        }
      }
    ]
  }
]
