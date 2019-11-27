<template>
  <div class="add-plans">
      <!-- <h4>基本信息</h4> -->
      <v-form ref="form" slot="content" :formSettings="formSettings" :showButton="false" class="edit_add_form">
        <!-- 编辑器 -->
        <template slot="activityDescUrl" slot-scope="scope">
          <v-editor ref="editor" @change="handleEditorChange" :content="planInforMation?planInforMation.activityDescUrl:''"></v-editor>
        </template>
        <!-- 车型 -->
        <template slot="carTypes" slot-scope="scope">
           <el-select v-model="scope.model.carTypes" placeholder="请选择" multiple>
              <el-option v-for="item in carLists" :key="item.value" :label="item.label" :value="item"></el-option>
            </el-select>
        </template>
        <template slot="timeText" slot-scope="scope" class="plan_during">
             <el-time-picker
                v-model="periodStartTime"
                placeholder="选择开始时间">
              </el-time-picker>
              <span class="time_zhi">至</span>
              <el-time-picker
                v-model="periodEndTime"
                placeholder="选择结束时间">
              </el-time-picker>
        </template>
        <!-- 金额 -->
        <template slot="amount" slot-scope="scope">
           <el-input-number v-model="scope.model.amount" :controls=false placeholder="套餐金额"></el-input-number>
           <span style="color: #606266">（套餐金额仅减免订单租金，不计免赔、城郊/跨城服务费等服务费用不作减免）</span>
        </template>
        <!-- 排序 -->
        <template slot="sorting" slot-scope="scope">
           <el-input-number v-model="scope.model.sorting" controls-position="right" :min="0"></el-input-number>
        </template>
        <el-form-item slot="bottom-slot">
          <el-button type="primary"  @click="addEditPlan()">保存</el-button>
        </el-form-item>
      </v-form>
  </div>
