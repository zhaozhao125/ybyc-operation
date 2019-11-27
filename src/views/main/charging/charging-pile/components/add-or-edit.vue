<template>
  <div id="area-management-edit-or-edit">
    <!-- {{formData}} -->
    <v-form :formSettings="formSettings" @save="submitSave" ref="vform" :formData="formData" :btnLoading="btnLoading">
      <template slot="stationId" slot-scope="scope">
        <div class="select-content">
          <search-select v-model="scope.model.stationId" :stationName="formData.stationName"  placeholder="请输入站点名称" isRequest @changeStationName="changeStationName" @selectItemId='getSelectItemId'></search-select>
        </div>
      </template>
    </v-form>
  </div>
</template>
<script>
import searchSelect from './charging-station-select'
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
    }
  },
  data() {
    return {
      getStationId: null,
      formSettings: [
        {
          items: [
            {
              label: '桩硬件地址',
              name: 'hardAddress',
              type: 'text',
              required: true,
              valueType: 'string'
            },
            {
              label: '所属充电站',
              name: 'stationId',
              required: true,
              visible: false,
              type: 'slot'
            },
            {
              label: '充电桩类型',
              required: true,
              name: 'equipmentModelId',
              type: 'select',
              options: []
            },{
              label:'状态',
              required: true,
              name: 'enabled',
              type:'switch',
              value:true
            },{
              label:'充电桩描述',
              name:'description',
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
      //获取充电桩类型列表
      this.carsInfoDict();
    })
  },
  methods: {
    // 保存字段
    submitSave(addObj) {
      this.btnLoading = true
      // addObj.createdBy = this.$store.getters.user.username
      // 添加充电桩
      if (this.disNum === 1) {
        //  把用户名带上
        this.$service
          .chargingPileAdd(addObj)
          .then(res => {
            this.successSubmit()
            this.btnLoading = false
          })
          .catch(error => {
            this.$message.warning(error.msg)
            this.btnLoading = false
          })
      } else {
        addObj.sn = this.formData.sn
        this.$service
          .chargingPileEdit(addObj)
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
    changeStationName(){
      this.formData.stationName = ''
    },
    carsInfoDict() {
      this.$service.getChargingPileGenre().then(res => {
        let genreList = [];
        if(res.data.data){
          res.data.data.forEach(item => {
            genreList.push({value: item.id,label: item.equipmentModelName})
          })
        }
        this.formSettings[0].items[2].options = genreList
      })
    }
  },
  components: {
    searchSelect
  }
}
</script>
<style lang="scss">

</style>
