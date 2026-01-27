# Micro Frontend Architecture Design Document

> **Version**: 1.1.0
> **Date**: 2026-01-20
> **Author**: Frontend Architecture Team
> **Status**: Draft - POC Phase
> **Reviewer**: Frontend Architect

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Current State Analysis](#2-current-state-analysis)
3. [Architecture Overview](#3-architecture-overview)
4. [Message Bus Design](#4-message-bus-design)
5. [Technical Specifications](#5-technical-specifications)
6. [Implementation Plan](#6-implementation-plan)
7. [POC Scope & Success Criteria](#7-poc-scope--success-criteria)
8. [Risk Assessment & Mitigation](#8-risk-assessment--mitigation)
9. [Appendix](#9-appendix)

---

## 1. Executive Summary

### 1.1 Background

WhaTap Front Workspace는 현재 모놀리식 아키텍처로 운영되고 있으며, 다음과 같은 과제에 직면해 있습니다:

| 과제 | 현재 상황 | 영향 |
|------|----------|------|
| **전체 빌드/배포** | 작은 변경에도 전체 앱 빌드 필요 | 5-15분 소요, 배포 지연 |
| **팀 간 의존성** | 도메인별 팀이 독립적 배포 불가 | 릴리즈 병목, 협업 오버헤드 |
| **레거시 부담** | whatap-front의 복잡한 의존성 | 점진적 현대화 어려움 |
| **확장성** | 새 기능 추가 시 복잡도 증가 | AI Chatbot 등 통합 어려움 |

### 1.2 Goals

| 목표 | 설명 | 우선순위 |
|------|------|----------|
| **독립 배포** | 도메인/기능별 독립적인 CI/CD 파이프라인 | P0 |
| **팀 자율성** | 각 팀이 기술 스택과 릴리즈 일정을 독립적으로 결정 | P0 |
| **빌드 성능** | 변경된 모듈만 빌드하여 전체 빌드 시간 단축 | P1 |
| **점진적 현대화** | 레거시 코드를 새 스택으로 점진적 마이그레이션 | P1 |

### 1.3 POC Scope

| 항목 | 내용 |
|------|------|
| **Shell (Host)** | `apps/whatap-workspace` - 모던 스택 기반 Shell 앱 |
| **Remote** | `apps/ai-chatbot` - 플로팅 위젯 형태 AI 챗봇 |
| **공유 패키지** | `packages/mf-message-bus` - MF 앱 간 타입 안전 통신 |
| **검증 항목** | 독립 배포, 상태 공유, 앱 간 통신, DX |

### 1.4 Future Vision

POC는 Chatbot 단일 Remote로 시작하지만, 최종 목표는 도메인별 독립 배포 체계 구축입니다.

| Phase | Remote 앱 | 목표 |
|-------|----------|------|
| POC | ai-chatbot | MF 인프라 검증 |
| Phase 2 | apm | 핵심 도메인 분리 |
| Phase 3 | infrastructure, k8s | 모니터링 도메인 확장 |
| Phase 4 | browser, server | 전체 제품군 통합 |

```
whatap-workspace (Shell)
├── APM 모니터링 → Remote 분리 예정
├── Database 모니터링 → Remote 분리 예정
├── K8s 모니터링 → Remote 분리 예정
├── Infrastructure 모니터링 → Remote 분리 예정
├── Browser 모니터링 → Remote 분리 예정
└── AI Chatbot → POC Remote
```

**핵심 가치**: 각 도메인 팀(1-2명)이 독립적으로 기능 개발 및 배포 가능한 구조 확보.

### 1.5 Key Decisions

| 결정 사항 | 선택 | 이유 |
|----------|------|------|
| **통합 방식** | @module-federation/vite | MF v2 스펙 준수, 공식 지원, Rspack 호환성 |
| **Shell App** | whatap-workspace | 모던 스택, 깔끔한 구조 (whatap-front와 완전 별개) |
| **Chatbot 위치** | `apps/ai-chatbot` (신규) | 독립 앱으로 명확한 책임 분리 (whatap-workspace 전용) |
| **CSS 격리** | CSS Modules / Layer | 구현 복잡도 최소화 및 네임스페이스 격리 (Shadow DOM은 추후 검토) |
| **Asset 처리** | Code-level Import | 런타임 Public Path 문제 자동 해결 (번들러 위임) |
| **상태 공유** | 상태 공유 안 함 | 앱 간 결합도 최소화, React Query 인스턴스 분리 |
| **앱 간 통신** | Lightweight Replay Bus | RxJS 의존성 없이 레이스 컨디션 해결 및 타입 안전 확보 |

> **Note**: whatap-workspace는 whatap-front와 완전히 별개의 앱입니다. 필요시 whatap-front의 컴포넌트를 복사하여 사용할 수 있으나, 코드베이스는 독립적으로 유지됩니다.

---

## 2. Current State Analysis

### 2.1 Monorepo Structure

```
whatap-front-workspace/
├── apps/
│   ├── whatap-front/          # Main app (Webpack prod, Vite dev)
│   │   └── 빌드: 5-15분, 레거시 의존성 368개
│   └── whatap-workspace/      # New app (Pure Vite) ← Shell 후보
│       └── 빌드: ~30초, 의존성 21개
│
├── packages/
│   ├── design-system/         # PandaCSS 기반 UI 컴포넌트
│   ├── ai-chatbot/            # Vanilla JS 챗봇 라이브러리
│   ├── ai-sdk/                # AI SDK
│   ├── search-query/          # 쿼리 파서
│   └── configuration/         # 공유 설정
│
└── pnpm-workspace.yaml        # pnpm 10.20.0 + Turborepo 2.0.4
```

### 2.2 Technology Stack Comparison

| Aspect | whatap-front | whatap-workspace | ai-chatbot (현재) |
|--------|--------------|------------------|-------------------|
| **Framework** | React 18.3 | React 18.3 | **Vanilla JS** |
| **Build Tool** | Webpack (prod) / Vite (dev) | Vite 7.2.7 | Vite (lib mode) |
| **Routing** | React Router v6 | TanStack Router v1.120 | N/A |
| **State** | Redux + TanStack Query | TanStack Query + Context | Custom Object |
| **Styling** | PandaCSS | PandaCSS | Tailwind CSS |
| **i18n** | Custom | Custom Context | Built-in (16 langs) |

### 2.3 Current ai-chatbot Analysis

```javascript
// packages/ai-chatbot/src/main.js - 현재 구조 (2,698 lines)
export function initializeChatbot({ baseUrl } = {}) { ... }
export function showChatbotDialog() { ... }
export function hideChatbotDialog() { ... }

// 내부 상태 관리 (Vanilla JS)
const chatStore = {
  messages: [],
  isLoading: false,
  sendMessage(text) { ... },
  // DOM 직접 조작
};
```

**특징:**
- Vanilla JavaScript로 작성
- DOM 직접 조작 (`createElement`, `appendChild`)
- 자체 상태 관리 시스템
- SSE 스트리밍 지원
- html2canvas로 스크린샷 캡처

---

## 3. Architecture Overview

### 3.1 Target Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         CDN (whatap-static.io)                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │                    Message Bus (@whatap/mf-message-bus)           │ │
│  │              Zod-validated Pub/Sub Communication Layer            │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│         ▲                    ▲                    ▲                    │
│         │ publish/subscribe  │                    │                    │
│         │                    │                    │                    │
│  ┌──────┴──────┐     ┌──────┴──────┐     ┌──────┴──────┐             │
│  │    Shell    │     │   Chatbot   │     │  APM/DB/K8s │             │
│  │   (Host)    │     │  (Remote)   │     │  (Future)   │             │
│  │             │     │             │     │             │             │
│  │ workspace/  │     │ ai-chatbot/ │     │   domain/   │             │
│  └──────┬──────┘     └──────┬──────┘     └─────────────┘             │
│         │                   │                                         │
│         │ Module Federation │                                         │
│         │ (Runtime Load)    │                                         │
│         └───────────────────┘                                         │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

URLs:
- Shell:   https://workspace.whatap.io
- Chatbot: https://chatbot.whatap.io/remoteEntry.js
- APM:     https://apm.whatap.io/remoteEntry.js (Future)
```

### 3.2 Application Roles

| App | Role | 책임 |
|-----|------|------|
| `apps/whatap-workspace` | **Shell (Host)** | 라우팅, 레이아웃, 공유 컨텍스트, Remote 로딩 |
| `apps/ai-chatbot` | **Remote** | 플로팅 챗봇 UI, AI 통신, 독립 배포 |
| `apps/apm` (향후) | **Remote** | APM 도메인 기능 |
| `apps/database` (향후) | **Remote** | Database 도메인 기능 |

### 3.3 Package Roles

| Package | Role | 사용처 |
|---------|------|--------|
| `packages/mf-message-bus` | **MF 통신** | 모든 MF 앱 |
| `packages/ai-chatbot` | **Legacy Lib** | whatap-front (레거시) |
| `packages/design-system` | **UI 컴포넌트** | 모든 앱 (Shared) |

### 3.4 Module Federation Strategy

**선택: Vite Module Federation** (`@originjs/vite-plugin-federation`)

| 방식 | 장점 | 단점 | 선택 |
|------|------|------|------|
| **Module Federation** | Runtime 통합, 공유 의존성 | 설정 복잡 | ✅ |
| iframe | 완전 격리, 간단 | UX 제약, 통신 복잡 | ❌ |
| Web Components | 프레임워크 독립 | 복잡도 높음 | ❌ |
| npm Package | 빌드 타임 통합 | 독립 배포 불가 | ❌ |

**선택 이유:**
- whatap-workspace가 이미 Vite 기반
- CDN 정적 호스팅과 호환
- Runtime에서 원격 모듈 로드 가능
- 공유 의존성으로 번들 최적화

---

## 4. Message Bus Design

### 4.1 Overview

모든 MF 앱 간 **타입 안전한 통신**을 위한 Pub/Sub 메시지 버스입니다.

```
┌─────────────────────────────────────────────────────────────────┐
│                      @whatap/mf-message-bus                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐        │
│  │   Schema    │    │  Message    │    │   React     │        │
│  │   (Zod)     │───▶│    Bus      │◀───│   Hooks     │        │
│  └─────────────┘    └─────────────┘    └─────────────┘        │
│        │                   │                   │               │
│        ▼                   ▼                   ▼               │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │              CustomEvent (window)                        │  │
│  │              'mf:message'                                │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

특징:
- Zod 스키마로 런타임 타입 검증
- Topic 기반 Pub/Sub
- 1:1, 1:N, Broadcast 지원
- Request-Response 패턴 지원
```

### 4.2 Late Subscriber 처리

Remote 앱이 로드되기 전에 Shell이 컨텍스트를 발행하면 메시지가 유실됩니다.

```
Timeline:
─────────────────────────────────────────────────────►

[Shell 로드]
     │
     ├─ publish('context.project.changed', { projectCode: 'P001' })
     │
     │                    [Chatbot Remote 로드 시작]
     │                              │
     │                              └─ ❌ 메시지 이미 지나감
```

**해결책: Props를 통한 초기값 전달**

Remote 컴포넌트 로드 시 Shell이 현재 컨텍스트를 props로 직접 전달합니다.

```tsx
// Shell에서 Remote 로드
<FloatingChatbot
  baseUrl={import.meta.env.VITE_API_URL}
  initialContext={{
    projectCode: currentProject.pcode,
    locale: currentLocale,
    theme: currentTheme,
  }}
/>
```

```tsx
// Remote에서 초기값 수신
interface FloatingChatbotProps {
  baseUrl: string;
  initialContext?: {
    projectCode?: string;
    locale?: string;
    theme?: string;
  };
}

function FloatingChatbot({ baseUrl, initialContext }: FloatingChatbotProps) {
  const [projectCode, setProjectCode] = useState(initialContext?.projectCode);

  // 이후 변경은 Message Bus로 수신
  useSubscribe('context.project.changed', (payload) => {
    setProjectCode(payload.projectCode);
  });

  // ...
}
```

이 방식은 Message Bus의 복잡도를 높이지 않으면서 초기 상태 동기화 문제를 해결합니다.

### 4.3 Message Envelope Schema

```typescript
// packages/mf-message-bus/src/schema.ts
import { z } from 'zod';

export const MessageEnvelope = z.object({
  // 메시지 식별
  id: z.string().uuid(),
  timestamp: z.number(),

  // 라우팅
  source: z.string(),      // 발신 앱: 'shell', 'chatbot', 'apm'
  target: z.union([
    z.string(),            // 특정 앱: 'chatbot'
    z.literal('*'),        // 브로드캐스트
  ]),

  // 페이로드
  topic: z.string(),       // 'context.project.changed', 'chatbot.send'
  payload: z.unknown(),    // Topic별 스키마로 검증

  // 옵션
  replyTo: z.string().uuid().optional(),
});

export type MessageEnvelope = z.infer<typeof MessageEnvelope>;
```

### 4.3 Topic Definitions

#### Context Topics (Shell → All)

```typescript
export const ContextTopics = {
  'context.project.changed': z.object({
    projectCode: z.string(),
    projectName: z.string(),
    productType: z.enum(['APM', 'DB', 'K8S', 'SERVER', 'BROWSER']),
  }),

  'context.auth.changed': z.object({
    isAuthenticated: z.boolean(),
    userId: z.string().optional(),
  }),

  'context.locale.changed': z.object({
    locale: z.enum(['ko', 'en', 'ja', 'zh']),
  }),

  'context.theme.changed': z.object({
    theme: z.enum(['light', 'dark', 'system']),
  }),
} as const;
```

#### Chatbot Topics

```typescript
export const ChatbotTopics = {
  'chatbot.open': z.object({}),

  'chatbot.close': z.object({}),

  'chatbot.send': z.object({
    message: z.string().min(1),
    context: z.object({
      pageUrl: z.string().optional(),
      selectedText: z.string().optional(),
      screenshot: z.string().optional(),
    }).optional(),
  }),

  'chatbot.response': z.object({
    messageId: z.string(),
    content: z.string(),
    status: z.enum(['streaming', 'complete', 'error']),
  }),

  'chatbot.ready': z.object({
    version: z.string(),
  }),
} as const;
```

#### Navigation Topics

```typescript
export const NavigationTopics = {
  'nav.request': z.object({
    path: z.string(),
    params: z.record(z.string()).optional(),
  }),

  'nav.changed': z.object({
    path: z.string(),
    params: z.record(z.string()).optional(),
  }),
} as const;
```

### 4.4 Message Bus Implementation

```typescript
// packages/mf-message-bus/src/bus.ts
const BUS_EVENT = 'mf:message';

class MFMessageBus {
  private appId: string;
  private listeners = new Map<string, Set<Function>>();

  constructor(appId: string) {
    this.appId = appId;
    this.initGlobalListener();
  }

  private initGlobalListener() {
    window.addEventListener(BUS_EVENT, (e: CustomEvent) => {
      const result = MessageEnvelope.safeParse(e.detail);
      if (!result.success) return;

      const envelope = result.data;

      // 자기 자신이 보낸 메시지는 무시
      if (envelope.source === this.appId) return;

      // 타겟 필터링
      if (envelope.target !== '*' && envelope.target !== this.appId) return;

      // Topic 스키마 검증
      const topicSchema = AllTopics[envelope.topic as TopicName];
      if (topicSchema) {
        const payloadResult = topicSchema.safeParse(envelope.payload);
        if (!payloadResult.success) return;
      }

      // 리스너 호출
      this.listeners.get(envelope.topic)?.forEach(fn =>
        fn(envelope.payload, envelope)
      );
    });
  }

  /** 메시지 발행 */
  publish<T extends TopicName>(
    topic: T,
    payload: TopicPayload<T>,
    options: { target?: string } = {}
  ): string {
    const schema = AllTopics[topic];
    const result = schema.safeParse(payload);
    if (!result.success) {
      throw new Error(`Invalid payload for topic: ${topic}`);
    }

    const envelope: MessageEnvelope = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      source: this.appId,
      target: options.target ?? '*',
      topic,
      payload: result.data,
    };

    window.dispatchEvent(new CustomEvent(BUS_EVENT, { detail: envelope }));
    return envelope.id;
  }

  /** 메시지 구독 */
  subscribe<T extends TopicName>(
    topic: T,
    listener: (payload: TopicPayload<T>, envelope: MessageEnvelope) => void
  ): () => void {
    if (!this.listeners.has(topic)) {
      this.listeners.set(topic, new Set());
    }
    this.listeners.get(topic)!.add(listener);
    return () => this.listeners.get(topic)?.delete(listener);
  }

  /** Request-Response 패턴 */
  async request<T extends TopicName, R extends TopicName>(
    topic: T,
    payload: TopicPayload<T>,
    responseTopic: R,
    options: { target?: string; timeout?: number } = {}
  ): Promise<TopicPayload<R>> {
    const { target, timeout = 5000 } = options;

    return new Promise((resolve, reject) => {
      const messageId = this.publish(topic, payload, { target });

      const timer = setTimeout(() => {
        unsubscribe();
        reject(new Error(`Request timeout: ${topic}`));
      }, timeout);

      const unsubscribe = this.subscribe(responseTopic, (response, envelope) => {
        if (envelope.replyTo === messageId) {
          clearTimeout(timer);
          unsubscribe();
          resolve(response as TopicPayload<R>);
        }
      });
    });
  }
}

// 싱글톤 팩토리
export function createMessageBus(appId: string): MFMessageBus { ... }
export function getMessageBus(): MFMessageBus { ... }
```

### 4.5 React Hooks

```typescript
// packages/mf-message-bus/src/react.ts
import { useEffect, useCallback } from 'react';
import { getMessageBus } from './bus';

export function useMessageBus() {
  const bus = getMessageBus();

  const publish = useCallback(<T extends TopicName>(
    topic: T,
    payload: TopicPayload<T>,
    options?: { target?: string }
  ) => bus.publish(topic, payload, options), [bus]);

  return { publish, bus };
}

export function useSubscribe<T extends TopicName>(
  topic: T,
  handler: (payload: TopicPayload<T>) => void
) {
  const bus = getMessageBus();

  useEffect(() => {
    return bus.subscribe(topic, handler);
  }, [bus, topic, handler]);
}
```

### 4.6 Usage Examples

#### Shell에서 컨텍스트 브로드캐스트

```tsx
// apps/whatap-workspace/src/components/ProjectSelector.tsx
import { useMessageBus } from '@whatap/mf-message-bus/react';

function ProjectSelector() {
  const { publish } = useMessageBus();

  const handleProjectChange = (project: Project) => {
    // 모든 Remote 앱에 브로드캐스트
    publish('context.project.changed', {
      projectCode: project.pcode,
      projectName: project.name,
      productType: project.type,
    });
  };

  return <Select onChange={handleProjectChange} />;
}
```

#### Chatbot에서 컨텍스트 수신

```tsx
// apps/ai-chatbot/src/App.tsx
import { useSubscribe, useMessageBus } from '@whatap/mf-message-bus/react';

function App() {
  const { publish } = useMessageBus();
  const [projectCode, setProjectCode] = useState<string>();

  // 프로젝트 변경 수신
  useSubscribe('context.project.changed', (payload) => {
    setProjectCode(payload.projectCode);
  });

  // 메시지 전송 요청 수신
  useSubscribe('chatbot.send', (payload) => {
    chatStore.sendMessage(payload.message);
    showDialog();
  });

  // 준비 완료 알림
  useEffect(() => {
    publish('chatbot.ready', { version: '1.0.0' });
  }, []);

  return <ChatbotUI projectCode={projectCode} />;
}
```

#### APM에서 Chatbot에 직접 요청 (향후)

```tsx
// apps/apm/src/widgets/ErrorAnalysis.tsx
import { useMessageBus } from '@whatap/mf-message-bus/react';

function ErrorAnalysisButton({ errorLog }: Props) {
  const { publish } = useMessageBus();

  const askAI = () => {
    // APM → Chatbot 직접 통신 (1:1)
    publish('chatbot.send', {
      message: `이 에러를 분석해줘:\n${errorLog}`,
      context: { pageUrl: location.href },
    }, { target: 'chatbot' });

    publish('chatbot.open', {}, { target: 'chatbot' });
  };

  return <Button onClick={askAI}>AI 분석</Button>;
}
```

---

## 5. Technical Specifications

### 5.1 Shell (Host) Configuration

#### Vite Config

```typescript
// apps/whatap-workspace/vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    TanStackRouterVite({
      routesDirectory: './src/fsd/1_app/routes',
      generatedRouteTree: './src/fsd/1_app/routeTree.gen.ts',
    }),
    federation({
      name: 'shell',

      remotes: {
        chatbot: {
          external: 'Promise.resolve(window.__remotes__.chatbot)',
          from: 'vite',
          externalType: 'promise',
        },
      },

      shared: {
        react: { singleton: true, requiredVersion: '^18.3.1' },
        'react-dom': { singleton: true, requiredVersion: '^18.3.1' },
        '@tanstack/react-query': { singleton: true },
        '@whatap/mf-message-bus': { singleton: true },
      },
    }),
  ],

  build: {
    modulePreload: false,
    target: 'esnext',
    minify: 'esbuild',
    cssCodeSplit: false,
  },
});
```

#### Remote Entry Loading

```html
<!-- apps/whatap-workspace/index.html -->
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <title>WhaTap Workspace</title>
  <script>
    window.__remotes__ = {
      chatbot: () => import('https://chatbot.whatap.io/remoteEntry.js')
        .then(m => m.default || m)
        .catch(err => {
          console.warn('[MF] Chatbot load failed:', err);
          return { get: () => Promise.resolve(() => null) };
        }),
    };
  </script>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
</html>
```

#### Shell Entry Point

```tsx
// apps/whatap-workspace/src/main.tsx
import { createMessageBus } from '@whatap/mf-message-bus';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { routeTree } from '@app/routeTree.gen';

// Message Bus 초기화
createMessageBus('shell');

const router = createRouter({ routeTree });

ReactDOM.createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />
);
```

### 5.2 Remote (Chatbot) Configuration

#### Vite Config

```typescript
// apps/ai-chatbot/vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'chatbot',
      filename: 'remoteEntry.js',

      exposes: {
        './App': './src/App.tsx',
        './FloatingChatbot': './src/components/FloatingChatbot.tsx',
      },

      shared: {
        react: { singleton: true, requiredVersion: '^18.3.1' },
        'react-dom': { singleton: true, requiredVersion: '^18.3.1' },
        '@whatap/mf-message-bus': { singleton: true },
      },
    }),
  ],

  build: {
    target: 'esnext',
    minify: 'esbuild',
    cssCodeSplit: false,
  },
});
```

#### Chatbot Entry Point

```tsx
// apps/ai-chatbot/src/main.tsx
import { createMessageBus } from '@whatap/mf-message-bus';
import App from './App';

