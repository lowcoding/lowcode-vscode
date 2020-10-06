import React from 'react';
import { Layout, Menu } from 'antd';
import { history } from 'umi';
import {
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import './index.less';

const { Sider, Content } = Layout;

const LayoutC: React.FC = ({ children }) => {
  return (
    <Layout className="base-layout">
      <Sider trigger={null} collapsible>
        <div className="logo" />
        <Menu
          theme="dark"
          mode="inline"
          onSelect={({ key }) => {
            history.push(key);
          }}
        >
          <Menu.Item key="/blocks" icon={<UserOutlined />}>
            区块模板
          </Menu.Item>
          <Menu.Item key="/snippets" icon={<VideoCameraOutlined />}>
            代码片段
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Content
          className="site-layout-background"
          style={{
            padding: '24px',
            minHeight: 280,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};
export default LayoutC;
