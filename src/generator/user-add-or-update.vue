<template>
  <el-dialog
      :title="!dataForm.id ? '新增用户' : '修改用户信息'"
      :close-on-click-modal="false"
      v-model="visible">

    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter="dataFormSubmit()" label-width="100px">

      <el-form-item label="用户名" prop="username">
        <el-input v-model="dataForm.username" placeholder="请输入用户名"></el-input>
      </el-form-item>

      <el-form-item label="手机号" prop="phoneNumber">
        <el-input v-model="dataForm.phoneNumber" placeholder="请输入手机号"></el-input>
      </el-form-item>

      <el-form-item label="邮箱" prop="email">
        <el-input v-model="dataForm.email" placeholder="请输入邮箱"></el-input>
      </el-form-item>

      <el-form-item label="密码" prop="password">
        <el-input v-model="dataForm.password" type="password" show-password placeholder="请输入密码"></el-input>
      </el-form-item>

      <el-form-item label="用户类型" prop="type">
        <el-select v-model="dataForm.type" placeholder="请选择用户类型">
          <el-option label="管理员" value="admin"></el-option>
          <el-option label="普通用户" value="user"></el-option>
        </el-select>
      </el-form-item>

    </el-form>

    <span class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>

  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      dataForm: {
        id: null,
        username: '',
        phoneNumber: '',
        email: '',
        password: '',
        type: ''
      },
      dataRule: {
        username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
        phoneNumber: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱格式', trigger: ['blur', 'change'] }
        ],
        password: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
        type: [{ required: true, message: '请选择用户类型', trigger: 'change' }]
      }
    };
  },
  methods: {
    // 初始化表单
    init(id) {
      this.dataForm.id = id || null;
      this.visible = true;

      this.$nextTick(() => {
        if (this.$refs.dataForm) {
          this.$refs.dataForm.resetFields(); // 清空表单
        }
        // 如果是修改，则请求后端获取数据填充表单
        if (this.dataForm.id) {
          this.$http({
            url: `/generator/user/info/${this.dataForm.id}`,
            method: 'get'
          }).then(({ data }) => {
            if (data && data.code === 0) {
              Object.assign(this.dataForm, data.user);
            }
          });
        }
      });
    },

    // 提交表单
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$http({
            url: `/generator/user/${this.dataForm.id ? 'update' : 'save'}`,
            method: 'post',
            data: { ...this.dataForm }
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.visible = false;
                  this.$emit('refreshDataList'); // 触发父组件刷新列表
                }
              });
            } else {
              this.$message.error(data.msg);
            }
          });
        }
      });
    }
  }
};
</script>
