---
description: 작업 내역을 바탕으로 PRD 형식의 GitHub Issue를 생성합니다
allowed-tools: Bash(*), Read(*), Glob(*), Grep(*)
argument-hint: [작업 내역 설명]
---

# GitHub Issue 생성

## 입력된 작업 내역
$ARGUMENTS

---

## 실행 단계

### 1단계: 코드베이스 분석

입력된 작업과 관련된 코드베이스를 탐색합니다:
- 관련 파일 및 컴포넌트 파악
- 기존 패턴 및 구조 확인
- 영향 범위 분석

### 2단계: PRD 작성

다음 형식으로 PRD를 작성합니다:

```markdown
## 개요
[작업의 목적과 배경]

## 목표
- [목표 1]
- [목표 2]

## 요구사항

### 기능 요구사항
- [ ] [기능 1]
- [ ] [기능 2]

### 기술 요구사항
- [ ] [기술 요구사항 1]

## 구현 범위
- **포함**: [포함 항목]
- **제외**: [제외 항목]

## 완료 조건
- [ ] [조건 1]
- [ ] [조건 2]

## 관련 파일
- `path/to/file1.ts`
- `path/to/file2.tsx`

## 참고사항
[추가 컨텍스트]
```

### 3단계: GitHub Issue 생성

```bash
gh issue create \
  --title "[제목]" \
  --body "$(cat <<'EOF'
[PRD 내용]
EOF
)"
```

### 4단계: 결과 출력

```markdown
# Issue 생성 완료

- **Issue**: #[번호]
- **URL**: [GitHub URL]
- **제목**: [제목]

## 다음 단계
`/implement-issue [번호]` 명령으로 구현을 시작하세요.
```

---

## 주의사항
- Issue 제목은 명확하고 간결하게 작성
- PRD에 구현에 필요한 모든 정보 포함
- 관련 파일 목록은 정확하게 파악
