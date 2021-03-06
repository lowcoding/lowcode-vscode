import React from 'react';
import { Button, Form, Input, message } from 'antd';
import { history, useModel } from 'umi';
import CodeMirror from '@/components/CodeMirror';
import useController from './useController';
import { addSnippets } from '@/webview/service';

export default () => {
  const { setTab } = useModel('tab');
  const controller = useController();
  const { service } = controller;
  const { model } = service;

  return (
    <div>
      <Form
        {...{
          labelCol: { span: 4 },
          wrapperCol: { span: 14 },
        }}
      >
        <Form.Item label="名称" required>
          <Input
            value={model.formData.name}
            placeholder="输入名称"
            onChange={e => {
              const { value } = e.target;
              model.setFormData(s => {
                return {
                  ...s,
                  name: value,
                };
              });
            }}
          />
        </Form.Item>
        <Form.Item label="代码片段" required>
          <CodeMirror
            domId="codeMirror"
            lint={false}
            value={model.formData.template}
            onChange={value => {
              model.setFormData(s => {
                return {
                  ...s,
                  template: value,
                };
              });
            }}
          />
        </Form.Item>
        <Form.Item label="模板数据">
          <CodeMirror
            domId="modelCodeMirror"
            lint
            value={model.formData.model}
            onChange={value => {
              model.setFormData(s => {
                return {
                  ...s,
                  model: value,
                };
              });
            }}
          />
        </Form.Item>
        <Form.Item label="模板 Schema">
          <CodeMirror
            domId="schemaCodeMirror"
            lint
            value={model.formData.schema}
            onChange={value => {
              model.setFormData(s => {
                return {
                  ...s,
                  schema: value,
                };
              });
            }}
          />
        </Form.Item>
        <Form.Item label="更多描述">
          <CodeMirror
            domId="previewCodeMirror"
            lint
            value={model.formData.preview}
            onChange={value => {
              model.setFormData(s => {
                return {
                  ...s,
                  preview: value,
                };
              });
            }}
          />
        </Form.Item>
      </Form>
      <div style={{ textAlign: 'center', width: '100%' }}>
        <Button
          shape="round"
          type="primary"
          onClick={() => {
            if (!model.formData.name || !model.formData.template) {
              message.error('请完善必填信息');
              return;
            }
            addSnippets(model.formData).then(() => {
              message.success('添加成功');
            });
          }}
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
