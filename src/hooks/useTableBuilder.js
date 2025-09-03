import { h, ref, reactive } from 'vue';
import TtTable from '../components/table/index.vue';

export const useTableBuilder = props => {
  const tableLoading = ref(false);
  const tablePagination = ref({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    showTotal: (total, range) => `共${total}条记录，第${range[0]}-${range[1]}条`,
  });
  const tableRef = ref(null);
  const Component = (_, { slots }) => {
    return h(
      TtTable,
      {
        ref: tableRef,
        pagination: tablePagination.value,
        loading: tableLoading.value,
        scroll: {
          x: 'max-content',
        },
        bordered: true,
        size: 'small',
        onChange: paginationChange,
        onRefresh: tableLoad,
        ...reactive(props),
      },
      slots
    );
  };

  const tableReload = () => {
    tablePagination.value.current = 1;
    props?.loadRequest?.();
  };

  const tableLoad = () => {
    props?.loadRequest?.();
  };

  const paginationChange = page => {
    tablePagination.value = page;
    tableLoad();
  };

  return {
    TableBuilder: Component,
    tablePagination,
    tableLoading,
    tableReload,
    tableLoad,
    paginationChange,
  };
};
