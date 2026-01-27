# PRD 기반 멀티 에이전트 협업 워크플로우 설계

> **사용자 결정사항**
> - PM Agent: 통합형 (specify → analyze 전체)
> - Developer 할당: User Story 단위
> - QA 시점: User Story별 테스트
> - 사용 시나리오: 개인 개발자 (순차적 에이전트 전환)

---

## 최종 워크플로우 설계

### 개인 개발자용 순차적 에이전트 워크플로우

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    개인 개발자용 PRD 멀티 에이전트 워크플로우                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  [1] PRD 입력 & 기획                                                         │
│  ┌──────────────────────────────────────────────────────────────┐          │
│  │  /prd "feature description"                                  │          │
│  │  └→ PM Agent 활성화                                          │          │
│  │     ├→ speckit.specify (spec.md 생성)                        │          │
│  │     ├→ speckit.clarify (모호성 해소)                          │          │
│  │     ├→ speckit.plan (plan.md, contracts/ 생성)               │          │
│  │     ├→ speckit.tasks (tasks.md 생성, US별 구분)               │          │
│  │     └→ speckit.analyze (일관성 검증)                          │          │
│  └──────────────────────────────────────────────────────────────┘          │
│                              │                                              │
│                              ▼                                              │
│  [2] User Story 1 구현 (반복)                                               │
│  ┌──────────────────────────────────────────────────────────────┐          │
│  │  /dev US1                                                    │          │
│  │  └→ Developer Agent 활성화                                   │          │
│  │     ├→ Setup Phase 태스크 실행 (최초 1회)                      │          │
│  │     ├→ Foundational Phase 태스크 실행 (US1 의존)              │          │
│  │     └→ US1 태스크 구현 + 자체 유닛 테스트                       │          │
│  └──────────────────────────────────────────────────────────────┘          │
│                              │                                              │
│                              ▼                                              │
│  [3] US1 코드 리뷰 (QA 전)                                                   │
│  ┌──────────────────────────────────────────────────────────────┐          │
│  │  /review US1                                                 │          │
│  │  └→ Code Review Agent 활성화                                 │          │
│  │     ├→ 코드 품질 검토 (기존 code-reviewer 활용)                │          │
│  │     ├→ 아키텍처 (FSD) 준수 확인                               │          │
│  │     ├→ 테스트 가능성 검토                                     │          │
│  │     └→ 피드백 → feedback.md 기록 → /dev fix:F001             │          │
│  └──────────────────────────────────────────────────────────────┘          │
│                              │                                              │
│                              ▼                                              │
│  [4] US1 QA 검증                                                            │
│  ┌──────────────────────────────────────────────────────────────┐          │
│  │  /qa US1                                                     │          │
│  │  └→ QA Agent 활성화                                          │          │
│  │     ├→ Unit Test 실행 & 커버리지 확인                          │          │
│  │     ├→ Integration Test (해당 US 범위)                        │          │
│  │     ├→ E2E Test (스토리 acceptance criteria 기반)             │          │
│  │     └→ 버그 발견 시 → bugs.md 기록 → /dev bug:B001            │          │
│  └──────────────────────────────────────────────────────────────┘          │
│                              │                                              │
│                              ▼                                              │
│  [2-4 반복] US2, US3... 각 스토리에 대해 반복                                 │
│                              │                                              │
│                              ▼                                              │
│  [5] 최종 통합 & PR                                                         │
│  ┌──────────────────────────────────────────────────────────────┐          │
│  │  /integrate                                                  │          │
│  │  └→ 통합 검증                                                │          │
│  │     ├→ 전체 E2E 테스트                                       │          │
│  │     ├→ 최종 코드 리뷰                                        │          │
│  │     └→ PR 생성 (create-pr 활용)                              │          │
│  └──────────────────────────────────────────────────────────────┘          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 구현 계획

### 1. 새로운 스킬 파일 생성

#### `/prd` - PRD 오케스트레이터 (진입점)
**파일**: `.claude/commands/prd.md`

