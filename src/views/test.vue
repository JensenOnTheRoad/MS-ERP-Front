<template>
  <div style="text-align: center">
    <el-transfer
        v-model="rightValue"
        style="text-align: left; display: inline-block"
        filterable
        filter-placeholder="请输入物资名称"
        :left-default-checked="[2, 3]"
        :right-default-checked="[1]"
        :titles="['采购物品', '采购清单']"
        :button-texts="['删除', '添加']"
        :format="{
        noChecked: '${total}',
        hasChecked: '${checked}/${total}',
      }"
        :data="data.tableList"
        @change="handleChange"
    >
      <template #default="{ option }">
        <span>{{ option.key }} - {{ option.label }}</span>
      </template>
      <template #right-footer>
        <el-button class="transfer-footer" size="small">Operation</el-button>
        <el-button type="success" :icon="Check" circle/>
      </template>
    </el-transfer>
  </div>
</template>

<script setup>
import {reactive, ref} from 'vue';
// vuex
import store from '/src/store';

// axios
import axios from 'axios';

import {Check,} from '@element-plus/icons-vue';
// 获取全局变量
const global_url = ref(store.state.global_url_production).value;
const url = global_url + '/material/getAll';

// 定义数据
const data = reactive({
  tableList: [],
});
const rightValue = ref([1]);
const leftValue = ref([1]);

// 拉取后端数据
const getTableList = () => {
  axios
      .get(url)
      .then(function (response) {
        let array = response.data;
        data.tableList = processingData(array);
        console.log(data.tableList);
      })
      .catch(function (response) {
        console.log(response);
      });
};
// 处理数据
const processingData = (array) => {
  const array_list = new Array();
  for (let index = 0; index < array.length; index++) {
    const element = array[index];
    array_list[index] = {
      key: element.id,
      label: element.name,
      disabled: false,
    };
    // console.log(element);
  }
  return array_list;
};

getTableList();
</script>
<style></style>
