<template>
  <div class="top-nav">
    <div class="nav-switch" @click="toggleNav">
      <img src="~@/assets/img/menu.svg" alt="">
    </div>
    <el-menu v-if="user" class="user-menu" mode="horizontal" @select="handleSelect" active-text-color="#ffd04b">
      <!-- <el-menu-item index="message">
        <el-popover v-model="showMessage" placement="bottom-end" title="标题" width="200" trigger="click" content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
          <template slot="reference">
            <el-badge :value="12" class="unread">
              <i class="el-icon-bell"></i>
            </el-badge>
          </template>
        </el-popover>
      </el-menu-item> -->
      <el-submenu index="2" class="user-dropdown">
        <template slot="title">
          <img class="headshot" :src="user.img" alt="">
          <span>{{user.cnName || user.username}}</span>
        </template>
        <el-menu-item index="2-1" @click="showUsercenter">
          <i class="el-icon-tickets"></i>
          <span>个人中心</span>
        </el-menu-item>
        <!-- <el-menu-item index="2-2">
          <i class="el-icon-setting"></i>
          <span>设置</span>
        </el-menu-item> -->
        <el-menu-item index="2-3" @click="logout">
          <span>
            <i class="el-icon-back"></i>
            <span>退出登录</span>
          </span>
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>
<script>
export default {

  name: 'top-nav',

  data() {
    return {
      showMessage: false
    }
  },

  computed: {
    user(){
      return this.$store.getters.user
    }
  },

  methods: {
    handleSelect(key, keyPath) {
      if (key == 'message') {
        this.showMessage = true
      }
    },
    toggleNav() {
      this.$store.commit('toggleNav')
    },
    showUsercenter(){
      this.$store.commit('addCustomTab', {
        label: '个人中心',
        name: 'usercenter',
        id: 'usercenter'
      })
    },
    logout(){
      this.$store.commit('logout')
    }
  }
}

</script>
<style lang="scss">
.top-nav {
  height: 60px;
  line-height: 60px;
  position: relative;
  .nav-switch {
    float: left;
    cursor: pointer;
    transition: background .2s;
    &:hover {
      background-color: lighten($color-nav-dark, 58%);
    }
    img {
      height: 24px;
      vertical-align: middle;
      padding: 0 $size-padding;
      opacity: 0.5;
    }
  }
  .el-menu-item {
    padding: 0 15px;
  }
  >.user-menu {
    float: right;
    .el-menu-item{
      border-bottom: none!important;
      color: $color-dark!important;
    }
    .el-submenu{
      >.el-submenu__title{
        border-bottom: none!important;
        color: $color-dark!important;
      }
      .el-menu-item{
        color: $color-dark!important;
        &:hover{
          background-color: $color-bg-light;
        }
      }
    }
  }
  .headshot {
    width: 40px;
    border-radius: 50%;
    margin-right: 10px;
  }
  .unread {
    display: inline;
    i {
      font-size: 20px;
    }
    .el-badge__content.is-fixed {
      right: 16px;
    }
  }
  .user-dropdown{
    margin-right: 30px;
    .el-menu{
      z-index: 300;
    }
  }
}

</style>
