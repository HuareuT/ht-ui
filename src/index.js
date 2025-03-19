import DraggableModal from "./components/draggable-modal/index.vue";
import PreviewFileModal from "./components/preview-file-modal/index.vue";

// 导出单个组件
export { DraggableModal, PreviewFileModal };

// 默认导出所有组件
export default {
  install(app) {
    app.component("DraggableModal", DraggableModal);
    app.component("PreviewFileModal", PreviewFileModal);
  },
};
