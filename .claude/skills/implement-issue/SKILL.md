---
name: implement-issue
description: |
  Issue 번호를 받아 Git Worktree에서 Ralph Loop으로 구현하고 PR을 생성합니다.
  트리거 조건:
  - 키워드: "implement issue", "issue 구현", "이슈 구현", "#숫자 구현", "PR 생성", "구현해줘"
  - 패턴: "issue #N", "#N 구현", "N번 이슈"
  주의: 복잡한 프롬프트는 파일 기반으로 전달하여 특수문자 문제를 방지합니다.
argument-hint: "[issue 번호]"
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
  - Glob
  - Grep
  - Task
  - AskUserQuestion
---

# Issue 구현 및 PR 생성 (Ralph Loop)

Issue PRD를 기반으로 Git Worktree에서 구현하고 PR을 생성하는 Skill입니다.

## 보안 설정

| 도구 | 허용 범위 |
|------|----------|
| **Bash** | git, gh, pnpm 명령만 권장 |
| **Write/Edit** | `.worktree/**` 경로 권장 |
| **Read/Glob/Grep** | 전체 읽기 허용 |

**차단 권장:**
- `.env`, credentials 등 민감 파일 수정
- `git push --force`, `git reset --hard`

---

## 워크플로우

| 단계 | 설명 |
|------|------|
| 1 | Issue 정보 가져오기 (`gh issue view`) |
| 2 | Git Worktree 준비 |
| 3 | Ralph Loop 실행 (파일 기반 프롬프트) |
| 4 | 검증 (test, typecheck, lint) |
| 5 | 커밋 및 PR 생성 |

---

## 단계 1: Issue 정보 가져오기

```bash
gh issue view $ARGUMENTS
```

Issue PRD에서 추출할 내용:
- 기능 요구사항 목록
- 기술 요구사항
- 완료 조건

---

## 단계 2: Git Worktree 준비

```bash
# 현재 상태 확인
git status

# 변경사항 스태시 (필요시)
git stash

# Worktree 생성
git worktree add .worktree/issue-$ARGUMENTS -b issue/$ARGUMENTS-[slug]

# Worktree로 이동
cd .worktree/issue-$ARGUMENTS

# 의존성 설치
pnpm install
```

---

## 단계 3: Ralph Loop 실행 (파일 기반)

⚠️ **특수문자/줄바꿈이 포함된 프롬프트는 파일로 전달합니다.**

### Step 3-1: 프롬프트 파일 작성

Write 도구로 `.claude/ralph-prompt.txt`에 프롬프트를 저장합니다:

```
Write(".claude/ralph-prompt.txt", "Issue #$ARGUMENTS 구현

## 작업 디렉토리
[현재 worktree 경로]

## 요구사항
[PRD에서 추출한 요구사항]

## 완료 조건
- [ ] 조건 1
- [ ] 조건 2
- [ ] 테스트 통과
- [ ] 타입 체크 통과

## 검증 명령어
pnpm --filter [app] test
pnpm --filter [app] typecheck
pnpm --filter [app] lint

모든 완료 조건 충족 시 <promise>IMPLEMENTATION COMPLETE</promise> 출력")
```

### Step 3-2: Ralph Wrapper 실행

```bash
.claude/skills/implement-issue/scripts/ralph-wrapper.sh --prompt-file --max-iterations 5 --completion-promise "IMPLEMENTATION COMPLETE"
```

### Ralph Loop 특성

- 동일 프롬프트가 반복 실행됨
- 이전 작업 결과가 파일에 누적
- 완료 조건 충족까지 반복 개선 (최대 5회)
- `<promise>` 태그로 완료 신호

---

## 단계 4: 완료 검증

Ralph Loop 완료 후 최종 확인:

```bash
# 테스트 실행
pnpm --filter [app] test

# 타입 체크
pnpm --filter [app] typecheck

# 린트
pnpm --filter [app] lint
```

---

## 단계 5: 커밋 및 PR 생성

```bash
# 변경사항 확인
git status
git diff

# 변경사항 커밋
git add [files]
git commit -m "feat: [구현 내용 요약]

- [변경사항 1]
- [변경사항 2]

Refs #$ARGUMENTS

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"

# 원격 푸시
git push -u origin issue/$ARGUMENTS-[slug]

# PR 생성
gh pr create \
  --title "[제목]" \
  --body "## Summary
- [변경사항 요약]

## Changes
- [주요 변경 1]
- [주요 변경 2]

## Test Plan
- [ ] [테스트 항목 1]
- [ ] [테스트 항목 2]

Closes #$ARGUMENTS

🤖 Generated with [Claude Code](https://claude.com/claude-code)"
```

---

## 단계 6: 결과 출력

```markdown
# PR 생성 완료

## Issue
- **Issue**: #[번호]
- **Status**: 구현 완료

## Pull Request
- **PR**: #[PR 번호]
- **URL**: [PR URL]
- **Branch**: issue/[번호]-[slug]

## Worktree 정리
작업 완료 후:
```bash
cd /path/to/main/repo
git worktree remove .worktree/issue-[번호]
```
```

---

## 문제 해결

### 특수문자 오류 발생 시

"Bash command permission check failed" 에러가 발생하면:

1. 프롬프트를 파일로 저장 (Write 도구 사용)
2. `--prompt-file` 옵션으로 실행

**차단되는 문자:**
- Newline: `\n`, `\r`
- Shell Operators: `&&`, `||`, `;`, `|`
- Redirection: `>`, `<`
- Command Substitution: `$()`

자세한 내용: `docs/ralph-loop-safe-usage.md`

### Ralph Loop 중단

```bash
/cancel-ralph
```

또는 `.claude/ralph-loop.local.md` 파일 삭제

---

## Worktree 관리

```bash
# 목록 확인
git worktree list

# 제거
git worktree remove .worktree/issue-[번호]

# 정리
git worktree prune
```
