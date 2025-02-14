import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // 引入 Vue Router
import axios from 'axios'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App)

axios.defaults.baseURL = 'http://localhost:9000'
axios.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
app.config.globalProperties.$http = axios
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token');
    if (to.meta.requiresAuth && !token) {
        next('/login');
    } else {
        next();
    }
});
app.use(ElementPlus)
app.use(router) // 挂载 Vue Router
app.mount('#app')
