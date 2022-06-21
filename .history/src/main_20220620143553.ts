import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'cesium/widgets.css'

const app = createApp(App)
//app.use(router) 需放在app.mount('#app')前面  不然加载时router-view、router-link等未被渲染
app.use(router)
app.mount('#app')


