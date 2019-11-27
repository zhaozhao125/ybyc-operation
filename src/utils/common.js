import axios from 'axios'
import baseUrl from '@/config/base-url'
import store from '@/store/'
import dayjs from 'dayjs'
import { Message } from 'element-ui'

export const $local = {
  set: function set (name, value) {
    let data = localStorage.getItem(name)
    if (!data) {
      data = []
    } else {
      data = JSON.parse(data)
    }
    data.unshift({
      value,
      date: Date.now()
    })
    localStorage.setItem(name, JSON.stringify(data))
  },

  get: function get (name) {
    let data = localStorage.getItem(name)
    if (data) {
      return JSON.parse(data)
    } else {
      return []
    }
  }
}
// 文件下载函数
export const download = ((fileName, data, needAppendDate = true) => {
  var a = document.createElement('a')
  a.className = 'only-for-download'
  a.style.display = 'none'
  document.body.appendChild(a)
  return function (fileName, data) {
    var url = window.URL.createObjectURL(data)
    a.href = url
    if (needAppendDate) {
      let tmpName = fileName.split('.')
      tmpName[tmpName.length - 2] =
        tmpName[tmpName.length - 2] + '-' + dayjs().format('YYYYMMDDHHmmss')
      fileName = tmpName.join('.')
    }
    a.download = fileName
    a.click()
    window.URL.revokeObjectURL(url)
  }
})()

const Axios = axios.create({
  baseURL: baseUrl || '/',
  timeout: 120000,
  responseType: 'blob',
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
})

Axios.interceptors.request.use(
  config => {
    config.headers.accessToken = store.getters.token
    return config
  },
  error => {
    Message({
      message: error,
      type: 'warning'
    })
    return Promise.reject(error)
  }
)

/**
 * ajax异步下载
 * @param {String} url 请求URL
 * @param {String} method 请求方式get/post
 * @param {Object} params 请求参数
 * @param {String} fileName 下载文件名
 * @param {Object} requestConfig 其他配置，如是否添加默认城市ID
 * requestConfig示例：{
 *  defaultCity: {
 *    name: 'cityId' // 下载时城市ID参数名
 *  }
 * }
 */
export const downloadAjax = (
  url,
  method = 'get',
  params,
  fileName,
  requestConfig
) => {
  let accessToken = store.getters.token
  if (!accessToken) {
    return new Promise((resolve, reject) => {
      reject(new Error('获取不到accessToken'))
    })
  }
  let option = {
    method: method,
    url: url
  }
  if (requestConfig) {
    // 设置默认城市ID
    if (requestConfig.defaultCity) {
      if (!params) {
        params = {}
      }
      if (params[requestConfig.defaultCity.name] === undefined) {
        params[requestConfig.defaultCity.name] = store.getters.defaultCityId
      }
      console.log(
        '====params[requestConfig.defaultCity.name]====',
        params[requestConfig.defaultCity.name]
      )
      if (params[requestConfig.defaultCity.name] == 999) {
        // 如果是全部的话就不传参数
        delete params[requestConfig.defaultCity.name]
      }
    }
  }
  if (method == 'get') {
    option.params = params
  } else {
    option.data = params
  }
  Message({
    message: '正在请求下载数据，请稍后',
    type: 'info'
  })
  return Axios(option)
    .then(res => {
      download(fileName, res.data)
    })
    .catch(err => {
      console.dir(err)
      Message({
        message: '下载出错，请检查网络设置，或稍后再试',
        type: 'error'
      })
    })
}
// 处理搜索时间
export const handleSearchTime = searchObj => {
  if (searchObj.time) {
    searchObj.startDate = String(
      Math.floor(Date.parse(searchObj.time[0]) / 1000)
    )
    searchObj.endDate = String(Math.floor(Date.parse(searchObj.time[1]) / 1000))
  } else {
    searchObj.startDate = null
    searchObj.endDate = null
  }
}
// 处理搜索城市
export const handleSearchCity = searchObj => {
  searchObj.city
    ? (searchObj.cityId = searchObj.city[1])
    : (searchObj.cityId = null)
}
// 处理字典数据
export const handleDictData = distData => {
  let modelsArr = []

  Object.keys(distData).forEach(key => {
    modelsArr.push(distData[key])
  })
  let modelSelect = modelsArr.map((item, index) => {
    return {
      label: item,
      value: Object.keys(distData)[index]
    }
  })
  return modelSelect
}
// 处理字地区数据
export const handleDistCityList = cityData => {
  let allCityList = []
  cityData.forEach(item => {
    let cityList = item.cityList.map(cityItem => {
      return {
        label: cityItem.name,
        value: cityItem.cityCode
      }
    })
    allCityList.push(...cityList)
  })
  return allCityList
}

