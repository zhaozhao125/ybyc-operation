export default [
  {
    label: '基本信息',
    items: [
      {
        label: '工单编号',
        value: 'sn'
      },
      {
        label: '车牌号',
        type: 'slot',
        name: 'carNumber'
      },
      {
        label: '工单类型',
        type: 'slot',
        name: 'taskType'
      },
      // {
      //   label: '充电订单编号',
      //   type: 'slot',
      //   name: 'relationChargeOrderSn',
      //   value: 'relationChargeOrderSn',
      //   autoHide: true
      // },
      {
        label: '调度原因',
        value: 'dispatchReason',
        autoHide: true
      },
      {
        label: '工分',
        value: 'taskScore',
        // autoHide: true
      },
      {
        label: '清洁类型',
        value: 'cleanTaskType',
        autoHide: true
      },
      {
        label: '维修类型',
        value: 'repairTypes.name',
        autoHide: true,
        divider: '、'
      },
      {
        label: '补料类型',
        value: 'materielTypes.name',
        autoHide: true,
        divider: '、'
      },
      {
        label: '分发类型',
        type: 'slot',
        name: 'distributeType'
      },
      {
        label: '工单状态',
        value: 'taskStatus'
      },
      {
        label: '优先级',
        value: 'priority'
      },
      // {
      //   label: '运维交车',
      //   value: 'returnCarType',
      //   autoHide: true
      // },
      // {
      //   label: '处理人',
      //   type: 'slot',
      //   name: 'executorUserName'
      // },
      // {
      //   label: '发起人电话',
      //   value: 'authorMobile'
      // },
      {
        label: '创建方式',
        value: 'sourceType'
      },
      // {
      //   label: '起始网点',
      //   // value: 'startStationName',

      //   type: 'slot',
      //   name: 'startStationName'
      // },
      // {
      //   label: '结束网点',
      //   value: 'endStationName'
      // },
      // {
      //   label: '目的网点',
      //   value: 'destStationName',
      //   autoHide: true
      // },
      // {
      //   label: '运维距离',
      //   value: 'maintainDistance'
      // },
      // {
      //   label: '起始电量',
      //   value: 'startSoc',
      //   append: '%'
      // },
      // {
      //   label: '结束电量',
      //   value: 'endSoc',
      //   append: '%'
      // },
      // {
      //   label: '分发耗时',
      //   value: 'dispatchElapseTime'
      // },
      // {
      //   label: '处理耗时',
      //   value: 'elapsedTime'
      // },
      // {
      //   label: '标准工时',
      //   value: 'normalDuration'
      // },
      // {
      //   label: '异常工单',
      //   value: 'exception',
      //   type: 'slot',
      //   name: 'exception'
      // },
      // {
      //   label: '异常原因',
      //   value: 'exceptionTaskType',
      //   autoHide: true
      // },
      {
        label: '工单描述',
        value: 'taskMsg'
      },
      {
        label: '照片',
        value: 'images',
        type: 'image'
      }
    ]
  },
  {
    label: '车辆信息',
    items: [
      {
        label: '起始网点',
        // value: 'startStationName',

        type: 'slot',
        name: 'startStationName'
      },
      {
        label: '结束网点',
        value: 'endStationName'
      },
      {
        label: '目的网点',
        value: 'destStationName',
        autoHide: true
      },
      {
        label: '运维距离',
        value: 'maintainDistance'
      },
      {
        label: '起始电量',
        value: 'startSoc',
        append: '%'
      },
      {
        label: '结束电量',
        value: 'endSoc',
        append: '%'
      }
    ]
  },
  {
    label: '处理信息',
    items: [
      {
        label: '处理人',
        type: 'slot',
        name: 'executorUserName'
      },
      {
        label: '运维交车',
        value: 'returnCarType',
        autoHide: true
      },
      {
        label: '分发耗时',
        value: 'dispatchElapseTime'
      },
      {
        label: '处理耗时',
        value: 'elapsedTime'
      },
      {
        label: '标准工时',
        value: 'normalDuration'
      },
      {
        label: '异常工单',
        value: 'exception',
        type: 'slot',
        name: 'exception'
      },
      {
        label: '异常原因',
        value: 'exceptionTaskType',
        autoHide: true
      }
    ]
  },
  {
    label: '其他信息',
    items: [
      {
        label: '发起人电话',
        value: 'authorMobile'
      },
      {
        label: '充电订单编号',
        type: 'slot',
        name: 'relationChargeOrderSn',
        value: 'relationChargeOrderSn',
        autoHide: true
      }
    ]
  }
]
