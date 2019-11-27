<template>
  <div class="v-search" @keyup.enter.stop="onEnter">
    <el-form v-if="formModel" :inline="false" :label-width="labelWidth" :model="formModel" class="search-form" :size="size" ref="searchForm">
      <el-row :gutter="10">
        <el-col :md="8" :sm="12" :xs="24" v-for="(item, index) in searchSettings" :key="index" v-show="item.visible || showAll" v-if="item.hide?false:true">
          <el-form-item :label="item.label" :prop="item.name" style="max-width: 440px;">
            <!-- 文本框 -->
            <template v-if="item.type=='text'">
              <el-input v-model.trim="formModel[item.name]" :placeholder="item.placeholder"></el-input>
            </template>
            <!-- 下拉框 -->
            <template v-else-if="item.type=='select'">
              <el-select v-model="formModel[item.name]" :placeholder="item.placeholder" :multiple="item.multiple" :clearable="true" :disabled="item.disabled" @change="(item.events&&item.events.change)?$emit(item.events.change, formModel[item.name]):null">
                <template v-if="item.options">
                  <el-option v-for="(optionItem, optionIndex) in item.options" :key="optionIndex" :label="optionItem.label" :value="optionItem.value"></el-option>
                </template>
                <template v-else>
                  <el-option label="是" value="1"></el-option>
                  <el-option label="否" value="0"></el-option>
                </template>
              </el-select>
            </template>
            <!-- 级联选择器 -->
            <template v-else-if="item.type=='cascader'">
              <el-cascader expand-trigger="click" :change-on-select="item.changeOnSelect" :options="item.options" v-model="formModel[item.name]" :clearable="true"></el-cascader>
            </template>
            <!-- 日期选择 -->
            <template v-else-if="item.type=='date'">
              <el-date-picker v-model="formModel[item.name]" type="date" :placeholder="item.placeholder || '选择日期'" :picker-options="dateOptions" :value-format="item.valueFormat">
              </el-date-picker>
            </template>
            <!-- 日期范围选择器 -->
            <template v-else-if="item.type=='daterange'">
              <el-date-picker v-model="formModel[item.name]" type="daterange" align="right" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="dateRangeOptions" :disabled="item.disabled">
              </el-date-picker>
            </template>
              <!-- 月份选择器 -->
            <template v-else-if="item.type=='month'">
              <el-date-picker v-model="formModel[item.name]" type="month" :placeholder="item.placeholder || '选择日期'"  :value-format="item.valueFormat"  clear-icon = ''>
              </el-date-picker>
            </template>
            <!-- 带输入建议文本框 -->
            <template v-else-if="item.type=='autocomplete'">
              <el-autocomplete class="inline-input" v-model.trim="formModel[item.name]" :fetch-suggestions="item.querySearch" :placeholder="item.placeholder"></el-autocomplete>
            </template>
            <!-- 本地城市 - 登录时获取的城市数据，设置enableAuth为true带权限功能 -->
            <template v-else-if="item.type=='city'">
              <!--
              multiple: 是否支持多选，默认 false
              clearable: 是否可清空选择，默认 false
              enableAuth: 是否使用城市权限控制，默认 false
              enableOtherCity: 是否带有“其他”选项，默认 false
              enableAllCity: 是否显示“全部”选项（当有该权限时），默认 true
               -->
              <city-select v-model="formModel[item.name]" :placeholder="item.placeholder" :multiple="item.multiple" :clearable="item.clearable"  :enableAuth="item.enableAuth" :enableOtherCity="item.enableOtherCity" :enableAllCity="item.enableAllCity" @change="(item.events&&item.events.change)?$emit(item.events.change):null"></city-select>
            </template>
            <!--城市远程搜索-->
            <template v-else-if="item.type=='remoteCity'">
              <website-select v-model="formModel[item.name]" type="city" :placeholder="item.placeholder" @change="(item.events&&item.events.change)?$emit(item.events.change):null" :clearable="false"></website-select>
            </template>
            <!--角色远程搜索-->
            <template v-else-if="item.type=='remoteRole'">
              <website-select v-model="formModel[item.name]" type="role" :placeholder="item.placeholder" @change="(item.events&&item.events.change)?$emit(item.events.change):null"></website-select>
            </template>
            <!--角色远程搜索-->
            <template v-else-if="item.type=='remoteCarServiceRole'">
              <website-select v-model="formModel[item.name]" type="carServiceRole" :placeholder="item.placeholder" @change="(item.events&&item.events.change)?$emit(item.events.change):null"></website-select>
            </template>
            <!--自定义label & 文本框-->
            <template v-else-if="item.type=='labelSelectText'">
              <span slot="label">
                <el-select v-model="item.optionValue">
                  <el-option v-for="(optionItem, optionIndex) in item.options" :key="optionIndex" :label="optionItem.label" :value="optionItem.value"></el-option>
                </el-select>
              </span>
              <el-input v-model.trim="formModel[item.name]" ref='labelSelectInput' :placeholder="item.placeholder"></el-input>
            </template>
            <!--自定义label & 城市搜索-->
            <template v-else-if="item.type=='labelSelectCity'">
              <span slot="label">
                <el-select v-model="item.optionValue">
                  <el-option v-for="(optionItem, optionIndex) in item.options" :key="optionIndex" :label="optionItem.label" :value="optionItem.value"></el-option>
                </el-select>
              </span>
              <city-select v-model="formModel[item.name]" :placeholder="item.placeholder" :multiple="item.multiple" :clearable="item.clearable" :enableAuth="item.enableAuth" :enableOtherCity="item.enableOtherCity" :enableAllCity="item.enableAllCity" @change="(item.events&&item.events.change)?$emit(item.events.change):null"></city-select>
            </template>
            <!--自定义label & 日期范围选择器-->
            <template v-else-if="item.type=='labelSelectDateRange'">
              <span slot="label">
                <el-select v-model="item.optionValue">
                  <el-option v-for="(optionItem, optionIndex) in item.options" :key="optionIndex" :label="optionItem.label" :value="optionItem.value"></el-option>
                </el-select>
              </span>
              <el-date-picker v-model="formModel[item.name]" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="dateRangeOptions">
              </el-date-picker>
            </template>
            <!--自定义label & 网点远程搜索-->
            <template v-else-if="item.type=='labelSelectRemote'">
              <span slot="label">
                <el-select v-model="item.optionValue">
                  <el-option v-for="(optionItem, optionIndex) in item.options" :key="optionIndex" :label="optionItem.label" :value="optionItem.value"></el-option>
                </el-select>
              </span>
              <website-select v-model="formModel[item.name]" :placeholder="item.placeholder" isRequest></website-select>
            </template>
            <template v-else-if="item.type=='remoteStation'">
              <website-select v-model="formModel[item.name]" :placeholder="item.placeholder" isRequest></website-select>
            </template>
            <!-- slot自定义内容 -->
            <template v-else-if="item.type=='slot'">
              <slot :name="item.name" :model="formModel"></slot>
            </template>
          </el-form-item>
        </el-col>
        <el-col :md="8" :sm="12" :xs="24" style="float:right">
          <el-form-item label-width="0" style="text-align:right">
            <el-button type="primary" @click="onSearch">搜索</el-button>
            <el-button @click="onReset" v-if="!hideReset">重置</el-button>
            <el-button type="text" @click="handleShowAll" v-if="invisibleItemCount">
              {{showAll?'简单搜索':'高级搜索'}}
              <i v-if="showAll" class="el-icon-arrow-up"></i>
              <i v-else class="el-icon-arrow-down"></i>
            </el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
