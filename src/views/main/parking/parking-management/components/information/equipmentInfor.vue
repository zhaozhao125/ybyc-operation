<template>
  <div>
    <!-- 可增加 x-no-colon 类禁用label后的冒号 -->
    <div class="x-data-detail">
      <div class="x-detail-block">
        <h4 class="x-detail-title">设备信息</h4>
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
import { equipmentInfor } from './inforSetting'
export default {
  data () {
    return {
      equipmentInfor
    }
  },
  computed: {
    settings: function () {
      this.equipmentInfor.forEach((ele) => {
        ele.value = this.detailData[ele.name]
      })
      return this.equipmentInfor
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