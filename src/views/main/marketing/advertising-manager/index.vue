<template>
  <div id="advertisingManager">
    <el-card class="table-box">
      <div slot="header">
        <v-search :searchSettings="searchSettings" @search="handleSearch" labelWidth="120px">
        </v-search>
      </div>

      <div class="table-operator">
        <el-button type="primary" size="small" v-has="'advertisingManagerAdd'" @click="handleTemplate()">添加广告</el-button>
      </div>

      <div class="table-container">
        <el-table :data="tableData" height="100%">
          <el-table-column prop="advertisement_title" label="广告名称" min-width="120px" show-overflow-tooltip></el-table-column>
          <el-table-column prop="advertisement_type" label="广告类型" min-width="120px">
            <template slot-scope="scope">
              <div>
                <div>{{advType[scope.row.advertisement_type]}}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="city_name" label="推广城市">
            <template slot-scope="scope">
              <el-tooltip placement="top-start" v-if="scope.row.city_name.length > 3" >
                <div slot="content">
                  <div v-for="(item,index) in scope.row.city_name" :key="index">
                    <div>{{item}}</div>
                  </div>
                </div>
                  <div>{{scope.row.city_name[0]}}<br>{{scope.row.city_name[1]}}<br>{{scope.row.city_name[2]}}...</div>
              </el-tooltip>
              <div v-else v-for="(item, index) in scope.row.city_name" :key="index">
                {{item}}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="advertisement_sort" label="排序"></el-table-column>
          <el-table-column prop="created_on" label="时间信息" min-width="200px">
            <template slot-scope="scope">
              <div>
                <div>创建：{{scope.row.created_on|timeFilter}}</div>
                <div>开始：{{scope.row.advertisement_start_time|timeFilter}}</div>
                <div>结束：{{scope.row.advertisement_end_time|timeFilter}}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="created_by" label="最后操作人"></el-table-column>
          <el-table-column prop="is_enable" label="状态" min-width="100">
            <template slot-scope="scope">
              <popSwitch v-model="scope.row.is_enable" trueText="确定要禁用该广告吗？" falseText="确定要启用该广告吗？" @confirm="handleConfirmSwitch(scope.row)" @cancel="handleCancelSwitch"></popSwitch>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" min-width="100px">
            <template slot-scope="scope">
              <el-button v-has="'advertisingManagerUpdate'" class="el-button--text" type="text" @click="handleTemplate(scope.row)">编辑</el-button>
              <el-popover :ref="'deletePop' + scope.$index" title="" width="270" trigger="click" placement="top">
                <el-button type="text" v-has="'advertisingManagerDelete'" slot="reference">删除</el-button>
                <P style="line-height:25px">
                  <i class="el-icon-warning" style="color:red;margin-right:5px;"></i>确定删除该条广告？</p>
                <div style="text-align: right">
                  <el-button size="small" type="text" @click="handleCancel(scope.$index)">取消</el-button>
                  <el-button type="primary" size="mini" @click="deleteItem(scope.row.advertisement_id,scope.$index)">删除</el-button>
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
    </el-card>

    <v-page :visible.sync="templateVisible">

      <h3 slot="title">{{templateTitle === 1 ? "添加广告" : "编辑广告"}}</h3>
      <v-form ref="form" slot="content" :formData="formData" :formSettings="formSettings" :labelWidth="labelWidth"
              @save="handleSaveTemplate" @handleTypeChange="handleTypeChange">
        <template slot="city_id" slot-scope="scope">
          <el-select v-model="scope.model.city_id" multiple placeholder="请选择">
            <el-option
              v-for="item in provinceList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </template>
      </v-form>
    </v-page>

  </div>
</template>
<script>
import { resultSelectData } from '@/utils/common'
import popSwitch from '@/components/pop-switch'
import websiteSelect from '@/components/website-select'
import searchHistoryMixin from '@/mixins/search-history.js'
import paginationMixin from '@/mixins/pagination.js'
import {handleSubmitSearchData} from '@/utils/common.js'

