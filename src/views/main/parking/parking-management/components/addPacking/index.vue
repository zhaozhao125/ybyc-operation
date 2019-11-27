<template>
  <div class="add-packing">
      <!-- <h4>基本信息</h4> -->
      <v-form ref="form" slot="content" :formSettings="formSettings" :showButton="false" class="edit_add_form" @isOpen = "isOpen" @packingType = "packingType">
        <template slot="stationId" slot-scope="scope">
              <search-select v-model="scope.model.stationId" :isRequest='isRequest' noRemote placeholder="请输入/选择网点名称" :open='false' ref = "websiteSelectionNames"> </search-select>
        </template>
        <el-form-item slot="bottom-slot">
          <el-button type="primary"  @click="save('packingAdd')">保存</el-button>
          <el-button type="primary"  @click="save('addWake')" v-if = "openStatus === 1">保存并唤醒</el-button>
        </el-form-item>
      </v-form>
  </div>
</template>
<script>
import formSettings from './formSetting.js'
import searchStation from '@/components/search-station/'
import searchSelect from '@/components/website-select'
export default {
  name: 'add-plans',
  components: {
    searchStation,
    searchSelect
  },
  data() {
    return {
      formSettings,
      isRequest: true,
      openStatus: 1
    }
  },
  mounted() {
    this.$refs.form.setData('isEnable', 1)
  },
  methods: {
    packingType (val) {
      if (val === 0) {
        this.$refs.form.setData('owner', 'YB')
      } else {
        this.$refs.form.setData('owner', '')
      }
    },
    isOpen (val) {
      this.openStatus = val
    },
    save(type) {
      this.$refs.form.getDataAsync().then(data => {
        if (!data) {
          return
        }
        let city = JSON.parse(window.sessionStorage.getItem('loginData')).cityModels.filter((ele) => {
          return ele.id === data.cityId
        })
        data.cityName = city[0].name
        if (data.stationId) {
          let website = this.$refs.websiteSelectionNames.newListData.filter((ele) => {
          return ele.value === data.stationId
        })[0]
        data.stationSn = website.sn
        data.stationName = website.label
       }
       this.addPacking(type, data)
      }).catch(err => {
        console.log('====err====', err)
      })
    },
    addPacking (type, data) {
      this.$service[type](data).then((res) => {
        this.$message.success('添加成功')
        this.$emit('on-hideAdd')
      })
    }
  }
}
</script>
<style lang="scss">

</style>
