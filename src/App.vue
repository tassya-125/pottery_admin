<template>
  <el-container style="height: 100vh;">
    <!-- 侧边栏 -->
    <el-aside width="200px" style="background-color: #304156;">
      <el-menu
          :default-active="activeMenu"
          router
          background-color="#304156"
          text-color="#fff"
          active-text-color="#ffd04b"
      >
        <el-menu-item index="/pottery">
          <el-icon><i class="el-icon-menu"></i></el-icon>
          <span>紫砂壶管理</span>
        </el-menu-item>
        <el-menu-item index="/user">
          <el-icon><i class="el-icon-user"></i></el-icon>
          <span>用户管理</span>
        </el-menu-item>
        <el-menu-item index="/salesrecord">
          <el-icon><i class="el-icon-document"></i></el-icon>
          <span>订单管理</span>
        </el-menu-item>
        <el-menu-item index="/verificationhistory">
          <el-icon><i class="el-icon-document"></i></el-icon>
          <span>验证历史管理</span>
        </el-menu-item>
        <el-menu-item index="/productionprocess">
          <el-icon><i class="el-icon-document"></i></el-icon>
          <span>生产流程管理</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <!-- 主体内容 -->
    <el-container>
      <el-header style="background-color: #f8f8f8; text-align: right; padding: 0 20px;">
        <el-button type="danger" @click="logout">退出登录</el-button>
      </el-header>

      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "App",
  computed: {
    activeMenu() {
      return this.$route.path
    }
  },
  methods: {
    logout() {
      this.$router.push("/login")
    }
  }
}
</script>

<style>
/* 侧边栏样式 */
.el-aside {
  min-height: 100vh;
  box-shadow: 2px 0 6px rgba(0, 0, 0, 0.1);
}
</style>
