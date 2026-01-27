# Data Model: Workspace APM Overview Dashboard

**Date**: 2026-01-08
**Branch**: `001-ws-overview-dashboard`

## 1. Common Types

### API Parameters

```typescript
/**
 * Overview API 공통 파라미터
 */
export interface OverviewApiParams {
  wsid: number;           // 워크스페이스 ID
  platform?: number;      // 플랫폼 ID (0: 전체)
  sysid?: number;         // 시스템 ID (0: 전체)
  stime?: number;         // 시작 시간 (timestamp)
  etime?: number;         // 종료 시간 (timestamp)
}
```

### API Response Wrapper

```typescript
export type ApiSuccessResponse<T> = {
  type: 'SUCCESS';
  data: T;
};

export type ApiFailureResponse = {
  type: 'FAILURE';
  msg: string;
  code: number;
};

export type ApiResult<T> = ApiSuccessResponse<T> | ApiFailureResponse;
```

---

## 2. Health Summary

### Response Type

```typescript
/**
 * 전체 Health 상태 요약
 * FR-001: 전체 Health 상태, Health 퍼센티지, 상태 아이콘
 */
export interface HealthSummaryResponse {
  status: HealthStatus;      // 상태 코드
  percentage: number;        // 건강 퍼센티지 (0-100)
  label: string;             // 표시 레이블 (예: "정상")
}

export type HealthStatus = 'normal' | 'warning' | 'critical';
```

---

## 3. Agent Summary

### Response Type

```typescript
/**
 * 활성 Agent 요약
 * FR-002: 활성 Agent 수와 전체 Agent 수
 */
export interface AgentSummaryResponse {
  activeCount: number;       // 활성 에이전트 수
  totalCount: number;        // 전체 에이전트 수
  activeRate: number;        // 활성화율 (%)
}

/**
 * Agent 상태 상세 목록
 * FR-004: 에이전트 이름, 위치, Load 퍼센티지, 상태 인디케이터
 */
export interface AgentStatusResponse {
  total: number;
  agents: AgentStatusItem[];
}

export interface AgentStatusItem {
  oid: number;               // 에이전트 고유 ID
  name: string;              // 에이전트 이름 (예: "agent-01")
  location: string;          // 위치 (예: "Seoul")
  load: number;              // Load 퍼센티지 (0-100)
  status: AgentStatus;       // 상태
}

export type AgentStatus = 'active' | 'warning' | 'inactive';
```

---

## 4. Alert Summary

### Response Type

```typescript
/**
 * 현재 Alert 요약
 * FR-003: Alert 수를 심각도별로 분류
 */
export interface AlertSummaryResponse {
  criticalCount: number;     // 위험 알림 수
  warningCount: number;      // 중요 알림 수
  totalCount: number;        // 전체 알림 수
  label: string;             // 표시 레이블 (예: "주의 필요")
}
```

---

## 5. Performance Metrics

### Response Type

```typescript
/**
 * 성능 지표
 * FR-005: TPS, Error Rate, Avg Response + 직전 1시간 대비 변화량
 */
export interface PerformanceMetricsResponse {
  tps: MetricValue;          // 초당 트랜잭션
  errorRate: MetricValue;    // 에러율 (%)
  avgResponse: MetricValue;  // 평균 응답 시간 (ms)
}

export interface MetricValue {
  value: number;             // 현재 값
  unit: string;              // 단위 (예: "req/s", "%", "ms")
  change: number;            // 변화량 (양수: 증가, 음수: 감소)
  changeType: ChangeType;    // 변화 방향
}

export type ChangeType = 'increase' | 'decrease' | 'unchanged';
```

---

## 6. Resource Usage

### Response Type

```typescript
/**
 * 리소스 사용률
 * FR-006: CPU, Memory, 동시 사용자 + 전일/전주/전월 비교
 */
export interface ResourceUsageResponse {
  cpu: ResourceMetric;
  memory: ResourceMetric;
  concurrentUsers: ResourceMetric;
}

export interface ResourceMetric {
  value: number;             // 현재 값
  unit: string;              // 단위 (%, 명)
  comparison: ComparisonData;
}

export interface ComparisonData {
  yesterday: ChangeValue;    // 전일 대비
  lastWeek: ChangeValue;     // 전주 대비
  lastMonth: ChangeValue;    // 전월 대비
}

export interface ChangeValue {
  label: string;             // 표시 레이블 (예: "전일")
  change: number;            // 변화량
  changeType: ChangeType;
}
```

---

## 7. Time Series Data

### Response Type

