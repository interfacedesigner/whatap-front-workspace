#!/bin/bash
# safe-decode.sh
#
# Base64로 인코딩된 문자열을 디코딩합니다.
# safe-encode.sh로 인코딩된 프롬프트를 복원할 때 사용합니다.
#
# 사용법:
#   ./safe-decode.sh "BASE64_STRING"
#   echo "BASE64_STRING" | ./safe-decode.sh --stdin
#
# 출력:
#   원본 텍스트

set -euo pipefail

usage() {
  cat << 'EOF'
Usage: safe-decode.sh [OPTIONS] [BASE64_STRING]

Base64로 인코딩된 텍스트를 디코딩합니다.

OPTIONS:
  --stdin       표준 입력에서 Base64 문자열을 읽습니다
  -h, --help    이 도움말을 표시합니다

EXAMPLES:
  # 직접 인자로 전달
  ./safe-decode.sh "SGVsbG8gV29ybGQ="

  # 파이프로 전달
  echo "SGVsbG8gV29ybGQ=" | ./safe-decode.sh --stdin

OUTPUT:
  디코딩된 원본 텍스트
EOF
}

USE_STDIN=false
ENCODED=""

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
    *)
      ENCODED="$1"
      shift
      ;;
  esac
done

# 인코딩된 텍스트 읽기
if [[ "$USE_STDIN" == "true" ]]; then
  ENCODED=$(cat)
fi

if [[ -z "$ENCODED" ]]; then
  echo "Error: No Base64 string provided" >&2
  echo "Usage: safe-decode.sh [--stdin] BASE64_STRING" >&2
  exit 1
fi

# Base64 디코딩 (macOS와 Linux 호환)
if [[ "$(uname)" == "Darwin" ]]; then
  echo -n "$ENCODED" | base64 -d
else
  echo -n "$ENCODED" | base64 -d
fi
