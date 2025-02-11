<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    v-model:visible="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter="dataFormSubmit()" label-width="80px">
    <el-form-item label="" prop="verifierId">
      <el-input v-model="dataForm.verifierId" placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="" prop="verificationResult">
      <el-input v-model="dataForm.verificationResult" placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="" prop="potteryUid">
      <el-input v-model="dataForm.potteryUid" placeholder=""></el-input>
    </el-form-item>
    </el-form>
    <span  class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          id: 0,
          verifierId: '',
          verificationResult: '',
          potteryUid: ''
        },
        dataRule: {
          verifierId: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          verificationResult: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          potteryUid: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/generator/verificationhistory/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.verifierId = data.verificationHistory.verifierId
                this.dataForm.verificationResult = data.verificationHistory.verificationResult
                this.dataForm.potteryUid = data.verificationHistory.potteryUid
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/generator/verificationhistory/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'verifierId': this.dataForm.verifierId,
                'verificationResult': this.dataForm.verificationResult,
                'potteryUid': this.dataForm.potteryUid
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                  }
                })
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        })
      }
    }
  }
</script>
