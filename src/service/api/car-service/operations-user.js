export default {
  // 获取运维人员列表
  GET_OPUSER: '/service-ratchet/ratchet/users',
  // 根据城市查询片区
  GET_DISTRICT_BY_CITY: '/service-car-station/station/district/list',
  // 添加运维用户
  ADD_OPUSER: '/service-ratchet/ratchet/users/add',
  UPDATE_OPUSER: '/service-ratchet/ratchet/users/update',
  // 获取运维用户详情
  GET_OPUSER_DETAIL: '/service-ratchet/ratchet/users/info',
  // 启用/禁用用户
  SWITCH_OPUSER_STATUS: '/service-ratchet/ratchet/users/updateStatus',
  // 重置密码
  RESET_OPUSER_PASSWORD: '/service-ratchet/ratchet/users/resetPwd'
}
