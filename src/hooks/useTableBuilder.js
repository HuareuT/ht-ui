import { h, ref, reactive } from 'vue';
import TableBuilder from '../components/table/index.vue';

export const useTableBuilder = props => {
  const tableLoading = ref(false);
  const tablePagination = ref({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
  });
  const Component = (_, { slots }) => {
    return h(
      TableBuilder,
      {
        pagination: tablePagination.value,
        loading: tableLoading.value,
        onChange: page => {
          tablePagination.value = page;
        },
        ...reactive(props),
      },
      slots
    );
  };
  return {
    TableBuilder: Component,
    tablePagination,
    tableLoading,
  };
};
