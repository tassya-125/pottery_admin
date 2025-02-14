import { createRouter, createWebHistory } from 'vue-router';
import Pottery from '@/generator/pottery.vue';
import SalesRecord from '@/generator/salesrecord.vue';
import ProductionProcess from '@/generator/productionprocess.vue';
import User from '@/generator/user.vue';
import VerificationHistory from '@/generator/verificationhistory.vue';
import Login from '@/components/login.vue';
import Main from "@/components/main.vue";

// 检查是否已登录
const isLoggedIn = () => {
    return localStorage.getItem('token') !== null;
};

const routes = [
    // 登录页面
    { path: '/', redirect:"/login" },// 默认进入登录页面
    { path:"/login",component: Login},
    // 主页面，只有在登录后才能访问
    {
        path: '/main',
        component: Main,  // 主页面
        children: [
            { path: '', redirect: '/main/pottery' },  // 默认跳转到 pottery
            { path: 'pottery', component: Pottery },
            { path: 'salesrecord', component: SalesRecord },
            { path: 'productionprocess', component: ProductionProcess },
            { path: 'user', component: User },
            { path: 'verificationhistory', component: VerificationHistory }
        ]
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});


export default router;
