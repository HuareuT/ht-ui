<template>
  <a-card title="Descriptions 组件-Hooks的使用方式">
    <DescriptionsBuilder />
  </a-card>
</template>
<script setup>
  import { ref } from 'vue';
  import { useDescriptionsBuilder } from '../hooks/useDescriptionsBuilder';

  const columnList = [
    {
      key: 'orderNo',
      label: '订单编号',
    },
    {
      key: 'status',
      label: '状态',
      enumKey: 'RefundStatusEnum',
    },
  ];

  const info = ref({
    orderNo: '123',
    status: 'OPERATE_APPROVING',
  });
  const { DescriptionsBuilder } = useDescriptionsBuilder({
    columnList,
    modelValue: info,
    column: 4,
    enumObj: {
      RefundStatusEnum: {
        OPERATE_APPROVING: '审核中(运营)',
        OPERATE_APPROVE_REJECT: '审核不通过(运营)',
        OPERATE_APPROVE_PASS: '审核通过(运营)',
        FINANCIAL_APPROVING: '审核中(财务)',
        FINANCIAL_APPROVE_REJECT: '审核不通过(财务)',
        FINANCIAL_APPROVE_PASS: '审核通过(财务)',
        PASS: '已退款',
        REFUND_FAIL: '退款失败',
      },
      CostEnum: {
        MORTGAGE_BUY_FEE: '抵押买号费用',
        MORTGAGE_OWNER_ABSENT_FEE: '抵押车主不到场增费',
        POST_FEE: '警邮费',
        SERVICE_STATION_FEE: '服务站费用',
        UN_USE_ORIGIN_FILE_FEE: '不用原件或未备案抵押增费',
        SUBURBAN_FEE: '郊县补贴',
      },
      ReimbursementTypeEnum: {
        POLICE_MAIL: '警邮费',
        COURIER_FEE: '快递费',
        FILING_FEE: '备案费',
        DISPATCH_FEE: '调度费',
        NO_ORIGINAL_DOCUMENTS_OR_UN_MORTGAGE_FEE: '未备案抵押费',
        SERVICE_STATION_FEE: '服务站费',
        MORTGAGE_BUY_FEE: '抵押买号费',
        UNUSED_FRESH_SEAL_FEE: '未使用鲜章合同增费',
        OTHER_FEE: '其他',
      },
    },
  });
</script>
