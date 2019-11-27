 <template>
    <div class="all_refund_money">应退<span class="money_account">1360.00</span>元，确定退款？</div>
  </template>
  <script>
  export default {
    data() {
      return {
        formInline: {
          user: '',
          region: ''
        }
      }
    },
    methods: {
      onSubmit() {
        console.log('submit!');
      }
    }
  }
</script>
<style lang="scss">
  .all_refund_money {
    .money_account {
      color: #F56C6C;
      font-weight: 700;
      font-size:15px;
    }
  }
</style>
