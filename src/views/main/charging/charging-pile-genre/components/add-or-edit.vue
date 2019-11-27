<template>
  <div id="genre-add-or-edit">
    <!-- {{formData}} -->
    <v-form :formSettings="formSettings" @save="submitSave" ref="vform" :formData="formData" :btnLoading="btnLoading">
      <template slot="power" slot-scope="scope">
        <el-input v-model="scope.model.power">
          <template slot="append">kw.h</template>
        </el-input>
      </template>
      <template slot="current" slot-scope="scope">
      <el-input v-model="scope.model.current">
        <template slot="append">A</template>
      </el-input>
    </template>
    </v-form>
  </div>
</template>
<script>
export default {
  name: 'genre-add-or-edit',
  props: {
    // 判断添加或者编辑
    disNum: {
      type: Number,
      require: true
    },
    formData: {
      type: Object,
      require: true
    }
  },
  data() {
    return {
      getStationId: null,
      formSettings: [
        {
          items: [
            {
              label: '类型名称',
              name: 'equipmentModelName',
              type: 'text',
              required: true,
              valueType: 'string'
            },
            {
              label: '设备商',
              required: true,
              name: 'device',
              type: 'select',
              options: [
                {
                  label:'洁电',
                  value:'JD'
                },
                {
                  label:'特来电',
                  value:'TLD'
                },
                {
                  label:'一电',
                  value:'YD'
                },
                {
                  label:'驿普乐氏',
                  value:'EN'
                }
              ]
            },
            {
              label: '设备型号',
              name: 'deviceModel',
              type: 'text',
              required: false,
              valueType: 'string'
            },
            {
              label: '电流类型',
              required: true,
              name: 'equipmentType',
              type: 'select',
              options: [
                {
                  label:'交流',
                  value:'AC'
                },
                {
                  label:'直流',
                  value:'DC'
                }
              ]
            },
            {
              label: '额定功率',
              name: 'power',
              required: true,
              visible: false,
              type: 'slot'
            },
            {
              label: '额定电流',
              name: 'current',
              required: true,
              visible: false,
              type: 'slot'
            },
            {
              label: '设备类型',
              required: true,
              name: 'smart',
              type: 'select',
              options: [
                {
                  label:'智能桩',
                  value:true
                },
                {
                  label:'非智能桩',
                  value:false
                }
              ]
            },
            {
              label: '充电桩类型图片',
              name: 'images',
              type: 'img',
              limit:1,
              required: true
            },
            {
              label:'备注',
              name:'remark',
              type:'textarea'
            }
          ]
        }
      ],
      restaurants: [],
      selectSite: [],
      btnLoading: false
    }
  },
  mounted() {
    this.$nextTick(() => {
    })
  },
  methods: {
    // 保存字段
    submitSave(addObj) {
      this.btnLoading = true
      // addObj.createdBy = this.$store.getters.user.username
      // 添加充电桩类型
      if (this.disNum === 1) {
        console.log(addObj)
        addObj.power = Number(addObj.power)
        addObj.current = Number(addObj.current)
        addObj.images = [addObj.images[0].url]
        this.$service
          .ChargePileGenreAdd(addObj)
          .then(res => {
            this.successSubmit()
            this.btnLoading = false
          })
          .catch(error => {
            this.$message.warning(error.msg)
            this.btnLoading = false
          })
      } else {
        addObj.id = this.formData.id
        addObj.images = [addObj.images[0].url]
        addObj.power = Number(addObj.power)
        addObj.current = Number(addObj.current)
        console.log(addObj)
        this.$service
          .ChargePileGenreEdit(addObj)
          .then(res => {
            this.successSubmit()
            this.btnLoading = false
          })
          .catch(error => {
            this.$message.warning(error.msg)
            this.btnLoading = false
          })
      }
    },
    successSubmit() {
      this.$message({
        type: 'success',
        message: this.disNum === 1 ? '添加充电桩成功' : '编辑充电桩成功'
      })
      this.$emit('closePage')
    },
    selectPlaceChange(item) {
      if (item === 0) {
        this.$refs.vform.$refs.vForm.clearValidate()
      }
    },
    getSelectItemId(id) {
      this.getStationId = id
    },
  },
  components: {
  }
}
</script>
<style lang="scss">

</style>