// Message Bus 초기화
createMessageBus('chatbot');

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
```

#### React Wrapper for Vanilla Chatbot

```tsx
// apps/ai-chatbot/src/components/FloatingChatbot.tsx
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useSubscribe, useMessageBus } from '@whatap/mf-message-bus/react';

// Vanilla JS 코어 import
import {
  initializeChatbot,
  showChatbotDialog,
  hideChatbotDialog,
  chatStore,
} from '@whatap/ai-chatbot';

import '@whatap/ai-chatbot/style.css';

interface FloatingChatbotProps {
  baseUrl: string;
}

export function FloatingChatbot({ baseUrl }: FloatingChatbotProps) {
  const { publish } = useMessageBus();
  const initializedRef = useRef(false);

  // Vanilla Chatbot 초기화
  useEffect(() => {
    if (initializedRef.current) return;

    initializeChatbot({ baseUrl });
    initializedRef.current = true;

    // 준비 완료 알림
    publish('chatbot.ready', { version: __VERSION__ });

    return () => {
      initializedRef.current = false;
    };
  }, [baseUrl, publish]);

  // 프로젝트 컨텍스트 동기화
  useSubscribe('context.project.changed', (payload) => {
    chatStore.setProjectCode(payload.projectCode);
  });

  // 로케일 동기화
  useSubscribe('context.locale.changed', (payload) => {
    chatStore.setLocale(payload.locale);
  });

  // 외부에서 메시지 전송 요청
  useSubscribe('chatbot.send', (payload) => {
    chatStore.sendMessage(payload.message);
    showChatbotDialog();
  });

  // 열기/닫기 요청
  useSubscribe('chatbot.open', () => showChatbotDialog());
  useSubscribe('chatbot.close', () => hideChatbotDialog());

  // FAB 버튼 렌더링
  return createPortal(
    <button
      className="chatbot-fab"
      onClick={() => showChatbotDialog()}
      aria-label="AI Assistant"
    >
      <ChatbotIcon />
    </button>,
    document.body
  );
}

