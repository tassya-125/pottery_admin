<template>
  <el-dialog
    :title="!dataForm.uid ? '新增' : '修改'"
    :close-on-click-modal="false"
    v-model:visible="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter="dataFormSubmit()" label-width="80px">
    <el-form-item label="" prop="creator">
      <el-input v-model="dataForm.creator" placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="" prop="origin">
      <el-input v-model="dataForm.origin" placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="" prop="productionTime">
      <el-input v-model="dataForm.productionTime" placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="" prop="craftsmanshipProcess">
      <el-input v-model="dataForm.craftsmanshipProcess" placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="" prop="imageUrl">
      <el-input v-model="dataForm.imageUrl" placeholder=""></el-input>
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
          uid: 0,
          creator: '',
          origin: '',
          productionTime: '',
          craftsmanshipProcess: '',
          imageUrl: ''
        },
        dataRule: {
          creator: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          origin: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          productionTime: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          craftsmanshipProcess: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          imageUrl: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.uid = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.uid) {
            this.$http({
              url: `/generator/pottery/info/${this.dataForm.uid}`,
              method: 'get',
              params:  {}
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.creator = data.pottery.creator
                this.dataForm.origin = data.pottery.origin
                this.dataForm.productionTime = data.pottery.productionTime
                this.dataForm.craftsmanshipProcess = data.pottery.craftsmanshipProcess
                this.dataForm.imageUrl = data.pottery.imageUrl
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
              url: "/generator/pottery/${!this.dataForm.uid ? 'save' : 'update'}",
              method: 'post',
              data: {
                'uid': this.dataForm.uid || undefined,
                'creator': this.dataForm.creator,
                'origin': this.dataForm.origin,
                'productionTime': this.dataForm.productionTime,
                'craftsmanshipProcess': this.dataForm.craftsmanshipProcess,
                'imageUrl': this.dataForm.imageUrl
              }
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
