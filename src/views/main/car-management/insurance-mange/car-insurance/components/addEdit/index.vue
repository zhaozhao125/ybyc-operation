<template>
  <div class="add-edit-insurance">
      <!-- <h4>基本信息</h4> -->
      <v-form ref="form" slot="content" :formSettings="formSettings" :showButton="false" class="edit_add_form">
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
        <!-- 保费 -->
        <template slot="premium" slot-scope="scope">
          <el-input-number v-model="scope.model.premium" :controls=false :precision="2" placeholder="保费"></el-input-number>
           <span style="color: #606266"> 元</span>
        </template>
        <!-- 保费返利 -->
        <template slot="rebateRate" slot-scope="scope">
           <el-input-number v-model="scope.model.rebateRate" :controls=false :precision="2" placeholder="保险返利"></el-input-number>
           <span style="color: #606266"> %</span>
        </template>
        <template slot="carList" slot-scope="scope">
           <el-table
            :data="tableData4"
            style="width: 100%"
            class = "carList"
           >
            <el-table-column
              prop="date"
              label=" *车牌号"
              min-width="150">
              <template slot-scope = "scope">
                <div>
                   <el-input v-model.trim="scope.row.carNumber" size="mini" style="width:120px" placeholder="请输入车牌号"></el-input>
                   <el-button type = "text" @click = "searchCar(scope.row, scope.$index)">查询</el-button>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="name"
              label="*城市"
              min-width="120">
              <template slot-scope = "scope">
                  <website-select v-model="scope.row.carCityId"  type="city" holder="请输入城市" :isShowAll= 'isShowAll'></website-select>
              </template>
            </el-table-column>
            <el-table-column
              prop="province"
              label="*车辆类别"
              min-width="120">
              <template slot-scope = "scope">
                  <el-select v-model="scope.row.carUseFor" placeholder="请选择">
                    <el-option
                      v-for="item in carUseFor"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
              </template>
            </el-table-column>
            <el-table-column
              prop="city"
              label="*所属车型"
              min-width="120">
              <template slot-scope = "scope">
                  <el-select v-model="scope.row.carModelCode" placeholder="请选择">
                    <el-option
                      v-for="item in carModel"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
              </template>
            </el-table-column>
            <el-table-column
              prop="zip"
              label="*车架号"
              min-width="120">
              <template slot-scope = "scope">
                <div>
                   <el-input v-model.trim="scope.row.carVin" size="mini" style="width:120px" placeholder="请输入车架号"></el-input>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              width="120">
              <template slot-scope="scope">
                <el-button @click.native.prevent="deleteRow(scope.$index, tableData4)" type="text" size="small" v-if = "scope.$index !== 0 || (scope.$index === 0 && tableData4.length > 1)">删除</el-button>
                <el-button @click.native.prevent="addRow(scope.$index, tableData4)" type="text" size="small" v-if = "scope.$index === tableData4.length - 1">添加车辆</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
        <el-form-item slot="bottom-slot">
          <el-button type="primary"  @click="addEditPlan()">确定</el-button>
        </el-form-item>
      </v-form>
  </div>
