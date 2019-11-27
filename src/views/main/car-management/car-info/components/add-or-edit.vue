<template>
  <div id="car-info-edit-or-edit">
    <!-- <pre>{{formData}}</pre> -->
    <v-form :formSettings="formSettings" @save="submitSave" ref="vform" :formData="formData" :showButton=false @cancel="cancelSubmit" >
      <template slot="cityId" slot-scope="scope">
        <search-select v-model="scope.model.cityId" type="city" placeholder="请选择" :isShowAll= false></search-select>
      </template>
      <template slot="carNumber" slot-scope="scope">
        <!-- {{scope.model}} -->
        <el-input v-model.trim="scope.model.carNumber" placeholder="请输入内容" @change="handleChangeText"></el-input>
      </template>
      <template slot="open" slot-scope="scope">
        <el-radio-group v-model="scope.model.open" @change="selectPlaceChange">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </template>
      <template slot="stationId" slot-scope="scope">
        <div  class="select-content">
          <span class="select-name">选择网点</span>
          <span class="select-website-item">
            <search-select v-model="scope.model.stationId" placeholder="请输入网点名称" isRequest @selectItemId='getSelectItemId' ></search-select>
            <!-- 根据运营城市id来请求网点数据 -->
          </span>
        </div>
      </template>
      <el-form-item slot="bottom-slot">
          <el-button type="primary" @click="saveCar">保存</el-button>
          <el-button type="primary" @click="lineOptimus">上线运营</el-button>
      </el-form-item>
    </v-form>
  </div>
</template>
<script>
import vForm from '@/components/form/vForm'
import searchSelect from '@/components/website-select'
import { handleDictData, handleSubmit } from '@/utils/common.js'

