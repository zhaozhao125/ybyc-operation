<template>
   <el-dialog
    title=""
    :visible.sync="dialogVisible"
    width="420px"
    class="add_car_line_net"
    >
    <v-form :formSettings="formSettings" @save="submitSave" ref="vform" :showButton=false class="add_line_net" >
      <template slot="stationId" slot-scope="scope">
        <div  class="select-content">
          <!-- <span class="select-name">请选择线上网点</span> -->
          <span class="select-website-item">
            <search-select v-model="scope.model.stationId" placeholder="请输入上线网点名称" isRequest @selectItemId='getSelectItemId'></search-select>
          </span>
        </div>
      </template>
      <el-form-item slot="bottom-slot" class="btn">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="save" >确定</el-button>
      </el-form-item>
    </v-form>
    <!-- <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false" size="small">取 消</el-button>
      <el-button type="primary" @click="dialogVisible = false" size="small">确 定</el-button>
    </span> -->
  </el-dialog>
</template>
<script>
import vForm from '@/components/form/vForm'
import searchSelect from '@/components/website-select'
export default {
  components: {
    vForm,
    searchSelect
  },
  data() {
    let selectWebsiteRule = (rule, value, callback) => {
      if (!value) {
        if (this.$refs.vform.formModel.open === 0) {
          callback()
        } else {
          callback(new Error('请输入上线网点名称'))
        }
      } else {
        callback()
      }
    }
    return {
      dialogVisible: false,
      carInfor: {},
      formSettings: [
        {
          items: [
            {
              label: '请输入上线网点',
              name: 'stationId',
              type: 'slot',
              rule: [
                {
                  validator: selectWebsiteRule,
                  trigger: 'change,blur'
                },
                {
                  required: true,
                  trigger: 'change,blur'
                }
              ]
            }
          ]
        }
      ],
    }
  },
  methods: {
    show (val) {
      this.carInfor = val
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.vform.formModel.stationId = ''
      })
    },
    submitSave () {
    },
    getSelectItemId () {
    },
    save () {
      this.$refs.vform.getDataAsync().then((data) => {
        if (!data) {
          return
        }
        let params = Object.assign(data, this.carInfor)
        this.addOnline(params)
      }).catch((err) => {
        console.log('====err====', err)
      })
    },
    addOnline (params) {
      this.$service.post_carInfoAdd(params).then(res => {
        this.$message.success('添加车辆成功!')
        this.dialogVisible = false
        this.$emit('closeAndRefresh')
      }).catch(error => {
        this.$message.warning(error.msg)
      })
    }
  }
}
</script>
<style lang="scss">
.add_car_line_net {
   .el-dialog__header{
     padding: 0px;
   }
   .el-dialog__body {
     padding-top:0px;
     padding-bottom: 8px;
    }
   .add_line_net {
     .btn {
       .el-form-item__content {
         text-align: right;
       }
     }
     .el-form {
       .form-section {
         padding-bottom: 10px;
         margin-bottom: 0px;
         border-bottom: none;
         .section-content {
           .el-form-item__label {
             width:100% !important;
             text-align: left;
           }
           .el-form-item__content {
             margin-left: 0px !important;
           }
         }
       }
     }
   }
}
</style>
