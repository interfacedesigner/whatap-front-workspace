/**
 * Server Entity Types
 * @description 서버 인벤토리 맵에서 사용하는 핵심 타입 정의
 */

// =============================================================================
// Enums & Literal Types
// =============================================================================

/** 서버 상태 */
export type ServerStatus = 'ok' | 'warning' | 'critical' | 'inactive';

/** 운영체제 타입 */
export type OSType = 'Linux' | 'Windows' | 'AIX' | 'HP-UX' | 'Solaris' | 'Unknown';

/** 그룹화 옵션 키 */
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

// =============================================================================
// Core Entities
// =============================================================================

/** 개별 서버 엔티티 */
export interface Server {
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

  /** 기본 그룹 */
  defaultGroup?: string;

  /** OS 버전 */
  OSVersion?: string;

  /** 클라우드 리전 */
  cloudRegion?: string;

  /** 하드웨어 모델 */
  model?: string;

  /** 하드웨어 시리얼 */
  hwSerial?: string;

  /** 클라우드 서비스 제공자 */
  csp?: string;

  /** 클라우드 인스턴스 타입 */
  cloudInstanceType?: string;
}

// =============================================================================
// Group Entities
// =============================================================================

/** 그룹 요약 정보 */
export interface GroupSummary {
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

/** 서버 그룹 */
export interface ServerGroup {
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

// =============================================================================
// Project Summary
// =============================================================================

/** OS별 요약 정보 */
export interface OSSummary {
  /** OS 라벨 */
  label: OSType;

  /** 해당 OS의 활성 서버 수 */
  active: number;

  /** 해당 OS의 전체 서버 수 */
  total: number;

  /** 해당 OS의 총 코어 수 */
  totalCore: number;
}

/** 프로젝트 전체 요약 정보 */
export interface ProjectSummary {
  /** 전체 서버 수 */
  total: number;

  /** 활성 서버 수 */
  active: number;

  /** 총 CPU 코어 수 */
  totalCore: number;

  /** OS별 서버 현황 */
  byOS: OSSummary[];
}

// =============================================================================
// UI Constants
// =============================================================================

/** 상태별 색상 매핑 */
export const STATUS_COLORS: Record<ServerStatus, string> = {
  ok: 'bg-green-500',
  warning: 'bg-yellow-500',
  critical: 'bg-red-500',
  inactive: 'bg-gray-400',
} as const;

/** 상태별 텍스트 색상 매핑 */
export const STATUS_TEXT_COLORS: Record<ServerStatus, string> = {
  ok: 'text-green-500',
  warning: 'text-yellow-500',
  critical: 'text-red-500',
  inactive: 'text-gray-400',
} as const;

/** 그룹화 옵션 라벨 */
export const GROUP_OPTION_LABELS: Record<GroupOptionKey, string> = {
  defaultGroup: '기본 그룹',
  serverType: '서버 타입',
  OSType: 'OS 타입',
  OSVersion: 'OS 버전',
  model: '모델',
  hwSerial: '시리얼',
  csp: 'CSP',
  cloudInstanceType: '인스턴스 타입',
  cloudRegion: '리전',
} as const;

/** 아이콘 라벨 옵션 라벨 */
export const ICON_LABEL_OPTIONS: { value: IconLabelOption; label: string }[] = [
  { value: 'hostname', label: '호스트명' },
  { value: 'ip', label: 'IP 주소' },
  { value: 'status', label: '상태' },
  { value: null, label: '없음' },
] as const;
