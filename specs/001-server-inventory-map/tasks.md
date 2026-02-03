# Tasks: Server Inventory Map Migration (MVP)

**Input**: Design documents from `/specs/001-server-inventory-map/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Storybook 스토리와 컴포넌트 테스트가 요구됨 (Constitution Principle 3)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- **Project root**: `apps/whatap-workspace/src/`
- **Entities**: `entities/server/`
- **Features**: `features/server-grouping/`
- **Widgets**: `widgets/server-inventory-map/`
- **Pages**: `pages/_authenticated/ws/$wsid/_workspace/server/`

---

## Phase 1: Setup (Shared Infrastructure) ✅

**Purpose**: Project initialization and basic directory structure

- [x] T001 Create entities/server directory structure in `apps/whatap-workspace/src/entities/server/`
- [x] T002 [P] Create features/server-grouping directory structure in `apps/whatap-workspace/src/features/server-grouping/`
- [x] T003 [P] Create widgets/server-inventory-map directory structure in `apps/whatap-workspace/src/widgets/server-inventory-map/`
- [x] T004 [P] Verify shadcn/ui Accordion component is installed, install if needed via `pnpm dlx shadcn@latest add accordion`
- [x] T005 [P] Verify shadcn/ui Tooltip component is installed, install if needed via `pnpm dlx shadcn@latest add tooltip`

---

## Phase 2: Foundational (Blocking Prerequisites) ✅

**Purpose**: Core types, schemas, and mock data that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T006 Define Server types and enums in `apps/whatap-workspace/src/entities/server/model/server.types.ts`
- [x] T007 [P] Define ServerGroup and GroupSummary types in `apps/whatap-workspace/src/entities/server/model/server.types.ts`
- [x] T008 [P] Define ProjectSummary and OSSummary types in `apps/whatap-workspace/src/entities/server/model/server.types.ts`
- [x] T009 Implement Zod schemas for all entities in `apps/whatap-workspace/src/entities/server/model/server.schema.ts`
- [x] T010 Create mock data generator (50 servers) in `apps/whatap-workspace/src/entities/server/api/server.mock.ts`
- [x] T011 Create useServerMockData hook in `apps/whatap-workspace/src/entities/server/api/server.mock.ts`
- [x] T012 [P] Create useProjectSummaryMockData hook in `apps/whatap-workspace/src/entities/server/api/server.mock.ts`
- [x] T013 Create public API exports in `apps/whatap-workspace/src/entities/server/index.ts`

**Checkpoint**: Foundation ready - all types, schemas, and mock data available ✅

---

## Phase 3: User Story 1 - 서버 인벤토리 맵 조회 (Priority: P1) 🎯 MVP ✅

**Goal**: 운영자가 전체 서버의 상태를 그리드 형태로 한눈에 파악할 수 있다

**Independent Test**: 페이지 접근 시 mock 데이터 기반의 서버 그리드가 렌더링되는지 확인

### Storybook for User Story 1

- [x] T014 [P] [US1] Create ServerIcon.stories.tsx in `apps/whatap-workspace/src/entities/server/ui/ServerIcon.stories.tsx`
- [x] T015 [P] [US1] Create ServerGrid.stories.tsx in `apps/whatap-workspace/src/entities/server/ui/ServerGrid.stories.tsx`

### Implementation for User Story 1

- [x] T016 [US1] Implement ServerIcon component (32x32px, status color, hover tooltip) in `apps/whatap-workspace/src/entities/server/ui/ServerIcon.tsx`
- [x] T017 [US1] Implement ServerGrid component (responsive grid layout) in `apps/whatap-workspace/src/entities/server/ui/ServerGrid.tsx`
- [x] T018 [US1] Create Jotai atoms for UI state in `apps/whatap-workspace/src/widgets/server-inventory-map/model/server-inventory-map.store.ts`
- [x] T019 [US1] Create ServerInventoryMapPage widget (basic grid view) in `apps/whatap-workspace/src/widgets/server-inventory-map/ui/ServerInventoryMapPage.tsx`
- [x] T020 [US1] Create widget public API in `apps/whatap-workspace/src/widgets/server-inventory-map/index.ts`
- [x] T021 [US1] Create page route in `apps/whatap-workspace/src/pages/_authenticated/ws/$wsid/_workspace/server/inventory-map.tsx`
- [x] T022 [US1] Add empty state UI ("표시할 서버가 없습니다") in ServerGrid component

### Tests for User Story 1

- [x] T023 [P] [US1] Write ServerIcon.test.tsx in `apps/whatap-workspace/src/entities/server/ui/ServerIcon.test.tsx`
- [x] T024 [P] [US1] Write ServerGrid.test.tsx in `apps/whatap-workspace/src/entities/server/ui/ServerGrid.test.tsx`

**Checkpoint**: User Story 1 complete - 서버 그리드가 status 색상과 함께 표시됨 ✅

---

## Phase 4: User Story 2 - 프로젝트 요약 정보 조회 (Priority: P1)

**Goal**: 운영자가 Total/Active/Core 및 OS별 서버 현황을 빠르게 파악할 수 있다

**Independent Test**: mock 데이터 기반으로 요약 정보가 올바르게 표시되는지 확인

### Storybook for User Story 2

- [x] T025 [P] [US2] Create ProjectSummary.stories.tsx in `apps/whatap-workspace/src/entities/server/ui/ProjectSummary.stories.tsx`

### Implementation for User Story 2

- [x] T026 [US2] Implement ProjectSummary component (Total/Active/Core + OS breakdown) in `apps/whatap-workspace/src/entities/server/ui/ProjectSummary.tsx`
- [x] T027 [US2] Integrate ProjectSummary into ServerInventoryMapPage in `apps/whatap-workspace/src/widgets/server-inventory-map/ui/ServerInventoryMapPage.tsx`

### Tests for User Story 2

- [x] T028 [P] [US2] Write ProjectSummary.test.tsx in `apps/whatap-workspace/src/entities/server/ui/ProjectSummary.test.tsx`

**Checkpoint**: User Story 2 complete - 페이지 상단에 프로젝트 요약 정보 표시됨 ✅

---

## Phase 5: User Story 3 - 서버 그룹화 필터링 (Priority: P2) ✅

**Goal**: 운영자가 1차/2차 기준으로 서버를 그룹화하여 조회할 수 있다

**Independent Test**: 그룹화 드롭다운 선택 시 서버들이 그룹별로 재배치되는지 확인

### Storybook for User Story 3

- [x] T029 [P] [US3] Create GroupSelector.stories.tsx in `apps/whatap-workspace/src/features/server-grouping/ui/GroupSelector.stories.tsx`
- [x] T030 [P] [US3] Create ServerGroupPanel.stories.tsx in `apps/whatap-workspace/src/entities/server/ui/ServerGroupPanel.stories.tsx`

### Implementation for User Story 3

- [x] T031 [US3] Implement grouping utility functions in `apps/whatap-workspace/src/features/server-grouping/model/grouping.utils.ts`
- [x] T032 [US3] Implement GroupSelector component (1차/2차 그룹 드롭다운) in `apps/whatap-workspace/src/features/server-grouping/ui/GroupSelector.tsx`
- [x] T033 [US3] Implement ServerGroupPanel component (Accordion with header summary) in `apps/whatap-workspace/src/entities/server/ui/ServerGroupPanel.tsx`
- [x] T034 [US3] Create features/server-grouping public API in `apps/whatap-workspace/src/features/server-grouping/index.ts`
- [x] T035 [US3] Integrate grouping into ServerInventoryMapPage (toolbar + grouped grid) in `apps/whatap-workspace/src/widgets/server-inventory-map/ui/ServerInventoryMapPage.tsx`
- [x] T036 [US3] Update Jotai atoms for grouping state (firstGroupOption, secondGroupOption, expandedGroups) in `apps/whatap-workspace/src/widgets/server-inventory-map/model/server-inventory-map.store.ts`

### Tests for User Story 3

- [x] T037 [P] [US3] Write grouping.utils.test.ts in `apps/whatap-workspace/src/features/server-grouping/model/grouping.utils.test.ts`
- [x] T038 [P] [US3] Write GroupSelector.test.tsx in `apps/whatap-workspace/src/features/server-grouping/ui/GroupSelector.test.tsx`
- [x] T039 [P] [US3] Write ServerGroupPanel.test.tsx in `apps/whatap-workspace/src/entities/server/ui/ServerGroupPanel.test.tsx`

**Checkpoint**: User Story 3 complete - 서버가 1차/2차 기준으로 그룹화되어 Accordion 패널로 표시됨 ✅

---

## Phase 6: User Story 4 - 서버 아이콘 라벨 설정 (Priority: P3) ✅

**Goal**: 운영자가 서버 아이콘에 표시되는 라벨(hostname/IP)을 변경할 수 있다

**Independent Test**: 라벨 옵션 변경 시 서버 아이콘의 라벨 텍스트가 변경되는지 확인

### Storybook for User Story 4

- [x] T040 [P] [US4] Create LabelSelector.stories.tsx in `apps/whatap-workspace/src/features/server-grouping/ui/LabelSelector.stories.tsx`

### Implementation for User Story 4

- [x] T041 [US4] Implement LabelSelector component in `apps/whatap-workspace/src/features/server-grouping/ui/LabelSelector.tsx`
- [x] T042 [US4] Update ServerIcon to display selected label in `apps/whatap-workspace/src/entities/server/ui/ServerIcon.tsx`
- [x] T043 [US4] Integrate LabelSelector into ServerInventoryMapPage toolbar in `apps/whatap-workspace/src/widgets/server-inventory-map/ui/ServerInventoryMapPage.tsx`
- [x] T044 [US4] Update Jotai atom for iconLabelOption in `apps/whatap-workspace/src/widgets/server-inventory-map/model/server-inventory-map.store.ts`

### Tests for User Story 4

- [x] T045 [P] [US4] Write LabelSelector.test.tsx in `apps/whatap-workspace/src/features/server-grouping/ui/LabelSelector.test.tsx`

**Checkpoint**: User Story 4 complete - 라벨 드롭다운으로 서버 아이콘 라벨 변경 가능 ✅

---

## Phase 7: Polish & Cross-Cutting Concerns ✅

**Purpose**: Final integration, page-level Storybook, and E2E tests

- [x] T046 Create ServerInventoryMapPage.stories.tsx in `apps/whatap-workspace/src/widgets/server-inventory-map/ui/ServerInventoryMapPage.stories.tsx`
- [x] T047 Write ServerInventoryMapPage.test.tsx (widget integration test) in `apps/whatap-workspace/src/widgets/server-inventory-map/ui/ServerInventoryMapPage.test.tsx`
- [x] T048 [P] Run typecheck and fix any TypeScript errors via `pnpm --filter whatap-workspace typecheck`
- [x] T049 [P] Run lint and fix any ESLint errors via `pnpm --filter whatap-workspace lint`
- [x] T050 Validate all Storybook stories render correctly via `pnpm --filter whatap-workspace storybook`
- [x] T051 Run all tests and verify 80%+ coverage via `pnpm --filter whatap-workspace test:coverage`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - US1 & US2 (both P1): Can run in parallel after Foundational
  - US3 (P2): Depends on US1 completion (extends grid with grouping)
  - US4 (P3): Depends on US1 completion (extends ServerIcon with labels)
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

```
Setup (Phase 1)
    │
    ▼
