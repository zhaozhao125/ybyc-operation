import { fetch } from '@/utils/fetch'
import api from '@/service/api/'

const appVersionList = params => {
  console.dir('appVersionList')
  return fetch(api.appVersionList, params, 'post', {})
}
const updateRow = (urltype, params) => {
  console.dir('添加和编辑页面')
  let url = ''
  if (urltype === 'add') {
    url = api.appversionAdd
  } else {
    url = api.appversionEdit
  }

  return fetch(url, params, 'post', {})
}
const deleteRow = params => {
  console.dir('appversionDel')
  return fetch(api.appversionDel, params, 'post', {})
}
const formAppversionRows = rows => {
  let idx = 0
  for (idx in rows) {
    rows[idx] = formAppversionRow(rows[idx])
  }

  return rows
}

const formAppversionRow = row => {
  let appTypeCfg = {
    1: '用车iOS',
    2: '用车Android',
    3: '车服iOS',
    4: '车服Android'
  }
  row['app_type_txt'] = appTypeCfg[row['app_type']]

  let forceUpdateCfg = {
    0: '否',
    1: '是'
  }
  row['is_force_update_txt'] = forceUpdateCfg[row['is_force_update']]

  let appStatusCfg = {
    0: '禁用',
    1: '启用'
  }
  row['app_version_status_txt'] = appStatusCfg[row['app_version_status']]

  let isFileCfg = {
    0: '否',
    1: '是'
  }
  row['is_file_txt'] = isFileCfg[row['is_file']]

  // 描述显示
  row['app_version_description_txt'] = ''
  if (row['app_version_description'].length > 0) {
    for (let i = 0; i < row['app_version_description'].length; i++) {
      row['app_version_description_txt'] += row['app_version_description'].charAt(i)
      if (i % 30 === 0 && i != 0) {
        row['app_version_description_txt'] += '<br />'
      }
    }
  }

  return row
}

export default {
  appVersionList,
  updateRow,
  formAppversionRows,
  formAppversionRow,
  deleteRow
}
