# WhatapTable 마이그레이션 계획

## 개요

레거시 `WhatapTable` 컴포넌트를 `whatap-workspace`로 마이그레이션합니다.

- **소스**: `do-not-touch-legacy/apps/whatap-front/src/fsd/common/6_shared/components/WhatapTable`
- **타겟**: `apps/whatap-workspace/src/shared/components/data-table`
- **스타일 변환**: PandaCSS → Tailwind CSS 4

## 요구사항 확인

| 항목 | 결정 |
|------|------|
| 기능 범위 | 전체 기능 (가상 스크롤, 리사이징, 핀 고정, 행 선택/확장) |
| 가상 스크롤 | 필요 (TanStack Virtual) |
| API | 기존 유지 (WhatapTable, Column, ColumnGroup) |
| 의존성 | @whatap/design-system 제거 → shadcn Table + lucide-react |

---

## Phase 1: 기반 작업

### 1.1 의존성 설치

```bash
pnpm --filter whatap-workspace add @tanstack/react-table @tanstack/react-virtual
```

### 1.2 shadcn Table 컴포넌트 설치

```bash
cd apps/whatap-workspace
npx shadcn@latest add table
```

### 1.3 디렉토리 구조 생성

```
src/shared/components/data-table/
├── index.ts                    # Public API
├── WhatapTable.tsx             # 메인 컴포넌트
├── WhatapTable.types.ts        # 타입 정의
├── WhatapTable.stories.tsx     # Storybook
│
├── columns/
│   ├── index.ts
│   ├── Column.tsx              # 선언적 Column
│   ├── ColumnGroup.tsx         # 컬럼 그룹
│   ├── SelectRowColumn.tsx     # 체크박스 컬럼
│   └── ExpandRowColumn.tsx     # 확장 컬럼
│
├── core/
│   ├── index.ts
│   ├── BaseTable.tsx           # 기본 테이블
│   ├── TableHeaderRow.tsx      # 헤더 행
│   └── TableRow.tsx            # 데이터 행
│
├── context/
│   ├── index.ts
│   ├── ColumnRegistryContext.tsx
│   └── TableContext.tsx
│
├── hooks/
│   ├── index.ts
│   ├── useReactTable.ts
│   ├── useVirtualList.ts
│   ├── useColumnRegistry.ts
│   ├── useColumnResizing.ts
│   ├── useRowSelection.ts
│   ├── useSorting.ts
│   └── useSequence.ts
│
└── utils/
    ├── index.ts
    ├── sorting.ts
    ├── column-pinning.ts
    └── css-variables.ts
```

---

## Phase 2: 핵심 컴포넌트 마이그레이션

### 2.1 타입 정의 (WhatapTable.types.ts)

레거시 `WhatapTable.types.ts`에서 타입 복사 후 필요 시 수정

### 2.2 Context & Hooks

| 파일 | 변환 작업 |
|------|----------|
| `ColumnRegistryContext.tsx` | 거의 그대로 복사 |
| `TableContext.tsx` | 거의 그대로 복사 |
| `useReactTable.ts` | `@tanstack/table-core` → `@tanstack/react-table` |
| `useVirtualList.ts` | 그대로 복사 (TanStack Virtual) |
| `useColumnResizing.ts` | 그대로 복사 |
| `useSorting.ts` | 그대로 복사 |
| `useRowSelection.ts` | 그대로 복사 |
| `useSequence.ts` | 그대로 복사 |

### 2.3 Utils

| 파일 | 변환 작업 |
|------|----------|
| `sorting.ts` | 레거시 `WhatapTable.utils.ts`에서 정렬 함수 추출 |
| `column-pinning.ts` | `computeColumnPinning` 함수 복사 |
| `css-variables.ts` | `sanitizeCssVarToken` 함수 복사 |

---

## Phase 3: Column 컴포넌트 마이그레이션

### 3.1 Column.tsx

**변환 포인트:**
- PandaCSS `css()` → Tailwind 클래스
- `FlexBox` → `div` + Tailwind flex
- `Typography` → `span` + Tailwind text

```typescript
// Before (PandaCSS)
<FlexBox py='space_xs' px='space_s'>
  <Typography>{header}</Typography>
</FlexBox>

// After (Tailwind)
<div className="py-1 px-2 flex items-center">
  <span className="truncate text-sm">{header}</span>
</div>
```

### 3.2 ColumnGroup.tsx

Column과 동일한 스타일 변환 적용

### 3.3 SelectRowColumn.tsx

- `IndeterminateCheckbox` → shadcn Checkbox 또는 직접 구현
- `Icon` → lucide-react

### 3.4 ExpandRowColumn.tsx

