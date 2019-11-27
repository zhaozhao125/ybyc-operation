let buttonAuth = {}
let buttonAuthSet = new Set()
export default function formatAuth (auth) {
  if (!auth || !auth.length) {
    return []
  }
  let newAuth = auth.slice()

  newAuth.forEach(item => {
    item.label = item.name
    item.name = item.marker
    item.isFolder = !!(item.children && item.children.length)
    if (item.operateModels && item.operateModels.length) {
      buttonAuth[item.name] = item.operateModels.filter(item => item.checked)
      buttonAuth[item.name].forEach(item => {
        buttonAuthSet.add(item.marker)
      })
    }
    if (item.isFolder) {
      item.children = formatAuth(item.children)
    }
  })
  return newAuth
}

export { buttonAuth, buttonAuthSet }
