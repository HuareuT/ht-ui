<template>
  <a-card title="PreviewFileModal 组件">
    <a-button type="primary" @click="openPreviewModal">打开文件预览</a-button>
    <tt-preview-file-modal
      ref="previewModalRef"
      :fileList="fileList"
      title="文件预览"
      :width="800"
      storageKey="demo-preview-modal"
    />
  </a-card>
</template>
<script setup>
import { ref } from "vue";
import { TtPreviewFileModal } from "tt-components";

const fileList = ref([
  {
    name: "示例图片1",
    url: "https://kdiot-dev-1305504517.cos.ap-chengdu.myqcloud.com/public/202412/31/yVIf4C7zxrNxsRJBFdDx.png",
  },
  {
    name: "示例图片2",
    url: "https://kdiot-dev-1305504517.cos.ap-chengdu.myqcloud.com/customer/202503/24/zeaL0tT410UGX2AQ8XbW.JPG",
  },
  {
    name: "示例视频",
    url: "https://kdiot-dev-1305504517.cos.ap-chengdu.myqcloud.com/public/202412/31/CuEEy5spqrAYqTYNH2Xo.mp4",
  },
]);

const previewModalRef = ref(null);

const openPreviewModal = () => {
  previewModalRef.value.open();
};
</script>
