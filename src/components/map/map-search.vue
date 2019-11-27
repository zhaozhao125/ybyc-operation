<template>
  <div class="search-content">
    <div class="city">
      <span class="name" v-show="isCityName"> 运营城市</span>
      <search-select class="search-select" :style="{width:selectWidth+'px'}" v-model="cityId" type="city" @change='change' placeholder="请选择运营城市" :authedCities='true' @input="handleInput" :clearable='false'></search-select>
       <!-- 片区 -->
      <slot name="district"></slot>
      <slot name="select"></slot>
      <el-button type="primary" @click="refresh">刷新</el-button>
    </div>
    <div class="rigth-content">
      <slot name="detailLoading"></slot>
      <span class="time" v-show="showTime">
        <span v-if="loading">
          刷新中...
          <i class="el-icon-loading"></i>
        </span>
        <i v-else>上次刷新时间：{{refreshTime}}</i>
      </span>
      <slot name="fullScreen"> </slot>
    </div>
  </div>
</template>
<script>
import searchSelect from '@/components/website-select'
import handleDate from '@/utils/date-filter'
export default {
  props: {
    isCityName: {
      type: Boolean,
      default: false
    },
    selectWidth: {
      type: Number,
      default: 400
    },
    value: {
      type: [Number, String, Object],
      required: true
    },
    // 传一个随机数
    changeTime: Number,
    // 是否显示刷新时间
    showTime: {
      type: Boolean,
      default: true
    },
    loading: Boolean
  },
  data() {
    return {
      cityId: this.value ? this.value : this.$store.getters.firstCityId,
      refreshTime: null
    }
  },
  watch: {
    changeTime(newTime) {
      if (newTime) {
        this.refreshTime = handleDate(new Date() / 1000, true)
      }
    }
  },
  methods: {
    change(cityId) {
      this.$emit('change', cityId)
    },
    refresh() {
      this.$emit('refresh')
    },
    handleInput(value) {
      this.cityId = value
      this.$emit('input', value)
    }
  },
  components: {
    searchSelect
  }
}
</script>

<style lang='scss'>
// 地图样式
.search-content {
  z-index: 99;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: $size-padding;
  box-shadow: 0px 0px 3px #666;
  background-color: $color-white;
  padding-left: 43px;
  div {
    display: flex;
  }
  .city {
    white-space: nowrap;
    align-items: center;
    display: flex;
    .name {
      color: #606266;
      padding-right: 10px;
    }
  }

  .search-select {
    width: 300px;
    margin-right: 30px;
  }
  .rigth-content {
    white-space: nowrap;
    display: flex;
    align-items: center;
    .time {
      color: #787878;
      i {
        font-style: normal;
      }
    }
  }
}
@media screen and (max-width: 1350px) {
  .time {
    display: none;
  }
}
</style>
