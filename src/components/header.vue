<template>
  <el-container class="container">
    <el-container class="left">
      <el-header>
        <div>
          <span>
            <img style="" src="../assets/logo.png" height="24" width="24"
            /></span>
          <span style="font-size: 24px"> ERP企业资源计划管理系统</span>
        </div>
      </el-header>
    </el-container>

    <el-container class="right">
      <span style="margin-top: 5px; margin-right: 5px">
        <el-tag class="ml-2" type="info">{{ username }}</el-tag>
      </span>

      <span>
        <el-button type="danger" round @click="logout">退出</el-button>
      </span>
    </el-container>
  </el-container>
</template>

<script setup>
import {ref} from 'vue';
// vuex
import store from '/src/store';

const username = ref(store.state.username);
const logout = () => {
  store.dispatch('setLoginStatus', '0'); // 修改
};
</script>
<style>
.container {
  position: relative;
  width: 100%;
  height: 50px;
}

.right {
  position: absolute;
  right: 0px;
  width: 200px;
  padding: 5px;
}

.left {
  position: absolute;
  display: inline;
  left: 0px;
  width: 400px;
  padding: 5px;
}
</style>