import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3000,
    open: true,
    proxy: {
      // 代理路径
      '/api': {
        target: 'http://192.168.100.159:18231', // 目标服务器地址
        // target: 'https://ydy-sit.dinshifu.com', // 目标服务器地址
        changeOrigin: true, // 是否修改请求头中的 Origin 字段
        rewrite: path => path.replace(/^\/api/, ''),
      },
    },
  },
});
