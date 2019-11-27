<template>
  <div class="search-form">
    <el-form :inline="true" :model="searchForm" size="small" ref="searchForm" :rules="searchFormRule">
      <el-form-item label="" class="search-by" prop="searchBy">
        <el-select v-model="searchForm.searchBy" placeholder="请选择查询方式" @change="handleChangeSearchBy" :clearable="false">
          <el-option v-for="item in searchOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="" prop="carSearch" v-if="searchForm.searchBy == 'time'">
        <el-autocomplete v-model="searchForm.carSearch" placeholder="请输入完整车牌号" :fetch-suggestions="_querySearch('carSearch')"></el-autocomplete>
      </el-form-item>
      <!-- <el-form-item label="" class="search-date" prop="date" v-if="searchForm.searchBy == 'time'">
        <el-date-picker v-model="searchForm.date" align="right" type="date" placeholder="请选择日期" :picker-options="datePickerOptions" :clearable="false">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="" class="search-time" prop="timeRange" v-if="searchForm.searchBy == 'time'">
        <el-time-picker is-range v-model="searchForm.timeRange" arrow-control range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="请选择时间范围" :clearable="false">
        </el-time-picker>
      </el-form-item> -->
      <!-- <template v-if="searchForm.searchBy == 'time'">
        <el-form-item label="" class="start-time" prop="startTime">
          <el-date-picker v-model="searchForm.startTime" type="datetime" placeholder="请选择开始日期" :clearable="false" :time-arrow-control="true" @change="handleDateChange">
          </el-date-picker>
        </el-form-item>
        <span style="vertical-align: middle;margin-left: -10px;">-</span>
        <el-form-item label="" class="end-time" prop="endTime">
          <el-date-picker v-model="searchForm.endTime" type="datetime" placeholder="请选择结束日期" :clearable="false" :time-arrow-control="true">
          </el-date-picker>
        </el-form-item>
      </template> -->
      <el-form-item ref="datePicker" label="" prop="timeRange" v-if="searchForm.searchBy == 'time'">
        <el-date-picker v-model="searchForm.timeRange" type="datetimerange" time-arrow-control range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="" prop="orderSearch" v-else>
        <el-autocomplete v-model="searchForm.orderSearch" placeholder="输入订单号" :fetch-suggestions="_querySearch('orderSearch')"></el-autocomplete>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="loadingCar" @click="handleSearch">查询</el-button>
      </el-form-item>
    </el-form>
    <el-form :inline="true" :model="playForm" size="small" ref="playForm" v-if="!loading" v-show="canPlay">
      <el-form-item label="" class="play-by" prop="playBy" :clearable="false">
        <el-select v-model="playForm.playBy" placeholder="请选择播放方式" @change="handleChangePlayBy" :disabled="isPlaying">
          <el-option v-for="item in playOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="轨迹播放速度" v-if="playForm.playBy == 'speed'">
        <el-select v-model="playForm.playSpeed" placeholder="请选择轨迹播放速度" :clearable="false" @change="handleChangePlaySpeed">
          <el-option v-for="item in speedOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="轨迹播放速度" v-if="playForm.playBy == 'time'">
        <el-select v-model="playForm.timeSpeed" placeholder="请选择轨迹播放速度" :clearable="false" @change="handleChangeTimeSpeed">
          <el-option v-for="item in timeOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否显示数据">
        <el-switch v-model="playForm.showData" @change="handleChangeShowData">
        </el-switch>
      </el-form-item>
      <el-form-item>
        <el-button :type="isPlaying?'danger':'primary'" @click="handlePlay" :disabled="!canPlay">{{isPlaying?'暂停':'播放'}}</el-button>
      </el-form-item>
    </el-form>
    <p style="margin-bottom:10px" v-else>正在加载轨迹巡航组件...</p>
  </div>
