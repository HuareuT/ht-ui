<template>
  <a-descriptions v-bind="$attrs" :labelStyle="{ color: '#999999' }">
    <a-descriptions-item
      v-for="(item, index) in columnList"
      :key="index"
      :label="item.label"
      :span="item.span || 1"
    >
      <slot :name="item.key">
        <component :is="TypographyText" :content="getValue(item)" />
      </slot>
    </a-descriptions-item>
  </a-descriptions>
</template>

<script setup>
  import { TypographyText } from 'ant-design-vue';

  const props = defineProps({
    columnList: {
      type: Array,
      default: () => [],
    },
    enumObj: {
      type: Object,
      default: () => {},
    },
  });

  const modelValue = defineModel();
  const getValue = ({ key, enumKey }) => {
    if (enumKey) {
      return props.enumObj[enumKey]?.[modelValue.value?.[key]];
    }
    return modelValue.value[key];
  };
</script>
