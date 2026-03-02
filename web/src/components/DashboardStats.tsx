import React from 'react';
import { Card, Statistic, Row, Col, Skeleton } from 'antd';
import { UserOutlined, CodeOutlined } from '@ant-design/icons';
import type { Constant as GlobalConstant, Hero, Ability } from '../types';

interface DashboardStatsProps {
  constants: GlobalConstant[];
  heroes: Hero[];
  abilities: Ability[];
  loading?: boolean;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  constants,
  heroes,
  abilities,
  loading,
}) => {
  if (loading) {
    return (
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card>
            <Skeleton active />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Skeleton active />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Skeleton active />
          </Card>
        </Col>
      </Row>
    );
  }

  return (
    <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
      <Col xs={24} sm={8}>
        <Card>
          <Statistic
            title="Total Constants"
            value={constants.length}
            prefix={<CodeOutlined style={{ color: '#f99e1a' }} />}
            valueStyle={{ color: '#f99e1a', fontWeight: 700 }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={8}>
        <Card>
          <Statistic
            title="Total Heroes"
            value={heroes.length}
            prefix={<UserOutlined style={{ color: '#ffb340' }} />}
            valueStyle={{ color: '#ffb340', fontWeight: 700 }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={8}>
        <Card>
          <Statistic
            title="Total Abilities"
            value={abilities.length}
            prefix={<CodeOutlined style={{ color: '#c47800' }} />}
            valueStyle={{ color: '#c47800', fontWeight: 700 }}
          />
        </Card>
      </Col>
    </Row>
  );
};