</template>
<script>
import searchHistoryMixin from '@/mixins/search-history.js';
export default {
  name: 'car-track-form',

  mixins: [
    searchHistoryMixin
  ],

  props: {
    loading: {
      type: Boolean,
      default: true
    },
    canPlay: {
      type: Boolean,
      default: false
    }
  },

  data() {
    let endTime = new Date()
    let startTime = new Date(endTime.toDateString())
    return {
      loadingCar: false,
      searchForm: {
        searchBy: 'time',
        // date: '',
        timeRange: [startTime, endTime],
        // startTime: '',
        // endTime: '',
        orderSearch: '',
        carSearch: ''
      },
      searchFormRule: {
        carSearch: [{
          required: true,
          message: '请输入车牌号或车架号',
          trigger: 'change'
        }],
        // date: [{
        //   required: true,
        //   message: '请选择日期',
        //   trigger: 'change'
        // }],
        timeRange: [{
          required: true,
          message: '请输入时间范围',
          trigger: 'change'
        }],
        orderSearch: [{
          required: true,
          message: '请输入订单号',
          trigger: 'change'
        }]
      },
      searchOptions: [{
          label: '按时间查',
          value: 'time'
        },
        {
          label: '按订单查',
          value: 'order'
        }
      ],
      playForm: {
        playBy: 'speed',
        playSpeed: 50,
        timeSpeed: 1,
        showData: true
      },
      playOptions: [{
          label: '匀速播放',
          value: 'speed'
        },
        {
          label: '实时速度播放',
          value: 'time'
        }
      ],
      speedOptions: [{
          label: '50km/h',
          value: 50
        },
        {
          label: '100km/h',
          value: 100
        },
        {
          label: '200km/h',
          value: 200
        },
        {
          label: '300km/h',
          value: 300
        },
        {
          label: '500km/h',
          value: 500
        },
        {
          label: '800km/h',
          value: 800
        },
        {
          label: '1500km/h',
          value: 1500
        },
        {
          label: '3000km/h',
          value: 3000
        }
      ],
      timeOptions: [{
        label: 'x1',
        value: 1
      }, {
        label: 'x10',
        value: 10
      }, {
        label: 'x20',
        value: 20
      }, {
        label: 'x30',
        value: 30
      }, {
        label: 'x60',
        value: 60
      }, {
        label: 'x100',
        value: 100
      }, {
        label: 'x200',
        value: 200
      }],
      isPlaying: false,
      searchSettings: [{
          name: 'orderSearch',
          type: 'autocomplete',
          data: []
        },
        {
          name: 'carSearch',
          type: 'autocomplete',
          data: []
        }
      ],
      datePickerOptions: {
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date());
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24);
            picker.$emit('pick', date);
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', date);
          }
        }]
      }
    }
  },
  mounted() {
    console.log('====date====', this.$refs.datePicker)
  },
  methods: {
    setCarNumber(carNumber, timeRange) {
      this.searchForm.searchBy = 'time'
      this.searchForm.carSearch = carNumber
      if(timeRange && timeRange.length){
        if(timeRange[0].length == 10){
          this.searchForm.timeRange = [new Date(timeRange[0] * 1000), new Date(timeRange[1] * 1000)]
        }
      }
    },
    setOrderId(orderId){
      this.searchForm.searchBy = 'order'
      this.searchForm.orderSearch = orderId
    },
    // getTimeRange(){
    //   let startTime = new Date(this.searchForm.date.getFullYear(), this.searchForm.date.getMonth(), this.searchForm.date.getDate(), this.searchForm.timeRange[0].getHours(), this.searchForm.timeRange[0].getMinutes(), this.searchForm.timeRange[0].getSeconds())
    //   let endTime = new Date(this.searchForm.date.getFullYear(), this.searchForm.date.getMonth(), this.searchForm.date.getDate(), this.searchForm.timeRange[1].getHours(), this.searchForm.timeRange[1].getMinutes(), this.searchForm.timeRange[1].getSeconds())
    //   return {
    //     startTime: String(startTime.getTime()).substr(0, 10),
    //     endTime: String(endTime.getTime()).substr(0, 10)
    //   }
    // },
    handleSearch() {
      this.$refs.searchForm.validate((valid) => {
        if (valid) {
          this.isPlaying = false
          this.$emit('pause')
          let data = this.searchForm
          if (data.searchBy == 'time') {
            this.loadingCar = true
            this.$service.getCarByNumber(data.carSearch).then(res => {
              let car = res.data.data.records[0]
              if (car && car.carSn) {
                let params = {
                  carSn: car.carSn
                }
                // let queryTime = this.getTimeRange()
                // let queryTime = {
                //   startTime: String(data.startTime.getTime()).substr(0, 10),
                //   endTime: String(data.endTime.getTime()).substr(0, 10)
                // }
                // params.startTime = queryTime.startTime
                // params.endTime = queryTime.endTime
                params.startTime = String(data.timeRange[0].getTime()).substr(0, 10)
                params.endTime = String(data.timeRange[1].getTime()).substr(0, 10)

                this.$emit('search', 'time', params)
                this._saveSearchHistory(data.carSearch, 'carSearch')
              } else {
                this.$message({
                  message: '查询不到相关车辆',
                  type: 'warning'
                })
              }
              this.loadingCar = false
            }).catch(err => {
              this.loadingCar = false
            })

          } else {
            this._saveSearchHistory(data.orderSearch, 'orderSearch')
            this.$emit('search', 'order', data.orderSearch)
          }

        }
      })
    },
    handlePlay() {
      if (this.isPlaying) {
        this.isPlaying = false
        this.$emit('pause')
      } else {
        this.isPlaying = true
        this.$emit('play', this.playForm)
      }
    },
    togglePlayState() {
      this.isPlaying = !this.isPlaying
    },
    handleChangeSearchBy() {
      this.$refs.searchForm.clearValidate()
    },
    handleChangePlayBy() {
      this.$emit('changePlayBy')
      this.$refs.playForm.clearValidate()
    },
    handleChangePlaySpeed(newSpeed) {
      this.$emit('changeSpeed', 'playSpeed', newSpeed)
    },
    handleChangeTimeSpeed(newSpeed) {
      this.$emit('changeSpeed', 'timeSpeed', newSpeed)
      if (this.isPlaying) {
        this.$emit('pause')
        this.$nextTick(() => {
          this.$emit('play', this.playForm)
        })
      }
    },
    handleChangeShowData(newVal) {
      this.$emit('toggleInfo', newVal)
    }
  }
}

</script>
<style lang="scss">
.search-form {
  margin-bottom: -22px;
  .search-by {
    width: 110px;
  }
  .search-date {
    width: 140px;
  }
  .search-time {
    .el-range-separator {
      width: 28px;
    }
  }
}

</style>
