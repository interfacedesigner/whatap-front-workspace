#!/bin/bash
# safe-encode.sh
#
# 위험한 문자가 포함된 문자열을 안전하게 Base64 인코딩합니다.
# Ralph Loop 등의 플러그인에서 멀티라인/특수문자 인자를 전달할 때 사용합니다.
#
# 사용법:
#   ./safe-encode.sh "멀티라인 프롬프트 내용"
#   echo "프롬프트" | ./safe-encode.sh --stdin
#
# 출력:
#   --encoded-prompt "BASE64_STRING"

set -euo pipefail

# 문제가 되는 문자 목록 (참고용)
# - Newline: \n, \r
# - Shell Operators: &&, ||, ;, |
# - Redirection: >, <, >>, <<
# - Command Substitution: $(), ``
# - Variable Expansion: $VAR, ${VAR}
# - Quotes: ', "
# - Escapes: \
# - Wildcards: *, ?, [, ]

usage() {
  cat << 'EOF'
Usage: safe-encode.sh [OPTIONS] [TEXT]

안전하게 텍스트를 Base64로 인코딩합니다.
특수문자, 줄바꿈, shell 연산자가 포함된 텍스트를 안전하게 전달할 수 있습니다.

OPTIONS:
  --stdin       표준 입력에서 텍스트를 읽습니다
  --raw         --encoded-prompt 접두사 없이 Base64만 출력
  -h, --help    이 도움말을 표시합니다

EXAMPLES:
  # 직접 인자로 전달
  ./safe-encode.sh "Hello World"

  # 멀티라인 텍스트
  ./safe-encode.sh "Line 1
  Line 2
  Line 3"

  # 파이프로 전달
  cat prompt.txt | ./safe-encode.sh --stdin

  # Raw 모드 (Base64만 출력)
  ./safe-encode.sh --raw "Hello"

OUTPUT:
  기본: --encoded-prompt "BASE64_STRING"
  Raw:  BASE64_STRING

INTEGRATION WITH RALPH LOOP:
  # setup-ralph-loop.sh와 함께 사용
  encoded=$(./safe-encode.sh --raw "$PROMPT")
  setup-ralph-loop.sh --encoded-prompt "$encoded" --max-iterations 5
EOF
}

RAW_MODE=false
USE_STDIN=false
TEXT=""

# 인자 파싱
while [[ $# -gt 0 ]]; do
  case $1 in
    -h|--help)
      usage
      exit 0
      ;;
    --stdin)
      USE_STDIN=true
      shift
      ;;
    --raw)
      RAW_MODE=true
      shift
      ;;
    *)
      TEXT="$1"
      shift
      ;;
  esac
done

# 텍스트 읽기
if [[ "$USE_STDIN" == "true" ]]; then
  TEXT=$(cat)
fi

if [[ -z "$TEXT" ]]; then
  echo "Error: No text provided" >&2
  echo "Usage: safe-encode.sh [--stdin] [--raw] TEXT" >&2
  exit 1
fi

# Base64 인코딩 (macOS와 Linux 호환)
# -w0 옵션은 Linux에서 줄바꿈 없이 출력
# macOS는 기본적으로 줄바꿈 없이 출력
if [[ "$(uname)" == "Darwin" ]]; then
  ENCODED=$(echo -n "$TEXT" | base64)
else
  ENCODED=$(echo -n "$TEXT" | base64 -w0)
fi

# 출력
if [[ "$RAW_MODE" == "true" ]]; then
  echo "$ENCODED"
else
  echo "--encoded-prompt \"$ENCODED\""
fi
