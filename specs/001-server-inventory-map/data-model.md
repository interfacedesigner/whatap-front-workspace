# Data Model: Server Inventory Map (MVP)

**Date**: 2026-02-02
**Feature**: 001-server-inventory-map

## Entities

### Server

개별 서버를 나타내는 핵심 엔티티.

```typescript
interface Server {
  /** 서버 고유 식별자 */
  oid: number;

  /** 호스트명 */
  hostname: string;

  /** IP 주소 */
  ip: string;

  /** 서버 상태 */
  status: ServerStatus;

  /** 운영체제 타입 */
  osType: OSType;

  /** 서버 타입 (web, db, app 등) */
  serverType: string;

  /** CPU 코어 수 */
  cores: number;

  /** 그룹화 기준 필드들 */
  defaultGroup?: string;
  OSVersion?: string;
  cloudRegion?: string;
  model?: string;
  hwSerial?: string;
  csp?: string;
  cloudInstanceType?: string;
}
```

**Validation Rules**:
- `oid`: 양수 정수, 고유해야 함
- `hostname`: 1-255자, 공백 불가
- `ip`: 유효한 IPv4 또는 IPv6 형식
- `status`: enum 값만 허용
- `cores`: 1 이상의 양수

---

### ServerStatus (Enum)

```typescript
type ServerStatus = 'ok' | 'warning' | 'critical' | 'inactive';
```

| Value | Description | UI Color |
|-------|-------------|----------|
| `ok` | 정상 상태 | Green (`bg-green-500`) |
| `warning` | 경고 상태 (warning 이벤트 있음) | Yellow (`bg-yellow-500`) |
| `critical` | 위험 상태 (critical 이벤트 있음) | Red (`bg-red-500`) |
| `inactive` | 비활성 상태 (에이전트 미응답) | Gray (`bg-gray-400`) |

---

### OSType (Enum)

```typescript
type OSType = 'Linux' | 'Windows' | 'AIX' | 'HP-UX' | 'Solaris' | 'Unknown';
```

| Value | Icon | Description |
|-------|------|-------------|
| `Linux` | 🐧 | Linux 계열 서버 |
| `Windows` | 🪟 | Windows Server |
| `AIX` | 🖥️ | IBM AIX |
| `HP-UX` | 🖥️ | HP-UX |
| `Solaris` | ☀️ | Oracle Solaris |
| `Unknown` | ❓ | 알 수 없음 |

---

### ServerGroup

그룹화된 서버 집합. 1차/2차 그룹 모두에 사용.

```typescript
interface ServerGroup {
  /** 그룹 키 (그룹화 기준 필드명) */
  key: string;

  /** 그룹명 (그룹화 기준 값) */
  name: string;

  /** 그룹 내 서버 목록 (2차 그룹이 없는 경우) */
  servers: Server[];

  /** 하위 그룹 목록 (2차 그룹화된 경우) */
  groups: ServerGroup[];

  /** 그룹 요약 정보 */
  summary: GroupSummary;
}
```

---

### GroupSummary

그룹 헤더에 표시되는 요약 정보.

```typescript
interface GroupSummary {
  /** 전체 서버 수 */
  total: number;

  /** 활성 서버 수 (inactive 제외) */
  active: number;

  /** 경고 상태 서버 수 */
  warning: number;

  /** 위험 상태 서버 수 */
  critical: number;

  /** 경고 이벤트 총 개수 */
  warningEventCount: number;

  /** 위험 이벤트 총 개수 */
  criticalEventCount: number;
}
```

---

### ProjectSummary

프로젝트 전체 요약 정보. 페이지 상단에 표시.

```typescript
interface ProjectSummary {
  /** 전체 서버 수 */
  total: number;

  /** 활성 서버 수 */
  active: number;

  /** 총 CPU 코어 수 */
  totalCore: number;

  /** OS별 서버 현황 */
  byOS: OSSummary[];
}

interface OSSummary {
  /** OS 라벨 */
  label: OSType;

  /** 해당 OS의 활성 서버 수 */
  active: number;

  /** 해당 OS의 전체 서버 수 */
  total: number;

  /** 해당 OS의 총 코어 수 */
  totalCore: number;
}
```

