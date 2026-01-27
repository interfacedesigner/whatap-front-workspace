#!/bin/bash
# Figma MCP 출력 전처리 스크립트
# 토큰 사용량을 줄이기 위해 불필요한 정보를 제거합니다.
#
# 사용법:
#   ./figma-preprocess.sh input.txt > output.txt
#   cat input.txt | ./figma-preprocess.sh > output.txt
#
# 처리 내용:
#   1. fallback 값 제거: var(--token, #fff) → var(--token)
#   2. sementic → semantic 오타 수정
#   3. 연속 공백을 단일 공백으로
#   4. 빈 줄 제거
#   5. 불필요한 Tailwind 유틸리티 단순화

set -euo pipefail

INPUT_FILE="${1:-/dev/stdin}"

cat "$INPUT_FILE" | \
  # 1. fallback 값 제거: var(--token, #fff) → var(--token)
  # 단순한 var() fallback만 처리 (중첩 var()는 일부 케이스에서 한계가 있음)
  sed -E 's/var\(([^,)]+),[^)]*\)/var(\1)/g' | \
  # 2. sementic → semantic 오타 수정 (Figma의 일반적인 오타)
  sed 's/sementic/semantic/g' | \
  # 3. fontfamily, fontweight, fontsize 경로 정규화
  sed -E 's/--fontfamily\//--font-family\//g' | \
  sed -E 's/--fontweight\//--font-weight\//g' | \
  sed -E 's/--fontsize\//--font-size\//g' | \
  # 4. 불필요한 font-family 전체 값 단순화
  sed -E "s/font-\[family-name:var\([^)]+\)\]/font-sans/g" | \
  # 5. 연속 공백을 단일 공백으로
  tr -s ' ' | \
  # 6. 연속 줄바꿈을 단일 줄바꿈으로
  cat -s | \
  # 7. 줄 앞뒤 공백 제거
  sed 's/^[[:space:]]*//;s/[[:space:]]*$//' | \
  # 8. 빈 줄 제거
  sed '/^$/d'
