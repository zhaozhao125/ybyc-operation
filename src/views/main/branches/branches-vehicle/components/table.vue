<template>
  <section id="branches-vehicle-table"
           class="components-content">
    <div v-show="total"
         class="content">
      <div class="search-car-number table-operator">
        <v-search :searchSettings="carNumbersearchSetting"
                  hideReset
                  @search="carNumberSearch"
                  labelWidth='130px'></v-search>
      </div>
      <el-table :data="tableData"
                height="100%">
        <el-table-column label="车牌号"
                         show-overflow-tooltip
                         min-width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.carNumber">{{scope.row.carNumber}}</span>
            <span v-else>未知</span>
          </template>
        </el-table-column>
        <el-table-column prop="carModelName"
                         label="车型"
                         min-width="120">
        </el-table-column>
        <el-table-column prop="businessStatusName"
                         label="运营状态"
                         min-width="100">
        </el-table-column>
        <el-table-column prop="carState"
                         label="租赁状态"
                         show-overflow-tooltip
                         min-width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.rentStatusCode===-1">未知</span>
            <span v-else
                  :class="carStateStyle(scope.row.rentStatusCode)">{{getRentStatus[scope.row.rentStatusCode]}}</span>
          </template>
        </el-table-column>
        <el-table-column label="电量(%)"
                         show-overflow-tooltip
                         min-width="100">
          <template slot-scope="scope">
            <div style="display:flex">
              <span v-if="scope.row.soc==-1">未知</span>
              <span :class="{'state-red':scope.row.soc<30}"
                    v-else>{{Math.floor(scope.row.soc)}}% </span>
              <span v-show="scope.row.charging===1">(充电中)</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="alarmTypeName"
                         label="租赁类型"
                         show-overflow-tooltip
                         min-width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.rentType ===1">分时</span>
            <span v-else-if="scope.row.rentType ===3">短租</span>
            <span v-else>未知</span>
          </template>
        </el-table-column>
        <el-table-column label="所属网点"
                         show-overflow-tooltip
                         min-width="200">
          <template slot-scope="scope">
            <span v-if="scope.row.stationName">{{scope.row.stationName}}</span>
            <span v-else>未知</span>
          </template>
        </el-table-column>

        <el-table-column label="是否在app上展示"
                         show-overflow-tooltip
                         min-width="130">
          <template slot-scope="scope">
            <span v-if="scope.row.visible">是</span>
            <span v-else>否</span>
          </template>
        </el-table-column>
        <el-table-column label="是否空闲"
                         show-overflow-tooltip
                         min-width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.available">是</span>
            <span v-else>否</span>
          </template>
        </el-table-column>
        <el-table-column prop="carState"
                         label="操作"
                         show-overflow-tooltip
                         fixed="right"
                         width="100">
          <template slot-scope="scope">
            <el-popover placement="top"
                        title="选择网点："
                        width="335"
                        trigger="click"
                        :ref="'selectSitePop' + scope.$index">
              <el-form :rules="siteRules"
                       :ref="'siteRuleForm'+scope.$index"
                       :model="ruleForm">
                <el-form-item label=""
                              prop="selectPlace">
                  <website-select v-model="ruleForm.selectPlace"
                                  isRequest
                                  @selectItemId="getNewStationId"
                                  placeholder="请输入网点名称"></website-select>
                </el-form-item>
              </el-form>
              <div style="text-align: right; margin-top: 10px">
                <el-button size="small"
                           type="text"
                           @click="handleCancel(scope.$index)">取消</el-button>
                <el-button type="primary"
                           size="mini"
                           @click="isSelectSite(scope.row,scope.$index)">确定</el-button>
              </div>
              <el-button slot="reference"
                         type="text"
                         v-show="scope.row.rentStatusCode===0">更换网点</el-button>
            </el-popover>

          </template>
        </el-table-column>
      </el-table>
    </div>
    <span v-show="!total"
          class="no-data">{{noData}}</span>
    <div class='table-page'>
      <el-pagination @current-change="handleCurrentChange"
                     :current-page.sync="paging.page"
                     :page-size="paging.rows"
                     layout="total, prev, pager, next"
                     :total="searFlagBit?total:carTotal"></el-pagination>
    </div>
  </section>
