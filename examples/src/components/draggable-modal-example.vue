<template>
  <a-card title="DraggableModal 组件">
    <a-button type="primary" @click="openDraggableModal">打开可拖拽模态框</a-button>
    <tt-draggable-modal ref="draggableModalRef" title="可拖拽模态框" :width="700" storageKey="demo-draggable-modal">
      <div class="modal-content">
        <h3>这是一个可拖拽的模态框</h3>
        <p>你可以：</p>
        <ul>
          <li>拖拽标题栏移动模态框</li>
          <li>从右下角调整模态框大小</li>
          <li>关闭后再次打开，会记住上次的位置和大小</li>
        </ul>
      </div>
    </tt-draggable-modal>
  </a-card>
</template>

<script setup>
import { ref } from "vue";
import { TtDraggableModal } from "tt-components";

const draggableModalRef = ref(null);

const openDraggableModal = () => {
  draggableModalRef.value.open();
};
</script>
