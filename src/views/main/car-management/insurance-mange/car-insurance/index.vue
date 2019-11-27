<template>
  <div class="car_insurance">
    <el-card class="table-box">
      <div slot="header">
        <v-search :searchSettings="searchSettings"
                  @search="handleSearch"
                  labelWidth="130px"
                  ref="vSearch"
                  @insuranceStatusChange="insuranceStatus"></v-search>
      </div>
      <div class="table-operator">
        <el-button size="small"
                   type="primary"
                   @click="addInsurance"
                   class="addInsurance"
                   v-has="'carInsuranceAddInsurancePolicy'">添加保单</el-button>
        <!-- <el-button size="small" >下载模板</el-button> -->
        <a v-if="$_has('carInsuranceDownloadTemplate')"
           href='http://static1.1byongche.com/%E4%BF%9D%E5%8D%95%E6%A8%A1%E6%9D%BF.xlsx'>
          <el-button size="small"
                     class="download">下载模板</el-button>
        </a>
        <!-- <el-button size="small" >批量导入保单</el-button> -->
        <el-upload class="upload"
                   v-has="'carInsuranceBulkImportPolicy'"
                   :action="importUrl"
                   :on-success="uploadSuccess"
                   :before-upload="beforeAvatarUpload"
                   :on-error="onError"
                   :headers="uploadHeaders"
                   :show-file-list="false">
          <el-button size="small">批量导入保单</el-button>
        </el-upload>
        <el-button size="small"
                   v-has="'carInsuranceExportPolicy'"
                   @click="exportFile">导出保单</el-button>
      </div>
      <insurance-list @on-showInsurance="showInsurance"
                      :list='insuranceList'
                      :params="paginatiomParams"
                      @on-pageChange="pageChange"
                      @on-handelInsurance="hadelInsurance"
                      @on-continueInsurance="continueInsurance"></insurance-list>
    </el-card>
    <v-page :visible.sync="addEditInsurance"
            ref="aPage"
            @goBack="reload">
      <template slot="title">
        <h3 style="line-height:30px; display:inline-block">{{insuranceType}}</h3>
      </template>
      <template slot="content">
        <add-edit @add-success="addSuccess"
                  :insurance=insuranceId
                  :type="type"></add-edit>
      </template>
    </v-page>
    <v-page :visible.sync="showInsuranceInfor"
            ref="iPage"
            @goBack="reload">
      <template slot="title">
        <div class="insurance_infor">
          <h3 class="insurance_infor_header">保单详情</h3>
          <div>
            <el-button type="primary"
                       size="small"
                       v-has="'carInsuranceEdit'"
                       @click="hadelInsurance(insuranceId)">编辑</el-button>
            <el-button type="primary"
                       size="small"
                       v-if="insuranceId.renewStatus === 'uncertain' && $_has('carInsuranceRenew')"
                       @click="continueInsurance(insuranceId)">续保</el-button>
            <el-button type="primary"
                       size="small"
                       v-if="insuranceId.renewStatus === 'uncertain' && $_has('carInsuranceNotRenew')"
                       @click="uninsuranceHandel(insuranceId)">不续保</el-button>
          </div>
        </div>
      </template>
      <template slot="content">
        <insurance-infor :insurance=insuranceId
                         ref="information"></insurance-infor>
      </template>
    </v-page>
  </div>
