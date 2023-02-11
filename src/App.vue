<template>
  <router-view/>
</template>


<script setup>
// vue-router
import router from '/src/router';

import {watch} from 'vue';
import {useStore} from 'vuex';

const $store = useStore();
const loginStatus = $store.state.loginStatus;
if (loginStatus == '0' || typeof loginStatus === 'undefined') {
  router.push({
    // 对应的是路由配置的名称
    name: 'login',
  });
}
watch(
    () => $store.state.loginStatus,
    (newValue, old) => {
      console.log(newValue, old);
      if (newValue == '0' || typeof newValue === 'undefined') {
        router.push({
          // 对应的是路由配置的名称
          name: 'login',
        });
      }
    }
);
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  // text-align: center;
  color: #2c3e50;
}

a {
  text-decoration: none;
}

.router-link-active {
  text-decoraction: none;
}
</style>
