import React from 'react';
import { Row, Col, Card, Table, Spin } from 'antd';
import { CodeOutlined, UserOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext.js';
import type { Constant, Revision } from '@/types';
import { darkModeColors as defaultDarkModeColors } from '@/theme/config.js';
const colors = {
  text: defaultDarkModeColors.text,
  secondary: defaultDarkModeColors.secondary,
  card: defaultDarkModeColors.cardBg,
};

interface StatPanelProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  accentColor: string;
  sublabel?: string;
  path?: string;
}

const StatPanel: React.FC<StatPanelProps> = ({ label, value, icon, accentColor, sublabel, path }) => {
  const navigate = useNavigate();
  return (
  <div style={{
    background: `linear-gradient(140deg, #1c1c28 0%, #15151e 100%)`,
    border: `1px solid #2c2c40`,
    borderRadius: 4,
    padding: '20px 24px 18px',
    position: 'relative',
    overflow: 'hidden',
    height: '100%',
    transition: 'all 0.2s ease',
    cursor: path ? 'pointer' : 'default',
  }}
    onClick={() => path && navigate(path)}
    onMouseEnter={e => {
      (e.currentTarget as HTMLDivElement).style.borderColor = accentColor + '66';
      (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
      (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px ${accentColor}22`;
    }}
    onMouseLeave={e => {
      (e.currentTarget as HTMLDivElement).style.borderColor = '#2c2c40';
      (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
      (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
    }}
  >
    {/* Top accent line */}
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, height: 2,
      background: `linear-gradient(90deg, ${accentColor} 0%, ${accentColor}33 60%, transparent 100%)`,
    }} />

    {/* Background watermark icon */}
    <div style={{
      position: 'absolute', right: -8, top: '50%', transform: 'translateY(-50%)',
      fontSize: 96, opacity: 0.04, color: accentColor, lineHeight: 1,
      pointerEvents: 'none', userSelect: 'none',
    }}>
      {icon}
    </div>

    {/* Section label */}
    <div style={{
      fontSize: 9, fontWeight: 700, letterSpacing: '2.5px',
      textTransform: 'uppercase', color: accentColor, opacity: 0.8,
      marginBottom: 10,
    }}>
      {label}
    </div>

    {/* Big number */}
    <div style={{
      fontSize: 52, fontWeight: 900, letterSpacing: '-2px',
      color: colors.text, lineHeight: 1, marginBottom: 4,
    }}>
      {value}
    </div>

    {/* Sublabel */}
    {sublabel && (
      <div style={{
        fontSize: 10, fontWeight: 600, letterSpacing: '1px',
        textTransform: 'uppercase', color: colors.secondary, opacity: 0.7,
      }}>
        {sublabel}
      </div>
    )}
    {/* Link hint when clickable */}
    {path && (
      <div style={{
        position: 'absolute', bottom: 10, right: 14,
        fontSize: 9, fontWeight: 700, letterSpacing: '1.5px',
        textTransform: 'uppercase', color: accentColor, opacity: 0.5,
      }}>
        View →
      </div>
    )}
  </div>
  );
};

export const DashboardPage: React.FC = () => {
  const { constants, heroes, loading, revisions } = useApp();
  const totalAbilities = heroes.reduce((sum, h) => sum + (h.abilitiesCount || 0), 0);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="ow-page">
      {/* Stat panels */}
      <Row gutter={[16, 16]} style={{ marginBottom: 28 }}>
        <Col xs={24} sm={8}>
          <StatPanel
            label="Constants"
            value={constants.length}
            icon={<CodeOutlined />}
            accentColor="#f99e1a"
            sublabel="Global values"
            path='/constants'
          />
        </Col>
        <Col xs={24} sm={8}>
          <StatPanel
            label="Heroes"
            value={heroes.length}
            icon={<UserOutlined />}
            accentColor="#ffb340"
            sublabel="Tracked"
            path='/heroes'
          />
        </Col>
        <Col xs={24} sm={8}>
          <StatPanel
            label="Abilities"
            value={totalAbilities}
            icon={<ThunderboltOutlined />}
            accentColor="#c47800"
            sublabel="Total properties"
          />
        </Col>
      </Row>

      {/* Data tables */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card
            variant="borderless"
            title={
              <span style={{ color: colors.text, fontWeight: 700, letterSpacing: '0.3px' }}>
                Recent Constants
              </span>
            }
          >
            <Table
              dataSource={constants.slice(0, 5)}
              columns={[
                {
                  title: 'Name',
                  key: 'name',
                  render: (_: unknown, r: Constant) => (
                    <span>
                      {r.display_name}
                      <br />
                      <small style={{ color: colors.secondary, fontFamily: 'monospace', fontSize: 11 }}>
                        {r.constant_name}
                      </small>
                    </span>
                  ),
                },
                {
                  title: 'Patched',
                  dataIndex: 'patched_value',
                  key: 'patched_value',
                  align: 'right' as const,
                  render: (v: number) => (
                    <code style={{ background: '#1c1810', color: '#ffb340', padding: '2px 8px', borderRadius: 3, border: '1px solid rgba(249,158,26,0.2)', fontSize: 12 }}>
                      {v}
                    </code>
                  ),
                },
                {
                  title: 'Live',
                  dataIndex: 'live_value',
                  key: 'live_value',
                  align: 'right' as const,
                  render: (v: number) => (
                    <code style={{ background: '#1c1810', color: '#8a8070', padding: '2px 8px', borderRadius: 3, border: '1px solid #2c2c40', fontSize: 12 }}>
                      {v}
                    </code>
                  ),
                },
              ]}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            variant="borderless"
            title={
              <span style={{ color: colors.text, fontWeight: 700, letterSpacing: '0.3px' }}>
                Recent Changes
              </span>
            }
          >
            <Table
              dataSource={revisions.slice(0, 5)}
              columns={[
                {
                  title: 'When',
                  dataIndex: 'updated_at',
                  key: 'updated_at',
                  render: (d: string) => (
                    <span style={{ fontSize: 12 }}>
                      {new Date(d).toLocaleDateString()}
                      <br />
                      <small style={{ color: colors.secondary }}>{new Date(d).toLocaleTimeString()}</small>
                    </span>
                  ),
                },
                {
                  title: 'Table',
                  dataIndex: 'table_name',
                  key: 'table_name',
                  render: (t: string) => (
                    <span style={{ fontFamily: 'monospace', fontSize: 11, color: colors.secondary }}>{t}</span>
                  ),
                },
                {
                  title: 'Action',
                  key: 'action',
                  render: (_: unknown, r: Revision) => {
                    if (r.field_name === '__create__') return <span style={{ color: '#52c41a', fontSize: 11, fontWeight: 700 }}>CREATE</span>;
                    if (r.field_name === '__delete__') return <span style={{ color: '#ff4d4f', fontSize: 11, fontWeight: 700 }}>DELETE</span>;
                    return <span style={{ color: '#f99e1a', fontSize: 11, fontWeight: 700 }}>UPDATE</span>;
                  },
                },
              ]}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};
