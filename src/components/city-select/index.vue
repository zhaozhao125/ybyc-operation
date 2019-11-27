<template>
  <el-select v-model="currentValue" :placeholder="placeholder" :multiple="multiple" :clearable="clearable" @change="handleSelectChange">
    <template v-if="enableAuth">
      <el-option v-for="(optionItem, optionIndex) in authedCities" :key="optionIndex" :label="optionItem.label" :value="optionItem.value" :disabled="optionItemDisabled(optionItem)"></el-option>
    </template>
    <template v-else>
      <el-option v-for="(optionItem, optionIndex) in allCities" :key="optionIndex" :label="optionItem.label" :value="optionItem.value" :disabled="optionItemDisabled(optionItem)"></el-option>
    </template>
  </el-select>
</template>

<script>
const OTHER_CITY_ID = 100
const ALL_CITY_ID = 999
export default {
  props: {
    value: {
      type: [String, Number, Array]
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    // 是否支持多选
    multiple: {
      type: Boolean,
      default: false
    },
    // 是否可清空
    clearable: {
      type: Boolean,
      default: false
    },
    // 是否使用城市权限控制
    enableAuth: {
      type: Boolean,
      default: false
    },
    // 是否带有“其他”选项（只有全部显示的时候，其他才会显示）
    enableOtherCity: {
      type: Boolean,
      default: false
    },
    // 是否显示“全部”选项（当有该权限时）
    enableAllCity: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      currentValue: this.multiple ? [] : null,
      selectedOtherCity: false,
      selectedAllCity: false,
      otherCityId: OTHER_CITY_ID
    }
  },

  computed: {
    // 开启城市权限的城市列表
    authedCities() {
      let ret = this.$store.getters.authedCities
      if (this.enableOtherCity && this.enableAllCity && ret.some(item => item.value == ALL_CITY_ID)) {
        ret = ret.concat([
          {
            label: '其他',
            value: OTHER_CITY_ID
          }
        ])
      }
      if (!this.enableAllCity) {
        ret = ret.filter(item => item.value != ALL_CITY_ID)
      }
      return ret
    },
    // 全部城市列表
    allCities() {
      let ret = this.$store.getters.allCities
      if (this.enableOtherCity && this.enableAllCity && ret.some(item => item.value == ALL_CITY_ID)) {
        ret = ret.concat([
          {
            label: '其他',
            value: OTHER_CITY_ID
          }
        ])
      }
      if (!this.enableAllCity) {
        ret = ret.filter(item => item.value != ALL_CITY_ID)
      }
      return ret
    }
  },

  mounted() {
    let valueIsArray = Array.isArray(this.value)
    if ((valueIsArray && this.value.length) || (!valueIsArray && this.value)) {
      try {
        if (valueIsArray) {
          this.currentValue = this.value.map(item => parseInt(item))
        } else {
          this.currentValue = parseInt(this.value)
        }
      } catch (err) {
        throw new Error('city-select：传入的参数不合法')
      }
    } else if (this.enableAuth) {
      let defaultCityId = this.$store.getters.defaultCityId
      if (!this.enableAllCity) {
        if (this.authedCities[0]) {
          defaultCityId = this.authedCities[0].value
        } else {
          defaultCityId = ''
        }
      }
      if (this.multiple) {
        this.currentValue = [defaultCityId]
      } else {
        this.currentValue = defaultCityId
      }
      console.log('====this.currentValue====', this.currentValue)
      this.$emit('input', this.currentValue)
    }
  },

  watch: {
    value(newVal) {
      this.currentValue = newVal
    }
  },

  methods: {
    optionItemDisabled(item) {
      if (!this.multiple) {
        return false
      }
      if (this.selectedOtherCity && item.value !== OTHER_CITY_ID) {
        return true
      }
      if (this.selectedAllCity && item.value !== ALL_CITY_ID) {
        return true
      }
      return false
    },
    handleSelectChange(val) {
      if (this.multiple) {
        if (val.some(item => item == OTHER_CITY_ID)) {
          this.selectedOtherCity = true
          this.selectedAllCity = false
          this.currentValue = [OTHER_CITY_ID]
          this.$emit('input', this.currentValue)
          this.$emit('change', this.currentValue)
          return
        }
        if (val.some(item => item == ALL_CITY_ID)) {
          this.selectedAllCity = true
          this.selectedOtherCity = false
          this.currentValue = [ALL_CITY_ID]
          this.$emit('input', this.currentValue)
          this.$emit('change', this.currentValue)
          return
        }
        this.selectedAllCity = false
        this.selectedOtherCity = false
      }

      this.$emit('input', val)
      this.$emit('change', val)
    }
  }
}
</script>

<style lang="scss">
</style>
