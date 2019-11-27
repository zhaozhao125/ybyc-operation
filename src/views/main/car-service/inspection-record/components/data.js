import { carModelList, tboxList, addCarTypeList } from '@/config/select-data'

// 搜索
export const searchSettings = [
  {
    name: 'user',
    type: 'labelSelectText',
    placeholder: '请输入',
    visible: true,
    data: [],
    optionValue: 'carNumber',
    options: [
      {
        value: 'carNumber',
        label: '车牌号'
      },
      {
        value: 'mobile',
        label: '手机号'
      },
      {
        value: 'inspectUserName',
        label: '巡检人'
      }
    ]
  },
  {
    label: '城市',
    name: 'cityId',
    type: 'remoteCity',
    visible: true
  },
  {
    label: '处理状态',
    name: 'dealStatus',
    type: 'select',
    changeOnSelect: true,
    options: [
      {
        value: 'waiting_deal',
        label: '待处理'
      },
      {
        value: 'part_finish',
        label: '已处理（部分忽略）'
      },
      {
        value: 'finish',
        label: '已处理（全部通过）'
      }
    ]
  },
  {
    label: '创建时间',
    name: 'time',
    type: 'daterange'
    // unixTime: true
    // 直接转成时间戳
    // unixTime: true
  }
]