```markdown
역할: PRD 입력을 받아 PM Agent로 전체 기획 프로세스 실행
프로세스:
1. 기능 설명 입력 받기
2. speckit.specify 호출 → spec.md 생성
3. 사용자 확인 후 speckit.clarify 실행
4. speckit.plan → speckit.tasks → speckit.analyze 순차 실행
5. workflow-state.json 초기화 (US별 상태 추적)

출력: specs/N-feature/ 디렉토리에 전체 산출물
핸드오프: /dev US1 안내
```

#### `/dev` - Developer Agent 스킬
**파일**: `.claude/commands/dev.md`

```markdown
역할: 특정 User Story 또는 버그 구현
입력: /dev US1 또는 /dev bug:B001
프로세스:
1. tasks.md에서 해당 US 태스크 추출
2. Setup Phase 미완료 시 먼저 실행
3. 의존 태스크 확인 및 순차 실행
4. 각 태스크 구현 + 자체 유닛 테스트 작성
5. tasks.md에 [X] 마킹
6. workflow-state.json 업데이트

핸드오프: /qa US1 안내
```

#### `/qa` - QA Agent 스킬 (리뷰 후 실행)
**파일**: `.claude/commands/qa.md`

```markdown
역할: 특정 User Story에 대한 품질 검증 (코드 리뷰 통과 후)
입력: /qa US1
프로세스:
1. 리뷰 통과 여부 확인 (workflow-state.json)
2. spec.md에서 해당 US의 acceptance criteria 로드
3. 유닛 테스트 실행 및 커버리지 확인
4. Integration 테스트 실행
5. E2E 테스트 (Given-When-Then 시나리오 기반)
6. 버그 발견 시 bugs.md에 기록 (B001, B002...)
7. workflow-state.json 업데이트 (QA 상태)

핸드오프:
- 버그 발견: /dev bug:B001 안내
- 통과: 다음 US 또는 /integrate 안내
```

#### `/review` - Code Review Agent 스킬 (QA 전 실행)
**파일**: `.claude/commands/review.md`

```markdown
역할: 특정 User Story 코드 리뷰 (QA 전 품질 게이트)
입력: /review US1
프로세스:
1. 해당 US에서 변경된 파일 목록 추출
2. code-reviewer 에이전트 로직 활용
3. 아키텍처 (FSD) 준수 확인
4. 테스트 가능성 검토 (테스트하기 어려운 코드 식별)
5. 코드 품질 체크리스트 검증
6. feedback.md에 피드백 기록 (F001, F002...)
7. workflow-state.json 업데이트 (리뷰 상태)

핸드오프:
- 피드백 있음: /dev fix:F001 안내
- 통과: /qa US1 안내
```

#### `/integrate` - 통합 및 PR 스킬
**파일**: `.claude/commands/integrate.md`

```markdown
역할: 모든 US 완료 후 최종 통합
프로세스:
1. workflow-state.json에서 모든 US 완료 확인
2. 전체 E2E 테스트 실행
3. 최종 코드 리뷰
4. create-pr 호출하여 PR 생성
```

---

### 2. 상태 관리 파일

#### `workflow-state.json` 스키마
**위치**: `specs/N-feature/workflow-state.json`

```json
{
  "feature": "feature-name",
  "branch": "N-feature-name",
  "created_at": "2025-01-07T00:00:00Z",
  "current_phase": "development",
  "user_stories": {
    "US1": {
      "priority": "P1",
      "status": "qa_passed",
      "dev_completed_at": "...",
      "review_completed_at": "...",
      "qa_completed_at": "..."
    },
    "US2": {
      "priority": "P2",
      "status": "in_review",
      "dev_completed_at": "...",
      "review_completed_at": null,
      "qa_completed_at": null
    }
  },
  "bugs": {
    "B001": {
      "related_us": "US1",
      "status": "fixed",
      "description": "..."
    }
  },
  "setup_phase_completed": true,
  "foundational_phase_completed": true
}
```

---

### 3. 버그 리포트 템플릿

#### `bugs.md` 템플릿
**위치**: `specs/N-feature/bugs.md`

```markdown
# Bug Report: [Feature Name]

## B001 - [Bug Title]
- **Related US**: US1
- **Severity**: High | Medium | Low
- **Status**: Open | In Progress | Fixed | Verified
- **Description**: ...
- **Steps to Reproduce**: ...
- **Expected**: ...
- **Actual**: ...
- **Fix Notes**: (Developer 작성)
```

