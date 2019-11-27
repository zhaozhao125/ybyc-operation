 <template>
  <div class="unbind_car_list">
    <el-form ref="form" :params="params" label-width="80px">
      <el-form-item label="网点:">
        <el-row>
          <el-col>
            <el-select size="small" v-model="returnStationId" filterable remote reserve-keyword placeholder="请输入网点" :remote-method="remoteMethod" @change="getAllCarsFromStationid" :clearable="true">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>

          </el-col>
        </el-row>
      </el-form-item>
      <el-table :data="list" style="width: 100%" ref="multipleTable" @select='selectItem' @selection-change="handleSelectionChange">
        <el-table-column type="selection" label="111" width="55">
        </el-table-column>
        <el-table-column prop="carNumber" label="车辆" width="180">
        </el-table-column>
        <el-table-column prop="carGenreName" label="车型" width="180">
        </el-table-column>
        <el-table-column prop="soc" label="电量">
          <template slot-scope="scope">
            <span>{{scope.row.soc}}%</span> <br>
          </template>
        </el-table-column>
      </el-table>
      <div class='table-page'>
        <el-pagination :current-page="1" :page-size="params.pageSize" layout="total, prev, pager, next" :total="params.total" @current-change="pageChange">
        </el-pagination>
      </div>
      <span class="notice" v-show="notice&&sameCarGenre">{{notice}}</span>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      returnStationId: '',
      options: [],
      choooseCar: [],
      rowSelectedStation: {},
      sameCarGenre: false,
      notice: ''

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
    },
    cityId: Number
  },
  methods: {
    getAllCarsFromStationid(val) {
      if (val) {
        this.$emit('on-stationChange', val)
      }
    },
    remoteMethod(value) {
      let params = {
        name: value,
        open: true,
        rentType: 3,
        visible: true,
        operationCityId: parseInt(this.cityId)
      }

      this.$service.getAllNetworkStation(params).then((res) => {
        console.log('remoteMethods')
        if (res.data.code == '0' && res.data.data.length > 0) {
          this.options = this.$service.formateAllNetworkStation(res.data.data)
          console.log(this.options)
        } else {
          this.options = []
        }
      }).catch((res) => { })
    },
    pageChange(val) {
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
    selectItem(val) {
      console.log(val, 'valaaaa')
      if (val.length) {
        this.sameCarGenre = !val[0].sameCarGenre
        this.notice = val[0].notice
      } else {
        this.sameCarGenre = false
      }
    },
    handleSelectionChange(val) {
      // if(val.)
      if (val.length > 1) {
        this.toggleSelections([val[0]])
      }
      this.choooseCar = val
    }
  },
  mounted() {
  },
  props: {
    list: {
      default: [],
      type: Array
    },
    params: {
      default: {},
      type: Object
    }
  }
}
</script>
  <style lang="scss">
     .unbind_car_list {
             .notice{
         color:red;
        white-space: nowrap;
       }
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
