<template>
  <div class="home">
    <!-- routers -->
    <ul>
      <li>
        <router-link to="/login">登录</router-link>
        <br/>
      </li>
      <li>
        <router-link to="/home">home</router-link>
      </li>
      <li>
        <router-link to="/material">物资管理</router-link>
      </li>
      <li>
        <router-link to="/material_detail">物资详细</router-link>
      </li>
    </ul>
    <!-- 路由匹配到的组件将显示在这里 -->
    <router-view></router-view>

  </div>
  <div class="weui-panel weui-panel_access">
    <div v-for="(n,index) in newComputed" :key="index" class="weui-panel__bd">
      <a href="javascript:void(0);" class="weui-media-box weui-media-box_appmsg">
        <div class="weui-media-box__hd">
          <img class="weui-media-box__thumb" :src="n.author.avatar_url" alt/>
        </div>
        <div class="weui-media-box__bd">
          <h4 class="weui-media-box__title" v-text="n.title"></h4>
          <p class="weui-media-box__desc" v-text="n.author.loginname"></p>
        </div>
      </a>
    </div>
    <div @click="loadMore" class="weui-panel__ft">
      <a href="javascript:void(0);" class="weui-cell weui-cell_access weui-cell_link">
        <div class="weui-cell__bd">查看更多</div>
        <span class="weui-cell__ft"></span>
      </a>
    </div>
  </div>
</template>
<script>
import {onMounted, reactive, toRefs} from "vue";
import axios from "axios";

export default {
  setup() {
    const state = reactive({
      // 页数
      page: 1,
      // 列表数据
      news: [],

    })
    // 发送 ajax 请求获取列表数据
    const loadMore = async () => {
      // 获取列表数据
      let data = await axios.get("https://cnodejs.org/api/v1/topics", {
        params: {
          // 每一页的主题数量
          limit: 10,
          // 页数
          page: state.page
        }
      });

      // 叠加页数
      state.page += 1;
      state.news = [...state.news, ...data.data.data];
    };
    onMounted(() => {
      // 首屏加载的时候触发请求
      loadMore();
    });
    return {
      // 让数据保持响应式
      ...toRefs(state),
      // 查看更多事件
      loadMore
    };
  }
};
</script>
