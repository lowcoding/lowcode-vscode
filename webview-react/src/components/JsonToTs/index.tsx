import React, { useEffect, useState } from 'react';
import { Modal, Form, Input } from 'antd';
import CodeMirror from '../CodeMirror';
import { callVscode } from '@/webview';

interface IProps {
  visible: boolean;
  json: object;
  onCancel: () => void;
  onOk: (tsType: string) => void;
}

const JsonToTs: React.FC<IProps> = ({ visible, json, onCancel, onOk }) => {
  const [formData, setFormData] = useState<{
    json: string;
    type: string;
    typeName: string;
  }>({
    json: JSON.stringify(json, null, 2),
    type: '',
    typeName: '',
  });

  useEffect(() => {}, []);

  useEffect(() => {
    if (visible) {
      setFormData((s) => ({
        ...s,
        json: JSON.stringify(json, null, 2),
      }));
    }
  }, [visible]);

  useEffect(() => {
    if (formData.json && visible) {
      callVscode(
        {
          cmd: 'jsonToTs',
          data: {
            json: JSON.parse(formData.json),
            typeName: formData.typeName,
          },
        },
        (type: string) => {
          setFormData((s) => ({
            ...s,
            type,
          }));
        },
        () => {},
      );
    }
  }, [formData.json, formData.typeName]);

  return (
    <Modal
      visible={visible}
      title="JSON TO TS"
      onCancel={() => {
        onCancel();
      }}
      onOk={() => {
        onOk(formData.type);
      }}
      okText="确定"
      cancelText="取消"
    >
      <Form layout="vertical">
        <Form.Item label="json" required>
          <CodeMirror
            domId="jsonCodeMirror"
            lint
            value={formData.json}
            onChange={(value) => {
              setFormData((s) => ({
                ...s,
                json: value,
              }));
            }}
          />
        </Form.Item>
        <Form.Item label="类型名称">
          <Input
            value={formData.typeName}
            placeholder="输入类型名称"
            onChange={(e) => {
              const { value } = e.target;
              setFormData((s) => ({
                ...s,
                typeName: value,
              }));
            }}
          />
        </Form.Item>

        <Form.Item label="TS 接口类型">
          <CodeMirror
            domId="typeCodeMirror"
            value={formData.type}
            onChange={(value) => {
              setFormData((s) => ({
                ...s,
                type: value,
              }));
            }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default JsonToTs;
