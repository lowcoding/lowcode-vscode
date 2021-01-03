import React, { useState } from 'react';
import { history, useModel } from 'umi';
import { Radio, Menu, Dropdown, message } from 'antd';
import DownloadMaterials from '../DownloadMaterials';
import { refreshIntelliSense } from '@/webview/service';

export default () => {
  const { tab, setTab } = useModel('tab');
  const [downloadMaterialsVisible, setDownloadMaterialsVisible] = useState(
    false,
  );
  const menu = (
    <Menu>
      <Menu.Item
        key="0"
        onClick={() => {
          setDownloadMaterialsVisible(true);
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
      <Radio.Group
        value={tab}
        onChange={e => {
          const { value } = e.target;
          if (value !== 'more') {
            history.push(value);
            setTab(value);
          }
        }}
        buttonStyle="solid"
      >
        <Radio.Button value="/snippets">代码片段</Radio.Button>
        <Radio.Button value="/blocks">区块</Radio.Button>
        <Radio.Button value="/index">插件配置</Radio.Button>
        <Dropdown overlay={menu}>
          <Radio.Button value="more">更多</Radio.Button>
        </Dropdown>
      </Radio.Group>
      <DownloadMaterials
        visible={downloadMaterialsVisible}
        onOk={() => {
          setDownloadMaterialsVisible(false);
        }}
        onCancel={() => {
          setDownloadMaterialsVisible(false);
        }}
      />
    </div>
  );
};
