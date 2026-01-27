---
name: figma-to-component
description: |
  [필수 사용] Figma URL(figma.com/design/...)이나 node ID가 포함된 컴포넌트 생성 요청 시 반드시 이 skill을 사용하세요.
  트리거 조건:
  - Figma URL 패턴: https://www.figma.com/design/...?node-id=...
  - 키워드: "컴포넌트 생성", "구현해줘", "만들어줘", "변환", "Figma MCP"
  주의: MCP 도구(get_design_context 등)를 직접 호출하지 말고, 이 skill을 통해 실행하세요.
allowed-tools:
  - Read
  - Write
  - Edit
  - Glob
  - Grep
  - Bash
  - Task
  - AskUserQuestion
  - mcp__figma-dev-mode-mcp-server__get_design_context
  - mcp__figma-dev-mode-mcp-server__get_screenshot
  - mcp__figma-dev-mode-mcp-server__get_variable_defs
  - mcp__figma-dev-mode-mcp-server__get_metadata
---

# Figma MCP 컴포넌트 생성

Figma 디자인에서 React 컴포넌트를 자동 생성하는 Skill입니다.

## 기능

- Figma MCP를 통해 디자인 추출
- Tailwind CSS → PandaCSS 변환
- 디자인 시스템 컴포넌트 통합
- Storybook 스토리 생성

## 워크플로우 구조

| 단계  | 실행 주체                                  | 역할                               |
| ----- | ------------------------------------------ | ---------------------------------- |
| 1     | 메인 에이전트                              | 입력 수집 (AskUserQuestion)        |
| 2     | 메인 에이전트                              | Figma MCP 호출 + 서브컴포넌트 분석 |
| 3     | 메인 에이전트                              | 전처리 + 변환 + 파일 생성          |
| **4** | **Subagent (code-reviewer-design-system)** | 코드 검증 (필수)                   |
| **5** | **Subagent (code-reviewer-architect)**     | 아키텍처 리뷰 (필수)               |
| **6** | **Subagent (code-reviewer-typescript)**    | TypeScript 타입 검증 (필수)        |

**메인 에이전트 역할:**

- 전체 워크플로우 직접 실행 (1~3단계)
- 사용자와의 소통 (질문, 확인)
- 파일 생성 및 코드 작성
- 최종 결과 보고

**Subagent 역할:**

- **단계 4 (code-reviewer-design-system)**: 디자인 시스템 준수 검증, prettier/tsc 실행, 오류 수정
- **단계 5 (code-reviewer-architect)**: 컴포넌트 아키텍처 리뷰, 품질/성능/접근성 검토
- **단계 6 (code-reviewer-typescript)**: TypeScript 타입 안전성 검증, ESLint 규칙 준수 확인

---

## 단계 1: 입력 수집 (메인 에이전트)

AskUserQuestion 도구를 사용하여 필수 정보를 한 번에 수집합니다.

### AskUserQuestion 호출 예시

```
questions:
1. Figma URL 또는 node ID를 입력해주세요
   - header: "Figma"
   - options: [직접 입력]

2. FSD 레이어를 선택해주세요
   - header: "FSD 레이어"
   - options: [2_pages, 3_widgets, 4_features, 5_entities, 6_shared]

3. 도메인을 선택해주세요
   - header: "도메인"
   - options: [account, admin, application, browser, cloud, common, database, event, integration, introduction, kubernetes, log, network, networkManagement, openmx, server, url]

4. 컴포넌트 이름을 입력해주세요 (PascalCase)
   - header: "컴포넌트"
   - options: [직접 입력]
```

### 참고 사항

- Storybook 스토리는 기본적으로 생성됨 (별도 질문 불필요)
- URL 형식: `https://figma.com/design/:fileKey/:fileName?node-id=1-2`
- node ID 추출: `node-id=1-2` → `1:2`

### FSD 레이어 설명

| 레이어       | 용도                            |
| ------------ | ------------------------------- |
| `2_pages`    | 페이지 컴포넌트                 |
| `3_widgets`  | 복잡한 UI 블록 (사이드바, 패널) |
| `4_features` | 비즈니스 기능 (폼, 데이터 표시) |
| `5_entities` | 비즈니스 엔티티 (아이템 카드)   |
| `6_shared`   | 도메인별 공유 유틸리티          |

---

## 단계 2: Figma 디자인 추출 + 서브컴포넌트 분석 (메인 에이전트)

메인 에이전트가 Figma MCP 도구를 직접 호출합니다.

### 2-1. 기본 MCP 호출

```
1. mcp__figma-dev-mode-mcp-server__get_design_context
   - nodeId: "{nodeId}"
   - clientLanguages: "typescript,html,css"
   - clientFrameworks: "react"
   - artifactType: "COMPONENT_WITHIN_A_WEB_PAGE_OR_APP_SCREEN"
   - taskType: "CREATE_ARTIFACT"

2. mcp__figma-dev-mode-mcp-server__get_screenshot (시각적 참조용)
   - nodeId: "{nodeId}"
```

