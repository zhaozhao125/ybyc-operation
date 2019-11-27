<template>
  <el-dialog
    :title="setParams.title"
    :visible.sync="dialogVisible"
     width= '500px'
    >
    <el-form :model="formInline" class="material_dialog" label-width="80px" labelPosition= 'left'>
      <el-form-item label="" v-if="setParams.type==='returnMaterial'" class="oreadyGet">已领取物料</el-form-item>
      <el-form-item label="选择物料" v-if="setParams.type!=='reviewMaterial'" >
          <el-checkbox-group v-model="formInline.type">
            <el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
            <el-checkbox label="地推活动" name="type"></el-checkbox>
            <el-checkbox label="线下主题活动" name="type"></el-checkbox>
            <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
            <el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
            <el-checkbox label="地推活动" name="type"></el-checkbox>
            <el-checkbox label="线下主题活动" name="type"></el-checkbox>
            <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="已领物料" v-if="setParams.type==='reviewMaterial'">
         11111
      </el-form-item>
      <el-form-item label="未还物料" v-if="setParams.type==='reviewMaterial'">
         11111
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false" size="small" v-if="setParams.type==='getMaterial' || setParams.type==='returnMaterial'">取 消</el-button>
      <el-button type="primary" @click="dialogVisible = false" size="small" v-if="setParams.type==='getMaterial'">领取</el-button>
      <el-button type="primary" @click="dialogVisible = false" size="small" v-if="setParams.type==='returnMaterial'">归还</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  data () {
    return {
      dialogVisible: false,
      formInline: {
        type: []
      },
      setParams: {}
    }
  },
  methods: {
    show (val) {
      this.dialogVisible = true
      this.setParams = val
    }
  }
}
</script>
<style lang="scss">
  .material_dialog {
    .el-checkbox:nth-child(1) {
      margin-left: 30px;
    }
    .el-checkbox {
      width: 140px;
    }
    .oreadyGet {
      .el-form-item__content {
        margin-left:0 !important
      }
    }
  }
</style>
