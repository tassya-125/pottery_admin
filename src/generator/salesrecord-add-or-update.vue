<template>
  <el-dialog
      :title="!dataForm.id ? '新增销售记录' : '修改销售记录'"
      :close-on-click-modal="false"
      v-model="visible">

    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter="dataFormSubmit()" label-width="100px">

      <el-form-item label="经销商信息" prop="distributorInfo">
        <el-input v-model="dataForm.distributorInfo" placeholder="请输入经销商信息"></el-input>
      </el-form-item>

      <el-form-item label="销售时间" prop="saleTime">
        <el-date-picker
            v-model="dataForm.saleTime"
            type="datetime"
            placeholder="请选择销售时间"
            value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>
      </el-form-item>

      <el-form-item label="买家ID" prop="buyerId">
        <el-input v-model="dataForm.buyerId" placeholder="请输入买家ID"></el-input>
      </el-form-item>

      <el-form-item label="紫砂壶ID" prop="potteryUid">
        <el-input v-model="dataForm.potteryUid" placeholder="请输入紫砂壶ID"></el-input>
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
        distributorInfo: '',
        saleTime: '',
        buyerId: '',
        potteryUid: ''
      },
      dataRule: {
        distributorInfo: [{ required: true, message: '经销商信息不能为空', trigger: 'blur' }],
        saleTime: [{ required: true, message: '销售时间不能为空', trigger: 'change' }],
        buyerId: [{ required: true, message: '买家ID不能为空', trigger: 'blur' }],
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
            url: `/generator/salesrecord/info/${this.dataForm.id}`,
            method: 'get'
          }).then(({ data }) => {
            if (data && data.code === 0) {
              Object.assign(this.dataForm, data.salesRecord);
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
            url: `/generator/salesrecord/${this.dataForm.id ? 'update' : 'save'}`,
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
