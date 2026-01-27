# Research: Workspace APM Overview Dashboard

**Date**: 2026-01-08
**Branch**: `001-ws-overview-dashboard`

## 1. Design System Components

### Decision: @whatap/design-system 컴포넌트 활용

**Rationale**: 프로젝트 표준 디자인 시스템을 사용하여 일관된 UI 제공 및 유지보수성 향상

### 사용할 컴포넌트

| 위젯 | 컴포넌트 | 용도 |
|------|---------|------|
| 요약 카드 | `Box`, `FlexBox`, `Typography` | 카드 레이아웃, 텍스트 표시 |
| Agent 테이블 | `WhatapTable`, `Column` | 에이전트 목록 (TanStack Table 기반) |
| 상태 표시 | `Tag` (color: green/orange/red) | 정상/경고/위험 상태 |
| 아이콘 | `Icon` (check-circle-filled, warning, alert 등) | 상태 아이콘 |
| 프로그레스 바 | 커스텀 구현 (Box + CSS) | 사용률 표시 (디자인 시스템에 없음) |
| 버튼/링크 | `Button` | 액션, 네비게이션 |

### WhatapTable 사용법

```typescript
import { WhatapTable, Column } from '@fsd/common/6_shared/components/WhatapTable';

// 기본 사용
<WhatapTable
  data={agentData}
  getRowId={(row) => `${row.oid}`}
  enableSorting
>
  <Column<AgentStatusItem> header="Agent Name" accessorKey="name" />
  <Column<AgentStatusItem> header="Location" accessorKey="location" />
  <Column<AgentStatusItem>
    header="Load"
    accessorKey="load"
    render={({ load }) => <span>{load}%</span>}
  />
  <Column<AgentStatusItem>
    header="Status"
    accessorKey="status"
    render={({ status }) => <Tag color={statusColorMap[status]}>{status}</Tag>}
  />
</WhatapTable>
```

**주요 Props:**
- `data`: 테이블 데이터 배열
- `getRowId`: 행 고유 ID 반환 함수
- `enableSorting`: 정렬 기능 활성화
- `enableColumnResizing`: 컬럼 리사이징 활성화
- `isLoading`: 로딩 상태
- `renderNoData`: 데이터 없음 렌더링
- `onRowClick`: 행 클릭 핸들러

### Semantic Color Tokens

```
- event_good_3: 정상 상태 (녹색)
- event_warning_3: 경고 상태 (주황색)
- event_critical_3: 위험 상태 (빨간색)
- background_surface: 카드 배경
- font_common_default: 기본 텍스트
- font_common_secondary: 보조 텍스트
```

### Spacing Tokens

```
- space_xs (8px): 작은 간격
- space_s (12px): 요소 내부 간격
- space_m (16px): 카드 패딩
- space_l (20px): 섹션 간격
- space_xl (24px): 큰 섹션 간격
```

---

## 2. Query & Hook Patterns

### Decision: TanStack Query + createQueryKeys 패턴

**Rationale**: 프로젝트 표준 패턴 준수, 캐시 관리 및 실시간 갱신 지원

### Query Key 정의 패턴

```typescript
// overview/api/queries.ts
import { generateFactoryKey, queryKeyBuilder } from '@fsd/common/6_shared/api';
import { createQueryKeys } from '@lukemorales/query-key-factory';

export const overviewQueryKeys = createQueryKeys(generateFactoryKey('workspace-overview'), {
  healthSummary: (params: OverviewApiParams) => ({
    queryKey: queryKeyBuilder({ endpoint: '/api/health/summary', params }),
    queryFn: () => getHealthSummaryMock(params),  // Mock → 실제 API로 교체
  }),
  // ...
});
```

### Hook 패턴

```typescript
// hooks/useHealthSummary.ts
export function useHealthSummary(params: OverviewApiParams, options?: { enabled?: boolean }) {
  const { data, isLoading, error, refetch } = useQuery({
    ...overviewQueryKeys.healthSummary(params),
    enabled: options?.enabled !== false && Boolean(params.wsid),
    refetchInterval: 5000,  // 5초 갱신
  });

  return {
    data: data?.type === 'SUCCESS' ? data.data : null,
    isLoading,
    error: data?.type === 'FAILURE' ? data : null,
    refetch,
  };
}
```

### 응답 타입 패턴

```typescript
type ApiSuccessResponse<T> = { type: 'SUCCESS'; data: T };
type ApiFailureResponse = { type: 'FAILURE'; msg: string; code: number };
type ApiResult<T> = ApiSuccessResponse<T> | ApiFailureResponse;
```

---

## 3. Mock Data Strategy

### Decision: Mock 함수로 개발 후 실제 API로 교체

**Rationale**: API 준비 전에도 UI 개발 가능, 테스트 용이

### Mock 파일 구조

```
overview/
├── api/
│   ├── queries.ts           # Query keys with mock functions
│   └── mocks/
│       ├── health-summary.mock.ts
│       ├── agent-status.mock.ts
│       ├── performance-metrics.mock.ts
│       ├── resource-usage.mock.ts
│       ├── time-series.mock.ts
│       ├── alerts.mock.ts
│       └── risk-services.mock.ts
```

