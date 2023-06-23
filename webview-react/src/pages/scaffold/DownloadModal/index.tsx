import React from 'react';
import { Modal, Form, Input, Checkbox, Select } from 'antd';
import { usePresenter } from './presenter';
import FormModal from '../FormModal';

interface IProps {
  visible: boolean;
  onClose: () => void;
}

const View: React.FC<IProps> = ({ visible, onClose }) => {
  const presenter = usePresenter({ visible, onClose });
  const { model } = presenter;

  return (
    <Modal
      visible={visible}
      title="直接根据git仓库或者npm包创建项目"
      onCancel={() => {
        if (model.processing) {
          return;
        }
        onClose();
      }}
      onOk={() => {
        presenter.downloadScaffold();
      }}
      okText="确定"
      cancelText="取消"
      okButtonProps={{ disabled: model.processing, loading: model.processing }}
    >
      <Form layout="vertical">
        <Form.Item label="类型" required>
          <Select
            placeholder="请选择"
            value={model.formData.type}
            onChange={(value) => {
              model.setFormData((s) => ({
                ...s,
                url: '',
                type: value,
              }));
            }}
          >
            <Select.Option value="git">git仓库</Select.Option>
            <Select.Option value="npm" disabled>
              npm包
            </Select.Option>
          </Select>
        </Form.Item>
        {model.formData.type && (
          <Form.Item
            label={model.formData.type === 'git' ? '仓库地址' : '包名称'}
            required
          >
            <Input
              placeholder={`输入${
                model.formData.type === 'git' ? 'git仓库地址' : 'npm包名称'
              }`}
              value={model.formData.url}
              onChange={(e) => {
                const { value } = e.target;
                model.setFormData((s) => ({
                  ...s,
                  url: value,
                }));
              }}
            />
          </Form.Item>
        )}
      </Form>
      <FormModal
        visible={model.formModal.visible}
        config={model.formModal.config}
        onClose={(ok) => {
          model.setFormModal((s) => {
            s.visible = false;
          });
          if (ok) {
            onClose();
          }
        }}
      />
    </Modal>
  );
};

export default View;
