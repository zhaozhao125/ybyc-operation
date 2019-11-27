<template>
  <div class="recharge-card-editor">
    <v-page :visible.sync="visible" :before-close="closeMe">
      <h3 slot="title">{{formData.name ? "编辑充值卡" : "添加充值卡"}}</h3>
      <v-form slot="content" ref="form" :formSettings="formSettings" :formData="formData" label-width="150px" @save="handleSave">

        <template slot="faceValue" slot-scope="scope">
          <div class="number-with-append">
            <el-input-number v-model="scope.model.faceValue" :disabled="!isDisabled" placeholder="请输入" :controls='false' :min="0" :max="99999999" class="number-with-append">
              <template slot="append">元</template>
            </el-input-number>
          </div>
        </template>
        <template slot="issueNumber" slot-scope="scope">
          <div class="number-with-append">
            <el-input-number v-model="scope.model.issueNumber" :disabled="!isDisabled" placeholder="请输入" :controls=false :min="1" :max="99999" class="number-with-append">
              <template slot="append">张</template>
            </el-input-number>

            <span>（1~99999）</span>
          </div>
        </template>
        <template slot="useCountLimit" slot-scope="scope">
          <div class="number-with-append">
            <el-input-number v-model="scope.model.useCountLimit" placeholder="请输入" :controls=false :min="0" :max="99999999" class="number-with-append">
              <template slot="append">次</template>
            </el-input-number>
            <span>（0为不限制）</span>
          </div>

        </template>
      </v-form>
    </v-page>
  </div>

</template>

<script>
import formSettings from './formSettings.js'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    formData: {
      type: Object
    }
  },
  data() {
    return {
      lock: true, // 防止重复提交定义锁
      formSettings
    }
  },
  computed: {
    isDisabled() {
      return JSON.stringify(this.formData) === '{}'
    }
  },
  watch: {
    formData(data) {
      if (data.startDate) {
        data.sendingTime = [data.startDate, data.endDate]
      }
      if (data.cityPermitIds) {
        data.cityPermitIds = data.cityPermitIds.split(',')
      }
    }
  },
  methods: {
    closeMe() {
      this.$emit('update:visible', false)
      this.$emit('close')
      return false
    },
    handleSave(data) {
      if (this.$refs.form.formModel.remark.length > 1000) {
        this.$message.warning('备注不能超过1000字')
        return
      }
      if (!this.lock) { // 2.判断该锁是否打开，如果是关闭的，则直接返回
        return false
      }
      this.lock = false // 3.进来后，立马把锁锁住
      data.startDate = data.sendingTime[0].getTime()
      data.endDate = data.sendingTime[1].getTime()
      delete data.sendingTime
      data.operator = this.$store.getters.user.username
      data.operatorNickName = this.$store.getters.user.cnName
      data.cityPermitIds = data.cityPermitIds.join(',')
      if (data.cityPermitIds == '999') {
        data.cityPermitIds = ''
      }
      if (this.formData.id) {
        data.id = this.formData.id
        console.log('====edit data====', data)
        this.$service.updateRechargeCard(data).then(res => {
          if (res.data.code == '0') {
            this.$message({
              message: '编辑成功',
              type: 'success'
            })
            this.closeMe()
          }
        }).catch(() => {
        }).then(() => {
          console.log('====complete====')
          this.lock = true
        })
      } else {
        console.log('====add data====', data)
        this.$service.createRechargeCard(data).then(res => {
          if (res.data.code == '0') {
            this.$message({
              message: '添加成功',
              type: 'success'
            })
            this.closeMe()
          }
        }).catch(() => {

        }).then(() => {
          this.lock = true
        })
      }
    }
  }
}
</script>

<style lang="scss">
.recharge-card-editor {
  .number-with-append {
    display: flex;
    align-items: center;
  }
}
</style>
