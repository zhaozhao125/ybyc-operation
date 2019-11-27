<template>
  <div id="branches-map-index">
    <map-list></map-list>
  </div>
</template>
<script>
import mapList from './components/map-list';
export default {
  name: 'branches-map-index',
  components: {
    mapList
  }
}
</script>
<style lang="scss">
#branches-map-index {
  height: 100%;
  position: relative;
  padding: 0;
}
</style>