</template>
<script>
import { searchSettings } from '../search-settings.js'
import formSettings from './formSetting.js'
import searchStation from '@/components/search-station/'
import websiteSelect from '@/components/website-select'
import commonMethods from '../../mixin'
export default {
  mixins: [commonMethods],
  name: 'add-plans',
  props: {
    insurance: Object,
    type: {
      default: '',
      type: String
    }
  },
  components: {
    searchStation,
    websiteSelect
  },

  data() {
    formSettings[1].items[0].rule = [{
      validator: this.carCheck,
      trigger: 'change',
      required: true
    }]
    formSettings[0].items[5].rule = [{
      validator: this.timeCheck,
      required: true
    }]
    return {
      isShowAll: false,
      searchSettings,
      formSettings,
      carLists: [],
      carUseFor: [
        {
          label: '销售',
          value: 'sale'
        }, {
          label: '租赁',
          value: 'rent'
        }

      ],
      carModel: [],
      tableData4: [
        {
          carNumber: '',
          carCityId: '',
          carUseFor: '',
          carModelCode: '',
          carVin: ''
        }
      ],
      originalPolicyNumber: ''
    }
  },
  mounted () {
    this.carModel = this.searchSettings[2].options
    this.formSettings[0].items[1].options = this.searchSettings[5].options
    if (this.insurance.policyNumber) {
      this.getInsuranceInfor(this.insurance.policyNumber)
      this.originalPolicyNumber = this.insurance.policyNumber
    }
    if (this.type === 'continue') {
      this.formSettings[0].items[2].disabled = true
    } else {
      this.formSettings[0].items[2].disabled = false
    }
    if (this.type === 'add') {
      this.$refs.form.setData('signDate', new Date(Date.now()))
    }
  },
  methods: {
    getInsuranceInfor (policyNumber) {
      this.$service.getInsuranceInfor(policyNumber).then((res) => {
        let insueanceDate = res.data.data
        let form = this.$refs.form
          if (this.type === 'continue') {
            form.setData('policyNumber', '')
            form.setData('signDate', new Date(Date.now()))
            form.setData('insuranceDuring', null)
          } else {
            form.setData('policyNumber', insueanceDate.policyNumber)
            form.setData('signDate', new Date(parseInt(insueanceDate.signDate) * 1000))
            form.setData('insuranceDuring', [new Date(parseInt(insueanceDate.effectiveDate) * 1000), new Date(parseInt(insueanceDate.expirationDate) * 1000)])
          }
          form.setData('insurerId', insueanceDate.insurerId)
          form.setData('riskCode', insueanceDate.riskCode)
          form.setData('insurant', insueanceDate.insurant)
          form.setData('premium', insueanceDate.premium / 100)
          form.setData('remarks', insueanceDate.remarks)
          form.setData('rebateRate', insueanceDate.rebateRate)
          this.tableData4 = res.data.data.carList
      })
    },
    carCheck (rule, value, callback) {
      var flag
      this.tableData4.forEach((ele) => {
        flag = false
        for (let key in ele) {
          if (!ele[key]) {
            flag = false
            callback(new Error('请填写完整车辆信息'))
          } else {
            flag = true
          }
        }
      })
      if (flag) {
        callback()
      }
    },
    timeCheck (rule, value, callback) {
       if (value && this.$refs.form.formModel.signDate) {
         if (Date.parse(value[0]) <= Date.parse(this.$refs.form.formModel.signDate)) {
           callback(new Error('保险开始日期要大于购买日期'))
         } else {
           callback()
         }
       } else if (!this.$refs.form.formModel.signDate) {
         callback()
       } else {
         callback(new Error('请输入保险期间'))
       }
    },
    searchCar (carInfor, index) {
      if (carInfor.carNumber) {
        this.$service.getCarByNumber(carInfor.carNumber).then(res => {
          let result = res.data.data.records
          if (result.length == 0) {
            this.$message({
              message: '该车辆不属于平台车辆，请手动添加车辆信息',
              type: 'warning'
            })
            this.$nextTick(() => {
              this.$set(this.tableData4[index], 'carCityId', '')
              this.$set(this.tableData4[index], 'carUseFor', 'sale')
              // this.$set(this.tableData4[index], 'carSn', '')
              this.$set(this.tableData4[index], 'carModelCode', '')
              this.$set(this.tableData4[index], 'carVin', '')
            })
          } else {
            this.$nextTick(() => {
              this.$set(this.tableData4[index], 'carCityId', result[0].cityId)
              this.$set(this.tableData4[index], 'carUseFor', 'rent')
              this.$set(this.tableData4[index], 'carModelCode', result[0].carModelCode)
              this.$set(this.tableData4[index], 'carVin', result[0].vin)
              this.$set(this.tableData4[index], 'carSn', result[0].carSn)
            })
          }
        })
      } else {
        this.$message({
          message: '请输入车牌号',
          type: 'warning'
        })
      }
    },
    addRow (index, rows) {
      this.tableData4.push({
          carNumber: '',
          carCityId: '',
          carUseFor: '',
          carModelCode: '',
          carVin: '',
      })
    },
    deleteRow(index, rows) {
      rows.splice(index, 1);
    },
    addEditPlan () {
      this.$refs.form.getDataAsync().then(data => {
        if (!data) {
          return
        }
        data.signDate = Date.parse(data.signDate) / 1000
        data.effectiveDate = Date.parse(data.insuranceDuring[0]) / 1000
        data.expirationDate = Date.parse(data.insuranceDuring[1]) / 1000
        data.premium = data.premium * 100
        this.tableData4.forEach((ele) => {
          ele.carCityName = this.cityChange(ele.carCityId)[0].name
          ele.carModelName = this.carChange(ele.carModelCode, this.carModel)[0].label
        })
        data.carList = this.tableData4
        delete data.insuranceDuring
        let handelType = this.type === 'edit' ? 'editInsurance' : 'addInsurance'
        if (this.type === 'edit') {
          handelType = 'editInsurance'
          data.originalPolicyNumber = this.originalPolicyNumber
        } else {
          handelType = 'addInsurance'
        }
        this.$service[handelType](data).then((res) => {
          this.$emit('add-success')
          switch (this.type) {
            case 'add':
              this.$message.success('添加成功')
              break
            case 'edit':
              this.$message.success('编辑成功')
              break
            case 'continue':
              this.$message.success('续保成功')
              break
          }
        })
      }).catch(err => {
        console.log('====err====', err)
      })
    }
  }
}
</script>
<style lang="scss">
.add-edit-insurance {
  .v-form {
    max-width: 1360px;
    .form-section:nth-child(1) {
      .el-form-item__content {
        max-width: 600px;
      }
      .el-date-editor {
          max-width: 600px;
      }
    }
    .form-section:nth-child(2) {
      border-bottom: none;
      padding-bottom: 0px;
      margin-bottom: 10px;
    }
    .el-table  {
      .el-table__header-wrapper {
        tr {
          th {
            padding-top: 0px;
          }
        }
      }
    }
  }
}
</style>
