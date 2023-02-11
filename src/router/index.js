import {createRouter, createWebHistory} from "vue-router";
import Home from '/src/views/Home.vue'

const routes = [
    {
        path: "/:pathMatch(.*)*",
        name: "404",
        component: () => import("/src/views/login/login.vue"),
    },
    {
        path: "",
        name: "login",
        component: () => import("/src/views/login/login.vue"),
        meta: {
            title: "登录",
        },
    },
    {
        path: "/",
        name: "login",
        component: () => import("/src/views/login/login.vue"),
    },
    {
        path: "/login",
        name: "login",
        component: () => import("/src/views/login/login.vue"),
    },
    {
        path: "/home",
        name: "home",
        component: () => Home,
    },

    // region material
    {
        path: "/material",
        name: "material",
        component: () => import("/src/views/production/material.vue"),
    },
    {
        path: "/material_edit",
        name: "material_edit",
        component: () => import("/src/views/production/material_edit.vue"),
    },

    {
        path: "/purchase",
        name: "purchase",
        component: () => import("/src/views/production/purchase.vue"),
    },
    {
        path: "/purchase_edit",
        name: "purchase_edit",
        component: () => import("/src/views/production/purchase_edit.vue"),
    },

    {
        path: "/production",
        name: "production",
        component: () => import("/src/views/production/production.vue"),
    },
    // endregion

    // region commodity
    {
        path: "/commodity",
        name: "commodity",
        component: () => import("/src/views/commodity/commodity.vue"),
    },
    // endregion

    // region order
    {
        path: "/order",
        name: "order",
        component: () => import("/src/views/order/order.vue"),
    },
    {
        path: "/order_edit",
        name: "order_edit",
        component: () => import("/src/views/order/order_edit.vue"),
    },
    {
        path: "/customer_edit",
        name: "customer_edit",
        component: () => import("/src/views/order/customer_edit.vue"),
    },
    {
        path: "/customer",
        name: "customer",
        component: () => import("/src/views/order/customer.vue"),
    },
    // endregion

    // region hr
    {
        path: "/user",
        name: "user",
        component: () => import("/src/views/hr/user.vue"),
    },
    {
        path: "/user_edit",
        name: "user_edit",
        component: () => import("/src/views/hr/user_edit.vue"),
    },
    {
        path: "/department",
        name: "department",
        component: () => import("/src/views/hr/department.vue"),
    },
    // endregion

    // region warehouse
    {
        path: "/warehouse",
        name: "warehouse",
        component: () => import("/src/views/warehouse/warehouse.vue"),
    }, {
        path: "/warehouse_edit",
        name: "warehouse_edit",
        component: () => import("/src/views/warehouse/warehouse_edit.vue"),
    },
    {
        path: "/storage_record",
        name: "storage_record",
        component: () => import("/src/views/warehouse/storage_record.vue"),
    },
    // endregion

    // region financial
    {
        path: "/financial",
        name: "financial",
        component: () => import("/src/views/financial/financial.vue"),
    },
    {
        path: "/type_io",
        name: "type_io",
        component: () => import("/src/views/financial/type_io.vue"),
    },
    {
        path: "/type_io_edit",
        name: "type_io_edit",
        component: () => import("/src/views/financial/type_io_edit.vue"),
    },
    // endregion
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

export default router;
