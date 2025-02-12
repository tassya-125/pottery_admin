<template>
  <div class="user-container">
    <!-- 标题 -->
    <h2 class="page-title">用户管理</h2>
    <p class="page-subtitle">管理用户的相关信息，包括新增、修改、删除等操作。</p>

    <!-- 查询表单 -->
    <el-card class="form-card">
      <el-form :inline="true" :model="dataForm" @keyup.enter="getDataList()" class="search-form">
        <el-form-item>
          <el-input v-model="dataForm.key" placeholder="请输入关键字搜索" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="getDataList()">查询</el-button>
          <el-button v-if="isAuth('generator:user:save')" type="success" icon="el-icon-plus" @click="addOrUpdateHandle()">新增</el-button>
          <el-button v-if="isAuth('generator:user:delete')" type="danger" icon="el-icon-delete" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
        </el-form-item>
      </el-form>

      <!-- 数据表格 -->
      <el-table
          :data="dataList"
          border
          v-loading="dataListLoading"
          @selection-change="selectionChangeHandle"
          style="width: 100%;"
          stripe
      >
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="id" label="ID" align="center"></el-table-column>
        <el-table-column prop="username" label="用户名" align="center"></el-table-column>
        <el-table-column prop="phoneNumber" label="电话号码" align="center"></el-table-column>
        <el-table-column prop="email" label="电子邮件" align="center"></el-table-column>
        <el-table-column prop="password" label="密码" align="center"></el-table-column>
        <el-table-column prop="type" label="用户类型" align="center"></el-table-column>

        <!-- 操作列 -->
        <el-table-column fixed="right" label="操作" align="center" width="150">
          <template v-slot="scope">
            <el-button type="text" size="small" icon="el-icon-edit" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
            <el-button type="text" size="small" icon="el-icon-delete" @click="deleteHandle(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :current-page="pageIndex"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          :total="totalPage"
          class="pagination"
          prev-text="上一页"
          next-text="下一页"
          layout="prev, pager, next"
      ></el-pagination>
    </el-card>

    <!-- 弹窗: 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from './user-add-or-update';

export default {
  name: "UserPage",
  data() {
    return {
      dataForm: {
        key: ''
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false
    };
  },
  components: {
    AddOrUpdate
  },
  activated() {
    this.getDataList();
  },
  methods: {
    isAuth() {
      return true;
    },
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true;
      this.$http({
        url: '/generator/user/list',
        method: 'get',
        params: {
          'page': this.pageIndex,
          'limit': this.pageSize,
          'key': this.dataForm.key
        }
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.dataList = data.page.list;
          this.totalPage = data.page.totalCount;
        } else {
          this.dataList = [];
          this.totalPage = 0;
        }
        this.dataListLoading = false;
      });
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.getDataList();
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val;
      this.getDataList();
    },
    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val;
    },
    // 新增 / 修改
    addOrUpdateHandle(id) {
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id);
      });
    },
    // 删除
    deleteHandle(id) {
      const ids = id ? [id] : this.dataListSelections.map(item => item.id);
      this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: '/generator/user/delete',
          method: 'post',
          data: {}
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.getDataList();
              }
            });
          } else {
            this.$message.error(data.msg);
          }
        });
      });
    }
  }
};
</script>

<style scoped>
.user-container {
  padding: 20px;
  background: #f5f5f5;
}

/* 标题样式 */
.page-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
  text-align: center;
}

.page-subtitle {
  font-size: 14px;
  color: #666;
  text-align: center;
  margin-bottom: 20px;
}

/* 表单和表格样式 */
.form-card, .table-card {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 15px;
  text-align: center;
}

.delete-btn {
  color: red;
}
</style>
