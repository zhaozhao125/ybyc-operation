<template>
  <v-page :visible.sync="visible" :before-close="handleBeforeClose">
    <h3 slot="title">用户详情</h3>
    <v-detail slot="content" :detailSettings="detailSettings" :data="data"></v-detail>
  </v-page>
</template>

<script>
import vDetail from '@/components/detail/v-detail'
import detailSettings from './detailSettings.js'
export default {

  name: 'opuser-detail',

  props: {
    visible: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object
    }
  },

  components: {
    vDetail
  },

  data () {
    return {
      detailSettings
    }
  },

  methods: {
    handleBeforeClose(){
      this.$emit('update:visible', false)
      return false
    }
  }
}
</script>

<style lang="scss">
</style>