/**
 * searchSettings类型：
    text 基本文字input
    select 下拉列表
    cascader 级联选择器
    daterange 时间范围
    autocomplete 自动填充搜索记录（需配合mixin中的search-history使用）
    remoteCity 运营城市，自动从服务器端获取数据
    labelSelectText 前面带下拉选择的输入框
    labelSelectDateRange 前面带下拉选择的日期
    labelSelectRemote 前面带下拉选择的网点搜索
    slot

 * searchSettings示例
 [{
  label: '搜索',
  name: 'selectText',
  type: 'labelSelectText', // 表单前带下拉选择的input
  placeholder: '请输入',
  visible: true, // 是否默认显示该项
  optionValue: 'mobile', // 下拉框的默认值，同options中的value对应
  options: [{ // 下拉框的侯选值
    label: '手机号码',
    value: 'mobile'
  }, {
    label: '姓名',
    value: 'name'
  }, {
    label: '用户编号',
    value: 'sn'
  }]
}, {
  label: '城市',
  name: 'areaId',
  type: 'remoteCity', // 远程获取城市列表
  events: { // 定义在该项上的事件
    change: 'changeCity' // 当该项值改变时，会emit名为changeCity的事件
  },
  visible: true
}, {
  label: '片区',
  name: 'districtId',
  type: 'slot', // slot类型，可自定义内容
  visible: false
}, {
  label: '角色',
  name: 'userType',
  type: 'select', // 下拉列表类型
  placeholder: '不限',
  multiple: true, // 是否可多选
  options: [{
    label: '运维人员',
    value: 'OFFICIAL'
  }, {
    label: '网点负责人',
    value: 'STATION'
  }, {
    label: '众包人员',
    value: 'UNOFFICIAL'
  }],
  visible: false
}, {
  label: '添加时间',
  name: 'createTime',
  type: 'daterange', // 时间范围类型
  unixTime: true // 是否返回10位时间戳
}, {
  type: 'labelSelectDateRange',
  placeholder: '请选择时间',
  name: 'selectDate',
  optionValue: 'date', // 默认选中
  options: [{
    label: '下单时间',
    value: 'date'
  }, {
    label: '取车时间',
    value: 'startDate'
  }, {
    label: '还车时间',
    value: 'returnDate'
  }],
  visible: true,
  unixTime: true, // 是否返回10位时间戳
  default: [new Date('2018-02-02'), new Date()], // 默认日期（点重置后依然有效）
  value: [new Date('2018-02-02'), new Date()] // 默认日期（点重置后清空）
}, {
  label: '积分变更时间',
  name: 'createdTime',
  type: 'daterange',
  return: { // 日期范围返回值自定义
    name: {
      dateStart: 'dateStart', // 开始日期字段名
      dateEnd: 'dateEnd' // 结束日期字段名
    },
    format: 'YYYY-MM-DD' // 返回值格式，参考http://dayjsjs.com/docs/#/parsing/string-format/
  }
}]
 */