</template>
<script>
// 这个模块没有使用mixin
import { pageSize } from '@/config/page-config'
import { carRentList } from '@/config/select-data'
import vSearch from '@/components/search/vSearch'
import websiteSelect from '@/components/website-select'
import { getCarStateStyle, getRentStatus } from '@/utils/common'
export default {
  name: 'branches-vehicle-table',
  components: {
    vSearch,
    websiteSelect
  },
  props: {
    searchData: {
      type: Object
    }
  },
  data() {
    return {
      getRentStatus,
      tableData: [],
      total: 0,
      carTotal: 0,
      paging: {
        page: 1,
        rows: pageSize
      },
      carNumber: null,
      noData: '请输入网点名称',
      newStationId: null, // 新的网点id
      listData: [], // 网点列表数据
      searFlagBit: false, // 搜索标志位
      carNumbersearchSetting: [
        {
          label: '车牌号',
          name: 'carNumber',
          type: 'text',
          placeholder: '请输入车牌号',
          visible: true
        },
        {
          label: '租赁类型',
          name: 'rentType',
          type: 'select',
          options: carRentList,
          visible: true
        },
        {
          label: '运营状态',
          name: 'businessStatus',
          type: 'select',
          options: [
            {
              label: '运营中',
              value: 200
            },
            {
              label: '维保整备',
              value: 300
            }
          ],
          visible: true
        },
        {
          label: '是否在app上展示',
          name: 'visible',
          type: 'select',
          options: [
            {
              label: '是',
              value: 'true'
            },
            {
              label: '否',
              value: 'false'
            }
          ],
          visible: true
        },
        {
          label: '是否空闲',
          name: 'available',
          type: 'select',
          options: [
            {
              label: '是',
              value: 'true'
            },
            {
              label: '否',
              value: 'false'
            }
          ],
          visible: true
        }
      ],
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
      }
    }
  },
  watch: {
    searchData() {
      this.paging.page = 1
      this.handleSearch()
    }
  },
  methods: {
    carStateStyle(statue) {
      return getCarStateStyle(statue)
    },
    // 拿到网点id
    getNewStationId(newStationId) {
      this.newStationId = newStationId
      console.log(newStationId, '新的id')
    },
    // 取消
    handleCancel(index) {
      this.ruleForm.selectPlace = ''
      this.$refs['selectSitePop' + index].doClose()
      this.$refs['siteRuleForm' + index].resetFields() // 重置验证
    },
    // 选择网点
    isSelectSite(row, index) {
      console.log(row, '---')
      this.$refs['siteRuleForm' + index].validate(valid => {
        if (valid) {
          let {
            carId,
            stationId: oldStationId,
            newStationId = this.newStationId
          } = row
          this.$service
            .post_changeStation({ carId, oldStationId, newStationId })
            .then(res => {
              this.$message.success('更换网点成功')
              this.isPostParams()
              this.$refs['selectSitePop' + index].doClose()
            })
            .catch(error => {
              this.$message.warning(error.msg)
              this.$refs['selectSitePop' + index].doClose()
            })
        } else {
          return false
        }
      })
    },
    handleCurrentChange(page) {
      // 标志位
      this.paging.page = page
      this.isPostParams()
    },
    // 是否传入carNumber
    isPostParams() {
      this.searFlagBit ? this.handlePort() : this.handlePort(this.carNumber)
    },
    // 搜索网点下的车辆
    handleSearch() {
      this.searFlagBit = true
      this.handlePort()
    },
    // 搜索车牌号
    carNumberSearch(carNumber) {
      this.paging.page = 1
      this.searFlagBit = false
      this.carNumber = carNumber
      this.handlePort(carNumber)
    },
    // 传入接口的数据
    handlePort(id) {
      if (this.searchData.stationId) {
        this.noData = '暂无数据'
        let searchObj = { ...this.paging, ...this.searchData, ...id }
        console.log(searchObj, '=-=-=-=')
        this.$service.get_searchCarsByStation(searchObj).then(res => {
          this.tableData = res.data.data.rows
          // 搜索网点
          if (this.searFlagBit) {
            this.total = res.data.data.total
          } else {
            // 搜索车牌号
            this.carTotal = res.data.data.total
          }
        })
      } else {
        this.total = 0
        this.noData = '请输入网点名称'
      }
    }
  }
}
</script>
 <style lang="scss">
#branches-vehicle-table {
  .no-data {
    display: inline-block;
    width: 100%;
    text-align: center;
  }
  .search-car-number {
    margin-bottom: 15px;
  }
  .content {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
}
</style>
