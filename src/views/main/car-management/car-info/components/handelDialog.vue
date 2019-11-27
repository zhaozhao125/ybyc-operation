<template>
   <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    width="420px"
    class="car_status_handel"
    >
    <!-- 置为上线 -->
    <v-form :formSettings="formSettings" @save="submitSave" ref="vform" :showButton=false class="line_net"  v-if="statusType === 'onLine'">
      <template slot="stationId" slot-scope="scope">
        <div  class="select-content">
          <!-- <span class="select-name">请选择线上网点</span> -->
          <span class="select-website-item">
            <search-select v-model="scope.model.stationId" placeholder="请输入上线网点名称" isRequest @selectItemId='getSelectItemId'></search-select>
          </span>
        </div>
      </template>
      <el-form-item slot="bottom-slot" class="online_btn">
          <el-button   @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="webSetsave">确定</el-button>
      </el-form-item>
    </v-form>
    <!-- 下线 -->
    <el-form ref="form"  label-width="0px" class = "car_infor_handel" v-if="statusType === 'outLine'">
        <el-form-item label="" style="margin-top:15px">
           <span>！请谨慎操作</span>
        </el-form-item>
        <el-form-item label="">
          <el-radio-group v-model="businessStatus">
              <el-radio label= '401'>报废</el-radio>
              <el-radio label= '402' >售出</el-radio>
          </el-radio-group>
        </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer" v-if="statusType === 'outLine'">
      <el-button @click="dialogVisible = false" size="small">取 消</el-button>
      <el-button type="primary"  size="small" @click="confirmOutLine">确 定</el-button>
    </span>
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
  data () {
    let selectWebsiteRule = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入上线网点名称'))
      } else {
        callback()
      }
    }
    return {
      dialogVisible: false,
      businessStatus: '401',
      statusType: 'outLine',
      carSn: '',
      title: '请选择车辆下线原因',
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
                  trigger: "change,blur"
                }
              ]
            }
          ]
        }
      ]
    }
  },
  methods: {
    // 车辆状态改变
    carStatusSet (params) {
      this.$service.carStatusSet(params).then((res) => {
        this.$message.success('修改成功')
        this.$emit('on-statusSuccess')
        this.dialogVisible = false
      }).catch((res) => {
      })
    },
    show (typeObj) {
      this.dialogVisible = true
      this.title = typeObj.type === 'outLine' ? '请选择车辆下线原因' : '上线运营'
      this.statusType = typeObj.type
      this.carSn = typeObj.carSn
      if (this.$refs.vform) {
        this.$refs.vform.formModel.stationId = ''
      }
    },
    submitSave () {
    },
    getSelectItemId () {
    },
    confirmOutLine () {
      let objCarsn = {
        carSn: this.carSn,
        businessStatus: this.businessStatus
      }
      this.carStatusSet(objCarsn)
    },
    webSetsave () {
      this.$refs.vform.getDataAsync().then((data) => {
        if (!data) {
          return
        }
        let objCarsn = {
          carSn: this.carSn,
          businessStatus: 200
        }
        let obj = Object.assign(data, objCarsn)
        this.carStatusSet(obj)
      }).catch((err) => {
        console.log('====err====', err)
      })
    }
  }
}
</script>
<style lang="scss">
  .car_status_handel {
    .el-dialog__body {
      padding-top: 0px;
    }
    .el-form {
      .form-section {
        border: none;
        padding-bottom: 0px;
        .section-content {
           .el-form-item__label {
             width:100% !important;
             text-align: left;
           }
           .el-form-item__content {
             margin-left:0px !important;
           }
        }
      }
      .online_btn {
        margin-bottom: -10px;
        text-align: right;
      }
    }
    .car_infor_handel {
      .el-form-item {
        margin-bottom: 0px
      }
      .el-form-item__label {
        line-height: 32px;
      }
      .el-form-item__content {
        line-height: 32px;
        input {
          height: 32px;
        }
      }
    }
  }
</style>


