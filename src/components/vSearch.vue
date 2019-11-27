<template>
  <div class="search-input">
    <h4 class="search-title">
      {{title}}
      <span class="title-append" v-if="$slots.append">
        <slot name="append"></slot>
      </span>
    </h4>
    <form action="" autocomplete="on">
      <input name="search" type="text" v-model="searchVal" placeholder="请输入内容，按回车搜索" autocomplete="off" @keydown.enter.prevent="submit($event)">
      <a href="javascript: void(0)" class="search-btn el-icon-search"></a>
    </form>
  </div>
</template>
<script>
export default {
  props: ['title', 'realTime'],
  data: function() {
    return {
      searchVal: ''
    }
  },
  methods: {
    submit(event) {
      this.$emit('message', this.searchVal)
    }
  },
  watch: {
    searchVal: function(newVal) {
      this.realTime && this.$emit('message', this.searchVal)
    }
  }
}

</script>
<style lang="scss">
.search-input {
  display: inline-block;
  position: relative;
  width: 100%;
  height: 40px;
  .search-title {
    font-weight: 400;
    line-height: 40px;
    margin: 0;
    font-size: 13px;
    .title-append {
      line-height: 40px;
      display: inline-block;
      vertical-align: baseline;
    }
  }
  form {
    position: absolute;
    top: 5px;
    width: 100%;
  }
  input[type="text"] {
    position: absolute;
    height: 30px;
    font-size: 13px;
    display: inline-block;
    width: 0;
    top: 0;
    right: 0;
    border: none;
    outline: none;
    background-clip: content-box;
    box-sizing: border-box;
    padding-right: 40px;
    transition: width .4s cubic-bezier(0.000, 0.795, 0.000, 1.000);
    cursor: pointer;
    border-bottom: 1px solid rgba(0, 0, 0, 0);
    z-index: 3;
    &:focus:hover {
      border-bottom: 1px solid #bbb;
    }
    &:focus {
      border-bottom: 1px solid #bbb;
      cursor: text;
      width: 100%;
      &+.search-btn {
        z-index: 4;
      }
    }
  }
  .search-btn {
    font-size: 22px;
    line-height: 30px;
    padding: 0 5px;
    text-align: center;
    color: #aaa;
    text-decoration: none;
    height: 30px;
    width: 30px;
    display: inline-block;
    z-index: 2;
    border: none;
    position: absolute;
    top: 0;
    right: 0;
    z-index: 2;
    cursor: pointer;
    opacity: 0.5;
    transition: opacity .4s ease;
    &:hover {
      opacity: 0.8;
    }
  }
}

</style>
