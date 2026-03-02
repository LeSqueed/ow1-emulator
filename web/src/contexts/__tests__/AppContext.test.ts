import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { AppProvider } from '../AppContext';
import { useApp } from '../AppContext';

describe('AppContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should provide context with required methods', () => {
    const wrapper = ({ children }: { children: any }) => {
      return React.createElement(AppProvider, null, children);
    };

    const { result } = renderHook(() => useApp(), { wrapper });

    expect(result.current.constants).toBeDefined();
    expect(result.current.heroes).toBeDefined();
    expect(result.current.revisions).toBeDefined();
    expect(typeof result.current.addHero).toBe('function');
    expect(typeof result.current.deleteHero).toBe('function');
  });

  it('should have deleteAbility method in context', () => {
    const wrapper = ({ children }: { children: any }) => {
      return React.createElement(AppProvider, null, children);
    };

    const { result } = renderHook(() => useApp(), { wrapper });

    expect(typeof result.current.deleteAbility).toBe('function');
  });
});