Foundational (Phase 2)
    │
    ├────────────┬────────────┐
    ▼            ▼            │
  US1 (P1)     US2 (P1)       │
  그리드        요약 패널       │
    │            │            │
    ├────────────┘            │
    │                         │
    ├─────────────────────────┤
    ▼                         ▼
  US3 (P2)                  US4 (P3)
  그룹화                     라벨 설정
    │                         │
    └─────────┬───────────────┘
              ▼
         Polish (Phase 7)
```

### Within Each User Story

- Storybook stories first (for visual development)
- Core components before integration
- Widget integration after component completion
- Tests can run in parallel with implementation (different files)

### Parallel Opportunities

**Phase 1 (Setup)**: T001-T005 can all run in parallel

**Phase 2 (Foundational)**:
- T006-T008: Types can be added in parallel
- T011-T012: Mock hooks can run in parallel

**Phase 3-6 (User Stories)**:
- US1 and US2 can run in parallel (both P1, no dependencies)
- Within each story: Storybook and tests can run in parallel
- US3 requires US1 (extends grid with grouping)
- US4 requires US1 (extends ServerIcon with labels)

---

## Parallel Example: User Story 1

```bash
# Launch all Storybook stories together:
Task: "T014 [P] [US1] Create ServerIcon.stories.tsx"
Task: "T015 [P] [US1] Create ServerGrid.stories.tsx"

