# Ralph Loop 안전 사용 가이드

## 문제 분석

### 발생한 에러

```
Bash command permission check failed for pattern "```!
"/Users/dot/.claude/plugins/.../setup-ralph-loop.sh" Issue #3 WhatapTable ...
## 요구사항
...
pnpm test && pnpm lint
```

### 근본 원인

Claude Code의 Bash 도구는 **보안 검사**를 수행하여 명령어 인젝션 공격을 방지합니다.
프롬프트에 포함된 특수문자가 shell 명령어로 해석될 수 있어 차단됩니다.

---

## 차단되는 문자 목록

| 카테고리 | 문자 | 위험성 |
|----------|------|--------|
| **Newline** | `\n`, `\r` | 명령어 분리 - 여러 명령어 실행 가능 |
| **Shell Operators** | `&&`, `\|\|`, `;`, `\|` | 명령어 체이닝 - 임의 명령 실행 |
| **Redirection** | `>`, `<`, `>>`, `<<` | 파일 덮어쓰기/읽기 |
| **Command Substitution** | `$()`, `` ` `` | 명령어 실행 삽입 |
| **Variable Expansion** | `$VAR`, `${VAR}` | 환경변수 노출 |
| **Quotes** | `'`, `"` | 문자열 경계 탈출 |
| **Escapes** | `\` | 이스케이프 시퀀스 조작 |
| **Wildcards** | `*`, `?`, `[`, `]` | glob 패턴 확장 |

---

## 해결 방법

### 방법 1: 파일 기반 전달 (권장)

프롬프트를 파일에 저장하고, 스크립트에서 파일을 읽습니다.

```bash
# Step 1: Write 도구로 프롬프트 저장
# (특수문자가 shell 해석 없이 파일에 직접 저장됨)

# Step 2: Bash 도구로 wrapper 실행
./scripts/ralph-wrapper.sh --prompt-file --max-iterations 5 --completion-promise "DONE"
```

**Claude 사용 예시:**

```
1. Write(".claude/ralph-prompt.txt", "Issue #3 구현

## 요구사항
- 기능 A
- 기능 B

## 검증
pnpm test && pnpm lint

모든 테스트 통과 시 완료")

2. Bash("./scripts/ralph-wrapper.sh --prompt-file --max-iterations 5 --completion-promise 'IMPLEMENTATION COMPLETE'")
```

### 방법 2: Base64 인코딩

특수문자를 Base64로 인코딩하여 전달합니다.

```bash
# 인코딩
encoded=$(./scripts/safe-encode.sh --raw "복잡한 프롬프트
여러 줄 && 특수문자")

# 디코딩하여 실행
./scripts/setup-ralph-loop-safe.sh --encoded-prompt "$encoded" --max-iterations 5
```

---

## 제공되는 스크립트

### 1. `scripts/ralph-wrapper.sh`

파일 기반으로 프롬프트를 전달하는 wrapper 스크립트입니다.

```bash
# 사용법
./scripts/ralph-wrapper.sh --prompt-file [OPTIONS]

# OPTIONS
--prompt-file              # .claude/ralph-prompt.txt에서 읽기
--max-iterations <n>       # 최대 반복 횟수
--completion-promise <t>   # 완료 조건 문구
```

### 2. `scripts/safe-encode.sh`

텍스트를 Base64로 인코딩합니다.

```bash
# 사용법
./scripts/safe-encode.sh "텍스트"
./scripts/safe-encode.sh --raw "텍스트"  # Base64만 출력
echo "텍스트" | ./scripts/safe-encode.sh --stdin
```

### 3. `scripts/safe-decode.sh`

Base64 문자열을 디코딩합니다.

```bash
# 사용법
./scripts/safe-decode.sh "BASE64_STRING"
```

### 4. `scripts/setup-ralph-loop-safe.sh`

`--encoded-prompt` 옵션을 지원하는 개선된 setup 스크립트입니다.

```bash
# 사용법
./scripts/setup-ralph-loop-safe.sh --encoded-prompt "BASE64" [OPTIONS]
```

---

## 워크플로우 비교

### ❌ 기존 방식 (차단됨)

```
Skill("ralph-loop:ralph-loop", args="Issue #3 구현
## 요구사항
- 기능 A
pnpm test && pnpm lint
...")
```

→ `Bash command permission check failed`

### ✅ 새로운 방식 (안전)

```
1. Write(".claude/ralph-prompt.txt", "Issue #3 구현...")
2. Bash("./scripts/ralph-wrapper.sh --prompt-file ...")
```

→ 특수문자가 shell 해석 없이 안전하게 전달됨

---

## 플러그인 수정 방법

기존 Ralph Loop 플러그인을 수정하려면:

### `commands/ralph-loop.md` 수정

```markdown
---
description: "Start Ralph Loop in current session"
argument-hint: "[OPTIONS]"
allowed-tools: ["Bash(${CLAUDE_PLUGIN_ROOT}/scripts/ralph-wrapper.sh:*)"]
---

# Ralph Loop Command (Safe Mode)

**⚠️ 복잡한 프롬프트는 파일로 전달하세요:**

1. 먼저 Write 도구로 프롬프트를 저장:
   ```
   Write(".claude/ralph-prompt.txt", "프롬프트 내용")
   ```

2. 그 후 다음 명령 실행:
   ```!
   "${CLAUDE_PLUGIN_ROOT}/scripts/ralph-wrapper.sh" --prompt-file $ARGUMENTS
   ```
```

---

## 테스트

```bash
# 인코딩 테스트
./scripts/safe-encode.sh "Hello
World && test"
# 출력: --encoded-prompt "SGVsbG8KV29ybGQgJiYgdGVzdA=="

# 디코딩 테스트
./scripts/safe-decode.sh "SGVsbG8KV29ybGQgJiYgdGVzdA=="
# 출력: Hello
#       World && test

# Wrapper 테스트
echo "Test prompt with && special chars" > .claude/ralph-prompt.txt
./scripts/ralph-wrapper.sh --prompt-file --max-iterations 1
```

---

## 요약

| 문제 | 원인 | 해결책 |
|------|------|--------|
| `permission check failed` | 특수문자가 shell 명령어로 해석 | 파일 기반 전달 |
| `newline` 포함 | 명령어 분리 | Base64 인코딩 |
| `&&`, `;` 등 | 명령어 체이닝 | 파일에 직접 저장 |
