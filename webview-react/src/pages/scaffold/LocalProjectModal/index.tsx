import React from 'react';
import { Modal, Form, Input } from 'antd';
import { usePresenter } from './presenter';
import FormModal from '../FormModal';

interface IProps {
  visible: boolean;
  onClose: () => void;
}

const View: React.FC<IProps> = ({ visible, onClose }) => {
  const presenter = usePresenter();
  const { model } = presenter;
  return (
    <Modal
      visible={visible}
      title="打开本地项目进行调试"
      onCancel={() => {
        if (model.processing) {
          return;
        }
        onClose();
      }}
      onOk={presenter.copyLocalScaffold}
      okText="确定"
      cancelText="取消"
      okButtonProps={{ disabled: model.processing, loading: model.processing }}
    >
      <Form layout="vertical">
        <Form.Item label="选择项目">
          <Input
            value={model.openFolder}
            readOnly
            onClick={presenter.selectDirectoryByVsCode}
            placeholder="默认当前项目"
          />
        </Form.Item>
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
