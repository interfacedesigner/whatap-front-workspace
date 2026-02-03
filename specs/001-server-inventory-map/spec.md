# Feature Specification: Server Inventory Map Migration (MVP)

**Feature Branch**: `001-server-inventory-map`
**Created**: 2026-02-02
**Status**: Draft
**Input**: User description: "do-not-touch-legacy/apps/whatap-front/src/fsd/server/2_pages/ServerInventoryMap -> apps/whatap-workspace migration"

## Overview

레거시 whatap-front 프로젝트의 ServerInventoryMap 페이지를 whatap-workspace로 마이그레이션합니다.
이 MVP 단계에서는 핵심 기능인 **서버 그리드 시각화**와 **프로젝트 요약 패널**만 구현하며,
Drawer/상세 기능은 후속 이터레이션에서 진행합니다.

### Migration 원칙

- **API**: 실제 API 구현 없음. Custom hook에서 mock 데이터만 제공
- **UI**: shadcn/ui + Tailwind CSS 4로 전면 재구현 (레거시 design-system 사용 금지)
- **상태관리**: Jotai 사용 (레거시 zustand에서 전환)
- **스타일링**: PandaCSS → Tailwind CSS 4로 전환

## User Scenarios & Testing *(mandatory)*

### User Story 1 - 서버 인벤토리 맵 조회 (Priority: P1)

운영자가 서버 모니터링 대시보드에서 전체 서버의 상태를 한눈에 파악하고자 합니다.
서버 인벤토리 맵 페이지에 접근하면 모든 서버가 그리드 형태로 시각화되어 표시되며,
각 서버의 상태(정상/경고/위험/비활성)가 색상으로 구분됩니다.

**Why this priority**: 서버 모니터링의 핵심 기능으로, 이 기능 없이는 페이지의 존재 가치가 없음

**Independent Test**: 페이지 접근 시 mock 데이터 기반의 서버 그리드가 렌더링되는지 확인

**Acceptance Scenarios**:

1. **Given** 사용자가 인증된 상태이고 workspace에 접근권한이 있을 때, **When** 서버 인벤토리 맵 페이지에 접근하면, **Then** 서버 목록이 그리드 형태로 표시된다
2. **Given** 서버 데이터가 로드된 상태에서, **When** 그리드가 렌더링되면, **Then** 각 서버의 상태에 따라 다른 색상(정상-초록, 경고-노랑, 위험-빨강, 비활성-회색)으로 표시된다
3. **Given** 서버 데이터가 없는 상태에서, **When** 페이지에 접근하면, **Then** "표시할 서버가 없습니다" 메시지가 표시된다

---

### User Story 2 - 프로젝트 요약 정보 조회 (Priority: P1)

운영자가 현재 프로젝트의 서버 현황을 요약 정보로 빠르게 파악하고자 합니다.
화면 상단에 전체 서버 수, 활성 서버 수, 코어 수가 표시되고,
OS별(Linux, Windows 등) 서버 현황이 아이콘과 함께 표시됩니다.

**Why this priority**: 서버 그리드와 함께 핵심 정보 제공, MVP의 필수 구성요소

**Independent Test**: mock 데이터 기반으로 요약 정보가 올바르게 표시되는지 확인

**Acceptance Scenarios**:

1. **Given** 프로젝트에 서버가 등록된 상태에서, **When** 페이지가 로드되면, **Then** 상단에 Total/Active/Core 정보가 표시된다
2. **Given** 프로젝트에 다양한 OS의 서버가 있을 때, **When** 요약 패널이 렌더링되면, **Then** OS별로 아이콘, Active/Total 수, Core 수가 표시된다

---

### User Story 3 - 서버 그룹화 필터링 (Priority: P2)

운영자가 많은 수의 서버를 효율적으로 관리하기 위해 특정 기준으로 그룹화하여 조회하고자 합니다.
1차/2차 그룹화 기준(서버타입, OS타입, 리전 등)을 선택하면 서버들이 해당 기준으로 묶여서 표시됩니다.

**Why this priority**: 대규모 서버 환경에서 필수적인 기능이지만, 기본 조회 후 확장 기능

**Independent Test**: 그룹화 드롭다운 선택 시 서버들이 그룹별로 재배치되는지 확인

**Acceptance Scenarios**:

1. **Given** 서버 그리드가 표시된 상태에서, **When** 1차 그룹 드롭다운에서 "serverType"을 선택하면, **Then** 서버가 서버 타입별로 그룹화되어 표시된다
2. **Given** 1차 그룹이 선택된 상태에서, **When** 2차 그룹 드롭다운에서 "OSType"을 선택하면, **Then** 각 1차 그룹 내에서 OS타입별로 서버가 하위 그룹화된다
3. **Given** 그룹화가 적용된 상태에서, **When** 1차 그룹을 "미설정"으로 변경하면, **Then** 모든 서버가 단일 그리드로 표시된다

---

### User Story 4 - 서버 아이콘 라벨 설정 (Priority: P3)

운영자가 그리드의 각 서버 아이콘에 표시되는 라벨 정보를 변경하고자 합니다.
호스트명, IP, 상태 등 원하는 정보를 라벨로 선택할 수 있습니다.

**Why this priority**: UX 개선 기능으로, 핵심 기능 이후 구현

**Independent Test**: 라벨 옵션 변경 시 서버 아이콘의 라벨 텍스트가 변경되는지 확인

**Acceptance Scenarios**:

1. **Given** 서버 그리드가 표시된 상태에서, **When** 라벨 드롭다운에서 "hostname"을 선택하면, **Then** 각 서버 아이콘 아래에 호스트명이 표시된다
2. **Given** 라벨이 "hostname"으로 설정된 상태에서, **When** "IP"로 변경하면, **Then** 서버 아이콘 아래의 텍스트가 IP 주소로 변경된다

