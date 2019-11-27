// 车型列表
export const carModelList = [
  {
    label: '2016款知豆D1',
    value: '2016zdd1'
  },
  {
    label: '江淮iEV4',
    value: '2016zdssd2'
  },
  {
    label: '海马爱尚EV',
    value: '2016zdssd3'
  }
]

// 租赁方式
export const carRentList = [
  {
    label: '分时',
    value: 1
  },
  {
    label: '短/长租',
    value: 3
  }
]
export const carTypeList = [
  {
    label: '一步用车',
    value: 1
  },
  {
    label: '加盟商',
    value: 4,
    children: [
      {
        label: '加盟商1',
        value: 2
      },
      {
        label: '加盟商2',
        value: 3
      }
    ]
  }
]
export const addCarTypeList = [
  {
    label: '一步用车',
    value: 0
  },
  {
    label: '加盟商1',
    value: 1
  },
  {
    label: '加盟商2',
    value: 2
  }
]
export const areaList = [
  {
    label: '河南',
    value: 410000,
    children: [
      {
        label: '郑州',
        value: 410100
      },
      {
        label: '洛阳',
        value: 12
      }
    ]
  },
  {
    label: '安徽',
    value: 2,
    children: [
      {
        label: '合肥',
        value: 21
      },
      {
        label: '黄山',
        value: 22
      }
    ]
  }
]

// tbox类型
export const tboxList = [
  {
    label: '类别1',
    value: '1'
  },
  {
    label: '类别2',
    value: '2'
  }
]

// 租赁状态
export const rentStatus = [
  {
    label: '空闲',
    value: '0'
  },
  {
    label: '已预约',
    value: '1'
  },
  {
    label: '已租',
    value: '2'
  },
  {
    label: '维护中',
    value: '3'
  }
]
export const nowStatus = [
  {
    label: '在线',
    value: true
  },
  {
    label: '离线',
    value: false
  }
]
export const sourceOperating = [
  {
    label: '后台',
    value: 'optimus'
  },
  {
    label: '用户APP',
    value: 'payMoney'
  },
  {
    label: '车服APP',
    value: 'makeMoney'
  }
  // {
  //     label: '一步车服app',
  //     value: '3'
  // },
  // {
  //     label: '刷卡',
  //     value: '4'
  // }
]
export const operatingResult = [
  {
    label: '成功',
    value: '0'
  },
  {
    label: '失败',
    value: '1'
  }
]
export const websiteGrade = [
  {
    label: '总部',
    value: 1
  },
  {
    label: '营业点',
    value: 2
  },
  {
    label: '无人点',
    value: 3
  },
  {
    label: '临时点',
    value: 4
  }
]
export const radioBoolean = [
  {
    label: '是',
    value: true
  },
  {
    label: '否',
    value: false
  }
]
