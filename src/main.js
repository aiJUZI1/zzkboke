import { createApp } from 'vue'
import { createPinia } from 'pinia'  // 导入 createPinia
import App from './App.vue'
import router from './router' // 导入路由配置

// 创建Vue应用
const app = createApp(App)

// 创建 Pinia 实例
const pinia = createPinia()

// 使用路由
app.use(router)

// 使用 Pinia（必须在 router 之后）
app.use(pinia)

// 挂载应用
app.mount('#app')