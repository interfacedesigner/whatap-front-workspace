# Tasks: Workspace APM Overview Dashboard

**Input**: Design documents from `/specs/001-ws-overview-dashboard/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: 명시적 요청 없으므로 테스트 태스크 생략
**Organization**: User Story 기준 구성으로 독립적 구현/테스트 가능

## Format: `[ID] [P?] [Story] Description`

- **[P]**: 병렬 실행 가능 (파일 분리, 의존성 없음)
- **[Story]**: 해당 태스크가 속한 User Story (US1~US7)
- 모든 경로는 `apps/whatap-front/src/fsd/workspace/2_pages/WsOverviewPage/` 기준

## Path Conventions

```text
apps/whatap-front/src/fsd/workspace/2_pages/WsOverviewPage/
├── WsOverviewPage.tsx           # 메인 페이지 컴포넌트
├── index.ts
├── components/                   # 위젯 컴포넌트
├── hooks/                        # 데이터 훅
├── api/                          # queries.ts + mocks/
└── types/                        # api-types.ts
```

---

## Phase 1: Setup (프로젝트 초기화)

**Purpose**: 디렉토리 구조 생성 및 공통 타입/유틸리티 설정

- [ ] T001 Create directory structure: `2_pages/WsOverviewPage/{components,hooks,api/mocks,types}/`
- [ ] T002 [P] Create common API types in `types/api-types.ts` (OverviewApiParams, ApiResult, HealthStatus, AgentStatus, etc.)
- [ ] T003 [P] Create index.ts barrel exports in `2_pages/WsOverviewPage/index.ts`

---

## Phase 2: Foundational (기반 인프라)

**Purpose**: 모든 User Story가 의존하는 Mock 데이터 및 Query Keys 설정

**⚠️ CRITICAL**: 이 Phase 완료 전까지 User Story 작업 불가

- [ ] T004 [P] Create health summary mock in `api/mocks/health-summary.mock.ts`
- [ ] T005 [P] Create agent summary mock in `api/mocks/agent-summary.mock.ts`
- [ ] T006 [P] Create agent status mock in `api/mocks/agent-status.mock.ts`
- [ ] T007 [P] Create alert summary mock in `api/mocks/alert-summary.mock.ts`
- [ ] T008 [P] Create performance metrics mock in `api/mocks/performance-metrics.mock.ts`
- [ ] T009 [P] Create resource usage mock in `api/mocks/resource-usage.mock.ts`
- [ ] T010 [P] Create time series mock in `api/mocks/time-series.mock.ts`
- [ ] T011 [P] Create top alerts mock in `api/mocks/top-alerts.mock.ts`
- [ ] T012 [P] Create risk services mock in `api/mocks/risk-services.mock.ts`
- [ ] T013 Create query keys with mock functions in `api/queries.ts` (depends on T004-T012)

**Checkpoint**: Foundation 완료 - User Story 구현 시작 가능

---

## Phase 3: User Story 1 - 전체 시스템 상태 한눈에 파악 (Priority: P1) 🎯 MVP

**Goal**: 대시보드 접근 시 전체 Health, 활성 Agent, 현재 Alert 요약 카드 표시
**Independent Test**: 페이지 로드 시 3개 요약 카드가 실시간 데이터와 함께 표시되는지 확인

### Hooks for User Story 1

- [ ] T014 [P] [US1] Create useHealthSummary hook in `hooks/useHealthSummary.ts`
- [ ] T015 [P] [US1] Create useAgentSummary hook in `hooks/useAgentSummary.ts`
- [ ] T016 [P] [US1] Create useAlertSummary hook in `hooks/useAlertSummary.ts`

### Components for User Story 1

- [ ] T017 [P] [US1] Create HealthSummaryCard component in `components/HealthSummaryCard/HealthSummaryCard.tsx`
- [ ] T018 [P] [US1] Create HealthSummaryCard.stories.tsx in `components/HealthSummaryCard/`
- [ ] T019 [P] [US1] Create AgentSummaryCard component in `components/AgentSummaryCard/AgentSummaryCard.tsx`
- [ ] T020 [P] [US1] Create AgentSummaryCard.stories.tsx in `components/AgentSummaryCard/`
- [ ] T021 [P] [US1] Create AlertSummaryCard component in `components/AlertSummaryCard/AlertSummaryCard.tsx`
- [ ] T022 [P] [US1] Create AlertSummaryCard.stories.tsx in `components/AlertSummaryCard/`
- [ ] T023 [P] [US1] Create index.ts barrel exports for each summary card component

### Page Integration for User Story 1

- [ ] T024 [US1] Create WsOverviewPage base structure with header in `WsOverviewPage.tsx`
- [ ] T025 [US1] Add summary cards row to WsOverviewPage (HealthSummaryCard, AgentSummaryCard, AlertSummaryCard)
- [ ] T026 [US1] Apply withQueryAsyncBoundary HOC to WsOverviewPage

**Checkpoint**: US1 완료 - 요약 카드 3개 표시 및 실시간 갱신 동작 확인

---

## Phase 4: User Story 2 - Agent 상태 모니터링 (Priority: P1)

**Goal**: 개별 에이전트 상태/부하 확인 테이블 표시
**Independent Test**: Agent 상태 테이블이 에이전트 목록과 Load 값 표시하는지 확인

### Hooks for User Story 2

- [ ] T027 [US2] Create useAgentStatus hook in `hooks/useAgentStatus.ts`

### Components for User Story 2

- [ ] T028 [US2] Create AgentStatusTable component in `components/AgentStatusTable/AgentStatusTable.tsx` (using WhatapTable)
- [ ] T029 [P] [US2] Create AgentStatusTable.stories.tsx in `components/AgentStatusTable/`
- [ ] T030 [P] [US2] Create index.ts for AgentStatusTable component

### Page Integration for User Story 2

- [ ] T031 [US2] Add AgentStatusTable to WsOverviewPage (Row 2, left side)

**Checkpoint**: US2 완료 - Agent 상태 테이블 표시 및 정렬 기능 동작 확인

---

## Phase 5: User Story 3 - 핵심 성능 지표 확인 (Priority: P1)

**Goal**: TPS, Error Rate, Avg Response 성능 지표 + 변화량 표시
**Independent Test**: 성능 지표 위젯이 3개 메트릭을 수치/변화량과 함께 표시하는지 확인

### Hooks for User Story 3

- [ ] T032 [US3] Create usePerformanceMetrics hook in `hooks/usePerformanceMetrics.ts`

### Components for User Story 3

- [ ] T033 [US3] Create PerformanceMetricsCard component in `components/PerformanceMetricsCard/PerformanceMetricsCard.tsx`
- [ ] T034 [P] [US3] Create PerformanceMetricsCard.stories.tsx in `components/PerformanceMetricsCard/`
- [ ] T035 [P] [US3] Create index.ts for PerformanceMetricsCard component

### Page Integration for User Story 3

- [ ] T036 [US3] Add PerformanceMetricsCard to WsOverviewPage (Row 2, right side)

**Checkpoint**: US3 완료 - 성능 지표 3개 표시 및 변화량 색상 표시 확인

---

## Phase 6: User Story 4 - 리소스 사용률 모니터링 (Priority: P2)

**Goal**: CPU, Memory, 동시 사용자 리소스 카드 + 프로그레스 바 표시
**Independent Test**: 리소스 사용률 위젯이 프로그레스 바와 비교 데이터 표시하는지 확인

### Hooks for User Story 4

- [ ] T037 [US4] Create useResourceUsage hook in `hooks/useResourceUsage.ts`

### Components for User Story 4

- [ ] T038 [P] [US4] Create ProgressBar component in `components/shared/ProgressBar/ProgressBar.tsx` (custom, cva pattern)
- [ ] T039 [P] [US4] Create ProgressBar.stories.tsx in `components/shared/ProgressBar/`
- [ ] T040 [US4] Create ResourceUsageCard component in `components/ResourceUsageCard/ResourceUsageCard.tsx` (depends on T038)
- [ ] T041 [P] [US4] Create ResourceUsageCard.stories.tsx in `components/ResourceUsageCard/`
- [ ] T042 [P] [US4] Create index.ts for ResourceUsageCard and ProgressBar components

### Page Integration for User Story 4

- [ ] T043 [US4] Add ResourceUsageCard row to WsOverviewPage (3 cards: CPU, Memory, Concurrent Users)

**Checkpoint**: US4 완료 - 리소스 사용률 3개 카드 표시 및 프로그레스 바 동작 확인

---

## Phase 7: User Story 5 - 시계열 차트로 추이 확인 (Priority: P2)

**Goal**: TPS, Agent, Error 24시간 시계열 라인 차트 표시
**Independent Test**: 3개 시계열 차트가 24시간 데이터를 라인 차트로 표시하는지 확인

### Hooks for User Story 5

- [ ] T044 [US5] Create useTimeSeries hook in `hooks/useTimeSeries.ts`

### Components for User Story 5

- [ ] T045 [US5] Create TimeSeriesChart component in `components/TimeSeriesChart/TimeSeriesChart.tsx` (using ChartWrapperV2)
- [ ] T046 [P] [US5] Create TimeSeriesChart.stories.tsx in `components/TimeSeriesChart/`
- [ ] T047 [P] [US5] Create index.ts for TimeSeriesChart component

### Page Integration for User Story 5

- [ ] T048 [US5] Add TimeSeriesChart row to WsOverviewPage (3 charts: TPS, Active Agents, Errors)

**Checkpoint**: US5 완료 - 시계열 차트 3개 표시 및 툴팁 동작 확인

---

## Phase 8: User Story 6 - Top Alerts 확인 (Priority: P2)

**Goal**: 최근 발생 알림 목록 표시 (서비스명, 메시지, 시간, 심각도)
**Independent Test**: Top Alerts 위젯이 알림 목록을 심각도별 색상과 함께 표시하는지 확인

### Hooks for User Story 6

- [ ] T049 [US6] Create useTopAlerts hook in `hooks/useTopAlerts.ts`

### Components for User Story 6

- [ ] T050 [US6] Create TopAlertsCard component in `components/TopAlertsCard/TopAlertsCard.tsx`
- [ ] T051 [P] [US6] Create TopAlertsCard.stories.tsx in `components/TopAlertsCard/`
- [ ] T052 [P] [US6] Create index.ts for TopAlertsCard component

### Page Integration for User Story 6

- [ ] T053 [US6] Add TopAlertsCard to WsOverviewPage (Row 5, left side)

**Checkpoint**: US6 완료 - Top Alerts 목록 표시 및 심각도별 아이콘/색상 확인

---

## Phase 9: User Story 7 - Risk Services 확인 (Priority: P2)

**Goal**: 위험 상태 서비스 목록 표시 (서비스명, 사유, 수치, 프로그레스 바)
**Independent Test**: Risk Services 위젯이 위험 서비스 목록을 프로그레스 바와 함께 표시하는지 확인

### Hooks for User Story 7

- [ ] T054 [US7] Create useRiskServices hook in `hooks/useRiskServices.ts`

### Components for User Story 7

- [ ] T055 [US7] Create RiskServicesCard component in `components/RiskServicesCard/RiskServicesCard.tsx`
- [ ] T056 [P] [US7] Create RiskServicesCard.stories.tsx in `components/RiskServicesCard/`
- [ ] T057 [P] [US7] Create index.ts for RiskServicesCard component

### Page Integration for User Story 7

- [ ] T058 [US7] Add RiskServicesCard to WsOverviewPage (Row 5, right side)

**Checkpoint**: US7 완료 - Risk Services 목록 표시 및 심각도별 레이블/색상 확인

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: 전체 품질 향상 및 마무리

- [ ] T059 [P] Create hooks/index.ts barrel export for all hooks
- [ ] T060 [P] Create components/index.ts barrel export for all components
- [ ] T061 Verify page layout matches UI design specification in plan.md
- [ ] T062 Add empty state handling for all widgets (no data scenarios)
- [ ] T063 Add loading skeleton UI for better UX
- [ ] T064 [P] Verify responsive layout on different screen sizes
- [ ] T065 Run development server and validate quickstart.md scenarios
- [ ] T066 Code cleanup: remove unused imports, consistent formatting

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup) ──────────────────────────────────────────┐
                                                          │
Phase 2 (Foundational) ◄──────────────────────────────────┘
    │
    ├─► Phase 3 (US1 - Summary Cards) 🎯 MVP
    │       │
    │       ├─► Phase 4 (US2 - Agent Table)
    │       │
    │       └─► Phase 5 (US3 - Performance Metrics)
    │
    ├─► Phase 6 (US4 - Resource Usage)
    │
    ├─► Phase 7 (US5 - Time Series Charts)
    │
    ├─► Phase 8 (US6 - Top Alerts)
    │
    └─► Phase 9 (US7 - Risk Services)
                │
                └─► Phase 10 (Polish)
```