// 处理下拉列表数据
export const resultSelectData = data => {
  return data.map(item => {
    return {
      value: item.id,
      label: item.name,
      sn: item.sn
    }
  })
}
// 远程禁用选项
export const disabledResultSelectData = data => {
  return data.map(item => {
    return {
      value: item.id,
      label: item.name,
      disabled: item.disabled
    }
  })
}

export const getStatusByDict = (dict, value) => {
  if (dict && dict.length) {
    let ret = dict.find(item => item.value == value)
    if (ret) {
      return ret.label
    }
  }
  return '-'
}

// 处理添加编辑数据
// 有问题
export const handleSubmit = (submitData, copyData) => {
  let submitObj = {}
  Object.keys(submitData).forEach(item => {
    if (submitData[item] == copyData[item]) {
    } else {
      submitObj[item] = submitData[item]
    }
  })
  return submitObj
}
// 标准时间转换成时间戳
export function handleData (date) {
  if (date) {
    return date.getTime() / 1000
  }
}
// 处理提交的搜索数据
export const handleSubmitSearchData = searchObj => {
  // 处理时间
  if (searchObj.time && searchObj.time.length) {
    searchObj.startDate = handleData(searchObj.time[0])
    searchObj.endDate = handleData(searchObj.time[1])
  }
  delete searchObj.time
  let obj = {}
  // console.log(Object.keys(searchObj))
  Object.keys(searchObj).forEach(searchItem => {
    if (searchObj[searchItem]) {
      obj[searchItem] = searchObj[searchItem]
    }
  })
  return obj
}
// 处理绘制的数组数据
export const handlePolygonArr = polygonArr => {
  return polygonArr.map(item => {
    return [item.lng, item.lat]
  })
}
// 处理网点列表和网点德图的网点类型
export const handleWebsiteType = type => {
  switch (type) {
    case 'contract':
      return '合作网点'
    case 'casual':
      return '百步亭'
    default:
      return ''
  }
}
export const getRentStatus = ['空闲', '已预约', '已租', '维护中']

export const getCarStateStyle = state => {
  switch (state) {
    case 0:
      return 'state-leisure'
    case 1:
      return 'state-already'
    case 2:
      return 'state-rent'
    case 3:
      return 'state-maintain'
  }
}
// 颜色状态
export const statueMapDotColor = {
  tbox: '#5badff',
  soc: '#FF6547',
  idle: '#96C840',
  location: '#4E4E4E',
  behavior: '#FDD000'
}

export const groupStyleMap = dotName => {
  return {
    pointStyle: {
      width: 20,
      height: 20,
      offset: ['-50%', '-50%'],
      fillStyle: statueMapDotColor[dotName]
    }
  }
}
// 网点图标文案
export const getStationIconText = data => {
  if (data.typeCode) {
    if (data.typeCode === 'casual') {
      return '百步亭'
    } else {
      return data.timeSharingStation && data.longRentStation
        ? '全时'
        : data.timeSharingStation
          ? '分时'
          : '短租'
    }
  } else {
    return ''
  }
}
export const hashCode = str => {
  let hash = 0
  let i
  let chr
  if (str.length === 0) return hash
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i)
    hash = (hash << 5) - hash + chr
    hash |= 0 // Convert to 32bit integer
  }
  return Math.abs(hash)
}
