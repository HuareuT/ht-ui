<template>
  <div class="unsupported-container">
    <div class="unsupported-content">
      <file-exclamation-outlined class="icon" />
      <h3>暂不支持该文件的预览</h3>
      <p>文件: {{ fileName || "未知文件" }}</p>
      <a-button type="primary" v-if="src" @click="downloadFile">
        <template #icon><download-outlined /></template>
        下载文件
      </a-button>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
// 使用 ant-design-vue 中的图标组件
import { FileExclamationOutlined, DownloadOutlined } from "@ant-design/icons-vue";

const props = defineProps({
  src: {
    type: String,
    default: "",
  },
  fileName: {
    type: String,
    default: "",
  },
});

const fileName = computed(() => {
  return props.fileName || props.src.split("/").pop() || "未知文件";
});

const downloadFile = () => {
  if (!props.src) return;

  // 创建一个临时链接并点击它来下载文件
  const link = document.createElement("a");
  link.href = props.src;
  link.download = fileName.value;
  link.target = "_blank"; // 可能需要根据浏览器策略调整
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
</script>

<style scoped>
.unsupported-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
}

.unsupported-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-width: 80%;
  text-align: center;
}

.icon {
  font-size: 48px;
  color: #faad14;
  margin-bottom: 16px;
}

h3 {
  margin-bottom: 16px;
  color: #333;
}

p {
  margin-bottom: 24px;
  color: #666;
  word-break: break-all;
}
</style>
