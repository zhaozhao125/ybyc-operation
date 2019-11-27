<template>
<div class="breadcrumb">
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item v-for="(item, index) in routes"
                        :key="index"
                        :to="{ path: item.path }">{{item.meta.title}}</el-breadcrumb-item>
  </el-breadcrumb>
</div>

</template>

<script>
export default {

  name: 'breadcrumb',

  data() {
    return {
    }
  },

  computed: {
    routes() {
      return this.$route.matched || []
    }
  }
};

</script>

<style lang="scss">
</style>