export default {
  name: 'advertisingManager',
  components: {
    websiteSelect,
    popSwitch
  },
  mixins: [searchHistoryMixin, paginationMixin],
  data() {
    return {provinceList: [],
      labelWidth: '220px',
      tableData: [],
      formData: {},
      templateTitle: null,
      templateVisible: false,
      rowId: null,
      advType: {
        1: '开机广告',
        2: '弹窗广告',
        4: '短租预定页广告',
        5: '首页顶部条广告',
        6: '用车完成页广告',
        7: '左侧导航页广告'
      },
      searchSettings: [{
        label: '广告名称',
        type: 'text',
        name: 'keyword',
        visible: true
      },
      {
        label: '广告类型',
        name: 'advertisement_type',
        type: 'select',
        visible: true,
        options: [
          {
            value: 1,
            label: '开机广告'
          },
          {
            value: 2,
            label: '弹窗广告'
          },
          {
            value: 4,
            label: '短租预定页广告'
          },
          {
            value: 5,
            label: '首页顶部条广告'
          },
          {
            value: 6,
            label: '用车完成页广告'
          },
          {
            value: 7,
            label: '左侧导航页广告'
          }
        ]
      },
      {
        label: '推广城市',
        type: 'city',
        name: 'city_id',
        visible: false
      },
      {
        label: '广告状态',
        type: 'select',
        name: 'is_enable',
        visible: false,
        options: [
          {value: 1,
            label: '启用'
          },
          {
            value: 2,
            label: '禁用'
          }
        ]
      },
      {
        type: 'labelSelectDateRange',
        name: 'labelSelectDateRange',
        visible: false,
        optionValue: 'createDate',
        options: [
          {
            label: '创建时间',
            value: 'createDate'
          },
          {
            label: '开始时间',
            value: 'startDate'
          }
        ]
      }],
      formSettings: [
        {
          label: '',
          items: [{
            label: '广告标题',
            name: 'advertisement_title',
            type: 'text',
            required: true
          }, {
            label: '广告类型',
            type: 'select',
            name: 'advertisement_type',
            options: [
              { value: 1,
                label: '开机广告'
              },
              {
                value: 2,
                label: '弹窗广告'
              },
              {
                value: 4,
                label: '短租预定页广告'
              },
              {
                value: 5,
                label: '首页顶部条广告'
              },
              {
                value: 6,
                label: '用车完成页广告'
              },
              {
                value: 7,
                label: '左侧导航页广告'
              }
            ],
            events: {
              change: 'handleTypeChange'
            },
            required: true
          },
          {
            label: '开始结束时间',
            name: 'time',
            type: 'daterange',
            unixTime: true,
            required: true
            // 直接转成时间戳
            // unixTime: true
          }, {
            label: '推广城市',
            type: 'slot',
            name: 'city_id',
            required: true
          },
          {
            label: '广告图片',
            name: 'image',
            type: 'img',
            limit: 1,
            tip: '建议图片大小：1080*1642，图片大小不超过100K',
            required: true
          }, {
            label: '弹窗图片',
            name: 'pop_image',
            type: 'img',
            limit: 1,
            tip: '建议图片大小：1080*1642，图片大小不超过100K',
            required: true,
            hidden: true
          }, {
            label: '是否启用',
            name: 'is_enable',
            type: 'radio',
            options: [{
              label: '启用',
              value: true
            }, {
              label: '禁用',
              value: false
            }],
            required: true
          }, {
            label: '广告链接',
            name: 'advertisement_link',
            type: 'text'
          }, {
            label: '顺序',
            name: 'advertisement_sort',
            type: 'number'
          }]
        }
      ]
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
  methods: {
    handleSearch(data) {
      let searchData = Object.assign({}, data)
      searchData = handleSubmitSearchData(searchData)
      if (searchData.createDate) {
        searchData.createDate[0] = Math.floor(Date.parse(searchData.createDate[0]) / 1000)
        searchData.createDate[1] = Math.floor(Date.parse(searchData.createDate[1]) / 1000)
      }
      this.searchData = searchData
      this.page = 1
      this.loadTableData()
    },
    handleTemplate(data) {
      // 获取城市列表
      this.$service.get_operationCityList().then(res => {
        this.provinceList = resultSelectData(res.data.data)
      })

      this.templateVisible = true
      if (data) {
        this.rowId = data.advertisement_id
        if (!(data.image instanceof Array)) {
          data.image = [
            {
              name: data.image.split('/').pop(),
              url: data.image
            }
          ]
        }

        if (data.pop_image && data.pop_image.length > 0) {
          if (!(data.pop_image instanceof Array)) {
            data.pop_image = [
              {
                name: data.pop_image.split('/').pop(),
                url: data.pop_image
              }
            ]
          }
          this.formSettings[0].items.find(item => item.name == 'pop_image').hidden = false
          this.formSettings[0].items.find(item => item.name == 'pop_image').required = true
          this.formSettings[0].items.find(item => item.name == 'image').tip = '（建议图片大小：335*170，图片大小不超过100K）'
        } else {
          data.pop_image = []
          this.formSettings[0].items.find(item => item.name == 'pop_image').hidden = true
          this.formSettings[0].items.find(item => item.name == 'image').tip = '（建议图片大小：1080*1642，图片大小不超过100K）'
        }
        data.time = [
          data.advertisement_start_time, data.advertisement_end_time
        ]
        data.advertisement_type = Number(data.advertisement_type)
        if (!data.city_id) {
          data.city_id = []
        }
        this.formData = data
        console.log(data)
      } else {
        this.formData = {}
      }
      if (!data) {
        this.templateTitle = 1
      } else {
        this.templateTitle = 2
      }
    },
    // 对应的广告类型
    handleTypeChange(type) {
      if (type == 1 || type == 5 || type == 6 || type == 7) {
        this.formSettings[0].items.find(item => item.name == 'pop_image').hidden = true
        this.formSettings[0].items.find(item => item.name == 'image').tip = '（建议图片大小：1080*1642，图片大小不超过100K）'
      } else if (type == 4) {
        this.formSettings[0].items.find(item => item.name == 'pop_image').hidden = true
        this.formSettings[0].items.find(item => item.name == 'image').tip = '（建议图片大小：710*300，图片大小不超过100K）'
      } else {
        this.formSettings[0].items.find(item => item.name == 'pop_image').hidden = false
        this.formSettings[0].items.find(item => item.name == 'pop_image').required = true
        this.formSettings[0].items.find(item => item.name == 'image').tip = '（建议图片大小：335*170，图片大小不超过100K）'
      }
      this.$refs.form.updateRule()
    },
    handleSaveTemplate(data) {
      console.log(data)
      let userName = {'created_by': this.user.username}
      let temObj = {...userName, ...data}
      temObj.image = temObj.image[0].url
      if (temObj.advertisement_type == 2) {
        temObj.pop_image = temObj.pop_image[0].url
      } else {
        temObj.pop_image = ''
      }
      temObj.advertisement_start_time = temObj.time[0]
      temObj.advertisement_end_time = temObj.time[1]
      temObj.is_enable = temObj.is_enable ? 1 : 2
      if (this.templateTitle === 1) {
        this.$service.addAdvertising(temObj).then(res => {
          // console.log('====res====', res);
          this.templateVisible = false
          this.loadTableData()
          this.$message({
            message: '添加成功',
            type: 'success'
          })
        })
      } else {
        let ID = {}
        ID.advertisement_id = this.rowId
        let obj = {...ID, ...temObj}
        console.log(obj)
        this.$service.editAdvertising(obj).then(res => {
          // console.log('====res====', res);
          this.templateVisible = false
          this.loadTableData()
          this.$message({
            message: '编辑成功',
            type: 'success'
          })
        })
      }
    },
    handleConfirmSwitch(data) {
      console.log(data.is_enable)
      if (data.is_enable) {
        data.is_enable = 2
      } else {
        data.is_enable = 1
      }
      this.$service.switchAddStatus(data.advertisement_id, data.is_enable).then(res => {
        this.$message({
          message: data.is_enable == 2 ? '禁用成功' : '启用成功',
          type: 'success'
        })
        this.loadTableData()
      })
    },
    handleCancelSwitch() {},
    // 取消删除
    handleCancel(index) {
      this.$refs['deletePop' + index].doClose()
    },
    // 删除广告
    deleteItem(id, index) {
      let ID = {}
      ID.id = id
      let obj = {...ID}
      console.log(obj)
      this.$service.deleteAdvertising(obj).then(res => {
        this.$message.success('删除广告成功')
        this.$refs['deletePop' + index].doClose()
        this.loadTableData()
      }).catch(error => {
        this.$message.warning(error.msg ? error.msg : '删除广告失败')
        this.$refs['deletePop' + index].doClose()
      })
    },

    loadTableData() {
      this.pageSize = 10
      let params = {page: this.page, pageSize: this.pageSize, ...this.searchData}
      // 获取城市列表
      this.$service.get_operationCityList().then(res => {
        this.provinceList = res.data.data
        console.log(this.provinceList)
        this.$service.getAdvertisingList(params).then(res => {
          this.tableData = res.data.data.list.map(item => {
            item.is_enable = (item.is_enable == '1')
            item.city_name = []
            if (item.city_id) {
              for (let i = 0; i < item.city_id.length; i++) {
                for (let j = 0; j < this.provinceList.length; j++) {
                  item.city_id[i] = Number(item.city_id[i])
                  if (item.city_id[i] == this.provinceList[j].id) {
                    item.city_name.push(this.provinceList[j].name)
                  }
                }
              }
            }
            return item
          })
          this._changePageTotal(Number(res.data.data.pagination.totalCount))
        })
      })
    }
  }
}
</script>
<style lang="scss">
  .el-form-item__label{
    width:100px;
  }
</style>
