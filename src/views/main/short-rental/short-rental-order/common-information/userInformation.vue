<template>
  <div class="user_information">
    <!-- 可增加 x-no-colon 类禁用label后的冒号 -->
    <div class="x-data-detail">
      <div class="x-detail-block">
        <h4 class="x-detail-title">用户信息</h4>
        <el-row :gutter="10">
          <el-col :xs="24" :sm="12" :md="8">
            <div class="x-detail-item">
              <div class="x-label">姓名</div>
              <div class="x-value">{{userInformation.userName}}</div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <div class="x-detail-item">
              <div class="x-label">手机号</div>
              <div class="x-value">{{userInformation.userPhone}}</div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" class="card">
            <div class="x-detail-item">
              <div class="x-label">租车卡</div>
              <div class="x-value">
                 <span v-if="!userInformation.rentCardPrintNumber">未绑定</span>
                 <span v-if="userInformation.rentCardPrintNumber">{{userInformation.rentCardPrintNumber}}</span>
                 <el-button type="text" @click="bindCard(userInformation.rentCardPrintNumber)" v-if="!userInformation.hasBindCard && (userInformation.orderStatus === 'subscribed' || userInformation.orderStatus === 'rent') && $_has(authority.bindCard)" class="ml_10">绑定</el-button>
                 <el-button type="text" @click="bindCard(userInformation.rentCardPrintNumber)" v-if="userInformation.hasBindCard && (userInformation.orderStatus === 'subscribed' || userInformation.orderStatus === 'rent') && $_has(authority.bindCard)" class="ml_10">换卡</el-button>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  components: {
  },
  data () {
    return {
      infor: {},
      dialogVisible: false
    }
  },
  mounted () {
  },
  methods: {
    bindCard (cardNumber) {
      this.$emit('on-showUser', cardNumber)
      // this.dialogVisible = true
    }
  },
  props: {
    userInformation: {
      default: {},
      type: Object
    },
    authority: {
      default: {},
      type: Object
    }
  }
}
</script>
<style lang="scss">
  .user_information {
    .card {
      .ml_10{
        margin-left: 10px;
      }
    }
  }
</style>


