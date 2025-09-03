<template>
  <a-flex vertical gap="10">
    <a-flex align="center" v-if="!hideAction">
      <slot name="operate"></slot>
      <slot name="setting">
        <a-flex flex="1" justify="end">
          <a-tooltip title="全屏" v-if="!fullScreenFlag">
            <a-button type="text" @click="onFullScreen" size="small">
              <template #icon><fullscreen-outlined /></template>
            </a-button>
          </a-tooltip>
          <a-tooltip title="取消全屏" v-if="fullScreenFlag">
            <a-button type="text" @click="onFullScreen" size="small">
              <template #icon><fullscreen-exit-outlined /></template>
            </a-button>
          </a-tooltip>
          <a-tooltip title="刷新">
            <a-button type="text" @click="onRefresh" size="small">
              <template #icon><redo-outlined /></template>
            </a-button>
          </a-tooltip>
        </a-flex>
      </slot>
    </a-flex>

    <a-table ref="tableRef" v-bind="getTableAttrs($attrs)" :pagination="paginationConfig">
      <template v-for="(_, name) in getTableSlots($slots)" #[name]="slotData">
        <slot :name="name" v-bind="slotData"></slot>
      </template>
    </a-table>
  </a-flex>
</template>

<script setup>
  import { computed, onMounted, ref } from 'vue';
  import { FullscreenOutlined, FullscreenExitOutlined, RedoOutlined } from '@ant-design/icons-vue';

  defineOptions({
    name: 'TtTable',
    inheritAttrs: false,
  });

  // 原生实现omit函数
  function omitKeys(obj, keys) {
    const result = {};
    for (const key in obj) {
      if (!keys.includes(key)) {
        result[key] = obj[key];
      }
    }
    return result;
  }

  const props = defineProps({
    pagination: {
      type: [Object, Boolean],
      default: () => ({}),
    },
    loadRequest: {
      type: Function,
      default: () => {},
    },
    hideAction: {
      type: Boolean,
      default: false,
    },
  });

  const paginationConfig = computed(() => {
    if (props.pagination === false) return false;
    return {
      current: 1,
      pageSize: 10,
      total: 0,
      showSizeChanger: true,
      showTotal: (total, range) => `共${total}条记录，第${range[0]}-${range[1]}条`,
      ...props.pagination,
    };
  });

  const emit = defineEmits(['refresh']);

  const getTableSlots = slots => {
    return omitKeys(slots, ['operate', 'setting']);
  };

  const getTableAttrs = attrs => {
    return omitKeys(attrs, ['loadRequest', 'pagination']);
  };

  const onRefresh = () => {
    emit('refresh');
  };

  defineExpose({
    reload: props?.loadRequest,
    load: props?.loadRequest,
  });

  // ----------------- 全屏 -------------------
  const fullScreenFlag = ref(false);

  function onFullScreen() {
    if (fullScreenFlag.value) {
      // 退出全屏
      handleExitFullScreen();
      exitElementFullscreen(document.body);
    } else {
      fullScreenFlag.value = true;
      launchElementFullScreen(document.body);
    }
  }

  // 处理退出全屏
  function handleExitFullScreen() {
    fullScreenFlag.value = false;
    document.removeEventListener('fullscreenchange', handleFullscreenChange);
    document.removeEventListener('mozfullscreenchange', handleFullscreenChange); // Firefox
    document.removeEventListener('webkitfullscreenchange', handleFullscreenChange); // Chrome, Safari and Opera
    document.removeEventListener('MSFullscreenChange', handleFullscreenChange); // Internet Explorer and Edge
  }

  //判断各种浏览器 -全屏
  function launchElementFullScreen(element) {
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullScreen) {
      element.webkitRequestFullScreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    } else {
      message.error('当前浏览器不支持部分全屏！');
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange); // Firefox
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange); // Chrome, Safari and Opera
    document.addEventListener('MSFullscreenChange', handleFullscreenChange); // Internet Explorer and Edge
  }

  function handleFullscreenChange() {
    if (
      document.fullscreenElement ||
      document.mozFullScreenElement ||
      document.webkitFullscreenElement ||
      document.msFullscreenElement
    ) {
      console.log('进入全屏模式');
    } else {
      console.log('退出全屏模式');
      handleExitFullScreen();
    }
  }

  //判断各种浏览器 -退出全屏
  function exitElementFullscreen(element) {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }
</script>
