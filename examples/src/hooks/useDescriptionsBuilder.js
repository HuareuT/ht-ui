import { h,reactive } from 'vue';
import DescriptionsBuilder from '../components/local/descriptions.vue';

export const useDescriptionsBuilder = (props) => {
  const Component = (_, { slots }) => {
    return h(
      DescriptionsBuilder,
      {
        ...reactive(props),
      },
      slots
    );
  };
  return {
    DescriptionsBuilder: Component,
  };
};
