<template>
  <div class="login-container">
    <el-card class="login-card">
      <h2 class="login-title">用户登录</h2>

      <el-form ref="loginForm" :model="loginData" :rules="loginRules">
        <el-form-item prop="username">
          <el-input v-model="loginData.username" placeholder="请输入用户名" prefix-icon="el-icon-user" />
        </el-form-item>

        <el-form-item prop="password">
          <el-input v-model="loginData.password" type="password" show-password placeholder="请输入密码" prefix-icon="el-icon-lock" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleLogin" class="login-btn">登录</el-button>
        </el-form-item>
      </el-form>

    </el-card>
  </div>
</template>

<script>
export default {
  name:"loginPage",
  data() {
    return {
      loginData: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
    };
  },
  methods: {
    async handleLogin() {
      this.$refs.loginForm.validate(async (valid) => {
        if (valid) {
          try {
            const { data } = await this.$http.post('/auth/login', this.loginData);
            if (data.code === 0) {
              localStorage.setItem('token', data.token);
              this.$message.success('登录成功！');
              this.$router.push('/');
            } else {
              this.$message.error(data.msg || '登录失败');
            }
          } catch (error) {
            this.$message.error('登录请求失败');
          }
        }
      });
    }
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
}
.login-card {
  width: 350px;
  padding: 20px;
  text-align: center;
}
.login-title {
  font-size: 22px;
  margin-bottom: 20px;
}
.login-btn {
  width: 100%;
}
</style>
