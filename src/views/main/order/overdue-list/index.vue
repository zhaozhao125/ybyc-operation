<template>
  <v-order-list :overdue="overdue"></v-order-list>
</template>
<script>
import vOrderList from '../order-list/'

export default {
  name: 'overdueList',
  components: {
    vOrderList
  },
  data() {
    return {
      overdue: true
    }
  }
}
</script>
<style lang="scss">
</style>
