import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.js"),
      name: "TTComponents",
      fileName: (format) => `tt-components.${format}.js`,
    },
    cssCodeSplit: false,
    rollupOptions: {
      // 移除terser，只external真正的外部依赖
      external: ["vue", "ant-design-vue", "@ant-design/icons-vue"],
      output: {
        exports: "named", // 解决混合导出警告
        globals: {
          vue: "Vue",
          "ant-design-vue": "antd",
          "@ant-design/icons-vue": "AntDesignIcons",
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith(".css")) return "style.css";
          return assetInfo.name;
        },
      },
    },
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
});
