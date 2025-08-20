<template>
  <a-form ref="formRef" :model="modelValue" :rules="rules" :layout="layout">
    <a-row :gutter="16">
      <a-col :span="item.span || 24" v-for="item in items" :key="item.key">
        <a-form-item
          :label="item.label"
          :name="item.key"
          :rules="item?.isText ? [] : item.rules"
          :help="item.help"
        >
          <slot :name="item.key">
            <component
              :is="getComponent(item)"
              v-model:value.trim="modelValue[item.key]"
              v-bind="getProps(item)"
            />
          </slot>
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>

<script setup>
  import {
    Input,
    InputNumber,
    Select,
    TypographyTitle,
    TypographyText,
    RadioGroup,
  } from 'ant-design-vue';
  import { useTemplateRef } from 'vue';
  import { computed } from 'vue';
  import { formatText } from '/@/utils/str-util';
  // import RmUpload from '/@/components/rm/rm-upload/index.vue';
  import { omitKeys } from '@/utils';
  const props = defineProps({
    formItems: {
      type: Array,
      default: () => [],
    },
    rules: {
      type: Object,
      default: () => {},
    },
    layout: {
      type: String,
      default: 'horizontal',
    },
    help: {
      type: String,
      default: '',
    },
  });
  const formInstance = useTemplateRef('formRef');
  const modelValue = defineModel();
  const componentMap = {
    input: Input,
    number: InputNumber,
    textarea: Input.TextArea,
    select: Select,
    title: TypographyTitle,
    text: TypographyText,
    // upload: RmUpload,
    radio: RadioGroup,
  };
  const getTextItem = item => {
    const { type, options, textFormat } = item;
    if (['select', 'radio'].includes(type)) {
      return {
        ...item,
        type: 'text',
        content: formatText(
          options.find(option => option.value === modelValue.value[item.key])?.label,
          item.textType
        ),
      };
    }
    if (type === 'upload') {
      if (!modelValue.value[item.key]?.length) {
        return {
          ...item,
          type: 'text',
          content: formatText(modelValue.value[item.key]),
        };
      }
      return {
        ...item,
        type: 'upload',
        handle: 'preview',
      };
    }

    return {
      ...item,
      type: 'text',
      content: textFormat
        ? textFormat(modelValue.value[item.key])
        : formatText(modelValue.value[item.key], item.textType),
    };
  };
  const items = computed(() => {
    return props.formItems
      .filter(item => !item.hidden)
      .map(item => {
        const { isText } = item;
        if (isText) {
          return getTextItem(item);
        }
        return item;
      });
  });
  const rootProps = ['label', 'key', 'type', 'rules'];
  const getProps = item => {
    if (item.props) return item.props;
    return omitKeys(item, rootProps);
  };

  const getComponent = item => {
    const { type } = item;
    if (type && typeof type !== 'string') return type;
    return componentMap[type || 'input'];
  };

  defineExpose({
    validate(...args) {
      return formInstance.value.validate(...args);
    },
    resetFields(...args) {
      return formInstance.value.resetFields(...args);
    },
    scrollToField(...args) {
      return formInstance.value.scrollToField(...args);
    },
  });
</script>