import websiteSelect from '@/components/website-select'
import citySelect from '@/components/city-select'
import dayjs from 'dayjs'

export default {
  name: 'vSearch',
  components: {
    websiteSelect,
    citySelect
  },
  props: {
    // 表单项配置
    searchSettings: {
      type: Array,
      required: true
    },
    // 表单lable宽度
    labelWidth: {
      type: String,
      default: '90px'
    },
    // 表单元素尺寸（medium / small / mini）
    size: {
      type: String,
      default: 'small'
    },
    // 是否隐藏重置按钮
    hideReset: {
      type: Boolean,
      default: false
    },
    // 是否在表单提交时过滤掉值为空的数据
    filterBlank: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      formModel: null,
      showAll: false, // 是否显示所有表单项
      dateOptions: {
        shortcuts: [
          {
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date())
            }
          },
          {
            text: '昨天',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24)
              picker.$emit('pick', date)
            }
          }
        ]
      },
      dateRangeOptions: {
        // 日期范围快捷选择
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      }
    }
  },

  computed: {
    // 隐藏项的数量
    invisibleItemCount() {
      if (this.searchSettings) {
        return this.searchSettings.filter(item => !item.visible).length
      }
      return 0
    }
  },

  mounted() {
    this.updateForm()
  },

  methods: {
    // 根据searchSettings更新表单显示
    updateForm() {
      if (this.searchSettings) {
        let tmpModel = {}
        this.searchSettings.forEach(item => {
          if (
            item.type === 'daterange' ||
            item.type === 'cascader' ||
            item.multiple
          ) {
            tmpModel[item.name] = []
          } else {
            tmpModel[item.name] = ''
          }
          if (item.type === 'autocomplete' && !item.querySearch) {
            item.querySearch = (queryString, cb) => {
              let result = queryString
                ? item.data.filter(
                  item =>
                    item.value
                      .toLowerCase()
                      .indexOf(queryString.toLowerCase()) > -1
                )
                : item.data
              if (item.limit && result.length > item.limit) {
                return cb(result.slice(0, item.limit))
              }
              cb(result)
            }
          }
          if (item.type === 'selectSearch') {
            tmpModel[item.name + 'Option'] = item.options[0].value
          }
          // if (item.type === 'city' && item.enableAuth) {
          //   tmpModel[item.name] = this.$store.getters.defaultCityId
          // }
          if (item.type === 'remoteCity' && this.$store.getters.authedCities) {
            tmpModel[item.name] = this.$store.getters.defaultCityId
          }
          if (item.default !== undefined) {
            tmpModel[item.name] = item.default
          }
        })
        this.formModel = tmpModel
        // 为了调用resetFields方法时能将所有默认值得表单项清空
        // 必须在给表单默认model后，修改model为配置的默认值才可
        this.$nextTick(() => {
          this.searchSettings.forEach(item => {
            if (item.value) {
              this.formModel[item.name] = item.value
            }
          })
        })
      }
    },
    // 点击搜索时触发
    onSearch() {
      // 将formModel拷贝一份
      let data = Object.assign({}, this.formModel)
      this.searchSettings.forEach(item => {
        if (item.type === 'daterange' || item.type === 'labelSelectDateRange') {
          if (!data[item.name] || data[item.name].some(item => !item.getTime)) {
            data[item.name] = ''
          } else if (
            data[item.name] &&
            data[item.name].length > 1
          ) {
            // 将时间的第二个时间改为当天23:59
            let date0 = data[item.name][0]
            let date1 = data[item.name][1]
            date0.setHours(0)
            date0.setMinutes(0)
            date0.setSeconds(0)
            date1.setHours(23)
            date1.setMinutes(59)
            date1.setSeconds(59)
            if (item.return) {
              let dateStart = 'dateStart'
              let dateEnd = 'dateEnd'
              if (item.return.name) {
                dateStart = item.return.name.dateStart || dateStart
                dateEnd = item.return.name.dateEnd || dateEnd
              }
              if (item.return.format) {
                data[dateStart] = dayjs(date0).format(item.return.format)
                data[dateEnd] = dayjs(date1).format(item.return.format)
              } else {
                data[dateStart] = date0
                data[dateEnd] = date1
              }
              delete data[item.name]
            } else if (item.unixTime) {
              data[item.name] = [
                Math.floor(date0 / 1000),
                Math.floor(date1 / 1000)
              ]
            } else {
              data[item.name] = [date0, date1]
            }
          }
          if (typeof data[item.name] === 'object' && data[item.name].length === 0) {
            data[item.name] = ''
          }
        }
        // 处理输入前带下拉的数据
        if (
          item.type === 'labelSelectText' ||
          item.type === 'labelSelectCity' ||
          item.type === 'labelSelectDateRange' ||
          item.type === 'labelSelectRemote'
        ) {
          data[item.optionValue] = data[item.name]
          delete data[item.name]
        }
      })
      // 过滤值为空的数据
      if (this.filterBlank) {
        let tmpData = {}
        Object.keys(data).forEach(key => {
          if ((data[key] !== '' && data[key] !== undefined && data[key] !== null) && (Array.isArray(data[key]) ? data[key].length > 0 : true)) {
            tmpData[key] = data[key]
          }
        })
        data = tmpData
      }
      this.$emit('search', data)
    },
    onReset() {
      // 加nextTick的原因：用户管理查看积分跳转到用户积分记录时，
      // 会先调用重置搜索，此时搜索组件还未mount，获取不到refs
      this.$nextTick(() => {
        this.$refs.searchForm.resetFields()
        this.$emit('reset')
      })
    },
    handleShowAll() {
      this.showAll = !this.showAll
    },
    onEnter() {
      this.onSearch()
    },
    updateSearchHistory(name, data) {
      if (this.searchSettings[name]) {
        this.searchSettings[name].data = data
      } else {
        throw new Error('updateSearchHistory：找不到对应搜索项')
      }
    },
    insertSearchHistory(name, data) {
      if (this.searchSettings[name]) {
        if (
          !this.searchSettings[name].data ||
          !this.searchSettings[name].data.length
        ) {
          this.searchSettings[name].data = []
        }
        this.searchSettings[name].data.unshift(data)
      } else {
        throw new Error('updateSearchHistory：找不到对应搜索项')
      }
    },
    /**
     * 设置下拉列表数据
     * name: formSetting中的name
     * data: label/value数组
     */
    setSelectData(name, data) {
      let target = this.searchSettings.find(item => item.name == name)
      if (target) {
        target.options = data
        target.disabled = false
      } else {
        throw new Error('vSearch:设置下拉数据失败，找不到对应项')
      }
    },
    /**
     * 设置指定项的值
     */
    setItemData(name, data) {
      if (typeof name == 'object') {
        Object.keys(name).forEach(item => {
          this.formModel[item] = name[item]
        })
      } else {
        this.formModel[name] = data
      }
    }
  },

  watch: {
    searchSettings() {
      this.updateForm()
    }
  }
}
</script>
<style lang="scss">
.v-search {
  padding-right: 20px;
  margin-bottom: -18px;
  .el-select,
  .el-cascader,
  .el-autocomplete {
    display: block;
  }
  .el-date-editor {
    width: 100% !important;
    white-space: nowrap;
    .el-range-separator {
      width: 10%;
    }
    .el-range__close-icon {
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      margin: auto;
    }
  }
  .el-col {
    float: none;
    display: inline-block;
  }
  .el-form-item__content {
    position: relative;
  }
}

@media screen and (max-width: 1280px) {
  .v-search {
    padding-right: 0;
  }
}
</style>
