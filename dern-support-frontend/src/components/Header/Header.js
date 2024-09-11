import React from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';

const { Header } = Layout;

const AppHeader = () => {
  return (
    <Header>
      <div className="logo" style={{ color: 'white', float: 'left', marginRight: '20px' }}>
        Support Management
      </div>
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
        <Menu.Item key="1">
          <Link to="/">Home</Link>
        </Menu.Item>
        <Menu.Item key="2">
          <Link to="/customer-management">Customer Management</Link>
        </Menu.Item>
        <Menu.Item key="3">
          <Link to="/support-request-management">Support Request Management</Link>
        </Menu.Item>
        <Menu.Item key="4">
          <Link to="/knowledge-base">Knowledge Base</Link>
        </Menu.Item>
        <Menu.Item key="5">
          <Link to="/inventory-management">Inventory Management</Link>
        </Menu.Item>
        <Menu.Item key="6">
          <Link to="/job-scheduling">Job Scheduling</Link>
        </Menu.Item>
        <Menu.Item key="7">
          <Link to="/data-analytics">Data Analytics</Link>
        </Menu.Item>
      </Menu>
    </Header>
  );
};

export default AppHeader;