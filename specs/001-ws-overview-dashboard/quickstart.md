# Quickstart: Workspace APM Overview Dashboard

**Date**: 2026-01-08
**Branch**: `001-ws-overview-dashboard`

## 1. 개발 환경 설정

```bash
# 저장소 클론 (이미 클론된 경우 생략)
git clone <repository-url>
cd whatap-front-workspace

# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev
```

## 2. 프로젝트 구조

```
apps/whatap-front/src/fsd/workspace/
├── 2_pages/
│   └── WsOverviewPage/
│       ├── WsOverviewPage.tsx        # 메인 페이지 컴포넌트
│       └── index.ts
├── 3_widgets/
│   └── overview-dashboard/
│       ├── HealthSummaryCard/        # 전체 Health 카드
│       ├── AgentSummaryCard/         # Agent 요약 카드
│       ├── AlertSummaryCard/         # Alert 요약 카드
│       ├── AgentStatusTable/         # Agent 상태 테이블
│       ├── PerformanceMetricsCard/   # 성능 지표 카드
│       ├── ResourceUsageCard/        # 리소스 사용률 카드
│       ├── TimeSeriesCharts/         # 시계열 차트 섹션
│       ├── TopAlertsCard/            # Top Alerts 목록
│       └── RiskServicesCard/         # Risk Services 목록
├── 5_entities/
│   └── overview/
│       ├── api/
│       │   ├── queries.ts            # Query Keys 정의
│       │   └── mocks/                # Mock 데이터
│       ├── hooks/
│       │   ├── useHealthSummary.ts
│       │   ├── useAgentSummary.ts
│       │   ├── useAgentStatus.ts
│       │   ├── useAlertSummary.ts
│       │   ├── usePerformanceMetrics.ts
│       │   ├── useResourceUsage.ts
│       │   ├── useTimeSeries.ts
│       │   ├── useTopAlerts.ts
│       │   └── useRiskServices.ts
│       └── types/
│           └── api-types.ts          # 타입 정의
└── 6_shared/
    └── (기존 공유 유틸리티)
```

## 3. 주요 파일 구현 예시

### 3.1 타입 정의

```typescript
// 5_entities/overview/types/api-types.ts
export interface OverviewApiParams {
  wsid: number;
  platform?: number;
  sysid?: number;
  stime?: number;
  etime?: number;
}

export type ApiSuccessResponse<T> = { type: 'SUCCESS'; data: T };
export type ApiFailureResponse = { type: 'FAILURE'; msg: string; code: number };
export type ApiResult<T> = ApiSuccessResponse<T> | ApiFailureResponse;

export interface HealthSummaryResponse {
  status: 'normal' | 'warning' | 'critical';
  percentage: number;
  label: string;
}
// ... 나머지 타입들
```

### 3.2 Mock 데이터

```typescript
// 5_entities/overview/api/mocks/health-summary.mock.ts
import type { ApiResult, HealthSummaryResponse, OverviewApiParams } from '../../types/api-types';

export async function getHealthSummaryMock(
  params: OverviewApiParams
): Promise<ApiResult<HealthSummaryResponse>> {
  await new Promise((resolve) => setTimeout(resolve, 300));

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

### 3.3 Query Keys

```typescript
// 5_entities/overview/api/queries.ts
import { generateFactoryKey, queryKeyBuilder } from '@fsd/common/6_shared/api';
import { createQueryKeys } from '@lukemorales/query-key-factory';
import type { OverviewApiParams } from '../types/api-types';
import { getHealthSummaryMock } from './mocks/health-summary.mock';
// ... 다른 mock imports

export const overviewQueryKeys = createQueryKeys(generateFactoryKey('workspace-overview'), {
  healthSummary: (params: OverviewApiParams) => ({
    queryKey: queryKeyBuilder({ endpoint: '/api/health/summary', params }),
    queryFn: () => getHealthSummaryMock(params),
  }),
  // ... 다른 query keys
});
```

### 3.4 Custom Hook

```typescript
// 5_entities/overview/hooks/useHealthSummary.ts
import { useQuery } from '@tanstack/react-query';
import { overviewQueryKeys } from '../api/queries';
import type { OverviewApiParams, HealthSummaryResponse, ApiFailureResponse } from '../types/api-types';

