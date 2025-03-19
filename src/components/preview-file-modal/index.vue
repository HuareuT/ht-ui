<template>
  <draggable-modal
    ref="modalRef"
    :title="title"
    :width="width"
    :fileList="fileList"
    :storageKey="storageKey"
    :persistPosition="persistPosition"
    @file-change="handleFileChange"
  >
    <template #top>
      <slot name="top"></slot>
    </template>
    <component :is="currentPreviewComponent" :src="currentFile?.url || ''" :fileName="currentFile?.name || ''" />
  </draggable-modal>
</template>

<script setup>
  import { ref, computed, watch } from 'vue';
  import DraggableModal from '../draggable-modal/index.vue';
  import PreviewImage from './preview-image.vue';
  import PreviewVideo from './preview-video.vue';
  import PreviewUnsupported from './preview-unsupported.vue';

  const props = defineProps({
    fileList: {
      type: Array,
      default: () => [],
    },
    title: {
      type: String,
      default: '',
    },
    width: {
      type: Number,
      default: 800,
    },
    storageKey: {
      type: String,
      default: 'preview-file-modal-settings',
    },
    // 是否持久化位置
    persistPosition: {
      type: Boolean,
      default: true,
    },
  });

  const modalRef = ref(null);
  const currentIndex = ref(0);
  const currentFile = ref(null);

  // 判断文件是否为视频
  const isVideoFile = (fileName) => {
    if (!fileName) return false;

    // 提取文件扩展名
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (!ext) return false;

    // 常见视频文件扩展名列表
    const videoExtensions = ['mp4', 'webm', 'ogg', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'mpg', 'mpeg', 'm4v', '3gp'];

    return videoExtensions.includes(ext);
  };

  // 判断文件是否为图片
  const isImageFile = (fileName) => {
    if (!fileName) return false;

    // 提取文件扩展名
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (!ext) return false;

    // 常见图片文件扩展名列表
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg', 'ico'];

    return imageExtensions.includes(ext);
  };

  // 根据文件类型决定使用哪个预览组件
  const currentPreviewComponent = computed(() => {
    if (!currentFile.value) return PreviewImage;

    const fileName = currentFile.value.name || '';
    const url = currentFile.value.url || '';
    const fileType = currentFile.value.type || '';

    // 1. 先根据文件扩展名判断
    if (isImageFile(fileName) || isImageFile(url)) {
      return PreviewImage;
    }

    if (isVideoFile(fileName) || isVideoFile(url)) {
      return PreviewVideo;
    }

    // 2. 再尝试根据MIME类型判断
    if (fileType.startsWith('image/') || fileType.includes('image')) {
      return PreviewImage;
    }

    if (fileType.startsWith('video/') || fileType.includes('video')) {
      return PreviewVideo;
    }

    // 不支持的文件类型
    return PreviewUnsupported;
  });

  // 文件变更处理
  const handleFileChange = (file, index) => {
    currentFile.value = file;
    currentIndex.value = index;
  };

  // 监听文件列表变化
  watch(
    () => props.fileList,
    (newList) => {
      if (newList && newList.length > 0) {
        // 初始化当前文件
        currentFile.value = newList[currentIndex.value] || newList[0];
      } else {
        currentFile.value = null;
      }
    },
    { immediate: true }
  );

  // 重置文件
  const resetFile = (index = 0) => {
    if (props.fileList && props.fileList.length > 0) {
      currentIndex.value = index >= 0 && index < props.fileList.length ? index : 0;
      currentFile.value = props.fileList[currentIndex.value];
      modalRef.value.resetFile(currentIndex.value);
    }
  };

  // 打开模态框
  const showModal = (index = 0) => {
    if (props.fileList && props.fileList.length > 0) {
      currentIndex.value = index >= 0 && index < props.fileList.length ? index : 0;
      currentFile.value = props.fileList[currentIndex.value];
      modalRef.value.open(currentIndex.value);
    }
  };

  defineExpose({
    open: showModal,
    resetFile, // 暴露重置文件方法
  });
</script>

<style scoped>
  .content-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    position: relative;
    overflow: auto;
  }

  .modal-container {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .resize-handle-wrapper {
    position: absolute;
    bottom: 0;
    right: 0;
    z-index: 10;
  }

  .resize-handle-corner {
    width: 20px;
    height: 20px;
    cursor: nwse-resize;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: transparent;
    position: absolute;
    bottom: 4px;
    right: 4px;
    opacity: 0.8;
    transition: opacity 0.2s;
    border: 1px dashed #d9d9d9;
    border-radius: 2px;
  }

  .resize-handle-corner:hover {
    opacity: 1;
    border-style: solid;
  }
</style>