</template>
<script>
import formSettings from './formSetting.js'
import searchStation from '@/components/search-station/'
import vEditor from '@/components/editor/'
export default {
  name: 'add-plans',
  props: {
    getParams: Object,
    planInforMation: Object,
    planType: {
      default: '',
      type: String
    }
  },
  components: {
    searchStation,
    vEditor
  },

  data() {
    // formSettings[0].items[0].rule = [{
    //   validator: this.planNameCheck,
    //   trigger: 'blur',
    //   required: true
    // }]
    formSettings[0].items[2].rule = [{
      validator: this.activityInfor,
      trigger: 'change',
      required: true
    }]
    formSettings[1].items[2].rule = [{
      validator: this.timeRange,
      trigger: 'change',
      required: true
    }]
    return {
      formSettings,
      carLists: [],
      content: '',
      periodStartTime: '',
      periodEndTime: ''
    }
  },
  mounted() {
    this.getCarList()
    if (JSON.stringify(this.planInforMation) !== '{}') {
      this.$nextTick(() => {
        let form = this.$refs.form
        form.setData('packageName', this.planInforMation.packageName)
        form.setData('packageDecription', this.planInforMation.packageDecription)
        form.setData('activityDescUrl', this.planInforMation.activityDescUrl)
        form.setData('packageIconUrl', [this.planInforMation.packageIconUrl])
        form.setData('cityId', this.planInforMation.cityId)
        form.setData('carTypes', this.carTypeChange(this.planInforMation.carGenreName.split(','), this.planInforMation.carGenreIdentify.split(','), this.planInforMation.carGenreId.split(',')))
        this.periodEndTime = new Date(this.planInforMation.periodEndTime)
        this.periodStartTime = new Date(this.planInforMation.periodStartTime)
        form.setData('amount', this.planInforMation.amount)
        form.setData('planDuring', [new Date(this.planInforMation.startTime), new Date(this.planInforMation.endTime)])
        form.setData('isOpen', this.planInforMation.isOpen ? 1 : 0)
        form.setData('sorting', this.planInforMation.sorting)
      })
    } else {
      this.$refs.form.setData('amount', undefined)
      this.$refs.form.setData('sorting', 0)
    }
  },
  methods: {
    timeRange (rule, value, callback) {
      if (!this.periodStartTime) {
        return callback(new Error('请选择套餐开始时间'))
      } else if (!this.periodEndTime) {
        return callback(new Error('请选择套餐结束时间'))
      } else {
        callback()
      }
    },
    activityInfor (rule, value, callback) {
      if (!value) {
        return callback(new Error('请输入活动介绍'))
      } else if (this.$refs.form.formModel.activityDescUrl.length > 60000) {
        return callback(new Error('活动介绍不能超过60000个字'))
      } else {
        callback()
      }
    },
    carTypeChange (name, code, id) {
      let resoult = []
      for (let i = 0; i < code.length; i++) {
        resoult.push({
          label: name[i],
          code: code[i],
          value: id[i] ? parseInt(id[i]) : ''
        })
      }
      return resoult
    },
    getCarList () {
      this.$service.carList().then(res => {
        res.data.data.forEach((ele) => {
          this.carLists.push({
            label: ele.name,
            code: ele.code,
            value: ele.id
          })
        })
      })
    },
    handleEditorChange(html) {
      if (html === '<p><br></p>') {
        html = ''
      } else if (html.length > 10) {
      }
      this.$refs.form.setData('activityDescUrl', html)
    },
    // planNameCheck(rule, value, callback) {
    //   if (!value) {
    //     return callback(new Error('请输入套餐名称'))
    //   } else if (this.$refs.form.getData('packageName') === this.planInforMation.packageName) {
    //     callback()
    //   } else {
    //     let obj = {
    //       packageName: this.$refs.form.getData('packageName')
    //     }
    //     if (JSON.stringify(this.planInforMation) !== '{}') {
    //       obj.packageId = this.planInforMation.packageId
    //       this.$service.planNameCheckeEdit(obj).then(res => {
    //         if (res.data.data === 0) {
    //           callback()
    //         } else {
    //           callback(new Error('套餐名不能重复'))
    //         }
    //       }).catch(err => {
    //         callback(new Error('查询套餐失败'))
    //       })
    //     } else {
    //       this.$service.planNameCheck(obj).then(res => {
    //         // let result = res.data
    //         if (res.data.data === 0) {
    //           callback()
    //         } else {
    //           callback(new Error('套餐名不能重复'))
    //         }
    //       }).catch(err => {
    //         callback(new Error('查询套餐失败'))
    //       })
    //     }
    //   }
    // },
    addEditPlan() {
      this.$refs.form.getDataAsync().then(data => {
        if (!data) {
          return
        }
        data.packageIconUrl = data.packageIconUrl[0].url
        data.periodStartTime = Date.parse(this.periodStartTime)
        data.periodEndTime = Date.parse(this.periodEndTime)
        data.startTime = Date.parse(data.planDuring[0])
        data.endTime = Date.parse(data.planDuring[1])
        data.carGenreIdentify = data.carTypes.map((ele) => {
          return ele.code
        }).join()
        data.carGenreName = data.carTypes.map((ele) => {
          return ele.label
        }).join()
        data.carGenreId = data.carTypes.map((ele) => {
          return ele.value
        }).join()
        let city = JSON.parse(window.sessionStorage.getItem('loginData')).cityModels.filter((ele) => {
          return ele.id === data.cityId
        })
        data.cityName = city[0].name
        delete data.planQuantum
        delete data.planDuring
        delete data.line
        delete data.carTypes
        if (JSON.stringify(this.planInforMation) !== '{}') {
          data.packageId = this.planInforMation.packageId
        }
        // 城市选择全部时cityId为998
        if (data.cityId === 999) {
          data.cityId = 998
          data.cityName = '全部'
        }

        if (this.planType === 'addTimeShare') {
          data.createdBy = this.$store.state.user.username
        } else if (this.planType === 'editTimeShare') {
          data.modifiedBy = this.$store.state.user.username
        }

        this.$service[this.planType](data).then((res) => {
          this.$message.success('保存成功！')
          this.$emit('on-hideAdd')
        }).catch((res) => {
        })
      }).catch(err => {
        console.log('====err====', err)
      })
    },
    handleSelectStation(data) {
      this.selectedStation = data
      this.$refs.form.setData('destinationStationId', data.id)
    }
  }
}
</script>
<style lang="scss">
.add-plans {
  .v-form {
    max-width: 900px;
    .el-form {
      .form-section:nth-child(2) {
        .section-content {
           .el-form-item:nth-child(3){
              .time_zhi {
                padding-left:20px;;
                padding-right: 20px;
                font-size: 13px;
              }
              .el-form-item__content {
                  display: flex;
                  .el-date-editor {
                    .el-input__inner {
                      text-align: center;
                    }
                  }
              }
           }
        }
      }
    }
  }
}
</style>