### Mock 함수 패턴

```typescript
// mocks/health-summary.mock.ts
export async function getHealthSummaryMock(
  params: OverviewApiParams
): Promise<ApiResult<HealthSummaryResponse>> {
  await new Promise((resolve) => setTimeout(resolve, 300));  // 네트워크 지연 시뮬레이션

  return {
    type: 'SUCCESS',
    data: {
      status: 'normal',
      percentage: 98.5,
      label: '정상',
    },
  };
}
```

---

## 4. Chart Implementation

### Decision: ChartWrapperV2 (LineChartV2) 사용

**Rationale**: 프로젝트 표준 차트 라이브러리, 실시간 데이터 지원

### 시계열 차트 데이터 형식

```typescript
interface SeriesDataObject {
  id: string;
  data: Array<[number, number]>;  // [[timestamp, value], ...]
  name?: string;
  color?: string;
}
```

### 차트 옵션

```typescript
const chartOptions = {
  common: {
    postRender: { startTime: stime, endTime: etime },
    area: true,  // 면적 채우기
  },
  xAxis: {
    isLive: true,
    tick: { format: (time: number) => dayjs(time).format('HH:mm') },
  },
  yAxis: {
    integerOnly: true,
    minValue: 0,
  },
  tooltip: { selectAll: true },
};
```

### 사용 예시

```typescript
<ChartWrapperV2
  type="LineChartV2"
  data={tpsChartData}
  options={chartOptions}
/>
```

---

## 5. Project Structure

### Decision: FSD 아키텍처 내 workspace 도메인에 구현

```
apps/whatap-front/src/fsd/workspace/
├── 2_pages/
│   └── WsOverviewPage/
│       ├── WsOverviewPage.tsx
│       └── index.ts
├── 3_widgets/
│   └── overview-dashboard/
│       ├── HealthSummaryCard/
│       ├── AgentSummaryCard/
│       ├── PerformanceMetricsCard/
│       ├── ResourceUsageCard/
│       ├── TimeSeriesCharts/
│       ├── TopAlertsCard/
│       └── RiskServicesCard/
├── 5_entities/
│   └── overview/
│       ├── api/
│       │   ├── queries.ts
│       │   └── mocks/
│       ├── hooks/
│       │   ├── useHealthSummary.ts
│       │   ├── useAgentStatus.ts
│       │   ├── usePerformanceMetrics.ts
│       │   ├── useResourceUsage.ts
│       │   ├── useTimeSeries.ts
│       │   ├── useTopAlerts.ts
│       │   └── useRiskServices.ts
│       └── types/
│           └── api-types.ts
```

---

## 6. Styling Approach

### Decision: PandaCSS 사용 (styled-components 금지)

**Rationale**: 프로젝트 표준, 빌드 타임 CSS-in-JS

### 패턴

```typescript
// 정적 스타일
import { css } from '@fsd/common/6_shared/styled-system/css';

<Box className={css({ padding: 'space_m', borderRadius: 'radius_4' })}>

// 조건부 스타일 (cva 패턴)
import { cva } from '@fsd/common/6_shared/styled-system/css';

const statusStyle = cva({
  base: { padding: 'space_xs', borderRadius: 'radius_2' },
  variants: {
    status: {
      normal: { backgroundColor: 'event_good_3' },
      warning: { backgroundColor: 'event_warning_3' },
      critical: { backgroundColor: 'event_critical_3' },
    },
  },
});

<Box className={statusStyle({ status: 'normal' })}>
```

---

## 7. Alternatives Considered

### UI Components
- **Rejected**: 커스텀 UI 컴포넌트 직접 개발
- **Reason**: 디자인 시스템 활용으로 일관성 유지 및 개발 시간 단축

### State Management
- **Rejected**: Redux/Redux-Saga
- **Reason**: TanStack Query가 서버 상태 관리에 더 적합, 프로젝트 마이그레이션 방향

### Chart Library
- **Rejected**: recharts, Chart.js, ApexCharts
- **Reason**: 프로젝트 자체 Canvas 차트 라이브러리 사용 중

### Styling
- **Rejected**: styled-components
- **Reason**: 프로젝트에서 금지됨, PandaCSS로 표준화

---

## 8. Implementation Notes

### 실시간 데이터 갱신
- `refetchInterval: 5000` 옵션으로 5초마다 자동 갱신
- 페이지 이탈 시 자동 정리 (TanStack Query 기본 동작)

### 에러 처리
- `withQueryAsyncBoundary` HOC로 Suspense + ErrorBoundary 적용
- 개별 위젯별 로딩/에러 상태 처리

### 성능 최적화
- 각 위젯별 독립적인 쿼리로 부분 갱신
- `useDeferredValue` 활용하여 UI 블로킹 방지

### 접근성
- 시맨틱 컬러 토큰으로 색상 대비 보장
- Icon에 적절한 aria-label 제공
