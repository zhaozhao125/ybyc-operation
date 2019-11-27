import Viewer from 'viewerjs'

let viewerIns
let imgArrBak

function arraysEqual (a, b) {
  if (a === b) return true
  if (a == null || b == null) return false
  if (a.length !== b.length) return false

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false
  }
  return true
}

function viewImg (imgArr) {
  if (!imgArr || !imgArr.length) {
    throw new Error('viewImg必须有字符串数组的参数')
  }
  // 如果和上次图片数组一样，则直接显示
  if (imgArrBak && arraysEqual(imgArrBak, imgArr) && viewerIns && viewerIns.show) {
    viewerIns.show(true)
    return viewerIns
  } else {
    imgArrBak = imgArr
  }
  if (viewerIns && viewerIns.destroy) {
    viewerIns.destroy()
  }
  let $imgDom = document.createElement('div')
  imgArr.forEach(item => {
    let $imgItem = document.createElement('img')
    $imgItem.setAttribute('src', item)
    $imgDom.appendChild($imgItem)
  })

  viewerIns = new Viewer($imgDom, {
    transition: false
  })
  viewerIns.show(true)
  return viewerIns
}

export default {
  viewImg,
  getViewer: () => viewerIns
}
