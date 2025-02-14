import { createRouter, createWebHistory } from 'vue-router';
import Pottery from '@/generator/pottery.vue';
import SalesRecord from '@/generator/salesrecord.vue';
import ProductionProcess from '@/generator/productionprocess.vue';
import User from '@/generator/user.vue';
import VerificationHistory from '@/generator/verificationhistory.vue';
import Login from '@/components/login.vue';
import Main from "@/components/main.vue";

const routes = [
    {
        path: '/',
        component: Main,  // 这里是主页面
<<<<<<< HEAD
        meta: { requiresAuth: true },
=======
        // meta: { requiresAuth: true },
>>>>>>> d5b4c62af7982810c21313343978b2c45d299c0c
        children: [
            { path: '', redirect: '/pottery' }, // 默认跳转到 pottery
            { path: 'pottery', component: Pottery },
            { path: 'salesrecord', component: SalesRecord },
            { path: 'productionprocess', component: ProductionProcess },
            { path: 'user', component: User },
            { path: 'verificationhistory', component: VerificationHistory }
        ]
    },
    { path: '/login', component: Login }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
