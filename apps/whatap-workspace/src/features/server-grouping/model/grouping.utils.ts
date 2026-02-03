/**
 * Server Grouping Utility Functions
 * @description 서버 그룹화 로직
 */
import type { GroupOptionKey, GroupSummary, Server, ServerGroup } from '@/entities/server';

/**
 * 서버 필드 값 추출
 */
export function getServerFieldValue(server: Server, key: GroupOptionKey): string {
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

/**
 * 그룹 요약 계산
 */
export function calculateGroupSummary(servers: Server[]): GroupSummary {
  return {
    total: servers.length,
    active: servers.filter((s) => s.status !== 'inactive').length,
    warning: servers.filter((s) => s.status === 'warning').length,
    critical: servers.filter((s) => s.status === 'critical').length,
    warningEventCount: servers.filter((s) => s.status === 'warning').length,
    criticalEventCount: servers.filter((s) => s.status === 'critical').length,
  };
}

/**
 * 서버 그룹화
 * @param servers 서버 목록
 * @param group1 1차 그룹화 기준
 * @param group2 2차 그룹화 기준 (선택)
 * @returns 그룹화된 서버 목록
 */
export function groupServers(
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
    const existing = grouped.get(value);
    if (existing) {
      existing.push(server);
    } else {
      grouped.set(value, [server]);
    }
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
      const subGroups = new Map<string, Server[]>();
      for (const server of groupServers) {
        const subValue = getServerFieldValue(server, group2);
        const existing = subGroups.get(subValue);
        if (existing) {
          existing.push(server);
        } else {
          subGroups.set(subValue, [server]);
        }
      }

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

  // 이름순 정렬
  return result.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * 그룹 ID 생성
 */
export function getGroupId(group: ServerGroup, parentName?: string): string {
  return parentName ? `${parentName}::${group.name}` : group.name;
}

/**
 * 모든 그룹 ID 추출
 */
export function getAllGroupIds(groups: ServerGroup[]): string[] {
  const ids: string[] = [];
  for (const group of groups) {
    ids.push(getGroupId(group));
    for (const subGroup of group.groups) {
      ids.push(getGroupId(subGroup, group.name));
    }
  }
  return ids;
}
