export default function renderContent(h, { node, data, store }) {
  if(!this.editable){
    return (
      <span class="tree-item">
        <span>
          <span>{node[this.defaultProps.label]}</span>
        </span>
      </span>)
  } else{
    return (
      <span class="tree-item">
        <span>
          <span>{data[this.defaultProps.label]}</span>
        </span>
        <span class="tree-buttons">
          <el-button type="primary" size="mini" onClick={ () => this.showAddForm(store, data) }>添加</el-button>
          <el-button type="danger" size="mini" onClick={ () => this.remove(store, data, node) }>删除</el-button>
        </span>
      </span>)
  }
}