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
export type RoleType = 'default' | 'custom';

export interface Role {
  id: string;
  name: string;
  description: string;
  type: RoleType;
  scope: PermissionScope;
  createdAt: string;
  permissionIds: string[];
}

export const ROLE_TYPE_CONFIG: Record<RoleType, { label: string; className: string }> = {
  default: {
    label: 'Default',
    className: 'bg-gray-500/10 text-gray-600 border-gray-200',
  },
  custom: {
    label: 'Custom',
    className: 'bg-blue-500/10 text-blue-700 border-blue-200',
  },
};

export interface CreateRolePayload {
  name: string;
  description: string;
  permissionIds: string[];
}

export interface UpdateRolePayload {
  name?: string;
  description?: string;
  permissionIds?: string[];
}

export interface RoleImpact {
  linkedPoliciesCount: number;
  affectedMembersCount: number;
  linkedPolicyNames: string[];
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

// ─── Invite Member Payload ────────────────────────────────
export interface InviteMemberPayload {
  email: string;
  name?: string;
  policyIds: string[];
  welcomeMessage?: string;
}

// ─── Effective Permission ─────────────────────────────────
export interface EffectivePermission extends Permission {
  sourceRoleName: string;
  sourcePolicyName: string;
}
