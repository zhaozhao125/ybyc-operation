export default {
  methods: {
    packingOPen(list) {
      list.map(ele => {
        if (ele.isEnable === 1) {
          ele.isEnable = true
        } else {
          ele.isEnable = false
        }
      })
    },
    packingStatusChange(val) {
      switch (val) {
        case 0:
          return '无车'
        case 1:
          return '有车'
        case 2:
          return '未知'
        case 3:
          return '故障'
        default:
          return ''
      }
    },
    packingTypeChange(val) {
      switch (val) {
        case 0:
          return '分时租赁'
        default:
          return ''
      }
    },
    lockStatusChange(val) {
      switch (val) {
        case 0:
          return '已降下'
        case 1:
          return '已升起'
        case 2:
          return '故障'
        case 3:
          return '已锁车'
        case 4:
          return '已休眠'
        case 5:
          return '未知'
        case 6:
          return '离网'
        default:
          return ''
      }
    },
    ownerChange(val) {
      switch (val) {
        case 'YB':
          return '一步用车'
        default:
          return ''
      }
    },
    lockName(val) {
      switch (val) {
        case 'WI':
          return '慧泊金'
        default:
          return ''
      }
    }
  }
}
