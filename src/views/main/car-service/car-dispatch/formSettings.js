export default [
  {
    items: [
      {
        label: '车牌号',
        name: 'carNumber',
        type: 'text',
        disabled: true
      },
      {
        label: '工单类型',
        name: 'taskType',
        type: 'select',
        options: [
          {
            label: '清洁单',
            value: 'clean_car'
          },
          {
            label: '充电单',
            value: 'charge_car'
          },
          {
            label: '调度单',
            value: 'dispatch_car'
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
        events: {
          change: 'typeChange'
        },
        required: true
      },
      {
        label: '调度原因',
        name: 'dispatchReason',
        type: 'radio',
        options: [
          {
            label: '充电',
            value: 'charge'
          },
          {
            label: '百步亭',
            value: 'baibuting'
          },
          {
            label: '超载调走',
            value: 'overload'
          },
          {
            label: '缺车调入',
            value: 'lack_car'
          },
          {
            label: '工具车',
            value: 'tool_car'
          },
          {
            label: '排车',
            value: 'short_rent_car'
          },
          {
            label: '维修',
            value: 'repair'
          },
          {
            label: '其他',
            value: 'other'
          }
        ],
        // type: 'slot',
        required: true,
        hidden: true
      },
      {
        label: '清洁类型',
        name: 'cleanTaskType',
        type: 'radio',
        options: [
          {
            label: '车内',
            value: 'inside'
          },
          {
            label: '车外',
            value: 'outside'
          },
          {
            label: '全车',
            value: 'allCar'
          }
        ],
        // type: 'slot',
        required: true,
        hidden: true
      },
      {
        label: '选择网点',
        name: 'destinationStationId',
        type: 'slot',
        required: true,
        hidden: true
      },
      {
        label: '故障类型',
        name: 'repairTypes',
        type: 'slot',
        value: [],
        required: true,
        hidden: true
      },
      {
        label: '物料类型',
        name: 'materielTypes',
        type: 'slot',
        value: [],
        required: true,
        hidden: true
      },
      {
        label: '优先级',
        name: 'priority',
        type: 'radio',
        options: [
          {
            label: '一般',
            value: 5
          },
          {
            label: '紧急',
            value: 7
          }
        ],
        value: 5,
        required: true
      },
      {
        label: '分发类型',
        name: 'distributeType',
        type: 'radio',
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
        value: 'assign_task',
        events: {
          change: 'changDistributeType'
        },
        required: true
      },
      {
        label: '指派人',
        name: 'executorUserSn',
        type: 'slot',
        required: true
      },
      {
        label: '工单描述',
        name: 'taskMsg',
        type: 'textarea'
      },
      {
        label: '上传照片',
        name: 'images',
        type: 'img',
        limit: 6,
        tip: '最多只能上传6张照片'
      }
    ]
  }
]
