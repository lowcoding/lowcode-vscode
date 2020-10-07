import React from 'react';
import { Layout, Radio } from 'antd';
import { history } from 'umi';
import { AppstoreFilled, BugFilled } from '@ant-design/icons';
import './index.less';

const { Sider, Content } = Layout;

const LayoutC: React.FC = ({ children }) => {
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
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Radio.Group
            defaultValue="/snippets"
            onChange={e => {
              const { value } = e.target;
              history.push(value);
            }}
            buttonStyle="solid"
          >
            <Radio.Button value="/snippets">代码片段</Radio.Button>
            <Radio.Button value="/blocks">区块</Radio.Button>
			<Radio.Button value="/index">插件配置</Radio.Button>
          </Radio.Group>
        </div>
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
