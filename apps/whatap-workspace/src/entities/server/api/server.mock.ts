/**
 * Server Mock Data & Hooks
 * @description MVP용 Mock 데이터 생성 및 커스텀 훅
 */
import { useMemo } from 'react';

import type {
  GroupOptionKey,
  GroupSummary,
  OSSummary,
  OSType,
  ProjectSummary,
  Server,
  ServerGroup,
  ServerStatus,
} from '../model/server.types';

// =============================================================================
// Mock Data Constants
// =============================================================================

const SERVER_TYPES = ['web', 'db', 'app', 'batch'] as const;
const CLOUD_REGIONS = ['ap-northeast-2', 'us-west-2', 'eu-west-1'] as const;
const DEFAULT_GROUPS = ['production', 'staging', 'development'] as const;
const CORES_OPTIONS = [2, 4, 8, 16, 32] as const;

// 분포 설정 (총 50개)
const STATUS_DISTRIBUTION: Record<ServerStatus, number> = {
  ok: 35,
  warning: 8,
  critical: 4,
  inactive: 3,
};

const OS_DISTRIBUTION: Record<OSType, number> = {
  Linux: 30,
  Windows: 12,
  AIX: 4,
  'HP-UX': 2,
  Solaris: 2,
  Unknown: 0,
};

// =============================================================================
// Mock Data Generator
// =============================================================================

function generateMockServers(): Server[] {
  const servers: Server[] = [];
  let oid = 1;

  // OS 분포에 따라 서버 생성
  for (const [osType, count] of Object.entries(OS_DISTRIBUTION)) {
    if (count === 0) {
      continue;
    }

    for (let i = 0; i < count; i++) {
      const serverTypeIndex = Math.floor(Math.random() * SERVER_TYPES.length);
      const serverType = SERVER_TYPES[serverTypeIndex] ?? 'web';
      const regionIndex = Math.floor(Math.random() * CLOUD_REGIONS.length);
      const groupIndex = Math.floor(Math.random() * DEFAULT_GROUPS.length);
      const coresIndex = Math.floor(Math.random() * CORES_OPTIONS.length);
      const defaultGroup = DEFAULT_GROUPS[groupIndex] ?? 'production';
      const cloudRegion = CLOUD_REGIONS[regionIndex] ?? 'ap-northeast-2';
      const cores = CORES_OPTIONS[coresIndex] ?? 4;

      const server: Server = {
        oid,
        hostname: `${serverType}-${defaultGroup.slice(0, 4)}-${String(oid).padStart(2, '0')}`,
        ip: `10.0.${Math.floor(oid / 256)}.${oid % 256}`,
        status: 'ok', // 임시로 ok 설정, 아래에서 분포에 맞게 조정
        osType: osType as OSType,
        serverType,
        cores,
        defaultGroup,
        cloudRegion,
      };
      if (osType === 'Linux') {
        server.OSVersion = 'Ubuntu 22.04';
      } else if (osType === 'Windows') {
        server.OSVersion = 'Server 2022';
      }
      servers.push(server);

      oid++;
    }
  }

  // 상태 분포 적용
  let statusIndex = 0;
  for (const [status, count] of Object.entries(STATUS_DISTRIBUTION)) {
    for (let i = 0; i < count && statusIndex < servers.length; i++) {
      const server = servers[statusIndex];
      if (server) {
        server.status = status as ServerStatus;
      }
      statusIndex++;
    }
  }

  // 셔플하여 상태가 고르게 분포되도록 함
  for (let i = servers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = servers[i];
    const swapTarget = servers[j];
    if (temp && swapTarget) {
      servers[i] = swapTarget;
      servers[j] = temp;
    }
  }

  return servers;
}

// 캐시된 Mock 서버 데이터
let cachedServers: Server[] | null = null;

function getMockServers(): Server[] {
  if (!cachedServers) {
    cachedServers = generateMockServers();
  }
  return cachedServers;
}

// =============================================================================
// Grouping Utilities
// =============================================================================

function calculateGroupSummary(servers: Server[]): GroupSummary {
  return {
    total: servers.length,
    active: servers.filter((s) => s.status !== 'inactive').length,
    warning: servers.filter((s) => s.status === 'warning').length,
    critical: servers.filter((s) => s.status === 'critical').length,
    warningEventCount: servers.filter((s) => s.status === 'warning').length,
    criticalEventCount: servers.filter((s) => s.status === 'critical').length,
  };
}

