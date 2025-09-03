<template>
  <!-- <a-card title="Table 组件">
    <TtTable :columns="columns" :dataSource="dataList" bordered size="small">
      <template #operate>
        <a-button type="primary">新增</a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <a-button type="link" v-if="column.dataIndex === 'action'">编辑</a-button>
      </template>
    </TtTable>
  </a-card>
  <a-divider dashed>分割线</a-divider> -->
  <a-card title="Table 组件-Hooks的使用方式">
    <a-flex>
      <a-input-search
        v-model:value="tableSearch.name"
        placeholder="input search text"
        enter-button
        @search="tableReload"
      />
      <a-button
        type="primary"
        @click="
          () => {
            tableSearch.name = '';
            tableReload();
          }
        "
        >清空</a-button
      >
    </a-flex>
    <TableBuilder>
      <template #operate>
        <a-button type="primary">新增</a-button>
      </template>
    </TableBuilder>
  </a-card>
</template>
<script setup>
  import { onMounted, ref } from 'vue';
  // import { useTableBuilder } from '../hooks/useTableBuilder';
  import { useTableBuilder } from 'tt-components';

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

  const dataList = ref([]);

  /**
   *  模拟请求，返回10条数据
   */
  const mockList = params => {
    console.log('mockList params====>', params);

    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          code: 0,
          data: {
            records: Array.from({ length: 10 }, (_, index) => ({
              id: Math.random().toString(36).substring(2, 15),
              name: `John Brown ${index}`,
              age: 18,
            })),
            total: 18,
          },
        });
      }, 500);
    });
  };

  const tableSearch = ref({
    name: '',
  });
  const getDataList = async () => {
    tableLoading.value = true;
    const { data } = await mockList({
      name: tableSearch.value.name,
      pageIndex: tablePagination.value.current,
      pageSize: tablePagination.value.pageSize,
    });
    tableLoading.value = false;
    dataList.value = data.records;
    tablePagination.value.total = data.total;
  };

  const { TableBuilder, tablePagination, tableLoading, tableReload, tableLoad } = useTableBuilder({
    columns: columns.value,
    dataSource: dataList,
    hideAction: true,
    loadRequest: getDataList,
  });

  onMounted(tableLoad);
</script>
