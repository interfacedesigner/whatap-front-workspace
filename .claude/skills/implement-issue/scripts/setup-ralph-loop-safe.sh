#!/bin/bash
# setup-ralph-loop-safe.sh
#
# Ralph Loop Setup Script (Safe Version)
# Base64 인코딩된 프롬프트를 지원하여 특수문자/줄바꿈 문제 해결
#
# 새로운 옵션:
#   --encoded-prompt <base64>  Base64로 인코딩된 프롬프트
#
# 기존 옵션도 그대로 지원:
#   --max-iterations <n>
#   --completion-promise <text>

set -euo pipefail

# 문제가 되는 문자 목록 (참고용)
UNSAFE_CHARS_DOC="
# Claude Code Bash 도구에서 차단되는 문자들:
#
# | 카테고리           | 문자                    | 이유                    |
# |-------------------|------------------------|------------------------|
# | Newline           | \\n, \\r               | 명령어 분리              |
# | Shell Operators   | &&, ||, ;, |           | 명령어 체이닝            |
# | Redirection       | >, <, >>, <<           | 파일 덮어쓰기/읽기       |
# | Cmd Substitution  | \$(), \`\`             | 명령어 실행 삽입         |
# | Variable Expansion| \$VAR, \${VAR}         | 환경변수 노출            |
# | Quotes            | ', \"                   | 문자열 경계 탈출         |
# | Escapes           | \\                      | 이스케이프 시퀀스        |
# | Wildcards         | *, ?, [, ]             | glob 패턴 확장          |
"

# Parse arguments
PROMPT_PARTS=()
MAX_ITERATIONS=0
COMPLETION_PROMISE="null"
ENCODED_PROMPT=""

# Parse options and positional arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    -h|--help)
      cat << 'HELP_EOF'
Ralph Loop (Safe) - Interactive self-referential development loop

USAGE:
  setup-ralph-loop-safe.sh [PROMPT...] [OPTIONS]
  setup-ralph-loop-safe.sh --encoded-prompt <base64> [OPTIONS]

ARGUMENTS:
  PROMPT...    Initial prompt (can be multiple words without quotes)
               ⚠️ 특수문자/줄바꿈 포함 시 --encoded-prompt 사용 권장

NEW OPTIONS (Safe Mode):
  --encoded-prompt <base64>    Base64로 인코딩된 프롬프트
                               safe-encode.sh로 생성된 값 사용

STANDARD OPTIONS:
  --max-iterations <n>           Maximum iterations (default: unlimited)
  --completion-promise '<text>'  Promise phrase (USE QUOTES)
  -h, --help                     Show this help

SAFE ENCODING:
  # 특수문자가 포함된 프롬프트를 안전하게 전달하려면:

  1. safe-encode.sh로 인코딩:
     encoded=$(./safe-encode.sh --raw "프롬프트 내용
     여러 줄
     && 특수문자 포함")

  2. --encoded-prompt로 전달:
     setup-ralph-loop-safe.sh --encoded-prompt "$encoded"

EXAMPLES:
  # 단순 프롬프트 (기존 방식)
  setup-ralph-loop-safe.sh Build a todo API --max-iterations 5

  # 복잡한 프롬프트 (Base64 인코딩)
  encoded=$(./safe-encode.sh --raw "Issue #3 구현
  ## 요구사항
  - 기능 A
  - 기능 B

  ## 검증
  pnpm test && pnpm lint")

  setup-ralph-loop-safe.sh --encoded-prompt "$encoded" \
    --completion-promise "DONE" \
    --max-iterations 10

UNSAFE CHARACTERS (차단되는 문자들):
  - Newline: \n, \r
  - Shell Operators: &&, ||, ;, |
  - Redirection: >, <, >>, <<
  - Command Substitution: $(), ``
  - Quotes: ', "
HELP_EOF
      exit 0
      ;;
    --max-iterations)
      if [[ -z "${2:-}" ]]; then
        echo "❌ Error: --max-iterations requires a number argument" >&2
        exit 1
      fi
      if ! [[ "$2" =~ ^[0-9]+$ ]]; then
        echo "❌ Error: --max-iterations must be a positive integer, got: $2" >&2
        exit 1
      fi
      MAX_ITERATIONS="$2"
      shift 2
      ;;
    --completion-promise)
      if [[ -z "${2:-}" ]]; then
        echo "❌ Error: --completion-promise requires a text argument" >&2
        exit 1
      fi
      COMPLETION_PROMISE="$2"
      shift 2
      ;;
    --encoded-prompt)
      if [[ -z "${2:-}" ]]; then
        echo "❌ Error: --encoded-prompt requires a base64 string" >&2
        exit 1
      fi
      ENCODED_PROMPT="$2"
      shift 2
      ;;
    *)
      # Non-option argument - collect all as prompt parts
      PROMPT_PARTS+=("$1")
      shift
      ;;
  esac
