import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import * as echarts from 'echarts'

import App from './App.vue'
import router from './router'

//Element-Plus UI
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 将 ECharts 添加到全局属性
app.config.globalProperties.$echarts = echarts

app.use(createPinia())
app.use(router)

app.use(ElementPlus).mount('#app')
