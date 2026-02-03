import type { Server } from '@/entities/server';
import { describe, expect, it } from 'vitest';

import { calculateGroupSummary, getAllGroupIds, getGroupId, getServerFieldValue, groupServers } from './grouping.utils';

const mockServers: Server[] = [
  { oid: 1, hostname: 'web-01', ip: '10.0.1.1', status: 'ok', osType: 'Linux', serverType: 'web', cores: 4 },
  { oid: 2, hostname: 'web-02', ip: '10.0.1.2', status: 'warning', osType: 'Linux', serverType: 'web', cores: 4 },
  { oid: 3, hostname: 'db-01', ip: '10.0.1.3', status: 'ok', osType: 'Windows', serverType: 'db', cores: 8 },
  { oid: 4, hostname: 'db-02', ip: '10.0.1.4', status: 'critical', osType: 'Windows', serverType: 'db', cores: 8 },
  { oid: 5, hostname: 'app-01', ip: '10.0.1.5', status: 'inactive', osType: 'Linux', serverType: 'app', cores: 4 },
];

describe('getServerFieldValue', () => {
  it('returns osType for OSType key', () => {
    expect(getServerFieldValue(mockServers[0]!, 'OSType')).toBe('Linux');
  });

  it('returns serverType for serverType key', () => {
    expect(getServerFieldValue(mockServers[0]!, 'serverType')).toBe('web');
  });

  it('returns Ungrouped for missing defaultGroup', () => {
    expect(getServerFieldValue(mockServers[0]!, 'defaultGroup')).toBe('Ungrouped');
  });

  it('returns Unknown for missing optional fields', () => {
    expect(getServerFieldValue(mockServers[0]!, 'cloudRegion')).toBe('Unknown');
  });
});

describe('calculateGroupSummary', () => {
  it('calculates total correctly', () => {
    const summary = calculateGroupSummary(mockServers);
    expect(summary.total).toBe(5);
  });

  it('calculates active correctly (excludes inactive)', () => {
    const summary = calculateGroupSummary(mockServers);
    expect(summary.active).toBe(4);
  });

  it('calculates warning count correctly', () => {
    const summary = calculateGroupSummary(mockServers);
    expect(summary.warning).toBe(1);
  });

  it('calculates critical count correctly', () => {
    const summary = calculateGroupSummary(mockServers);
    expect(summary.critical).toBe(1);
  });
});

describe('groupServers', () => {
  it('returns single group with all servers when no grouping', () => {
    const result = groupServers(mockServers, null);
    expect(result).toHaveLength(1);
    expect(result[0]!.key).toBe('all');
    expect(result[0]!.servers).toHaveLength(5);
  });

  it('groups servers by serverType', () => {
    const result = groupServers(mockServers, 'serverType');
    expect(result).toHaveLength(3); // web, db, app

    const webGroup = result.find((g) => g.name === 'web');
    expect(webGroup?.servers).toHaveLength(2);

    const dbGroup = result.find((g) => g.name === 'db');
    expect(dbGroup?.servers).toHaveLength(2);
  });

  it('groups servers by OSType', () => {
    const result = groupServers(mockServers, 'OSType');
    expect(result).toHaveLength(2); // Linux, Windows

    const linuxGroup = result.find((g) => g.name === 'Linux');
    expect(linuxGroup?.servers).toHaveLength(3);

    const windowsGroup = result.find((g) => g.name === 'Windows');
    expect(windowsGroup?.servers).toHaveLength(2);
  });

  it('applies secondary grouping', () => {
    const result = groupServers(mockServers, 'serverType', 'OSType');

    const webGroup = result.find((g) => g.name === 'web');
    expect(webGroup?.groups).toHaveLength(1); // Only Linux
    expect(webGroup?.servers).toHaveLength(0); // Servers in subgroups

    const dbGroup = result.find((g) => g.name === 'db');
    expect(dbGroup?.groups).toHaveLength(1); // Only Windows
  });

  it('sorts groups by name', () => {
    const result = groupServers(mockServers, 'serverType');
    const names = result.map((g) => g.name);
    expect(names).toEqual(['app', 'db', 'web']);
  });
});

describe('getGroupId', () => {
  it('returns group name for top-level groups', () => {
    const group = {
      key: 'serverType',
      name: 'web',
      servers: [],
      groups: [],
      summary: { total: 0, active: 0, warning: 0, critical: 0, warningEventCount: 0, criticalEventCount: 0 },
    };
    expect(getGroupId(group)).toBe('web');
  });

  it('returns combined id for nested groups', () => {
    const group = {
      key: 'OSType',
      name: 'Linux',
      servers: [],
      groups: [],
      summary: { total: 0, active: 0, warning: 0, critical: 0, warningEventCount: 0, criticalEventCount: 0 },
    };
    expect(getGroupId(group, 'web')).toBe('web::Linux');
  });
});

describe('getAllGroupIds', () => {
  it('returns all group ids including nested', () => {
    const groups = groupServers(mockServers, 'serverType', 'OSType');
    const ids = getAllGroupIds(groups);

    // Should include top-level and nested group ids
    expect(ids).toContain('web');
    expect(ids).toContain('db');
    expect(ids).toContain('app');
    expect(ids).toContain('web::Linux');
    expect(ids).toContain('db::Windows');
  });
});
