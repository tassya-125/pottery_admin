import { createRouter, createWebHistory } from 'vue-router'
import Pottery from '../generator/pottery.vue'
import SalesRecord from '../generator/salesrecord.vue'
import productionprocess  from "@/generator/productionprocess.vue";
import user from "@/generator/user.vue";
import verificationhistory from "@/generator/verificationhistory.vue";

const routes = [
    { path: '/', redirect: '/pottery' },
    { path: '/pottery', component: Pottery },
    { path: '/salesrecord', component: SalesRecord },
    { path: "/productionprocess",component: productionprocess},
    { path: "/user",component: user},
    { path:"/verificationhistory",component: verificationhistory}
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
