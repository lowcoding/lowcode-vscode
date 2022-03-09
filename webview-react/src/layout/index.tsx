import React from 'react';
import { Layout, Radio } from 'antd';
import { history } from 'umi';
import { AppstoreFilled, BugFilled } from '@ant-design/icons';
import './index.less';
import { useMount } from 'ahooks';
import HeaderControl from '@/components/HeaderControl';

const { Sider, Content } = Layout;

const LayoutC: React.FC = ({ children }) => {
  useMount(() => {
    history.push('/snippets');
  });
  return (
    <Layout className="base-layout">
      {/* <Sider trigger={null} collapsible>
        <div className="logo" />
        <Menu
          theme="dark"
          mode="inline"
          onSelect={({ key }) => {
            history.push(key);
          }}
        >
          <Menu.Item key="/blocks" icon={<AppstoreFilled />}>
            区块模板
          </Menu.Item>
          <Menu.Item key="/snippets" icon={<BugFilled />}>
            代码片段
          </Menu.Item>
        </Menu>
      </Sider> */}
      <Layout className="site-layout">
        <HeaderControl />
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
