import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

export default defineConfig({
  plugins: [vue()],
  css: {
    postcss: {}, // 可以添加 postcss 配置
    preprocessorOptions: {
      // 如果使用预处理器如 SCSS
      scss: {
        additionalData: `@import "./src/styles/variables.scss";`,
      },
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.js"),
      name: "TTComponents",
      fileName: (format) => `tt-components.${format}.js`,
    },
    cssCodeSplit: false,
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ["vue", "ant-design-vue", "@ant-design/icons-vue"],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          vue: "Vue",
          "ant-design-vue": "antd",
          "@ant-design/icons-vue": "AntDesignIcons",
        },
        // 确保生成的样式文件被正确引用
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith(".css")) return "style.css";
          return assetInfo.name;
        },
      },
    },
  },
});
