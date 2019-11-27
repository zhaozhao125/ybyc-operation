<template>
  <div id="car-model" class="list-page components-content">
    <!-- 添加车型开始-->
    <div class="dialog-contant">
      <el-dialog :visible.sync='dialogVisible' :title='addTypeOrEditor' v-if="dialogVisible" width='35%'>
        <div class="v-form">
          <v-form :formSettings="formSettings" @save="submitSave" labelWidth='165px' ref="vform" :formData="formData" @cancel="cancelSubmit">
            <template slot="seat" slot-scope="scope">
              <el-input-number v-model="scope.model.seat" :min="1" :max="999"></el-input-number>
            </template>
          </v-form>
        </div>
      </el-dialog>
    </div>
    <!-- 添加车型结束 -->
    <el-card class="table-box">
      <!-- 搜索内容开始 -->
      <div class="v-searck space-between" slot="header">
        <v-search :searchSettings="searchSettings" @search="searchItem"></v-search>
      </div>
      <!-- 搜索内容结束 -->

      <!-- 添加车型按钮 -->
      <div class="table-operator">
        <el-button type="primary" @click="addCarType(1)" size="small">添加车型</el-button>
      </div>
      <!-- 添加车型按钮 -->
      <!-- 表格开始 -->
      <el-table :data="tableData" height="100%">
        <el-table-column label="名称" show-overflow-tooltip min-width="100">
          <template slot-scope="scope">
            <el-button type="text" @click="detailsItem(scope.row.id)" class="detail"> {{scope.row.name}}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="备注" show-overflow-tooltip min-width="200">
          <template slot-scope="scope">
            <span v-if="scope.row.remark">{{scope.row.remark}}</span>
            <span v-else>无</span>
          </template>
        </el-table-column>
        <el-table-column prop="createdOn" label="添加时间" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.createdOn|formatData}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="120">
          <template slot-scope="scope">
            <el-button type="text" @click="editList(scope.row,2)" class="handle" v-has="'carModelEdit'">编辑</el-button>
            <el-popover :ref="'deletePop' + scope.$index" title="" width="270" trigger="click" placement="top">
              <el-button type="text" slot="reference" v-has="'carModelDelete'">删除</el-button>
              <P style="line-height:25px">
                <i class="el-icon-warning" style="color:red;margin-right:5px;"></i>车型删除后，相关数据无法查询，请谨慎操作。确定删除？</p>
              <div style="text-align: right">
                <el-button size="small" type="text" @click="handleCancel(scope.$index)">取消</el-button>
                <el-button type="primary" size="mini" @click="deleteItem(scope.row.id,scope.$index)">删除</el-button>
              </div>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
      <!-- 表格结束 -->

      <!-- 分页开始 -->
      <div class='table-page'>
        <el-pagination @current-change="handleCurrentChange" :current-page.sync="paging.page" :page-size="paging.pageSize" layout="total, prev, pager, next" :total="total">
        </el-pagination>
      </div>
      <!-- 分页结束 -->
    </el-card>

    <!-- 车型详情对话框 开始-->
    <el-dialog :visible.sync='detailsItemVisible' title='车型详情' width='35%'>
      <div class="content-table">
        <v-detail :detailSettings="detailSettings" :detailData="detailData"></v-detail>
      </div>
    </el-dialog>
    <!--  车型详情对话框 结束-->
  </div>
