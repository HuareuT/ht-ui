<template>
  <a-config-provider :locale="zh_CN">
    <div class="container">
      <h1>TT-Components 示例</h1>
      <DraggableModalExample />
      <a-divider dashed>分割线</a-divider>
      <PreviewFileModelExample />
      <a-divider dashed>分割线</a-divider>
      <TableExample />
      <a-divider dashed>分割线</a-divider>
      <UploadExample />
    </div>
  </a-config-provider>
</template>

<script setup>
  import zh_CN from 'ant-design-vue/es/locale/zh_CN';
  import DraggableModalExample from './components/draggable-modal-example.vue';
  import PreviewFileModelExample from './components/preview-file-model-example.vue';
  import TableExample from './components/table-example.vue';
  import UploadExample from './components/upload-example.vue';
</script>

<style>
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    font-family: Arial, sans-serif;
  }

  h1 {
    text-align: center;
    margin-bottom: 40px;
  }
</style>
