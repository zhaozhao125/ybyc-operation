<template>
  <div class="left-nav">
    <div class="logo">
      <img src="~@/assets/img/logo.svg" alt="">
      <!-- <span>一步用车</span> -->
      <!-- <span class="el-icon-d-arrow-left toggle-nav" @click="toggleNav($event)" :class="{active: navClosed}"></span> -->
    </div>
    <nav class="nav-container">
      <el-menu :router="false" default-active="2" class="main-menu" background-color="#25282E" text-color="#dedede" active-text-color="#ffd04b" @open="handleOpen" @close="handleClose" @select="handleSelectMenu" :collapse="navClosed">
        <template v-for="(level1, index1) in navs" :index="level1.name">
          <el-submenu v-if="level1.isFolder" :index="level1.name" :key="index1" class="menu-level2">
            <template slot="title">
              <!-- <i> -->
              <icon v-if="level1.icon" :name="level1.icon"></icon>
              <!-- </i> -->
              <span slot="title">{{level1.label}}</span>
            </template>
            <template v-for="(level2, index2) in level1.children">
              <el-submenu v-if="level2.isFolder" :key="index2" :index="level2.name" class="menu-level3">
                <template slot="title">
                  <span slot="title">{{level2.label}}</span>
                </template>
                <el-menu-item v-for="(level3, index3) in level2.children" :key="index3" :index="level3.name">{{level3.label}}</el-menu-item>
              </el-submenu>
              <el-menu-item v-else :key="index2" :index="level2.name">{{level2.label}}</el-menu-item>
            </template>
          </el-submenu>
          <el-menu-item v-else :key="index1" :index="level1.name">
            <icon v-if="level1.icon" :name="level1.icon"></icon>
            <span slot="title">{{level1.label}}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </nav>
  </div>
</template>
<script>
export default {

  name: 'left-nav',

  data() {
    return {}
  },

  computed: {
    navClosed() {
      return this.$store.getters.navClosed
    },
    navs() {
      return this.$store.getters.navs
    }
  },

  methods: {
    toggleNav(event) {
      this.$store.commit('toggleNav')
    },
    handleOpen(key, keyPath) {
      // console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      // console.log(key, keyPath);
    },
    handleSelectMenu(tabName) {
      this.$store.commit('addTab', tabName)
    }
  }
}

</script>
<style lang="scss">
.left-nav {
  width: 100%;
  height: 100%;
  .logo {
    height: 60px;
    background-color: $color-nav-dark;
    display: flex;
    align-items: center; // padding-left: 14px;
    padding-right: 10px;
    position: relative;
    overflow: hidden;
    text-align: center;
    img {
      width: 130px;
      height: auto;
      margin: auto;
      transition: all .6s ease-out;
    } // span {
    //   line-height: 60px;
    //   padding-left: 6px;
    //   color: $color-nav-white;
    //   font-size: 20px;
    // }
    .toggle-nav {
      position: absolute;
      right: 0;
      cursor: pointer;
      padding: 15px;
      color: #666;
      font-size: 18px;
      transition: all .2s ease-out;
      background: $color-nav-dark;
      right: 9px;
      &:hover {
        color: #aaa;
      }
      &.active {
        transform: rotate(180deg)
      }
    }
  }
  .nav-container {
    position: absolute;
    top: 60px;
    bottom: 0;
    width: 100%;
    background-color: $color-nav-dark; // overflow-y: auto;
    // overflow-x: hidden;
    &::-webkit-scrollbar-track {
      background-color: transparent;
      border-radius: 0;
    }
    svg {
      width: 24px;
    }
    >.el-menu:not(.el-menu--collapse) {
      width: 250px; // transition: all .3s ease-out;
    }
    >ul>li:first-child {
      color: $color-nav-white!important;
    }
    .el-menu {
      .el-menu-item {
        &.is-active {
          background-color: darken($color-nav-dark, 10%)!important;
          color: $color-yellow!important;
        }
      }
    }
    .el-submenu__icon-arrow {
      margin-top: -3px;
    }
    .main-menu:not(.el-menu--collapse) {
      .el-submenu {
        >.el-submenu__title {
          // font-weight: bold;
          font-size: 14px; // span{
          //   margin-left: 4px;
          // }
        } // >.el-menu {
        //   >.el-menu-item {
        //     padding-left: 62px!important;
        //   }
        //   >.el-submenu {
        //     >.el-submenu__title {
        //       padding-left: 62px!important;
        //     }
        //     >.el-menu {
        //       >.el-menu-item {
        //         padding-left: 90px!important;
        //       }
        //     }
        //   }
        // }
      }
      .menu-level2 {
        .el-menu-item {
          padding-left: 62px !important;
        }
      }
      .menu-level3 {
        .el-submenu__title {
          padding-left: 62px !important;
        }
        .el-menu-item {
          padding-left: 90px !important;
        }
      }
    }

    .el-menu-item, .el-submenu__title {
      &:hover {
        background-color: darken($color-nav-dark, 10%)!important;
        color: #fff!important;
      }
    }
    .el-submenu.is-opened {
      >.el-submenu__title {
        color: $color-nav-white!important;
        .el-submenu__icon-arrow {
          color: $color-nav-white;
        }
      }
      .el-menu {
        .el-menu-item {
          background-color: darken($color-nav-dark, 5%)!important;
          &.is-active {
            background-color: darken($color-nav-dark, 10%)!important;
            color: $color-yellow!important;
          }
        }
        >.el-submenu .el-submenu__title {
          background-color: darken($color-nav-dark, 5%)!important;
        }
      }
    }
    ul {
      height: 100%;
    }
  }
}

.main-page:not(.nav-closed) {
  .left-nav {
    .nav-container {
      overflow-x: hidden;
      overflow-y: auto;
    }
  }
}

.main-page.nav-closed {
  .left-nav .logo img {
    transform: translateX(18px);
  }
  .left-nav .logo .toggle-nav.active {
    opacity: 0;
    &:hover {
      opacity: 1;
    }
  }
}

</style>
