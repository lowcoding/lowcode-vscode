import React from 'react';
import { Layout } from 'antd';
import { history } from 'umi';
import './index.less';
import { useMount } from 'ahooks';
import HeaderControl from '@/components/HeaderControl';

const { Content } = Layout;

const LayoutC: React.FC = ({ children }) => (
  <Layout className="base-layout">
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
export default LayoutC;
