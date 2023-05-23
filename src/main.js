import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import piniaPersist from 'pinia-plugin-persist'
import '@/style/index.scss'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'github-markdown-css'
import 'highlight.js/styles/github.css'

// 新建 Pinia Store
const pinia = createPinia()

// Pinia 中添加固化插件
pinia.use(piniaPersist)

// 添加 Vue-Router 插件 / Pinia 插件 / Element-Plus 插件
createApp(App).use(router).use(pinia).use(ElementPlus).mount('#app')
