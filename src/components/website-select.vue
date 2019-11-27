<template>
  <section class="all-website">
    <el-select v-model="currentValue" @change="selectChange" @clear='clearItem' @input="handleInput" :remote-method="remoteMethod" :no-data-text='noDataText' :loading="loading" :remote='isRequest?true:false' :filterable='isRequest?true:false' :clearable="clearable" :placeholder="placeholder" default-first-option :value-key="integratedValue?'value':null" @focus='focusChange' :disabled="disabled">
      <el-option v-for="item in newListData" :key="item.value" :label="item.label" :value="integratedValue?item:item.value">
      </el-option>
    </el-select>
  </section>
</template>

<script>
import { resultSelectData } from '@/utils/common'
import _debounce from 'lodash/debounce'
export default {
  name: 'websiteSelect',
  props: {
    open: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    // 没有用组组件的情况下控制权限
    authedCities: {
      type: Boolean,
      default: false
    },
    isShowAll: {
      type: Boolean,
      default: true
    },
    // 是否是运维远程搜索
    isOperationRemote: {
      type: Boolean,
      default: false
    },
    // 是否是优惠券远程搜索
    isCouponsRemote: {
      type: Boolean,
      default: false
    },
    counponsUserId: {
      type: String,
      default: ''
    },
    // 定义value
    value: {
      type: [Number, String, Object]
    },
    type: {
      type: String,
      default: 'website'
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    areaId: Number,
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
    },
    // 防止没有远程搜索的时候显示加载中
    noRemote: {
      type: Boolean,
      default: false
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
      noDataText: '加载中',
      loading: false,
      araeData: [], // 片区数据
      currentValue: this.value || '',
      newIsRequest: false,
      newListData: []
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (this.isRequest || this.noRemote) {
        return
      }
      this.selectList()
    })
  },
  methods: {
    // input获取焦点时触发
    focusChange() {
      this.$emit('focusChange')
    },
    // 远程搜索 输入关键字时会调用此方法
    remoteMethod: _debounce(function (name) {
      if (name !== '') {
        this.loading = true
        let remote = true
        // 如果是运维远程搜索
        if (this.isOperationRemote) {
          this.$service.getRatchetUsers({
            name,
            areaId: this.areaId
          }).then(res => {
            this.$emit('isRemote', true)
            // console.log(res.data.data.records, 'haha')
            this.newListData = res.data.data.records.map(item => {
              return {
                value: item.sn,
                label: `${item.name}    ${item.ready ? '开工' : '收工'}    ${item.userType === 'OFFICIAL' ? '运维人员' : item.userType === 'STATION' ? '网点负责人' : '众包人员'}`
              }
            })
            this.handleDataText()
          })
        } else if (this.isCouponsRemote) {
          this.$service.isAssignedCoupons({
            name,
            userId: this.counponsUserId
          }).then(res => {
            this.newListData = resultSelectData(res.data.data)
            this.handleDataText()
          })
        } else {
          this.$service.post_allWebSite(name, null, remote, this.open).then(res => {
            this.newListData = resultSelectData(res.data.data)
            this.handleDataText()
          })
        }
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
    handleDataText() {
      this.loading = false
      if (!this.newListData.length) {
        this.noDataText = '无数据'
      } else {
        this.noDataText = '加载中'
      }
    },
    // 选择列表项触发
    selectChange(id) {
      this.$emit('change', id)
      this.$emit('selectItemId', id)
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
      } else if (this.type === 'carServiceRole') {
        // 角色列表接口
        this.$service.getRoleIndex().then(res => {
          res.data.data.forEach(item => {
            item.id = item.id
            item.name = item.roleName
          })
          this.newListData = resultSelectData(res.data.data)
        })
      } else {
        if (this.authedCities) {
          this.newListData = this.$store.getters.authedCities.filter(item => {
            return item.value !== 999
          })
          return
        }
        if (this.isShowAll) {
          console.log(this.$store.getters.authedCities)
          this.newListData = this.$store.getters.authedCities
        } else {
          // 不显示下拉全部字段
          this.newListData = this.$store.getters.authedCities.filter(item => {
            return item.value !== 999
          })
        }
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
.all-website {
  .el-select {
    // display: block;
    width: 100%;
    // margin-bottom: 5px;
  }
  //        .el-form-item__error{
  //   margin-top: 20px ;
  //   color: #787878;
  // }
}
</style>
