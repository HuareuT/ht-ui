<template>
  <div class="preview-video-container">
    <div class="video-wrapper">
      <video ref="videoRef" :src="src" class="preview-video" controls controlsList="nodownload" @click="togglePlay"></video>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted, onUnmounted } from 'vue';

  const props = defineProps({
    src: {
      type: String,
      required: true,
    },
  });

  const videoRef = ref(null);

  // 视频播放控制
  const togglePlay = () => {
    if (!videoRef.value) return;

    if (videoRef.value.paused || videoRef.value.ended) {
      videoRef.value.play();
    } else {
      videoRef.value.pause();
    }
  };

  // 当组件卸载时暂停视频
  onUnmounted(() => {
    if (videoRef.value && !videoRef.value.paused) {
      videoRef.value.pause();
    }
  });
</script>

<style scoped>
  .preview-video-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100%;
  }

  .video-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background-color: #000;
  }

  .preview-video {
    max-width: 100%;
    max-height: 100%;
    width: auto;
    height: auto;
  }
</style>
