<template>
  <div id="news-list">
    <el-card class="table-box">

      <div slot="header">
        <v-search :searchSettings="searchSettings" @search="handleSearch"></v-search>
      </div>

      <div class="table-operator">
        <el-button type="primary" size="small" @click="handleTemplate()">添加新闻</el-button>
      </div>

      <div class="table-container">
        <el-table :data="tableData" height="100%">
          <el-table-column prop="title" label="标题" min-width="200px">
            <template slot-scope="scope">
              <span v-if="!scope.row.title">未知</span>
              <el-button type="text" v-else @click="handleShowNews(scope.row)">{{scope.row.title}}</el-button>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="content" label="内容" min-width="120px"></el-table-column> -->
          <!-- <el-table-column prop="previewImage" label="封面图片" min-width="120px"></el-table-column> -->
          <!-- <el-table-column prop="source" label="文章来源" min-width="120px"></el-table-column> -->
          <el-table-column prop="author" label="文章作者" min-width="120px"></el-table-column>
          <el-table-column prop="releaseTime" label="发布时间" min-width="180px">
            <template slot-scope="scope">
              {{scope.row.releaseTime | timeFilter}}
            </template>
          </el-table-column>
          <el-table-column prop="creator" label="创建人" min-width="180px">
            <template slot-scope="scope">
              {{scope.row.creator.name}}
            </template>
          </el-table-column>
          <el-table-column prop="viewedTimes" label="阅读量" min-width="120px"></el-table-column>
          <el-table-column prop="likeTimes" label="点赞量" min-width="120px"></el-table-column>
          <el-table-column prop="isOriginal" label="是否原创" min-width="120px">
            <template slot-scope="scope">
              <span v-if="scope.row.isOriginal === true">是</span>
              <span v-else>否</span>
            </template>
          </el-table-column>
          <el-table-column prop="isPinned" label="是否置顶" min-width="120px">
            <template slot-scope="scope">
              <span v-if="scope.row.isPinned === true">是</span>
              <span v-else>否</span>
            </template>
          </el-table-column>
          <el-table-column prop="isEnabled" label="是否启用" min-width="180px">
            <template slot-scope="scope">
              <span v-if="scope.row.isEnabled === true">是</span>
              <span v-else>否</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" min-width="100px">
            <template slot-scope="scope">
              <el-button class="el-button--text" type="text" @click="handleTemplate(scope.row,2)">编辑</el-button>
              <el-popover class="confirm-popover" placement="bottom" width="160" :ref="'resetPopper' + scope.$index">
                <el-button slot="reference" type="text">删除</el-button>
                <p>确定要删除新闻吗？</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="handleDeleteCancel(scope.$index)">取消</el-button>
                  <el-button type="primary" size="mini" @click="handleDeleteNews(scope.row, scope.$index)">确定</el-button>
                </div>
              </el-popover>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class='table-page'>
        <el-pagination :current-page="page" :page-size="pageSize" layout="total, prev, pager, next" :total="pageTotal" @current-change="_handlePageChange">
        </el-pagination>
      </div>
      <!-- <v-news-details :visible.sync="detailsVisible"></v-news-details> -->
      <v-add-or-edit :visible.sync="addOrEditVisible" :detailData="detailData" @update="handleUpdateSuccess" @create="handleCreateSuccess"></v-add-or-edit>
    </el-card>
    <el-dialog title="新闻内容" :visible.sync="detailsVisible" width="70%" :before-close="handleClose">
      <div class="news-container" v-if="detailData">
        <h1>{{detailData.title}}</h1>
        <div class="release-date">
          <time>{{detailData.releaseTime | timeFilter('YYYY-MM-DD')}}</time>
        </div>
        <div v-html="detailData.content" class="news-content"></div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="detailsVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import searchHistoryMixin from '@/mixins/search-history.js'
import paginationMixin from '@/mixins/pagination.js'
import searchSettings from './components/searchSettings.js'
import vAddOrEdit from './components/add-or-edit'

export default {
  name: 'news',
  components: {
    vAddOrEdit
  },
  mixins: [searchHistoryMixin, paginationMixin],
  data() {
    return {
      searchSettings: searchSettings,
      tableData: [],
      detailsVisible: false,
      addOrEditVisible: false,
      detailData: null
    }
  },

  computed: {
    user() {
      return this.$store.getters.user
    }
  },
  created() {
    this.loadTableData()
  },
  mounted() {},
  watch: {
    detailsVisible() {},
    addOrEditVisible() {}
  },
  methods: {
    handleSearch(data) {
      console.log('====data====', data)
      let searchData = Object.assign({}, data)
      this.searchData = searchData
      this.page = 1
      this.loadTableData()
    },
    loadTableData() {
      this.pageSize = 10
      let params = {
        page: this.page,
        pageSize: this.pageSize,
        ...this.searchData
      }
      this.$service.getNewsList(params).then(res => {
        this.tableData = res.data.data.docs
        this._changePageTotal(res.data.data.total)
      })
    },
    handleTemplate(data) {
      if (data) {
        this.$service.getNewsDetail(data._id).then(res => {
          let detailData = res.data.data
          detailData.releaseTime = new Date(detailData.releaseTime)
          detailData.previewImage = [
            {
              name: detailData.previewImage,
              url: detailData.previewImage
            }
          ]
          this.detailData = detailData
          this.addOrEditVisible = true
        })
      } else {
        this.detailData = null
        this.addOrEditVisible = true
      }
    },
    handleShowNews(news) {
      this.$service.getNewsDetail(news._id).then(res => {
        this.detailData = res.data.data
        this.detailsVisible = true
      })
    },
    handleUpdateSuccess(data) {
      if (data) {
        this.tableData.splice(
          this.tableData.findIndex(item => item._id == data._id),
          1,
          data
        )
      }
    },
    handleCreateSuccess(data) {
      this.loadTableData()
    },
    handleDeleteCancel(index) {
      this.$refs['resetPopper' + index].showPopper = false
    },
    handleDeleteNews(news, index) {
      this.$refs['resetPopper' + index].showPopper = false
      this.$service.deleteNews(news._id).then(res => {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.loadTableData()
      })
    }
  }
}
</script>
<style lang="scss">
#news-list{
  .news-container {
    padding: 3rem 0;
    border: 1px solid;
    border-color: #e5e6e9 #dfe0e4 #d0d1d5;
    border-radius: 3px;
    h1 {
      text-align: center;
      font-size: px2rem(32);
      margin-bottom: 2rem;
    }
    .release-date {
      text-align: center;
      font-size: px2rem(18);
      color: #969696;
    }
    .news-content {
      margin-top: 2rem;
      img {
        max-width: 100%;
        height: auto !important;
      }
    }
  }
}
</style>
