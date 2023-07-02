import React from 'react';
import { Button, Form, Input, Select, Switch } from 'antd';
import { history, useModel } from 'umi';
import CodeMirror from '@/components/CodeMirror';
import { usePresenter } from './presenter';
import { getSchemaWebUrl } from '@/utils/schema';

export default () => {
  const { setTab } = useModel('tab');
  const presenter = usePresenter();
  const { model } = presenter;

  return (
    <div>
      <Form layout="vertical">
        <Form.Item label="名称" required>
          <Input
            value={model.formData.name}
            placeholder="输入名称"
            onChange={(e) => {
              const { value } = e.target;
              model.setFormData((s) => ({
                ...s,
                name: value,
              }));
            }}
          />
        </Form.Item>
        <Form.Item label="代码片段" required>
          <CodeMirror
            domId="codeMirror"
            lint={false}
            value={model.formData.template}
            onChange={(value) => {
              model.setFormData((s) => ({
                ...s,
                template: value,
              }));
            }}
          />
        </Form.Item>
        <Form.Item label="ChatGPT CommandPrompt" tooltip="右键菜单 Prompt 模板">
          <CodeMirror
            domId="commandPromptCodeMirror"
            lint={false}
            value={model.formData.commandPrompt}
            onChange={(value) => {
              model.setFormData((s) => ({
                ...s,
                commandPrompt: value,
              }));
            }}
          />
        </Form.Item>
        <Form.Item
          label="ChatGPT ViewPrompt"
          tooltip="可视化动态表单 Prompt 模板"
        >
          <CodeMirror
            domId="viewPromptCodeMirror"
            lint={false}
            value={model.formData.viewPrompt}
            onChange={(value) => {
              model.setFormData((s) => ({
                ...s,
                viewPrompt: value,
              }));
            }}
          />
        </Form.Item>
        <Form.Item label="模板数据">
          <CodeMirror
            domId="modelCodeMirror"
            lint
            value={model.formData.model}
            onChange={(value) => {
              model.setFormData((s) => ({
                ...s,
                model: value,
              }));
            }}
          />
        </Form.Item>
        <Form.Item label="Schema 类型">
          <div style={{ display: 'flex' }}>
            <Select
              value={model.formData.schemaType}
              placeholder="输入名称"
              options={[
                { label: 'form-render', value: 'form-render' },
                { label: 'amis', value: 'amis' },
                { label: 'formily', value: 'formily' },
              ]}
              onChange={(value) => {
                model.setFormData((s) => ({
                  ...s,
                  schemaType: value as any,
                }));
              }}
            />
            <Button
              href={getSchemaWebUrl(model.formData.schemaType)}
              type="link"
            >
              可视化配置
            </Button>
          </div>
        </Form.Item>
        <Form.Item label="模板 Schema">
          <CodeMirror
            domId="schemaCodeMirror"
            lint
            value={model.formData.schema}
            onChange={(value) => {
              model.setFormData((s) => ({
                ...s,
                schema: value,
              }));
            }}
          />
        </Form.Item>
        <Form.Item label="更多配置">
          <CodeMirror
            domId="previewCodeMirror"
            lint
            value={model.formData.preview}
            onChange={(value) => {
              model.setFormData((s) => ({
                ...s,
                preview: value,
              }));
            }}
          />
        </Form.Item>
        <Form.Item label="保存到私有文件夹">
          <Switch
            checked={model.formData.private}
            onChange={(checked) => {
              model.setFormData((s) => {
                s.private = checked;
              });
            }}
          ></Switch>
        </Form.Item>
      </Form>
      <div style={{ textAlign: 'center', width: '100%' }}>
        <Button
          shape="round"
          type="primary"
          onClick={presenter.handleCreate}
          style={{ width: '50%' }}
        >
          添加代码片段
        </Button>
        <Button
          shape="round"
          onClick={() => {
            setTab('/snippets');
            history.push('/snippets');
          }}
          style={{ width: '50%' }}
        >
          返回
        </Button>
      </div>
    </div>
  );
};
