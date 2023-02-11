import {createStore} from 'vuex'

const url = "http://47.122.41.214:8990";
export default createStore({
    // 注册全局变量
    state: {
        global_url: url + "/api",
        token: "1",
        loginStatus: '0',
        username: 'user',
        currentUser: 0,
    },

    // 修改store中的变量的方法，如果你要改变变量的值，就写这里
    mutations: {
        SET_global_url(state, value) {
            state.global_url = value;
        },
        SET_username(state, value) {
            state.username = value;
        },
        SET_cureentUser(state, value) {
            state.currentUser = value;
        },
        SET_loginStatus(state, value) {
            state.loginStatus = value;
        },
    },

    // actions提交的是mutations，
    // 相当于就是改变变量的方法的重写，
    // 但是，actions是可以进行异步操作的
    actions: {
        // 参数一：自带属性，参数二：新值

        setLoginStatus(context, value) {
            // 修改getname的值
            context.commit('SET_loginStatus', value)
        },
        setUsername(context, value) {
            // 修改getname的值
            context.commit('SET_username', value)
        },
        setCureentUser(context, value) {
            // 修改getname的值
            context.commit('SET_cureentUser', value)
        },
    },

    modules: {}
})
