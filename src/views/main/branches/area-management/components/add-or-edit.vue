<template>
  <div id="area-management-edit-or-edit">
    <v-form :formSettings="formSettings" @save="submitSave" ref="vform" :formData="formData" :btnLoading="btnLoading">
      <template slot="cityId" slot-scope="scope">
        <search-select v-model="scope.model.cityId" type="city" :isShowAll='false' :disabled='disNum === 2' placeholder="请选择"></search-select>
      </template>
    </v-form>
  </div>
</template>
<script>
import searchSelect from '@/components/website-select'
export default {
  name: 'area-management-edit-or-edit',
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
    carDentifying: [String, Number]
  },
  data() {
    return {
      formSettings: [
        {
          items: [
            {
              label: '片区名称',
              name: 'name',
              type: 'text',
              required: true,
              valueType: 'string'
            },
            {
              label: '运营城市',
              name: 'cityId',
              type: 'slot',
              required: true
            }, {
              label: '片区属性',
              required: true,
              name: 'suburban',
              type: 'select',
              disabled: this.disNum === 2,
              options: [{
                label: '城区',
                value: false
              }, {
                label: '郊区',
                value: true
              }]
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
    this.$nextTick(() => { })
  },
  methods: {
    // 保存字段
    submitSave(addObj) {
      this.btnLoading = true
      addObj.modifiedBy = this.$store.getters.user.username
      // 添加片区
      if (this.disNum === 1) {
        //  把用户名带上
        this.$service
          .post_stationDistrictAdd(addObj)
          .then(res => {
            this.successSubmit()
            this.btnLoading = false
          })
          .catch(error => {
            this.$message.warning(error.msg)
            this.btnLoading = false
          })
      } else {
        // 修改片区
        // let updateObj = handleSubmit(addObj, this.formData); //处理片区数据
        // id标识
        addObj.id = this.formData.id
        this.$service
          .post_stationDistrictUpdate(addObj)
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
        message: this.disNum === 1 ? '添加片区成功' : '编辑片区成功'
      })
      this.$emit('closePage')
    },
    selectPlaceChange(item) {
      if (item === 0) {
        this.$refs.vform.$refs.vForm.clearValidate()
      }
    }
  },
  components: {
    searchSelect
  }
}
</script>
<style lang="scss">

</style>