- `Icon` → lucide-react (`ChevronRight`, `ChevronDown`)

---

## Phase 4: Core 컴포넌트 마이그레이션

### 4.1 BaseTable.tsx (CommonBaseTable.tsx 기반)

**핵심 변환:**

```typescript
// Before
import { Table, TableHeader, TableBody } from '@whatap/design-system';
import { css, cx } from '@fsd/common/6_shared/styled-system/css';

// After
import { Table, TableHeader, TableBody } from '@/shared/components/ui/table';
import { cn } from '@/shared/lib/utils';
```

**CSS 변수 최적화 유지:**
```typescript
// 컬럼 크기를 CSS 변수로 관리하는 패턴 그대로 유지
style={{
  '--col-{id}-size': `${size}px`,
}}
```

### 4.2 TableHeaderRow.tsx

- 정렬 아이콘: lucide-react (`ArrowUp`, `ArrowDown`)
- 리사이즈 핸들: Tailwind로 스타일링

### 4.3 TableRow.tsx

- 핀 고정 스타일: `sticky` + CSS 변수
- 확장 행 렌더링 유지

---

## Phase 5: 메인 컴포넌트 조립

### 5.1 WhatapTable.tsx

레거시 구조 유지:
```
WhatapTable
├─ ColumnRegistryProvider
│  └─ Column/ColumnGroup/SelectRowColumn/ExpandRowColumn
├─ TableContextProvider
└─ BaseTable
```

### 5.2 Public API (index.ts)

```typescript
export { Column, ColumnGroup, SelectRowColumn, ExpandRowColumn } from './columns';
export { default as WhatapTable } from './WhatapTable';
export type { WhatapTableProps, ColumnProps } from './WhatapTable.types';
```

---

## Phase 6: 테스트 & 문서화

### 6.1 Storybook Stories

- `Default` - 기본 테이블
- `WithSorting` - 정렬 기능
- `WithVirtualization` - 가상 스크롤 (10,000행)
- `WithColumnResizing` - 컬럼 리사이징
- `WithColumnPinning` - 컬럼 핀 고정
- `WithRowSelection` - 행 선택
- `WithExpandableRows` - 행 확장
- `FullFeatures` - 모든 기능 조합

### 6.2 Unit Tests

```typescript
describe('WhatapTable', () => {
  it('renders data correctly');
  it('sorts on header click');
  it('handles virtual scrolling');
  it('resizes columns');
  it('pins columns');
  it('selects rows');
  it('expands rows');
});
```

---

## 스타일 변환 가이드

### PandaCSS → Tailwind 매핑

| PandaCSS | Tailwind |
|----------|----------|
| `minWidth: '100%'` | `min-w-full` |
| `display: 'flex'` | `flex` |
| `flexDirection: 'column'` | `flex-col` |
| `overflow: 'auto'` | `overflow-auto` |
| `position: 'sticky'` | `sticky` |
| `py: 'space_xs'` | `py-1` |
| `px: 'space_s'` | `px-2` |
| `gap: 'space_s'` | `gap-2` |
| `cursor: 'pointer'` | `cursor-pointer` |
| `userSelect: 'none'` | `select-none` |

### 함수 변환

```typescript
// Before
cx(css({...}), className)

// After
cn("tailwind-classes", className)
```

---

## 핵심 파일 참조

| 용도 | 레거시 파일 |
|------|------------|
| 메인 구조 | `WhatapTable.tsx` |
| Column API | `WhatapTable.Columns.tsx` |
| 가상 스크롤 | `hooks/useVirtualList.ts` |
| 테이블 렌더링 | `BaseTables/CommonBaseTable.tsx` |
| CSS 변수 최적화 | `BaseTables/CommonBaseTable.Utils.ts` |
| 타입 정의 | `WhatapTable.types.ts` |

---

## 검증 체크리스트

- [ ] 기본 데이터 렌더링
- [ ] 정렬 (단일/다중, Shift+클릭)
- [ ] 가상 스크롤 성능 (10,000행)
- [ ] 컬럼 리사이징 (드래그)
- [ ] 컬럼 핀 고정 (좌/우)
- [ ] 행 선택 (단일/다중, Indeterminate)
- [ ] 행 확장 (renderExpandedRow)
- [ ] 커스텀 셀 렌더링 (render prop)
- [ ] 스크롤 투 로우 (scrollToRowId)
- [ ] Storybook 문서 완성
- [ ] 타입 안전성 확인

---

## 실행 명령

```bash
# 개발 서버
pnpm --filter whatap-workspace dev

# 테스트
pnpm --filter whatap-workspace test

# Storybook
pnpm --filter whatap-workspace storybook

# 타입 체크
pnpm --filter whatap-workspace typecheck
```
