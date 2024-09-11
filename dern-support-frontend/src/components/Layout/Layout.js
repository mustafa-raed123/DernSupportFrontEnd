import React from 'react';
import { Layout } from 'antd';
import AppHeader from '../Header/Header';
import AppFooter from '../Footer/Footer';

const { Content } = Layout;

const AppLayout = ({ children }) => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <AppHeader />
      <Content style={{ padding: '0 50px', marginTop: '64px' }}>
        <div style={{ padding: 24, background: '#fff', minHeight: 380 }}>
          {children}
        </div>
      </Content>
      <AppFooter />
    </Layout>
  );
};

export default AppLayout;