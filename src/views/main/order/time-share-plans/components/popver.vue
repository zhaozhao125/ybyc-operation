 <template >
    <el-popover
      placement="bottom"
      ref="poper"
      width="160"
      v-model="defaultStatus">
      <p>这是一段内容这是一段内容确定删除吗？</p>
      <div style="text-align: right; margin: 0">
        <el-button size="mini" type="text" @click="defaultStatus = false">取消</el-button>
        <el-button type="primary" size="mini" @click="defaultStatus = false">确定</el-button>
      </div>
      <el-switch v-model="openStatus"  slot="reference" @change="statusChange"></el-switch>
    </el-popover>
</template>
<script>
export default {
  data () {
    return {
      defaultStatus: false,
      openStatus: true
    }
  },
  methods: {
    statusChange () {
      console.log(this.openStatus)
      console.log(this.$refs.poper.showPopper)
    }
  },
  props: {
    value: {
      default: false
    }
  },
  watch: {
  },
  mounted () {
    this.openStatus = this.value
  }
}
</script>