</template>
<script>
import { searchSettings } from './components/search-settings.js'
import insuranceList from './components/insuranceList/index'
import addEdit from './components/addEdit'
import insuranceInfor from './components/insuranceInfor'
import api from '@/service/api/'
import BASE_URL from '@/config/base-url'
export default {
  name: 'car-insurance',
  components: {
    insuranceList,
    addEdit,
    insuranceInfor
  },
  data() {
    return {
      searchSettings: searchSettings,
      addEditInsurance: false,
      showInsuranceInfor: false,
      searchParams: {},
      paginatiomParams: {
        page: 1
      },
      insuranceList: [],
      insuranceId: {},
      type: 'add',
      importData: {},
      uploadHeaders: {
        accessToken: this.$store.getters.token
      },
      pageNum: 1
    }
  },
  watch: {
    // vsearchDate (val) {
    //   console.log(val)
    // }
  },
  computed: {
    insuranceType() {
      switch (this.type) {
        case 'add':
          return '添加保单'
        case 'edit':
          return '编辑保单'
        case 'continue':
          return '续保'
      }
      return ''
    },
    importUrl() {
      return `${BASE_URL}/optimus/cars/insurance/slip/import-slip`
    }
  },
  methods: {
    insuranceStatus(val) {
      if (val === 'expired' || val === 'effective') {
        this.searchSettings[7].disabled = true
        this.$refs.vSearch.formModel.insuranceEnd = []
      } else {
        this.searchSettings[7].disabled = false
      }
    },
    beforeAvatarUpload(file) {
      console.log(file, 'file')
      let isXls =
        file.type === 'application/vnd.ms-excel' ||
        file.type ===
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      if (!isXls) {
        this.$message.warning('导入文件只能是.xls 或 .xlsx 格式')
      }
      return isXls
    },
    onError(error) {
      // 接口返回500 可能批量导入的字段不正确
      this.$message.warning('批量导入数据失败,请根据模板格式导入')
    },
    // 批量导入
    uploadSuccess(res) {
      this.importData = res
      if (this.importData.code === '0') {
        this.$message.success(this.importData.msg)
        this.getInsuranceList()
      } else {
        this.$message.warning(this.importData.msg)
      }
    },
    // 导出
    exportFile() {
      if (this.insuranceList.length < 1) {
        this.$message.warning('导出订单为空，请重新查询！')
      } else {
        if (this.searchParams.endDate) {
          if (
            (this.searchParams.endDate - this.searchParams.startDate) /
              60 /
              60 /
              24 >
            31
          ) {
            this.$message.warning(
              '导出订单时间范围必须小于等于31天，请重新设置'
            )
          } else {
            this.$service.exportInsurance(
              this.searchParams,
              this.$store.getters.token,
              '保单列表.xlsx',
              api.EXPORT_INSURANCE
            )
          }
        } else {
          this.$message.warning('请设置导出时间范围！')
        }
      }
    },
    // 不续保
    setNoInsurance(id) {
      let params = {
        id: id,
        renewStatus: 'ignored'
      }
      this.$service.noInsurance(params).then(res => {
        this.$message.success('设置不续保成功')
        this.$emit('on-pageChange', this.page)
        this.$refs.information.getInsuranceInfor(this.insuranceId.policyNumber)
      })
    },
    uninsuranceHandel(val) {
      this.$confirm('该车辆确定不再续保？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.setNoInsurance(val.id)
        })
        .catch(() => {})
    },
    // 续保
    continueInsurance(val) {
      this.type = 'continue'
      this.insuranceId = val
      this.addEditInsurance = true
      this.showInsuranceInfor = false
    },
    hadelInsurance(val) {
      this.type = 'edit'
      this.insuranceId = val
      this.addEditInsurance = true
      this.showInsuranceInfor = false
    },
    showInsurance(val) {
      this.insuranceId = val
      this.addEditInsurance = false
      this.showInsuranceInfor = true
    },
    handleSearch(val) {
      this.searchParams = val
      this.pageNum = 1
      if (val.insuranceEnd) {
        this.searchParams.startDate = Date.parse(val.insuranceEnd[0]) / 1000
        this.searchParams.endDate = Date.parse(val.insuranceEnd[1]) / 1000
      }
      delete this.searchParams.insuranceEnd
      if (val.insurerName) {
        this.searchParams.insurer = this.searchSettings[5].options.filter(
          ele => {
            return ele.value === val.insurerName
          }
        )[0].label
        delete this.searchParams.insurerName
      } else {
      }
      this.getInsuranceList()
    },
    addInsurance() {
      this.addEditInsurance = true
      this.showInsuranceInfor = false
      this.insuranceId = {}
      this.type = 'add'
    },
    reload() {
      this.getInsuranceList(this.pageNum)
    },
    // 添加成功
    addSuccess() {
      this.addEditInsurance = false
      this.getInsuranceList()
    },
    // 获取保险公司列表
    getInsuranceCompany(page = 1) {
      this.$service
        .insuranceCompanySerch(this.searchParams, page, 100)
        .then(res => {
          this.searchSettings[5].options = []
          res.data.data.records.forEach(ele => {
            this.searchSettings[5].options.push({
              label: ele.name,
              value: ele.id
            })
          })
        })
        .catch(res => {})
    },
    // 获取车辆列表
    getCarList() {
      this.$service.carList().then(res => {
        this.searchSettings[2].options = []
        res.data.data.forEach(ele => {
          this.searchSettings[2].options.push({
            label: ele.name,
            value: ele.code
          })
        })
      })
    },
    // 获取保单列表
    getInsuranceList(page = 1) {
      this.$service
        .insuranceListSerch(this.searchParams, page)
        .then(res => {
          this.insuranceList = res.data.data.records
          this.paginatiomParams = {
            pageSize: 20,
            total: res.data.data.totalElements,
            page: res.data.data.page
          }
        })
        .catch(res => {})
    },
    pageChange(val) {
      this.getInsuranceList(val)
      this.pageNum = val
    }
  },
  mounted() {
    this.getCarList()
    this.getInsuranceCompany()
    this.getInsuranceList()
    this.searchSettings[7].disabled = false
  }
}
</script>
<style lang="scss">
.car_insurance {
  .table-operator {
    display: flex;
    // margin-bottom: 0px;
    .addInsurance {
      margin-right: 12px;
    }
    .upload {
      margin-right: 12px;
    }
    .download {
      margin-right: 12px;
    }
  }
  .insurance_infor {
    display: flex;
    .insurance_infor_header {
      display: flex;
      align-items: center;
      margin-right: auto;
    }
  }
}
</style>