export function useHealthSummary(params: OverviewApiParams, options?: { enabled?: boolean }) {
  const { data, isLoading, error, refetch } = useQuery({
    ...overviewQueryKeys.healthSummary(params),
    enabled: options?.enabled !== false && Boolean(params.wsid),
    refetchInterval: 5000,
  });

  return {
    data: data?.type === 'SUCCESS' ? data.data : null,
    isLoading,
    error: data?.type === 'FAILURE' ? data : null,
    refetch,
  };
}
```

### 3.5 Widget 컴포넌트

```typescript
// 3_widgets/overview-dashboard/HealthSummaryCard/HealthSummaryCard.tsx
import { Box, FlexBox, Typography, Icon } from '@whatap/design-system';
import { css, cva } from '@fsd/common/6_shared/styled-system/css';
import { useHealthSummary } from '@fsd/workspace/5_entities/overview/hooks/useHealthSummary';

const statusStyle = cva({
  base: { padding: 'space_m', borderRadius: 'radius_4' },
  variants: {
    status: {
      normal: { backgroundColor: 'background_surface' },
      warning: { backgroundColor: 'background_surface' },
      critical: { backgroundColor: 'background_surface' },
    },
  },
});

const iconColorMap = {
  normal: 'event_good_3',
  warning: 'event_warning_3',
  critical: 'event_critical_3',
} as const;

interface Props {
  wsid: number;
}

export function HealthSummaryCard({ wsid }: Props) {
  const { data, isLoading } = useHealthSummary({ wsid });

  if (isLoading) {
    return <Box className={css({ padding: 'space_m' })}>Loading...</Box>;
  }

  if (!data) {
    return null;
  }

  return (
    <Box className={statusStyle({ status: data.status })}>
      <FlexBox direction="row" justifyContent="space-between" alignItems="center">
        <FlexBox direction="column" gap="space_xs">
          <Typography level="sub_3_normal" color="font_common_secondary">
            전체 Health
          </Typography>
          <FlexBox direction="row" alignItems="baseline" gap="space_xs">
            <Typography level="h2" color="font_common_primary">
              {data.label}
            </Typography>
            <Typography level="body_s_5_normal" color="font_common_secondary">
              {data.percentage}%
            </Typography>
          </FlexBox>
        </FlexBox>
        <Icon
          name="check-circle-filled"
          size="big"
          color={iconColorMap[data.status]}
        />
      </FlexBox>
    </Box>
  );
}
```

### 3.6 Page 컴포넌트

```typescript
// 2_pages/WsOverviewPage/WsOverviewPage.tsx
import { ErrorFallback } from '@fsd/common/6_shared/components';
import Loading from '@fsd/common/6_shared/components/Loading';
import { withQueryAsyncBoundary } from '@fsd/common/6_shared/error-boundary';
import { css } from '@fsd/common/6_shared/styled-system/css';
import { FlexBox, Box, Typography, Icon } from '@whatap/design-system';
import { useParams } from 'react-router-dom';

import { HealthSummaryCard } from '@fsd/workspace/3_widgets/overview-dashboard/HealthSummaryCard';
import { AgentSummaryCard } from '@fsd/workspace/3_widgets/overview-dashboard/AgentSummaryCard';
import { AlertSummaryCard } from '@fsd/workspace/3_widgets/overview-dashboard/AlertSummaryCard';
// ... 다른 widget imports

