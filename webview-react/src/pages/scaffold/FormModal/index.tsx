import React from 'react';
import { Modal, Form, Input, Checkbox } from 'antd';
import useController from './useController';
import FormRender from 'form-render';

interface IProps {
  visible: boolean;
  config: {
    formSchema?: { schema?: object; formData?: object; [key: string]: any };
  };
  onClose: (ok?: boolean) => void;
}

const View: React.FC<IProps> = ({ visible, config, onClose }) => {
  const controller = useController({ visible, config, onClose });
  const { service } = controller;
  const { model } = service;

  return (
    <Modal
      title="创建项目"
      visible={visible}
      onCancel={() => {
        onClose();
      }}
      onOk={() => {
        controller.createProjectByVsCode();
      }}
      cancelText="取消"
      okText="确定"
    >
      {config.formSchema && (
        <FormRender
          form={controller.form}
          schema={config.formSchema?.schema || {}}
          displayType="column"
          labelWidth={config.formSchema?.labelWidth}
          watch={controller.watch}
        />
      )}
      <Form layout="vertical">
        <Form.Item label="项目名称" required>
          <Input
            value={model.config.projectName}
            onChange={e => {
              const { value } = e.target;
              model.setConfig(s => {
                s.projectName = value;
              });
            }}
          />
        </Form.Item>
        <Form.Item label="生成目录" required>
          <Input
            value={model.config.createDir}
            readOnly
            onClick={() => {
              controller.selectDirectoryByVsCode();
            }}
          />
        </Form.Item>
        <Form.Item label="创建后立即打开">
          <Checkbox
            checked={model.config.immediateOpen}
            onChange={e => {
              const { checked } = e.target;
              model.setConfig(s => {
                s.immediateOpen = checked;
              });
            }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default View;
