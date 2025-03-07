<template>
  <el-dialog
      :title="!dataForm.uid ? '新增' : '修改'"
      :close-on-click-modal="false"
      v-model="visible">

    <el-form :model="dataForm" :rules="dataRule" ref="dataForm"
             @keyup.enter="dataFormSubmit()" label-width="80px">

      <el-form-item label="作者" prop="creator">
        <el-input v-model="dataForm.creator" placeholder="请输入作者"></el-input>
      </el-form-item>

      <el-form-item label="产地" prop="origin">
        <el-cascader
            ref="cascader"
            v-model="index"
            :options="regionData"
            :props="{ checkStrictly: true }"
            placeholder="请选择省/市/区"
            clearable
        ></el-cascader>

      </el-form-item>

      <el-form-item label="生产时间" prop="productionTime">
        <!-- 将 el-input 替换为 el-date-picker -->
        <el-date-picker
            v-model="dataForm.productionTime"
            type="date"
            placeholder="请选择生产日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
        />
      </el-form-item>

      <el-form-item label="工艺" prop="craftsmanshipProcess">
        <el-input v-model="dataForm.craftsmanshipProcess" placeholder="请输入工艺"></el-input>
      </el-form-item>

      <!-- 图片上传 -->
      <el-form-item label="上传图片" prop="imageUrl">
        <el-upload
            class="upload-demo"
            action="https://pottery.oss-cn-hangzhou.aliyuncs.com"
            list-type="picture-card"
        :limit="1"
        :on-success="handleUploadSuccess"
        :before-upload="beforeUpload"
        :file-list="fileList"
        :data="uploadData">
        <i class="el-icon-plus"></i>
        </el-upload>


      </el-form-item>

    </el-form>

    <span class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>

  </el-dialog>
</template>

<script>
import { regionData } from 'element-china-area-data'
import { ref } from 'vue'
import {getOriginIndex, getOriginString} from "@/utils/StringUtils";
export default {
  data () {
    return {
      visible: false,
      fileList: [],// 上传文件列表
      regionData: regionData,
      dataForm: {
        uid: 0,
        creator: '',
        origin: ref([]),
        productionTime: '',
        craftsmanshipProcess: '',
        imageUrl: ''
      },
      index:[],
      dataRule: {
        creator: [{ required: true, message: '作者不能为空', trigger: 'blur' }],
        origin: [{ required: true, message: '产地不能为空', trigger: 'blur' }],
        productionTime: [{ required: true, message: '生产时间不能为空', trigger: 'blur' }],
        craftsmanshipProcess: [{ required: true, message: '工艺不能为空', trigger: 'blur' }],
        imageUrl: [{ required: true, message: '请上传图片', trigger: 'blur' }]
      },
      uploadData: {}  // 上传数据（OSS 签名）
    };
  },
  methods: {
    // 初始化表单
    init (id) {
      this.dataForm.uid = id || 0;
      this.visible = true;

      this.$nextTick(() => {
        if (this.$refs.dataForm) {
          this.$refs.dataForm.resetFields(); // 清空表单
        }

        if (this.dataForm.uid) {
          this.$http({
            url: `/generator/pottery/info/${this.dataForm.uid}`,
            method: 'get'
          }).then(({data}) => {
            if (data && data.code === 0) {
              Object.assign(this.dataForm, data.pottery);// 填充数据
              this.index=getOriginIndex(this.dataForm.origin)
              if (data.pottery.imageUrl) {
                this.fileList = [{ name: '图片', url: data.pottery.imageUrl }];
              }
            }
          });
        }
      });
    },

    // 图片上传前的验证
    beforeUpload (file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG/PNG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!');
      }
      if (isJPG && isLt2M) {
        this.uploadData.key = `uploads/${new Date().getTime()}-${file.name}`;  // 使用文件名和时间戳生成唯一路径
      }
      return isJPG && isLt2M;
    },

    // 上传成功的回调
    handleUploadSuccess (res, file) {
        console.log(res,file)
        this.dataForm.imageUrl =`https://pottery.oss-cn-hangzhou.aliyuncs.com/${this.uploadData.key}`;
        this.$message.success('图片上传成功！');
        console.log(this.uploadData)
    },

    // 提交表单
    dataFormSubmit () {
      this.$refs.dataForm.validate((valid) => {
        if (!valid) return;
        this.dataForm.origin =  getOriginString(this.index,regionData)
        this.$http({
          url: `/generator/pottery/${!this.dataForm.uid ? 'save' : 'update'}`,
          method: 'post',
          data: { ...this.dataForm }
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.visible = false;
                this.$emit('refreshDataList'); // 触发父组件刷新
              }
            });
          } else {
            this.$message.error(data.msg);
          }
        });
      });
    },

    // 获取OSS上传签名
    async getOssUploadData() {
        const response = await this.$http.get('/oss/generate-signature');
        if (response.data && response.data.policy) {
          this.uploadData = {
            OSSAccessKeyId: response.data.accessKeyId, // 🟢 必须包含这个字段
            policy: response.data.policy,
            signature: response.data.signature,
            key: `uploads/${new Date().getTime()}-${this.fileList[0]?.name || 'default.jpg'}`,
            success_action_status: '200' // 让 OSS 返回 HTTP 200，而不是 204
          };
          console.log('OSS 签名数据:', this.uploadData);
        } else {
          this.$message.error('获取 OSS 签名失败');
        }
    }
  },

  watch: {
    visible(val) {
      if (val) {
        this.getOssUploadData();  // 在弹框显示时获取 OSS 签名数据
      }
    },

  }
}
</script>