### 2-2. 서브컴포넌트 분할 분석 (복잡한 UI인 경우)

복잡한 컴포넌트의 경우 `get_metadata`를 호출하여 계층 구조를 분석합니다.

```
3. mcp__figma-dev-mode-mcp-server__get_metadata (선택적)
   - nodeId: "{nodeId}"
   - clientLanguages: "typescript,html,css"
   - clientFrameworks: "react"
```

#### 서브컴포넌트 분할 기준

`get_metadata` 응답의 XML 구조를 분석하여 다음 기준으로 서브컴포넌트를 식별합니다:

| 분할 기준            | 설명                                   | 예시                         |
| -------------------- | -------------------------------------- | ---------------------------- |
| **반복되는 구조**    | 동일한 패턴이 2회 이상 반복            | ListItem, Card, Row          |
| **명확한 영역 구분** | Header, Content, Footer 등             | PopoverHeader, PopoverFooter |
| **재사용 가능성**    | 다른 곳에서도 사용될 수 있는 독립적 UI | SearchInput, FilterTag       |
| **복잡도**           | 자식 노드가 5개 이상인 그룹            | FormSection, DataGrid        |

#### 분할 판단 프로세스

```
1. get_metadata 응답에서 data-name 속성 확인
2. 계층 깊이가 3 이상인 노드 그룹 식별
3. 반복 패턴 탐지 (동일 data-name prefix)
4. 각 서브컴포넌트별 개별 get_design_context 호출 고려
```

#### 서브컴포넌트별 추가 호출 (필요시)

```
4. mcp__figma-dev-mode-mcp-server__get_design_context
   - nodeId: "{subcomponentNodeId}"  // 예: "15:1682" (Footer)
   - clientLanguages: "typescript,html,css"
   - clientFrameworks: "react"
   - artifactType: "COMPONENT_WITHIN_A_WEB_PAGE_OR_APP_SCREEN"
```

### 검토 사항

- Tailwind 코드가 정상적으로 추출되었는지 확인
- 스크린샷으로 디자인 의도 파악
- 서브컴포넌트 분할 필요 여부 판단

---

## 단계 3: 전처리 + 변환 + 파일 생성 (메인 에이전트)

### 전처리 (메인 에이전트 실행)

MCP 응답을 파일로 저장한 후, 아래 스크립트를 순차 실행하여 토큰 사용량을 줄입니다:

```bash
# 1. MCP 결과를 파일로 저장
# 2. figma-preprocess.sh 실행 (기본 정리)
.claude/skills/figma-to-component/scripts/figma-preprocess.sh input.txt > ./tmp/{nodeId}-preprocessed.txt

# 3. tuning-get-design-context.mjs 실행 (상세 가공)
node .claude/skills/figma-to-component/scripts/tuning-get-design-context.mjs ./tmp/{nodeId}-preprocessed.txt
```

**처리 내용:**

- CSS variable fallback 제거: `var(--token, #fff)` → `var(--token)`
- 오타 수정: `sementic` → `semantic`
- 비-React 문구 제거 (SUPER CRITICAL, IMPORTANT 블록 등)
- 불필요한 공백/빈줄 정리

가공한 파일은 기본적으로 입력 파일명에 `_tuned.txt`를 붙여 같은 디렉터리에 저장된다.
(필요 시 --destination으로 경로 지정)

### 3-1. PandaCSS 변환 규칙

전처리 한 Tailwind 코드에 다음 subagent 를 통해 tailwind 코드를 pandaCSS 코드로 변환합니다:

.claude/agents/figma-tailwind-to-panda.md

### 3-2. 파일 생성

생성할 파일 경로:

```
apps/whatap-front/src/fsd/{domain}/{layer}/{componentName}/
├── {componentName}.tsx
├── {componentName}.stories.tsx
└── index.ts
```

#### Storybook 템플릿

@.cursor/rules/implement/storybook-guideline.mdc

#### index.ts 템플릿

```tsx
export { {componentName} } from './{componentName}';
```

---

## 단계 4: 코드 검증 (Subagent: code-reviewer-design-system)

> ⛔ **CRITICAL: 이 단계는 반드시 code-reviewer-design-system subagent로 실행해야 합니다**

### Task 도구 호출 (필수)

```
Task(
  subagent_type: "code-reviewer-design-system",
  description: "{componentName} 코드 검증",
  prompt: """
생성된 컴포넌트 파일들을 검증하고 오류가 있으면 수정하세요:

파일 경로: apps/whatap-front/src/fsd/{domain}/{layer}/{componentName}/

검증 및 수정 항목:
1. npx prettier --write 실행하여 포맷팅
2. NODE_OPTIONS="--max-old-space-size=8192" npx tsc --noEmit --skipLibCheck 로 TypeScript 오류 확인
3. TypeScript 오류가 있으면 직접 수정
4. 디자인 시스템 컴포넌트 props 타입 확인 (Button variant, Select props 등)

반환:
- 검증 결과 (pass/fail)
- 수정한 내용 목록
- 남은 이슈 (있는 경우)
"""
)
```

