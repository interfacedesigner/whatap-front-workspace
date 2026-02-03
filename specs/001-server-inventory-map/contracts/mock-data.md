# Mock Data Contracts

**Date**: 2026-02-02
**Feature**: 001-server-inventory-map

> **Note**: 이 MVP에서는 실제 API 연동이 없습니다.
> 대신 Mock 데이터 인터페이스를 정의합니다.

## Mock Hook Interfaces

### useServerMockData

서버 목록 Mock 데이터를 제공하는 훅.

```typescript
interface UseServerMockDataOptions {
  /** 그룹화 기준 1 */
  group1?: GroupOptionKey | null;
  /** 그룹화 기준 2 */
  group2?: GroupOptionKey | null;
}

interface UseServerMockDataReturn {
  /** 서버 그룹 목록 (그룹화 적용) */
  data: ServerGroup[];
  /** 로딩 상태 */
  isLoading: boolean;
  /** 에러 */
  error: Error | null;
}

function useServerMockData(options?: UseServerMockDataOptions): UseServerMockDataReturn;
```

### useProjectSummaryMockData

프로젝트 요약 Mock 데이터를 제공하는 훅.

```typescript
interface UseProjectSummaryMockDataReturn {
  /** 프로젝트 요약 */
  data: ProjectSummary;
  /** 로딩 상태 */
  isLoading: boolean;
  /** 에러 */
  error: Error | null;
}

function useProjectSummaryMockData(): UseProjectSummaryMockDataReturn;
```

---

## Mock Data Generation

### 서버 데이터 분포

| 항목 | 값 | 비율 |
|------|-----|------|
| **총 서버 수** | 50 | 100% |
| **상태** | | |
| - ok | 35 | 70% |
| - warning | 8 | 16% |
| - critical | 4 | 8% |
| - inactive | 3 | 6% |
| **OS** | | |
| - Linux | 30 | 60% |
| - Windows | 12 | 24% |
| - AIX | 4 | 8% |
| - HP-UX | 2 | 4% |
| - Solaris | 2 | 4% |
| **서버 타입** | | |
| - web | 15 | 30% |
| - db | 10 | 20% |
| - app | 15 | 30% |
| - batch | 10 | 20% |

### 그룹화 테스트 데이터

| 그룹 기준 | 값 목록 |
|----------|---------|
| serverType | web, db, app, batch |
| OSType | Linux, Windows, AIX, HP-UX, Solaris |
| cloudRegion | ap-northeast-2, us-west-2, eu-west-1 |
| defaultGroup | production, staging, development |

---

## Sample Mock Data

```typescript
const mockServers: Server[] = [
  {
    oid: 1,
    hostname: 'web-prod-01',
    ip: '10.0.1.1',
    status: 'ok',
    osType: 'Linux',
    serverType: 'web',
    cores: 8,
    defaultGroup: 'production',
    cloudRegion: 'ap-northeast-2',
  },
  {
    oid: 2,
    hostname: 'db-prod-01',
    ip: '10.0.1.2',
    status: 'warning',
    osType: 'Linux',
    serverType: 'db',
    cores: 16,
    defaultGroup: 'production',
    cloudRegion: 'ap-northeast-2',
  },
  {
    oid: 3,
    hostname: 'app-prod-01',
    ip: '10.0.1.3',
    status: 'critical',
    osType: 'Windows',
    serverType: 'app',
    cores: 4,
    defaultGroup: 'production',
    cloudRegion: 'us-west-2',
  },
  // ... 47 more servers
];

const mockProjectSummary: ProjectSummary = {
  total: 50,
  active: 47,
  totalCore: 320,
  byOS: [
    { label: 'Linux', active: 28, total: 30, totalCore: 200 },
    { label: 'Windows', active: 12, total: 12, totalCore: 64 },
    { label: 'AIX', active: 4, total: 4, totalCore: 32 },
    { label: 'HP-UX', active: 2, total: 2, totalCore: 16 },
    { label: 'Solaris', active: 1, total: 2, totalCore: 8 },
  ],
};
```

---

## Future API Integration

향후 실제 API 연동 시 참고할 레거시 API 구조:

```typescript
// 레거시 API 엔드포인트 (참고용)
// GET /api/v1/server/inventory/metrics/group-list
// Parameters: pcode, time, group1, group2, filters[]

// Mock 훅을 실제 API 훅으로 교체 시:
// useServerMockData → useSuspenseQuery with real API
```