done

# Determine prompt source
if [[ -n "$ENCODED_PROMPT" ]]; then
  # Decode Base64 prompt
  if [[ "$(uname)" == "Darwin" ]]; then
    PROMPT=$(echo -n "$ENCODED_PROMPT" | base64 -d 2>/dev/null) || {
      echo "❌ Error: Invalid Base64 encoding in --encoded-prompt" >&2
      echo "   Use safe-encode.sh to properly encode your prompt" >&2
      exit 1
    }
  else
    PROMPT=$(echo -n "$ENCODED_PROMPT" | base64 -d 2>/dev/null) || {
      echo "❌ Error: Invalid Base64 encoding in --encoded-prompt" >&2
      echo "   Use safe-encode.sh to properly encode your prompt" >&2
      exit 1
    }
  fi
  echo "📦 Decoded prompt from Base64 (${#PROMPT} chars)"
elif [[ ${#PROMPT_PARTS[@]} -gt 0 ]]; then
  # Join all prompt parts with spaces
  PROMPT="${PROMPT_PARTS[*]}"
else
  PROMPT=""
fi

# Validate prompt is non-empty
if [[ -z "$PROMPT" ]]; then
  echo "❌ Error: No prompt provided" >&2
  echo "" >&2
  echo "   Provide a prompt using one of:" >&2
  echo "     setup-ralph-loop-safe.sh \"Your prompt here\"" >&2
  echo "     setup-ralph-loop-safe.sh --encoded-prompt \"\$(./safe-encode.sh --raw 'prompt')\"" >&2
  echo "" >&2
  echo "   For help: setup-ralph-loop-safe.sh --help" >&2
  exit 1
fi

# Create state file for stop hook
mkdir -p .claude

# Quote completion promise for YAML
if [[ -n "$COMPLETION_PROMISE" ]] && [[ "$COMPLETION_PROMISE" != "null" ]]; then
  COMPLETION_PROMISE_YAML="\"$COMPLETION_PROMISE\""
else
  COMPLETION_PROMISE_YAML="null"
fi

cat > .claude/ralph-loop.local.md <<EOF
---
active: true
iteration: 1
max_iterations: $MAX_ITERATIONS
completion_promise: $COMPLETION_PROMISE_YAML
started_at: "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
---

$PROMPT
EOF

# Output setup message
cat <<EOF
🔄 Ralph loop activated in this session!

Iteration: 1
Max iterations: $(if [[ $MAX_ITERATIONS -gt 0 ]]; then echo $MAX_ITERATIONS; else echo "unlimited"; fi)
Completion promise: $(if [[ "$COMPLETION_PROMISE" != "null" ]]; then echo "${COMPLETION_PROMISE//\"/} (ONLY output when TRUE!)"; else echo "none (runs forever)"; fi)

⚠️  WARNING: This loop cannot be stopped manually!
    Set --max-iterations or --completion-promise.

🔄
EOF

# Output the initial prompt
if [[ -n "$PROMPT" ]]; then
  echo ""
  echo "$PROMPT"
fi

# Display completion promise requirements if set
if [[ "$COMPLETION_PROMISE" != "null" ]]; then
  echo ""
  echo "═══════════════════════════════════════════════════════════"
  echo "CRITICAL - Ralph Loop Completion Promise"
  echo "═══════════════════════════════════════════════════════════"
  echo ""
  echo "To complete this loop, output this EXACT text:"
  echo "  <promise>$COMPLETION_PROMISE</promise>"
  echo ""
  echo "STRICT REQUIREMENTS:"
  echo "  ✓ Use <promise> XML tags EXACTLY as shown"
  echo "  ✓ The statement MUST be completely TRUE"
  echo "  ✓ Do NOT output false statements to exit"
  echo "═══════════════════════════════════════════════════════════"
fi
