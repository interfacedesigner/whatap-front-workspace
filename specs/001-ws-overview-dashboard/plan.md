# Implementation Plan: Workspace APM Overview Dashboard

**Branch**: `001-ws-overview-dashboard` | **Date**: 2026-01-08 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-ws-overview-dashboard/spec.md`

## Summary

워크스페이스 APM 모니터링 대시보드 구현. 실시간으로 에이전트 상태, 성능 지표(TPS, Error Rate, Avg Response), 리소스 사용률(CPU, Memory, 동시 사용자), 알림 현황을 한눈에 보여주는 Overview 페이지.

**기술 접근법**:
- @whatap/design-system 컴포넌트 적극 활용
- TanStack Query + createQueryKeys 패턴으로 데이터 관리
- Mock 데이터로 개발 후 실제 API 연동
- PandaCSS로 스타일링 (styled-components 금지)
- 5초 간격 실시간 데이터 갱신

## Technical Context

**Language/Version**: TypeScript 5.5, React 18.3
**Primary Dependencies**: TanStack Query 5.84, @whatap/design-system, PandaCSS 0.50
**Storage**: N/A (서버 상태만 사용)
**Testing**: Jest + React Testing Library
**Target Platform**: Web (Chrome, Firefox, Safari, Edge)
**Project Type**: Web application (monorepo)
**Performance Goals**: 페이지 로드 3초 이내, 5초 실시간 갱신
**Constraints**: styled-components 금지, FSD 아키텍처 준수
**Scale/Scope**: 10개 위젯, 9개 API 훅, 7개 Mock 데이터 파일

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Status | Notes |
|------|--------|-------|
| Design System Usage | PASS | @whatap/design-system 컴포넌트 활용 |
| No styled-components | PASS | PandaCSS만 사용 |
| FSD Architecture | PASS | workspace 도메인 내 적절한 레이어 배치 |
| TanStack Query Pattern | PASS | createQueryKeys + useQuery 패턴 준수 |
| Mock Data Strategy | PASS | API 미준비 시 Mock 함수로 대체 |

## Project Structure

### Documentation (this feature)

```text
specs/001-ws-overview-dashboard/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Phase 0 output - 기술 조사 결과
├── data-model.md        # Phase 1 output - 데이터 모델 정의
├── quickstart.md        # Phase 1 output - 빠른 시작 가이드
├── contracts/           # Phase 1 output - API 계약
│   └── overview-api.yaml
├── checklists/          # Quality checklists
│   └── requirements.md
└── tasks.md             # Phase 2 output (NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
apps/whatap-front/src/fsd/workspace/
└── 2_pages/
    └── WsOverviewPage/
        ├── WsOverviewPage.tsx           # 메인 페이지 컴포넌트
        ├── index.ts
        │
        ├── components/                   # 위젯 컴포넌트
        │   ├── HealthSummaryCard/
        │   │   ├── HealthSummaryCard.tsx
        │   │   ├── HealthSummaryCard.stories.tsx
        │   │   └── index.ts
        │   ├── AgentSummaryCard/
        │   ├── AlertSummaryCard/
        │   ├── AgentStatusTable/
        │   ├── PerformanceMetricsCard/
        │   ├── ResourceUsageCard/
        │   ├── TimeSeriesCharts/
        │   ├── TopAlertsCard/
        │   ├── RiskServicesCard/
        │   └── index.ts
        │
        ├── hooks/                        # 데이터 훅
        │   ├── useHealthSummary.ts
        │   ├── useAgentSummary.ts
        │   ├── useAgentStatus.ts
        │   ├── useAlertSummary.ts
        │   ├── usePerformanceMetrics.ts
        │   ├── useResourceUsage.ts
        │   ├── useTimeSeries.ts
        │   ├── useTopAlerts.ts
        │   ├── useRiskServices.ts
        │   └── index.ts
        │
        ├── api/                          # API 관련
        │   ├── queries.ts
        │   └── mocks/
        │       ├── health-summary.mock.ts
        │       ├── agent-summary.mock.ts
        │       ├── agent-status.mock.ts
        │       ├── alert-summary.mock.ts
        │       ├── performance-metrics.mock.ts
        │       ├── resource-usage.mock.ts
        │       ├── time-series.mock.ts
        │       ├── top-alerts.mock.ts
        │       └── risk-services.mock.ts
        │
        └── types/                        # 타입 정의
            └── api-types.ts
