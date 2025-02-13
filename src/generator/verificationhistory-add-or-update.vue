<template>
  <el-dialog
      :title="!dataForm.id ? '新增鉴定记录' : '修改鉴定记录'"
      :close-on-click-modal="false"
      v-model="visible">

    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter="dataFormSubmit()" label-width="100px">

      <el-form-item label="鉴定员ID" prop="verifierId">
        <el-input v-model="dataForm.verifierId" placeholder="请输入鉴定员ID"></el-input>
      </el-form-item>

      <el-form-item label="鉴定结果" prop="verificationResult">
        <el-select v-model="dataForm.verificationResult" placeholder="请选择鉴定结果">
          <el-option label="真品" value="authentic"></el-option>
          <el-option label="赝品" value="fake"></el-option>
          <el-option label="存疑" value="uncertain"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="紫砂壶UID" prop="potteryUid">
        <el-input v-model="dataForm.potteryUid" placeholder="请输入紫砂壶UID"></el-input>
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
        verifierId: '',
        verificationResult: '',
        potteryUid: ''
      },
      dataRule: {
        verifierId: [{ required: true, message: '鉴定员ID不能为空', trigger: 'blur' }],
        verificationResult: [{ required: true, message: '请选择鉴定结果', trigger: 'change' }],
        potteryUid: [{ required: true, message: '紫砂壶UID不能为空', trigger: 'blur' }]
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
            url: `/generator/verificationhistory/info/${this.dataForm.id}`,
            method: 'get'
          }).then(({ data }) => {
            if (data && data.code === 0) {
              Object.assign(this.dataForm, data.verificationHistory);
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
            url: `/generator/verificationhistory/${this.dataForm.id ? 'update' : 'save'}`,
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
