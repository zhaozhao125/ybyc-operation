<template>
  <div>
    <!-- 可增加 x-no-colon 类禁用label后的冒号 -->
    <div class="x-data-detail">
      <div class="x-detail-block">
        <h4 class="x-detail-title">基本信息</h4>
        <el-row :gutter="10">
          <el-col :xs="24" :sm="12" :md="8" v-for="(item, index) in settings" :key='index'>
            <div class="x-detail-item" v-if = "item.type === 'normal'" >
              <div class="x-label">{{item.label}}</div>
              <div class="x-value">{{item.value}}</div>
            </div>
            <div class="x-detail-item" v-else>
              <div class="x-label">{{item.label}}</div>
              <div class="x-value">
                <slot :name="item.name" ></slot>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
import editInput from '@/components/edit-input'
import { handleDate } from '@/utils/date-filter'
import { inforSettings } from './inforSetting'
export default {
  data () {
    return {
      inforSettings
    }
  },
  computed: {
    settings: function () {
      this.inforSettings.forEach((ele) => {
        ele.value = this.detailData[ele.name]
      })
      let arr = this.inforSettings.filter((ele) => {
        if ((this.detailData.businessStatus === 200 || this.detailData.businessStatus === 300) ) {
          return ele
        } else if (ele.name !== 'association') {
          return ele
        } else {
          return
        }
      })
      return arr
    }
  },
  mounted () {
  },
  components: {
    editInput
  },
  methods: {
  },
  props: {
    detailData: {
      default: {},
      type: Object
    }
  }
}
</script>