```

**Structure Decision**: 모든 코드를 `2_pages/WsOverviewPage` 하위에 colocate. 추후 재사용 필요 시 3_widgets, 5_entities로 분리 가능.

## Implementation Phases

### Phase 1: Foundation (Types & Mock Data)

1. **타입 정의** (`2_pages/WsOverviewPage/types/api-types.ts`)
   - 공통 API 파라미터/응답 타입
   - 각 위젯별 데이터 타입

2. **Mock 데이터 함수** (`2_pages/WsOverviewPage/api/mocks/`)
   - 이미지 기반 샘플 데이터 구현
   - 네트워크 지연 시뮬레이션 (300ms)

3. **Query Keys 정의** (`2_pages/WsOverviewPage/api/queries.ts`)
   - createQueryKeys 패턴
   - Mock 함수 연결

### Phase 2: Data Layer (Hooks)

1. **Custom Hooks 구현** (`2_pages/WsOverviewPage/hooks/`)
   - useHealthSummary
   - useAgentSummary / useAgentStatus
   - useAlertSummary
   - usePerformanceMetrics
   - useResourceUsage
   - useTimeSeries
   - useTopAlerts
   - useRiskServices

2. **실시간 갱신 설정**
   - refetchInterval: 5000 (5초)
   - enabled 조건 처리

### Phase 3: UI Layer (Components)

위치: `2_pages/WsOverviewPage/components/`

1. **Summary Cards** (P1)
   - HealthSummaryCard
   - AgentSummaryCard
   - AlertSummaryCard

2. **Detail Widgets** (P1)
   - AgentStatusTable
   - PerformanceMetricsCard

3. **Resource Widgets** (P2)
   - ResourceUsageCard (CPU, Memory, 동시 사용자)
   - 커스텀 ProgressBar 컴포넌트

4. **Chart Widgets** (P2)
   - TimeSeriesCharts (TPS, Agent, Error)
   - ChartWrapperV2 + LineChartV2 활용

5. **List Widgets** (P2)
   - TopAlertsCard
   - RiskServicesCard

### Phase 4: Integration (Page)

1. **WsOverviewPage 리팩토링**
   - 기존 코드 제거
   - 새 위젯들 조합
   - 레이아웃 구성

2. **라우터 연결 확인**
   - withQueryAsyncBoundary 적용
   - 로딩/에러 상태 처리

### Phase 5: Quality Assurance

1. **Storybook**
   - 각 위젯별 스토리 작성
   - 다양한 상태 시나리오

2. **테스트**
   - Hook 유닛 테스트
   - 컴포넌트 렌더링 테스트

## Key Design Decisions

### 1. 위젯별 독립 쿼리

각 위젯이 자체 쿼리를 관리하여:
- 부분 갱신 가능
- 에러 격리
- 로딩 상태 개별 처리

### 2. Mock → API 전환 전략

```typescript
// queries.ts에서 한 줄만 변경
queryFn: () => getHealthSummaryMock(params),  // Mock
queryFn: () => getHealthSummary({ params }),  // Real API
```

### 3. 디자인 시스템 활용

| 위젯 | 주요 컴포넌트 |
|------|-------------|
| 요약 카드 | Box, FlexBox, Typography, Icon |
| 테이블 | WhatapTable, Column (`@fsd/common/6_shared/components/WhatapTable`) |
| 상태 표시 | Tag (color variants) |
| 차트 | ChartWrapperV2 (LineChartV2) |

### 4. 스타일링 규칙

```typescript
import { css, cva } from '@fsd/common/6_shared/styled-system/css';
```

- 정적 스타일: `css()` 함수
- 조건부 스타일: `cva()` variants 패턴
- 시맨틱 토큰 사용: event_good_3, event_warning_3, event_critical_3

## UI Design Specification

### 전체 레이아웃

```
┌─────────────────────────────────────────────────────────────────────────┐
│ 모니터링 Overview                                    ↻ 실시간 업데이트   │
│ 실시간 시스템 상태 및 성능 지표                                          │
├─────────────────────────┬─────────────────────────┬─────────────────────┤
│ 전체 Health             │ 활성 Agent              │ 현재 Alert          │
│ 정상 98.5%         ✓    │ 24 / 28           📊   │ 3 / 중요       ⚠    │
│ ████████████████████    │ 85.7% 활성화            │ 주의 필요            │
├─────────────────────────┴───────────────┬─────────┴─────────────────────┤
│ Agent 상태 요약                    총 24개 활성 │ 성능 지표                    │
│ ┌────────────┬────────┬────────┐        │ TPS        1,247 req/s  +12%  │
│ │ agent-01   │ Seoul  │ 78%    │        │ Error Rate 0.2%         -0.1% │
│ │ agent-02   │ Seoul  │ 45%    │        │ Avg Response 124ms      -8ms  │
│ │ agent-03   │ Busan  │ 92%    │        │                               │
│ └────────────┴────────┴────────┘        │                               │
├─────────────────────────┬───────────────┴───────────────┬───────────────┤
│ CPU 사용률              │ Memory 사용률                 │ 동시 사용자     │
│ 67%                     │ 54%                           │ 1,842          │
│ ████████████░░░░░       │ ██████████░░░░░░░             │                │
│ 전일 +2.3%              │ 전일 -0.8%                    │ 전일 +142      │
├─────────────────────────┼───────────────────────────────┼───────────────┤
│ TPS 추이 (24시간)       │ Agent 활성 추이               │ Error 추이     │
│ 📈 Line Chart           │ 📈 Line Chart                 │ 📈 Line Chart  │
├─────────────────────────┴───────────────────────────────┴───────────────┤
│ Top Alerts                                    ⚠ 3개 활성                │
│ ● API Gateway      High response time detected               2분 전     │
│ ● Database-01      Connection pool near limit                15분 전    │
│ ● Auth Service     Increased failed login attempts           23분 전    │
├─────────────────────────────────────────────────────────────────────────┤
│ Risk Services                                 ⚠ 3개 위험                │
│ Payment Service    CPU 임계값 초과    ████████████████░░  94%   위험    │
│ Search Index       Memory 사용량 증가  █████████████████░  87%   중간    │
│ File Storage       Disk 공간 부족      ████████████████░░  82%   중간    │
└─────────────────────────────────────────────────────────────────────────┘
```

### 색상 토큰

| 용도 | 토큰 | 설명 |
|------|------|------|
| 정상 상태 | `event_good_3` | 녹색 (#52c41a) |
| 경고 상태 | `event_warning_3` | 주황색 (#faad14) |
| 위험 상태 | `event_critical_3` | 빨간색 (#ff4d4f) |
| 카드 배경 | `background_surface` | 흰색/밝은 회색 |
| 페이지 배경 | `background_page` | 연한 회색 |
| 기본 텍스트 | `font_common_default` | 검정/진한 회색 |
| 보조 텍스트 | `font_common_secondary` | 회색 |
| 변화량 증가 | `event_good_3` | 녹색 (긍정적) |
| 변화량 감소 | `event_critical_3` | 빨간색 (부정적) |

### 간격 토큰

| 용도 | 토큰 | 값 |
|------|------|-----|
| 카드 내부 패딩 | `space_m` | 16px |
| 카드 간 간격 | `space_m` | 16px |
| 섹션 간 간격 | `space_l` | 20px |
| 요소 내 간격 | `space_xs` | 8px |
| 텍스트 간 간격 | `space_2xs` | 6px |

### 타이포그래피

| 용도 | level | 예시 |
|------|-------|------|
| 페이지 제목 | `h1` | "모니터링 Overview" |
| 카드 제목 | `sub_3_normal` | "전체 Health" |
| 큰 숫자 | `h2` | "정상", "24 / 28" |
| 메트릭 값 | `body_l_5_bold` | "1,247" |
| 단위/부가정보 | `body_s_5_normal` | "req/s", "98.5%" |
| 변화량 | `sub_3_normal` | "+12%", "-0.1%" |

### 카드 스타일

```typescript
const cardStyle = css({
  padding: 'space_m',
  borderRadius: 'radius_4',
  backgroundColor: 'background_surface',
  border: '1px solid',
  borderColor: 'border_common_2',
});
```

### 프로그레스 바 (커스텀)

```typescript
const progressBarStyle = cva({
  base: {
    height: '8px',
    borderRadius: 'radius_2',
    backgroundColor: 'background_disabled',
    overflow: 'hidden',
  },
  variants: {
    status: {
      normal: { '& > div': { backgroundColor: 'event_good_3' } },
      warning: { '& > div': { backgroundColor: 'event_warning_3' } },
      critical: { '& > div': { backgroundColor: 'event_critical_3' } },
    },
  },
});
```

### 그리드 레이아웃

- **Row 1**: Summary Cards (3열, 균등 분할)
- **Row 2**: Agent 상태 + 성능 지표 (2열, 6:4 비율)
- **Row 3**: 리소스 사용률 (3열, 균등 분할)
- **Row 4**: 시계열 차트 (3열, 균등 분할)
- **Row 5**: Top Alerts + Risk Services (2열, 균등 분할)

```typescript
// 페이지 레이아웃
<FlexBox direction="column" gap="space_l" padding="space_l">
  {/* Row 1: Summary Cards */}
  <FlexBox gap="space_m">
    <HealthSummaryCard />
    <AgentSummaryCard />
    <AlertSummaryCard />
  </FlexBox>

  {/* Row 2: Details */}
  <FlexBox gap="space_m">
    <Box className={css({ flex: 3 })}>
      <AgentStatusTable />
    </Box>
    <Box className={css({ flex: 2 })}>
      <PerformanceMetricsCard />
    </Box>
  </FlexBox>

  {/* ... */}
</FlexBox>
```

## Generated Artifacts

| Artifact | Path | Description |
|----------|------|-------------|
| research.md | specs/001-ws-overview-dashboard/research.md | 기술 조사 결과 |
| data-model.md | specs/001-ws-overview-dashboard/data-model.md | 데이터 모델 정의 |
| quickstart.md | specs/001-ws-overview-dashboard/quickstart.md | 빠른 시작 가이드 |
| overview-api.yaml | specs/001-ws-overview-dashboard/contracts/overview-api.yaml | API 계약 (OpenAPI 3.0) |

## Next Steps

1. `/speckit.tasks` 실행하여 상세 태스크 생성
2. 태스크 기반 구현 진행
3. 각 위젯별 Storybook 작성
4. 실제 API 준비 시 Mock 교체

## Complexity Tracking

현재 위반 사항 없음. 모든 구현이 프로젝트 표준을 준수함.