export default FloatingChatbot;
```

### 5.3 Shell에서 Remote 로드

```tsx
// apps/whatap-workspace/src/fsd/1_app/routes/__root.tsx
import { Outlet, createRootRoute } from '@tanstack/react-router';
import { Suspense, lazy } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

// Remote 동적 로드
const FloatingChatbot = lazy(() =>
  import('chatbot/FloatingChatbot').catch(() => ({
    default: () => null,
  }))
);

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <div className="app-layout">
      <Outlet />

      {/* AI Chatbot Remote */}
      <ErrorBoundary fallback={<ChatbotFallback />}>
        <Suspense fallback={null}>
          <FloatingChatbot baseUrl={import.meta.env.VITE_API_URL} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

function ChatbotFallback() {
  return (
    <a href="https://support.whatap.io" className="support-link">
      Support
    </a>
  );
}
```

### 5.4 TypeScript Declarations

```typescript
// apps/whatap-workspace/src/types/remotes.d.ts
declare module 'chatbot/FloatingChatbot' {
  import type { ComponentType } from 'react';

  interface FloatingChatbotProps {
    baseUrl: string;
  }

  const FloatingChatbot: ComponentType<FloatingChatbotProps>;
  export default FloatingChatbot;
}

declare module 'chatbot/App' {
  import type { ComponentType } from 'react';
  const App: ComponentType;
  export default App;
}
```

### 5.5 Package Structure

```
packages/mf-message-bus/
├── src/
│   ├── schema.ts          # Zod 스키마 (Envelope + Topics)
│   ├── topics/
│   │   ├── context.ts     # context.* topics
│   │   ├── chatbot.ts     # chatbot.* topics
│   │   ├── navigation.ts  # nav.* topics
│   │   └── index.ts
│   ├── bus.ts             # MessageBus 클래스
│   ├── react.ts           # React hooks
│   └── index.ts
├── package.json
└── tsconfig.json
```

```json
// packages/mf-message-bus/package.json
{
  "name": "@whatap/mf-message-bus",
  "version": "0.0.1",
  "type": "module",
  "exports": {
    ".": "./src/index.ts",
    "./react": "./src/react.ts",
    "./schema": "./src/schema.ts"
  },
  "dependencies": {
    "zod": "^3.23.0"
  },
  "peerDependencies": {
    "react": "^18.3.1"
  }
}
```

### 5.6 Security Configuration

#### CSP Headers (Shell CDN)

```nginx
# nginx 또는 CloudFront Response Headers
Content-Security-Policy:
  default-src 'self';
  script-src 'self' https://chatbot.whatap.io https://*.whatap.io;
  connect-src 'self' https://api.whatap.io wss://api.whatap.io;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob:;
