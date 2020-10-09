import React, { useState } from 'react';
import { history } from 'umi';
import { Radio, Menu, Dropdown } from 'antd';
import DownloadMaterials from '../DownloadMaterials';

export default () => {
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
          history.push('/snippets/add/10086');
        }}
      >
        添加代码片段
      </Menu.Item>
    </Menu>
  );
  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <Radio.Group
        defaultValue="/snippets"
        onChange={e => {
          const { value } = e.target;
          if (value !== 'more') {
            history.push(value);
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
