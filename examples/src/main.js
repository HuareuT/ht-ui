import { createApp } from 'vue';
import App from './App.vue';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import Vue3VideoPlayer from '@cloudgeek/vue3-video-player';
import '@cloudgeek/vue3-video-player/dist/vue3-video-player.css';

// 导入组件库
import TTComponents from 'tt-components';
// 显式导入组件库样式
import 'tt-components/dist/style.css';

const app = createApp(App);
// 先注册 Ant Design Vue
app.use(Antd);
// 再注册我们的组件库
app.use(TTComponents);

app.use(Vue3VideoPlayer, {
  lang: 'zh-CN',
});
app.mount('#app');