function WsOverviewPage() {
  const params = useParams<{ wsid?: string }>();
  const wsid = params.wsid ? Number(params.wsid) : undefined;

  if (!wsid) {
    return <div>Invalid workspace ID</div>;
  }

  return (
    <FlexBox direction="column" gap="space_l" padding="space_l">
      {/* Header */}
      <FlexBox direction="row" justifyContent="space-between" alignItems="center">
        <FlexBox direction="column" gap="space_2xs">
          <Typography level="h1">모니터링 Overview</Typography>
          <Typography level="sub_3_normal" color="font_common_secondary">
            실시간 시스템 상태 및 성능 지표
          </Typography>
        </FlexBox>
        <FlexBox direction="row" alignItems="center" gap="space_xs">
          <Icon name="refresh" size="small" color="font_common_secondary" />
          <Typography level="sub_3_normal" color="font_common_secondary">
            실시간 업데이트
          </Typography>
        </FlexBox>
      </FlexBox>

      {/* Summary Cards */}
      <FlexBox direction="row" gap="space_m" wrap="wrap">
        <HealthSummaryCard wsid={wsid} />
        <AgentSummaryCard wsid={wsid} />
        <AlertSummaryCard wsid={wsid} />
      </FlexBox>

      {/* Agent Status & Performance */}
      <FlexBox direction="row" gap="space_m">
        <AgentStatusTable wsid={wsid} />
        <PerformanceMetricsCard wsid={wsid} />
      </FlexBox>

      {/* Resource Usage */}
      <FlexBox direction="row" gap="space_m">
        <ResourceUsageCard wsid={wsid} metric="cpu" />
        <ResourceUsageCard wsid={wsid} metric="memory" />
        <ResourceUsageCard wsid={wsid} metric="concurrentUsers" />
      </FlexBox>

      {/* Time Series Charts */}
      <FlexBox direction="row" gap="space_m">
        <TimeSeriesChart wsid={wsid} chartType="tps" title="TPS 추이 (24시간)" />
        <TimeSeriesChart wsid={wsid} chartType="activeAgents" title="Agent 활성 추이" />
        <TimeSeriesChart wsid={wsid} chartType="errors" title="Error 추이" />
      </FlexBox>

      {/* Alerts & Risk Services */}
      <FlexBox direction="row" gap="space_m">
        <TopAlertsCard wsid={wsid} />
        <RiskServicesCard wsid={wsid} />
      </FlexBox>
    </FlexBox>
  );
}

export default withQueryAsyncBoundary(WsOverviewPage, {
  pendingFallback: <Loading fillAndCenter />,
  rejectedFallbackRender: ({ resetErrorBoundary }) => (
    <ErrorFallback onRetry={resetErrorBoundary} />
  ),
});
```

## 4. 스타일링 가이드

### PandaCSS 사용

```typescript
// 정적 스타일
import { css } from '@fsd/common/6_shared/styled-system/css';

<Box className={css({ padding: 'space_m', borderRadius: 'radius_4' })}>

// 조건부 스타일 (cva)
import { cva } from '@fsd/common/6_shared/styled-system/css';

const cardStyle = cva({
  base: { padding: 'space_m', borderRadius: 'radius_4' },
  variants: {
    status: {
      normal: { borderColor: 'event_good_3' },
      warning: { borderColor: 'event_warning_3' },
      critical: { borderColor: 'event_critical_3' },
    },
  },
});
```

### 디자인 토큰

- **Spacing**: space_xs(8px), space_s(12px), space_m(16px), space_l(20px), space_xl(24px)
- **Colors**: event_good_3, event_warning_3, event_critical_3
- **Typography**: h1, h2, body_m_5_normal, sub_3_normal

## 5. 테스트 실행

```bash
# 단일 테스트 파일 실행
pnpm test -- apps/whatap-front/src/fsd/workspace/5_entities/overview/hooks/useHealthSummary.spec.ts

# 관련 테스트 전체 실행
pnpm test -- --testPathPattern="overview"
```

## 6. 스토리북

```bash
# 스토리북 실행
pnpm storybook

# 각 위젯에 .stories.tsx 파일 작성
# 예: HealthSummaryCard.stories.tsx
```

## 7. 실제 API 연동

Mock 데이터에서 실제 API로 전환할 때:

1. `queries.ts`에서 mock 함수를 실제 API 함수로 교체
2. `ws-api.ts`에 해당 API 함수가 있는지 확인
3. 없으면 OpenAPI 스펙 기반으로 생성

```typescript
// Before (Mock)
queryFn: () => getHealthSummaryMock(params),

// After (Real API)
queryFn: () => getHealthSummary({ params }),
```

## 8. 주의사항

- **styled-components 사용 금지**: PandaCSS만 사용
- **디자인 시스템 컴포넌트 사용**: Box, FlexBox, Typography, Icon, Tag, Table 등
- **FSD 구조 준수**: layer 간 import 규칙 준수
- **실시간 갱신**: refetchInterval 설정으로 5초 자동 갱신
