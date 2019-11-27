import { handleDate } from '@/utils/date-filter'
export default {
  methods: {
    searchTimeChange (timeParams) {
      let result =
        timeParams.createdTime ||
        timeParams.takeTime ||
        timeParams.returnTime ||
        timeParams.settleTime ||
        timeParams.finishTime ||
        timeParams.expectTakeTime
      if (result) {
        for (let key in timeParams) {
          if (
            timeParams[key].length > 0 &&
            typeof timeParams[key] === 'object'
          ) {
            timeParams.dateMin = handleDate(timeParams[key][0], 'day')
            timeParams.dateMax = handleDate(timeParams[key][1], 'day')
            timeParams.dateKey = key
            delete timeParams[key]
          }
        }
        return timeParams
      } else {
        return timeParams
      }
    },
    searchUserChange (type) {
      let resoult =
        type.userPhone || type.carNumber || type.userName || type.orderSn
      if (resoult) {
        for (let key in type) {
          if (type[key] === resoult) {
            type.key = key
            type.value = type[key]
            delete type[key]
          }
        }
        return type
      } else {
        return type
      }
    },
    pictureChange (list) {
      let resoult = {
        images: [],
        imagesImgDescription: []
      }
      // const m = new Map()
      list.forEach(ele => {
        switch (ele.key) {
          case 'left_front':
            // m.set(ele.key, { key: '左前45°', url: ele.url })
            ele.key = '左前45°'
            break
          case 'right_front':
            // m.set(ele.key, { key: '右前45°', url: ele.url })
            ele.key = '右前45°'
            break
          case 'front_row':
            // m.set(ele.key, { key: '前排', url: ele.url })
            ele.key = '前排'
            break
          case 'back_row':
            // m.set(ele.key, { key: '后排', url: ele.url })
            ele.key = '后排'
            break
          case 'center_back':
            // m.set(ele.key, { key: '正后方', url: ele.url })
            ele.key = '正后方'
            break
          case 'other':
            // m.set(ele.key, { key: '其他位置或特写', url: ele.url })
            ele.key = '其他位置或特写'
            break
        }
        if (ele && ele.url) {
          resoult.images.push(ele.url)
          resoult.imagesImgDescription.push(ele.key)
        }
      })
      // let mapList = [
      //   m.get('left_front'),
      //   m.get('right_front'),
      //   m.get('front_row'),
      //   m.get('back_row'),
      //   m.get('center_back'),
      //   m.get('other')
      // ]
      // mapList.forEach(ele => {
      //   if (ele && ele.url) {
      //     resoult.images.push(ele.url)
      //     resoult.imagesImgDescription.push(ele.key)
      //   }
      // })
      return resoult
    }
  }
}
