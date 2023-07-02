import React from 'react';
import { Button, Form, Input, Modal } from 'antd';
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
      zIndex={999}
    >
      <Form layout="vertical">
        <Form.Item label="选择目录">
          <div style={{ display: 'flex' }}>
            <Input
              readOnly
              placeholder="请选择"
              value={model.syncFolder}
              onClick={presenter.handleselectDirectory}
            ></Input>
            <Button
              type="link"
              disabled={!model.syncFolder}
              onClick={presenter.handleOpenUriByVscode}
            >
              vscode 中打开
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ConfigSyncFolder;