### User Story Dependencies

| Story | Priority | Depends On | Can Start After |
|-------|----------|------------|-----------------|
| US1   | P1       | Phase 2    | Foundation 완료 |
| US2   | P1       | Phase 2    | Foundation 완료 (US1과 병렬 가능) |
| US3   | P1       | Phase 2    | Foundation 완료 (US1과 병렬 가능) |
| US4   | P2       | Phase 2    | Foundation 완료 (US1~3과 병렬 가능) |
| US5   | P2       | Phase 2    | Foundation 완료 (US1~4와 병렬 가능) |
| US6   | P2       | Phase 2    | Foundation 완료 (US1~5와 병렬 가능) |
| US7   | P2       | Phase 2    | Foundation 완료 (US1~6과 병렬 가능) |

### Within Each User Story

1. Hook 먼저 구현 (Mock 데이터 연결)
2. Component 구현 (Hook 사용)
3. Storybook 작성 (컴포넌트 문서화)
4. Page에 통합

### Parallel Opportunities

- **Phase 1**: T002, T003 병렬 실행 가능
- **Phase 2**: T004-T012 모든 Mock 파일 병렬 생성 가능
- **Phase 3-9**: 각 User Story 내 Hooks, Stories, index.ts [P] 표시된 태스크 병렬 가능
- **Phase 10**: T059, T060, T064 병렬 실행 가능

