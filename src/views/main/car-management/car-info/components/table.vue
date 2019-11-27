<template>
  <div id="car-info-table " class="components-content">
    <!-- 详情页开始 -->
    <v-page :visible.sync="detailPage" @goBack="reloadList">
      <div class="detail-page" slot="title">
        <h3>车辆详情</h3>
        <div>
          <!-- <el-tooltip class="item" effect="dark" content="查看控制日志" placement="top">
            <el-button type="primary" size="mini" @click="jumpCarActionRecord">控制日志</el-button>
          </el-tooltip> -->
          <el-tooltip class="item" effect="dark" content="查看实时数据" placement="top">
            <el-button type="primary" size="small" @click="jumpCarLocation">实时数据</el-button>
          </el-tooltip>
          <el-button type="primary" size="small" @click="setOutLine" v-if="detailData.businessStatus === 200 || detailData.businessStatus === 401 || detailData.businessStatus === 402">置为未上线</el-button>
          <el-button type="primary" size="small" @click="lineStatusHander('onLine')" v-if="detailData.businessStatus === 100">上线运营</el-button>
          <el-button type="primary" size="small" @click="lineStatusHander('outLine')" v-if="detailData.businessStatus === 100 || detailData.businessStatus ===200 || detailData.businessStatus ===300">下线</el-button>
        </div>
      </div>
      <template slot="content">
        <!-- 详情页组件 -->
        <!-- <v-detail :detailData="detailData" :carSn="carSn"></v-detail> -->
        <car-infor :detailData="detailData" :list = "recordList" :paginationParams ="paginationParams" v-if="inforSuccess" @on-putSuccess="detailItem(carSn)" @on-pageChange="carlogPageChange">
           <!-- <template slot-scope="scope" slot="carNumber">
              <editInput  :value="baseInformation.carNumber" type="text" @updateVal="updateSalesman"></editInput>
            </template> -->
        </car-infor>
      </template>
    </v-page>
    <!-- 详情页结束 -->
    <!-- 表格开始 -->
    <el-table :data="tableData" class="table-container" height="100%">
      <el-table-column label="车牌号">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="查看车辆详情" placement="top">
            <el-button type="text" @click="detailItem(scope.row.carSn)"> {{scope.row.carNumber}}</el-button>
          </el-tooltip>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="lastCarNumber" label="原车牌号" show-overflow-tooltip></el-table-column> -->
      <el-table-column prop="carModelName" label="车型" show-overflow-tooltip></el-table-column>
      <el-table-column label="租赁类型" min-width="80">
        <template slot-scope="scope">
          <div>
            <span v-if="scope.row.rentTypeCode ===1">分时</span>
            <span v-else-if="scope.row.rentTypeCode ===3">短/长租</span>
            <span v-else>未知</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="cityName" label="运营城市" show-overflow-tooltip> </el-table-column>
      <el-table-column prop="businessStatus" label="运营状态" show-overflow-tooltip>
         <template slot-scope="scope">
            <span v-if="scope.row.businessStatus === 100">未上线</span>
            <span v-if="scope.row.businessStatus === 200">运营中</span>
            <span v-if="scope.row.businessStatus === 300">维保整备</span>
            <span v-if="scope.row.businessStatus === 401">已下线（报废）</span>
            <span v-if="scope.row.businessStatus === 402">已下线（售出）</span>
         </template>
      </el-table-column>
      <el-table-column prop="vin" label="车架号" show-overflow-tooltip min-width="120"></el-table-column>
      <el-table-column prop="ownerName" label="车辆属性"></el-table-column>
      <el-table-column label="所属网点" prop="association" show-overflow-tooltip min-width="250">
        <template slot-scope="scope" class="station" style="background:red;">
          <span type="text" class="station-name" @click="jumpStation(scope.row.association)">{{scope.row.association}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="是否启用">
        <template slot-scope="scope">
          <popSwitch v-model="scope.row.onSwitch" @refreshTable='refreshTable' ref="popSwitch" isCarInfo :rowData='scope.row' :cityId='scope.row.cityId' :index='scope.$index' :carSn='scope.row.carSn'></popSwitch>
        </template>
      </el-table-column> -->
      <el-table-column label="操作" fixed="right" min-width="85">
        <template slot-scope="scope">
          <div class="handle">
            <el-tooltip class="item" effect="dark" content="查看车辆状态" placement="top">
              <el-button type="text" @click="jumpCarStatus(scope.row.carNumber)">车辆状态</el-button>
            </el-tooltip>
            <!-- <el-button type="text" v-has="'carInfoEdit'" @click="editList(scope.row)">编辑</el-button> -->

          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 表格结束 -->
    <div class="table-page">
      <el-pagination @current-change="handleCurrentChange" :current-page.sync="paging.page" :page-size="paging.pageSize" layout="total, prev, pager, next" :total="total"></el-pagination>
    </div>
    <handel-dialog ref="carStatusHandel" @on-statusSuccess = "detailItem(carSn)" ></handel-dialog>
  </div>
</template>
<script>
import vDetail from './detail'
import { searchPage } from '@/mixins/search-page'
import websiteSelect from '@/components/website-select'
import popSwitch from '@/components/pop-switch' // 引入switch组件
import carInfor from './information/index.vue'
import editInput from '@/components/edit-input'
import handelDialog from './handelDialog'
export default {
  name: 'car-info-table',
  mixins: [searchPage],
  props: ['otherCarNumber'],
  components: {
    vDetail,
    websiteSelect,
    popSwitch,
    editInput,
    handelDialog,
    carInfor
  },
  data() {
    return {
      popoverTitle: '',
      listData: [], // 网点列表数据
      isRequestWebsit: false,
      carSn: '',
      switchIndex: null,
      visible2: false,
      siteRules: {
        selectPlace: [
          {
            required: true,
            message: '请输入网点名称',
            trigger: 'blur,change'
          }
        ]
      },
      ruleForm: {
        selectPlace: ''
      },
      siteList: [], // 网点数据
      selectSiteLoading: false,
      detailPage: false,
      detailData: {},
      // formData: {},
      selectSite: [],
      webiteId: null,
      successFlagBit: false,
      baseInformation: {
        carNumber: 123445
      },
      inforSuccess: false,
      recordList: [],
      paginationParams: {}
    }
  },
  methods: {
    // 车辆状态改变
    carStatusSet (params) {
      this.$service.carStatusSet(params).then((res) => {
        this.$message.success('修改成功')
        this.detailItem(this.carSn)
      }).catch((res) => {
      })
    },
    setOutLine () {
      this.$confirm('确定将车辆置为未上线吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let obj = {
          carSn: this.carSn,
          businessStatus: 100
        }
        this.carStatusSet(obj)
      }).catch(() => {
      })
    },
    // 下线或下线
    lineStatusHander (type) {
      if (type === 'onLine') {
        if (!this.detailData.tboxTypeCode) {
          this.$message.warning('tbox类别不能空！')
        } else if (!this.detailData.tboxSimNumber) {
          this.$message.warning('tbox设备号不能空！')
        } else {
          this.$refs.carStatusHandel.show({
            type: type,
            carSn: this.detailData.carSn
          })
        }
      } else {
        this.$refs.carStatusHandel.show({
          type: type,
          carSn: this.detailData.carSn
        })
      }
    },
    jumpCarLocation() {
      this.$store.commit('sendToTab', {
        name: 'carLocation',
        params: {
          carSn: this.detailData.carSn,
          carNumber: this.detailData.carNumber
        }
      })
    },
    jumpCarStatus(carNumber) {
      this.$store.commit('sendToTab', {
        name: 'carStatus',
        params: {
          carNumber: carNumber
        }
      })
    },
    jumpCarActionRecord() {
      this.$store.commit('sendToTab', {
        name: 'carActionRecord',
        params: {
          carNumber: this.detailData.carNumber
        }
      })
    },
    jumpStation(websiteName) {
      this.$store.commit('sendToTab', {
        name: 'branchesList',
        params: {
          websiteName: websiteName
        }
      })
    },
    refreshTable() {
      this.handleSearch()
    },
    // 拿到网点id
    getWebSiteId(websiteId) {
      this.webiteId = websiteId
    },
    // 选择网点
    isSelectSite(carSn, index) {
      console.log(this.$refs.popSwitch.handleConfirm())
      this.$refs.popSwitch.handleConfirm()
    },
    detailEditList() {
      this.detailPage = false
      this.detailData.ownerId = String(this.detailData.ownerId)
      this.$emit('editorData', this.detailData, 2, this.detailData.carSn)
    },
    editList(row) {
      // 转一下类型
      row.ownerId = String(row.ownerId)
      this.$emit('editorData', row, 2, row.carSn)
    },
    handleSearch() {
      let searchObj = { ...this.paging, ...this.searchData }
      this.$service.get_carInfoPagingOrSearch(searchObj).then(res => {
        this.total = res.data.data.totalElements
        res.data.data.records.forEach(item => {
          item.open === 1 ? (item.onSwitch = true) : (item.onSwitch = false)
        })
        this.tableData = res.data.data.records
      })
    },
    // 车辆详情
    detailItem(carSn) {
      this.carSn = carSn
      this.$service.get_carInfoDetail(carSn).then(res => {
        this.detailData = res.data.data
        if (this.detailData.lastCarNumber) {
        } else {
          this.detailData.lastCarNumber = '暂无'
        }
        switch (this.detailData.businessStatus) {
          case 100:
            this.detailData.statusName = '未上线'
            break
          case 200:
            this.detailData.statusName = '运营中'
            break
          case 300:
            this.detailData.statusName = '维保整备'
            break
          case 401:
            this.detailData.statusName = '已下线（报废）'
            break
          case 402:
            this.detailData.statusName = '已下线（售出）'
            break
        }
        this.inforSuccess = true
        this.carRecordList()
      })
      this.$nextTick(() => {
        this.detailPage = true
      })
    },
    // 操作记录
    carRecordList (page = 1) {
      this.$service.carRecordList({carSn: this.detailData.carSn}, page, 5).then((res) => {
        this.recordList = res.data.data.records
        this.paginationParams = {
          total: res.data.data.totalElements,
          pageSize: res.data.data.pageSize
        }
      }).catch((res) => {
      })
    },
    carlogPageChange (val) {
      this.carRecordList(val)
    },
    // 重新加载数据
    reloadList () {
      this.handleSearch()
    },
    updateSalesman (val) {
      console.log(val)
    }
  }
}
</script>
<style lang="scss">
.handle {
  display: flex;
  justify-content: space-around;
  // margin-right: 5px;
}
.detail-page {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-right: 30px;
}
.station-name {
  // color: #3498db;
  cursor: pointer;
}
#car-info-table {
  .el-switch {
    font-size: 0;
    outline: none;
  }
}
</style>
