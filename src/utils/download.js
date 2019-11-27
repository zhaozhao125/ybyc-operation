import axios from 'axios'
import baseUrl from '@/config/base-url'
import { Message, Loading } from 'element-ui'
import { download } from '@/utils/common'

let loadingStyle = {
  text: '加载中...',
  spinner: 'el-icon-loading',
  background: 'rgba(255,255,255,0.7)',
  target: '.tabs>.el-tabs__content .el-tab-pane:not([aria-hidden])'
}

const downloadByParama = (params) => {
  let loading = Loading.service({ ...loadingStyle })

  axios({
    baseURL: baseUrl || '/',
    method: 'post',
    url: params.url,
    data: params.data,
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      accessToken: params.token
    }
  }).then(res => {
    Message.success('导出数据成功')
    download(params.filename, res.data)
    loading.close()
  }).catch(error => {
    Message.warning(error.msg ? error.msg : '导出失败')
    loading.close()
  })
}

export default {
  downloadByParama
}
