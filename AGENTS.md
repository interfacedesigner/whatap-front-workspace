# Project Overview

whatap-front-workspace는 WhaTap Labs의 프론트엔드 모니터링 애플리케이션 모노레포입니다.

## Apps 구조

### 🚀 whatap-workspace (Active Development)

새로운 기술 스택을 검증하기 위한 실험적 프로젝트입니다. 최신 React 19 기능과 현대적인 도구들을 활용합니다.

---

# whatap-workspace Guide

## Tech Stack

| 카테고리 | 기술 |
|---------|------|
| **Core** | React 19, TypeScript 5.5 |
| **Build** | Vite (dev & prod) |
| **Styling** | Tailwind CSS 4 + shadcn/ui |
| **Routing** | TanStack Router (파일 기반) |
| **Data** | TanStack Query 5.84 |
| **State** | Jotai (클라이언트 상태) |
| **Validation** | Zod |
| **Testing** | Vitest + Testing Library + Storybook + Playwright |
| **i18n** | typesafe-i18n |

## Essential Commands

```bash
# Development
pnpm --filter whatap-workspace dev          # http://localhost:4000

# Testing
pnpm --filter whatap-workspace test         # Unit tests
pnpm --filter whatap-workspace test:ui      # Vitest UI
pnpm --filter whatap-workspace test:coverage

# Storybook
pnpm --filter whatap-workspace storybook    # http://localhost:6007

# Build & Lint
pnpm --filter whatap-workspace build
pnpm --filter whatap-workspace lint
pnpm --filter whatap-workspace typecheck

# i18n
pnpm --filter whatap-workspace typesafe-i18n
```

## Architecture

### 표준 FSD (Feature-Sliced Design)

```
src/
├── app/                    # 앱 초기화, providers, layouts
│   ├── context/           # 앱 전역 context
│   ├── providers/         # QueryProvider 등
│   └── layouts/           # RootLayout, AuthenticatedLayout 등
│
├── pages/                  # 파일 기반 라우팅 (TanStack Router)
│   └── _authenticated/    # 인증 필요 페이지
│       ├── ent/$eid/      # Enterprise 라우트
│       └── ws/$wsid/      # Workspace 라우트
│
├── widgets/               # 복합 UI 블록 (페이지 조합용)
│
├── features/              # 비즈니스 기능 단위
│   └── auth/
│       ├── api/          # API 호출
│       ├── model/        # 상태/스토어
│       └── ui/           # UI 컴포넌트
│
├── entities/              # 비즈니스 엔티티
│
└── shared/                # 공용 코드
    ├── api/              # API 클라이언트, 타입, 미들웨어
    ├── components/ui/    # shadcn 기반 UI 컴포넌트
    ├── config/           # 설정
    ├── i18n/             # 다국어 리소스
    └── lib/              # 유틸리티
```

### FSD Import Rules

```typescript
// ✅ 다른 slice 간: public API(index.ts)를 통해 import
import { LoginForm } from '@/features/auth';

// ✅ 같은 slice 내: 직접 상대 경로 사용
import { useAuthStore } from '../model/auth.store';

// ❌ 금지: 같은 slice 내에서 index.ts를 통한 import
import { useAuthStore } from './index';

// 계층 규칙: 상위 레이어는 하위 레이어만 import 가능
// app → pages → widgets → features → entities → shared
```

## Routing (TanStack Router)

파일 기반 라우팅을 사용합니다. `pages/` 디렉토리 구조가 URL 구조를 결정합니다.

```
pages/
├── __root.tsx              # 루트 레이아웃
├── index.tsx               # /
├── login.tsx               # /login
└── _authenticated/         # 인증 필요 라우트 그룹
    ├── route.tsx           # 인증 레이아웃
    ├── ent/
    │   └── $eid/           # /ent/:eid
    │       └── ws/
    │           └── $wsid/  # /ent/:eid/ws/:wsid
    └── ws/
        └── $wsid/          # /ws/:wsid
            └── _workspace/ # 워크스페이스 레이아웃 그룹
```

### 라우트 파일 컨벤션

- `_prefix`: 레이아웃 그룹 (URL에 미포함)
- `$param`: 동적 파라미터
- `route.tsx`: 레이아웃 정의
- `index.tsx`: 인덱스 페이지

### Page vs Widget 구분

**Route 파일 = Page 컴포넌트**입니다. 페이지 로직은 route 파일에 직접 작성합니다.

```typescript
// ✅ 올바른 구조: route 파일에 페이지 로직 작성
// pages/_authenticated/ws/$wsid/_workspace/server/inventory-map.tsx
export const Route = createFileRoute('...')({
  component: ServerInventoryMapPage,
});

function ServerInventoryMapPage() {
  const servers = useSuspenseQuery(...);

  return (
    <div>
      <h1>Server Inventory Map</h1>
      <ServerToolbar />        {/* widget */}
      <ServerGrid data={...} /> {/* widget */}
    </div>
  );
}
```

