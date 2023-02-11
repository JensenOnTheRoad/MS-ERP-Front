<template>
  <el-form
      ref="formRef"
      :model="dynamicValidateForm.domains"
      :rules="rules"
      label-width="100px"
      :inline="false"
  >
    <el-form-item label="选择客户" prop="customerId">
      <el-select
          v-model="seletedData.customerId"
          filterable
          placeholder="Select"
      >
        <el-option
            v-for="item_option in data.options_customer"
            :key="item_option.name"
            :value="item_option.id"
            :label="item_option.name + '/' + item_option.companyId"
        />
      </el-select>
    </el-form-item>

    <el-form-item label="支付方式" prop="deliveryType">
      <el-select
          v-model="seletedData.deliveryType"
          filterable
          placeholder="Select"
      >
        <el-option
            v-for="item in option_payment"
            :key="item.name"
            :value="item.id"
            :label="item.name"
        />
      </el-select>
    </el-form-item>

    <el-form-item label="备注说明" prop="remark">
      <el-input
          v-model="info.remark"
          autosize
          type="textarea"
          placeholder="备注说明"
      />
    </el-form-item>

    <template v-for="(item, index) in dynamicValidateForm.domains">
      <el-form-item label="选择商品" prop="commodityId">
        <el-select v-model="item.id" filterable placeholder="Select">
          <el-option
              v-for="item_option in data.options_commodity"
              :key="item_option.name"
              :value="item_option.id"
              :label="item_option.name"
          />
        </el-select>
        <el-input-number v-model="item.number" :min="1"/>
        <el-button type="danger" @click.prevent="removeRow(index)"
        >删除
        </el-button
        >
      </el-form-item>
    </template>

    <el-form-item>
      <el-button @click.prevent="addRow()">添加</el-button>
      <el-button @click="onSubmit()">提交</el-button>
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

// 获取全局变量
const global_url = ref(store.state.global_url).value;
const url_commodity_option = global_url + '/commodity/commodity/getAll';
const url_customer_option = global_url + '/order/customers/getAll';
const url_post = global_url + '/order/order-main/insert';
const currentUser = 1;

// 表单元素
const formRef = ref(null);
// 表单规则
const rules = reactive({
  id: [
    {
      // required: true,
      type: 'number',
      message: '不能为空',
      trigger: 'blur',
    },
  ],
  number: [
    {
      // required: true,
      type: 'number',
      message: '不能为空',
      trigger: 'blur',
    },
  ],
});

// select 数据
const data = reactive({
  options_commodity: [],
  options_customer: [],
});
const option_payment = reactive([
  {id: 0, name: '在线支付'},
  {id: 1, name: '货到付款'},
]);
const seletedData = reactive({
  commodityId: '',
  number: null,
  deliveryType: null,
  customerId: null,
});

const info = reactive({
  remark: '',
});
const dynamicValidateForm = reactive({
  domains: [
    {
      id: null,
      number: 1,
      customerId: null,
    },
  ],
});

// 拉取数据
const getCommodityOptionData = () => {
  axios
      .get(url_commodity_option)
      .then(function (response) {
        data.options_commodity = response.data;
      })
      .catch(function (response) {
        console.log(response);
      });
};

const getCustomerOptionData = () => {
  axios
      .get(url_customer_option)
      .then(function (response) {
        data.options_customer = response.data;
      })
      .catch(function (response) {
        console.log(response);
      });
};
getCommodityOptionData();
getCustomerOptionData();

// 添加一行
const addRow = () => {
  dynamicValidateForm.domains.push({
    id: null,
    number: 1,
  });
};
// 删除一行
const removeRow = (index) => {
  if (index >= 1) dynamicValidateForm.domains.splice(index, 1);
};

// 定义Emits,用于向父组件传递消息
const emit = defineEmits(['unVisEdit']);
// 向通过消息子组件向父组件传递方法
const onClose = () => {
  emit('unVisEdit');
};
// 提交数据
const onSubmit = () => {
  clearDirtyData();

  let post_data = [];
  dynamicValidateForm.domains.forEach((element) => {
    post_data.push({
      principalId: currentUser,
      customerId: seletedData.customerId,
      deliveryType: seletedData.deliveryType,
      commodityId: element.id,
      number: element.number,
      remark: info.remark,
    });
  });

  axios({
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'post',
    url: url_post,
    data: post_data,
  })
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
};

const clearDirtyData = () => {
  for (let index = 0; index < dynamicValidateForm.domains.length; index++) {
    const element = dynamicValidateForm.domains[index];
    if (element.id == 0 || element.id == null || element.id == undefined) {
      dynamicValidateForm.domains.splice(index, 1);
    }
  }
};
</script>
