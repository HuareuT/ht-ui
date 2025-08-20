import { h, ref, reactive } from 'vue';
import TtForm from '../components/form/index.vue';

export const useFormBuilder = props => {
  const formRef = ref();
  const Component = (_, { slots }) => {
    return h(
      TtForm,
      {
        ...reactive(props),
        ref: formRef,
      },
      slots
    );
  };
  return {
    FormBuilder: Component,
    validate(...args) {
      return formRef.value?.validate(...args).catch(res => {
        const errorField = res.errorFields[0];
        if (errorField) {
          formRef.value?.scrollToField(errorField.name, {
            behavior: 'smooth',
          });
        }
        throw res;
      });
    },
    resetFields(...args) {
      return formRef.value?.resetFields(...args);
    },
    scrollToField(...args) {
      return formRef.value?.scrollToField(...args);
    },
  };
};