```

#### CORS Headers (Remote CDN)

```nginx
# chatbot.whatap.io 응답 헤더
Access-Control-Allow-Origin: https://workspace.whatap.io
Access-Control-Allow-Methods: GET, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

#### Remote Entry 무결성 (향후 고려)

```html
<!-- SRI(Subresource Integrity) 적용 시 -->
<script
  src="https://chatbot.whatap.io/remoteEntry.js"
  integrity="sha384-..."
  crossorigin="anonymous"
></script>
```

> **Note**: SRI는 remoteEntry.js가 변경될 때마다 해시를 업데이트해야 하므로, 초기에는 적용하지 않고 운영 안정화 후 검토합니다.

---

## 6. Implementation Plan

### 6.0 Phase 0: Technical Validation (Week 0)

POC 착수 전 기술 스택 호환성을 검증합니다. 이 단계에서 블로커가 발견되면 대안을 검토합니다.

```
┌─────────────────────────────────────────────────────────────────────┐
│ Phase 0: Technical Validation (Week 0) - BLOCKING                   │
│ └── Vite 7 + MF 플러그인 호환성 검증, 최소 빌드 테스트               │
└─────────────────────────────────────────────────────────────────────┘
```

#### Checklist

- [ ] `@originjs/vite-plugin-federation` 최신 버전과 Vite 7.2.7 호환성 확인
- [ ] 최소 Shell + 빈 Remote 구성으로 빌드 성공 확인
- [ ] 로컬 환경에서 Remote 동적 로드 테스트
- [ ] CDN 시뮬레이션 (다른 포트에서 Remote 서빙) 테스트