```typescript
// ❌ 잘못된 구조: route가 widget을 단순 감싸기만 함
// pages/.../inventory-map.tsx
function ServerInventoryMapRoute() {
  return <ServerInventoryMapPage />;  // widget이 페이지 역할
}
```

**Widget의 역할:**
- 페이지 내부의 **재사용 가능한 복합 UI 블록**
- 여러 페이지에서 공유되거나, 페이지를 논리적 단위로 분해할 때 사용
- 예: `ServerGrid`, `ProjectSummaryPanel`, `ServerGroupToolbar`

**Page의 역할:**
- 데이터 fetching 및 에러/로딩 처리 (Suspense boundary)
- 페이지 레이아웃 구성
- Widget 조합 및 상태 전달

### Page 코드 리뷰 (필수)

Page 또는 Route 파일 구현 후에는 **반드시 `page-code-reviewer` 에이전트를 실행**하여 FSD 아키텍처 준수 여부를 검증하고 자동 수정합니다.

```bash
# 변경된 page 파일 리뷰 (git diff 기반)
Task(subagent_type: "page-code-reviewer")

# 특정 파일/폴더 리뷰
Task(subagent_type: "page-code-reviewer", prompt: "pages/_authenticated/ws/$wsid/_workspace/server/")
```

**검증 항목:**
- Page가 Widget을 단순 감싸기만 하는지 (Critical)
- FSD 계층 위반 여부 (High)
- Public API(index.ts) 사용 여부 (High)
- Store 위치 적절성 (Medium)

## Styling (Tailwind + shadcn)

### 컴포넌트 사용

```typescript
// shadcn 컴포넌트는 shared/components/ui에 위치
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';

// CVA를 활용한 variants
<Button variant="destructive" size="lg">Delete</Button>
```

### 스타일링 규칙

1. **Tailwind 유틸리티 클래스 사용** - 인라인 스타일이나 CSS 파일 지양
2. **shadcn 컴포넌트 우선** - 커스텀 UI 컴포넌트 직접 생성 지양
3. **cn() 헬퍼 사용** - 조건부 클래스 병합 시

```typescript
import { cn } from '@/shared/lib/utils';

<div className={cn(
  'flex items-center',
  isActive && 'bg-primary',
  className
)} />
```

## API Patterns

@.docs/agents/api-patterns.md 참조.

## State Management

### 서버 상태: TanStack Query + Suspense (기본 패턴)

**useSuspenseQuery + Suspense 컴포넌트를 기본으로 사용합니다.**

```typescript
import { Suspense } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';

// ✅ 기본 패턴: useSuspenseQuery + Suspense
function UserProfile({ userId }: { userId: string }) {
  const { data } = useSuspenseQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  // data는 항상 존재 (undefined 체크 불필요)
  return <div>{data.name}</div>;
}

// 부모 컴포넌트에서 Suspense로 감싸기
function UserPage() {
  return (
    <Suspense fallback={<UserProfileSkeleton />}>
      <UserProfile userId="123" />
    </Suspense>
  );
}
```

### Suspense + ErrorBoundary 조합

```typescript
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

// ✅ 권장: ErrorBoundary + Suspense 조합
function UserSection() {
  return (
    <ErrorBoundary fallback={<ErrorMessage />}>
      <Suspense fallback={<Loading />}>
        <UserProfile />
      </Suspense>
    </ErrorBoundary>
  );
}

// 또는 공통 Wrapper 컴포넌트 사용
function AsyncBoundary({
  children,
  loading,
  error
}: {
  children: React.ReactNode;
  loading: React.ReactNode;
  error: React.ReactNode;
}) {
  return (
    <ErrorBoundary fallback={error}>
      <Suspense fallback={loading}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}
```

### 여러 쿼리 병렬 실행

```typescript
import { useSuspenseQueries } from '@tanstack/react-query';

function Dashboard() {
  const [userQuery, projectsQuery] = useSuspenseQueries({
    queries: [
      { queryKey: ['user'], queryFn: fetchUser },
      { queryKey: ['projects'], queryFn: fetchProjects },
    ],
  });

  // 두 데이터 모두 존재 보장
  return (
    <div>
      <h1>{userQuery.data.name}</h1>
      <ProjectList projects={projectsQuery.data} />
    </div>
  );
}
```

### useQuery 사용 (예외 케이스)

로딩/에러 상태를 컴포넌트 내에서 직접 처리해야 하는 경우에만 사용:

```typescript
// ⚠️ 예외적 사용: 로딩 상태를 컴포넌트 내에서 처리해야 할 때
const { data, isLoading, error } = useQuery({
  queryKey: ['optional-data'],
  queryFn: fetchOptionalData,
  enabled: shouldFetch, // 조건부 fetch가 필요한 경우
});

if (isLoading) return <Spinner />;
if (error) return <Error />;
```

### Mutation

```typescript
const mutation = useMutation({
  mutationFn: updateUser,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['user'] });
  },
  onError: (error) => {
    // ⚠️ 에러 처리 필수
    toast.error(error.message);
  },
});
```

### 클라이언트 상태: Jotai

