<template>
  <div id="short-rental-charge">
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
        <el-button type="primary" size="small" @click="handleTemplate()">添加价格模板</el-button>
      </div>

      <div class="table-container">
        <el-table :data="tableData" height="100%">
          <el-table-column prop="cityName" label="城市"></el-table-column>
          <el-table-column prop="carGenreName" label="车型" min-width="120px"></el-table-column>
          <el-table-column prop="createdTime" label="添加时间" min-width="150px">
            <template slot-scope="scope">
              {{scope.row.createdTime | timeFilter}}
            </template>
          </el-table-column>
          <el-table-column prop="createdByCn" label="添加人"></el-table-column>
          <el-table-column prop="modifiedTime" label="最后修改时间" min-width="150px">
            <template slot-scope="scope">
              {{scope.row.modifiedTime | timeFilter}}
            </template>
          </el-table-column>
          <el-table-column prop="modifiedByCn" label="修改人"></el-table-column>
          <el-table-column label="操作" fixed="right" min-width="100px">
            <template slot-scope="scope">
              <el-button class="el-button--text" type="text" @click="handleTemplate(scope.row,2)">编辑</el-button>
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

      <h3 slot="title">{{templateTitle === 1 ? "新增价格模板" : "编辑价格模板"}}</h3>
      <v-form ref="form" slot="content" :formData="formData" :formSettings="formSettings" :labelWidth="labelWidth" @save="handleSaveTemplate">
        <template slot="carGenreId" slot-scope="scope">
          <div v-show="scope.model.open===1" class="select-content">
            <span class="select-name">选择车型</span>
            <span class="select-website-item">
              <search-select v-model="scope.model.carGenreId" placeholder="请输入车型名称"></search-select>
            </span>
          </div>
        </template>
        <template slot="cityId" slot-scope="scope">
          <website-select v-model="scope.model.cityId" type="city" holder="请输入城市名称" :isShowAll="isShowAll"  style="max-width:600px"></website-select>
        </template>
        <template slot="rentOriginalPrice" slot-scope="scope">
          <el-input placeholder="请输入" v-model.trim.number="scope.model.rentOriginalPrice" style="max-width:300px">
            <template slot="append">元/天</template>
          </el-input>
          （用于APP展示长租价格优惠）
        </template>
        <template slot="ladderPrice" slot-scope="scope">
          <el-table ref="priceTable" :data="ladderPrice" class="price-table" style="width: 100%">
            <el-table-column width="50">

            </el-table-column>
            <el-table-column prop="minRentDays" label="租期（天）" width="150">
              <template slot-scope="scope">
                <div class="el-form-item" data-name="minRentDays">
                  <el-input v-model.trim="scope.row.minRentDays" size="mini" style="width:120px"></el-input>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="rentPrice" label="租金（元）" width="150">
              <template slot-scope="scope">
                <div class="el-form-item" data-name="rentPrice">
                  <el-input v-model.trim.number="scope.row.rentPrice" size="mini" style="width:120px"></el-input>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="insurancePrice" label="基础服务费（元）" width="180">
              <template slot-scope="scope">
                <div class="el-form-item" data-name="insurancePrice">
                  <el-input v-model.trim.number="scope.row.insurancePrice" size="mini" style="width:120px"></el-input>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="carDepositPrice" label="车辆押金（元）" width="150">
              <template slot-scope="scope">
                <div class="el-form-item" data-name="carDepositPrice">
                  <el-input v-model.trim.number="scope.row.carDepositPrice" size="mini" style="width:120px"></el-input>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="violationDepositPrice" label="违章押金（元）" width="150">
              <template slot-scope="scope">
                <div class="el-form-item" data-name="violationDepositPrice">
                  <el-input v-model.trim.number="scope.row.violationDepositPrice" size="mini" style="width:120px"></el-input>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="imprestPrice" label="预付款（元）" width="150">
              <template slot-scope="scope">
                <div class="el-form-item" data-name="imprestPrice">
                  <el-input v-model.trim.number="scope.row.imprestPrice" size="mini" style="width:120px"></el-input>
                </div>
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="120">
              <template slot-scope="scope">
                <el-button v-if="scope.$index !== 0" @click.native.prevent="deleteRow(scope.$index, ladderPrice)" type="text" size="small">
                  删除
                </el-button>
                <el-button v-if="scope.$index === ladderPrice.length - 1" @click.native.prevent="addRow(scope.$index, ladderPrice)" type="text" size="small">
                  添加
                </el-button>
              </template>
            </el-table-column>
          </el-table>
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
    name: 'price-rule',
    components: {
      vPage,
      formGenerator,
      websiteSelect
    },
    mixins: [searchHistoryMixin, paginationMixin],
    data() {
      // 租金原价
      let checkRentOriginalPrice = (rule, value, callback) => {
        this.currentRentOriginalPrice = value
        let checkRentPriceCopy = this.ladderPrice.map((item, index, arr) => {
          return item.rentPrice
        }).every((item, index, arr) => {
          if (isNaN(item)) {
            callback(new Error('请输入数字'))
          }
          return item <= this.currentRentOriginalPrice
        })
        // if (!checkRentPriceCopy) {
        //   return callback(new Error('租金原价需大于等于租金'))
        // }

        if (value === '' || value === null || value === undefined) {
          return callback(new Error('租金原价不能为空'))
        }
        setTimeout(() => {
          if (!Number(value)) {
            callback(new Error('请输入数字'))
          } else {
            if (value < 0) {
              callback(new Error('租金原价不能小于 0'))
            } else {
              callback()
            }
          }
        }, 1000)
      }

      // 判断是否为正整数
      function isPositiveInt(params) {
        let n = Number(params)
        return !isNaN(n) && n % 1 === 0 && n > 0
      }

      // 阶梯价格
      let checkLadderPrice = (rule, value, callback) => {
        value = this.ladderPrice
        let $priceTable = this.$refs.priceTable.$el
        let priceArr = value.map((item, index, arr) => {
          delete item.createdTime
          delete item.modifiedTime
          return item
        })
        // 错误提示文字
        let errMsg = new Set()
        let lastRentDay = -1
        let lastRentPrice = -1
        let lastInsurancePrice = -1
        let lastCarDepositPrice = -1
        let lastViolationDepositPrice = -1
        let lastImprestPrice = -1
        priceArr.forEach((priceItem, priceIndex) => {
          Object.keys(priceItem).forEach(item => {
            let $item = $priceTable.querySelectorAll('.el-table__row')[priceIndex].querySelector(`[data-name=${item}]`)
            if ($item) {
              // 非空判断
              if (priceItem[item] == null || Number(priceItem[item]) < 0) {
                $item.classList.remove('is-success')
                $item.classList.add('is-error')
                errMsg.add('输入值不能为空')
              }
              // else if (!) {
              //   $item.classList.remove('is-success')
              //   $item.classList.add('is-error')
              //   errMsg.add('输入数值必须为大于0的整数')
              // }
              else if (item == 'minRentDays') {
                // 租期为整数
                if (Number(priceItem[item]) <= lastRentDay || !isPositiveInt(priceItem[item])) {
                  $item.classList.remove('is-success')
                  $item.classList.add('is-error')
                  errMsg.add('租期必须为大于上一租期的整数')
                } else {
                  $item.classList.remove('is-error')
                  $item.classList.add('is-success')
                }
                lastRentDay = Number(priceItem[item])
              } else if (item == 'rentPrice') {
                // 租金
                if (Number(priceItem[item]) <= lastRentPrice) {
                  $item.classList.remove('is-success')
                  $item.classList.add('is-error')
                  errMsg.add('租金必须大于上一租金')
                } else {
                  $item.classList.remove('is-error')
                  $item.classList.add('is-success')
                }
                lastRentPrice = Number(priceItem[item])
              }else if (item == 'insurancePrice') {
                // 租金
                if (Number(priceItem[item]) <= lastInsurancePrice) {
                  $item.classList.remove('is-success')
                  $item.classList.add('is-error')
                  errMsg.add('基础服务费必须大于上一项')
                } else {
                  $item.classList.remove('is-error')
                  $item.classList.add('is-success')
                }
                lastInsurancePrice = Number(priceItem[item])
              }else if (item == 'carDepositPrice') {
                // 租金
                if (Number(priceItem[item]) < lastCarDepositPrice) {
                  $item.classList.remove('is-success')
                  $item.classList.add('is-error')
                  errMsg.add('车辆押金必须大于等于上一车辆押金')
                } else {
                  $item.classList.remove('is-error')
                  $item.classList.add('is-success')
                }
                lastCarDepositPrice = Number(priceItem[item])
              }else if (item == 'violationDepositPrice') {
                // 租金
                if (Number(priceItem[item]) < lastViolationDepositPrice) {
                  $item.classList.remove('is-success')
                  $item.classList.add('is-error')
                  errMsg.add('违章押金必须大于等于上一违章押金')
                } else {
                  $item.classList.remove('is-error')
                  $item.classList.add('is-success')
                }
                lastViolationDepositPrice = Number(priceItem[item])
              }else if (item == 'imprestPrice') {
                // 租金
                if (Number(priceItem[item]) < lastImprestPrice) {
                  $item.classList.remove('is-success')
                  $item.classList.add('is-error')
                  errMsg.add('预付款必须大于等于上一预付款')
                } else {
                  $item.classList.remove('is-error')
                  $item.classList.add('is-success')
                }
                lastImprestPrice = Number(priceItem[item])
              }
              // else if (this.currentRentOriginalPrice && item == 'rentPrice' && Number(priceItem[item]) > this.currentRentOriginalPrice) {
              //   $item.classList.remove('is-success')
              //   $item.classList.add('is-error')
              //   errMsg.add('租金需小于等于租金原价')
              // } else {
              //   $item.classList.remove('is-error')
              //   $item.classList.add('is-success')
              // }
            }
          })
        })
        if (errMsg.size) {
          return callback(new Error(Array.from(errMsg).join(', ')))
        }
        callback()
      }
      return {
        labelWidth: '220px',
        tableData: [],
        formData: {},
        currentRentOriginalPrice: null,
        isShowAll: false,
        ladderPrice: [{
          minRentDays: null,
          rentPrice: null,
          insurancePrice: null,
          carDepositPrice: null,
          violationDepositPrice: null,
          imprestPrice: null
        }],
        templateTitle: null,
        templateVisible: false,
        rowId: null,
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
                required: true
              },
              {
                label: '选择城市',
                type: 'slot',
                name: 'cityId',
                required: true
              },
              {
                label: '租金原价',
                type: 'slot',
                name: 'rentOriginalPrice',
                rule: [
                  {
                    validator: checkRentOriginalPrice,
                    trigger: 'blur',
                    required: true
                  }
                ]
              },
              {
                label: '阶梯价格',
                type: 'slot',
                name: 'ladderPrice',
                value: [],
                rule: [
                  {
                    validator: checkLadderPrice,
                    trigger: 'blur',
                    required: true
                  }
                ]
              }
            ]
          }
        ],
        carGenreId: null
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
          this.formData = {}
          this.ladderPrice = [{
            minRentDays: null,
            rentPrice: null,
            insurancePrice: null,
            carDepositPrice: null,
            violationDepositPrice: null,
            imprestPrice: null
          }]
        }
      },
      ladderPrice() {
      }
    },
    methods: {
      handleSearch(data) {
        let searchData = Object.assign({}, data)
        searchData = handleSubmitSearchData(searchData)
        this.searchData = searchData
        this.page = 1
        this.loadTableData()
      },
      loadTableData() {
        this.pageSize = 50
        let params = {
          page: this.page,
          pageSize: this.pageSize,
          ...this.searchData,
          orderType: 'longRent'
        }
        console.log(params)
        this.$service.priceRuleList(params).then(res => {
          this.tableData = res.data.data.records
          this._changePageTotal(res.data.data.totalElements)
        })
      },
      handleTemplate(data) {
        if (data) {
          this.templateTitle = 2
          this.rowId = data.id
          let params = { 'priceRuleId': data.id }
          console.log(params)
          this.$service.priceRuleInfo(params).then(res => {
            this.formData = res.data.data
            this.formData.items.forEach((item, index) => {
              item.index = index
            })
            this.ladderPrice = this.formData.items
            this.currentRentOriginalPrice = this.formData.rentOriginalPrice
            this.templateVisible = true
          })
        } else {
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
        console.log('提交数据' + data)
        let operator = { operator: this.user.username }
        let temObj = { ...operator, ...data }
        temObj.orderType = 'longRent'

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
            temObj.items = this.ladderPrice
            delete temObj.ladderPrice
            console.log(temObj)
            this.$service.priceRuleSave(temObj).then(res => {
              this.templateVisible = false
              this.loadTableData()
              this.$message({
                message: '添加成功',
                type: 'success'
              })
            })
          } else {
            temObj.priceRuleId = this.rowId
            temObj.items = this.ladderPrice.map(item => {
              delete item.index
              delete item.createdTime
              delete item.modifiedTime
              return item
            })
            delete temObj.ladderPrice
            console.log(temObj.items)
            this.$service.priceRuleSave(temObj).then(res => {
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
      deleteRow(index, rows) {
        rows.splice(index, 1)
        this.ladderPrice = rows
        this.$refs.form.clearValidate()
      },
      addRow(index, rows) {
        let newArr = {
          minRentDays: null,
          rentPrice: null,
          insurancePrice: null,
          carDepositPrice: null,
          violationDepositPrice: null,
          imprestPrice: null
        }
        rows.push(newArr)
      }
    }
  }
</script>
<style lang="scss">
  #short-rental-charge {
    .v-form {
      max-width: 1360px;
    }
    .v-form .el-form-item__content > .el-select, .v-form .el-form-item__content > .el-cascader, .v-form .el-form-item__content > .el-date-editor{
      max-width: 600px;
    }
  }
</style>
