<template>
  <div class="preview-image-container">
    <div class="image-drag-area" @mousedown="imgDragMouseDown" @wheel="handleWheel">
      <img :src="src" :style="imageStyle" class="preview-image" alt="预览图片" />
    </div>

    <!-- 操作工具栏 -->
    <div class="preview-toolbar">
      <a-button-group>
        <a-button @click="zoomOut" title="缩小">
          <template #icon><zoom-out-outlined /></template>
        </a-button>
        <a-button @click="resetImage" title="重置">
          <template #icon><redo-outlined /></template>
        </a-button>
        <a-button @click="zoomIn" title="放大">
          <template #icon><zoom-in-outlined /></template>
        </a-button>
      </a-button-group>

      <a-button-group style="margin-left: 16px">
        <a-button @click="rotateLeft" title="向左旋转">
          <template #icon><rotate-left-outlined /></template>
        </a-button>
        <a-button @click="rotateRight" title="向右旋转">
          <template #icon><rotate-right-outlined /></template>
        </a-button>
      </a-button-group>

      <a-button-group style="margin-left: 16px">
        <a-button @click="toggleFlipX" title="水平翻转">
          <template #icon><swap-outlined /></template>
        </a-button>
        <a-button @click="toggleFlipY" title="垂直翻转">
          <template #icon><swap-outlined style="transform: rotate(90deg)" /></template>
        </a-button>
      </a-button-group>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed, onUnmounted } from 'vue';
  import { ZoomInOutlined, ZoomOutOutlined, RedoOutlined, RotateLeftOutlined, RotateRightOutlined, SwapOutlined } from '@ant-design/icons-vue';

  const props = defineProps({
    src: {
      type: String,
      required: true,
    },
  });

  // 图片变换状态
  const scale = ref(1); // 缩放比例
  const rotate = ref(0); // 旋转角度
  const flipX = ref(false); // 水平翻转
  const flipY = ref(false); // 垂直翻转

  // 图片拖拽状态
  const imgOffsetX = ref(0); // 图片X轴偏移
  const imgOffsetY = ref(0); // 图片Y轴偏移
  const imgDragging = ref(false); // 图片是否正在拖拽
  const imgDragStartX = ref(0); // 图片拖拽开始X坐标
  const imgDragStartY = ref(0); // 图片拖拽开始Y坐标

  // 图片样式计算
  const imageStyle = computed(() => {
    let transform = `translate(${imgOffsetX.value}px, ${imgOffsetY.value}px) `;
    transform += `scale(${flipX.value ? -scale.value : scale.value}, ${flipY.value ? -scale.value : scale.value}) `;
    transform += `rotate(${rotate.value}deg)`;

    return {
      transform,
      cursor: imgDragging.value ? 'grabbing' : 'grab',
    };
  });

  // 图片拖拽相关函数
  const imgDragMouseDown = (e) => {
    // 阻止事件冒泡和默认行为
    e.stopPropagation();
    e.preventDefault();

    // 设置拖拽状态和开始位置
    imgDragging.value = true;
    imgDragStartX.value = e.clientX;
    imgDragStartY.value = e.clientY;

    // 添加临时事件监听器
    document.addEventListener('mousemove', imgDragMouseMove);
    document.addEventListener('mouseup', imgDragMouseUp);
  };

  const imgDragMouseMove = (e) => {
    if (!imgDragging.value) return;

    // 计算鼠标移动距离
    const deltaX = e.clientX - imgDragStartX.value;
    const deltaY = e.clientY - imgDragStartY.value;

    // 更新拖拽开始位置
    imgDragStartX.value = e.clientX;
    imgDragStartY.value = e.clientY;

    // 更新图片偏移
    imgOffsetX.value += deltaX;
    imgOffsetY.value += deltaY;

    e.preventDefault();
  };

  const imgDragMouseUp = (e) => {
    if (!imgDragging.value) return;

    imgDragging.value = false;

    // 移除临时事件监听器
    document.removeEventListener('mousemove', imgDragMouseMove);
    document.removeEventListener('mouseup', imgDragMouseUp);

    e.preventDefault();
  };

  // 缩放相关函数
  const zoomIn = () => {
    scale.value = Math.min(scale.value + 0.1, 3);
  };

  const zoomOut = () => {
    scale.value = Math.max(scale.value - 0.1, 0.1);

    if (scale.value <= 1) {
      imgOffsetX.value = 0;
      imgOffsetY.value = 0;
    }
  };

  // 旋转相关函数
  const rotateLeft = () => {
    rotate.value = (rotate.value - 90) % 360;
  };

  const rotateRight = () => {
    rotate.value = (rotate.value + 90) % 360;
  };

  // 翻转相关函数
  const toggleFlipX = () => {
    flipX.value = !flipX.value;
  };

  const toggleFlipY = () => {
    flipY.value = !flipY.value;
  };

  // 重置图片变换
  const resetImage = () => {
    scale.value = 1;
    rotate.value = 0;
    flipX.value = false;
    flipY.value = false;
    imgOffsetX.value = 0;
    imgOffsetY.value = 0;
  };

  // 鼠标滚轮缩放处理
  const handleWheel = (e) => {
    if (e.deltaY < 0) {
      // 向上滚动 - 放大
      scale.value = Math.min(scale.value + 0.1, 3);
    } else {
      // 向下滚动 - 缩小
      scale.value = Math.max(scale.value - 0.1, 0.1);

      // 如果缩小到原始大小，重置偏移
      if (scale.value <= 1) {
        imgOffsetX.value = 0;
        imgOffsetY.value = 0;
      }
    }

    e.preventDefault();
  };

  // 组件卸载时清理
  onUnmounted(() => {
    document.removeEventListener('mousemove', imgDragMouseMove);
    document.removeEventListener('mouseup', imgDragMouseUp);
  });
</script>

<style scoped>
  .preview-image-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100%;
  }

  .image-drag-area {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: calc(100% - 60px); /* 减去工具栏高度 */
    overflow: hidden;
    position: relative;
    z-index: 1;
  }

  .preview-image {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    transition: transform 0.1s;
    user-select: none;
  }

  .preview-toolbar {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px 0;
    width: 100%;
    position: relative;
    z-index: 2;
    background-color: #fff;
  }
</style>
