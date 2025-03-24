<template>
  <a-modal
    ref="modalRef"
    v-model:open="open"
    :mask="false"
    :wrap-style="{ overflow: 'hidden', pointerEvents: 'none' }"
    :maskClosable="false"
    :width="modalWidth"
    :footer="null"
    destroyOnClose
  >
    <slot name="top"></slot>
    <div class="content-container" :style="{ height: modalHeight + 'px' }">
      <div class="content-wrapper">
        <slot></slot>
      </div>

      <!-- 文件切换导航 - 放置在底部 -->
      <div v-if="fileList && fileList.length > 1" class="file-navigation">
        <a-button type="primary" shape="circle" @click="prevFile" :disabled="currentIndex <= 0">
          <template #icon><left-outlined /></template>
        </a-button>
        <span class="file-indicator">{{ currentIndex + 1 }}/{{ fileList.length }}</span>
        <a-button type="primary" shape="circle" @click="nextFile" :disabled="currentIndex >= fileList.length - 1">
          <template #icon><right-outlined /></template>
        </a-button>
      </div>

      <!-- 调整大小拖拽图标 -->
      <div class="resize-handle-wrapper">
        <div class="resize-handle-corner" @mousedown="startResize" title="拖拽调整大小">
          <svg viewBox="0 0 24 24" width="16" height="16">
            <path
              fill="currentColor"
              d="M22,22H20V20H22V22M22,18H20V16H22V18M18,22H16V20H18V22M18,18H16V16H18V18M14,22H12V20H14V22M22,14H20V12H22V14Z"
            />
          </svg>
        </div>
      </div>
    </div>

    <template #title>
      <div ref="modalTitleRef" style="width: 100%; cursor: move" @mousedown="startDrag">
        {{ fileList && fileList.length > 0 && currentIndex >= 0 ? fileList[currentIndex]?.name || title : title }}
      </div>
    </template>

    <template #modalRender="{ originVNode }">
      <div ref="modalContainerRef" :style="transformStyle" class="modal-container">
        <component :is="originVNode" />
      </div>
    </template>
  </a-modal>
</template>

<script setup>
import { ref, computed, watch, onUnmounted, nextTick, onMounted } from "vue";
import { LeftOutlined, RightOutlined } from "@ant-design/icons-vue";

const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  width: {
    type: Number,
    default: 800,
  },
  fileList: {
    type: Array,
    default: () => [],
  },
  storageKey: {
    type: String,
    default: "draggable-modal-settings",
  },
  persistPosition: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["update:currentIndex", "fileChange"]);

const open = ref(false);
const modalTitleRef = ref(null);
const modalContainerRef = ref(null);

// 文件预览相关
const currentIndex = ref(0);

// 模态框尺寸相关
const modalWidth = ref(props.width);
const modalHeight = ref(500); // 初始高度

// 变换相关状态
const transformX = ref(0);
const transformY = ref(0);

// 拖拽相关状态
const isDragging = ref(false);
const dragStartX = ref(0);
const dragStartY = ref(0);
const dragStartTransformX = ref(0);
const dragStartTransformY = ref(0);

// 调整大小相关状态
const isResizing = ref(false);
const resizeStartX = ref(0);
const resizeStartY = ref(0);
const resizeStartWidth = ref(0);
const resizeStartHeight = ref(0);

// 计算样式
const transformStyle = computed(() => {
  return {
    transform: `translate(${transformX.value}px, ${transformY.value}px)`,
  };
});

// 文件导航函数
const nextFile = () => {
  if (currentIndex.value < props.fileList.length - 1) {
    currentIndex.value++;
    emit("update:currentIndex", currentIndex.value);
    emit("fileChange", props.fileList[currentIndex.value], currentIndex.value);
  }
};

const prevFile = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--;
    emit("update:currentIndex", currentIndex.value);
    emit("fileChange", props.fileList[currentIndex.value], currentIndex.value);
  }
};

// 开始拖拽
const startDrag = (e) => {
  e.preventDefault();

  isDragging.value = true;
  dragStartX.value = e.clientX;
  dragStartY.value = e.clientY;
  dragStartTransformX.value = transformX.value;
  dragStartTransformY.value = transformY.value;

  document.addEventListener("mousemove", handleDrag);
  document.addEventListener("mouseup", stopDrag);
};

// 处理拖拽
const handleDrag = (e) => {
  if (!isDragging.value) return;

  const dx = e.clientX - dragStartX.value;
  const dy = e.clientY - dragStartY.value;

  // 计算新位置 - 允许完全自由拖动
  transformX.value = dragStartTransformX.value + dx;
  transformY.value = dragStartTransformY.value + dy;
};

// 停止拖拽
const stopDrag = () => {
  if (isDragging.value) {
    isDragging.value = false;
    saveModalSettings(); // 保存设置
  }
  document.removeEventListener("mousemove", handleDrag);
  document.removeEventListener("mouseup", stopDrag);
};

// 开始调整大小
const startResize = (e) => {
  e.preventDefault();
  e.stopPropagation();

  isResizing.value = true;
  resizeStartX.value = e.clientX;
  resizeStartY.value = e.clientY;
  resizeStartWidth.value = modalWidth.value;
  resizeStartHeight.value = modalHeight.value;

  document.addEventListener("mousemove", handleResize);
  document.addEventListener("mouseup", stopResize);
};

