import { pageSize } from '@/config/page-config'
export default {
  data () {
    return {
      // 当前页
      page: 1,
      // 每页数量
      pageSize: pageSize,
      // 总条目数
      pageTotal: 0
    }
  },

  methods: {
    // 改变总条目数
    _changePageTotal (newSize) {
      this.pageTotal = newSize
    },
    // 改变页码
    _handlePageChange (page) {
      this.page = page
      this.loadTableData()
    }
  }
}
