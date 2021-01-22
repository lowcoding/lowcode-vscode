import { defineComponent, PropType, reactive, ref, watch } from 'vue';
import { Modal, Form, Select, Input, message } from 'ant-design-vue';
import {
  genTemplateModelByYapi,
  getYapiDomain,
  getYapiProjects,
} from '../../vscode/service';

export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    onOk: Function as PropType<(model: unknown) => void>,
    onCancel: Function as PropType<() => void>,
  },
  emits: ['cancel', 'ok'],
  setup(props, context) {
    const projects = reactive<{
      data: { name: string; token: string; domain: string }[];
    }>({
      data: [],
    });
    const domainRef = ref('');
    const formData = reactive<{
      data: {
        token: string;
        id: string;
        typeName: string;
        funcName: string;
      };
    }>({ data: { typeName: 'IFetchResult', funcName: 'fetch' } as any });

    watch(
      () => props.visible,
      () => {
        if (props.visible) {
          getYapiDomain().then(res => {
            domainRef.value = res;
          });
          getYapiProjects().then(res => {
            projects.data = res;
          });
        }
      },
    );
    const genModel = () => {
      if (!formData.data.token) {
        message.error('请选择项目');
        return;
      }
      if (!formData.data.id) {
        message.error('请输入yapi接口id');
        return;
      }
      genTemplateModelByYapi({
        domain: domainRef.value,
        id: formData.data.id,
        token: formData.data.token,
        typeName: formData.data.typeName ? formData.data.typeName : undefined,
        funName: formData.data.funcName ? formData.data.funcName : undefined,
      }).then(model => {
        formData.data = {} as any;
        context.emit('ok', model);
      });
    };
    return () => (
      <Modal
        title="根据 YAPI 接口追加模板数据"
        visible={props.visible}
        closable={false}
        okText="确定"
        cancelText="关闭"
        onCancel={() => {
          formData.data = {} as any;
          context.emit('cancel');
        }}
        onOk={() => {
          genModel();
        }}
      >
        <Form layout="vertical">
          <Form.Item label="项目" required>
            <Select
              placeholder="请选择项目"
              onChange={value => {
                const selected = projects.data.find(s => s.token === value);
                formData.data.token = selected!.token;
                if (selected?.domain) {
                  domainRef.value = selected.domain;
                }
              }}
              value={formData.data.token}
            >
              {projects.data.map(s => {
                return (
                  <Select.Option value={s.token} key={s.token}>
                    {s.name}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item label="接口ID" required>
            <Input
              placeholder="输入 yapi 接口ID"
              value={formData.data.id}
              onChange={e => {
                const value = e.target.value;
                formData.data.id = value;
              }}
            />
          </Form.Item>
          <Form.Item label="接口函数名称">
            <Input
              placeholder="输入生成的接口请求函数名称"
              value={formData.data.funcName}
              onChange={e => {
                const value = e.target.value;
                formData.data.funcName = value;
              }}
              onBlur={() => {
                if (
                  formData.data.funcName &&
                  formData.data.funcName.length > 1
                ) {
                  formData.data.typeName = `I${formData.data.funcName
                    .charAt(0)
                    .toUpperCase() + formData.data.funcName.slice(1)}Result`;
                }
              }}
            />
          </Form.Item>
          <Form.Item label="类型名称">
            <Input
              placeholder="输入生成的TS类型名称"
              value={formData.data.typeName}
              onChange={e => {
                const value = e.target.value;
                formData.data.typeName = value;
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
    );
  },
});
