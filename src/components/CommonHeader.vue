<template>
  <div class="header-container">
    <div class="l-content">
      <el-button
        style="margin-right: 20px"
        @click="handleMenu"
        icon="el-icon-menu"
        size="mini"
      ></el-button>
      <!-- 面包屑 -->
      <el-breadcrumb separator="/">
        <el-breadcrumb-item
          v-for="item in tags"
          :key="item.path"
          :to="{ path: item.path }"
          >{{ item.label }}</el-breadcrumb-item
        >
      </el-breadcrumb>
    </div>
    <div class="r-content">
      <el-dropdown>
        <span class="el-dropdown-link">
          <img class="user" :src="user.avatar || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'" alt="" />
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="jumPerson">个人中心</el-dropdown-item>
          <el-dropdown-item @click.native="jumPassword">修改密码</el-dropdown-item>
          <el-dropdown-item @click.native="logout">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
//获取mutation的方法
import { mapState } from "vuex";
import CryptoJS from 'crypto-js';
export default {
  data() {
    return {
      user: JSON.parse(localStorage.getItem('honey-user') || '{}'),
    };
  },
  methods: {
    encryptPassword(password) {
      return CryptoJS.MD5(password).toString();
    },

    change(){
      this.user=JSON.parse(localStorage.getItem('honey-user') || '{}')
    },
    handleMenu() {
      //调用方法 
      this.$store.commit("collapseMenu");
    },
    logout(){
      localStorage.removeItem('menu')
      localStorage.removeItem('honey-user')
      this.$router.push('/login')
    },
    jumPerson(){
      this.$router.push('/person')
    },
    jumPassword(){
      this.$router.push('/password')
    }
  },
  watch:{

  },
  //watch
  computed: {
    ...mapState({
      tags: (state) => state.tab.tabList,
    }),
  },
};
</script>

<style lang="less" scoped>
.header-container {
  padding: 0 20px;
  background-color: #333;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .text {
    color: #fff;
    font-size: 14px;
    margin-left: 10px;
  }
  .r-content {
    .user {
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }
  }
  .l-content{
    display: flex;
    align-items: center;
    /deep/.el-breadcrumb_item{
      .el-breadcrumb_inner{
        font-weight: normal;
        &.is-link{
          color: #666;
        }
      }
      &:last-child{
        .el-breadcrumb_inner{
          color: #fff;
        }
      }
    }
  }
}
</style>