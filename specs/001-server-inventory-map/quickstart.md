# Quickstart: Server Inventory Map (MVP)

**Date**: 2026-02-02
**Feature**: 001-server-inventory-map

## Prerequisites

- Node.js v22+
- pnpm 10.20+
- whatap-workspace 개발 환경 설정 완료

## Getting Started

### 1. 개발 서버 실행

```bash
# whatap-workspace 개발 서버 시작
pnpm --filter whatap-workspace dev
```

서버가 http://localhost:4000 에서 실행됩니다.

### 2. 페이지 접근

```
http://localhost:4000/ws/{wsid}/server/inventory-map
```

> `{wsid}`는 테스트용 workspace ID로 대체 (예: `1`)

### 3. Storybook 실행

```bash
# 컴포넌트 문서 및 개별 테스트
pnpm --filter whatap-workspace storybook
```

Storybook이 http://localhost:6007 에서 실행됩니다.

---

## 핵심 컴포넌트

### ServerIcon

32x32px 크기의 서버 상태 아이콘.

```tsx
import { ServerIcon } from '@/entities/server';

<ServerIcon
  server={{
    oid: 1,
    hostname: 'web-server-01',
    ip: '192.168.1.1',
    status: 'ok',
    osType: 'Linux',
    serverType: 'web',
    cores: 4,
  }}
  labelOption="hostname"
/>
```

### ServerGrid

반응형 그리드로 여러 서버 표시.

```tsx
import { ServerGrid } from '@/entities/server';

<ServerGrid
  servers={serverList}
  labelOption="hostname"
/>
```

### ServerGroupPanel

Accordion 스타일의 그룹 패널.

```tsx
import { ServerGroupPanel } from '@/entities/server';

<ServerGroupPanel
  group={serverGroup}
  isExpanded={true}
  onToggle={() => {}}
  labelOption="hostname"
/>
```

### ProjectSummary

프로젝트 요약 정보 표시.

```tsx
import { ProjectSummary } from '@/entities/server';

<ProjectSummary summary={projectSummary} />
```

### GroupSelector

그룹화 기준 선택 드롭다운.

```tsx
import { GroupSelector } from '@/features/server-grouping';

<GroupSelector
  label="1차 그룹"
  value={firstGroupOption}
  onChange={setFirstGroupOption}
  excludeValues={[secondGroupOption]}
/>
```

---

## 상태 관리 (Jotai)

```tsx
import { useAtom } from 'jotai';
import {
  firstGroupOptionAtom,
  secondGroupOptionAtom,
  iconLabelOptionAtom,
  expandedGroupsAtom,
} from '@/widgets/server-inventory-map';

function MyComponent() {
  const [firstGroup, setFirstGroup] = useAtom(firstGroupOptionAtom);
  const [secondGroup, setSecondGroup] = useAtom(secondGroupOptionAtom);
  const [labelOption, setLabelOption] = useAtom(iconLabelOptionAtom);
  const [expandedGroups, setExpandedGroups] = useAtom(expandedGroupsAtom);

  // ...
}
```

---

## Mock 데이터 사용

```tsx
import { useServerMockData, useProjectSummaryMockData } from '@/entities/server';

function ServerInventoryMapPage() {
  // Mock 데이터 훅 (실제 API 없이 테스트)
  const { data: servers, isLoading } = useServerMockData();
  const { data: summary } = useProjectSummaryMockData();

  if (isLoading) return <Loading />;

  return (
    <div>
      <ProjectSummary summary={summary} />
      <ServerGrid servers={servers} />
    </div>
  );
}
```

---

## 테스트 실행

```bash
# 단위 테스트
pnpm --filter whatap-workspace test

# 특정 파일 테스트
pnpm --filter whatap-workspace test src/entities/server

# 커버리지 리포트
pnpm --filter whatap-workspace test:coverage

# E2E 테스트
pnpm --filter whatap-workspace test:e2e
```

---

## 파일 구조

```
apps/whatap-workspace/src/
├── pages/_authenticated/ws/$wsid/_workspace/server/
│   └── inventory-map.tsx           # 페이지 라우트
├── widgets/server-inventory-map/
│   ├── index.ts
│   ├── ui/ServerInventoryMapPage.tsx
│   └── model/server-inventory-map.store.ts
├── features/server-grouping/
│   ├── index.ts
│   ├── ui/GroupSelector.tsx
│   └── ui/LabelSelector.tsx
└── entities/server/
    ├── index.ts
    ├── api/server.mock.ts
    ├── model/server.types.ts
    ├── model/server.schema.ts
    └── ui/
        ├── ServerIcon.tsx
        ├── ServerGrid.tsx
        ├── ServerGroupPanel.tsx
        └── ProjectSummary.tsx
```

---

## Troubleshooting

### 1. 라우트가 인식되지 않음

```bash
# TanStack Router 라우트 재생성
pnpm --filter whatap-workspace build:routes
```

### 2. 타입 에러

```bash
# 타입 체크
pnpm --filter whatap-workspace typecheck
```

### 3. Storybook 빌드 에러

```bash
# Storybook 캐시 클리어
rm -rf node_modules/.cache/storybook
pnpm --filter whatap-workspace storybook
```
