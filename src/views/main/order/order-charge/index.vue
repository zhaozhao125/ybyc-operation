<template>
  <div id="order-list">
    <el-card class="table-box">

      <div slot="header">
        <v-search :searchSettings="searchSettings" @search="handleSearch">
          <template slot="carGenreId" slot-scope="scope">
            <div v-show="scope.model.open===1" class="select-content">
              <span class="select-name">选择车型</span>
              <span class="select-website-item">
                <search-select v-model="scope.model.carGenreId" placeholder="请输入车型名称"></search-select>
              </span>
            </div>
          </template>
        </v-search>
      </div>

      <div class="table-operator">
        <el-button v-has="'orderChargeCreateTemplate'" type="primary" size="small" @click="handleTemplate()">添加计费模板</el-button>
      </div>

      <div class="table-container">
        <el-table :data="tableData" height="100%">
          <el-table-column prop="cityName" label="城市" min-width="120px"></el-table-column>
          <el-table-column prop="carGenreName" label="车型" min-width="120px"></el-table-column>
          <el-table-column prop="onMinutePrice" label="行驶单价" min-width="120px"></el-table-column>
          <el-table-column prop="offMinutePrice" label="熄火单价" min-width="120px"></el-table-column>
          <el-table-column prop="cityServicePrice" label="跨城服务费单价" min-width="120px"></el-table-column>
          <el-table-column prop="dayMaxPrice" label="日封顶价" min-width="120px"></el-table-column>
          <el-table-column prop="noDeductiblesPrice" label="不计免赔服务费" min-width="130px"></el-table-column>
          <el-table-column prop="createdTime" label="添加时间" min-width="180px"></el-table-column>
          <el-table-column prop="createdBy" label="添加人" min-width="120px"></el-table-column>
          <el-table-column prop="modifiedTime" label="最后修改时间" min-width="180px">
            <template slot-scope="scope">
              {{scope.row.modifiedTime}}
            </template>
          </el-table-column>
          <el-table-column prop="modifiedBy" label="修改人" min-width="120px"></el-table-column>
          <el-table-column label="操作" fixed="right" min-width="100px">
            <template slot-scope="scope">
              <el-button v-has="'orderChargeUpdate'" class="el-button--text" type="text" @click="handleTemplate(scope.row,2)">编辑</el-button>
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

      <h3 slot="title">{{templateTitle === 1 ? "新增计费模板" : "编辑计费模板"}}</h3>
      <v-form ref="form" slot="content" :formData="formData" :formSettings="formSettings" :labelWidth="labelWidth" @save="handleSaveTemplate" @carChange="handleCarChange">
        <template slot="carGenreId" slot-scope="scope">
          <div v-show="scope.model.open===1" class="select-content">
            <span class="select-name">选择车型</span>
            <span class="select-website-item">
              <search-select v-model="scope.model.carGenreId" placeholder="请输入车型名称"></search-select>
            </span>
          </div>
        </template>
        <template slot="cityId" slot-scope="scope">
          <website-select v-model="scope.model.cityId" type="city" holder="请输入城市名称" :isShowAll="isShowAll" @change="handleCityChange"></website-select>
        </template>
        <template slot="onMinutePrice" slot-scope="scope">
          <el-input placeholder="请输入" v-model="scope.model.onMinutePrice">
            <template slot="append">元/分钟</template>
          </el-input>
        </template>
        <template slot="offMinutePrice" slot-scope="scope">
          <el-input placeholder="请输入" v-model="scope.model.offMinutePrice">
            <template slot="append">元/分钟</template>
          </el-input>
        </template>

        <!-- 城郊服务费 -->
        <template slot="suburbanServices" slot-scope="scope">
          <el-form-item :label="'城区 - '+item.name" v-for="(item,index) in suburbanServicesData" :key="index">
            <el-input v-model="scope.model.suburbanServices[index]" auto-complete="off">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
        </template>

        <template slot="cityServicePrice" slot-scope="scope">
          <el-input placeholder="请输入" v-model="scope.model.cityServicePrice">
            <template slot="append">元/公里</template>
          </el-input>
        </template>
        <template slot="dayMaxPrice" slot-scope="scope">
          <el-input placeholder="请输入" v-model="scope.model.dayMaxPrice">
            <template slot="append">元</template>
          </el-input>
        </template>
        <template slot="noDeductiblesPrice" slot-scope="scope">
          <el-input placeholder="请输入" v-model="scope.model.noDeductiblesPrice">
            <template slot="append">元/单</template>
          </el-input>
        </template>
      </v-form>
    </v-page>

  </div>
