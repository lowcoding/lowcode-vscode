import React from 'react';
import { history, useModel } from 'umi';
import { Radio, Menu, Dropdown, message, Modal, Form, Input, Select } from 'antd';
import { executeVscodeCommand, refreshIntelliSense } from '@/webview/service';
import { usePresenter } from './presenter';

export default () => {
  const { tab, setTab } = useModel('tab');
  const presenter = usePresenter();
  const { model } = presenter;
  const menu = (
    <Menu>
      <Menu.Item
        key="0"
        onClick={() => {
          executeVscodeCommand({ command: 'lowcode.openDownloadMaterials' });
        }}
      >
        下载物料
      </Menu.Item>
      <Menu.Item
        key="1"
        onClick={() => {
          setTab('empty');
          history.push('/snippets/add/10086');
        }}
      >
        添加代码片段
      </Menu.Item>
      <Menu.Item
        key="3"
        onClick={() => {
          model.setBlockModal((s) => {
            s.visible = true;
          });
        }}
      >
        创建区块模板
      </Menu.Item>
      <Menu.Item
        key="2"
        onClick={() => {
          refreshIntelliSense().then(() => {
            message.success('刷新成功');
          });
        }}
      >
        刷新代码智能提示
      </Menu.Item>
    </Menu>
  );
  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <Radio.Group value={tab} buttonStyle="solid">
        <Radio.Button
          value="/snippets"
          onClick={() => {
            presenter.handleChangeRoute('/snippets');
          }}
        >
          代码片段
        </Radio.Button>
        <Radio.Button
          value="/blocks"
          onClick={() => {
            presenter.handleChangeRoute('/blocks');
          }}
        >
          区块
        </Radio.Button>
        <Radio.Button
          value="/config"
          onClick={() => {
            presenter.handleChangeRoute('/config');
          }}
        >
          插件配置
        </Radio.Button>
        <Dropdown overlay={menu}>
          <Radio.Button value="more">更多</Radio.Button>
        </Dropdown>
      </Radio.Group>
      <Modal
        visible={model.blockModal.visible}
        title="创建区块模板"
        onCancel={presenter.closeBlockModal}
        onOk={presenter.createBlock}
        okText="确定"
        cancelText="取消"
        okButtonProps={{
          disabled: model.blockModal.processing,
          loading: model.blockModal.processing,
        }}
      >
        <Form layout="vertical">
          <Form.Item label="名称" required>
            <Input
              value={model.blockModal.name}
              onChange={(e) => {
                const { value } = e.target;
                model.setBlockModal((s) => {
                  s.name = value;
                });
              }}
              placeholder="请输入"
            />
          </Form.Item>
          <Form.Item label="schema 类型">
            <Select
              value={model.blockModal.schemaType}
              options={[
                { label: 'form-render', value: 'form-render' },
                { label: 'amis', value: 'amis' },
                { label: 'formily', value: 'formily' },
              ]}
              onChange={(value) => {
                model.setBlockModal((s) => {
                  s.schemaType = value;
                });
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
