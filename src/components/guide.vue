<template>
  <el-menu default-active="1" menu-trigger="hover" router>
    <el-sub-menu
        v-for="(item, index) in menuList.data"
        :index="index.toString()"
        :key="index"
        active-text-color="#ffd04b"
        background-color="#545c64"
        class="el-menu-vertical-demo"
    >
      <template #title>
        <el-icon>
          <!-- <location /> -->
        </el-icon>
        <span style="font-weight: bolder"> {{ item.name }}</span>
      </template>

      <el-menu-item-group v-for="i in item.sub">
        <el-menu-item :index="i.index">{{ i.name }}</el-menu-item>
      </el-menu-item-group>
    </el-sub-menu>
  </el-menu>
</template>

<script setup>
import {reactive} from 'vue';
import axios from 'axios';

var menuList = reactive({
  data: [],
});
const getTableList = () => {
  axios.get('/menu.json').then((res) => {
    menuList.data = res.data;
  });
};
getTableList();
</script>
