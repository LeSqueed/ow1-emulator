import React from 'react';
import { Tag } from 'antd';

export interface TagComponentProps {
  type: string;
}

export interface PropertyTagProps extends TagComponentProps {
  color: string;
}

export interface RoleTagProps {
  role: string;
}

export interface AbilityTagProps {
  type: string;
}

/**
 * Maps property types to color values for visual differentiation
 */
export const getPropertyTypeColor = (type: string): string => {
  const colors: Record<string, string> = {
    DAMAGE: 'red',
    HEALING: 'green',
    COOLDOWN: 'blue',
    DURATION: 'purple',
    RATE: 'orange',
    RANGE: 'cyan',
    BUFFER: 'volcano',
    ULTIMATE: 'red',
    MULTIPLIER: 'geekblue',
    PHYSICS: 'lime',
    DELAY: 'magenta',
    SPEED: 'blue',
    RADIUS: 'orange',
    MAX_CHARGES: 'purple',
    DEFAULT: 'default',
  };
  return colors[type] || 'default';
};

/**
 * Maps character roles to color values
 */
export const getRoleColor = (role: string): string => {
  const colors: Record<string, string> = {
    Tank: 'blue',
    Dps: 'red',
    Support: 'green',
  };
  return colors[role] || 'default';
};

/**
 * Tag component for displaying ability types with color coding
 */
export function AbilityTypeTag({ type }: AbilityTagProps) {
  return <Tag>{type}</Tag>;
}

/**
 * Tag component for displaying property types with dynamic colors
 */
export function PropertyTypeTag({ type }: PropertyTagProps) {
  return (
    <Tag color={getPropertyTypeColor(type)}>
      {type}
    </Tag>
  );
}

/**
 * Tag component for displaying role information with color coding
 */
export function RoleTag({ role }: RoleTagProps) {
  return (
    <Tag color={getRoleColor(role)}>
      {role}
    </Tag>
  );
}
