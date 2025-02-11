import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // 引入 Vue Router
import axios from 'axios'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App)

axios.defaults.baseURL = 'http://localhost:9000'
app.config.globalProperties.$http = axios
app.use(ElementPlus)
app.use(router) // 挂载 Vue Router
app.mount('#app')
