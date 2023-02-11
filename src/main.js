import {createApp, ref, watch} from "vue";
import App from "./App.vue";

import router from "./router";
import store from "./store";

// element-plus
import ElementPlus, {ElMessageBox} from "element-plus";

import "element-plus/dist/index.css";


const app = createApp(App);
// vuex
app.use(store);
// vue-router
app.use(router);
// element-plus
app.use(ElementPlus);
app.mount("#app");

// 获取全局token
const token = ref(store.state.token);
const loginStatus = ref(store.state.loginStatus);

function changeToken() {
    let new_token = "main js new";
    // 设置新的token
    store.commit("SET_token", new_token);
    token.value = store.state.token;
}


function changeLoginStatus() {
    store.commit("SET_loginStatus", 0);
    loginStatus.value = store.state.loginStatus;
    console.log("log out");
}

// setTimeout(changeLsoginStatus, 5000);

// 监听登录状态变化
watch(loginStatus, function (newValue, oldValue) {
    console.log(newValue);
    if (newValue == 0) {
        router.push({
            name: 'login'
        })
        ElMessageBox.alert('登录超时，请重新登录系统', 'Title', {
            confirmButtonText: '确认',
        })
    }
});