<template>
  <div class="z-detail">
    <!-- <pre>{{data}}</pre> -->
    <div class="detail-section" v-for="(section, sectionIndex) in detailSettings" :key="sectionIndex" v-show="sectionVisible(section, data)">
      <h4>{{section.label}}</h4>
      <ul>
        <li v-for="(item, index) in section.items" :key="index" class="detail-item" :class="{'color-red': item.color=='red'}" v-if="itemVisible(item, data)">
          <div class="item-label" :class="'align-' + labelAlign" :style="computedLabelWidth">{{item.label?item.label+'：' : ''}}</div>
          <div class="item-value">
            <!-- 图片类型 -->
            <template v-if="item.type == 'image' && data[item.value]">
              <vGallery :imgs="(data[item.value].push)?data[item.value]:[data[item.value]]" :descriptionType="item.descriptionType || 'tooltip'" :imgDescription="data[item.value + 'ImgDescription']">
              </vGallery>
            </template>
            <!-- slot类型 -->
            <template v-else-if="item.type == 'slot'">
              <slot :name="item.name || item.value" :data="data"></slot>
            </template>
            <!-- 多层嵌套数据 -->
            <template v-else-if="item.value.includes('.')">
              <template v-if="typeof data[item.value.split('.')[0]] == 'object' && data[item.value.split('.')[0]].length">
                <span v-for="(it, itIndex) in data[item.value.split('.')[0]]" :key="itIndex">{{it[item.value.split('.')[1]]}}
                  <i v-if="item.divider && data[item.value.split('.')[0]].length-itIndex>1">{{item.divider}}</i>
                </span>
              </template>
              <template v-else>
                <span>{{data[item.value.split('.')[0]][item.value.split('.')[1]]}}</span>
              </template>
            </template>
            <!-- value有映射关系 -->
            <template v-else-if="item.map">{{item.map[data[item.value]]}}</template>
            <!-- value为数组，自动分隔 -->
            <template v-else-if="data[item.value] && typeof data[item.value] == 'object' && data[item.value].length">
              <span v-for="(it, itIndex) in data[item.value]" :key="itIndex">{{it}}
                <i v-if="item.divider && data[item.value].length-itIndex>1">{{item.divider}}</i>
              </span>
            </template>
            <!-- value为time -->
            <template v-else-if="item.type=='time'">
              <span>{{data[item.value]|timeFilter}}</span>
            </template>
            <!-- 默认 -->
            <template v-else>
              <span>{{data[item.value]}}</span>
              <!-- value有后缀 -->
              <span class="detail-append" v-if="data[item.value] && item.append">{{item.append}}</span>
            </template>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
/**
   * [detailSettings示例]
[{
  label: '订单信息',
  items: [{
    label: '用户名',
    value: 'username'
  }, {
    label: '手机号',
    visibleControl: (data) => {
      return data.orderStatus === 'returned'
    },
    value: 'mobilePhone'
  }, {
    label: '网点',
    value: 'userStations.stationName',
    divider: '、',
    autoHide: true
  }, {
    label: '状态',
    value: 'ready',
    map: {
      true: '开工',
      false: '收工'
    }
  }]
}, {
  label: '违章信息',
  items: [{
    label: '违章时间',
    value: 'carViolationInfo.time'
  }, {
    label: '凭证图片',
    value: 'voucherImage',
    type: 'image'
  }]
}] */
// visibleControl可传入function或者object控制item的显示隐藏
import vGallery from '@/components/gallery/vGallery'
export default {
  props: {
    detailSettings: {
      type: Array
    },
    data: {
      type: [Object, Array]
    },
    labelWidth: {
      type: [Number, String]
    },
    labelAlign: {
      type: String,
      default: 'right'
    }
  },

  components: {
    vGallery
  },

  data() {
    return {}
  },

  computed: {
    computedLabelWidth() {
      if (!this.labelWidth) {
        return ''
      }
      if (typeof this.labelWidth === 'number') {
        return 'width:' + this.labelWidth + 'px'
      }
      if (typeof this.labelWidth === 'string') {
        return 'width:' + this.labelWidth
      }
      return ''
    }
  },

  methods: {
    sectionVisible(section, data) {
      if (!section.visibleControl) {
        return true
      }

      if (typeof section.visibleControl === 'function') {
        return section.visibleControl(data)
      }
      if (typeof section.visibleControl === 'object') {
        return section.visibleControl.value === data[section.visibleControl.name]
      }
    },
    itemVisible(item, data) {
      if (!item.autoHide && !item.visibleControl) {
        return true
      } else if (item.autoHide) {
        let value = data[item.value.split('.')[0]]
        if ((value && !value.push) || (value && value.push && value.length)) {
          return true
        }
      } else if (item.visibleControl) {
        if (typeof item.visibleControl === 'function') {
          return item.visibleControl(data)
        }
        if (typeof item.visibleControl === 'object') {
          return item.visibleControl.value === data[item.visibleControl.name]
        }
      }
      return false
    }
  }
}
</script>
<style lang="scss">
.z-detail {
  // padding-left: 70px;
  // padding-right: 70px;
  .detail-section {
    &:not(:first-child) {
      padding-top: 30px;
      border-top: 1px solid #ededed;
    }
    > ul {
      padding: 20px 20px 20px 50px;
      font-size: 15px;
    }
    .detail-item {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      &.color-red {
        color: $color-red;
      }
      .item-label {
        width: 130px;
        color: $color-detail;
        text-align: right;
        margin-right: 15px;
        &.align-left {
          text-align: left;
        }
      }
      .item-value {
        flex: 1;
        overflow: hidden;
        white-space: normal;
        word-wrap: break-word;
      }
    }
  }
}
</style>
