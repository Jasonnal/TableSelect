<template>
  <el-menu
      default-active="1-4-1"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      :collapse="isCollapse"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
  >
    <h3>{{ isCollapse ? " " : "教室管理系统" }}</h3>
    <el-menu-item
        @click="clickMenu(item)"
        v-for="item in noChildren"
        :key="item.label"
        :index="item.name"
    >
      <i :class="`el-icon-${item.icon}`"></i>
      <span slot="title">{{ item.label }}</span>
    </el-menu-item>
    <el-submenu
        v-for="item in hasChildren"
        :key="item.label"
        :index="item.label"
    >
      <template slot="title">
        <i :class="`el-icon-${item.icon}`"></i>
        <span slot="title">{{ item.label }}</span>
      </template>
      <el-menu-item-group
          v-for="subItem in item.children"
          :key="subItem.path"
          :index="subItem.path"
      >
        <el-menu-item @click="clickMenu(subItem)" :index="subItem.path">{{
            subItem.label
          }}
        </el-menu-item>
      </el-menu-item-group>
    </el-submenu>
  </el-menu>
</template>
<style lang="less" scope>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 100%;
}

.el-menu {
  border-right: none;
  height: 100vh;

  h3 {
    color: #fff;
    text-align: center;
    line-height: 48px;
    font-size: 16px;
    font-weight: 400;
  }
}
</style>
<script>
export default {
  data() {
    return {};
  },
  computed: {
    //对数据进行过滤，一种有子菜单，一种没有
    //1.没有子菜单
    noChildren() {
      return this.menuData.filter((item) => !item.children);
    },
    hasChildren() {
      return this.menuData.filter((item) => item.children);
    },
    isCollapse() {
      return this.$store.state.tab.isCollapse;
    },
    menuData() {
      return JSON.parse(localStorage.getItem('menu')) || this.$store.state.tab.menu;
    },
  },
  methods: {
    handleOpen(key, keyPath) {

    },
    handleClose(key, keyPath) {

    },
    //点击菜单
    clickMenu(item) {
      //当页面路由与当前路由不一致才跳转
      if (
          this.$route.path !== item.path &&
          !(this.$route.path === "/home" && item.path === "/")
      ) {
        this.$router.push(item.path);
      }
      this.$store.commit("selectMenu", item);
    },
  },
};
</script>

