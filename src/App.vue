<template>
        <router-view></router-view>
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