---

### Edge Cases

- 서버 데이터가 없을 때: "표시할 서버가 없습니다" 빈 상태 UI 표시
- 그룹화 시 특정 그룹에 서버가 없을 때: 해당 그룹 패널에 "그룹 내 서버 없음" 표시
- 데이터 로딩 중: Skeleton 또는 Loading 스피너 표시
- 데이터 로딩 실패: ErrorBoundary를 통한 에러 폴백 UI 및 재시도 버튼 제공

## Requirements *(mandatory)*

### Functional Requirements

**페이지 구조**
- **FR-001**: 시스템은 `/ws/:wsid/server/inventory-map` 경로로 서버 인벤토리 맵 페이지를 제공해야 한다
- **FR-002**: 페이지는 상단 툴바, 프로젝트 요약 영역, 서버 그리드 영역으로 구성되어야 한다

**프로젝트 요약**
- **FR-003**: 시스템은 전체 서버 수(Total), 활성 서버 수(Active), 총 코어 수(Core)를 표시해야 한다
- **FR-004**: 시스템은 OS별(Linux, Windows, AIX, HP-UX 등) 서버 현황을 아이콘과 함께 표시해야 한다

**서버 그리드**
- **FR-005**: 시스템은 서버를 그리드 형태로 시각화하여 표시해야 한다 (고정 32x32px 아이콘, 반응형 그리드 열)
- **FR-006**: 각 서버는 상태(ok, warning, critical, inactive)에 따라 다른 색상으로 표시되어야 한다
- **FR-007**: 서버 아이콘에 선택된 라벨 정보(hostname, IP 등)가 표시되어야 한다
- **FR-007a**: 서버 아이콘에 마우스를 올리면 툴팁으로 hostname, IP, status 정보가 표시되어야 한다

**그룹화**
- **FR-008**: 사용자는 1차 그룹화 기준을 선택할 수 있어야 한다
- **FR-009**: 1차 그룹이 선택된 경우, 사용자는 2차 그룹화 기준을 선택할 수 있어야 한다
- **FR-010**: 그룹화 옵션에는 serverType, OSType, OSVersion, model, cloudRegion 등이 포함되어야 한다
- **FR-010a**: 그룹 패널 헤더 클릭 시 해당 그룹의 서버 목록이 접기/펼치기(Accordion) 되어야 한다
- **FR-010b**: 그룹 패널 헤더에는 그룹명, 서버 수, 상태별 카운트(ok/warning/critical)가 표시되어야 한다

**상태 관리**
- **FR-011**: 그룹화 설정, 라벨 옵션 등 UI 상태는 클라이언트 상태로 관리되어야 한다

**데이터**
- **FR-012**: 이 MVP 단계에서 모든 서버 데이터는 mock 데이터로 제공되어야 한다 (50개 서버, 다양한 상태/OS/그룹 조합 포함)

### Key Entities

- **Server**: 개별 서버를 나타냄. 주요 속성: oid, hostname, ip, status(ok/warning/critical/inactive), osType, serverType
- **ServerGroup**: 그룹화된 서버 집합. 주요 속성: name, key, servers[], summary(total, active, warning, critical)
- **ProjectSummary**: 프로젝트 전체 요약. 주요 속성: total, active, totalCore, OS별 breakdown

## Assumptions

- Mock 데이터는 실제 API 응답 구조와 동일한 형태로 구성한다
- Canvas 기반의 복잡한 서버 아이콘 시각화는 MVP에서 간소화된 형태(HTML/CSS 기반)로 대체할 수 있다
- Drawer/상세 패널 기능은 이후 별도 이터레이션에서 구현한다
- 실시간 데이터 갱신(5초 interval)은 MVP에서는 생략하고, mock 데이터의 정적 표시만 구현한다

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 사용자가 페이지에 접근하면 3초 이내에 서버 그리드가 표시된다
- **SC-002**: 50개의 mock 서버 데이터가 성능 저하 없이 렌더링된다
- **SC-003**: 모든 UI 컴포넌트에 대한 Storybook 스토리가 작성된다
- **SC-004**: 핵심 컴포넌트에 대한 단위 테스트 커버리지 80% 이상 달성
- **SC-005**: 레거시 design-system 또는 PandaCSS 의존성 없이 구현된다

## Clarifications

### Session 2026-02-02

- Q: 서버 그리드에서 각 서버 아이콘의 크기와 레이아웃은? → A: 고정 크기 (32x32px 아이콘, 반응형 그리드 열)
- Q: Mock 데이터의 서버 수와 다양성은? → A: 중간 규모 (50개 서버, 다양한 상태/OS/그룹 조합)
- Q: 그룹화된 패널에서 그룹 헤더 클릭 시 동작은? → A: 접기/펼치기 (Accordion 스타일)
- Q: 서버 아이콘 hover 시 동작은? → A: 툴팁 표시 (hostname, IP, status)
- Q: 그룹 패널 헤더에 표시할 정보는? → A: 그룹명 + 서버 수 + 상태별 카운트 (ok/warning/critical)

## Out of Scope (다음 이터레이션)

- 서버 클릭 시 상세 정보 Drawer
- 서버 그룹 클릭 시 요약 패널
- 시계열 차트 (ServerGroupSeriesChart)
- 카테고리별 바 차트 (CategoryBarChart)
- 실시간 데이터 갱신 (5초 interval)
- 필터 시스템 (CompositeFilter)
- 가이드 모달 및 기능 활성화 안내
- 실제 API 연동
