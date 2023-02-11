<template>
  <el-form
      ref="formRef"
      :model="form.data"
      :rules="rules"
      label-width="100px"
      style="max-width: 460px"
  >
    <el-form-item label="客户名称" prop="name">
      <el-input
          v-model="form.data.name"
          style="max-width: 200px"
          placeholder="请输入客户名称"
      />
    </el-form-item>

    <el-form-item label="公司名称" prop="companyId">
      <el-input
          v-model="form.data.companyId"
          style="max-width: 200px"
          placeholder="请输入公司名称"
      />
    </el-form-item>

    <el-form-item label="电话号码" prop="tel">
      <el-input
          v-model="form.data.tel"
          style="max-width: 200px"
          placeholder="请输入电话号码"
      />
    </el-form-item>

    <el-form-item label="备注" prop="remark">
      <el-input
          v-model="form.data.remark"
          style="max-width: 200px"
          placeholder="请输入备注"
      />
    </el-form-item>

    <el-form-item>
      <el-button @click="onClose()">取消</el-button>
      <el-button type="primary" @click="onSubmit()">确定</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import {reactive, ref} from 'vue';

// vuex
import store from '/src/store';

// axios
import axios from 'axios';

import {ElMessage} from 'element-plus';

// 接收id:父组件传递子组件的数据
const props = defineProps(['editId']);
const id = ref(props.editId);

// 获取全局变量
const global_url = ref(store.state.global_url).value;
const url = global_url + '/order/customers/insertOrUpdate';
const url_getOne = global_url + '/order/customers/getOne';

// 定义表单数据
const form = reactive({
  data: {
    name: '',
    price: 0,
    specification: '',
  },
});

// 表单元素
const formRef = ref(null);
// 表单规则
const rules = reactive({
  name: [
    {
      required: true,
      message: '不能为空',
      trigger: 'blur',
    },
  ],
  price: [
    {
      type: 'number',
      required: true,
      message: '不能为空',
      trigger: 'blur',
    },
  ],
  specification: [
    {
      required: true,
      message: '不能为空',
      trigger: 'blur',
    },
  ],
});

// 拉取数据方法
const getData = () => {
  axios
      .get(url_getOne, {
        params: {
          id: id.value,
        },
      })
      .then(function (response) {
        form.data = response.data;
      })
      .catch(function (response) {
        console.log(response);
      });
};

// 0为添加操作,不拉取数据
if (Number(id.value) != 0) {
  getData();
}

// 定义Emits,用于向父组件传递消息
const emit = defineEmits(['unVisEdit']);
// 向通过消息子组件向父组件传递方法
const onClose = () => {
  emit('unVisEdit');
};

// 提交数据
const onSubmit = () => {
  // 校验表单
  formRef.value.validate((valid) => {
    //校验成功
    if (valid) {
      axios
          .post(url, form.data)
          .then(function (response) {
            // 消息提示
            ElMessage({
              showClose: true,
              message: '添加成功!',
              type: 'success',
              center: true,
            });
            // 向通过消息向父组件传递方法
            emit('unVisEdit');
          })
          .catch(function (response) {
            console.log(response);
          });
    } else {
      return false;
    }
  });
};
</script>
