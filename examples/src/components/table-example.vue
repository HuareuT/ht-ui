<template>
  <a-card title="Table 组件">
    <TtTable :columns="columns" :dataSource="data" bordered size="small">
      <template #operate>
        <a-button type="primary">新增</a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <a-button type="link" v-if="column.dataIndex === 'action'">编辑</a-button>
      </template>
    </TtTable>
  </a-card>
</template>
<script setup>
  import { ref } from 'vue';

  const columns = ref([
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '年龄',
      dataIndex: 'age',
    },
    {
      title: '操作',
      dataIndex: 'action',
    },
  ]);

  const data = ref([
    {
      name: 'John Brown',
      age: 18,
    },
  ]);
</script>