</template>
<script>
import vDetail from '@/components/detail/vDetail'
import { detailSettings, searchSettings } from './data'
import searchHistoryMixin from '@/mixins/search-history.js'
import { pageSize } from '@/config/page-config'
import { handleSubmit, handleData } from '@/utils/common.js'
export default {
  name: 'car-model',
  mixins: [searchHistoryMixin],
  components: {
    vDetail
  },
  data() {
    // 自定义验证规则
    let carSignRule = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入车型唯一标识'))
      }
      if (!/^[a-zA-Z0-9]{1,30}$/.test(value)) {
        callback(new Error('控制在30个字以内，英文，数字'))
      } else {
        callback()
      }
    }
    let carNameRule = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入车型名称'))
      }
      if (!/^.{1,30}$/.test(value)) {
        callback(new Error('控制在25个字以内'))
      } else {
        callback()
      }
    }
    let maxRemainMileageRule = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入满电续航里程'))
      } else if (!(/(^[1-9]\d*$)/.test(value))) {
        return callback(new Error('请输入大于0的正整数'))
      } else {
        callback()
      }
    }
    return {
      total: 0,
      paging: {
        page: 1,
        pageSize: pageSize
      },
      imgUrl: '',
      flagBit: false, // 标志位
      rowId: null,
      formData: {},
      detailData: {},
      tip: null, // 添加 取消 提示
      addTypeOrEditor: '',
      dialogVisible: false,
      detailsItemVisible: false,
      tableData: [],
      detailSettings,
      searchSettings,
      formSettings: [
        {
          items: [
            {
              label: '车型名称',
              name: 'name',
              type: 'text',
              placeholder: '控制在25个字以内',
              rule: [
                {
                  validator: carNameRule
                }, {
                  required: true,
                  trigger: 'change,blur'
                }
              ]
            },
            {
              label: '车型唯一标示',
              name: 'code',
              type: 'text',
              placeholder: '控制在30个字以内，英文，数字',
              disabled: false,
              rule: [
                {
                  validator: carSignRule
                }, {
                  required: true,
                  trigger: 'change,blur'
                }
              ]
            },
            {
              label: '满电续航里程(km)',
              name: 'maxRemainMileage',
              type: 'text',
              placeholder: '仅可输入大于0的正整数',
              disabled: false,
              rule: [
                {
                  validator: maxRemainMileageRule
                }, {
                  required: true,
                  trigger: 'change,blur'
                }
              ]
            },
            {
              label: '车型座位数',
              name: 'seat',
              type: 'slot'
            },
            // 上传图片
            {
              label: '上传图片',
              name: 'img',
              type: 'img',
              limit: 1
            },
            {
              label: '车型备注信息',
              name: 'remark',
              type: 'text',
              placeholder: '请输入车型备注信息'
            }
          ]
        }
      ]
    }
  },
  mounted() {
    setTimeout(() => {
      // 请求分页接口
      this.carModelPagingOrSearch()
    }, 20)
  },
  methods: {
    cancelSubmit() {
      this.dialogVisible = false
    },
    // 取消删除
    handleCancel(index) {
      this.$refs['deletePop' + index].doClose()
    },
    // 删除
    deleteItem(id, index) {
      this.$service.delete_carModel(id).then(res => {
        this.$message.success('删除车型成功')
        this.$refs['deletePop' + index].doClose()
        this.carModelPagingOrSearch()
      }).catch(error => {
        this.$message.warning(error.msg ? error.msg : '删除车型失败')
        this.$refs['deletePop' + index].doClose()
      })
    },
    // 保存按钮
    submitSave(submitItem) {
      console.log(submitItem)

      // 上传图片
      if (!submitItem.img.length) {
        delete submitItem.img
      } else {
        let { img } = submitItem
        submitItem.img = img[0].url
      }
      if (this.tip === 1) {
        if (submitItem.id) {
          delete submitItem.id
        }
        // 添加车型
        this.$service.post_carModelAdd(submitItem).then(res => {
          this.$message.success('添加成功')
          this.carModelPagingOrSearch()
          this.dialogVisible = false
        })
      } else {
        console.log(this.rowId)
        // 编辑车型
        let submitObj = handleSubmit(submitItem, this.formData)
        submitObj.id = this.rowId
        this.$service.put_carModelModigy(submitObj).then(res => {
          this.$message.success('编辑成功')
          this.carModelPagingOrSearch()
          this.dialogVisible = false
        })
      }
    },
    // 搜索
    searchItem(obj) {
      this.flagBit = true
      let startDate, endDate
      if (obj.date) {
        startDate = handleData(obj.date[0])
        endDate = handleData(obj.date[1])
      }
      this.paging.page = 1
      this.carModelPagingOrSearch(startDate, endDate, obj.keyWords)
      this._saveSearchHistory(obj.keyWords, 'keyWords') // 存储到localstorage
    },
    reset() {
      this.paging.page = 1
      this.carModelPagingOrSearch()
    },
    // 当前页数
    handleCurrentChange(page) {
      if (this.flagBit) {
        this.flagBit = false
        return
      }
      this.paging.page = page
      this.carModelPagingOrSearch()
    },
    // 列表和搜索接口
    carModelPagingOrSearch(startDate, endDate, keyWords) {
      this.$service
        .get_carModelPagingOrSearch(
          this.paging.page,
          this.paging.pageSize,
          startDate,
          endDate,
          keyWords
        )
        .then(res => {
          this.tableData = res.data.data.records
          this.total = res.data.data.totalElements
        })
    },
    // 编辑车型列表
    editList(row, dis) {
      this.$service.get_carModelDetail(row.id).then(res => {
        // 拿到车型图片url
        this.imgUrl = res.data.data.img
        // 引用地址问题
        let tmpData = Object.assign({}, row)
        if (this.imgUrl) {
          tmpData.img = [
            {
              name: this.imgUrl.split('/').pop(),
              url: this.imgUrl
            }
          ]
        } else {
          tmpData.img = []
        }
        this.formData = tmpData
        this.rowId = row.id
        this.tip = dis
        if (dis === 2) {
          this.addTypeOrEditor = '编辑车型'
        }
        this.dialogVisible = true
        this.$nextTick(() => {
          this.$refs.vform.formSettings[0].items[1].disabled = true
        })
      })
    },
    // 查看详情
    detailsItem(id) {
      this.$nextTick(() => {
        this.detailsItemVisible = true
        this.$service.get_carModelDetail(id).then(res => {
          if (res.data.data.img) {
            res.data.data.img = res.data.data.img.split(' ')
          }
          let copyData = Object.assign({}, res.data.data)
          // debugger;
          this.detailData = copyData
        })
      })
    },
    // 添加车型按钮
    addCarType(dis) {
      this.tip = dis
      if (dis === 1) {
        this.addTypeOrEditor = '添加车型'
      }
      this.dialogVisible = true
      // 把所有状态滞空
      for (var key in this.formData) {
        delete this.formData[key]
      }
      this.$nextTick(() => {
        this.$refs.vform.formSettings[0].items[1].disabled = false
      })
    }
  }
}
</script>
<style lang="scss">
#car-model {
  .el-dialog__footer {
    padding: 0px 15px 15px;
  }
}
</style>
