<!--
Sync Impact Report
==================
Version change: N/A → 1.0.0
Added sections: All (initial creation)
Removed sections: None
Modified principles: None (initial)
Templates requiring updates:
  - ⚠ pending: .specify/templates/plan-template.md (to be created)
  - ⚠ pending: .specify/templates/spec-template.md (to be created)
  - ⚠ pending: .specify/templates/tasks-template.md (to be created)
Follow-up TODOs: None
-->

# Project Constitution

**Project Name:** whatap-workspace
**Version:** 1.0.0
**Ratification Date:** 2026-02-02
**Last Amended Date:** 2026-02-02

## Purpose

This constitution defines the non-negotiable principles and governance rules for the whatap-workspace project. All contributors, including AI agents, MUST adhere to these principles when proposing or implementing changes.

## Core Principles

### Principle 1: FSD Architecture Compliance

**Name:** FSD 아키텍처 준수

**Rules:**
- All code MUST follow Feature-Sliced Design (FSD) architecture
- Layer dependency rules MUST be strictly enforced:
  - `app` → `pages` → `widgets` → `features` → `entities` → `shared`
  - Upper layers MAY import from lower layers only
  - Cross-imports within the same layer are FORBIDDEN
- Public API exports MUST be used when importing from other slices (`index.ts`)
- Direct relative paths are ALLOWED only within the same slice

**Rationale:** Consistent architecture ensures maintainability, predictable dependency flow, and clear separation of concerns across the codebase.

### Principle 2: Type Safety

**Name:** 타입 안전성

**Rules:**
- TypeScript `strict: true` MUST be enabled in `tsconfig.json`
- `any` type usage is FORBIDDEN except with explicit justification comment
- All API boundaries MUST use Zod schemas for runtime validation
- Form data MUST be validated with Zod before processing
- Type inference SHOULD be preferred over explicit type annotations where possible

**Rationale:** Strong typing catches errors at compile time, reduces runtime failures, and improves developer experience through better IDE support.

### Principle 3: Test Coverage

**Name:** 테스트 커버리지

**Rules:**
- **UI Components:**
  - All UI components MUST have a corresponding `.stories.tsx` file (Storybook)
  - All UI components MUST have component tests (Testing Library)
- **Utilities:**
  - All utility functions in `shared/lib/` MUST have unit tests (Vitest)
- **Pages:**
  - All new pages MUST have E2E tests (Playwright)
- Test files MUST be co-located with the source files they test

**Rationale:** Comprehensive testing ensures reliability, prevents regressions, and documents expected behavior through executable specifications.

## Governance

### Amendment Procedure

1. Propose changes via pull request modifying this constitution
2. Changes MUST include rationale and impact analysis
3. All principle changes require explicit team approval
4. Version number MUST be updated according to semantic versioning

### Versioning Policy

- **MAJOR:** Backward-incompatible principle removals or redefinitions
- **MINOR:** New principles added or existing ones materially expanded
- **PATCH:** Clarifications, wording improvements, typo fixes

### Compliance Review

- All code reviews MUST verify adherence to constitution principles
- AI agents MUST check constitution before proposing architectural changes
- Violations MUST be flagged and resolved before merge

## Changelog

### v1.0.0 (2026-02-02)
- Initial constitution ratification
- Established 3 core principles: FSD Architecture, Type Safety, Test Coverage
- Defined governance procedures
