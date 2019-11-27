<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  name: 'app',

  created() {
    let $loading = document.getElementById('loadpage-wrapper')
    if ($loading) {
      $loading.style.display = 'none'
      $loading.remove()
    }
  }
}

</script>
<style lang="scss">
@import "~@/assets/sass/base.scss";
@import "~@/assets/sass/cover.scss";
@import "~@/assets/sass/common.scss";
* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  text-size-adjust: none;
}

body {
  background: $color-bg;
}

#app {
  width: 100%;
  height: 100%;
}

</style>
