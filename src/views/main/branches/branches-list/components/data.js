import {
  carRentList
} from '@/config/select-data'
export const searchSettings = [{
  type: 'labelSelectText',
  placeholder: '请输入',
  name: 'selectText',
  optionValue: 'name',
  visible: true,
  options: [{
    label: '网点名称',
    value: 'name'
  },
  {
    label: '网点地址',
    value: 'address'
  }
  ]
},
{
  label: '运营城市',
  name: 'operationCityId',
  type: 'remoteCity',
  visible: true,
  events: {
    change: 'changeCity'
  }
},
{
  label: '片区',
  name: 'districtId',
  type: 'slot'
},
{
  label: '租赁类型',
  name: 'rentType',
  type: 'select',
  options: carRentList
},
{
  label: '是否启用',
  name: 'open',
  type: 'select',
  options: [{
    label: '是',
    value: 1
  },
  {
    label: '否',
    value: 0
  }
  ]
},
{
  label: '添加时间',
  name: 'time',
  type: 'daterange'
}
]
// 详情页
export const detailSettings = [{
  label: '基本信息',
  items: [{
    label: '网点名称',
    value: 'name'
  },
  {
    label: '运营城市',
    value: 'operationCityName'
  },
  {
    label: '片区',
    value: 'districtName'
  },
  {
    label: '网点图片',
    value: 'imgs',
    type: 'image'
  },
  {
    label: '还车半径(米)',
    value: 'carOffScope'
  }
  ]
},
{
  label: '营业信息',
  items: [
    {
      label: '网点类型',
      value: 'type',
      type: 'slot'
    },
    {
      label: '',
      value: 'contractBusiness',
      type: 'slot',
      visibleControl: (data) => {
        return data.type === 'contract'
      }
    },
    {
      label: '计费类型',
      value: 'chargeTypeName',
      type: 'slot',
      visibleControl: (data) => {
        return data.type === 'casual'
      }
    },
    {
      label: '调离规则',
      value: 'transferTime',
      type: 'slot',
      visibleControl: (data) => {
        return data.type === 'casual'
      }
    },
    {
      label: '收费规则',
      value: 'chargeRules',
      type: 'slot',
      visibleControl: (data) => {
        return data.type === 'casual'
      }
    },
    {
      label: '还车服务费',
      value: 'returnCarCharge',
      type: 'slot',
      visibleControl: (data) => {
        return data.type === 'casual'
      }
    },
    {
      label: '营业时间',
      value: 'openingHours'
    },
    {
      label: '服务电话',
      value: 'phone'
    },
    {
      label: '物理车位(个)',
      value: 'parkings'
    },
    {
      label: '最小管理车位(个)',
      value: 'parkingsMin'
    },
    {
      label: '最大管理车位(个)',
      value: 'parkingsTop'
    },
    {
      label: '关联充电站',
      value: 'chargingName'
    },
    {
      label: '充电桩',
      value: 'fastPileNum',
      type: 'slot'
    }
  ]
},
{
  label: '地理信息',
  items: [{
    label: '',
    value: 'returnCarPolygon',
    type: 'slot',
    hideColon: true
  },
  {
    label: '经纬度',
    value: 'location',
    type: 'slot'
  },
  {
    label: '地址',
    value: 'address'
  }
  ]
},
{
  label: '业务信息',
  items: [{
    label: '网点负责人',
    value: 'principal'
  },
  {
    label: '网点负责人电话',
    value: 'principalPhone'
  },
  {
    label: '网点开发人',
    value: 'developer'
  }
  ]
},
{
  label: '其他信息',
  items: [{
    label: '是否启用网点',
    value: 'open',
    type: 'slot'
  },
  {
    label: '是否对app用户可见',
    value: 'visible',
    type: 'slot'
  },
  {
    label: '是否开启送车服务',
    value: 'sendCarService',
    type: 'slot'
  },
  {
    label: '网点车辆',
    value: 'websiteCar',
    type: 'slot'
  },
  {
    label: '送车服务金额',
    value: 'sendCarServiceMoney'
  },
  {
    label: '送车服务热线',
    value: 'sendCarServiceTel'
  },
  {
    label: '送车服务时间',
    value: 'sendCarServiceTime'
  },
  {
    label: '送车范围(米)',
    value: 'sendCarServiceRange'
  },
  {
    label: '网点描述',
    value: 'intro'
  },
  {
    label: '网点备注',
    value: 'remark'
  },
  {
    label: '创建人',
    value: 'createdBy'
  },
  {
    label: '创建时间',
    value: 'createdOn'
  },
  {
    label: '最后修改人',
    value: 'modifiedBy'
  },
  {
    label: '最后修改时间',
    value: 'modifiedOn'
  }
  ]
}
]
