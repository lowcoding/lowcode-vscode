import { computed, defineComponent } from 'vue';
import { Form, Button, Dropdown, message } from 'ant-design-vue';
import { DownOutlined } from '@ant-design/icons-vue';
import useController from './useController';
import CodeMirror from '@/components/CodeMirror';
import JsonToTs from '@/components/JsonToTs';
import YapiModal from '@/components/YapiModal';
import { genCodeBySnippetMaterial } from '@/vscode/service';
import router from '@/router';

export default defineComponent({
  setup() {
    const controller = useController();
    const { service } = controller;
    const { model } = service;

    const modelJson = computed(() =>
      JSON.stringify(model.selectedMaterial.data.model, null, 2),
    );
    return () => (
      <div>
        <Form layout="vertical">
          <Form.Item label="模板">
            <CodeMirror
              domId="template"
              lint
              value={model.selectedMaterial.data.template}
              onChange={value => {
                model.selectedMaterial.data.template = value;
              }}
            />
          </Form.Item>
          <Form.Item label="模板数据">
            <CodeMirror
              domId="model"
              lint
              value={JSON.stringify(model.selectedMaterial.data.model, null, 2)}
              onChange={value => {
                model.selectedMaterial.data.model = JSON.parse(value);
              }}
            />
          </Form.Item>
          <Form.Item>
            <Dropdown overlay={controller.menu}>
              <a onClick={e => e.preventDefault()}>
                更多功能 <DownOutlined />
              </a>
            </Dropdown>
            &nbsp;&nbsp;
            <Button
              type="primary"
              size="small"
              onClick={() => {
                genCodeBySnippetMaterial({
                  model: model.selectedMaterial.data.model,
                  template: model.selectedMaterial.data.template,
                }).then(() => {
                  message.success('生成成功');
                });
              }}
            >
              生成代码
            </Button>
          </Form.Item>
        </Form>
        <div style={{ textAlign: 'center', width: '100%' }}>
          <Button
            shape="round"
            onClick={() => {
              router.push('/snippets');
            }}
            style={{ width: '50%' }}
          >
            返回
          </Button>
        </div>
        <JsonToTs
          visible={model.dialogVisible.jsonToTs}
          json={modelJson.value}
          onOk={typeCode => {
            model.selectedMaterial.data.model = {
              ...model.selectedMaterial.data.model,
              type: typeCode,
            };
            model.dialogVisible.jsonToTs = false;
          }}
          onCancel={() => {
            model.dialogVisible.jsonToTs = false;
          }}
        />
        <YapiModal
          visible={model.dialogVisible.yapi}
          onOk={m => {
            model.dialogVisible.yapi = false;
            model.selectedMaterial.data.model = {
              ...model.selectedMaterial.data.model,
              ...(m as object),
            };
          }}
          onCancel={() => {
            model.dialogVisible.yapi = false;
          }}
        />
      </div>
    );
  },
});