#### 검증 스크립트

```bash
# 1. 플러그인 설치
cd apps/whatap-workspace
pnpm add -D @originjs/vite-plugin-federation

# 2. 최소 설정으로 빌드 테스트
pnpm build

# 3. 빈 Remote 생성 및 빌드
mkdir -p ../mf-test-remote
cd ../mf-test-remote
pnpm init
pnpm add -D vite @vitejs/plugin-react @originjs/vite-plugin-federation
# ... 최소 설정 후 빌드

# 4. 로컬 테스트
pnpm preview  # Shell: 4173
cd ../mf-test-remote && pnpm preview --port 4174  # Remote
```

#### 실패 시 대안

| 문제 | 대안 |
|------|------|
| Vite 7 호환 불가 | Vite 버전 다운그레이드 또는 `@module-federation/vite` 검토 |
| 플러그인 버그 | Webpack MF로 전환 (빌드 도구 이원화) |
| 런타임 로드 실패 | iframe 방식으로 폴백 |

### 6.1 Phase Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│ Phase 1: Foundation (Week 1-2)                                      │
│ └── Message Bus 패키지, MF 플러그인 설정, 빌드 검증                   │
├─────────────────────────────────────────────────────────────────────┤
│ Phase 2: Integration (Week 3-4)                                     │
│ └── apps/ai-chatbot 생성, React Wrapper, 상태 공유 구현              │
├─────────────────────────────────────────────────────────────────────┤
│ Phase 3: Deployment (Week 5-6)                                      │
│ └── CDN 배포 구성, CI/CD 파이프라인, 버전 관리                        │
├─────────────────────────────────────────────────────────────────────┤
│ Phase 4: Validation (Week 7-8)                                      │
│ └── 성능 테스트, DX 검증, 문서화, 팀 온보딩                           │
└─────────────────────────────────────────────────────────────────────┘
```

### 6.2 Phase 1: Foundation

#### Task 1.1: Message Bus 패키지 생성

```bash
mkdir -p packages/mf-message-bus/src/topics
cd packages/mf-message-bus
pnpm init
pnpm add zod
```

**Deliverables:**
- [ ] `packages/mf-message-bus/src/schema.ts`
- [ ] `packages/mf-message-bus/src/bus.ts`
- [ ] `packages/mf-message-bus/src/react.ts`
- [ ] Topic 정의 (context, chatbot, navigation)
- [ ] 단위 테스트

#### Task 1.2: Shell MF 설정

```bash
cd apps/whatap-workspace
pnpm add -D @originjs/vite-plugin-federation
```

**Deliverables:**
- [ ] `vite.config.ts` federation 플러그인 추가
- [ ] 공유 의존성 설정
- [ ] `index.html` Remote loader 추가
- [ ] 빌드 테스트

#### Task 1.3: 로컬 개발 환경

```json
// package.json (root)
{
  "scripts": {
    "dev:mf": "turbo run dev --filter=whatap-workspace --filter=@whatap/ai-chatbot-app"
  }
}
```

### 6.3 Phase 2: Integration

#### Task 2.1: apps/ai-chatbot 생성

```bash
mkdir -p apps/ai-chatbot/src/components
cd apps/ai-chatbot
pnpm init
```

**구조:**
```
apps/ai-chatbot/
├── src/
│   ├── components/
│   │   ├── FloatingChatbot.tsx    # React Wrapper
│   │   └── ChatbotIcon.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
├── index.html
├── vite.config.ts                  # MF Remote 설정
├── package.json
└── tsconfig.json
```

#### Task 2.2: React Wrapper 개발

**Deliverables:**
- [ ] `FloatingChatbot.tsx` - Vanilla JS 래핑
- [ ] Message Bus 연동 (subscribe/publish)
- [ ] 스타일 통합

#### Task 2.3: Shell 통합

**Deliverables:**
- [ ] `__root.tsx`에서 Remote 로드
- [ ] ErrorBoundary, Suspense 적용
- [ ] TypeScript 선언 파일

### 6.4 Phase 3: Deployment

#### Task 3.1: CDN 구조

```
whatap-static.io/
├── workspace/
│   ├── index.html
│   └── assets/
├── chatbot/
│   ├── remoteEntry.js      # ← 짧은 캐시 (60s)
│   └── assets/             # ← 긴 캐시 (immutable)
```

#### Task 3.2: CI/CD Pipeline

```yaml
# .github/workflows/deploy-chatbot.yml
name: Deploy AI Chatbot

