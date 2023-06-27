import React from 'react';
import { Form, Input, Modal } from 'antd';
import { usePresenter } from './presenter';

const ConfigSyncFolder = () => {
  const presenter = usePresenter();
  const { model } = presenter;

  return (
    <Modal
      title="设置同步目录"
      visible={presenter.syncFolderModal.visible}
      onCancel={() => {
        presenter.syncFolderModal.setVisible(false);
      }}
      onOk={presenter.handleOk}
      okButtonProps={{ loading: model.loading, disabled: !model.syncFolder }}
      okText="确定"
      cancelText="取消"
    >
      <Form layout="vertical">
        <Form.Item label="选择目录">
          <Input
            readOnly
            placeholder="请选择"
            value={model.syncFolder}
            onClick={presenter.handleselectDirectory}
          ></Input>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ConfigSyncFolder;
