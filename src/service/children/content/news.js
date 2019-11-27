import { fetch } from '@/utils/fetch'
import api from '@/service/api/'
// 新闻列表
const getNewsList = params => {
  return fetch(api.NEWS_API, params, 'get', {})
}
// 新闻状态停用启用
const switchNewsStatus = (userId, statusCode) =>
  fetch(
    api.NEWS_API,
    {
      userId,
      statusCode
    },
    'post',
    {}
  )

// 新闻详情
const getNewsDetail = id => {
  return fetch(api.NEWS_API + '/' + id, null, 'get', {})
}
// 新闻新增
const createNews = params => {
  return fetch(api.NEWS_API, params, 'post', {})
}
// 新闻编辑
const updateNews = (id, params) => {
  return fetch(api.NEWS_API + '/' + id, params, 'patch', {})
}

// 删除新闻
const deleteNews = id => {
  return fetch(api.NEWS_API + '/' + id, null, 'delete', {})
}

export default {
  getNewsList,
  switchNewsStatus,
  getNewsDetail,
  createNews,
  updateNews,
  deleteNews
}