on:
  push:
    paths:
      - 'apps/ai-chatbot/**'
      - 'packages/mf-message-bus/**'
    branches: [main]

jobs:
  build-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 10.20.0

      - name: Install & Build
        run: |
          pnpm install --frozen-lockfile
          pnpm --filter @whatap/ai-chatbot-app build

      - name: Deploy to S3
        run: |
          aws s3 sync apps/ai-chatbot/dist s3://whatap-static/chatbot \
            --delete \
            --cache-control "public, max-age=31536000, immutable"

          # remoteEntry.js는 캐시 짧게
          aws s3 cp apps/ai-chatbot/dist/remoteEntry.js \
            s3://whatap-static/chatbot/remoteEntry.js \
            --cache-control "public, max-age=60"

      - name: Invalidate CloudFront
        run: |
          aws cloudfront create-invalidation \
            --distribution-id ${{ secrets.CF_DIST_ID }} \
            --paths "/chatbot/remoteEntry.js"
```

### 6.5 Phase 4: Validation

#### Task 4.1: 성능 테스트
- [ ] 초기 로딩 시간 측정 (LCP)
- [ ] Remote 모듈 로드 시간
- [ ] 번들 사이즈 비교

#### Task 4.2: DX 검증
- [ ] HMR 동작 확인
- [ ] TypeScript 타입 검증
- [ ] 로컬 개발 워크플로우

#### Task 4.3: 문서화
- [ ] 아키텍처 문서 최종화
- [ ] 개발 가이드 작성
- [ ] 트러블슈팅 가이드

---

## 7. POC Scope & Success Criteria

### 7.1 In Scope

| 항목 | 설명 |
|------|------|
| **Message Bus** | `@whatap/mf-message-bus` 패키지 개발 |
| **Shell 설정** | whatap-workspace MF Host 구성 |
| **Remote 설정** | apps/ai-chatbot MF Remote 구성 |
| **React Wrapper** | Vanilla JS chatbot React 래핑 |
| **앱 간 통신** | Shell ↔ Chatbot 메시지 통신 |
| **CDN 배포** | 독립 URL로 배포 |

### 7.2 Out of Scope

| 항목 | 이유 |
|------|------|
| whatap-front MF 전환 | POC 이후 별도 프로젝트 |
| 다른 도메인 Remote화 | APM, DB 등은 POC 성공 후 |
| SSR | 현재 CSR만 지원 |
| E2E 테스트 | 수동 검증으로 대체 |

### 7.3 Performance Baseline 측정

POC 성공 여부를 판단하기 위해 **MF 도입 전** 현재 상태를 먼저 측정합니다.

#### Baseline 측정 방법

```bash
# 1. 현재 whatap-workspace 빌드
pnpm --filter whatap-workspace build