// 处理调整大小
const handleResize = (e) => {
  if (!isResizing.value) return;

  const dx = e.clientX - resizeStartX.value;
  const dy = e.clientY - resizeStartY.value;

  // 计算新尺寸，设置最小值
  modalWidth.value = Math.max(300, resizeStartWidth.value + dx);
  modalHeight.value = Math.max(200, resizeStartHeight.value + dy);

  e.preventDefault();
};

// 停止调整大小
const stopResize = () => {
  if (isResizing.value) {
    isResizing.value = false;
    saveModalSettings(); // 保存设置
  }
  document.removeEventListener("mousemove", handleResize);
  document.removeEventListener("mouseup", stopResize);
};

// 处理键盘事件
const handleKeyDown = (e) => {
  // 确保模态框是打开的
  if (!open.value) return;

  if (e.key === "ArrowLeft") {
    prevFile();
  } else if (e.key === "ArrowRight") {
    nextFile();
  }
};

// 生命周期钩子
onMounted(() => {
  window.addEventListener("resize", handleWindowResize);
  loadModalSettings();
  window.addEventListener("keydown", handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleWindowResize);
  document.removeEventListener("mousemove", handleDrag);
  document.removeEventListener("mouseup", stopDrag);
  document.removeEventListener("mousemove", handleResize);
  document.removeEventListener("mouseup", stopResize);
  window.removeEventListener("keydown", handleKeyDown);
});

// 处理窗口大小变化
const handleWindowResize = () => {
  // 窗口大小变化时，确保弹窗标题至少部分可见
  const bodyRect = document.body.getBoundingClientRect();
  const titleBarHeight = 40; // 估计标题栏高度

  // 如果弹窗完全不可见，将其重置到可见区域
  if (
    transformX.value > bodyRect.width ||
    transformX.value + 100 < 0 ||
    transformY.value > bodyRect.height ||
    transformY.value + titleBarHeight < 0
  ) {
    transformX.value = 0;
    transformY.value = 0;
  }
};

// 监听模态框关闭事件
watch(open, (newVal) => {
  if (!newVal) {
    // 关闭时重置状态
    isResizing.value = false;
    isDragging.value = false;

    // 确保关闭所有事件监听器
    document.removeEventListener("mousemove", handleDrag);
    document.removeEventListener("mouseup", stopDrag);
    document.removeEventListener("mousemove", handleResize);
    document.removeEventListener("mouseup", stopResize);
  } else {
    // 打开时初始化
    if (!props.persistPosition) {
      // 仅当不使用持久化时才重置位置
      modalWidth.value = props.width;
      transformX.value = 0;
      transformY.value = 0;
    }
    emit("update:currentIndex", currentIndex.value);
    if (props.fileList && props.fileList.length > 0) {
      emit("fileChange", props.fileList[currentIndex.value], currentIndex.value);
    }
  }
});

// 文件重置函数
const resetFile = (index = 0) => {
  if (props.fileList && props.fileList.length > 0) {
    const targetIndex = index >= 0 && index < props.fileList.length ? index : 0;
    currentIndex.value = targetIndex;
    emit("update:currentIndex", targetIndex);
    emit("fileChange", props.fileList[targetIndex], targetIndex);
  }
};

// 打开模态框
const showModal = (index = 0) => {
  currentIndex.value = index >= 0 && index < props.fileList.length ? index : 0;

  // 打开前加载保存的设置
  loadModalSettings();

  open.value = true;
};

// 保存模态框设置到本地存储
const saveModalSettings = () => {
  if (!props.persistPosition) return;

  try {
    const settings = {
      width: modalWidth.value,
      height: modalHeight.value,
      positionX: transformX.value,
      positionY: transformY.value,
      lastUpdated: new Date().getTime(),
    };

    localStorage.setItem(props.storageKey, JSON.stringify(settings));
  } catch (error) {
    console.warn("保存模态框设置失败:", error);
  }
};

// 从本地存储加载模态框设置
const loadModalSettings = () => {
  if (!props.persistPosition) return;

  try {
    const settingsStr = localStorage.getItem(props.storageKey);
    if (!settingsStr) return;

    const settings = JSON.parse(settingsStr);

    // 应用保存的设置
    if (settings.width) modalWidth.value = settings.width;
    if (settings.height) modalHeight.value = settings.height;
    if (settings.positionX !== undefined) transformX.value = settings.positionX;
    if (settings.positionY !== undefined) transformY.value = settings.positionY;
  } catch (error) {
    console.warn("加载模态框设置失败:", error);
  }
};

defineExpose({
  open: showModal,
  nextFile,
  prevFile,
  currentIndex,
  resetFile,
  saveModalSettings, // 暴露保存设置方法
  loadModalSettings, // 暴露加载设置方法
});
</script>

<style scoped>
.content-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
  overflow: hidden;
}

.content-wrapper {
  flex: 1;
  width: 100%;
  height: calc(100% - 45px); /* 减去底部导航高度 */
  overflow: hidden;
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
  z-index: 20;
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

.file-navigation {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 10px 0;
  margin-top: auto;
  background-color: rgba(255, 255, 255, 0.95);
  border-top: 1px solid #f0f0f0;
  height: 45px;
  z-index: 10;
}

.file-indicator {
  font-size: 14px;
  min-width: 40px;
  text-align: center;
  user-select: none;
}
</style>
