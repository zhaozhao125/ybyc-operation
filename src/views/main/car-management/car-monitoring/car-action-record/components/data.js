import { sourceOperating } from '@/config/select-data'
export const searchSettings = [
  {
    label: '搜索',
    name: 'keyWords',
    type: 'autocomplete',
    placeholder: '请输入车牌号',
    visible: true,
    data: []
  },
  {
    label: '操作来源',
    name: 'userType',
    type: 'select',
    visible: true,
    options: sourceOperating
  },
  {
    label: '操作类型',
    name: 'actionName',
    type: 'select',
    options: [
      {
        label: '租车',
        value: 'rent'
      },
      {
        label: '还车',
        value: 'repay'
      },
      {
        label: '预约',
        value: 'subscribe'
      },
      {
        label: '取消预约',
        value: 'unsubscribe'
      },
      {
        label: '开门',
        value: 'unlock'
      },
      {
        label: '关门',
        value: 'lock'
      },
      {
        label: '寻车',
        value: 'find'
      },
      {
        label: '设置故障',
        value: 'unrentable'
      },
      {
        label: '设置空闲',
        value: 'rentable'
      },
      {
        label: '重启终端',
        value: 'reboot'
      },
      {
        label: '给动力',
        value: 'power'
      },
      {
        label: '断动力',
        value: 'unpower'
      },
      {
        label: '清空运维卡',
        value: 'cleanCard'
      },
      {
        label: '开始运维',
        value: 'maintain'
      },
      {
        label: '结束运维',
        value: 'unmaintain'
      },
      {
        label: '运维准备',
        value: 'preMaintain'
      },
      {
        label: '运维开始',
        value: 'postMaintain'
      },
      {
        label: '运维交车',
        value: 'preUnmaintain'
      },
      {
        label: '运维完成',
        value: 'postUnmaintain'
      },
      {
        label: '蓝牙开门',
        value: 'btUnlock'
      },
      {
        label: '蓝牙关门',
        value: 'btLock'
      },
      {
        label: '蓝牙给动力',
        value: 'btPower'
      },
      {
        label: '获取蓝牙信息',
        value: 'getBluetoothKey'
      }
    ]
  },
  {
    label: '操作时间',
    name: 'time',
    type: 'daterange'
  }
]
