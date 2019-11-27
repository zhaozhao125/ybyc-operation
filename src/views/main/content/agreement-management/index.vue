<template>
  <div id="news-list">
    <el-tabs type="border-card">
      <el-tab-pane label="用户协议">
        <v-editor :content="userAgreementContent?userAgreementContent:''" ref="editor" :height="height" @change="userEditorChange"></v-editor>
        <el-button class="save" @click="userAgreementSave" type="primary">保存</el-button>
      </el-tab-pane>
      <el-tab-pane label="充值协议">
        <v-editor :content="rechargeAgreementContent?rechargeAgreementContent:''" ref="editor1" :height="height" @change="rechargeEditorChange"></v-editor>
        <el-button class="save" @click="rechargeSaveTemplate" type="primary">保存</el-button>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
  import vEditor from '@/components/editor/'

export default {
  name: 'news',
  components: {
    vEditor
  },
  data() {
    return {
      activeName: 'second',
      height:'600px',
      userAgreementContent:'',
      rechargeAgreementContent:'',
    }
  },

  computed: {
    user() {
      return this.$store.getters.user
    }
  },

  methods: {
    loadData(){
      this.$service.getAgreementDetail().then(res => {
        this.userAgreementContent = res.data.data.user_agreement_content.param_value
        this.rechargeAgreementContent = res.data.data.recharge_agreement_content.param_value
        this.$refs.editor.setContent(this.userAgreementContent)
        this.$refs.editor1.setContent(this.rechargeAgreementContent)
      })
    },
    userEditorChange(html) {
      this.userAgreementContent = html
    },
    rechargeEditorChange(html) {
      this.rechargeAgreementContent = html
    },
    userAgreementSave() {
      let param = {userAgreementContent:this.userAgreementContent}
      this.$service.updateUserAgreement(param).then(res => {
        this.$message({
          message: '修改成功',
          type: 'success'
        })
      })
    },
    rechargeSaveTemplate(){
      let param = {rechargeAgreementContent:this.rechargeAgreementContent}
      this.$service.updateRechargeAgreement(param).then(res => {
        this.$message({
          message: '修改成功',
          type: 'success'
        })
      })
    }
  },
  created() {
    this.loadData()
  }
}
</script>
<style lang="scss">
  #news-list{
    .el-tabs__header{
      padding: 0;
    }
    .save{
      margin-left: 20px;
      margin-top: 10px;
    }
  }
</style>
