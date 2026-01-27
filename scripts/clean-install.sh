#!/bin/bash
set -e  # 에러 발생 시 스크립트 중단

# 저장소 루트에서 실행되는지 확인
if [ ! -f "package.json" ] || [ ! -d "apps" ] || [ ! -d "packages" ]; then
  echo "❌ 이 스크립트는 저장소 루트에서 실행해야 합니다."
  exit 1
fi

# 사용자 확인
echo "⚠️  모든 node_modules, dist, .turbo 디렉토리를 삭제하고 클린 설치를 진행합니다."
read -p "계속하시겠습니까? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "취소되었습니다."
  exit 0
fi

echo "🧹 캐시 및 빌드 결과물 삭제 중..."
# 모든 캐시 및 빌드 결과물 삭제
rm -rf node_modules dist .turbo
rm -rf apps/*/node_modules apps/*/dist apps/*/.turbo
rm -rf packages/*/node_modules packages/*/dist packages/*/.turbo

echo "📦 의존성 클린 설치 중..."
pnpm install --frozen-lockfile

echo "✅ 클린 설치가 완료되었습니다!"
