<template>
  <el-container>
    <Header></Header>
  </el-container>
  <el-container style="height: 800px; border: 1px solid #eee">
    <!-- 侧边栏 -->
    <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
      <Guide></Guide>
    </el-aside>

    <el-container>
      <el-main>
        <!-- 搜索条件表单 -->
        <!-- @submit.native.prevent 阻止默认行为，使得回车可以搜索而不是刷新 -->
        <el-form :inline="true" @submit.native.prevent>
          <!-- 搜索 -->
          <el-form-item style="margin-right: 0px">
            <el-input
                v-model.trim="searchKey"
                @keyup.enter.native="toSearch"
                placeholder="Type something to search"
                clearable
            ></el-input>
          </el-form-item>
          <el-form-item style="margin-right: 12px">
            <el-button v-on:click="toSearch" :icon="Search" plain
            >搜索
            </el-button
            >
          </el-form-item>

          <!-- 添加dialog按钮 -->
          <el-form-item>
            <el-button type="primary" @click="handleEdit(0)" :icon="DocumentAdd"
            >添加
            </el-button
            >
          </el-form-item>
        </el-form>

        <!-- 物资编辑组件 -->
        <el-dialog
            v-model="dialogVisibleEdit"
            title="编辑用户"
            width="50%"
            destroy-on-close
            center
        >
          <!-- 通过子组件传递过来的事件执行父组件内的方法 -->
          <MaterialEdit
              @unVisEdit="changeDialogVisibleEdit"
              :editId="editId"
          ></MaterialEdit>
        </el-dialog>

        <!-- 表格数据  -->
        <el-table
            v-loading="table.loading"
            empty-text="暂无数据"
            :data="table.tableList"
            height="600px"
            style="width: 100%"
            border
        >
          <!-- fixed 表示固定栏 -->
          <el-table-column fixed prop="id" label="编号" width="120"/>
          <el-table-column prop="username" label="用户名"/>
          <el-table-column prop="departmentId" label="部门"/>
          <el-table-column prop="registerTime" label="注册时间"/>
          <!-- 操作 -->
          <el-table-column fixed="right" label="Operations" width="150">
            <template #default="scope">
              <!-- 编辑操作 -->
              <el-button
                  type="primary"
                  size="small"
                  @click="handleEdit(scope.row.id)"
              >Edit
              </el-button
              >
              <!-- 删除操作 -->
              <el-button
                  size="small"
                  type="danger"
                  @click="handleDelete(scope.row.id)"
              >Delete
              </el-button
              >
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页插件 -->
        <el-pagination
            v-model:currentPage="table.pageIndex"
            :page-size="table.pageSize"
            :background="true"
            layout="total, prev, pager, next"
            :total="table.dataCount"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            @prev-click="handlePrevClick"
            @next-click="handleNextClick"
        ></el-pagination>
      </el-main>
    </el-container>
  </el-container>
  <el-container>
    <Footer></Footer>
  </el-container>
</template>

<script setup>
import {reactive, ref, watch} from 'vue';

// element-plus/icons-vue
import {DocumentAdd, Search} from '@element-plus/icons-vue';
import {ElMessage, ElMessageBox} from 'element-plus';

// 导航组件
import Guide from '/src/components/guide.vue';
import Footer from '/src/components/footer.vue';
import Header from '/src/components/header.vue';

// 编辑物资界面
import MaterialEdit from './user_edit.vue';

// vuex
import store from '/src/store';

// axios
import axios from 'axios';

// 获取全局变量
const global_url = ref(store.state.global_url).value;
const url = global_url + '/hr/user/getAllPaging';
const url_search = global_url + '/hr/user/fuzzySearch';
const url_delete = global_url + '/hr/user/delete';

// dialogVisible
const dialogVisibleEdit = ref(false);

// 搜索关键词
const searchKey = ref('');

// 编辑页面id
const editId = ref(0);

// 定义表格数据
const table = reactive({
  pageIndex: 1,
  pageSize: 20,
  dataCount: 0,
  loading: true,
  tableList: [],
});

// 拉取后端数据
const getTableList = () => {
  axios
      .get(url, {
        params: {
          pageIndex: table.pageIndex,
          pageSize: table.pageSize,
        },
      })
      .then(function (response) {
        table.tableList = response.data.dataList;
        table.dataCount = response.data.countTotal;
        table.loading = false;
      })
      .catch(function (response) {
        table.loading = false;
        console.log(response);
      });
};

// 略微延迟，展现加载效果
const loadingEffect = () => {
  table.loading = true;
  setTimeout(function () {
    getTableList();
    table.loading = false;
  }, 500);
};
loadingEffect();

// 模糊搜索方法
const toSearch = () => {
  axios
      .get(url_search, {
        params: {
          searchKey: searchKey.value,
        },
      })
      .then(function (response) {
        table.tableList = response.data.dataList;
        table.dataCount = response.data.countTotal;
        table.loading = false;
      })
      .catch(function (response) {
        table.loading = false;
        console.log(response);
      });
};

// 监听数据，一旦搜索内容为空自动查询重置查询
watch(searchKey, function (newValue, oldValue) {
  if (typeof newValue === 'undefined' || newValue == null || newValue === '') {
    toSearch();
  }
});

// 监听数据，监听dialog关闭
watch(dialogVisibleEdit, function (newValue, oldValue) {
  if (newValue == false) {
    setTimeout(getTableList, '500');
  }
});
// 打开编辑页面
const handleEdit = (id) => {
  editId.value = id;
  dialogVisibleEdit.value = true;
};
// 关闭dialog编辑页面,子组件提交后关闭dialog显示
const changeDialogVisibleEdit = () => {
  dialogVisibleEdit.value = false;
};

// 删除
const handleDelete = (id) => {
  ElMessageBox.confirm('是否确定删除?', 'Warning', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
      .then(() => {
        axios
            .get(url_delete, {
              params: {
                id: id,
              },
            })
            .then(function (response) {
              let msg = response.data.returnMessage;
              ElMessage({
                showClose: true,
                message: msg,
                type: 'success',
                center: true,
              });
              loadingEffect();
            })
            .catch(function (response) {
              console.log(response);
            });
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '取消操作',
        });
      });
};

/* 表格操作及分页 */
// 初始化
const InitTableList = () => {
  loadingEffect();
};
// 页大小发生改变
const handleSizeChange = (val) => {
  table.pageSize = val;
  loadingEffect();
};
// 点击页数
const handleCurrentChange = (val) => {
  table.page = val;
  loadingEffect();
};
// 上一页
const handlePrevClick = (val) => {
  if (val > 0) {
    table.pageIndex = val - 1;
    loadingEffect();
  }
};
// 下一页
const handleNextClick = (val) => {
  table.pageIndex = val + 1;
  loadingEffect();
};
</script>
