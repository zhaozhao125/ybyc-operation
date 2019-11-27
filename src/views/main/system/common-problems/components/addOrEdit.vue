<template>
  <div id="car-info-edit-or-edit">
    <!-- <pre>{{formData}}</pre> -->
    <v-form :formSettings="formSettings"
            @save="submitSave"
            ref="vform"
            @cancel="cancelSubmit"
            :formData="formData"
    >
    </v-form>
  </div>
</template>
<script>
  import vForm from '@/components/form/vForm'
  import searchSelect from '@/components/website-select'
  import { handleDictData, handleSubmit, handleData } from '@/utils/common.js'
  import websiteSelect from '@/components/website-select'
  import api from '@/service/api/'

  export default {
    name: 'add-or-edit',
    props: {
      formData:{
        type: Object,
        require: true
      },
    },
    components: {
      vForm,
      searchSelect,
      websiteSelect,
    },

    data() {
      return {
        formSettings: [
          {
            label: '',
            items: [
              {
                label: '问题标题',
                name: 'question_title',
                type: 'text',
                required: true,
                valueType: 'string'
              },
              {
                label: '问题内容',
                name: 'question_content',
                type: 'textarea',
                required: true
              },
            ]
          },

        ],
      }
    },
    mounted () {
    },

    methods: {

      showMsg(msg){
        // 信息提示
        this.$message({
          showClose: true,
          message: msg
        });
        return false;
      },

      // 设置对应的位置
      cancelSubmit() {
        this.$emit('closeAndRefresh', 'cancel')
      },
      // 保存字段
      submitSave(addObj) {

        let url = api.CommonproblemsAdd;
        let timeTmp = new Date();
        let timeStr = timeTmp.getFullYear()
            +'-'
            +(timeTmp.getMonth()+1)
            +'-'
            +timeTmp.getDate()
            +' '
            +timeTmp.getHours()
            +':'
            +timeTmp.getMinutes()
            +':'
            +timeTmp.getSeconds();

        if(this.formData.question_id > 0){
          url = api.CommonproblemsUpdate;

          
          addObj.modified_on = timeStr

          addObj.modified_by = this.$store.state.user.username;
          addObj.question_id = this.formData.question_id;
        } else {
          addObj.created_by = this.$store.state.user.username;
          addObj.created_on = timeStr
        }

        this.$service.CommonproblemsChange(url, addObj)
          .then(res => {
            this.successSubmit();
          })
          .catch(error => {
            this.$message.warning(error.msg)
          })

      },
      // 页面提示 + 触发父级事件
      successSubmit(msg={type:'success',msg:'操作成功'}, fatherEvent='closeAndRefresh') {
        this.$message({
          type: msg.type,
          message: msg.msg
        });
        // 关闭页面 并且刷新列表
        this.$emit(fatherEvent)
      },

      selectPlaceChange(item) {
        if (item === 0) {
          this.$refs.vform.$refs.vForm.clearValidate()
        }
      }
    },

  }
</script>
<style lang="scss" >
  #car-info-edit-or-edit {
    .free_test {
      .el-form-item {
        .el-form-item__label {
          line-height:40px
        }
        .el-input__inner {
          height:32px;
          line-height:32px
        }
      }
    }
    .select-content {
      display: flex;
      margin-left: -65px;
      margin-top: -10px;
      .select-name {
        padding-right: 8px;
        color: #5a5e66;
        white-space: nowrap;
      }
      .select-website-item {
        width: 100%;
      }
      .el-select {
        width: 100%;
      }
    }
  }
  .fixWid{
    width: 214px;
    display: inline-block;
    text-align: center;
  }

</style>
