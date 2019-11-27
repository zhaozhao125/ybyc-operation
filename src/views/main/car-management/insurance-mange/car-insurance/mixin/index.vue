<script>
import dayjs from 'dayjs'
export default {
  data () {
    return {
    }
  },
  methods: {
    cityChange (id) {
      let city = JSON.parse(window.sessionStorage.getItem('loginData')).cityModels.filter((ele) => {
          return ele.id === id
      })
      return city
     },
    carChange (id, list) {
       let carName = list.filter((ele) => {
          return ele.value === id
      })
      return carName
     },
     timeChange (value, format) {
        if (!format) {
          format = 'YYYY-MM-DD HH:mm:ss'
        }
        if (!isNaN(value)) {
          if (String(value).length === 10) {
            return dayjs.unix(value).format(format)
          } else if (String(value).length === 13) {
            return dayjs(value).format(format)
          } else {
            return '暂无'
          }
        }
        let date = new Date(value)
        if (!isNaN(date.getTime())) {
          return dayjs(value).format(format)
        }
        return '暂无'
      },
      insuranceTypeChange (val) {
        switch (val) {
          case 'VI':
            return '商业险'
            break;
          case 'CLIVTA':
            return '交强险'
            break;
          case 'DRIVING':
            return '驾乘险'
            break;  
        }
      },
      insuranceStatusChange (status, endTime) {
        if (status === 'ignored') {
          return '不续保'
        } else if (status === 'uncertain') {
          if (Number(endTime) * 1000 >= Date.now()) {
            return '在保'
          } else {
            return '脱保'
          }
        } else {}
      }
  }
}
</script>
