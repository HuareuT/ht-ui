import TtDraggableModal from './components/draggable-modal/index.vue';
import TtPreviewFileModal from './components/preview-file-modal/index.vue';
import TtTable from './components/table/index.vue';
import TtUpload from './components/upload/index.vue';
import { useTableBuilder } from './hooks/useTableBuilder';
// import { useFormBuilder } from './hooks/useFormBuilder';

// 版本信息
const version = '0.1.6';

// 组件名映射
const componentMap = {
  TtDraggableModal,
  TtPreviewFileModal,
  TtTable,
  TtUpload,
};

// 单独导出所有组件与 hooks
export { TtDraggableModal, TtPreviewFileModal, TtTable, TtUpload, useTableBuilder, version };

// 定义安装函数
const install = function (app) {
  // 避免重复安装
  if (install.installed) return;
  install.installed = true;

  // 注册所有组件，使用预定义的组件名
  Object.entries(componentMap).forEach(([name, component]) => {
    app.component(name, component);
  });
};

// 默认导出，支持 use 方式注册
export default {
  version,
  install,
  // 同时导出所有组件与 hooks，支持按需引入
  TtDraggableModal,
  TtPreviewFileModal,
  TtTable,
  TtUpload,
  useTableBuilder,
};

// 支持通过 script 标签使用
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}
