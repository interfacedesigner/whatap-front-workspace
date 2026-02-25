/**
 * Management Entity Types
 * @description RBAC 권한 관리 엔티티 타입 정의
 */

// ─── Member ───────────────────────────────────────────────
export type MemberStatus = 'active' | 'inactive' | 'pending';

export interface Member {
  id: string;
  name: string;
  email: string;
  status: MemberStatus;
  createdAt: string;
  lastLoginAt: string | null;
  policyIds: string[];
}

export const MEMBER_STATUS_CONFIG: Record<MemberStatus, { label: string; className: string }> = {
  active: {
    label: 'Active',
    className: 'bg-emerald-500/10 text-emerald-700 border-emerald-200',
  },
  inactive: {
    label: 'Inactive',
    className: 'bg-gray-500/10 text-gray-600 border-gray-200',
  },
  pending: {
    label: 'Pending',
    className: 'bg-amber-500/10 text-amber-700 border-amber-200',
  },
};

// ─── Permission ───────────────────────────────────────────
export type PermissionDomain =
  | 'DASHBOARD'
  | 'LOG'
  | 'ROLE'
  | 'APM'
  | 'WORKSPACE'
  | 'SERVER'
  | 'INCIDENT'
  | 'EVENT'
  | 'POLICY'
  | 'MEMBER';

export type PermissionAction = 'READ' | 'UPDATE' | 'CREATE' | 'DELETE';

export type PermissionScope = 'workspace' | 'cross-workspace';

export interface Permission {
  id: string;
  name: string;
  domain: PermissionDomain;
  action: PermissionAction;
  scope: PermissionScope;
  description: string;
}

// ─── Role ─────────────────────────────────────────────────
export interface Role {
  id: string;
  name: string;
  description: string;
  scope: PermissionScope;
  createdAt: string;
  permissionIds: string[];
}

// ─── Policy ───────────────────────────────────────────────
export interface Policy {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  roleIds: string[];
  memberIds: string[];
}
