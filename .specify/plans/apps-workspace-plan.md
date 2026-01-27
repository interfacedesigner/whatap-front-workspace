# apps/workspace React 프로젝트 생성 계획

## 요약
- **위치**: `apps/workspace`
- **기술 스택**: React 19, TanStack Router, Tailwind CSS, Biome, Vite
- **아키텍처**: FSD (Feature-Sliced Design)
- **특이사항**: design-system 토큰을 Tailwind config에 매핑하여 사용

---

## 1. 디렉토리 구조

```
apps/workspace/
├── index.html
├── package.json
├── tailwind.config.ts
├── postcss.config.cjs
├── biome.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
└── src/
    ├── main.tsx
    ├── main.css                  # Tailwind directives + layer ordering
    ├── App.tsx
    ├── routeTree.gen.ts          # TanStack Router 자동 생성
    ├── routes/
    │   ├── __root.tsx
    │   └── index.tsx
    ├── 1_app/
    │   └── providers/
    ├── 2_pages/
    ├── 3_widgets/
    ├── 4_features/
    ├── 5_entities/
    └── 6_shared/
        ├── api/
        ├── lib/
        ├── ui/
        └── config/
```

---

## 2. 생성할 파일 목록

### 2.1 package.json
```json
{
  "name": "workspace",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "volta": { "extends": "../../package.json" },
  "engines": { "node": ">=22.19.0" },
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "lint": "biome check",
    "lint:fix": "biome check --write",
    "format": "biome format --write ."
  },
  "dependencies": {
    "@tanstack/react-query": "^5.84.0",
    "@tanstack/react-router": "^1.120.0",
    "@whatap/design-system": "workspace:*",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@biomejs/biome": "^1.9.4",
    "@tanstack/react-router-devtools": "^1.120.0",
    "@tanstack/router-plugin": "^1.120.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^4.3.4",
    "@whatap/configuration": "workspace:*",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.17",
    "typescript": "catalog:",
    "vite": "catalog:",
    "vite-tsconfig-paths": "^4.3.2"
  }
}
```

### 2.2 tsconfig.json
```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

### 2.3 tsconfig.app.json
```json
{
  "extends": "@whatap/configuration/tsconfig.react.json",
  "compilerOptions": {
    "baseUrl": "src",
    "paths": {
      "@/*": ["*"]
    }
  },
  "include": ["src"]
}
```

### 2.4 tsconfig.node.json
```json
{
  "extends": "@whatap/configuration/tsconfig.node.json",
  "compilerOptions": {
    "noEmit": true
  },
  "include": ["vite.config.ts", "tailwind.config.ts", "postcss.config.cjs"]
}
```

### 2.5 vite.config.ts
```typescript
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    TanStackRouterVite({
      target: 'react',
      autoCodeSplitting: true,
      routesDirectory: './src/routes',
      generatedRouteTree: './src/routeTree.gen.ts',
    }),
    react(),
    tsconfigPaths(),
  ],
  build: {
    target: ['es2020', 'chrome84'],
  },
});
```

### 2.6 tailwind.config.ts
```typescript
import type { Config } from 'tailwindcss';

// design-system 토큰 매핑 (필요시 확장)
const designSystemTokens = {
  spacing: {
    'space-4xs': '2px',
    'space-3xs': '4px',
    'space-2xs': '6px',
    'space-xs': '8px',
    'space-s': '12px',
    'space-m': '16px',
    'space-l': '20px',
    'space-xl': '24px',
    'space-2xl': '32px',
    'space-3xl': '40px',
  },
  borderRadius: {
    'radius-xs': '2px',
    'radius-s': '4px',
    'radius-m': '8px',
    'radius-l': '12px',
    'radius-xl': '16px',
    'radius-full': '9999px',
  },
};

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  // design-system 컴포넌트와 충돌 방지를 위한 isolation
  important: '#workspace-root',
  corePlugins: {
    preflight: false, // design-system의 reset 사용
  },
  theme: {
    extend: {
      spacing: designSystemTokens.spacing,
      borderRadius: designSystemTokens.borderRadius,
      // 필요시 colors, fontSize 등 추가 매핑
    },
  },
  plugins: [],
} satisfies Config;
```

### 2.7 postcss.config.cjs
```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

