import { h, ref, reactive } from 'vue';
import TtTable from '../components/table/index.vue';

export const useTableBuilder = props => {
  const tableLoading = ref(false);
  const { pagination = {}, ...rest } = props;
  const tablePagination = ref({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    showTotal: (total, range) => `共${total}条记录，第${range[0]}-${range[1]}条`,
  });
  if (pagination !== false) {
    tablePagination.value = {
      ...tablePagination.value,
      ...pagination,
    };
  }
  const tableRef = ref(null);
  const Component = (_, { slots }) => {
    return h(
      TtTable,
      {
        ref: tableRef,
        pagination: pagination !== false ? tablePagination.value : false,
        loading: tableLoading.value,
        scroll: {
          x: 'max-content',
        },
        bordered: true,
        size: 'small',
        onChange: paginationChange,
        onRefresh: tableLoad,
        ...reactive(rest),
      },
      slots
    );
  };

  const tableReload = () => {
    if (tablePagination.value !== false) {
      tablePagination.value.current = 1;
    }
    props?.loadRequest?.();
  };

  const tableLoad = () => {
    props?.loadRequest?.();
  };

  const filteredInfo = ref();
  const sortedInfo = ref();
  const paginationChange = (page, filters, sorter) => {
    tablePagination.value = page;
    filteredInfo.value = filters;
    sortedInfo.value = sorter;
    tableLoad();
  };

  return {
    TableBuilder: Component,
    tablePagination,
    tableLoading,
    filteredInfo,
    sortedInfo,
    tableReload,
    tableLoad,
    paginationChange,
  };
};