---

### 4. 생성/수정할 파일 목록

| 파일 경로 | 작업 | 설명 |
|----------|------|------|
| `.claude/agents/pm.md` | 생성 | PM Agent 정의 |
| `.claude/agents/qa.md` | 생성 | QA Agent 정의 |
| `.claude/commands/prd.md` | 생성 | PRD 진입점 스킬 |
| `.claude/commands/dev.md` | 수정 | 기존 dev 스킬 확장 (US 단위) |
| `.claude/commands/qa.md` | 생성 | QA 스킬 |
| `.claude/commands/review.md` | 생성 | 코드 리뷰 스킬 |
| `.claude/commands/integrate.md` | 생성 | 통합 스킬 |
| `.specify/templates/workflow-state-template.json` | 생성 | 상태 추적 템플릿 |
| `.specify/templates/bugs-template.md` | 생성 | 버그 리포트 템플릿 |

---

## 사용 시나리오 예시

```bash
# 1. PRD 입력으로 시작
> /prd "사용자가 대시보드에서 위젯을 드래그 앤 드롭으로 재배치할 수 있는 기능"

# PM Agent가 전체 기획 진행
# → spec.md, plan.md, tasks.md 생성
# → workflow-state.json 초기화

# 2. 첫 번째 User Story 구현
> /dev US1

# Developer Agent가 US1 태스크 구현
# → Setup Phase 실행 (최초)
# → US1 관련 태스크 구현

# 3. US1 코드 리뷰 (QA 전)
> /review US1

# Code Review Agent가 코드 품질 검토
# → 아키텍처 준수, 테스트 가능성 확인
# → 피드백 있으면 feedback.md에 기록

# 4. 리뷰 피드백 수정 (필요시)
> /dev fix:F001

# 5. US1 QA (리뷰 통과 후)
> /qa US1

# QA Agent가 테스트 실행
# → 버그 발견 시 bugs.md에 기록

# 6. 버그 수정 (필요시)
> /dev bug:B001

# 7. US2, US3... 반복 (각 US마다 dev → review → qa 순서)

# 8. 최종 통합
> /integrate

# → 전체 E2E → PR 생성
```

### 워크플로우 순서 요약
```
/prd → /dev US1 → /review US1 → /qa US1 → [반복] → /integrate
```

---

## 구현 순서

1. **PM Agent 정의** - `.claude/agents/pm.md`
2. **QA Agent 정의** - `.claude/agents/qa.md`
3. **상태 템플릿** - `.specify/templates/workflow-state-template.json`
4. **버그 템플릿** - `.specify/templates/bugs-template.md`
5. **/prd 스킬** - `.claude/commands/prd.md`
6. **/dev 스킬 수정** - `.claude/commands/dev.md`
7. **/qa 스킬** - `.claude/commands/qa.md`
8. **/review 스킬** - `.claude/commands/review.md`
9. **/integrate 스킬** - `.claude/commands/integrate.md`
10. **테스트 & 문서화**

---

## 기존 Speckit 워크플로우와의 관계

현재 프로젝트에는 이미 정교한 speckit 워크플로우가 구축되어 있습니다:

```
speckit.specify → speckit.clarify → speckit.plan → speckit.tasks → speckit.analyze → speckit.implement
```

이 멀티 에이전트 워크플로우는 기존 speckit을 **래핑**하여:
- PM Agent: speckit 전체를 오케스트레이션
- Developer Agent: `speckit.implement`를 US 단위로 세분화
- QA Agent: 테스트 자동화 전문 에이전트 추가
- Code Review Agent: 기존 `code-reviewer` 에이전트 활용

---

## 참고: 기존 에이전트 정의 (`.claude/agents/`)

- `fe.md` - 프론트엔드 전문가
- `code-reviewer.md` - 코드 리뷰 전문가
- `test-automator.md` - 테스트 자동화 전문가
- `debugger.md` - 디버깅 전문가
- `ts.md` / `js.md` - 언어 전문가

---

*작성일: 2025-01-07*
*상태: 기획 완료, 구현 대기*
