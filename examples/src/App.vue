<template>
  <div class="demo-container">
    <h1>TT-Components 示例</h1>

    <div class="demo-section">
      <h2>DraggableModal 组件</h2>
      <a-button type="primary" @click="openDraggableModal">打开可拖拽模态框</a-button>
      <draggable-modal ref="draggableModalRef" title="可拖拽模态框" :width="700" storageKey="demo-draggable-modal">
        <div class="modal-content">
          <h3>这是一个可拖拽的模态框</h3>
          <p>你可以：</p>
          <ul>
            <li>拖拽标题栏移动模态框</li>
            <li>从右下角调整模态框大小</li>
            <li>关闭后再次打开，会记住上次的位置和大小</li>
          </ul>
        </div>
      </draggable-modal>
    </div>

    <div class="demo-section">
      <h2>PreviewFileModal 组件</h2>
      <a-button type="primary" @click="openPreviewModal">打开文件预览</a-button>
      <preview-file-modal
        ref="previewModalRef"
        :fileList="fileList"
        title="文件预览"
        :width="800"
        storageKey="demo-preview-modal"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

// DraggableModal 引用
const draggableModalRef = ref(null);

// 打开 DraggableModal
const openDraggableModal = () => {
  console.log(draggableModalRef.value);

  draggableModalRef.value.open();
};

// PreviewFileModal 引用
const previewModalRef = ref(null);

// 示例文件列表
const fileList = ref([
  {
    name: "示例图片",
    url: "https://kdiot-dev-1305504517.cos.ap-chengdu.myqcloud.com/public/202412/31/yVIf4C7zxrNxsRJBFdDx.png",
  },
  {
    name: "示例视频",
    url: "https://kdiot-dev-1305504517.cos.ap-chengdu.myqcloud.com/public/202412/31/CuEEy5spqrAYqTYNH2Xo.mp4",
  },
]);

// 打开 PreviewFileModal
const openPreviewModal = () => {
  previewModalRef.value.open();
};
</script>

<style>
.demo-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

h1 {
  text-align: center;
  margin-bottom: 40px;
}

.demo-section {
  margin-bottom: 40px;
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 8px;
}

.modal-content {
  padding: 20px;
}
</style>