# After core implementation, launch tests together:
Task: "T023 [P] [US1] Write ServerIcon.test.tsx"
Task: "T024 [P] [US1] Write ServerGrid.test.tsx"
```

## Parallel Example: User Story 3

```bash
# Launch all Storybook stories together:
Task: "T029 [P] [US3] Create GroupSelector.stories.tsx"
Task: "T030 [P] [US3] Create ServerGroupPanel.stories.tsx"

# After implementation, launch tests together:
Task: "T037 [P] [US3] Write grouping.utils.test.ts"
Task: "T038 [P] [US3] Write GroupSelector.test.tsx"
Task: "T039 [P] [US3] Write ServerGroupPanel.test.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 + 2 Only)

1. Complete Phase 1: Setup (T001-T005)
2. Complete Phase 2: Foundational (T006-T013)
3. Complete Phase 3: User Story 1 - 서버 그리드 (T014-T024)
4. Complete Phase 4: User Story 2 - 프로젝트 요약 (T025-T028)
5. **STOP and VALIDATE**: Test US1 + US2 independently
6. Deploy/demo if ready - 기본 서버 인벤토리 맵 완성

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add User Story 1 + 2 → Test → Deploy (MVP - 기본 그리드 + 요약)
3. Add User Story 3 → Test → Deploy (그룹화 기능 추가)
4. Add User Story 4 → Test → Deploy (라벨 설정 추가)
5. Polish → Final validation

### Suggested MVP Scope

**MVP = Phase 1 + Phase 2 + Phase 3 (US1) + Phase 4 (US2)**

MVP 완료 시 제공되는 기능:
- ✅ 서버 그리드 시각화 (상태별 색상)
- ✅ 서버 호버 시 툴팁
- ✅ 프로젝트 요약 (Total/Active/Core)
- ✅ OS별 서버 현황

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Storybook stories first for visual development
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- FSD 아키텍처 준수: entities → features → widgets → pages