### 2.8 biome.json
```json
{
  "$schema": "https://biomejs.dev/schemas/1.9.4/schema.json",
  "vcs": { "enabled": true, "clientKind": "git", "useIgnoreFile": true },
  "files": {
    "ignoreUnknown": false,
    "ignore": ["src/routeTree.gen.ts", "dist/**"]
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100
  },
  "organizeImports": { "enabled": true },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "correctness": { "noUnusedImports": "error" },
      "style": { "noNonNullAssertion": "off" }
    }
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "jsxQuoteStyle": "double",
      "semicolons": "always",
      "trailingCommas": "all"
    }
  }
}
```

### 2.9 index.html
```html
<!doctype html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Workspace</title>
  </head>
  <body>
    <div id="workspace-root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```
**Note:** `id="workspace-root"`로 Tailwind isolation 적용

### 2.10 src/main.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 2.11 src/main.tsx
```typescript
import { DesignSystemProvider } from '@whatap/design-system';
import React from 'react';
import ReactDOM from 'react-dom/client';

import './main.css';
import App from './App';

ReactDOM.createRoot(document.getElementById('workspace-root')!).render(
  <React.StrictMode>
    <DesignSystemProvider theme="light" locale="ko">
      <App />
    </DesignSystemProvider>
  </React.StrictMode>,
);
```

### 2.12 src/App.tsx
```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createRouter } from '@tanstack/react-router';

import { routeTree } from './routeTree.gen';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60 * 5, retry: 1 },
  },
});

const router = createRouter({
  routeTree,
  context: { queryClient },
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
```

### 2.13 src/routes/__root.tsx
```typescript
import { QueryClient } from '@tanstack/react-query';
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router';
import { lazy, Suspense } from 'react';

interface RouterContext {
  queryClient: QueryClient;
}

const TanStackRouterDevtools = import.meta.env.PROD
  ? () => null
  : lazy(() =>
      import('@tanstack/react-router-devtools').then((res) => ({
        default: res.TanStackRouterDevtools,
      })),
    );

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <Outlet />
      <Suspense>
        <TanStackRouterDevtools position="bottom-right" />
      </Suspense>
    </>
  );
}
```

### 2.14 src/routes/index.tsx
```typescript
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  return (
    <div className="p-space-m">
      <h1 className="text-xl font-bold">Welcome to Workspace</h1>
      <p className="text-gray-600 mt-space-s">
        Built with React 19, TanStack Router, and Tailwind CSS.
      </p>
    </div>
  );
}
```

---

## 3. 실행 순서

1. `apps/workspace` 디렉토리 생성
2. 설정 파일 생성 (package.json, tsconfig 파일들, vite.config.ts, tailwind.config.ts, postcss.config.cjs, biome.json)
3. index.html 생성 (`id="workspace-root"` 중요)
4. FSD 폴더 구조 생성 (1_app ~ 6_shared)
5. 엔트리 파일 생성 (main.tsx, main.css, App.tsx)
6. TanStack Router routes 생성 (__root.tsx, index.tsx)
7. `pnpm install` 실행
8. `pnpm --filter workspace dev` 로 개발 서버 실행 및 확인

---

## 4. Tailwind + design-system 통합 전략

### 4.1 Isolation 설정
- `important: '#workspace-root'` - Tailwind 스타일을 workspace-root 내부로 제한
- `preflight: false` - design-system의 CSS reset 사용

### 4.2 토큰 매핑
- design-system의 spacing, radius 토큰을 tailwind.config.ts에 매핑
- 사용: `p-space-m`, `rounded-radius-m` 등

### 4.3 Layer 충돌 방지
- design-system 컴포넌트는 내부 PandaCSS 스타일 사용
- 앱 레벨에서는 Tailwind utility 클래스 사용
- 두 시스템이 같은 요소에 적용되지 않도록 분리

---

## 5. 주의 사항

| 항목 | 설명 |
|------|------|
| React 19 | design-system은 React 18 기준, 호환성 테스트 필요 |
| TanStack Router | file-based routing 사용, routeTree.gen.ts 자동 생성 |
| Biome | ESLint 대신 사용, routeTree.gen.ts 무시 설정 |
| Tailwind isolation | `#workspace-root`로 스코프 제한 |
| 토큰 동기화 | design-system 업데이트 시 tailwind.config.ts 수동 동기화 필요 |

---

## 6. 참조 파일

- `apps/enterprise-manager/package.json` - 기존 앱 패턴 참조
- `packages/ai-chatbot/tailwind.config.js` - Tailwind isolation 패턴
- `packages/design-system/src/foundation/spacing/index.ts` - spacing 토큰 원본
- `packages/configuration/tsconfig.react.json` - TypeScript 설정 상속
