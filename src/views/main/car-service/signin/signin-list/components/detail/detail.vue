<template>
  <div class="signin-detail">
    <v-page :visible.sync="visible" :before-close="handleBeforeClose">
      <h3 slot="title">签到记录</h3>
      <div slot="content" v-if="detailData">
        <v-detail :detailSettings="detailSettings" :data="detailData">
          <div slot="district" slot-scope="scope">
            <span v-for="(item, index) in scope.data.userInfo.userDistricts" :key="index">
              {{item.districtName}}
              <span v-if="index < scope.data.userInfo.userDistricts.length - 1">，</span>
            </span>
          </div>
        </v-detail>
        <div class="signin-statistics clearfix">
          <template v-if="detailData.collectionInfo.count === '未签到'">
            <strong>{{currentDate}}</strong>
            <span>今天暂未签到</span>
          </template>
          <template v-else>
            <strong>{{detailData.collectionInfo.signDate}}</strong>
            <span>共签到{{detailData.collectionInfo.count}}次&nbsp;&nbsp;&nbsp;网点内签到{{detailData.collectionInfo.count-outsideSignTimes}}次，站外签到{{outsideSignTimes}}次</span>
          </template>
          <el-button-group style="float:right">
            <el-button type="primary" size="small" icon="el-icon-arrow-left" @click="handleClickPrevious">上一天</el-button>
            <el-button type="primary" size="small" :disabled="disableNext" @click="handleClickNext">下一天
              <i class="el-icon-arrow-right el-icon--right"></i>
            </el-button>
          </el-button-group>
        </div>
        <signinMap :signInfoList="signInfoList"></signinMap>
      </div>
    </v-page>
  </div>
</template>

<script>
import vDetail from '@/components/detail/v-detail'
import detailSettings from './detailSettings'
import signinMap from './signin-map'
import dayjs from 'dayjs'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    signinData: {
      type: Object
    }
  },

  components: {
    vDetail,
    signinMap
  },

  data() {
    return {
      detailData: null,
      detailSettings,
      currentDate: null
    }
  },

  computed: {
    signInfoList() {
      if (this.detailData) {
        return this.detailData.signInfoList
      }
      return []
    },
    outsideSignTimes() {
      if (this.detailData && this.detailData.signInfoList.length) {
        return this.detailData.signInfoList.filter(
          item => item.signTypeVal === 'outside'
        ).length
      }
      return 0
    },
    disableNext() {
      if (!this.currentDate) {
        return true
      }
      if (this.currentDate == dayjs().format('YYYY-MM-DD')) {
        return true
      }
      return false
    }
  },

  methods: {
    handleBeforeClose() {
      this.detailData = null
      this.currentDate = null
      this.$emit('update:visible', false)
      return false
    },
    loadDetailData() {
      if (this.signinData) {
        if (!this.currentDate) {
          this.currentDate = this.signinData.collectionInfo.signDate
        }
        this.$service
          .getSigninDetail(this.signinData.userInfo.sn, this.currentDate)
          .then(res => {
            this.detailData = res.data.data
          })
      }
    },
    handleClickPrevious() {
      this.currentDate = dayjs(
        new Date(new Date(this.currentDate) - 24 * 60 * 60 * 1000)
      ).format('YYYY-MM-DD')
      this.loadDetailData()
    },
    handleClickNext() {
      this.currentDate = dayjs(
        new Date(new Date(this.currentDate) - 0 + 24 * 60 * 60 * 1000)
      ).format('YYYY-MM-DD')
      this.loadDetailData()
    }
  },

  watch: {
    visible() {
      if (this.visible) {
        this.loadDetailData()
      }
    }
  },

  mounted() {
    this.loadDetailData()
  }
}
</script>

<style lang="scss">
.signin-detail {
  .signin-statistics {
    margin: 0 0 20px;
    max-width: 800px;
    > span {
      margin: 0 20px;
    }
  }
  .z-detail{
    padding: 0;
    .detail-section>ul{
      padding-left: 0;
    }
  }
}
</style>