---

## Zod Schemas

```typescript
import { z } from 'zod';

export const ServerStatusSchema = z.enum(['ok', 'warning', 'critical', 'inactive']);

export const OSTypeSchema = z.enum(['Linux', 'Windows', 'AIX', 'HP-UX', 'Solaris', 'Unknown']);

export const ServerSchema = z.object({
  oid: z.number().int().positive(),
  hostname: z.string().min(1).max(255),
  ip: z.string().ip(),
  status: ServerStatusSchema,
  osType: OSTypeSchema,
  serverType: z.string(),
  cores: z.number().int().positive(),
  defaultGroup: z.string().optional(),
  OSVersion: z.string().optional(),
  cloudRegion: z.string().optional(),
  model: z.string().optional(),
  hwSerial: z.string().optional(),
  csp: z.string().optional(),
  cloudInstanceType: z.string().optional(),
});

export const GroupSummarySchema = z.object({
  total: z.number().int().nonnegative(),
  active: z.number().int().nonnegative(),
  warning: z.number().int().nonnegative(),
  critical: z.number().int().nonnegative(),
  warningEventCount: z.number().int().nonnegative(),
  criticalEventCount: z.number().int().nonnegative(),
});

export const ServerGroupSchema: z.ZodType<ServerGroup> = z.lazy(() =>
  z.object({
    key: z.string(),
    name: z.string(),
    servers: z.array(ServerSchema),
    groups: z.array(ServerGroupSchema),
    summary: GroupSummarySchema,
  })
);

export const OSSummarySchema = z.object({
  label: OSTypeSchema,
  active: z.number().int().nonnegative(),
  total: z.number().int().nonnegative(),
  totalCore: z.number().int().nonnegative(),
});

export const ProjectSummarySchema = z.object({
  total: z.number().int().nonnegative(),
  active: z.number().int().nonnegative(),
  totalCore: z.number().int().nonnegative(),
  byOS: z.array(OSSummarySchema),
});
```

---

## State (Jotai Atoms)

클라이언트 상태 관리를 위한 Jotai atoms.

```typescript
import { atom } from 'jotai';

/** 그룹화 옵션 타입 */
export type GroupOptionKey =
  | 'defaultGroup'
  | 'serverType'
  | 'OSType'
  | 'OSVersion'
  | 'model'
  | 'hwSerial'
  | 'csp'
  | 'cloudInstanceType'
  | 'cloudRegion';

/** 아이콘 라벨 옵션 */
export type IconLabelOption = 'hostname' | 'ip' | 'status' | null;

/** 1차 그룹화 기준 */
export const firstGroupOptionAtom = atom<GroupOptionKey | null>(null);

/** 2차 그룹화 기준 */
export const secondGroupOptionAtom = atom<GroupOptionKey | null>(null);

/** 서버 아이콘 라벨 옵션 */
export const iconLabelOptionAtom = atom<IconLabelOption>('hostname');

/** 펼쳐진 그룹 ID Set (Accordion 상태) */
export const expandedGroupsAtom = atom<Set<string>>(new Set());
```

---

## Relationships

```
ProjectSummary (1) ─────── contains ─────── (N) OSSummary
       │
       │ derived from
       ▼
  Server (N) ─────── grouped by ─────── (N) ServerGroup
       │                                      │
       │                                      │ contains
       │                                      ▼
       └──────────────────────────────── ServerGroup (nested)
                                              │
                                              │ summarized in
                                              ▼
                                         GroupSummary
```

---

## Mock Data Requirements

- **서버 수**: 50개
- **상태 분포**: ok(35), warning(8), critical(4), inactive(3)
- **OS 분포**: Linux(30), Windows(12), AIX(4), HP-UX(2), Solaris(2)
- **그룹화 테스트**:
  - serverType: web(15), db(10), app(15), batch(10)
  - cloudRegion: ap-northeast-2(30), us-west-2(10), eu-west-1(10)
