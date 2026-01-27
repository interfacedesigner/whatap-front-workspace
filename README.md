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
