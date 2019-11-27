<template>
  <div class="car-panel">
    <div class="panel-header">
      <h3>{{carPlate}}</h3>
    </div>
    <div class="panel-content">
      <ul>
        <li v-for="(item, index) in carData" :key="index">
          <span>{{item.key}}</span>
          {{item.value}}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {

  name: 'car-panel',

  props: {
    carPlate: {
      type: String,
      required: true
    },
    carData: {
      type: Array,
      required: true,
      default: []
    }
  },

  data () {
    return {

    }
  }
}
</script>

<style lang="scss" scoped>
.car-panel{
  .panel-header{
    border-bottom: 1px solid $color-border;
  }
}
</style>