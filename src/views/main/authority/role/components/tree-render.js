function getTreeClass (data) {
  let classList = []
  if (data.typeLevel) {
    classList.push('auth-level' + data.typeLevel)
  }
  if (data.type === 'buttonAuth') {
    classList.push('auth-button')
  }
  return classList.join(' ')
}

export default function treeRender (h, { node, data, store }) {
  return (
    <span class={getTreeClass(data)}>
      <span>{node.label}</span>
    </span>
  )
}
