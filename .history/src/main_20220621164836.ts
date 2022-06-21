import { createApp } from "vue";
import App from "./App.vue";
import ViewUIPlus from "view-ui-plus";
import router from "./router";
import store from "./store/store";
import "cesium/widgets.css";
import "view-ui-plus/dist/styles/viewuiplus.css";

const app = createApp(App);
//app.use(router) 需放在app.mount('#app')前面  不然加载时router-view、router-link等未被渲染
app.use(router).use(store).use(ViewUIPlus).mount("#app");
