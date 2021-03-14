import {
  defineComponent,
  nextTick,
  onMounted,
  PropType,
  reactive,
  watch,
} from 'vue';
import { Modal, Form, Input } from 'ant-design-vue';
import CodeMirror from '../CodeMirror';
import { jsonToTs } from '../../vscode/service';

export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    json: {
      type: String,
      required: true,
    },
    onCancel: {
      type: Function as PropType<() => void>,
      required: true,
    },
    onOk: {
      type: Function as PropType<(typeCode: string) => void>,
      required: true,
    },
  },
  emits: ['cancel', 'ok'],
  setup(props, context) {
    const formData = reactive<{ json: string; type: string; typeName: string }>(
      {
        json: '',
        type: '',
        typeName: '',
      },
    );
    watch(
      () => props.visible,
      () => {
        if (props.visible) {
          // CodeMirror 中真实dom可能还未创建，赋值推迟到下一个 DOM 更新周期之后
          nextTick(() => {
            formData.json = props.json;
          });
        }
      },
    );
    watch([() => formData.json, () => formData.typeName], () => {
      if (formData.json && props.visible) {
        jsonToTs({
          json: JSON.parse(formData.json),
          typeName: formData.typeName,
        }).then(res => {
          formData.type = res;
        });
      }
    });
    return () => (
      <Modal
        visible={props.visible}
        title="JSON TO TS"
        okText="确定"
        cancelText="取消"
        onOk={() => {
          context.emit('ok', formData.type);
        }}
        onCancel={() => {
          context.emit('cancel');
        }}
        maskClosable={false}
      >
        <Form layout="vertical">
          <Form.Item label="json" required>
            <CodeMirror
              domId="jsonCodeMirror"
              lint
              value={formData.json}
              onChange={value => {
                formData.json = value;
              }}
            />
          </Form.Item>
          <Form.Item label="类型名称">
            <Input
              value={formData.typeName}
              placeholder="输入类型名称"
              onChange={e => {
                const { value } = e.target;
                formData.typeName = value;
              }}
            />
          </Form.Item>
          <Form.Item label="TS 接口类型">
            <CodeMirror
              domId="typeCodeMirror"
              value={formData.type}
              onChange={value => {
                formData.type = value;
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
    );
  },
});
