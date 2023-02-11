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
            <el-input v-model.trim="searchKey" @keyup.enter.native="toSearch" placeholder="Type something to search"
                      clearable></el-input>
          </el-form-item>
          <el-form-item style="margin-right: 12px">
            <el-button v-on:click="toSearch" :icon="Search" plain>搜索</el-button>
          </el-form-item>
        </el-form>

        <!-- 表格数据  -->
        <el-table v-loading="table.loading" empty-text="暂无数据" :data="table.tableList" height="600px"
                  style="width: 100%"
                  border>
          <!-- fixed 表示固定栏 -->
          <el-table-column fixed prop="id" label="编号" width="120"/>
          <el-table-column prop="amount" label="金额"/>

          <el-table-column prop="typeId" label="流水类型">
            <template #default="scope">
              <div v-if="scope.row.typeId == 0">收入</div>
              <div v-else-if="scope.row.typeId == 1">支出</div>
            </template>
          </el-table-column>

          <el-table-column prop="auditStatus" label="审核状态">
            <template #default="scope">
              <div v-if="scope.row.auditStatus == 1">已审核</div>
              <div v-else-if="scope.row.auditStatus == 0">未审核</div>
            </template>
          </el-table-column>

          <el-table-column prop="auditorId" label="审核人"/>
          <el-table-column prop="auditTime" label="审核时间"/>
          <el-table-column prop="remark" label="备注"/>

          <!-- 操作 -->
          <el-table-column fixed="right" label="Operations" width="150">
            <template #default="scope">
              <!-- 审核操作 -->
              <el-button v-if="scope.row.auditStatus > 0" disabled type="primary" size="small"
                         @click="handleAudit(scope.row.id)">审核
              </el-button>
              <el-button v-else type="primary" size="small" @click="handleAudit(scope.row.id)">审核</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页插件 -->
        <el-pagination v-model:currentPage="table.pageIndex" :page-size="table.pageSize" :background="true"
                       layout="total, prev, pager, next" :total="table.dataCount" @size-change="handleSizeChange"
                       @current-change="handleCurrentChange" @prev-click="handlePrevClick"
                       @next-click="handleNextClick">
        </el-pagination>
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
import {Search} from '@element-plus/icons-vue';
import {ElMessage, ElMessageBox} from 'element-plus';

// 导航组件
// 导航组件
import Guide from '/src/components/guide.vue';
import Header from '/src/components/header.vue';
import Footer from '/src/components/footer.vue';

// vuex
import store from '/src/store';

// axios
import axios from 'axios';

// 获取全局变量
const global_url = ref(store.state.global_url).value;
const url = global_url + '/financial/financial/getAllPaging';
const url_search = global_url + '/financial/financial/fuzzySearch';
const url_audit = global_url + '/financial/financial/audit';

const currentUser = ref(1);

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

// 审核
const handleAudit = (id) => {
  ElMessageBox.confirm('是否确定审核?', 'Warning', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
      .then(() => {
        axios
            .get(url_audit, {
              params: {
                id: id,
                auditorId: currentUser.value,
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
