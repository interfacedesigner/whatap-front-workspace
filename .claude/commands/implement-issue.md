---
description: Issue 번호를 받아 Ralph Loop으로 구현하고 PR을 생성합니다
allowed-tools: Bash(*), Read(*), Write(*), Edit(*), Glob(*), Grep(*), Task(*), Skill(*)
argument-hint: [issue 번호]
---

# Issue 구현 및 PR 생성 (Ralph Loop)

## Issue 번호
$ARGUMENTS

---

## 실행 단계

### 1단계: Issue 정보 가져오기

```bash
gh issue view $ARGUMENTS
```

Issue의 PRD 내용을 파악하고:
- 기능 요구사항 목록 추출
- 기술 요구사항 확인
- 완료 조건 파악

### 2단계: Git Worktree 준비

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

### 3단계: Ralph Loop 실행

Issue PRD 기반으로 Ralph Loop 프롬프트를 구성합니다:

```
/ralph-loop "[PRD 기반 구현 프롬프트]

## 완료 조건
[PRD의 완료 조건 목록]

모든 완료 조건 충족 시 <promise>IMPLEMENTATION COMPLETE</promise> 출력" --completion-promise "IMPLEMENTATION COMPLETE" --max-iterations 5
```

**Ralph Loop 특성:**
- 동일 프롬프트가 반복 실행됨
- 이전 작업 결과가 파일에 누적
- 완료 조건 충족까지 반복 개선 (최대 5회)
- `<promise>` 태그로 완료 신호

### 4단계: 완료 검증

Ralph Loop 완료 후 최종 확인:

```bash
# 테스트 실행
pnpm test

# 타입 체크
pnpm typecheck

# 린트
pnpm lint
```

### 5단계: 커밋 및 PR 생성

```bash
# 변경사항 커밋
git add .
git commit -m "feat: [구현 내용 요약]

- [변경사항 1]
- [변경사항 2]

Refs #$ARGUMENTS"

# 원격 푸시
git push -u origin issue/$ARGUMENTS-[slug]

# PR 생성
gh pr create \
  --title "[제목]" \
  --body "$(cat <<'EOF'
## Summary
- [변경사항 요약]

## Changes
- [주요 변경 1]
- [주요 변경 2]

## Test Plan
- [ ] [테스트 항목 1]
- [ ] [테스트 항목 2]

Closes #$ARGUMENTS
EOF
)"
```

### 6단계: 결과 출력

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

## Ralph Loop 활용 가이드

### 프롬프트 구성 예시

```
/ralph-loop "Issue #123 구현

## 요구사항
1. [기능 1] 구현
2. [기능 2] 구현

## 완료 조건
- [ ] 기능 테스트 통과
- [ ] 타입 에러 없음

완료 조건 모두 충족 시 <promise>DONE</promise> 출력" --completion-promise "DONE" --max-iterations 5
```

### 중단 필요 시

```
/cancel-ralph
```

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

---

## 주의사항

1. **Ralph Loop은 명확한 완료 조건이 있을 때 효과적**
2. **`<promise>` 태그로 완료 신호 필수**
3. **max-iterations 5회로 무한 루프 방지**
4. **PR은 `Closes #[번호]`로 Issue 연결**
