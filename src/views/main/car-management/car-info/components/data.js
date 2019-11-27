import { carRentList } from '@/config/select-data'
// 搜索
export const searchSettings = [
  {
    label: '搜索',
    name: 'keyWords',
    type: 'autocomplete',
    placeholder: '请输入车牌号/原车牌号/车架号',
    visible: true,
    data: []
  },
  {
    label: '运营城市',
    name: 'cityId',
    type: 'remoteCity',
    visible: true
  },
  {
    label: '运营状态',
    name: 'businessStatus',
    type: 'select',
    placeholder: '请选择',
    options: [
      {
        label: '未上线',
        value: 100
      },
      {
        label: '运营中',
        value: 200
      },
      {
        label: '维保整备',
        value: 300
      },
      {
        label: '已下线',
        value: 400
      }
    ]
  },
  // {
  //   label: '运营状态',
  //   name: 'optimusTypes',
  //   type: 'select',
  //   options: carRentList
  // },
  {
    label: '车型',
    name: 'carModelCode',
    type: 'select',
    options: []
  },
  {
    label: '车辆属性',
    name: 'ownerId',
    type: 'select',
    changeOnSelect: true,
    options: []
  },
  {
    label: '租赁类型',
    name: 'rentTypeCode',
    type: 'select',
    options: carRentList
  },
  // {
  //   label: '是否启用',
  //   name: 'open',
  //   type: 'select'
  // },
  {
    label: '添加时间',
    name: 'time',
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
        name: '车辆编号',
        fieldName: 'carSn'
      },
      {
        name: '车牌号',
        fieldName: 'carNumber'
      },
      {
        name: '所属车型',
        fieldName: 'carModelName'
      },
      {
        name: '租赁类型',
        fieldName: 'rentTypeCode',
        type: 'slot'
      },
      {
        name: '城市',
        fieldName: 'area',
        type: 'slot'
      },
      {
        name: '车架号',
        fieldName: 'vin'
      },
      {
        name: '发动机号',
        fieldName: 'carEngineNumber'
      },
      {
        name: '车贴',
        fieldName: 'carEngineNumber',
        type: 'slot'
      },
      {
        name: '开始使用日期',
        fieldName: 'useDate',
        type: 'time'
      },
      {
        name: '所属网点',
        fieldName: 'association'
      }
    ]
  },
  {
    label: 'tbox信息',
    items: [
      {
        name: 'tbox类别',
        fieldName: 'tboxTypeName'
      },
      {
        name: 'tbox设备号',
        fieldName: 'tboxSimNumber'
      },
      {
        name: 'tbox sim卡号',
        fieldName: 'carTableSimNumber'
      }
    ]
  },
  {
    label: '审计信息',
    items: [
      {
        name: '创建人',
        fieldName: 'createdBy'
      },
      {
        name: '创建时间',
        fieldName: 'createdOn',
        type: 'time'
      },
      {
        name: '修改人',
        fieldName: 'modifiedBy'
      },
      {
        name: '修改时间',
        fieldName: 'modifiedOn',
        type: 'time'
      }
    ]
  }
]
