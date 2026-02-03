# Research: Server Inventory Map Migration (MVP)

**Date**: 2026-02-02
**Feature**: 001-server-inventory-map
**Status**: Complete

## Research Areas

### 1. 레거시 코드 구조 분석

**Decision**: 레거시 ServerInventoryMap의 핵심 컴포넌트와 데이터 흐름을 파악하여 MVP 범위 정의

**Findings**:
- **메인 페이지**: `ServerInventoryMap.tsx` - 전체 레이아웃, 필터, 시간 선택기 관리
- **그리드 시각화**: `ServerGroupGrid.tsx` + `ServerGroupGridPanel.tsx` - Canvas 기반 서버 아이콘 렌더링
- **요약 패널**: `ProjectSummary.tsx` - Total/Active/Core + OS별 breakdown
- **상태 관리**: `useServerGroupStore.ts` (Zustand) - 그룹 선택, 라벨 옵션, 팝오버 상태
- **데이터 훅**: `useServerInventoryMetricsGroup.ts` - API 호출 및 데이터 변환

**Rationale**: Canvas 기반 시각화는 복잡도가 높아 MVP에서는 HTML/CSS 기반으로 단순화

**Alternatives Considered**:
- Canvas 시각화 직접 포팅 → 구현 복잡도 높음, 레거시 의존성 증가
- SVG 기반 시각화 → 50개 서버에서는 과도한 복잡도

---

### 2. shadcn/ui 컴포넌트 매핑

**Decision**: 레거시 @whatap/design-system 컴포넌트를 shadcn/ui로 대체

**Findings**:

| 레거시 컴포넌트 | shadcn/ui 대체 |
|---------------|---------------|
| `FlexBox` | Tailwind flex utilities |
| `Typography` | Tailwind text utilities |
| `Select` | `@/shared/components/ui/select` |
| `Tooltip` | Radix UI Tooltip (shadcn) |
| `Drawer` | Out of scope (다음 이터레이션) |
| `Icon` | lucide-react icons |

**Rationale**: shadcn/ui는 whatap-workspace의 표준 UI 라이브러리이며, Tailwind CSS와 완벽 호환

**Alternatives Considered**:
- 레거시 design-system 임시 import → 의존성 증가, 마이그레이션 목적에 반함
- 커스텀 컴포넌트 직접 구현 → 불필요한 작업, shadcn이 이미 존재

---

### 3. Jotai 상태 관리 패턴

**Decision**: Zustand에서 Jotai로 전환, atoms 기반 상태 관리

**Findings**:

```typescript
// 기존 Zustand (레거시)
const useServerGroupStore = create<ServerGroupStore>(() => ({
  summaryGroupPanel: null,
  iconLabelOption: 'hostname',
  showNoGroupPanel: true,
}));

// 새로운 Jotai (whatap-workspace)
export const firstGroupOptionAtom = atom<string | null>(null);
export const secondGroupOptionAtom = atom<string | null>(null);
export const iconLabelOptionAtom = atom<IconLabelOption>('hostname');
export const expandedGroupsAtom = atom<Set<string>>(new Set());
```

**Rationale**:
- Jotai는 whatap-workspace의 표준 상태 관리 라이브러리
- Atomic 모델이 React Suspense와 더 잘 통합됨
- 컴포넌트 단위 리렌더링 최적화

**Alternatives Considered**:
- Zustand 유지 → whatap-workspace 표준과 불일치
- React Context → 전역 상태에는 Jotai가 더 적합

---

### 4. Mock 데이터 구조

**Decision**: 레거시 API 응답 구조와 동일한 형태로 Mock 데이터 생성

**Findings**:

```typescript
// Server 엔티티
interface Server {
  oid: number;
  hostname: string;
  ip: string;
  status: 'ok' | 'warning' | 'critical' | 'inactive';
  osType: 'Linux' | 'Windows' | 'AIX' | 'HP-UX' | 'Solaris';
  serverType: string;
  cores: number;
  // 그룹화 기준 필드
  defaultGroup?: string;
  OSVersion?: string;
  cloudRegion?: string;
  model?: string;
}

// ServerGroup (그룹화된 서버 집합)
interface ServerGroup {
  key: string;
  name: string;
  servers: Server[];
  groups: ServerGroup[]; // 2차 그룹
  summary: {
    total: number;
    active: number;
    warning: number;
    critical: number;
  };
}

// ProjectSummary (프로젝트 요약)
interface ProjectSummary {
  total: number;
  active: number;
  totalCore: number;
  byOS: {
    label: string;
    active: number;
    total: number;
    totalCore: number;
  }[];
}
```

**Rationale**: 레거시 API 구조를 유지하면 향후 실제 API 연동 시 변경 최소화

---

### 5. 서버 상태별 색상 정의

**Decision**: Tailwind CSS 색상 클래스로 서버 상태 표현

**Findings**:

| Status | 색상 | Tailwind Class |
|--------|------|----------------|
| ok | 초록 | `bg-green-500` |
| warning | 노랑 | `bg-yellow-500` |
| critical | 빨강 | `bg-red-500` |
| inactive | 회색 | `bg-gray-400` |

**Rationale**: Tailwind 기본 색상 팔레트 사용으로 일관성 유지

---

### 6. Accordion 컴포넌트 구현

**Decision**: shadcn/ui Accordion 컴포넌트 활용

**Findings**:
- shadcn/ui에 Accordion 컴포넌트 존재
- Radix UI 기반으로 접근성(a11y) 지원
- 다중 패널 열기 지원 (`type="multiple"`)

**Rationale**: 기존 shadcn 컴포넌트 활용으로 구현 비용 최소화

---

### 7. TanStack Router 라우트 구조

**Decision**: `/ws/:wsid/server/inventory-map` 경로로 페이지 추가

**Findings**:
- 기존 라우트 구조: `pages/_authenticated/ws/$wsid/_workspace/`
- 새 파일 위치: `pages/_authenticated/ws/$wsid/_workspace/server/inventory-map.tsx`
- 파일 기반 라우팅으로 자동 등록

**Rationale**: whatap-workspace의 기존 라우트 패턴 준수

---

## Summary

| Research Area | Decision | Confidence |
|--------------|----------|------------|
| 레거시 구조 | HTML/CSS 기반 단순화 | High |
| UI 컴포넌트 | shadcn/ui 전면 사용 | High |
| 상태 관리 | Jotai atoms | High |
| Mock 데이터 | 레거시 API 구조 유지 | High |
| 서버 상태 색상 | Tailwind 기본 색상 | High |
| Accordion | shadcn/ui Accordion | High |
| 라우팅 | TanStack Router 파일 기반 | High |

**All NEEDS CLARIFICATION items resolved**: ✅