</template>
<script>
import formGenerator from '@/components/formGenerator'
import websiteSelect from '@/components/website-select'
import vPage from '@/components/page'
import searchHistoryMixin from '@/mixins/search-history.js'
import paginationMixin from '@/mixins/pagination.js'
import { handleSubmitSearchData } from '@/utils/common.js'

export default {
  name: 'orderCharge',
  components: {
    vPage,
    formGenerator,
    websiteSelect
  },
  mixins: [searchHistoryMixin, paginationMixin],
  data() {
    let validator = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入城郊服务费'))
      }
      if (
        value.length < this.suburbanServicesData.length ||
        value.some(item => item !== 0 && !item)
      ) {
        return callback(new Error('城郊服务费不能为空'))
      }
      callback()
    }
    return {
      labelWidth: '220px',
      tableData: [],
      formData: {},
      templateTitle: null,
      templateVisible: false,
      rowId: null,
      isShowAll: false,
      searchSettings: [
        {
          label: '城市',
          type: 'remoteCity',
          name: 'cityId',
          visible: true
        },
        {
          label: '车型',
          name: 'carGenreId',
          type: 'select',
          visible: true,
          options: []
        }
      ],
      formSettings: [
        {
          label: '',
          items: [
            {
              label: '选择车型',
              type: 'select',
              name: 'carGenreId',
              options: [],
              events: {
                change: 'carChange'
              },
              required: true
            },
            {
              label: '选择城市',
              type: 'slot',
              name: 'cityId',
              required: true
            },
            {
              label: '行驶单价',
              type: 'slot',
              name: 'onMinutePrice',
              required: true
            },
            {
              label: '熄火单价',
              type: 'slot',
              name: 'offMinutePrice',
              required: true
            },
            {
              label: '城郊服务费',
              name: 'suburbanServices',
              value: [],
              type: 'slot',
              // required: true,
              hidden: true,
              rule: [
                {
                  validator: validator,
                  trigger: 'change',
                  required: true
                }
              ]
            },
            // {
            //   label: '城郊服务费说明',
            //   type: 'text',
            //   name: 'suburbanServicesDescription',
            //   disabled: true,
            //   required: true
            // },
            {
              label: '跨城服务费单价',
              type: 'slot',
              name: 'cityServicePrice',
              required: true
            },
            // {
            //   label: '跨城服务费说明',
            //   type: 'text',
            //   name: 'cityServiceDescription',
            //   disabled: true,
            //   required: true
            // },
            {
              label: '日封顶价格',
              type: 'slot',
              name: 'dayMaxPrice',
              required: true
            },
            {
              label: '不计免赔服务费',
              type: 'slot',
              name: 'noDeductiblesPrice',
              required: true
            },
            {
              label: '不计免赔描述',
              type: 'textarea',
              name: 'noDeductiblesDescription',
              placeholder: '请输入',
              required: true
            }
          ]
        }
      ],
      carGenreId: null,
      cityId: null,
      suburbanServicesData: []
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
  mounted() {
    this.$nextTick(() => {
      this.carsInfoDict()
    })
  },
  watch: {
    templateVisible() {
      if (this.templateVisible === false) {
        this.cityId = null
      }
    }
  },
  methods: {
    suburbanServicesVisible() {
      if (this.carGenreId && this.cityId) {
        let suburban = true
        this.$service.getDistrictByCity(this.cityId, suburban).then(res => {
          if (res.data.data.length !== 0) {
            this.suburbanServicesData = res.data.data
            this.formSettings[0].items.find(
              item => item.name === 'suburbanServices'
            ).hidden = false
          } else {
            this.suburbanServicesData = []
            this.formSettings[0].items.find(
              item => item.name === 'suburbanServices'
            ).hidden = true
          }
        })
      }
    },
    handleCarChange(data) {
      this.carGenreId = data
      this.suburbanServicesVisible()
    },
    handleCityChange(data) {
      this.$refs.form.setData('suburbanServices', [])
      this.cityId = data
      this.suburbanServicesVisible()
    },
    handleSearch(data) {
      let searchData = Object.assign({}, data)
      searchData = handleSubmitSearchData(searchData)
      this.searchData = searchData
      this.page = 1
      this.loadTableData()
    },

    handleTemplate(data) {
      this.suburbanServicesData = []
      this.formSettings[0].items.find(
        item => item.name === 'suburbanServices'
      ).hidden = true
      this.formData = data
      if (data) {
        this.rowId = data.id
        let obj = { id: data.id }
        this.$service.getSuburbanServicesDetail(obj).then(res => {
          if (res.data.data.suburbanServices) {
            // this.$refs.form.setData('suburbanServices', res.data.data.suburbanServices.map(item => item.serviceMoney))
            this.suburbanServicesData = res.data.data.suburbanServices
            this.suburbanServicesData.forEach(item => {
              item.name = item.districtName
            })
            this.formSettings[0].items.find(
              item => item.name === 'suburbanServices'
            ).hidden = false

            if (res.data.data.suburbanServices.map) {
              this.formData.suburbanServices = res.data.data.suburbanServices.map(
                item => item.serviceMoney
              )
            } else {
              this.formData.suburbanServices = []
            }
          } else {
            this.formData.suburbanServices = []
          }
          this.templateTitle = 2
          this.templateVisible = true
        })
      } else if (!data) {
        this.templateTitle = 1
        this.templateVisible = true
      }
    },

    carsInfoDict() {
      this.$service.get_carsSelectModelsAll().then(res => {
        let optionsArr = res.data.data
        let newOptionsArr = optionsArr.map(function(val, index) {
          let obj = {}
          obj.value = val.id
          obj.label = val.name
          return obj
        })
        this.formSettings[0].items[0].options = newOptionsArr
        this.searchSettings[1].options = newOptionsArr
      })
    },

    handleSaveTemplate(data) {
      let temObj = { userName: this.user.username, userNickName: this.user.cnName, ...data }

      this.$service.get_operationCityList().then(res => {
        let obj = res.data.data
        for (let i in obj) {
          if (obj.hasOwnProperty(i)) {
            if (obj[i].id === temObj.cityId) {
              temObj.cityName = obj[i].name
            }
          }
        }

        for (let j in this.formSettings[0].items[0].options) {
          if (this.formSettings[0].items[0].options.hasOwnProperty(j)) {
            if (
              this.formSettings[0].items[0].options[j].value ===
              temObj.carGenreId
            ) {
              temObj.carGenreName = this.formSettings[0].items[0].options[j].label
            }
          }
        }

        if (this.templateTitle === 1) {
          let suburbanServicesArr = []
          temObj.suburbanServices = Array.from(
            temObj.suburbanServices.map(function(val, index) {
              let obj = {}
              obj.districtId = index
              obj.serviceMoney = val
              return obj
            })
          )
          for (var i = 0; i < temObj.suburbanServices.length; i++) {
            if (typeof temObj.suburbanServices[i] !== 'undefined') {
              suburbanServicesArr.push(temObj.suburbanServices[i])
            }
          }
          temObj.suburbanServices = suburbanServicesArr
          this.$service.addOrderChargeTemplate(temObj).then(res => {
            this.templateVisible = false
            this.loadTableData()
            this.$message({
              message: '添加成功',
              type: 'success'
            })
          })
        } else {
          temObj.suburbanServices = this.suburbanServicesData
          temObj.suburbanServices = this.suburbanServicesData.map(
            (item, index) => {
              item.serviceMoney = data.suburbanServices[index]
              return item
            }
          )
          let ID = {}
          ID.id = this.rowId
          let obj = { ...ID, ...temObj }
          this.$service.editOrderChargeTemplate(obj).then(res => {
            this.templateVisible = false
            this.loadTableData()
            this.$message({
              message: '编辑成功',
              type: 'success'
            })
          })
        }
      })
    },

    loadTableData() {
      let params = {
        page: this.page,
        pageSize: this.pageSize,
        ...this.searchData
      }
      this.$service.getOrderChargeList(params).then(res => {
        this.tableData = res.data.data.records
        this._changePageTotal(res.data.data.totalElements)
      })
    }
  }
}
</script>
<style lang="scss">

</style>
