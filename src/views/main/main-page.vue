<template>
<div class="main-page" :class="{'nav-closed': navClosed}">
  <div class="page-left">
    <v-left-nav></v-left-nav>
  </div>
  <div class="page-right">
    <div class="page-top">
      <v-top-nav></v-top-nav>
    </div>
    <!-- <div class="page-breadcrumb">
      <v-breadcrumb></v-breadcrumb>
    </div> -->
    <div class="page-content">
      <!-- <el-card> -->
        <!-- <pre>{{tabs}}</pre> -->
      <v-tabs></v-tabs>
      <!-- </el-card> -->
    </div>
  </div>
</div>

</template>

<script>
import vTopNav from '@/components/nav/top-nav'
import vLeftNav from '@/components/nav/left-nav'
import vTabs from '@/views/main/tabs/tabs'

export default {

  name: 'main-page',

  components: {
    vTopNav,
    vLeftNav,
    vTabs
  },

  data() {
    return {

    }
  },

  computed: {
    navClosed() {
      return this.$store.getters.navClosed
    }
  },

  watch: {
    '$route'() {
      console.log('========', this.$route)
    }
  }
}

</script>

<style lang="scss">
.main-page {
  width: 100%;
  height: 100%;
  .page-left {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 250px;
    transition: width .3s linear;
    z-index: 2;
    box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);
    z-index: 300;
  }
  .page-right {
    position: absolute;
    top: 0;
    left: 250px;
    right: 0;
    bottom: 0;
    overflow: hidden;
    transition: left .3s linear;
    .page-top{
      height: 61px;
      background-color: #fff;
      border-bottom: 1px solid $color-border;
    }
  }
  .page-breadcrumb {
    height: 39px;
    display: flex;
    align-items: center;
    padding-left: 2%;
  }
  .page-content {
    position: absolute;
    top: 61px;
    left: 0;
    right: 0;
    bottom: 0;
    // padding: $size-padding;
  }
  &.nav-closed{
    .page-left{
      width: 64px;
    }
    .page-right{
      left: $nav-width-closed;
    }
  }
}
</style>
