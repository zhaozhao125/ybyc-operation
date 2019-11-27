<template>
  <section class="all-website">
    <el-select popper-class="activity-coupons-select" v-model="stationName?stationName:currentValue" ref="selectOb" @change="selectChange" @clear='clearItem' @input="handleInput" :remote-method="remoteMethod" :no-data-text='noDataText' :loading="loading" :remote='isRequest?true:false' :filterable='isRequest?true:false' :clearable="clearable" :placeholder="placeholder" default-first-option :value-key="integratedValue?'value':null" :disabled="disabled">

      <el-option v-for="item in newListData" :key="item.value" :label="item.label" :value="integratedValue?item:item.label+'%|%'+item.value+'%|%'+item.amount+'%|%'+item.userGainTimes">
        <div  style="height: 64px">{{ item.label }}
          <div class="couponsList">
            <span style="float: left">{{ usageTypeList[item.usageType] }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.price }}</span>
          </div>
        </div>
      </el-option>
    </el-select>
  </section>
</template>

<script>
import { resultSelectData } from '@/utils/common'
import _debounce from 'lodash/debounce'
export default {
  name: 'selectWebsite',
  props: {
    open: {
      type: Boolean,
      default: true
    },
    stationName: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'website'
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    itemName: {
      type: String,
      required: false
    },
    // 是否要请求接口
    isRequest: {
      type: Boolean,
      default: false,
      required: false
    },
    // 传入的数据
    listData: Array,
    integratedValue: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    value(newValue) {
      this.currentValue = newValue
    },
    listData(newListData) {
      this.newListData = newListData
    }
  },
  data() {
    return {
      usageTypeList: {
        'share': '分时',
        'shortRent': '短长租',
        'charge': '充电'
      },
      noDataText: '加载中',
      loading: false,
      araeData: [], // 片区数据
      currentValue: this.value || '',
      newIsRequest: false,
      newListData: [],
      // 定义value
      value: {
        type: [Number, String, Object]
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (this.isRequest) {
        return
      }
      this.selectList()
    })
  },
  methods: {
    // 远程搜索 输入关键字时会调用此方法
    remoteMethod: _debounce(function (name) {
      if (name !== '') {
        this.loading = true
        this.$service.post_allCouponsList(name, null).then(res => {
          this.newListData = res.data.data.records.map(item => {
            let tmpObj = {
              value: item.id,
              label: item.name,
              usageType: item.usageType,
              amount: item.amount,
              userGainTimes: item.userGainTimes
            }
            if (item.type == 1) {
              tmpObj.price = item.money + '元'
            } else {
              tmpObj.price = (item.discount / 10) + '折'
            }
            return tmpObj
          })
          // console.log(this.newListData)
          this.loading = false
          if (!this.newListData.length) {
            this.noDataText = '无数据'
          } else {
            this.noDataText = '加载中'
          }
        })
      } else {
        this.newListData = []
        this.noDataText = '加载中'
      }
    }, 500),
    // 点击清空按钮
    clearItem() {
      // 点击清空按钮时会先触发选择列表事件
      this.selectChange(null)
    },
    // 清空input
    clearInput() {
      this.currentValue = ''
    },
    // 选择列表项触发
    selectChange(id) {

    },
    // 获取值
    handleInput(sessionId) {
      this.currentValue = sessionId
      // 触发 input 事件，并传入新值
      this.$emit('input', this.currentValue)
    },
    // 请求
    selectList() {
      // 网点列表接口  默认为website
      if (this.type === 'website') {
        this.$service.post_allWebSite().then(res => {
          this.newListData = resultSelectData(res.data.data)
        })
      } else if (this.type === 'role') {
        // 角色列表接口
        this.$service.getRoleList().then(res => {
          res.data.data.forEach(item => {
            item.id = item.userRoleId
            item.name = item.roleName
          })
          this.newListData = resultSelectData(res.data.data)
        })
      } else {
        // 城市列表接口
        // this.$service.get_operationCityList().then(res => {
        //   this.newListData = resultSelectData(res.data.data)
        // })
        // this.newListData = this.$store.getters.authedCities
      }
    }
    // // 处理数据
    // handleData(data) {
    //   this.newListData = resultSelectData(data);
    // }
  }
}
</script>
<style lang="scss">
  .activity-coupons-select{
    .el-select-dropdown__item {
      height: 50px;
      line-height: 13px;
    }
  }

</style>
