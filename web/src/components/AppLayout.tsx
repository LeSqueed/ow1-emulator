import React from 'react';
import { Layout, Menu } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  SettingOutlined,
  UserOutlined,
  HistoryOutlined,
  ExportOutlined,
} from '@ant-design/icons';
import { useApp } from '../contexts/AppContext.js';
import { darkModeColors } from '../theme/config.js';
import { PageHeader } from './PageHeader.js';

const { Sider } = Layout;

const ROUTE_TITLES: Record<string, string> = {
  '/':          'Dashboard',
  '/constants': 'Global Constants',
  '/heroes':    'Heroes',
  '/history':   'Change History',
};

const ROUTE_SECTIONS: Record<string, string> = {
  '/':          'OW1 Emulator',
  '/constants': 'Configuration',
  '/heroes':    'Roster Management',
  '/history':   'Audit',
};

const menuItems = [
  { key: '/', icon: <DashboardOutlined />, label: 'Dashboard' },
  { key: '/constants', icon: <SettingOutlined />, label: 'Constants' },
  { key: '/heroes', icon: <UserOutlined />, label: 'Heroes' },
  { key: '/history', icon: <HistoryOutlined />, label: 'History' },
];

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { exportFiles, setExportModalOpen, setGeneratedFiles } = useApp();

  const handleExport = async () => {
    try {
      const result = await exportFiles();
      if (result) {
        setGeneratedFiles(result);
        setExportModalOpen(true);
      }
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        theme="dark"
        width={220}
        className="ow-sidebar"
        style={{
          background: darkModeColors.menuBg,
          borderRight: `1px solid ${darkModeColors.tableBorderColor}`,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Logo area */}
        <div style={{
          height: 72,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: `1px solid ${darkModeColors.tableBorderColor}`,
          background: 'linear-gradient(180deg, rgba(249,158,26,0.1) 0%, transparent 100%)',
          gap: 1,
          cursor: 'default',
          userSelect: 'none',
        }}>
          <span style={{
            color: '#f99e1a',
            fontWeight: 900,
            fontSize: 22,
            letterSpacing: '5px',
            textTransform: 'uppercase',
            lineHeight: 1,
            textShadow: '0 0 20px rgba(249,158,26,0.4)',
          }}>
            OW1
          </span>
          <span style={{
            color: darkModeColors.secondary,
            fontWeight: 700,
            fontSize: 8,
            letterSpacing: '4px',
            textTransform: 'uppercase',
          }}>
            EMULATOR
          </span>
        </div>

        {/* Navigation */}
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{ background: 'transparent', border: 'none', flex: 1, marginTop: 8 }}
        />

        {/* Export button at bottom */}
        <div style={{
          padding: '16px',
          borderTop: `1px solid ${darkModeColors.tableBorderColor}`,
        }}>
          <button
            onClick={handleExport}
            style={{
              width: '100%',
              padding: '8px 12px',
              background: 'transparent',
              border: '1px solid rgba(249,158,26,0.4)',
              borderRadius: 3,
              color: '#f99e1a',
              fontWeight: 700,
              fontSize: 11,
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(249,158,26,0.12)';
              (e.currentTarget as HTMLButtonElement).style.borderColor = '#f99e1a';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 12px rgba(249,158,26,0.2)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(249,158,26,0.4)';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
            }}
          >
            <ExportOutlined />
            Export Constants
          </button>
        </div>
      </Sider>

      <Layout
        className="ow-main-content"
        style={{ background: darkModeColors.background }}
      >
        {/* PageHeader stays mounted — never remounts — so ScrambleTitle can animate between titles */}
        <div style={{ padding: '28px 28px 0' }}>
          <PageHeader
            section={ROUTE_SECTIONS[location.pathname] ?? ''}
            title={ROUTE_TITLES[location.pathname] ?? ''}
          />
        </div>
        {/* key={location.key} forces a fresh mount on every navigation, re-triggering CSS animations */}
        <div key={location.key} className="ow-page" style={{ padding: '0 28px 28px' }}>
          <Outlet />
        </div>
      </Layout>
    </Layout>
  );
}
