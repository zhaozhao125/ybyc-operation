<template>
  <el-form :formData="formData" label-width="80px">
    <div align="center">确定结束反馈？</div>
    <div align="center" class="spacingx">
      <el-button  type="primary" @click="submitCloasFeedback">确 定</el-button>
      <el-button  @click="cancelSubmit">取 消</el-button>
   </div>
  </el-form>
</template>
<script>
  import searchSelect from "@/components/website-select";
  import { handleSubmit } from "@/utils/common.js";
  import api from '@/service/api/'

  export default {
    name: "close-feedbackpro",
    props: {
      formData: {
        type: Object,
        require: true
      },
    },
    data() {
      return {
        admin:{},
        type:'',
        url:'',
        isLongCarReduceShow:false,
        isTimeshareReduceShow:false,
        isPayshow:true,
        orderType:'',
      };
    },
    created() {
      this.initData();
    },
    mounted() {
      this.$nextTick(() => {});
    },
    methods: {
      submitCloasFeedback(){
        // 提交反馈订单
        console.dir('提交反馈订单');
        console.dir(this.formData);

        if(this.formData.problem_type_txt.length <= 0){
          this.formData.problem_type_txt = '车辆/充电桩'
        }
        let msg = '你反馈的'+ this.formData.problem_type_txt +'问题，我们已经收到并处理，感谢你对一步用车的支持！';

        let params = {
          user_id: this.formData.user_id,
          user_message_title:'问题反馈回复',
          user_message_content:msg
        }

        this.$service.closeFeedbackpro(params).then(res => {});
        // 对应更新数据状态
        let postData = {
          user_feedback_problem_id:this.formData.user_feedback_problem_id,
          handel_status:3
        }
        this.$service.changeFeedbackpro(postData).then(res => {
          this.successSubmit();
        });
      },

      cancelSubmit() {
        //取消操作
        this.$emit('closeAndRefresh', 'cancel')
      },
      initData(){
        this.admin = this.$store.getters.user;
      },

      successSubmit() {
        this.$message({
          type: "success",
          message: '操作成功！'
        });
        this.$emit("closeAndRefresh");
      },
    },

    components: {
      searchSelect
    }
  };
</script>
<style lang="scss">
  .moveleft{
    margin-left: -15px;
  }
  .spacingx{
    margin-top: 30px;
  }
  .el-button + .el-button {
    margin-left: 80px;
  }
</style>
