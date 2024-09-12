import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import 'bootstrap/dist/css/bootstrap.min.css';

const { Header } = Layout;

const AppHeader = () => {
  const [account, setAccount] = useState(null);
  const [role, setRole] = useState('');
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    window.location.reload();
    navigate("/login");
  };

  useEffect(() => {
    const account = localStorage.getItem("account");
    setRole(localStorage.getItem("role"));
    setAccount(account ? JSON.parse(account) : null);
  }, []);

  return (
    <Header style={{ backgroundColor: '#001529', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px' }}>
      <div className="logo" style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>
        Support Management
      </div>
      <Menu theme="dark" mode="horizontal" style={{ flex: 1, justifyContent: 'flex-end' }}>
        <Menu.Item key="1">
          <Link to="/">Home</Link>
        </Menu.Item>
        {role === "Admin" && (
          <>
            <Menu.Item key="2">
              <Link to="/customer-management">Customer Management</Link>
            </Menu.Item>
            <Menu.Item key="3">
              <Link to="/support-request-management">Support Request</Link>
            </Menu.Item>
            <Menu.Item key="5">
              <Link to="/inventory-management">Inventory Management</Link>
            </Menu.Item>
            <Menu.Item key="7">
              <Link to="/data-analytics">Data Analytics</Link>
            </Menu.Item>
            <Menu.Item key="8">
              <Link to="/customers">customers</Link>
            </Menu.Item>
          </>
        )}
        {role === "User" && (
          <>
            <Menu.Item key="4">
              <Link to="/support-request-management">Support Request</Link>
            </Menu.Item>
            <Menu.Item key="6">
              <Link to="/knowledge-base">Knowledge Base</Link>
            </Menu.Item>
          </>
        )}
        {role === "Technician" && (
          <>
            <Menu.Item key="8">
              <Link to="/JobScheduling">Job Scheduling</Link>
            </Menu.Item>
            <Menu.Item key="9">
              <Link to="/knowledge-base">Knowledge Base</Link>
            </Menu.Item>
          </>
        )}
        {account ? (
          <Menu.Item key="10" onClick={logout}>
            Logout
          </Menu.Item>
        ) : (
          <Menu.Item key="11">
            <Link to="/login">Login</Link>
          </Menu.Item>
        )}
      </Menu>
    </Header>
  );
};

export default AppHeader;