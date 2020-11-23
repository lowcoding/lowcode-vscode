import { defineComponent, PropType } from 'vue';
import { Modal } from 'ant-design-vue';

export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    onOk: Function as PropType<(modelJson: string) => void>,
    onCancel: Function as PropType<() => void>,
  },
  emits: ['cancel', 'ok'],
  setup() {
    return () => <Modal>
		
	</Modal>;
  },
});