---

## Parallel Example: Phase 2 (Foundational)

```bash
# 모든 Mock 파일을 병렬로 생성:
Task: "Create health summary mock in api/mocks/health-summary.mock.ts"
Task: "Create agent summary mock in api/mocks/agent-summary.mock.ts"
Task: "Create agent status mock in api/mocks/agent-status.mock.ts"
Task: "Create alert summary mock in api/mocks/alert-summary.mock.ts"
Task: "Create performance metrics mock in api/mocks/performance-metrics.mock.ts"
Task: "Create resource usage mock in api/mocks/resource-usage.mock.ts"
Task: "Create time series mock in api/mocks/time-series.mock.ts"
Task: "Create top alerts mock in api/mocks/top-alerts.mock.ts"
Task: "Create risk services mock in api/mocks/risk-services.mock.ts"

# Mock 완료 후 Query Keys 생성:
Task: "Create query keys with mock functions in api/queries.ts"
```

## Parallel Example: User Story 1

```bash
# 모든 Hooks 병렬 생성:
Task: "Create useHealthSummary hook in hooks/useHealthSummary.ts"
Task: "Create useAgentSummary hook in hooks/useAgentSummary.ts"
Task: "Create useAlertSummary hook in hooks/useAlertSummary.ts"

# 모든 Components 병렬 생성:
Task: "Create HealthSummaryCard component in components/HealthSummaryCard/HealthSummaryCard.tsx"
Task: "Create AgentSummaryCard component in components/AgentSummaryCard/AgentSummaryCard.tsx"
Task: "Create AlertSummaryCard component in components/AlertSummaryCard/AlertSummaryCard.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1 (Setup) 완료
2. Phase 2 (Foundational) 완료 - **CRITICAL**
3. Phase 3 (US1) 완료 - 요약 카드 3개
4. **STOP and VALIDATE**: 대시보드 로드 시 요약 카드 정상 표시 확인
5. 필요시 MVP 배포/데모

### Incremental Delivery (권장)

1. Setup + Foundational → 기반 완료
2. US1 완료 → 요약 카드 동작 확인 → MVP!
3. US2 + US3 완료 → Agent 테이블 + 성능 지표 추가
4. US4 + US5 완료 → 리소스 + 차트 추가
5. US6 + US7 완료 → Alerts + Risk 추가
6. Polish → 최종 품질 확보

### Full Parallel Strategy

팀 규모가 충분할 경우:
- Developer A: US1 (Summary Cards)
- Developer B: US2 + US3 (Agent + Performance)
- Developer C: US4 + US5 (Resource + Charts)
- Developer D: US6 + US7 (Alerts + Risk)

---

## Summary

| 항목 | 값 |
|------|-----|
| **총 태스크 수** | 66개 |
| **User Story 수** | 7개 (P1: 3개, P2: 4개) |
| **병렬 기회** | 52개 태스크 [P] 표시 |
| **MVP 범위** | US1 (T001-T026, 26개 태스크) |
| **예상 컴포넌트** | 10개 위젯 + 1개 공유 컴포넌트 |
| **예상 훅** | 9개 |
| **예상 Mock 파일** | 9개 |

---

## Notes

- [P] 태스크 = 다른 파일, 의존성 없음 → 병렬 실행 가능
- [Story] 라벨 = 해당 User Story 추적용
- 각 User Story는 독립적으로 완료/테스트 가능
- 각 Checkpoint에서 해당 Story 독립 검증
- 태스크 완료 후 commit 권장
- styled-components 사용 금지 - PandaCSS만 사용
- WhatapTable은 `@fsd/common/6_shared/components/WhatapTable`에서 import