```typescript
/**
 * 시계열 차트 데이터
 * FR-007: TPS 추이, Agent 활성 추이, Error 추이 (24시간)
 */
export interface TimeSeriesResponse {
  chartType: TimeSeriesChartType;
  data: TimeSeriesDataPoint[];
  interval: number;          // 데이터 간격 (ms)
}

export type TimeSeriesChartType = 'tps' | 'activeAgents' | 'errors';

export interface TimeSeriesDataPoint {
  timestamp: number;         // Unix timestamp
  value: number;             // 메트릭 값
}

/**
 * ChartWrapperV2 호환 데이터 형식
 */
export interface ChartSeriesData {
  id: string;
  data: Array<[number, number]>;  // [[timestamp, value], ...]
  name?: string;
  color?: string;
}
```

---

## 8. Top Alerts

### Response Type

```typescript
/**
 * Top Alerts 목록
 * FR-008: 서비스명, 알림 메시지, 발생 시간, 심각도
 */
export interface TopAlertsResponse {
  total: number;
  alerts: AlertItem[];
}

export interface AlertItem {
  id: string;                // 알림 고유 ID
  serviceName: string;       // 서비스명 (예: "API Gateway")
  message: string;           // 알림 메시지
  timestamp: number;         // 발생 시간
  severity: AlertSeverity;   // 심각도
}

export type AlertSeverity = 'critical' | 'warning' | 'info';
```

---

## 9. Risk Services

### Response Type

```typescript
/**
 * Risk Services 목록
 * FR-009: 서비스명, 위험 사유, 현재 수치(%), 프로그레스 바
 */
export interface RiskServicesResponse {
  total: number;
  services: RiskServiceItem[];
}

export interface RiskServiceItem {
  id: string;                // 서비스 고유 ID
  name: string;              // 서비스명 (예: "Payment Service")
  reason: string;            // 위험 사유 (예: "CPU 임계값 초과")
  currentValue: number;      // 현재 수치 (%)
  threshold: number;         // 임계값 (%)
  severity: RiskSeverity;    // 심각도
}

export type RiskSeverity = 'critical' | 'warning';
```

---

## 10. UI State Types

### Widget State

```typescript
/**
 * 각 위젯의 로딩/에러 상태
 */
export interface WidgetState<T> {
  data: T | null;
  isLoading: boolean;
  error: ApiFailureResponse | null;
  refetch: () => void;
}
```

### Dashboard State

```typescript
/**
 * 대시보드 전체 상태
 */
export interface DashboardState {
  wsid: number;
  isLive: boolean;           // 실시간 업데이트 여부
  lastUpdated: number;       // 마지막 업데이트 시간
}
```

---

## 11. Entity Relationships

```
┌─────────────────────────────────────────────────────────────────┐
│                     Workspace (wsid)                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │HealthSummary │  │ AgentSummary │  │ AlertSummary │          │
│  │              │  │              │  │              │          │
│  │ - status     │  │ - activeCount│  │ - critical   │          │
│  │ - percentage │  │ - totalCount │  │ - warning    │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                 │
│  ┌──────────────────────────────┐  ┌────────────────────────┐  │
│  │      AgentStatusList         │  │  PerformanceMetrics    │  │
│  │                              │  │                        │  │
│  │  ┌─────────┐ ┌─────────┐    │  │  - tps                 │  │
│  │  │ Agent 1 │ │ Agent 2 │... │  │  - errorRate           │  │
│  │  └─────────┘ └─────────┘    │  │  - avgResponse         │  │
│  └──────────────────────────────┘  └────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────┐  ┌────────────────────────┐  │
│  │      ResourceUsage           │  │   TimeSeriesData       │  │
│  │                              │  │                        │  │
│  │  - cpu                       │  │  - tps trend           │  │
│  │  - memory                    │  │  - agent trend         │  │
│  │  - concurrentUsers           │  │  - error trend         │  │
│  └──────────────────────────────┘  └────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────┐  ┌────────────────────────┐  │
│  │       TopAlerts              │  │    RiskServices        │  │
│  │                              │  │                        │  │
│  │  ┌─────────┐ ┌─────────┐    │  │  ┌─────────┐           │  │
│  │  │ Alert 1 │ │ Alert 2 │... │  │  │Service 1│...        │  │
│  │  └─────────┘ └─────────┘    │  │  └─────────┘           │  │
│  └──────────────────────────────┘  └────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 12. Validation Rules

### Health Summary
- `percentage`: 0 ~ 100 범위
- `status`: percentage >= 90 → 'normal', >= 70 → 'warning', < 70 → 'critical'

### Agent Status
- `load`: 0 ~ 100 범위
- `status`: load < 70 → 'active', < 90 → 'warning', >= 90 → 'inactive'

### Performance Metrics
- `tps.value`: >= 0
- `errorRate.value`: 0 ~ 100 범위
- `avgResponse.value`: >= 0 (ms)

### Resource Usage
- `value`: 0 ~ 100 범위 (CPU, Memory), >= 0 (concurrentUsers)

### Alerts
- `timestamp`: 과거 시간만 유효
- `severity`: 'critical' | 'warning' | 'info'

### Risk Services
- `currentValue`, `threshold`: 0 ~ 100 범위
- `severity`: currentValue >= threshold → 'critical', else 'warning'
