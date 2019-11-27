<template>
  <div class="track-info" v-show="tableData && tableData.length>0">
    <table cellspacing="0">
      <tr v-for="(item, index) in tableData" :key="index">
        <td>{{item.label}}</td>
        <td>{{item.value}}</td>
      </tr>
    </table>
  </div>
</template>

<script>
import * as dict from '@/config/data-dictionary/car.js'
import { getStatusByDict } from '@/utils/common'
import dayjs from 'dayjs'
export default {

  name: 'track-info',

  props: {
    pointData: {
      required: true
    }
  },

  data () {
    return {

    }
  },

  computed: {
    tableData() {
      let pointData = this.pointData
      if (!pointData) {
        return []
      }
      let ret = [/* {
        label: '上一个车辆状态',
        value: getStatusByDict(dict.lastCarStatusDict, pointData.prevStatus)
      }, */{
          label: '当前车辆状态',
          value: getStatusByDict(dict.carStatusDictionary, pointData.rentStatusCode)
        }, {
          label: '纬度[高德]',
          value: pointData.lat
        }, {
          label: '经度[高德]',
          value: pointData.lng
        }, {
          label: '剩余电量',
          value: pointData.soc + '%'
        }, {
          label: '目前总里程数',
          value: pointData.odo
        }, {
          label: '总电流',
          value: pointData.powerCurrent == -1 ? '获取失败' : pointData.powerCurrent
        }, {
          label: '当前时速',
          value: pointData.speed + 'km/h'
        }, {
          label: '当前电源状态',
          value: getStatusByDict(dict.carPowerStatusDictionary, pointData.charging)
        }, {
          label: 'GPRS网络信号强度',
          value: pointData.locationSignal == -1 ? '获取失败' : pointData.locationSignal
        }, {
          label: 'GPS天线检测状态',
          value: getStatusByDict(dict.GPRSStatusDict, pointData.antenna)
        }, {
          label: 'acc状态',
          value: getStatusByDict(dict.accDict, pointData.acc)
        }, {
          label: '更新时间',
          value: dayjs(pointData.reportTime * 1000).format('YYYY-MM-DD HH:mm:ss')
        }]
      return ret
    }
  }
}
</script>

<style lang="scss">
.track-info{
  position: absolute;
    top: 120px;
    left: 0;
    background-color: rgba(0,0,0,.6);
    color: #fff;
    font-size: 14px;
    table{
      padding: 5px;
      td{
        border-bottom: 1px solid #777;
        padding: 4px 8px;
      }
      tr:last-child{
        td{
          border-bottom: none;
        }
      }
    }
}
</style>