function getServerFieldValue(server: Server, key: GroupOptionKey): string {
  switch (key) {
    case 'OSType':
      return server.osType;
    case 'serverType':
      return server.serverType;
    case 'defaultGroup':
      return server.defaultGroup ?? 'Ungrouped';
    case 'cloudRegion':
      return server.cloudRegion ?? 'Unknown';
    case 'OSVersion':
      return server.OSVersion ?? 'Unknown';
    case 'model':
      return server.model ?? 'Unknown';
    case 'hwSerial':
      return server.hwSerial ?? 'Unknown';
    case 'csp':
      return server.csp ?? 'Unknown';
    case 'cloudInstanceType':
      return server.cloudInstanceType ?? 'Unknown';
    default:
      return 'Unknown';
  }
}

function groupServers(
  servers: Server[],
  group1?: GroupOptionKey | null,
  group2?: GroupOptionKey | null,
): ServerGroup[] {
  // 그룹화 없음
  if (!group1) {
    return [
      {
        key: 'all',
        name: '전체',
        servers,
        groups: [],
        summary: calculateGroupSummary(servers),
      },
    ];
  }

  // 1차 그룹화
  const grouped = new Map<string, Server[]>();
  for (const server of servers) {
    const value = getServerFieldValue(server, group1);
    if (!grouped.has(value)) {
      grouped.set(value, []);
    }
    grouped.get(value)!.push(server);
  }

  // ServerGroup 배열 생성
  const result: ServerGroup[] = [];
  for (const [name, groupServers] of grouped) {
    if (!group2) {
      // 2차 그룹화 없음
      result.push({
        key: group1,
        name,
        servers: groupServers,
        groups: [],
        summary: calculateGroupSummary(groupServers),
      });
    } else {
      // 2차 그룹화 적용
      const subGroups = groupServers.reduce((acc, server) => {
        const subValue = getServerFieldValue(server, group2);
        if (!acc.has(subValue)) {
          acc.set(subValue, []);
        }
        acc.get(subValue)!.push(server);
        return acc;
      }, new Map<string, Server[]>());

      const subGroupArray: ServerGroup[] = [];
      for (const [subName, subServers] of subGroups) {
        subGroupArray.push({
          key: group2,
          name: subName,
          servers: subServers,
          groups: [],
          summary: calculateGroupSummary(subServers),
        });
      }

      result.push({
        key: group1,
        name,
        servers: [],
        groups: subGroupArray,
        summary: calculateGroupSummary(groupServers),
      });
    }
  }

  return result;
}

// =============================================================================
// Mock Hooks
// =============================================================================

export interface UseServerMockDataOptions {
  /** 그룹화 기준 1 */
  group1?: GroupOptionKey | null;
  /** 그룹화 기준 2 */
  group2?: GroupOptionKey | null;
}

export interface UseServerMockDataReturn {
  /** 서버 그룹 목록 (그룹화 적용) */
  data: ServerGroup[];
  /** 원본 서버 목록 */
  servers: Server[];
  /** 로딩 상태 */
  isLoading: boolean;
  /** 에러 */
  error: Error | null;
}

/**
 * 서버 Mock 데이터 훅
 */
export function useServerMockData(options: UseServerMockDataOptions = {}): UseServerMockDataReturn {
  const { group1 = null, group2 = null } = options;

  const servers = useMemo(() => getMockServers(), []);

  const data = useMemo(() => groupServers(servers, group1, group2), [servers, group1, group2]);

  return {
    data,
    servers,
    isLoading: false,
    error: null,
  };
}

export interface UseProjectSummaryMockDataReturn {
  /** 프로젝트 요약 */
  data: ProjectSummary;
  /** 로딩 상태 */
  isLoading: boolean;
  /** 에러 */
  error: Error | null;
}

/**
 * 프로젝트 요약 Mock 데이터 훅
 */
export function useProjectSummaryMockData(): UseProjectSummaryMockDataReturn {
  const servers = useMemo(() => getMockServers(), []);

  const data = useMemo<ProjectSummary>(() => {
    const byOSMap = new Map<OSType, OSSummary>();

    for (const server of servers) {
      const existing = byOSMap.get(server.osType);
      if (existing) {
        existing.total += 1;
        existing.active += server.status !== 'inactive' ? 1 : 0;
        existing.totalCore += server.cores;
      } else {
        byOSMap.set(server.osType, {
          label: server.osType,
          total: 1,
          active: server.status !== 'inactive' ? 1 : 0,
          totalCore: server.cores,
        });
      }
    }

    return {
      total: servers.length,
      active: servers.filter((s) => s.status !== 'inactive').length,
      totalCore: servers.reduce((sum, s) => sum + s.cores, 0),
      byOS: Array.from(byOSMap.values()).sort((a, b) => b.total - a.total),
    };
  }, [servers]);

  return {
    data,
    isLoading: false,
    error: null,
  };
}
