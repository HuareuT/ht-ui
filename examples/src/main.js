import { createApp } from "vue";
import App from "./App.vue";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/reset.css";

// 导入组件库
import TTComponents from "tt-components";
// 显式导入组件库样式
import "tt-components/dist/style.css";

const app = createApp(App);
// 先注册 Ant Design Vue
app.use(Antd);
// 再注册我们的组件库
app.use(TTComponents);
app.mount("#app");
