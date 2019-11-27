<template>
  <div id="branches-list-table" class="components-content">

    <!-- 详情页开始 -->
    <v-page :visible.sync="detailPage">
      <h3 slot="title">网点详情</h3>
      <template slot="content">
        <!-- 详情页组件 -->
        <v-detail :detailData="detailData" :detailId="detailId"></v-detail>
      </template>
    </v-page>
    <!-- 详情页结束 -->
    <!-- 表格开始 -->
    <el-table :data="tableData" height="100%">
      <el-table-column label="编号" min-width="120">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="查看网点详情" placement="top">
            <el-button type="text" v-show="scope.row.disableId" @click="detailItem(scope.row.id,scope.$index)">{{scope.row.sn}}</el-button>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="网点名称" show-overflow-tooltip min-width="130">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="cityName" label="运营城市" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.operationCityName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="districtName" label="所属片区" show-overflow-tooltip></el-table-column>
      <el-table-column prop="address" label="地址" show-overflow-tooltip min-width="250"></el-table-column>
      <el-table-column label="网点类型" show-overflow-tooltip>
        <template slot-scope="scope">
          <!-- <span v-show="scope.row.type">{{websiteType(scope.row.type)}}</span> -->
          <span v-show="scope.row.typeName">{{scope.row.typeName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="网点车辆" show-overflow-tooltip min-width="150">
        <template slot-scope="scope">
          <div>
            <p>运营中车辆：{{scope.row.operatingCarNum ? scope.row.operatingCarNum : 0}}</p>
            <p>维保整备车辆：{{scope.row.maintenanceCarNum ? scope.row.maintenanceCarNum : 0}}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="运营中车辆" show-overflow-tooltip min-width="150">
        <template slot-scope="scope">
          <div>
            <p>分时车辆数：{{scope.row.shareCarTotalNum ? scope.row.shareCarTotalNum : 0}}</p>
            <p>短租车辆数：{{scope.row.shortCarTotalNum ? scope.row.shortCarTotalNum: 0}}</p>
            <p>app显示车辆数：{{scope.row.appCarNum ? scope.row.appCarNum : 0}}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="网点租赁类型" show-overflow-tooltip min-width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.timeSharingStation&&scope.row.longRentStation">分时、短租</span>
          <span v-else-if="scope.row.timeSharingStation">分时</span>
          <span v-else>短租</span>
        </template>
      </el-table-column>
      <el-table-column prop="createdOn" label="添加时间" show-overflow-tooltip min-width="150"> </el-table-column>
      <el-table-column prop="modifiedOn" label="修改时间" show-overflow-tooltip min-width="150"></el-table-column>
      <el-table-column label="位置" show-overflow-tooltip>
        <template slot-scope="scope">
          <site-map :centerPosition="scope.row.location" v-show="scope.row.disableId" :siteItemData='scope.row'></site-map>
        </template>
      </el-table-column>
      <el-table-column label="是否启用" min-width="80">
        <template slot-scope="scope">
          <popSwitch v-if="scope.row.disableId" v-model="scope.row.open" :rowData="scope.row" trueText="是否禁用该网点？" falseText="是否启用该网点？" @confirm="handleConfirmSwitch(scope.row)"></popSwitch>
          <el-switch v-else disabled v-model="scope.row.open" active-color="#13ce66" inactive-color="#dcdfe6"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" min-width="100">
        <template slot-scope="scope">
          <div style="display:flex;">
            <el-button type="text" @click="editList(scope.row,2)" v-show="scope.row.disableId" v-has="'branchesListEdit'">编辑</el-button>
            <el-popover :ref="'deletePop'+scope.$index" placement="bottom" title="提示" width="200" trigger="click">
              <div>
                <i class="el-icon-warning" style="color:red;margin-right:5px;"></i>确认删除该网点吗？
              </div>
              <div style="text-align: right; margin-top: 5px">
                <el-button type="text" @click="deleteCancel(scope.$index)">取消</el-button>
                <el-button type="text" @click="deleteItem(scope.row.id,scope.$index)">删除</el-button>
              </div>
              <el-button slot="reference" type="text" v-show="scope.row.disableId" v-has="'branchesListDelete'">删除</el-button>
            </el-popover>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 表格结束 -->
    <div class='table-page'>
      <el-pagination @current-change="handleCurrentChange" :current-page.sync="paging.page" :page-size="paging.rows" layout="total, prev, pager, next" :total="total"></el-pagination>
    </div>
  </div>
</template>
<script>
import vDetail from './detail'
import { branchesSearchPage } from '@/mixins/search-page'
import siteMap from '@/components/siteMap/site-map'
// import { handleWebsiteType } from '@/utils/common'
import popSwitch from '@/components/pop-switch' // 引入switch组件
export default {
  name: 'branches-list-table',
  mixins: [branchesSearchPage],
  props: ['websiteName'],
  data() {
    return {
      detailId: '',
      isSwitchDisabled: false,
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
      selectSite: [],
      areaList: [],
      successFlagBit: false // 启用或者禁用成功的标志位
    }
  },
  mounted() {
    this.$nextTick(() => { })
  },
  methods: {
    handleConfirmSwitch(data) {
      if (data.open && (data.carNum || data.appCarNum || data.longCarNum)) {
        this.$message.warning('该网点下有车辆,不能禁用')
        return
      }
      // data相当于拿到了 row对象  这样就可以修改堆中的数据
      // data是一个对象是引用类型
      // scope.row.open 这样只相当于一个open变量它是基本类型
      // scope.row与data都指向了同一个对象，所以修改data属性的以后，scope.row，当然也发生了变化！
      this.$service.post_stationUpdateStatus(data.id, !data.open).then(res => {
        data.open = !data.open
        this.$message.success(data.open ? '网点启用成功' : '网点禁用成功')
      })
    },
    // websiteType(data) {
    //   return handleWebsiteType(data)
    // },
    deleteCancel(index) {
      this.$refs['deletePop' + index].doClose()
    },
    // 编辑网点
    editList(row, editNum) {
      // 从详情页拿数据
      this.$service.get_websiteDetail(row.id).then(res => {
        let resData = res.data.data
        resData.imgs = resData.imgs.map(item => {
          return {
            name: item.split('/').pop(),
            url: item
          }
        })
        let rentObj = { rentType: [] }
        if (resData.longRentStation && resData.timeSharingStation) {
          rentObj.rentType.unshift('fenshi', 'changzu')
        } else {
          if (resData.longRentStation) {
            rentObj.rentType.unshift('changzu')
          } else {
            rentObj.rentType.unshift('fenshi')
          }
        }
        // 把下拉片区数据传过去
        this.getDistrictList(res.data.data.operationCityId)
        let editorData = { ...row, ...res.data.data, ...rentObj }
        this.$emit('editorData', editorData, editNum, this.areaList)
      })
    },
    // 下拉片区数据
    getDistrictList(cityId) {
      this.$service.get_districtList(cityId).then(res => {
        this.areaList = res.data.data.map(item => {
          return {
            value: item.id,
            label: item.name
          }
        })
      })
    },
    handleSearch() {
      let searchObj = { ...this.paging, ...this.searchData }
      this.$service.post_stationPage(searchObj).then(res => {
        console.log(res, 'res')
        this.total = res.data.data.total
        res.data.data.rows.forEach(item => {
          item.disableId = !(item.id === 598 || item.id === 599)
        })
        this.tableData = res.data.data.rows
      })
    },
    // 删除网点
    deleteItem(id, index) {
      let itemIndex = this.tableData[index]
      if (itemIndex.carNum || itemIndex.appCarNum || itemIndex.longCarNum) {
        this.$message.warning('该网点下有车辆,禁止删除')
        this.$refs['deletePop' + index].doClose()
        return
      }
      this.$service.post_stationDelete(id).then(res => {
        this.$message.success('删除网点成功')
        this.$refs['deletePop' + index].doClose()
        this.handleSearch()
      })
    },
    // 车辆详情
    detailItem(detailId, index) {
      this.$service.get_websiteDetail(detailId).then(res => {
        res.data.data.imgsImgDescription = res.data.data.imgDescribe
        this.detailData = res.data.data
        // 因为详情里面地图和图片的加载是异步的 所以要在数据变化后要执行显示 或者 获取更新后的DOM
        // 当第二次进入详情页之后 下一个还没有更新就被第一个地图覆盖了
        this.$nextTick(() => {
          this.detailPage = true
        })
      })
    }
  },
  components: {
    vDetail,
    siteMap,
    popSwitch
  }
}
</script>