export default {
  name: 'car-info-edit-or-edit',
  components: {
    vForm,
    searchSelect
  },
  props: {
    // 判断添加或者编辑
    disNum: {
      type: Number,
      require: true
    },
    formData: {
      type: Object,
      require: true
    },
    copyFormData: {
      type: Object,
      require: false
    },
    carDentifying: [String, Number]
  },
  watch: {
    carNumber(newData) {
    }
  },
  computed: {

  },
  data() {
    // 自定义验证规则
    let selectWebsiteRule = (rule, value, callback) => {
      if (!value) {
        if (this.$refs.vform.formModel.open === 0) {
          callback()
        } else {
          callback(new Error('请输入网点名称'))
        }
      } else {
        callback()
      }
    }
    return {
      getStationId: null,
      aaa: 2,
      formSettings: [
        {
          label: '基本信息',
          items: [
            {
              label: '所属车型',
              name: 'carModelCode',
              type: 'select',
              options: [],
              required: true,
              valueType: 'string'
            },
            // {
            //   label: '租车类型',
            //   name: 'rentTypeCode',
            //   type: 'select',
            //   options: carRentList,
            //   valueType: 'number',
            //   required: true
            // },
            {
              label: '运营城市',
              name: 'cityId',
              type: 'slot',
              required: true
            },
            {
              label: '车牌号',
              name: 'carNumber',
              type: 'slot',
              placeholder: '请输入车牌号',
              required: true
            },
            {
              label: '车架号',
              name: 'vin',
              type: 'text',
              placeholder: '请输入车架号',
              required: true
            },
            {
              label: '发动机号',
              name: 'carEngineNumber',
              type: 'text',
              placeholder: '请输入发动机号'
            }
          ]
        },
        {
          label: 'tbox信息',
          items: [
            {
              label: 'tbox类别',
              // required: true,
              name: 'tboxTypeCode',
              type: 'select',
              valueType: 'string',
              options: []
            },
            {
              label: 'tbox设备号',
              name: 'tboxSimNumber',
              type: 'text',
              placeholder: '请输入tbox设备号',
              // required: true
            },
            {
              label: '车机 sim卡号',
              name: 'carTableSimNumber',
              type: 'text',
              placeholder: '请输入车机 sim卡号'
            }
          ]
        },
        {
          label: '其它信息',
          items: [
            {
              label: '车辆属性',
              name: 'ownerId',
              type: 'select',
              options: [],
              required: true,
              valueType: 'string'
            },
            // {
            //   label: '开始使用日期',
            //   name: 'useDate',
            //   type: 'date',
            //   required: true,
            //   unixTime: true
            // },
            // {
            //   label: '是否启用',
            //   name: 'open',
            //   type: 'slot',
            //   value: 1,
            //   options: [
            //     {
            //       label: '是',
            //       value: 1
            //     },
            //     {
            //       label: '否',
            //       value: 0
            //     }
            //   ]
            // },
            // {
            //   label: '',
            //   name: 'stationId',
            //   type: 'slot',
            //   rule: [
            //     {
            //       validator: selectWebsiteRule,
            //       trigger: 'change,blur'
            //     },
            //     {
            //       required: true,
            //       trigger: "change,blur"
            //     }
            //   ]
            // }
          ]
        }
      ],
      websiteOneList: [] // 获取网点数据
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.carsInfoDict()
      if (this.disNum === 2 && this.formData.open === 1) {
        this.$refs.vform.formModel.stationId = this.formData.association
      }
    })
  },
  methods: {
    saveCar () {
      console.log(this.formSettings[1].items)
      if (this.$refs.vform.formRules.tboxTypeCode) {
        this.$set(this.$refs.vform.formRules.tboxTypeCode[0], 'required', false )
        this.$set(this.$refs.vform.formRules.tboxTypeCode[0], 'trigger', 'blur' )
      }
      if (this.$refs.vform.formRules.tboxSimNumber) {
        this.$set(this.$refs.vform.formRules.tboxSimNumber[0], 'required', false )
        this.$set(this.$refs.vform.formRules.tboxSimNumber[0], 'trigger', 'blur' )
      }
      this.$nextTick(() => {
        this.$refs.vform.getDataAsync().then((data) => {
        if (!data) {
          return
        }
        data.ownerId = Number(data.ownerId)
        for (let key in data) {
          if (data[key] === '') {
            delete data[key]
          }
        }
        this.$service
          .post_carInfoAdd(data)
          .then(res => {
            this.successSubmit()
          })
          .catch(error => {
            this.$message.warning(error.msg)
          })
      }).catch((err) => {
        console.log('====err====', err)
      })
      })
    },
    lineOptimus () {
      console.log(this.$refs.vform.formRules)
      this.$set(this.$refs.vform.formRules, 'tboxTypeCode', [
        {required: true, message: '请输入tbox类别', trigger: 'change'}
      ])
      this.$set(this.$refs.vform.formRules, 'tboxSimNumber', [{
        required: true, message: '请输入tbox设备号', trigger: 'blur'
      }])
        this.$nextTick(() => {
        this.$refs.vform.getDataAsync().then((data) => {
          if (!data) {
            return
          }
          data.ownerId = Number(data.ownerId)
          data.businessStatus = 200
          this.$emit('on-net', data)
        }).catch((err) => {
          console.log('====err====', err)
        })
      })
    },
    handleChangeText(val) {
      this.$refs.vform.formModel.carNumber = val.toUpperCase()
    },
    getSelectItemId(id) {
      this.getStationId = id
    },
    cancelSubmit() {
      this.$emit('closeAndRefresh', 'cancel')
    },
    carsInfoDict() {
      this.$service.get_carsInfoDict().then(res => {
        let { models, tbox, owners } = res.data.data
        this.formSettings[0].items[0].options = handleDictData(models)
        this.formSettings[1].items[0].options = handleDictData(tbox)
        this.formSettings[2].items[0].options = handleDictData(owners)
      })
    },
    // 保存字段
    submitSave(addObj) {
      console.log(addObj)
      addObj.ownerId = Number(addObj.ownerId)
      if (this.disNum === 1) {
        this.$service
          .post_carInfoAdd(addObj)
          .then(res => {
            this.successSubmit()
          })
          .catch(error => {
            this.$message.warning(error.msg)
          })
      } else {
        if (this.formData.stationId === this.getStationId) {
          addObj.stationId = this.$refs.vform.formModel.stationId
        } else {
          addObj.stationId = this.getStationId
        }
        let submitObj = handleSubmit(addObj, this.formData)
        this.$service
          .put_carInfoPut(this.carDentifying, submitObj)
          .then(res => {
            this.successSubmit()
          })
          .catch(error => {
            this.$message.warning(error.msg)
          })
      }
    },
    successSubmit() {
      this.$message({
        type: 'success',
        message: '添加车辆成功' 
      })
      // 关闭页面 并且刷新列表
      this.$emit('closeAndRefresh')
    },
    selectPlaceChange(item) {
      if (item === 0) {
        this.$refs.vform.$refs.vForm.clearValidate()
      }
    }
  }
}
</script>
<style lang="scss" >
#car-info-edit-or-edit {
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
</style>
