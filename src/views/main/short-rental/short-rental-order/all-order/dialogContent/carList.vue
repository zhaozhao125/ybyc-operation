 <template>
     <div class="dialog_content_car_list">
      <el-form ref="form"
              :params="params"
              label-width="80px"
      >
      <div class="getNet">
        <el-form-item label="网点:">
        <el-row>
          <el-col>
            <el-select
              v-model="returnStationId"
              size = "small"
              filterable
              remote
              :clearable='true'
              :remote-method="remoteMethod"
              @change="getAllCarsFromStationid"
              placeholder="请输入网点"
              >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>

          </el-col>
        </el-row>
      </el-form-item>
      </div>
      <el-table
        :data="list"
        style="width: 100%"
        ref="multipleTable"
        @selection-change="handleSelectionChange">
         <el-table-column
          type="selection"
          label="111"
          width="55">
        </el-table-column>
        <el-table-column
          prop="carNumber"
          label="车辆"
          width="180">
        </el-table-column>
        <el-table-column
          prop="carGenreName"
          label="车型"
          width="180">
        </el-table-column>
        <el-table-column
          prop="soc"
          label="电量">
            <template slot-scope="scope">
              <span>{{scope.row.soc}}%</span> <br>
            </template>
        </el-table-column>
      </el-table>
      <div class='table-page'>
          <el-pagination :current-page="1" :page-size="params.pageSize" layout="total, prev, pager, next" :total="params.total" @current-change="pageChange">
          </el-pagination>
        </div>
        </el-form>
    </div>
  </template>

<script>
export default {
  data() {
    return {
      carlist: [],
      options: [],
      cityId: 0,
      returnStationId: '',
      rowSelectedStation: {},
      choooseCar: []
    }
  },
  props: {
    params: {
      default: {},
      type: Object
    },
    list: {
      default: [],
      type: Array
    }
  },
  methods: {
    initData() {
      this.options = []
      this.returnStationId = ''
      this.carlist = []
    },
    getAllCarsFromStationid(val) {
      if (val) {
        this.$emit('on-stationChange', val)
      }
      // let params = {
      //   page: 1,
      //   pageSize: 20,
      //   stationId: value,
      //   orderSn: this.params.sn
      // }

      // if (!value) {
      //   this.carlist = []
      //   this.options = []
      //   return false
      // }
      // // 页面选择的网点数据
      // if (this.options.length > 0) {
      //   this.rowSelectedStation = this.$service.getRowByValue(value, this.options)
      // }

      // // 页面选择的网点数据
      // if (this.options.length > 0) {
      //   this.rowSelectedStation = this.$service.getRowByValue(value, this.options)
      // }

      // // 页面数据清空
      // this.carlist = []

      // this.$service.getAllCarsFromStationid(params).then((res) => {
      //   if (res.data.code === '0' && res.data.data.records.length > 0) {
      //     this.carlist = res.data.data.records
      //   } else {
      //     this.carlist = []
      //   }
      // }).catch((res) => {
      //   this.carlist = []
      // })
    },

    remoteMethod(value) {
      let params = {
        name: value,
        open: true,
        rentType: 3,
        visible: true,
        operationCityId: parseInt(this.cityId)
      }
      if (!value) {
        params = {}
      }
      this.options = []
      this.$service.getAllNetworkStation(params).then((res) => {
        if (res.data.code == '0' && res.data.data.length > 0) {
          this.options = this.$service.formateAllNetworkStation(res.data.data)
        } else {
          this.options = []
        }
      }).catch((res) => {})
    },
    pageChange (val) {
      this.$emit('on-pageChange', val)
    },
    toggleSelections(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange(val) {
      // this.multipleSelection = val;
      if (val.length > 1) {
        this.toggleSelections([val[0]])
      }
      this.choooseCar = val
      console.dir(this.choooseCar)
    }
  },
  mounted () {
    this.initData()
  }
}
</script>
  <style lang="scss">
     .dialog_content_car_list {
       .el-pagination {
         text-align: right;
         margin-top: 10px;
       }
       .el-table {
         .el-table__header-wrapper {
           thead {
             .el-checkbox__input {
               display: none;
             }
           }
         }
       }
       .getNet {
         .net {
           color: #F56C6C;
         }
       }
     }
  </style>
