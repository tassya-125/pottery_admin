<template>
  <el-dialog
      :title="!dataForm.id ? '新增' : '修改'"
      :close-on-click-modal="false"
      v-model="visible">

    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter="dataFormSubmit()" label-width="100px">

      <el-form-item label="工艺名称" prop="processName">
        <el-input v-model="dataForm.processName" placeholder="请输入工艺名称"></el-input>
      </el-form-item>

      <el-form-item label="检测结果" prop="inspectionResult">
        <el-input v-model="dataForm.inspectionResult" placeholder="请输入检测结果"></el-input>
      </el-form-item>

      <el-form-item label="质量认证" prop="qualityCertification">
        <el-input v-model="dataForm.qualityCertification" placeholder="请输入质量认证信息"></el-input>
      </el-form-item>

      <el-form-item label="紫砂壶ID" prop="potteryUid">
        <el-input v-model="dataForm.potteryUid" placeholder="请输入关联的紫砂壶ID"></el-input>
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
        processName: '',
        inspectionResult: '',
        qualityCertification: '',
        potteryUid: ''
      },
      dataRule: {
        processName: [{ required: true, message: '工艺名称不能为空', trigger: 'blur' }],
        inspectionResult: [{ required: true, message: '检测结果不能为空', trigger: 'blur' }],
        qualityCertification: [{ required: true, message: '质量认证信息不能为空', trigger: 'blur' }],
        potteryUid: [{ required: true, message: '紫砂壶ID不能为空', trigger: 'blur' }]
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
            url: `/generator/productionprocess/info/${this.dataForm.id}`,
            method: 'get'
          }).then(({ data }) => {
            if (data && data.code === 0) {
              Object.assign(this.dataForm, data.productionProcess);
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
            url: `/generator/productionprocess/${this.dataForm.id ? 'update' : 'save'}`,
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
