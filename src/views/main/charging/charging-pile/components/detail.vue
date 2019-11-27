<template>
  <div id="coupons-info-detail">
    <detail-basic :detailSettings='detailSettings' :data="detailData">
      <!--<span slot="area" v-if="detailData.cityName">{{detailData.cityName}} </span>-->
      <!--<span slot="rentTypeCode" v-if="detailData.rentTypeCode===1">分时</span>-->
      <!--<span slot="rentTypeCode" v-if="detailData.rentTypeCode===3">长租</span>-->
      <!--<template slot="carEngineNumber">-->
      <!--<a :href="erWeiMaUrl" :download="erweimaName" style="color:#5dade2">下载二维码</a>-->
      <!--</template>-->
      <template slot="sn">
        <div> {{detailData.sn}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a :href="erWeiMaUrl" :download="erweimaName" style="color:#5dade2">下载桩贴</a> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <a v-if="detailData.deviceCode == 'JD'" @click="upgrade" href="javascript:;" style="color:#5dade2">升级充电桩</a>
          <!--<a v-if="detailData.operatorCode == 'YD'" @click="upgrade" href="javascript:;" style="color:#5dade2">升级充电桩</a>-->
        </div>
      </template>
      <template slot="status">
        <div v-for="item in detailData.connectors"> {{formateStatusText(item.status)}}(接口编号：{{item.connectorId}}) </div>
      </template>
      <!--<template slot="installRedeemCode">-->
      <!--<div v-if="detailData.installRedeemCode">是</div>-->
      <!--<div v-else>否</div>-->
      <!--</template>-->
      <!--<template slot="redeemCode" slot-scope="scope" v-if="scope.data.redeemCode">-->
      <!--{{detailData.redeemCode}}-->
      <!--</template>-->
    </detail-basic>
    <el-dialog title="提示" :visible.sync="upgradeVisible" :modal="false" width="30%">
      <el-form :model="numberValidateForm" ref="numberValidateForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="文件数量" prop="fileCount" :rules="[
      { required: true, message: '数量不能为空'},
      { type: 'number', message: '必须为数字'}
    ]">
          <el-input type="fileCount" v-model.number="numberValidateForm.fileCount" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="版本号" prop="version" :rules="[
      { required: true, message: '版本号不能为空'}
    ]">
          <el-input type="version" v-model.number="numberValidateForm.version" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('numberValidateForm')">升 级</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import detailBasic from '@/components/detail/v-detail'
import { detailSettings } from './data'
export default {
  name: 'charging-info-detail',
  props: {
    detailData: {
      type: Object,
      required: true
    },
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      numberValidateForm: {
        fileCount: '',
        version: ''
      },
      formData: {},
      detailSettings: detailSettings,
      erWeiMaUrl: '',
      upgradeVisible: false,
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$service.get_chargingPileInfoSticker({ 'sn': this.detailData.sn }).then(res => {
        this.erWeiMaUrl = res.data.data.qrcode
      }).catch(error => {
        this.$message.warning(reeor.msg)
      })
    })
  },
  computed: {
    erweimaName() {
      return `${this.detailData.sn}.jpg`
    }
  },
  components: {
    detailBasic
  },
  methods: {
    formateStatusText(status) {
      return this.$service.formateStatusText(status);
    },
    upgrade() {
      this.upgradeVisible = true
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = { 'sn': this.detailData.sn, ...this.numberValidateForm }
          this.$service.chargingPileUpgrade(params).then(res => {
            this.$message({
              message: '升级成功',
              type: 'success'
            })
            this.upgradeVisible = false
          }).catch(err => {
            this.$message({
              message: err.msg,
              type: 'error'
            })
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }
  }
}

</script>
