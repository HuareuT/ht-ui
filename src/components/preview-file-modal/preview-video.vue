<template>
  <div class="preview-video-container">
    <div class="video-wrapper">
      <video
        ref="videoRef"
        class="preview-video"
        controls
        controlsList="nodownload"
        @click="togglePlay"
      >
        <source :src="src" type="video/mp4" />
        <source :src="src" type="video/ogg" />
        <source :src="src" type="video/webm" />
      </video>
      <!-- <div id="preview-video-player" class="preview-video"></div> -->
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted, onUnmounted } from 'vue';
  // import DPlayer from 'dplayer';

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

  const dpPlayer = ref(null);
  onMounted(() => {
    // dpPlayer.value = new DPlayer({
    //   container: document.getElementById('preview-video-player'),
    //   video: {
    //     url: props.src,
    //   },
    // });
  });
  // 当组件卸载时暂停视频
  onUnmounted(() => {
    if (videoRef.value && !videoRef.value.paused) {
      videoRef.value.pause();
    }

    if (dpPlayer.value) {
      dpPlayer.value?.destroy?.();
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
