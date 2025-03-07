<template>
  <div class="sales-record-container">
    <!-- 标题 -->
    <h2 class="page-title">销售信息管理</h2>
    <p class="page-subtitle">管理销售信息的相关操作，包括新增、修改、删除等。</p>

    <!-- 查询表单 -->
    <el-card class="form-card">
      <el-form :inline="true" :model="dataForm" @keyup.enter="getDataList()" class="search-form">
        <el-form-item>
          <el-input v-model="dataForm.key" placeholder="🔍 请输入参数名" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="getDataList()">查询</el-button>
          <el-button v-if="isAuth('generator:salesrecord:save')" type="success" icon="el-icon-plus" @click="addOrUpdateHandle()">新增</el-button>
          <el-button v-if="isAuth('generator:salesrecord:delete')" type="danger" icon="el-icon-delete" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">
            批量删除
          </el-button>
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
        <el-table-column type="selection" align="center"></el-table-column>
        <el-table-column prop="id" label="ID" align="center"></el-table-column>
        <el-table-column prop="distributorInfo" label="分销商信息" align="center"></el-table-column>
        <el-table-column  label="销售时间" align="center">
          <template v-slot="scope">
            {{ formatDate(scope.row.saleTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="buyerId" label="买家ID" align="center"></el-table-column>
        <el-table-column prop="potteryUid" label="紫砂壶ID" align="center"></el-table-column>

        <!-- 操作 -->
        <el-table-column fixed="right" align="center" label="操作">
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
          layout="prev, pager, next"
          prev-text="上一页"
          next-text="下一页"
      >
      </el-pagination>
    </el-card>

    <!-- 弹窗: 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from './salesrecord-add-or-update';
import {formatDate} from "../utils/dateUtils";

export default {
  name: "SalesRecord",
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
    formatDate,
    isAuth(val) {
      console.log(val);
      return true;
    },
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true;
      this.$http({
        url: '/generator/salesrecord/list',
        method: 'get',
        params: {
          'page': this.pageIndex,
          'limit': this.pageSize,
          'key': this.dataForm.key
        }
      }).then(({ data }) => {
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
      var ids = id ? [id] : this.dataListSelections.map(item => item.id);
      this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: '/generator/salesrecord/delete',
          method: 'post',
          data: ids
        }).then(({ data }) => {
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
.sales-record-container {
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
.form-card {
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
