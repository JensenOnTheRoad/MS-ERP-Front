<template>
  <el-container>
    <el-form
        ref="loginForm"
        :model="form"
        :rules="rules"
        label-width="80px"
        class="login-box"
    >
      <h3 class="login-title">欢迎登录</h3>

      <el-form-item label="账号" prop="username">
        <el-input
            type="text"
            placeholder="请输入账号"
            v-model="form.username"
        />
      </el-form-item>

      <el-form-item label="密码" prop="password">
        <el-input
            type="password"
            placeholder="请输入密码"
            v-model="form.password"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" v-on:click="onSubmit('loginForm')"
        >登录
        </el-button
        >
      </el-form-item>
    </el-form>
  </el-container>
</template>

<script setup>
import {reactive, readonly, ref} from 'vue';
import {ElMessage} from 'element-plus';
// vuex
import store from '/src/store';
// vue-router
import router from '/src/router';
// axios
import axios from 'axios';

// 全局变量
let global_url = ref(store.state.global_url).value;
const url = global_url + '/hr/admin/login';

// 表单数据
const form = reactive({
  username: 'admin',
  password: '123456',
});
// 规则
const rules = readonly({
  username: [
    {
      required: true,
      message: '账号不可为空',
      trigger: 'blur',
    },
  ],
  password: [
    {
      required: true,
      message: '密码不可为空',
      trigger: 'blur',
    },
  ],
});

// 提交表单
const onSubmit = () => {
  let data = {
    username: form.username,
    password: form.password,
  };
  axios({
    method: 'post',
    url: url,
    data: data,
  })
      .then(function (response) {
        const data = response.data;
        console.log(data);
        const username = data.data.username;
        const id = data.data.id;
        // 路由重定向
        if (data.returnCode === 1) {
          router.push({
            // 对应的是路由配置的名称
            name: 'material',
          });
          store.dispatch('setLoginStatus', '1'); // 修改
          store.dispatch('setUsername', username); // 修改
          store.dispatch('setCureentUser', id); // 修改
        } else {
          ElMessage.error('请输入正确的账号密码！');
        }
      })
      .catch(function (error) {
        // 请求失败处理
        console.log(error);
      });
};
</script>

<style lang="scss" scoped>
.login-box {
  border: 1px solid #dcdfe6;
  width: 350px;
  margin: 180px auto;
  padding: 35px 35px 15px 35px;
  border-radius: 5px;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  box-shadow: 0 0 25px #909399;
}

.login-title {
  text-align: center;
  margin: 0 auto 40px auto;
  color: #303133;
}
</style>
