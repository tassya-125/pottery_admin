<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    v-model:visible="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="" prop="processName">
      <el-input v-model="dataForm.processName" placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="" prop="inspectionResult">
      <el-input v-model="dataForm.inspectionResult" placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="" prop="qualityCertification">
      <el-input v-model="dataForm.qualityCertification" placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="" prop="potteryUid">
      <el-input v-model="dataForm.potteryUid" placeholder=""></el-input>
    </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
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
          processName: '',
          inspectionResult: '',
          qualityCertification: '',
          potteryUid: ''
        },
        dataRule: {
          processName: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          inspectionResult: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          qualityCertification: [
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
              url: this.$http.adornUrl(`/generator/productionprocess/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.processName = data.productionProcess.processName
                this.dataForm.inspectionResult = data.productionProcess.inspectionResult
                this.dataForm.qualityCertification = data.productionProcess.qualityCertification
                this.dataForm.potteryUid = data.productionProcess.potteryUid
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
              url: this.$http.adornUrl(`/generator/productionprocess/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'processName': this.dataForm.processName,
                'inspectionResult': this.dataForm.inspectionResult,
                'qualityCertification': this.dataForm.qualityCertification,
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