```typescript
import { atom, useAtom } from 'jotai';

// Atom 정의
const themeAtom = atom<'light' | 'dark'>('light');

// 사용
const [theme, setTheme] = useAtom(themeAtom);
```

## React 19 Features

### use() Hook

```typescript
// Promise를 직접 읽기
const data = use(fetchData());

// Context 읽기
const theme = use(ThemeContext);
```

### Form Actions (클라이언트) + Zod Validation

폼의 `action` prop에 함수를 전달하여 클라이언트에서 폼 제출을 처리합니다.
**⚠️ 반드시 Zod를 사용하여 폼 데이터를 검증해야 합니다.**

```typescript
import { z } from 'zod';

// 1. Zod 스키마 정의
const searchSchema = z.object({
  query: z.string().min(1, '검색어를 입력하세요').max(100),
});

// 2. 타입 추론
type SearchFormData = z.infer<typeof searchSchema>;

function SearchForm() {
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(formData: FormData) {
    // 3. Zod로 validation
    const result = searchSchema.safeParse({
      query: formData.get('query'),
    });

    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    // 4. 검증된 데이터 사용
    setError(null);
    console.log(`검색어: ${result.data.query}`);
  }

  return (
    <form action={handleSubmit}>
      <input name="query" />
      {error && <p className="text-red-500">{error}</p>}
      <button type="submit">검색</button>
    </form>
  );
}
```

복잡한 폼 예시:

```typescript
const userFormSchema = z.object({
  email: z.string().email('유효한 이메일을 입력하세요'),
  password: z.string().min(8, '비밀번호는 8자 이상이어야 합니다'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: '비밀번호가 일치하지 않습니다',
  path: ['confirmPassword'],
});

function SignupForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleSubmit(formData: FormData) {
    const result = userFormSchema.safeParse({
      email: formData.get('email'),
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    // API 호출 등 처리
  }

  return (
    <form action={handleSubmit}>
      <input name="email" type="email" />
      {errors.email && <span>{errors.email}</span>}

      <input name="password" type="password" />
      {errors.password && <span>{errors.password}</span>}

      <input name="confirmPassword" type="password" />
      {errors.confirmPassword && <span>{errors.confirmPassword}</span>}

      <button type="submit">가입</button>
    </form>
  );
}
```

## Testing

### Unit/Component Tests (Vitest)

```typescript
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });
});
```

### Storybook

```typescript
// Button.stories.tsx (컴포넌트와 같은 위치에 배치)
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: 'default',
    children: 'Button',
  },
};
```

### E2E Tests (Playwright)

```typescript
import { test, expect } from '@playwright/test';

test('login flow', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[name="email"]', 'test@example.com');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/dashboard');
});
```

## Critical Guidelines

### 필수 규칙

1. **FSD 계층 엄격 준수** - 상위 레이어에서 하위 레이어만 import
2. **shadcn 컴포넌트 사용** - 커스텀 UI 직접 생성 금지
3. **useSuspenseQuery 기본 사용** - Suspense 컴포넌트와 함께 사용
4. **Mutation 에러 처리** - `onError` 콜백 필수 구현
5. **Form Validation 필수** - Zod 스키마로 항상 검증
6. **Storybook 필수** - 모든 UI 컴포넌트는 `.stories.tsx` 파일 동반

### 금지 사항

```typescript
// ❌ Legacy 라이브러리 사용 금지
import styled from 'styled-components';
import { useSelector } from 'react-redux';

// ❌ PandaCSS 사용 금지 (이 프로젝트는 Tailwind 전용)
import { css } from 'styled-system/css';

// ❌ packages/design-system 사용 금지 (독립적으로 구축)
import { Button } from '@whatap/design-system';
```

### 권장 사항

- Prettier 실행 후 커밋
- 타입 안정성을 위해 `strict: true` 유지
- 컴포넌트는 가능한 작게 유지
- 복잡한 로직은 커스텀 훅으로 분리

## Monorepo Structure

```
whatap-front-workspace/
├── apps/
│   └── whatap-workspace/    # 🚀 Active (이 가이드의 주 대상)
│
├── packages/
│   ├── search-query/        # 쿼리 파싱
│   └── ai-chatbot/          # AI 기능
│
└── .cursor/rules/           # 개발 가이드라인
```

## Quick Start for New Developers

1. **환경 설정**
   ```bash
   pnpm install
   cp apps/whatap-workspace/.env.example apps/whatap-workspace/.env
   ```

2. **개발 서버 실행**
   ```bash
   pnpm --filter whatap-workspace dev
   ```

3. **핵심 코드 파악** (순서대로)
   - `src/app/main.tsx` - 앱 진입점
   - `src/app/providers/` - 전역 Provider 설정
   - `src/features/auth/` - 인증 로직
   - `src/shared/api/` - API 클라이언트 패턴
   - `src/pages/` - 라우팅 구조

4. **Storybook으로 컴포넌트 확인**
   ```bash
   pnpm --filter whatap-workspace storybook
   ```