### 메인 에이전트 검토 사항

- 검증 결과가 pass인지 확인
- 남은 이슈가 있으면 사용자에게 알림

---

## 단계 5: 아키텍처 리뷰 (Subagent: code-reviewer-architect)

> ⛔ **CRITICAL: 이 단계는 반드시 code-reviewer-architect subagent로 실행해야 합니다**

### Task 도구 호출 (필수)

```
Task(
  subagent_type: "code-reviewer-architect",
  description: "{componentName} 아키텍처 리뷰",
  prompt: """
생성된 컴포넌트의 아키텍처를 리뷰하고 개선사항을 적용하세요:

파일 경로: apps/whatap-front/src/fsd/{domain}/{layer}/{componentName}/

리뷰 항목:
1. 컴포넌트 구조 및 재사용성
   - 서브컴포넌트 분리가 적절한지
   - Props 인터페이스가 명확한지
   - 불필요한 중첩이 없는지

2. 코드 품질
   - 가독성 (네이밍, 구조, 추상화 레벨)
   - 응집도 (단일 책임 원칙)
   - 결합도 (의존성 분석)

3. 성능
   - 불필요한 리렌더링 가능성
   - 메모이제이션 필요 여부 (useMemo, useCallback)

4. 접근성
   - ARIA 속성 필요 여부
   - 키보드 네비게이션 지원

5. 디자인 시스템 최적화
   - div + css(display:'flex') → FlexBox 변환
   - 다중 font 스타일 span/p → Typography 변환
   - CSS props → 컴포넌트 props 이동

자동 수정 항목 (Must Fix):
- div with flex styling → FlexBox
- Text with multiple font styles → Typography
- CSS props → Component props
- Import 통합

반환:
- 리뷰 결과 요약
- 자동 수정된 항목 목록
- 수동 검토 필요 항목 (있는 경우)
- 최종 품질 점수 (1-10)
"""
)
```

### 메인 에이전트 검토 사항

- 아키텍처 리뷰 결과 확인
- 자동 수정된 항목 검토

---

## 단계 6: TypeScript 타입 검증 (Subagent: code-reviewer-typescript)

> ⛔ **CRITICAL: 이 단계는 반드시 code-reviewer-typescript subagent로 실행해야 합니다**

### Task 도구 호출 (필수)

```
Task(
  subagent_type: "code-reviewer-typescript",
  description: "{componentName} TypeScript 검증",
  prompt: """
생성된 컴포넌트의 TypeScript 타입 안전성을 검증하고 개선하세요:

파일 경로: apps/whatap-front/src/fsd/{domain}/{layer}/{componentName}/

검증 항목:
1. Type Import/Export 규칙 준수
   - 타입만 import하는 경우 `import type` 사용
   - 타입만 export하는 경우 `export type` 사용
   - 타입/값 혼합 import 분리

2. 타입 안전성
   - any 타입 사용 → unknown 또는 구체적 타입으로 변경
   - 불필요한 타입 단언(as) 제거
   - non-null assertion(!) → optional chaining(?.) 또는 타입 가드로 변경

3. ESLint TypeScript 규칙
   - @typescript-eslint/consistent-type-exports
   - @typescript-eslint/consistent-type-imports
   - unused-imports/no-unused-vars
   - unused-imports/no-unused-imports

4. 검증 실행
   - pnpm eslint --no-warn {파일경로}
   - NODE_OPTIONS="--max-old-space-size=8192" pnpm tsc --noEmit --skipLibCheck

반환:
- 검증 결과 (pass/fail)
- 자동 수정한 항목 목록
- 남은 이슈 (있는 경우)
"""
)
```

### 메인 에이전트 최종 검토

- TypeScript 검증 결과 확인
- 모든 타입 이슈가 해결되었는지 확인
- 완료 시 생성된 파일 목록과 함께 최종 결과 보고

---

## 핵심 참조 파일

- **토큰 변환 가이드**: `.cursor/rules/implement/figma-mcp-implementation.mdc`
- **토큰 정의**: `apps/whatap-front/src/fsd/common/6_shared/styled-system/tokens/tokens.d.ts`
- **디자인 시스템**: `@whatap/design-system`
- **Storybook 가이드**: `.cursor/rules/implement/storybook-guideline.mdc`
- **code-reviewer-architect**: `.claude/agents/code-reviewer-architect.md`
- **code-reviewer-design-system**: `.claude/agents/code-reviewer-design-system.md`
- **code-reviewer-typescript**: `.claude/agents/code-reviewer-typescript.md`