# 2. 번들 사이즈 측정
ls -lh apps/whatap-workspace/dist/assets/*.js

# 3. 빌드 시간 측정
time pnpm --filter whatap-workspace build
```

#### 측정 항목

| 항목 | 측정 방법 | Baseline | 목표 (MF 후) |
|------|----------|----------|--------------|
| **Shell 빌드 시간** | `time pnpm build` | 측정 필요 | +30초 이내 |
| **Shell 번들 크기** | `ls -lh dist/assets/*.js` | 측정 필요 | +20KB 이내 |
| **LCP** | Chrome DevTools | 측정 필요 | +200ms 이내 |
| **Remote 로드 시간** | Performance API | N/A | < 300ms (P95) |

#### 런타임 측정 코드

```typescript
// Shell에서 Remote 로드 시간 측정
const start = performance.now();
const Chatbot = await import('chatbot/FloatingChatbot');
const loadTime = performance.now() - start;
console.log(`[MF] Chatbot loaded in ${loadTime.toFixed(0)}ms`);

// 프로덕션에서는 모니터링 시스템으로 전송
if (import.meta.env.PROD) {
  sendMetric('mf.remote.load', { remote: 'chatbot', duration: loadTime });
}
```

### 7.4 Success Criteria

#### Criterion 1: 독립 배포 ✓
```
□ ai-chatbot 별도 빌드/배포 성공
□ Shell 재배포 없이 Chatbot 업데이트 반영
□ 버전 롤백 가능
```

#### Criterion 2: 앱 간 통신 ✓
```
□ Shell → Chatbot 컨텍스트 전달 (project, locale)
□ 외부에서 Chatbot 열기/메시지 전송
□ Chatbot → Shell 이벤트 전달 (ready, response)
□ 잘못된 메시지 형식 거부 (Zod 검증)
```

#### Criterion 3: DX ✓
```
□ 로컬 개발 시 HMR 동작
□ TypeScript 타입 에러 없음
□ 개발 서버 시작 30초 이내
```

#### Criterion 4: 성능 ✓
```
□ LCP 증가 < 200ms (Baseline 대비)
□ Remote 로드 시간 < 300ms (P95)
□ Shell 번들 증가 < 20KB
□ Chatbot 로드 실패 시 앱 정상 동작 (Graceful degradation)
```

---

## 8. Risk Assessment & Mitigation

### 8.1 Technical Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **Vite MF 플러그인 불안정** | High | Medium | 버전 고정, Webpack MF 대안 준비 |
| **Vanilla JS 래핑 복잡도** | Medium | High | 점진적 React 전환, 명확한 인터페이스 |
| **공유 의존성 버전 충돌** | High | Low | Singleton 설정, 버전 범위 명시 |
| **CSS 스타일 충돌** | Medium | Medium | CSS Layer, Tailwind prefix |
| **런타임 로드 실패** | Medium | Low | Fallback UI, 재시도 로직 |
| **Message Bus 성능** | Low | Low | 이벤트 스로틀링, 필터링 최적화 |

### 8.2 Organizational Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **학습 곡선** | Medium | Medium | 문서화, 페어 프로그래밍 |
| **배포 복잡도 증가** | Medium | High | CI/CD 자동화 |
| **디버깅 어려움** | Medium | Medium | 소스맵, 로깅 강화 |

### 8.3 Fallback Plan

POC 실패 시 대안:

1. **npm 패키지 방식**: 빌드 타임 통합 (독립 배포 포기)
2. **iframe 방식**: 완전 격리 (상태 공유 복잡도 증가)
3. **Script 태그**: 외부 스크립트 로드 (MF 포기)

### 8.4 Rollback Procedure

프로덕션에서 Remote 문제 발생 시 롤백 절차입니다.

#### 즉시 롤백 (< 5분)

Remote 로드 실패 또는 심각한 버그 발생 시:

```bash
# 1. 이전 버전의 remoteEntry.js로 롤백
aws s3 cp s3://whatap-static-backup/chatbot/v1.0.0/remoteEntry.js \
  s3://whatap-static/chatbot/remoteEntry.js

# 2. CloudFront 캐시 무효화
aws cloudfront create-invalidation \
  --distribution-id $CF_DIST_ID \
  --paths "/chatbot/remoteEntry.js"
```

#### Remote 비활성화 (긴급)

Remote 자체를 일시적으로 비활성화:

```typescript
// Shell에서 Remote 비활성화 플래그
// 환경변수 또는 Feature Flag 시스템 활용
const CHATBOT_ENABLED = import.meta.env.VITE_CHATBOT_ENABLED !== 'false';

{CHATBOT_ENABLED && (
  <Suspense fallback={null}>
    <FloatingChatbot />
  </Suspense>
)}
```

#### 버전 관리 전략

```
s3://whatap-static-backup/
└── chatbot/
    ├── v1.0.0/
    │   ├── remoteEntry.js
    │   └── assets/
    ├── v1.1.0/
    └── v1.2.0/  ← current
```

배포 시 이전 3개 버전을 백업으로 유지합니다.

#### 롤백 트리거 조건

| 조건 | 임계값 | 조치 |
|------|--------|------|
| Remote 로드 실패율 | > 5% (5분간) | 자동 알림, 수동 롤백 검토 |
| JS 에러율 증가 | > 10% (이전 대비) | 수동 롤백 검토 |
| LCP 악화 | > 500ms (이전 대비) | 성능 분석 후 판단 |

---

## 9. Appendix

### 9.1 File Structure After POC

```
whatap-front-workspace/
├── apps/
│   ├── whatap-front/               # 기존 유지
│   ├── whatap-workspace/           # Shell (수정)
│   │   ├── src/
│   │   │   ├── fsd/1_app/
│   │   │   │   └── routes/__root.tsx   # Remote 로드
│   │   │   └── types/remotes.d.ts      # 신규
│   │   ├── vite.config.ts              # MF 설정
│   │   └── index.html                  # Remote loader
│   │
│   └── ai-chatbot/                 # 신규 Remote
│       ├── src/
│       │   ├── components/
│       │   │   └── FloatingChatbot.tsx
│       │   ├── App.tsx
│       │   └── main.tsx
│       ├── vite.config.ts
│       └── package.json
│
├── packages/
│   ├── mf-message-bus/             # 신규
│   │   ├── src/
│   │   │   ├── schema.ts
│   │   │   ├── topics/
│   │   │   ├── bus.ts
│   │   │   └── react.ts
│   │   └── package.json
│   │
│   └── ai-chatbot/                 # 기존 유지 (레거시용)
│
├── docs/architecture/
│   └── micro-frontend-design.md    # 본 문서
│
└── .github/workflows/
    ├── deploy-workspace.yml
    └── deploy-chatbot.yml          # 신규
```

### 9.2 References

- [Webpack Module Federation](https://webpack.js.org/concepts/module-federation/)
- [Vite Plugin Federation](https://github.com/originjs/vite-plugin-federation)
- [Zod Documentation](https://zod.dev/)
- [Martin Fowler - Micro Frontends](https://martinfowler.com/articles/micro-frontends.html)

### 9.3 Glossary

| 용어 | 설명 |
|------|------|
| **Shell (Host)** | Remote 앱들을 로드하고 오케스트레이션하는 메인 앱 |
| **Remote** | Shell에 의해 런타임에 로드되는 독립 배포 가능한 앱 |
| **Module Federation** | 여러 빌드 간 코드를 런타임에 공유하는 기술 |
| **remoteEntry.js** | Remote 앱의 MF 진입점 파일 |
| **Message Bus** | MF 앱 간 Pub/Sub 통신 레이어 |
| **Topic** | 메시지 종류를 식별하는 문자열 (`context.project.changed`) |

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-01-19 | Frontend Architecture Team | Initial draft |
| 1.1.0 | 2026-01-20 | Frontend Architect (Review) | Future Vision 섹션 추가, Late Subscriber 해결책, Phase 0 기술 검증, 보안 설정, 성능 Baseline 측정, 롤백 절차 추가 |

---

**Next Steps:**
1. **Phase 0 착수**: Vite 7 + MF 플러그인 호환성 검증 (BLOCKING)
2. Phase 0 통과 후 팀 리뷰 및 피드백 수집
3. Phase 1 착수: Message Bus 패키지 개발
4. 주간 진행 상황 공유
