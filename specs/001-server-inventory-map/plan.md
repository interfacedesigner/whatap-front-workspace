# Implementation Plan: Server Inventory Map Migration (MVP)

**Branch**: `001-server-inventory-map` | **Date**: 2026-02-02 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-server-inventory-map/spec.md`

## Summary

레거시 whatap-front의 ServerInventoryMap 페이지를 whatap-workspace로 마이그레이션합니다.
MVP 범위는 서버 그리드 시각화와 프로젝트 요약 패널에 한정되며, Mock 데이터를 사용하여 UI만 검증합니다.
shadcn/ui + Tailwind CSS 4 기반으로 전면 재구현하며, Jotai로 상태 관리를 수행합니다.

## Technical Context

**Language/Version**: TypeScript 5.5, React 19
**Primary Dependencies**: TanStack Router, TanStack Query 5.84, Jotai, shadcn/ui, Tailwind CSS 4
**Storage**: N/A (Mock 데이터만 사용, 실제 API 없음)
**Testing**: Vitest + Testing Library (컴포넌트), Storybook (UI 문서화), Playwright (E2E)
**Target Platform**: Web (Modern browsers - Chrome, Firefox, Safari, Edge)
**Project Type**: Web frontend (Monorepo - apps/whatap-workspace)
**Performance Goals**: 50개 서버 데이터 3초 이내 렌더링
**Constraints**: 레거시 design-system/PandaCSS 의존성 금지, FSD 아키텍처 준수
**Scale/Scope**: MVP - 서버 그리드 + 요약 패널 + 그룹화 기능

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle 1: FSD Architecture Compliance ✅

| Rule | Status | Notes |
|------|--------|-------|
| Layer dependency (app→pages→widgets→features→entities→shared) | ✅ Pass | 모든 컴포넌트가 FSD 레이어 규칙 준수 |
| Public API exports via index.ts | ✅ Pass | 각 슬라이스는 index.ts로 export |
| No cross-imports within same layer | ✅ Pass | 계획된 구조에서 위반 없음 |

### Principle 2: Type Safety ✅

| Rule | Status | Notes |
|------|--------|-------|
| strict: true in tsconfig | ✅ Pass | whatap-workspace 기본 설정 |
| No any without justification | ✅ Pass | 명시적 타입 정의 계획 |
| Zod for runtime validation | ✅ Pass | Mock 데이터 스키마에 Zod 적용 |

### Principle 3: Test Coverage ✅

| Rule | Status | Notes |
|------|--------|-------|
| UI Components: .stories.tsx | ✅ Pass | 모든 UI 컴포넌트에 Storybook 스토리 작성 |
| UI Components: component tests | ✅ Pass | Testing Library로 컴포넌트 테스트 |
| Utilities: unit tests | ✅ Pass | 유틸리티 함수 Vitest 테스트 |
| Pages: E2E tests | ✅ Pass | Playwright E2E 테스트 계획 |

**Constitution Check Result**: ✅ PASS (No violations)

## Project Structure

### Documentation (this feature)

```text
specs/001-server-inventory-map/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (N/A - Mock data only)
└── tasks.md             # Phase 2 output
```

### Source Code (FSD Architecture)

```text
apps/whatap-workspace/src/
├── pages/
│   └── _authenticated/
│       └── ws/
│           └── $wsid/
│               └── _workspace/
│                   └── server/
│                       └── inventory-map.tsx    # 페이지 라우트
│
├── widgets/
│   └── server-inventory-map/
│       ├── index.ts                             # Public API
│       ├── ui/
│       │   ├── ServerInventoryMapPage.tsx       # 메인 페이지 위젯
│       │   ├── ServerInventoryMapPage.stories.tsx
│       │   └── ServerInventoryMapPage.test.tsx
│       └── model/
│           └── server-inventory-map.store.ts    # Jotai atoms
│
├── features/
│   └── server-grouping/
│       ├── index.ts
│       ├── ui/
│       │   ├── GroupSelector.tsx                # 그룹화 드롭다운
│       │   ├── GroupSelector.stories.tsx
│       │   ├── LabelSelector.tsx                # 라벨 드롭다운
│       │   └── LabelSelector.stories.tsx
│       └── model/
│           └── grouping.utils.ts                # 그룹화 로직
│
├── entities/
│   └── server/
│       ├── index.ts
│       ├── api/
│       │   └── server.mock.ts                   # Mock 데이터 & 훅
│       ├── model/
│       │   ├── server.types.ts                  # Server, ServerGroup 타입
│       │   └── server.schema.ts                 # Zod 스키마
│       └── ui/
│           ├── ServerIcon.tsx                   # 32x32 서버 아이콘
│           ├── ServerIcon.stories.tsx
│           ├── ServerGrid.tsx                   # 서버 그리드
│           ├── ServerGrid.stories.tsx
│           ├── ServerGroupPanel.tsx             # 그룹 패널 (Accordion)
│           ├── ServerGroupPanel.stories.tsx
│           ├── ProjectSummary.tsx               # 프로젝트 요약
│           └── ProjectSummary.stories.tsx
│
└── shared/
    └── components/ui/
        └── (기존 shadcn 컴포넌트 사용)
```

**Structure Decision**: FSD 아키텍처를 준수하여 entities(server) → features(server-grouping) → widgets(server-inventory-map) → pages 계층으로 구성. 모든 UI 컴포넌트는 shadcn/ui 기반으로 구현하며, 상태 관리는 Jotai atoms 사용.

## Complexity Tracking

> Constitution Check에 위반 사항이 없으므로 해당 없음.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | N/A | N/A |

---

## Phase 0 & Phase 1 Artifacts

### Generated Artifacts

| Artifact | Path | Status |
|----------|------|--------|
| Research | [research.md](./research.md) | ✅ Complete |
| Data Model | [data-model.md](./data-model.md) | ✅ Complete |
| Quickstart | [quickstart.md](./quickstart.md) | ✅ Complete |
| Mock Contracts | [contracts/mock-data.md](./contracts/mock-data.md) | ✅ Complete |

### Post-Design Constitution Re-Check

**Result**: ✅ PASS

모든 설계 결정이 Constitution 원칙을 준수합니다:

1. **FSD Architecture**: entities → features → widgets → pages 계층 구조 유지
2. **Type Safety**: Zod 스키마 정의, strict TypeScript
3. **Test Coverage**: 모든 컴포넌트에 .stories.tsx 및 테스트 계획

---

## Next Steps

1. **`/speckit.tasks`** 실행하여 구현 태스크 생성
2. **`/speckit.implement`** 실행하여 구현 시작

---

## Summary

| Item | Value |
|------|-------|
| Branch | `001-server-inventory-map` |
| Spec | [spec.md](./spec.md) |
| Constitution | ✅ All principles pass |
| Research | ✅ Complete (7 areas) |
| Data Model | ✅ Complete (5 entities) |
| Quickstart | ✅ Complete |
| Ready for Tasks | ✅ Yes |
