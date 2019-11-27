<template>
    <div class="add_edit_rule">
    <v-page :visible.sync="visible" :before-close="handleBeforeClose">
      <div class="page-header-container" slot="title">
        <h3>{{type == 'addPoint' ? '添加工分规则' : '编辑工分规则'}}</h3>
      </div>
       <v-form ref="form" slot="content" :formSettings="formSettings" :showButton="false" class="edit_add_form" :formData="pointInfor">
        <template slot="chargeCarScore" slot-scope="scope" >
           <el-input-number :controls = false class = "charge_input">
                <template  slot="append" >元</template>
            </el-input-number>
        </template>
        <template slot="dispatchScoreRules" slot-scope="scope" >
           <div>阶梯工分配置</div>
            <el-table
            :data="tableData"
            ref = "dispath"
            style="width: 100%">
            <el-table-column
              prop="moreThen"
              label=""
              width="50">
               <template slot-scope="scope">
                 <div class = "el-form-item" data-name="moreThen">
                   <span>{{scope.row.moreThen}}</span>
                 </div>
               </template>
            </el-table-column>
            <el-table-column
              prop="startLimit"
              label="公里"
              width="180">
               <template slot-scope="scope">
                 <div class = "el-form-item" data-name="startLimit">
                    <el-input-number v-model="scope.row.startLimit" :precision="2" :step="0.1" :controls = false :min='0' disabled v-if = "scope.$index == 0" ></el-input-number>
                    <el-input-number v-model="scope.row.startLimit" :precision="2" :step="0.1" :controls = false :min='0' v-else></el-input-number>
                 </div>
              </template>
            </el-table-column>

            <el-table-column
              prop="score"
              label="工分">
              <template slot-scope="scope">
                  <div  class = "el-form-item" data-name="score">
                    <el-input-number v-model="scope.row.score" :precision="2" :step="0.1" :controls = false  :min='0'></el-input-number>
                  </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="address"
              label="操作">
              <template slot-scope="scope">
                <el-button type = 'text' @click.native.prevent = "add(scope.$index, tableData)"  v-if = "scope.$index === tableData.length - 1">添加</el-button>
                <el-button type = 'text' @click.native.prevent = 'del(scope.$index, tableData)' v-if = "scope.$index !== 0 || (scope.$index === 0 && tableData.length > 1)" >删除</el-button>
              </template>
            </el-table-column>

          </el-table>
        </template>
        dispath
        <el-form-item slot="bottom-slot">
          <el-button type="primary"  @click="save()">保存</el-button>
        </el-form-item>
      </v-form>
    </v-page>
  </div>
</template>
<script>
import formSettings from './formSetting.js'
import searchSelect from '@/components/website-select'
export default {
  data () {
    formSettings[6].items[1].rule = [
      {
        validator: this.checkDispath,
        trigger: 'blur',
        required: true
      }
    ]
    return {
      type: 'addPoint',
      formSettings: formSettings,
       pointInfor: {
         chargeCarScore: undefined
       },
       tableData: [{
         moreThen: '>',
         startLimit: 0,
         score: undefined
      }]
    }
  },
  props: {
    visible: {
      type: Boolean
    },
    id: {
      type: [Number, String]
    }
  },
  watch: {
    visible(val) {
      if (val) {
         this.pointInfor = {},
         this.tableData =  [{
            moreThen: '>',
            startLimit: 0,
            score: undefined
        }]
      }

      if (val && this.id) {
        this.getDetails()
      }
      if (this.id) {
        this.type = 'editPoint'
      } else {
        this.type = 'addPoint'
      }
    }
  },
  mounted () {
  },
  methods: {
    handleBeforeClose () {
      this.$emit('update:visible', false)
      this.$emit('closePage')
    },
    getDetails () {
      this.$service.pointInfor({id: this.id}).then((res) => {
        this.pointInfor = res.data.data
        this.pointInfor.city = {
           value: res.data.data.cityId,
           label: res.data.data.cityName
          
        }
        this.tableData = res.data.data.dispatchScoreRules.map((ele) => {
          return {
            moreThen: '>',
            startLimit: ele.startLimit,
            score: ele.score
          }
        })
      })
    },
    add (index, rows) {
      this.tableData.push({
          moreThen: '>',
          startLimit: undefined,
          score: undefined
      })
    },
    del(index, rows) {
      rows.splice(index, 1);
    },
    checkDispath (rule, value, callback) {
      let errMsg = new Set()
      var $el = this.$refs.dispath.$el
      this.tableData.forEach((ele, index) => {
        Object.keys(ele).forEach((eleSon) => {
          if (!$el.querySelectorAll('.el-table__row')[index]) {
            return
          }
          let $item = $el.querySelectorAll('.el-table__row')[index].querySelector(`[data-name=${eleSon}]`)
          if (!ele[eleSon] && ele[eleSon] != 0) {
            $item.classList.remove('is-success')
            $item.classList.add('is-error')
            errMsg.add('输入公里或工分不能为空')
          } else {
            if (this.tableData.length <=1 ) {
              $item.classList.add('is-success')
              $item.classList.remove('is-error')
              return
            } else if (this.tableData.length >1 && index > 0) {
              if (this.tableData[index].startLimit <= this.tableData[index - 1].startLimit) {
                 $item.classList.remove('is-success')
                 $item.classList.add('is-error')
                 errMsg.add('公里应递增排序')
              } else {
                 $item.classList.add('is-success')
                 $item.classList.remove('is-error')
              }
            } else {
               $item.classList.add('is-success')
               $item.classList.remove('is-error')
            }
           
          }
        })
      })
      if (errMsg.size) {
        return callback(new Error(Array.from(errMsg).join(', ')))
      }
      callback()
    },
    save () {
       this.$refs.form.getDataAsync().then(data => {
         if (!data) {
          return
         }
        let ruleList = []
        if (this.tableData.length) {
          ruleList = this.tableData.map((ele) => {
            return {
              score: ele.score,
              startLimit: ele.startLimit
            }
          })
        }
        data.dispatchScoreRules = ruleList
        let msg
        if (this.type === 'editPoint') {
          data.id = this.id
          msg = '编辑成功'
        } else {
          msg = '添加成功'
        }
       
        data.cityId = data.city.value
        data.cityName = data.city.label
        delete data.city
        this.$service[this.type](data).then((res) => {
          this.$message.success(msg)
          this.$emit('closePage')
          this.$emit('update:visible', false)
        })
       }).catch(err => {
         console.log('====err====', err)
       })
    }
  }
}
</script>
<style lang = 'scss'>
  .add_edit_rule {
    .v-form {
      .number-with-append {
        width: 100%;
        height:32px;
        input {
          text-align: left;
          display:inline-block;
        }
      }
      .el-table {
        input {
          text-align: left
        }
      }
      .charge_input {
        width:100%;
        .el-input {
          display: inline-table;
          
        }
      }
      form {
        .form-section:nth-child(7) {
          position: relative;
          h3::before {
              content: '（调度单工分 = 每单工分 + 阶梯工分配置）';
              font-size: 14px;
              position:absolute;;
              left:50px;
              top:0;
              font-weight: normal;

           }
        }
      }
      /* & h3:nth-child(2){
        color: red;
        &::before {
          content: '111111';
          font-size: 12px;
        }
      } */
    }
  }
</style>

