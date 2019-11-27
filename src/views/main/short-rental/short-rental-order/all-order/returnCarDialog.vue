<template>
  <el-dialog
    title=""
    :visible.sync="dialogVisible"
    width="420px"
    >
    <div class="all_return_car">
      <div v-if= '!returnSuccess' class="parse_return">
        <div  class="msg">{{message.code}},&nbsp;&nbsp;{{message.msg}}</div>
        <div class="dis">请先确认车辆已拉手刹、熄火、车门车窗已关闭。如果仍然无法还车，你可以强制还车。确定强制还车？</div>
      </div>
      <div v-if= 'returnSuccess' class="set_free">
        <div> 已成功结束订单。</div>
        <div>车辆{{message.carNumber}}设置空闲失败
          <el-button type="text" @click="setFree">手动设置空闲</el-button>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer" v-if= '!returnSuccess'>
      <el-button @click="dialogVisible = false" size="small">取 消</el-button>
      <el-button type="primary" size="small" @click = "parseReturn()">强制归还</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  components: {
  },
  data () {
    return {
      dialogVisible: false,
      returnSuccess: false,
      message: {}
    }
  },
  methods: {
    show (message) {
      this.dialogVisible = true
      this.message = message
    },
    parseReturn () {
      this.$emit('on-parse', 'true')
    },
    setFree() {
      console.log(this.message.carNumber)
      this.$store.commit('sendToTab', {
        name: 'carStatus',
        params: {
          carNumber: this.message.carNumber
        }
      })
      this.dialogVisible = false
    }
  }
}
</script>
<style lang="scss">
.all_return_car {
   .parse_return {
     .msg{
       color: #E6A23C;
       margin-bottom:10px;
       font-size: 15px;
       text-align: center;
     }
     .dis {
       text-indent: 35px;
     }
   }
}
</style>
