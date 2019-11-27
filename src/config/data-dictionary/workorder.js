const getOpUserType = (value) => {
  switch (value) {
    case 'OFFICIAL':
      return '运维人员'
    case 'STATION':
      return '网点负责人'
    case 'UNOFFICIAL':
      return '众包人员'
  }
}

export {
  getOpUserType
}