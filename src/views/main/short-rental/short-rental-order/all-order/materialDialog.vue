<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    width= '500px'
    >
    <el-form class="all_material_dialog" label-width="90px" labelPosition= 'left'>
      <el-form-item label="已领取物料" v-if="material.materielStatus==='received'" class="get_material">
         <el-checkbox-group v-model="returnMaterial">
            <el-checkbox :label="item.id" v-for="item in oreadyMaterialList" :key="item.sort">{{item.materielName}}</el-checkbox>
          </el-checkbox-group>
      </el-form-item>
      <el-form-item label="选择物料" v-if="material.materielStatus==='unreceived'" class='get_material'>
          <el-checkbox-group v-model="gotMaterial">
            <el-checkbox :label="item.key" v-for="item in allMaterialList" :key="item.sort">{{item.name}}</el-checkbox>
          </el-checkbox-group>
      </el-form-item>
      <el-form-item label="已领物料：" v-if="material.materielStatus==='returned'">
         <el-row  v-if="oreadyMaterialList.length">
            <el-col :lg="6" :xl="4" v-for="item in oreadyMaterialList" :key="item.id"><div>{{item.materielName}}</div></el-col>
          </el-row>
         <span v-else>无</span>
      </el-form-item>
      <el-form-item label="未还物料：" v-if="material.materielStatus==='returned'">
         <el-row  v-if="unreturn.length">
            <el-col :lg="6" :xl="4" v-for="item in unreturn" :key="item.id" style="max-width:100px;"><div>{{item.materielName}}</div></el-col>
          </el-row>
         <span v-else>无</span>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false" size="small" v-if="material.materielStatus==='unreceived' || material.materielStatus==='received'">取 消</el-button>
      <el-button type="primary" @click="getMaterial" size="small" v-if="material.materielStatus==='unreceived'">领取</el-button>
      <el-button type="primary" @click="handelreturn" size="small" v-if="material.materielStatus==='received'">归还</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  data () {
    return {
      dialogVisible: false,
      gotMaterial: [],
      returnMaterial: [],
      title: '',
      material: {},
      allMaterialList: [],
      oreadyMaterialList: [],
      returned: [],
      unreturn: []
    }
  },
  methods: {
    show (material) {
      this.gotMaterial = []
      this.dialogVisible = true
      // this.setParams = materielStatus
      this.material = material
      switch (this.material.materielStatus) {
        case 'unreceived':
          this.title = '领取物料'
          this.materialList()
          break
        case 'received':
          this.title = '归还物料'
          this.materialAllStatus('all')
          break
        case 'returned':
          this.title = '查看'
          this.materialAllStatus('unReturn')
          this.materialAllStatus('all')
          break
      }
    },
    // 领取物料
    getMaterial () {
      let params = {
        orderSn: this.material.sn,
        keys: this.gotMaterial.join(','),
        operatorUserName: this.$store.state.user.username
      }
      this.$service.getMaterial(params).then((res) => {
        this.$message.success('领取物料成功！')
        this.$emit('on-success')
        this.dialogVisible = false
      }).catch((res) => {
      })
    },
    // 归还物料
    handelreturn  () {
      let params = {
        orderSn: this.material.sn,
        ids: this.returnMaterial.join(','),
        operatorUserName: this.$store.state.user.username
      }
      this.$service.returnMaterial(params).then((res) => {
        this.$message.success('归还物料成功！')
        this.$emit('on-success')
        this.dialogVisible = false
      }).catch((res) => {
      })
    },
    materialAllStatus (type) {
      let obj = {
        orderSn: this.material.sn,
        type: type
      }
      this.$service.materialAllStatus(obj).then((res) => {
        switch (obj.type) {
          case 'all':
            this.oreadyMaterialList = res.data.data
            break
          case 'unReturn':
            this.unreturn = res.data.data
            break
          case 'return':
            this.returned = res.data.data
            break
        }
      }).catch((res) => {
      })
    },
    materialList () {
      this.$service.materialList().then((res) => {
        this.allMaterialList = res.data.data
      }).catch((res) => {
      })
    }
  }
}
</script>
<style lang="scss">
  .all_material_dialog {
    .get_material {
      .el-checkbox {
        min-width: 100px;
        margin-left: 10px;
      }
      .el-checkbox:nth-child(1) {
        margin-left: 10px;
      }
    }
    .el-form-item {
      margin-bottom: 0;
    }
  }
</style>
